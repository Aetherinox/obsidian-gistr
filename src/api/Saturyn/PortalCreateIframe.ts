import { SaturynParams } from './Parameters'
import { GithubCSS } from 'src/api'

export const SaturynCreateIframe = ( params: Partial< SaturynParams >, onReady?: ( ) => void ): HTMLIFrameElement =>
{
    const iframe                = document.createElement( 'iframe' )
    iframe.setAttribute         ( 'allowpopups',        '' )
    iframe.setAttribute         ( 'credentialless',     'true' )
    iframe.setAttribute         ( 'crossorigin',        'anonymous' )
    iframe.setAttribute         ( 'src', params.url ??  'about:blank' )
    iframe.setAttribute         ( 'sandbox',            'allow-popups allow-forms allow-modals allow-same-origin allow-scripts allow-presentation allow-top-navigation-by-user-activation' )
    iframe.setAttribute         ( 'allow',              'encrypted-media; fullscreen; oversized-images; picture-in-picture; sync-xhr; geolocation' )
    iframe.addClass             ( 'saturyn-iframe' )

    iframe.addEventListener( 'load', ( ) =>
    {
        onReady?.call( null )

        if ( params?.css || GithubCSS )
        {
            const style         = document.createElement( 'style' )
            style.textContent   = params.css ?? GithubCSS

            iframe.contentDocument?.head.appendChild( style )
        }

        if ( params?.js )
        {
            const script        = document.createElement( 'script' )
            script.textContent  = params.js

            iframe.contentDocument?.head.appendChild( script )
        }
    })

    return iframe
}

