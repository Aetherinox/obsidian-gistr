import { Plugin } from 'obsidian'
import { SaturynPortalInitialize } from './PortalInitialize'
import { SaturynParams } from './Parameters'

export const SaturynRegister = ( plugin: Plugin, options: SaturynParams ) =>
{
    plugin.registerView( options.id, ( leaf ) =>
    {
        return new SaturynPortalInitialize( leaf, options )
    } )
}