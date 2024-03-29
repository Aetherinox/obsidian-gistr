import { GithubCSS, PortalClass, PortalURLDefault } from 'src/api'
import { SaturynParams } from './Parameters'
import WebviewTag = Electron.WebviewTag

export const SaturynCreateWebapp = ( params: Partial< SaturynParams >, onReady?: ( ) => void ): WebviewTag =>
{
    const viewer            = document.createElement( 'webview' ) as unknown as WebviewTag
    viewer.setAttribute     ( 'partition',          'persist:' + params.profileKey )
    viewer.setAttribute     ( 'src',                params.url ?? PortalURLDefault )
    viewer.setAttribute     ( 'httpreferrer',       params.url ?? PortalURLDefault )
    viewer.setAttribute     ( 'crossorigin',        'anonymous')
    viewer.setAttribute     ( 'disablewebsecurity', 'true' )
    viewer.setAttribute     ( 'allowpopups',        'true' )
    viewer.addClass         ( PortalClass )

    if ( params.userAgent && params.userAgent !== '' )
        viewer.setAttribute( 'useragent', params.userAgent )

    viewer.addEventListener( 'dom-ready', async ( ) =>
    {
        if ( params.zoom )
            viewer.setZoomFactor( params.zoom )

        if ( params?.css || GithubCSS )
            await viewer.insertCSS( params.css ?? GithubCSS )

        if ( params?.js )
            await viewer.executeJavaScript( params.js )

        onReady?.call( null )
    } )

    return viewer
}