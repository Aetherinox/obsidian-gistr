/*
	Module: Obsidian
*/

declare module 'obsidian'
{
	interface App
	{
		commands:
		{
			executeCommandById: any
		}
	}

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
	id: 	string
	icon: 	string
	name: 	string
}