import { Workspace, WorkspaceLeaf } from 'obsidian'
import { SaturynParamsType } from './Parameters'

export const SaturynOpen = async ( workspace: Workspace, id: string, dock?: SaturynParamsType ): Promise< WorkspaceLeaf > =>
{
    let leaf:   WorkspaceLeaf
    let leafs   = workspace.getLeavesOfType( id )

    if ( leafs.length > 0 )
    {
        workspace.revealLeaf( leafs[ 0 ] )
        return leafs[ 0 ]
    }

    leaf = await createView( workspace, id, dock )
    workspace.revealLeaf( leaf )

    return leaf
}

export const SaturynIsOpen = ( workspace: Workspace, id: string ): boolean =>
{
    let leafs = workspace.getLeavesOfType( id )
    return leafs.length > 0
}

const createView = async ( workspace: Workspace, id: string, dock?: SaturynParamsType ) =>
{
    let leaf: WorkspaceLeaf | undefined
    switch ( dock )
    {
        case 'left':
            leaf = workspace.getLeftLeaf( false )
            break

        case 'center':
            leaf = workspace.getLeaf( true )
            break

        case 'right':

        default:
            leaf = workspace.getRightLeaf( false )
            break
    }

    await leaf?.setViewState( { type: id, active: true } )

    return leaf
}