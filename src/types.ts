/*
    Module: Obsidian
*/

declare module 'obsidian'
{
    // eslint-disable-next-line no-unused-vars
    interface App
    {
        commands:
        {
            executeCommandById: any
        }
    }

    // eslint-disable-next-line no-unused-vars
    interface Workspace
    {
        onLayoutChange( ): void
    }
}

/*
    Header leaf button base
*/

export interface LeafButtonBase
{
    id:     string
    icon:   string
    name:   string
}
