import { SaturynParams } from './Parameters'
import { PortalSVG } from 'src/api'

export const SaturynParamsHandle = ( portal: Partial< SaturynParams > ): SaturynParams =>
{
    if ( portal.url === '' || portal.url === undefined )
    {
        throw new Error( 'URL is required' )
    }

    if ( portal.id === '' || portal.id === undefined )
    {
        let key_id = portal.url!
        if ( portal.profileKey != undefined && portal.profileKey !== 'saturyn' && portal.profileKey !== '' )
        {
            key_id += portal.profileKey
        }

        portal.id = btoa( key_id )
    }

    if ( portal.profileKey === '' || portal.profileKey === undefined )
    {
        portal.profileKey = 'saturyn'
    }

    if ( portal.zoom === 0 || portal.zoom === undefined )
    {
        portal.zoom = 1
    }

    if ( portal.icon === '' || portal.icon === undefined )
    {
        portal.icon = portal.url?.startsWith( 'http' ) ? PortalSVG( portal.url ) : 'globe'
    }

    if ( portal.title === '' || portal.title === undefined )
    {
        portal.title = portal.url
    }

    return <SaturynParams>portal
}