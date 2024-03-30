import { Menu, Notice } from 'obsidian'
import { GistrSettings } from 'src/settings/'
import { GistrAPI, GistrEditor, ContextMenu, Coords } from 'src/api'
import { lng } from 'src/lang'

/*
    Context Menu
*/

const ContextMenu = ( app: GistrAPI, cfg: GistrSettings, editor: GistrEditor ): void =>
{

    if ( !editor || !editor.hasFocus() )
        throw new Notice( lng( "base_context_nofocus" ))

    let coords:         Coords
    const cursor        = editor.getCursor( "from" )
    const menu          = new Menu( ) as unknown as ContextMenu

    const elm = menu.DOM
    elm.addClass( "gistr-container" )

    cfg.ge_contextmenu_sorting.forEach( ( obj ) =>
    {
        menu.addItem( ( menuItem ) =>
        {
            menuItem.setTitle( obj )
            menuItem.setIcon( `gistr-${ obj }`.toLowerCase( ) )
            menuItem.onClick( ( ) =>
        {
            app.Commands.RunCommandByID( `gistr-plugin:${ obj }` )
        })
        })
    })

    if ( editor.coordsCur )
        coords = editor.coordsCur( true, "window" )

    else if ( editor.coordsPos )
    {
        const offset    = editor.posToOffset( cursor )
        coords          = editor.cm.coordsPos?.( offset ) ?? editor.coordsPos( offset )
    }
    else return

    menu.showAtPosition(
    {
        x:  coords.right + 25,
        y:  coords.top + 20,
    } )
}

export default ContextMenu