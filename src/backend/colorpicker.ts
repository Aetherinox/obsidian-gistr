/*
    Import
*/

import { Setting, ExtraButtonComponent } from 'obsidian'
import GistrPlugin from "src/main"
import { lng } from 'src/lang/helpers'
import Pickr from "@simonwep/pickr"
import { ColorTranslator } from "colortranslator"

/*
    CSS Color Values
*/

export type CLR_VAR     = `--${string}`         // css variable
export type CLR_HEX     = `#${string}`          // css hex
export type Color       = CLR_HEX | CLR_VAR

/*
    Color Picker
*/

export default class ColorPicker extends Pickr
{
	ActionSave:         ( ActionSave: Color ) => void
	ColorReset:         ( ) => void
	AddButtonReset:     ExtraButtonComponent

	constructor( plugin : GistrPlugin, el : HTMLElement, setting : Setting, tip? : string )
    {
		const settings : Pickr.Options =
        {
			el: setting.controlEl.createDiv( { cls: "picker" } ),
			theme:          "nano",
			default:        "#FFFFFF",
			position:       "left-middle",
			lockOpacity:    false,
			components:
            {
				preview:    true,
				hue:        true,
				opacity:    true,
				interaction:
                {
					hex:    true,
					rgba:   true,
					hsla:   true,
					input:  true,
					cancel: true,
					save:   true,
				},
			},
			i18n:
            {
				"ui:dialog":        lng( "pickr_dialog" ),
				"btn:swatch":       lng( "pickr_swatch" ),
				"btn:toggle":       ( typeof tip !== "undefined" ) ? tip : lng( "pickr_toggle" ),
				"btn:last-color":   lng( "pickr_last" ),
                "btn:save":         lng( "pickr_save" ),
                "btn:cancel":       lng( "pickr_cancel" ),
                "btn:clear":        lng( "pickr_clear" ),
			}
		}

		if ( el.parentElement !== null )
			settings.container = el.parentElement
    
        super( settings )

        /*
            Colorpicker > Save
        */
    
        this.ActionSave = ( ActionSave: Color ) =>
        {
            (
                async ( ) =>
                {
                    await plugin.saveSettings( )
                } 
            )( )
        }

        /*
            Colorpicker > Reset Color
        */

		this.ColorReset = ( ) =>
        {
			const clr: Color    = "#FFFFFF"
			this.setColor       ( GetColor( clr ) )
			this.ActionSave     ( clr )
		}
	}
}

/*
    Color > Get
*/

export function GetColor( clr: Color ): Color
{
    return bValidCSS( clr ) ? CSS_GetValue( clr ) : clr
}

/*
    Calculate colors when converting hsl and rgb
*/

export function CalcColor( str : string ) : string
{
	const strSplit = str.trim( ).replace( /(\d*)%/g, "$1" ).split( " " )

	const operators: { [ key: string ] : ( n1 : number, n2 : number ) => number } =
    {
		"+" : ( n1 : number, n2 : number ) : number => Math.max( n1 + n2, 0 ),
		"-" : ( n1 : number, n2 : number ) : number => Math.max( n1 - n2, 0 ),
	}

	if ( strSplit.length === 3 )
    {
		if ( strSplit[ 1 ] in operators )
        {
            console.log( operators )
			return `${ operators[ strSplit[ 1 ] ]( parseFloat( strSplit[ 0 ] ), parseFloat( strSplit[ 2 ] ) ) }%`
        }
    }

    return str
}

/*
    CSS > Get Value
*/

export function CSS_GetValue( property: CLR_VAR ): CLR_HEX
{

	const value = window.getComputedStyle( document.body ).getPropertyValue( property ).trim( )

    /*
        type    : hex
                  #ff0000
    */

	if ( typeof value === "string" && value.startsWith( "#" ) )
		return `#${ value.trim( ).substring( 1 ) }`

    /*
        type    : hsl
                  hsl( 0, 100%, 50% )
    */

	else if ( value.startsWith( "hsl" ) )
		return `#${ ColorTranslator.toHEXA
        ( 
            value.replace( /CalcColor\((.*?)\)/g, ( match, capture ) =>
            CalcColor( capture ) )
        ).substring( 1 ) }`

    /*
        type    : rgb
                  rgb( 255, 0, 0 )
    */

	else if ( value.startsWith( "rgb" ) )
		return `#${ ColorTranslator.toHEXA
        (
            value.replace( /CalcColor\((.*?)\)/g, ( match, capture ) =>
            CalcColor( capture ) )
        ).substring( 1 ) }`

    /*
        Unknown type
    */

	else
		console.warn( lng( "pickr_dev_unknown", value ) )

	return `#${ ColorTranslator.toHEXA( value ).substring( 1 ) }`
}

/*
    Check Valid CSS
*/

export function bValidCSS( css: string ): css is CLR_VAR
{
	return typeof css === "string" && css.startsWith( "--" )
}