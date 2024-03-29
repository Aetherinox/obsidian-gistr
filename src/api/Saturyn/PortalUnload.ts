import { Workspace } from 'obsidian'
import { SaturynParams } from './Parameters'

export const SaturynUnload = async ( workspace: Workspace, portal: SaturynParams ): Promise< void > =>
{
    workspace.detachLeavesOfType( portal.id )
    
    const ribbonIcons = workspace.containerEl.querySelector( `div[aria-label="${ portal.title }"]` )

    if ( ribbonIcons )
        ribbonIcons.remove( )
}
