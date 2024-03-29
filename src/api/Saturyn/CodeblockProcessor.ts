import GistrPlugin from 'src/main'
import { Platform } from 'obsidian'
import { parse } from 'yaml'
import { SaturynCreateIframe } from './PortalCreateIframe'
import { SaturynCreateWebapp } from './PortalCreateWebapp'
import { SaturynTemplate } from './Template'
import { SaturynParams } from './Parameters'
import { SaturynParamsHandle } from './ParametersHandle'
import WebviewTag = Electron.WebviewTag

/*
    Codeblock > Options
*/

type Options = SaturynParams &
{
    height?: string | number
}

/*
    Codeblock Processor > Codeblock
*/

export function SaturynCodeblock( plugin: GistrPlugin )
{
    plugin.registerMarkdownCodeBlockProcessor( 'saturyn', ( code, el, arg ) =>
    {
        el.addClass( 'saturyn-view' )
        const pnl = SaturynHandleSyntax( plugin, code )
        el.appendChild( pnl )
    })
}

/*
    Codeblock Processor > Syntax
*/

export function SaturynHandleSyntax( plugin: GistrPlugin, code: string ): Node
{

    const url_l1 = code.split( '\n' )[ 0 ]
    if ( url_l1.startsWith( 'http' ) )
        code = code.replace( url_l1, '' ).trim( )

    code = code.replace( /^\t+/gm, ( match ) => '  '.repeat( match.length ) )

    if ( code.length === 0 )
        return createFrame( SaturynTemplate( ), '800px' )

    let data: Partial< Options > = { }

    if ( url_l1.startsWith( 'http' ) )
    {
        data.url = url_l1
    }
    try
    {
        data = Object.assign( data, parse( code ) )
    }
    catch ( err )
    {
        return throwError( err )
    }

    if ( typeof data !== 'object' || data === null || Object.keys( data ).length === 0 )
        return throwError( )

    let height = '800px'
    if ( data.height )
    {
        height = typeof data.height === 'number' ? `${ data.height }px` : data.height
        delete data.height
    }

    let args: SaturynParams | undefined

    if ( data.title )
    {
        args = plugin.findPortal( 'title', data.title )
    }
    else if ( data.url )
    {
        args = plugin.findPortal( 'url', data.url )
    }

    if ( args )
        data = Object.assign( args, data )

    return createFrame( SaturynParamsHandle( data ), height )
}

/*
    Codeblock Processor > Throw Error
*/

function throwError( err?: Error ): Node
{
    const div           = document.createElement( 'div' )
    const msg           = 'Syntax has been updated. Use YAML format'
    const msgNode       = document.createTextNode( msg )

    div.appendChild( msgNode )

    if ( err )
    {
        const errMsg        = `\nError details: ${ err.message }`
        const errMsgNode    = document.createTextNode( errMsg )

        div.appendChild( errMsgNode )
    }

    const linkText          = '\nRead more about YAML below.'
    const linkTextNode      = document.createTextNode( linkText )
    const linkNode          = document.createElement( 'a' )
    linkNode.href           = 'https://yaml.org/spec/1.2/spec.html'
    linkNode.textContent    = 'YAML Syntax'

    div.appendChild( linkTextNode )
    div.appendChild( linkNode )

    return div
}

/*
    Codeblock Processor > Create Frame
*/

function createFrame( opts: SaturynParams, height: string ): HTMLIFrameElement | WebviewTag
{
    let frm: HTMLIFrameElement | WebviewTag

    if ( Platform.isMobileApp )
        frm = SaturynCreateIframe( opts )
    else
        frm = SaturynCreateWebapp( opts )

    frm.style.height = height

    return frm
}
