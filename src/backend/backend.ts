/*
    Import
*/

import { request, App, RequestUrlParam  } from "obsidian";
import GistrSettings from 'src/settings/settings';
import { lng, PluginID } from 'src/lang/helpers';
import { nanoid } from 'nanoid';

/*
    Basic Declrations
*/

const PID           = PluginID( )
const AppBase       = 'app://obsidian.md'

/*
    Declare Json
*/

export interface ItemJSON
{
    embed:
    {
        [ key: string ]: string
    },
    files:
    {
        [ key: string ]: string
    },
    description:    string,
    created_at:     string,
    id:             string,
    owner:          string,
    title:          string,
    uuid:           string,
    visibility:     string,
    stylesheet:     string
    div:            string,
}

/*
    Gistr Backend
*/

class GistrBackend
{
    settings: GistrSettings

    constructor( settings: GistrSettings )
    {
        this.settings   = settings
    }

    /*
        Gist > Handle
    */

    private async GistHandle( el: HTMLElement, data: string )
    {
        const pattern       = /(?<protocol>https?:\/\/)?(?<host>[^/]+\/)?((?<username>[\w-]+)\/)?(?<uuid>\w+)(\#(?<filename>.+))?/
        const match         = data.match( pattern ).groups
        const host          = match.host
        const username      = match.username
        const uuid          = match.uuid
        const file          = match.filename

        /*
            Since opengist can really be any website, check for matching github links
        */

        const bMatchGithub  = /((https?:\/\/)?(.+?\.)?github\.com(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/g.test( host );

        /*
            No UUID match
        */

        if ( typeof uuid === undefined )
            return this.ThrowError( el, data, `Could not find gist id -- Make sure correct URL is specified. ( ${host} )` )

        /*
            compile url to gist
        */

        let gistSrcURL = ( file !== undefined ? `https://${host}${username}/${uuid}.json?file=${file}` : `https://${host}${username}/${uuid}.json` )

        const reqUrlParams: RequestUrlParam = { url: gistSrcURL, method: "GET", headers: { "Accept": "application/json" } }
        try
        {
            const req           = await request( reqUrlParams )
            const json          = JSON.parse( req ) as ItemJSON

            return this.GistGenerate( el, host, uuid, json, bMatchGithub )
        }
        catch ( err )
        {
            return this.ThrowError( el, data, `Invalid gist url ${gistSrcURL} ( Error: ${err} )` )
        }
    }

    /*
        Gist > Generate

        create new iframe for each gist, assign it a uid, set the needed attributes, and generate the css, js
    */

    private EventListener( uuid: string ): string
    {
        return `
        <script>
            window.addEventListener( 'load', ( ) =>
            {
                window.top.postMessage(
                {
                    sender:         '${PID}',
                    gid:            '${uuid}',
                    scrollHeight:   document.body.scrollHeight
                }, '${AppBase}');
            } )
        </script>
        `
    }

    /*
        Gist > Generate

        create new iframe for each gist, assign it a uid, set the needed attributes, and generate the css, js
    */

    private async GistGenerate( el: HTMLElement, host: string, uuid: string, json: ItemJSON, bGithub: boolean )
    {

        /*
            create uuid and iframe
        */

        const gid               = `${PID}-${uuid}-${nanoid( )}`
        const ct_iframe         = document.createElement( 'iframe' );
        ct_iframe.id            = gid
    
        ct_iframe.classList.add ( `${PID}-container` )
        ct_iframe.setAttribute  ( 'sandbox',    'allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation' )
        ct_iframe.setAttribute  ( 'loading',    'lazy' )
        ct_iframe.setAttribute  ( 'width',      '100%' );

        /*
            https://fonts.googleapis.com

            policy directive error if certain attributes arent used. doesnt affect the plugin, but erors are bad
        */

        ct_iframe.setAttribute  ( 'csp', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' ${host} ;" )

        /*
            define parent
        */

        const ct_Parent         = document.createElement( 'base' )
        ct_Parent.target        = "_parent"

        /*
            assign css, body, js
        */

        const content_css       = await this.GetCSS( el, uuid, ( bGithub ? json.stylesheet: json.embed.css ) )
        const content_body      = ( bGithub ? json.div : "" )
        const content_js        = ( bGithub ? "" : await this.GetJavascript( el, uuid, ( this.settings.theme == "Dark" ? json.embed.js_dark : json.embed.js ) ) )
        let css_bg_color        = ( this.settings.theme == "Dark" ? this.settings.og_clr_bg_dark : this.settings.og_clr_bg_light )

        /*
            Declare custom css override
        */

        let css_override        = ( ( bGithub && this.settings.css_gh && this.settings.css_gh.length > 0 ) ? ( this.settings.css_gh ) : ( this.settings.css_og && this.settings.css_og.length > 0 && this.settings.css_og ) ) || ""

        /*
            Create Iframe
        */

        ct_iframe.srcdoc =
        `
        <html>
            <head>
                <style>
                    html, body { height: 100%; margin: 0; padding: 0; }
                </style>

                ${ct_Parent.outerHTML}
                ${this.EventListener( gid )}

                <!-- Gistr: css embedded json src -->
                <style>
                    ${content_css}
                </style>

                <!-- Gistr: css override -->
                <style>
                    ${css_override}

                    .opengist-embed .code
                    {
                        padding-top:        ${this.settings.blk_pad_t}px;
                        padding-bottom:     ${this.settings.blk_pad_b}px;
                        background-color:   #${css_bg_color} !important;
                    }

                    .opengist-embed .html
                    {
                        background-color: #${css_bg_color} !important;
                    }

                </style>

                <script>
                    ${content_js}
                </script>

            </head>

            <body>
                ${content_body}
            </body>
        </html>
        `
        el.appendChild( ct_iframe )
    }

    /*
        Throw Error
    */

    private async ThrowError( el: HTMLElement, gistInfo: String, err: String = '' )
    {
        el.createEl( 'div',     { text: "⚠️ Gistr: Failed to load gist:", attr: { style: 'color: #de1f73; font-weight: bold;' } } )
        el.createEl( 'div',     { text: "" + gistInfo, attr: { style: 'padding-bottom: 5px; padding-left: 20px' } } )
        el.createEl( 'small',   { text: "Error: " + err } )
    }

    /*
        Get Javascript
    */

    private async GetJavascript( el: HTMLElement, data: String, url: string )
    {
        const reqUrlParams: RequestUrlParam = { url: url, method: "GET", headers: { "Accept": "text/javascript" } }
        try { return await request( reqUrlParams ); }
        catch ( err )
        {
            return this.ThrowError( el, data, `Could not load a valid Javascript from gist url. ( ${err} )` )
        }
    }

    /*
        Get CSS
    */

    private async GetCSS( el: HTMLElement, data: String, url: string )
    {
        const reqUrlParams: RequestUrlParam = { url: url, method: "GET", headers: { "Accept": "text/css" } }
        try { return await request( reqUrlParams ) }
        catch ( err )
        {
            return this.ThrowError( el, data, `Could not load a valid Stylesheet from gist url. ( ${err} )` )
        }
    }
    
    /*
        Collect message data from JS_EventListener
    */

    messageEventHandler = ( evn: MessageEvent ) =>
    {
        if ( evn.origin !== 'null' ) return;
        if ( evn.data.sender !== PID ) return;

        const uuid                          = evn.data.gid
        const scrollHeight                  = evn.data.scrollHeight
        const gist_Container: HTMLElement   = document.querySelector( 'iframe#' + uuid )

        gist_Container.setAttribute( 'height', scrollHeight )
    }

    /*
        Event processor
    */

    processor = async ( src: string, el: HTMLElement ) =>
    {
        const obj = src.trim( ).split( "\n" )
        
        return Promise.all
        (
            obj.map( async ( gist ) =>
            {
                return this.GistHandle( el, gist )
            } )
        )
    };
    

}

export { GistrBackend }