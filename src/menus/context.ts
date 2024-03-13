import { Menu } from "obsidian"
import GistrPlugin from "src/main"
import { GistrSettings } from 'src/settings/'
import { GHGistGet } from 'src/backend/services'
import { GistrAPI, GistrEditor } from "src/api/Types"
import { lng } from 'src/lang'

/*
	Interface
*/

interface Element
{
	dom?: HTMLDivElement
}

/*
	Context Menu
*/

export default function ShowContextMenu( plugin: GistrPlugin, settings: GistrSettings, api: GistrAPI, menu: Menu, editor: GistrEditor ): void
{

	/*
		Context Menu Separator
	*/

	menu.addItem( ( item ) =>
	{
		const elm = ( item as Element ).dom as HTMLElement
		elm.addClass( "menu-separator" )
		// required to make separator not hoverable
		elm.setAttribute( "style", "background-color: transparent" )
	} )

	/*
		Text Selection
	*/

	const selection = editor.getSelection( )

	/*
		Context Menu > Item > Gistr Github (Public)
	*/

	menu.addItem( ( item ) =>
	{
		const elm = ( item as Element ).dom as HTMLElement
		elm.addClass( "gistr-button" )
		item
			.setTitle( lng( "cfg_context_gist_public" ) )
			.setIcon( "github" )
			.onClick( async ( e ) =>
			{
				await GHGistGet(
				{ 
					plugin: 		plugin,
					app: 			plugin.app,
					is_public: 		true
				} )( )
			} )
	} )

	/*
		Context Menu > Item > Gistr Github (Secret)
	*/

	menu.addItem( ( item ) =>
	{
		const elm = ( item as Element ).dom as HTMLElement
		elm.addClass( "gistr-button" )
		item
			.setTitle( lng( "cfg_context_gist_secret" ) )
			.setIcon( "github" )
			.onClick( async ( e ) =>
			{
				await GHGistGet(
				{ 
					plugin: 		plugin,
					app: 			plugin.app,
					is_public: 		false
				} )( )
			} )
	} )

}