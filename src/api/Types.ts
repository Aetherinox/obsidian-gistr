import { App, Editor, Menu } from "obsidian"

/*
    Cursor Coordinates
*/

export interface Coords
{
    top:        number
    left:       number
    right:      number
    bottom:     number
}

/*
    Export Types
*/

export type ContextMenu     = Menu      & { DOM: HTMLElement }
export type GistrAPI        = App       & { Commands: { RunCommandByID: Function } }
export type GistrEditor     = Editor    &
{
    cm:               CodeMirror.Editor & { coordsPos: Function }
    coordsCur:        Function
    coordsPos:        Function
    hasFocus:         Function
    getSelection:     Function
}