/*
    Import
*/

import { request, App, RequestUrlParam  } from "obsidian"
import GistrSettings from 'src/settings/settings'
import { lng, PluginID } from 'src/lang/helpers'
import { nanoid } from 'nanoid'

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

export class GistrBackend
{
    private readonly settings: GistrSettings

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
        const find          = data.match( pattern ).groups
        const host          = find.host
        const username      = find.username
        const uuid          = find.uuid
        const file          = find.filename

        /*
            Since opengist can really be any website, check for matching github links
        */

        const bMatchGithub  = /((https?:\/\/)?(.+?\.)?github\.com(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/g.test( host )

        /*
            No UUID match
        */

        if ( typeof uuid === undefined )
            return this.ThrowError( el, data, lng( "err_gist_loading_fail_url", host ) )

        /*
            compile url to gist
        */

        let gistSrcURL = ( file !== undefined ? `https://${host}${username}/${uuid}.json?file=${file}` : `https://${host}${username}/${uuid}.json` )
        let og_ThemeOV = ( bMatchGithub == false && file !== undefined  ) ? file : ""

        const reqUrlParams: RequestUrlParam = { url: gistSrcURL, method: "GET", headers: { "Accept": "application/json" } }
        try
        {
            const req           = await request( reqUrlParams )
            const json          = JSON.parse( req ) as ItemJSON

            return this.GistGenerate( el, host, uuid, json, bMatchGithub, og_ThemeOV )
        }
        catch ( err )
        {
            return this.ThrowError( el, data, `Invalid gist url ${gistSrcURL} ( ${err} )` )
        }
    }

    /*
        Gist > Generate

        create new iframe for each gist, assign it a uid, set the needed attributes, and generate the css, js
    */

    private EventListener( uuid: string ) : string
    {
        return `
        <script>
            window.addEventListener( 'load', ( ) =>
            {
                window.top.postMessage(
                {
                    sender:         '${ PID }',
                    gid:            '${ uuid }',
                    scrollHeight:   document.body.scrollHeight
                }, '${ AppBase }')
            } )
        </script>
        `
    }

    /*
        Gist > Generate

        create new iframe for each gist, assign it a uid, set the needed attributes, and generate the css, js
    */

    private async GistGenerate( el: HTMLElement, host: string, uuid: string, json: ItemJSON, bGithub: boolean, theme: string )
    {

        /*
            create uuid and iframe
        */

        const gid               = `${ PID }-${ uuid }-${ nanoid( ) }`
        const ct_iframe         = document.createElement( 'iframe' )
        ct_iframe.id            = gid
    
        ct_iframe.classList.add ( `${ PID }-container` )

        if ( bGithub === true )
            ct_iframe.classList.add ( `full-dark-gist` )

        ct_iframe.setAttribute  ( 'sandbox',    'allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation' )
        ct_iframe.setAttribute  ( 'loading',    'lazy' )
        ct_iframe.setAttribute  ( 'width',      '100%' )

        /*
            https://fonts.googleapis.com

            policy directive error if certain attributes arent used. doesnt affect the plugin, but erors are bad
        */

        ct_iframe.setAttribute  ( 'csp', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' ${host} ;" )

        /*
            assign css, body, js
        */

        let css_theme_ovr           = ( theme !== "" ) ? theme.toLowerCase( ) : ""
        let css_theme_sel           =   ( css_theme_ovr !== "" ) ? css_theme_ovr : ( this.settings.theme == "Dark" ) ? "dark" : ( this.settings.theme == "Light" ) ? "light"  : "light"
        let css_og                  = ""

        const content_css           = await this.GetCSS( el, uuid, ( bGithub ? json.stylesheet: json.embed.css ) )
        const content_body          = ( bGithub ? json.div : "" )
        const content_js            = ( bGithub ? "" : await this.GetJavascript( el, uuid, ( css_theme_sel == "dark" ? json.embed.js_dark : json.embed.js ) ) )
        const css_bg_color          = ( css_theme_sel == "dark" ? this.settings.og_clr_bg_dark : this.settings.og_clr_bg_light )
        const css_sb_color          = ( css_theme_sel == "dark" ? this.settings.og_clr_sb_dark : this.settings.og_clr_sb_light )
        const css_bg_og_header_bg   = ( css_theme_sel == "dark" ? "rgb(35 36 41/var(--tw-bg-opacity))" : "rgb(238 239 241/var(--tw-bg-opacity))" )
        const css_bg_og_header_bor  = ( css_theme_sel == "dark" ? "1px solid rgb(54 56 64/var(--tw-border-opacity))" : "rgb(222 223 227/var(--tw-border-opacity))" )

        /*
            Declare custom css override
        */

        const css_override      = ( ( bGithub && this.settings.css_gh && this.settings.css_gh.length > 0 ) ? ( this.settings.css_gh ) : ( this.settings.css_og && this.settings.css_og.length > 0 && this.settings.css_og ) ) || ""

        /*
            OpenGist specific CSS

            @note       : these are edits the user should not need to edit.
                          OpenGist needs these edits in order to look right with the header
                          and footer.

                          obviously this condition doesn't matter even if it is injected into Github pastes,
                          but it would be usless code.

                          working with OpenGist developer to re-do the HTML generated when embedding a gist.
        */

        const css_og_append =
        `

        ::-webkit-scrollbar
        {
            width:              6px;
            height:             10px;
        }

        .opengist-embed .code
        {
            padding-top:        ${this.settings.blk_pad_t}px;
            padding-bottom:     ${this.settings.blk_pad_b}px;
            border-top:         ${css_bg_og_header_bor};
            background-color:   ${css_bg_color};
            width:              fit-content;
            margin-top:         -1px;
        }

        .opengist-embed .whitespace-pre
        {
            text-wrap:          wrap;
        }
        
        .opengist-embed .mb-4
        {
            margin-bottom:      1rem;
            backdrop-filter:    opacity(0);
            --tw-bg-opacity:    1;
            background-color:   ${css_bg_og_header_bg};
        }
        </style>
        `

        if ( bGithub === false )
            css_og = css_og_append

        /*
            generate html output
        */

        const html_output =
        `
        <html>
            <head>
                <style>
                    html, body { height: 100%; margin: 0; padding: 0; }
                    ::-webkit-scrollbar
                    {
                        height:             10px;
                    }
                    
                    ::-webkit-scrollbar-track
                    {
                        background-color:   transparent;
                        border-radius:      5px;
                        margin:             1px;
                    }
                    
                    ::-webkit-scrollbar-thumb
                    {
                        border-radius:      10px;
                        background-color:   ${css_sb_color};
                    }
                </style>

                ${this.EventListener( gid )}

                <style>
                    ${content_css}
                </style>

                <! –– Injected CSS ––>
                <style>
                ${css_override}
                ${css_og}
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

        ct_iframe.srcdoc = html_output
        el.appendChild( ct_iframe )
    }

    /*
        Throw Error
    */

    private async ThrowError( el: HTMLElement, gistInfo: string, err: string = '' )
    {
        const div_Error = el.createEl( 'div',   { text: "", cls: 'gistr-container-error' } )
        div_Error.createEl( 'div',              { text: lng( "err_gist_loading_fail_name" ), cls: 'gistr-load-error-l1' } )
        div_Error.createEl( 'div',              { text: gistInfo, cls: "gistr-load-error-l2" } )
        div_Error.createEl( 'small',            { text: lng( "err_gist_loading_fail_resp", err ) } )
    }

    /*
        Get Javascript
    */

    private async GetJavascript( el: HTMLElement, data: string, url: string )
    {
        const reqUrlParams: RequestUrlParam = { url: url, method: "GET", headers: { "Accept": "text/javascript" } }
        try { return await request( reqUrlParams ) }
        catch ( err )
        {
            return this.ThrowError( el, data, lng( "err_gist_loading_fail_detail", err ) )
        }
    }

    /*
        Get CSS
    */

    private async GetCSS( el: HTMLElement, data: string, url: string )
    {
        const reqUrlParams: RequestUrlParam = { url : url, method: "GET", headers: { "Accept": "text/css" } }
        try { return await request( reqUrlParams ) }
        catch ( err )
        {
            return this.ThrowError( el, data, lng( "err_gist_loading_fail_detail", err ) )
        }
    }
    
    /*
        Collect message data from JS_EventListener
    */

    messageEventHandler = ( evn: MessageEvent ) =>
    {
        if ( evn.origin !== 'null' ) return
        if ( evn.data.sender !== PID ) return

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
    }
}