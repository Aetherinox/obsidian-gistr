/*
    Import
*/

import { request, RequestUrlParam  } from "obsidian"
import { Env, PID } from 'src/api'
import { GistrSettings } from 'src/settings/settings'
import { lng } from 'src/lang'
import { nanoid } from 'nanoid'

/*
    Basic Declrations
*/

const sender        = PID( )
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

export class BackendCore
{
    private readonly settings:  GistrSettings
    private manifest:           Env

    constructor( settings: GistrSettings )
    {
        this.settings   = settings
        this.manifest   = Env
    }

    /*
        Gist > Handle
    */

    private async GistHandle( el: HTMLElement, data: string )
    {
        const pattern       = /(?<protocol>https?:\/\/)?(?<host>[^/]+\/)?((?<username>[\w-]+)\/)?(?<uuid>\w+)(\#(?<filename>\w+))?(\&(?<theme>\w+))?/
        const find          = data.match( pattern ).groups
        const host          = find.host
        const username      = find.username
        const uuid          = find.uuid
        const file          = find.filename
        const theme         = find.theme

        const asd        = PID( )

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
        let og_ThemeOV = ( theme !== undefined  ) ? theme : ""

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
                    sender:         '${ sender }',
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

        const gid               = `${ sender }-${ uuid }-${ nanoid( ) }`
        const ct_iframe         = document.createElement( 'iframe' )
        ct_iframe.id            = gid
    
        ct_iframe.classList.add ( `${ sender }-container` )
        ct_iframe.setAttribute  ( 'sandbox',    'allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation' )
        ct_iframe.setAttribute  ( 'loading',    'lazy' )
        ct_iframe.setAttribute  ( 'width',      '100%' )

        /*
            https://fonts.googleapis.com

            policy directive error if certain attributes arent used. doesnt affect the plugin, but erors are bad
        */

        ct_iframe.setAttribute  ( 'csp', "default-src * data: blob: 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';" )
        // ct_iframe.setAttribute  ( 'csp', "default-src * self 'unsafe-inline'; font-src 'self' *fonts.gstatic.com/; style-src-elem 'self' *fonts.googleapis.com *demo.opengist.io/ *thomice.li 'unsafe-inline'; script-src * 'self' 'unsafe-eval' 'unsafe-inline'; object-src * 'self'; img-src * self 'unsafe-inline'; connect-src self * 'unsafe-inline'; frame-src * self 'unsafe-inline';" )

        /*
            assign css, body, js
        */

        let css_theme_ovr           = ( theme !== "" ) ? theme.toLowerCase( ) : ""
        let css_theme_sel           = ( css_theme_ovr !== "" ) ? css_theme_ovr : ( this.settings.theme == "Dark" ) ? "dark" : ( this.settings.theme == "Light" ) ? "light"  : "light"
        let css_og                  = ""
        let css_gh                  = ""

        const content_css           = await this.GetCSS( el, uuid, ( bGithub ? json.stylesheet: json.embed.css ) )
        const content_body          = ( bGithub ? json.div : "" )
        const content_js            = ( bGithub ? "" : await this.GetJavascript( el, uuid, ( css_theme_sel == "dark" ? json.embed.js_dark : json.embed.js ) ) )
    
        /*
            CSS Overrides > Github
        */

        const css_gh_bg_color       = ( css_theme_sel == "dark" ? this.settings.gh_clr_bg_dark : this.settings.gh_clr_bg_light )
        const css_gh_sb_color       = ( css_theme_sel == "dark" ? this.settings.gh_clr_sb_dark : this.settings.gh_clr_sb_light )
        const css_gh_bg_header_bg   = ( css_theme_sel == "dark" ? "rgb( 35 36 41/var( --tw-bg-opacity ) )" : "rgb( 238 239 241/var( --tw-bg-opacity ) )" )
        const css_gh_bg_header_bor  = ( css_theme_sel == "dark" ? "1px solid rgb( 54 56 64/var( --tw-border-opacity ) )" : "rgb( 222 223 227/var( --tw-border-opacity ) )" )
        const css_gh_tx_color       = ( css_theme_sel == "dark" ? this.settings.gh_clr_tx_dark : this.settings.gh_clr_tx_light )

        /*
            Declare custom css override
        */

        const css_override          = ( ( bGithub && this.settings.css_gh && this.settings.css_gh.length > 0 ) ? ( this.settings.css_gh ) : ( this.settings.css_og && this.settings.css_og.length > 0 && this.settings.css_og ) ) || ""

        /*
            OpenGist specific CSS

            @note       : these are edits the user should not need to edit.
                          OpenGist needs these edits in order to look right with the header
                          and footer.

                          obviously this condition doesn't matter even if it is injected into Github pastes,
                          but it would be usless code.

                          working with OpenGist developer to re-do the HTML generated when embedding a gist.
        */

        const css_og_append         = this.CSS_Get_OpenGist( css_theme_sel )
        const css_gh_append         = this.CSS_Load_Github( css_theme_sel )

        /*
            Github > Dark Theme
        */
    
        if ( bGithub === false )
            css_og = css_og_append
        else
            css_gh = css_gh_append

        /*
            generate html output
        */

        const html_output =
        `
        <html>
            <head>
                <style>
                    html, body { height: 100%; margin: 0; padding: 0; }
                </style>

                ${ this.EventListener( gid ) }

                <style>
                    ${ content_css }
                </style>

                <! –– Injected CSS ––>
                <style>
                ${ css_override }
                ${ css_og }
                ${ css_gh }
                </style>

                <script>
                    ${ content_js }
                </script>

            </head>

            <body>
                ${ content_body }
            </body>
        </html>
        `

        ct_iframe.srcdoc = html_output
        el.appendChild( ct_iframe )
    }

    /*
        Theme > OpenGist
    */

    private CSS_Get_OpenGist( theme: string )
    {

        const css_og_bg_color       = ( theme == "dark" ? this.settings.og_clr_bg_dark : this.settings.og_clr_bg_light )
        const css_og_sb_color       = ( theme == "dark" ? this.settings.og_clr_sb_dark : this.settings.og_clr_sb_light )
        const css_og_bg_header_bg   = ( theme == "dark" ? "rgb( 35 36 41/var( --tw-bg-opacity ) )" : "rgb( 238 239 241/var( --tw-bg-opacity ) )" )
        const css_og_bg_header_bor  = ( theme == "dark" ? "1px solid rgb( 54 56 64/var( --tw-border-opacity ) )" : "rgb( 222 223 227/var( --tw-border-opacity ) )" )
        const css_og_tx_color       = ( theme == "dark" ? this.settings.og_clr_tx_dark : this.settings.og_clr_tx_light )
        const css_og_wrap           = ( this.settings.textwrap == "Enabled" ? "normal" : "pre" )
        const css_og_opacity        = ( this.settings.og_opacity ) || 1

        return `
        ::-webkit-scrollbar
        {
            width:              6px;
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
            background-color:   ${css_og_sb_color};
        }

        .opengist-embed .code
        {
            padding-top:        ${this.settings.blk_pad_t}px;
            padding-bottom:     ${this.settings.blk_pad_b}px;
            border-top:         ${css_og_bg_header_bor};
            background-color:   ${css_og_bg_color};
            width:              fit-content;
            margin-top:         -1px;
        }

        .opengist-embed .mb-4
        {
            margin-bottom:      1rem;
            backdrop-filter:    opacity(0);
            --tw-bg-opacity:    1;
            background-color:   ${css_og_bg_header_bg};
            opacity:            ${css_og_opacity};
        }

        .opengist-embed .line-code
        {
            color:              ${css_og_tx_color};
        }

        .opengist-embed .code .line-num
        {
            color:              ${css_og_tx_color};
            opacity:            0.5;
        }

        .opengist-embed .code .line-num:hover
        {
            color:              ${css_og_tx_color};
            opacity:            1;
        }

        .opengist-embed .whitespace-pre
        {
            white-space:        ${css_og_wrap};
        }
        `
    }

    /*
        Theme > Github
    */

    private CSS_Load_Github( theme: string = 'light' )
    {
        const css_gh_bg_color       = ( theme == "dark" ? this.settings.gh_clr_bg_dark : this.settings.gh_clr_bg_light )
        const css_gh_sb_color       = ( theme == "dark" ? this.settings.gh_clr_sb_dark : this.settings.gh_clr_sb_light )
        const css_gh_bg_header_bg   = ( theme == "dark" ? "rgb( 35 36 41/var( --tw-bg-opacity ) )" : "rgb( 238 239 241/var( --tw-bg-opacity ) )" )
        const css_gh_bg_header_bor  = ( theme == "dark" ? "1px solid rgb( 54 56 64/var( --tw-border-opacity ) )" : "rgb( 222 223 227/var( --tw-border-opacity ) )" )
        const css_gh_tx_color       = ( theme == "dark" ? this.settings.gh_clr_tx_dark : this.settings.gh_clr_tx_light )
        const css_gh_wrap           = ( this.settings.textwrap == "Enabled" ? "wrap" : "nowrap" )
        const css_gh_opacity        = ( this.settings.gh_opacity ) || 1

        return `
        ::-webkit-scrollbar
        {
            width:                  6px;
            height:                 10px;
        }
        
        ::-webkit-scrollbar-track
        {
            background-color:       transparent;
            border-radius:          5px;
            margin:                 1px;
        }
        
        ::-webkit-scrollbar-thumb
        {
            border-radius:          10px;
            background-color:       ${css_gh_sb_color};
        }

        body
        {
            --tw-bg-opacity:        1;
            --tw-border-opacity:    1;
        }

        body .gist .gist-file
        {
            backdrop-filter:        opacity( 0 );
            background-color:       rgb( 35 36 41/var( --tw-bg-opacity ) );
            border:                 2px solid rgba( 255, 255, 255, 0.1 );
            opacity:                ${css_gh_opacity};
        }

        body .gist .gist-data
        {
            padding-left:           12px;
            padding-right:          12px;
            padding-top:            15px;
            padding-bottom:         6px;
            border-color:           ${css_gh_bg_header_bor};
            background-color:       ${css_gh_bg_color};
        }

        .gist .markdown-body>*:last-child
        {
            margin-bottom: 0 !important;
            padding-bottom: 5px;
        }

        body .gist .markdown-body
        {
            color:                  ${css_gh_tx_color};
            line-height:            18.2px;
            font-size:              0.8em;
            border-spacing:         0;
            border-collapse:        collapse;
            font-family:            Menlo,Consolas,Liberation Mono,monospace;
        }

        body .gist .gist-meta
        {
            color:                  #6b869f;
            border-top:             ${css_gh_bg_header_bor};
            background-color:       ${css_gh_bg_header_bg};
            padding-left:           22px;
            padding-right:          16px;
            padding-top:            8px;
            padding-bottom:         8px;
        }

        body .gist .gist-meta a
        {
            color:                  rgb( 186 188 197/var( --tw-text-opacity ) );
            opacity:                0.9;
        }

        body .gist .gist-meta a.Link--inTextBlock:hover
        {
            color:                  ${css_gh_tx_color};
            opacity:                0.5;
        }

        body .gist .gist-meta a.Link--inTextBlock
        {
            padding-left:           0px;
            padding-right:          7px;
            color:                  ${css_gh_tx_color};
        }

        body .gist .gist-meta > a:nth-child( 3 )
        {
            padding-left:           5px;
        }

        body .gist .gist-data .pl-s .pl-s1
        {
            color:                  #a5c261
        }

        body .gist .highlight
        {
            background:             transparent;
        }
        
        body .gist .blob-wrapper
        {
            padding-bottom:         6px !important;
        }

        body .gist .pl-s2, body .gist .pl-stj, body .gist .pl-vo,
        body .gist .pl-id, body .gist .pl-ii
        {
            color:                  ${css_gh_tx_color};
        }

        body .gist .blob-code
        {
            color:                  ${css_gh_tx_color};  
        }

        body .gist .blob-num, body .gist .blob-code-inner,
        {
            color:                  ${css_gh_tx_color};
            opacity:                0.5;
        }

        body .gist .blob-num:hover
        {
            color:                  ${css_gh_tx_color};
            opacity:                1;
        }

        body .gist .blob-wrapper tr:first-child td
        {
            text-wrap:              ${css_gh_wrap};
        }

        body .gist .pl-enti, body .gist .pl-mb, body .gist .pl-pdb
        {
            font-weight:            700;
        }

        body .gist .pl-c, body .gist .pl-c span, body .gist .pl-pdc
        {
            color:                 #bc9458;
            font-style:            italic;
        }

        body .gist .pl-c1, body .gist .pl-pdc1, body .gist .pl-scp
        {
            color:                 #6c99bb;
        }

        body .gist .pl-ent, body .gist .pl-eoa, body .gist .pl-eoai, body .gist .pl-eoai .pl-pde,
        body .gist .pl-ko, body .gist .pl-kolp, body .gist .pl-mc, body .gist .pl-mr, body .gist .pl-ms,
        body .gist .pl-s3, body .gist .pl-sok
        {
            color:                 #ffe5bb;
        }

        body .gist .pl-mdh, body .gist .pl-mdi, body .gist .pl-mdr
        {
            font-weight:           400;
        }
        
        body .gist .pl-mi, body .gist .pl-pdi
        {
            color:                 #ffe5bb;
            font-style:            italic;
        }

        body .gist .pl-sra,
        body .gist .pl-src,
        body .gist .pl-sre
        {
            color:                 #cc3;
        }

        body .gist .pl-mdht, body .gist .pl-mi1
        {
            color:                 #a5c261;
            background:            #121315;
        }

        body .gist .pl-md, body .gist .pl-mdhf
        {
            color:                 #b83426;
            background:            #121315;
        }

        body .gist .pl-ib, body .gist .pl-id,
        body .gist .pl-ii, body .gist .pl-iu
        {
            background:            #121315;
        }

        body .gist .pl-ms1
        {
            background:            #121315;
        }

        body .gist .highlight-text-html-basic .pl-ent,
        body .gist .pl-cce, body .gist .pl-cn, body .gist .pl-coc, body .gist .pl-enc,
        body .gist .pl-ens, body .gist .pl-k, body .gist .pl-kos, body .gist .pl-kou,
        body .gist .pl-mh .pl-pdh, body .gist .pl-mp, body .gist .pl-mp .pl-s3,
        body .gist .pl-mp1 .pl-sf, body .gist .pl-mq, body .gist .pl-mri,
        body .gist .pl-pde, body .gist .pl-pse, body .gist .pl-pse .pl-s2,
        body .gist .pl-s, body .gist .pl-st, body .gist .pl-stp, body .gist .pl-sv,
        body .gist .pl-v, body .gist .pl-va, body .gist .pl-vi, body .gist .pl-vpf,
        body .gist .pl-vpu, body .gist .pl-mdr
        {
                color: #cc7833;
        }

        body .gist .pl-cos, body .gist .pl-ml, body .gist .pl-pds,
        body .gist .pl-s1, body .gist .pl-sol, body .gist .pl-mb,
        body .gist .pl-pdb
        {
                color: #a5c261;
        }
        
        body .gist .pl-e, body .gist .pl-en, body .gist .pl-entl,
        body .gist .pl-mo, body .gist .pl-sc, body .gist .pl-sf,
        body .gist .pl-smi, body .gist .pl-smp, body .gist .pl-mdh,
        body .gist .pl-mdi
        {
                color: #ffc66d;
        }

        body .gist .pl-ef, body .gist .pl-enf, body .gist .pl-enm, body .gist .pl-entc,
        body .gist .pl-entm, body .gist .pl-eoac, body .gist .pl-eoac .pl-pde, body .gist .pl-eoi,
        body .gist .pl-mai .pl-sf, body .gist .pl-mm, body .gist .pl-pdv, body .gist .pl-smc,
        body .gist .pl-som, body .gist .pl-sr, body .gist .pl-enti
        {
                color: #b83426;
        }
        `
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
        if ( evn.data.sender !== sender ) return

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