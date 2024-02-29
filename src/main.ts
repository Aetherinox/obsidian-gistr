/*
    Import
*/

import { App, Plugin, PluginSettingTab, Setting, sanitizeHTMLToDom, ExtraButtonComponent, MarkdownRenderer } from 'obsidian'
import { GistrBackend } from 'src/backend/backend'
import GistrSettings from 'src/settings/settings'
import ModalGettingStarted from "./modals/GettingStartedModal"
import { lng, PluginID } from 'src/lang/helpers'
import { ColorTranslator } from "colortranslator"

/*
    Basic Declrations
*/

const PluginName            = PluginID( )
const AppBase               = 'app://obsidian.md'

/*
    Default Settings
*/

const CFG_DEFAULT: GistrSettings =
{
    keyword:            "gistr",
    firststart:         true,
    css_og:             null,
    css_gh:             null,
    theme:              "Light",
    blk_pad_t:          10,
    blk_pad_b:          20,
    og_clr_bg_light:    "#cbcbcb",
    og_clr_bg_dark:     "#121315",
    og_clr_sb_light:    "#808080",
    og_clr_sb_dark:     "#363636"
}

/*
    Color picker options

    @todo   : if a large variety of options are available in the future, possible
              theme system should be integrated.
*/

export interface ColorPickrOpts
{
    'og_clr_bg_light'?: string
    'og_clr_bg_dark'?: string
    'og_clr_sb_light'?: string
    'og_clr_sb_dark'?: string
}

/*
    default colors : type Color
*/

const ColorPickrDefaults: Record< string, Color > =
{
	"og_clr_bg_light":  "#cbcbcb",
	"og_clr_bg_dark":   "#121315",
	"og_clr_sb_light":  "#808080",
	"og_clr_sb_dark":   "#363636",
}

/*
    Theme Options
*/

export enum Themes
{
    LIGHT   = "Light",
    DARK    = "Dark",
}

export const Themes_GetName: { [ key in Themes ]: string } =
{
	[ Themes.LIGHT ]:   "Light",
	[ Themes.DARK ]:    "Dark",
}

/*
    CSS Color Values
*/

export type CLR_VAR     = `--${string}`         // css variable
export type CLR_HEX     = `#${string}`          // css hex
export type Color       = CLR_HEX | CLR_VAR

/*
    Extend Plugin
*/

export default class GistrPlugin extends Plugin
{
    private bLayoutReady = false

    public settings:    GistrSettings
    readonly plugin:    GistrPlugin

    /*
        Settings > Load
    */

    async onload( )
    {
        await this.loadSettings     ( )
        this.addSettingTab          ( new OG_Tab_Settings( this.app, this ) )

		this.app.workspace.onLayoutReady( async ( ) =>
        {
			if ( this.settings.firststart === true )
            {
				this.settings.firststart = false
				this.saveSettings( )
	
				const actSelected = await new ModalGettingStarted( this.plugin, this.app, true ).openAndAwait( )
				if ( actSelected === "settings-open" )
                {

                    /*
                        Mute
                    */

					// @ts-ignore
					this.app.setting.open( "${ PluginName }" )
					// @ts-ignore
					this.app.setting.openTabById( "${ PluginName }" )
				}
			}

			this.bLayoutReady = true
		} )

        const gistBackend                       = new GistrBackend( this.settings )
        this.registerDomEvent                   ( window, "message", gistBackend.messageEventHandler )
        this.registerMarkdownCodeBlockProcessor ( this.settings.keyword, gistBackend.processor )
    }

    /*
        Settings > Load
    */

    async loadSettings( )
    {
        this.settings = Object.assign( { }, CFG_DEFAULT, await this.loadData( ) )
    }

    /*
        Settings > Save
    */

    async saveSettings( )
    {
        await this.saveData( this.settings )
    }
}

/*
    Settings Tab
*/

class OG_Tab_Settings extends PluginSettingTab
{
    readonly plugin:            GistrPlugin
    private Hide_General:       boolean
    private Hide_Github:        boolean
    private Hide_Opengist:      boolean
    private Hide_Support:       boolean
    private Tab_General:        HTMLElement
    private Tab_Github:         HTMLElement
    private Tab_OpenGist:       HTMLElement
    private Tab_Support:        HTMLElement

    /*
        Class > Constructor
    */
    constructor( app: App, plugin: GistrPlugin )
    {
        super( app, plugin )

        this.plugin             = plugin
		this.Hide_General       = true
		this.Hide_Github        = true
		this.Hide_Opengist      = true
		this.Hide_Support       = false
    }

    /*
        Display
    */

    display( ): void
    {
        const { containerEl }   = this

        this.Hide_General       = true
		this.Hide_Github        = true
		this.Hide_Opengist      = true
		this.Hide_Support       = false

        this.createHeader       ( containerEl )
		this.createMenus        ( containerEl )
    }

    /*
        Section -> Header
    */

    createHeader( elm: HTMLElement )
    {

        elm.empty( )
        elm.createEl( "h1", { text: lng( "cfg_modal_title" ) } )
        elm.createEl( "p",
        {
            cls: "gistr-settings-section-header",
            text: lng( "cfg_modal_desc" ),
        } )
        
    }

    /*
        Create Menus
    */

	createMenus( elm: HTMLElement )
    {
        this.Tab_General_New    ( elm )
		this.Tab_General        = elm.createDiv( )

        this.Tab_OpenGist_New   ( elm )
		this.Tab_OpenGist       = elm.createDiv( )

        this.Tab_Github_New     ( elm )
		this.Tab_Github         = elm.createDiv( )

        this.Tab_Support_New    ( elm )
		this.Tab_Support        = elm.createDiv( )

        this.Tab_Support_ShowSettings( this.Tab_Support )
	}


    /*
        Tab > General > New
    */

        Tab_General_New( elm: HTMLElement )
        {
            const Tab_GN = elm.createEl( "h2", { text: lng( "cfg_tab_ge_title" ), cls: `gistr-settings-header${ this.Hide_General?" isfold" : "" }` } )
            Tab_GN.addEventListener( "click", ( )=>
            {
                this.Hide_General = !this.Hide_General
                Tab_GN.classList.toggle( "isfold", this.Hide_General )
                this.Tab_General_CreateSettings( )
            } )
        }

        Tab_General_CreateSettings( )
        {
            this.Tab_General.empty( )
            if ( this.Hide_General ) return
            
            this.Tab_General_ShowSettings( this.Tab_General )
        }

        Tab_General_ShowSettings( elm: HTMLElement )
        {
        
            elm.createEl( 'small',
            {
                cls: "gistr-settings-section-description",
                text: lng( "cfg_tab_ge_header" )
            } )

            /*
                Command Keyword

                changing this will cause all opengist portals to not function until the keyword is changed
                within the box.
            */

            new Setting( elm )
                .setName( lng( "cfg_tab_ge_keyword_name" ) )
                .setDesc( lng( "cfg_tab_ge_keyword_desc" ) )
                .addText( text =>
                {
                    text.setValue( this.plugin.settings.keyword.toString( ) )
                    .onChange( async ( val ) =>
                    {
                        this.plugin.settings.keyword = val
                        await this.plugin.saveSettings( )
                    } )
                } )

            /*
                Tab Footer Spacer
            */

            elm.createEl( 'div',
            {
                cls: "gistr-settings-section-footer",
                text: ""
            } )
        }

    /*
        Tab > OpenGist > New
    */

        Tab_OpenGist_New( elm: HTMLElement )
        {
            const Tab_OG = elm.createEl( "h2", { text: lng( "cfg_tab_og_title" ), cls: `gistr-settings-header${ this.Hide_Opengist?" isfold" : "" }` } )
            Tab_OG.addEventListener( "click", ( )=>
            {
                this.Hide_Opengist = !this.Hide_Opengist
                Tab_OG.classList.toggle( "isfold", this.Hide_Opengist )
                this.Tab_OpenGist_CreateSettings( )
            } )
        }

        Tab_OpenGist_CreateSettings( )
        {
            this.Tab_OpenGist.empty( )
            if ( this.Hide_Opengist ) return
            
            this.Tab_OpenGist_ShowSettings( this.Tab_OpenGist )
        }

        Tab_OpenGist_ShowSettings( elm: HTMLElement )
        {

            elm.createEl( 'small',
            {
                cls: "gistr-settings-section-description",
                text: lng( "cfg_tab_og_header" )
            } )

            /*
                Development notice
            */

            const ct_Note           = elm.createDiv( )
            const md_notFinished    = "> [!NOTE] " + lng( "base_underdev_title" ) + "\n> <small>" + lng( "base_underdev_msg" ) + "</small>"
            MarkdownRenderer.render( this.plugin.app, md_notFinished, ct_Note, "" + md_notFinished, this.plugin )

            /*
                Background color (Light)
            */

            new Setting( elm )
                .setName( lng( "cfg_tab_og_cblk_light_name" ) )
                .setDesc( lng( "cfg_tab_og_cblk_light_desc" ) )
                .addColorPicker( clr => clr
                    .setValue( this.plugin.settings.og_clr_bg_light )
                    .onChange( val =>
                    {
                        this.plugin.settings.og_clr_bg_light = val;
                        this.plugin.saveSettings( );
                    })
                );

            /*
                Background color (Dark)
            */

            new Setting( elm )
                .setName( lng( "cfg_tab_og_cblk_dark_name" ) )
                .setDesc( lng( "cfg_tab_og_cblk_dark_desc" ) )
                .addColorPicker( clr => clr
                    .setValue( this.plugin.settings.og_clr_bg_dark )
                    .onChange( val =>
                    {
                        this.plugin.settings.og_clr_bg_dark = val;
                        this.plugin.saveSettings( );
                    })
                );

            /*
                Scrollbar Track Color (Light)
            */

            new Setting( elm )
                .setName( lng( "cfg_tab_og_sb_light_name" ) )
                .setDesc( lng( "cfg_tab_og_sb_light_desc" ) )
                .addColorPicker( clr => clr
                    .setValue( this.plugin.settings.og_clr_sb_light )
                    .onChange( val =>
                    {
                        this.plugin.settings.og_clr_sb_light = val;
                        this.plugin.saveSettings( );
                    })
                );

            /*
                Scrollbar Track Color (Dark)
            */

            new Setting( elm )
                .setName( lng( "cfg_tab_og_sb_dark_name" ) )
                .setDesc( lng( "cfg_tab_og_sb_dark_desc" ) )
                .addColorPicker( clr => clr
                    .setValue( this.plugin.settings.og_clr_sb_dark )
                    .onChange( val =>
                    {
                        this.plugin.settings.og_clr_sb_dark = val;
                        this.plugin.saveSettings( );
                    })
                );

            /*
                Codeblock > Padding > Top
            */

            let val_st_padding: HTMLDivElement
            new Setting( elm )
                .setName( lng( "cfg_tab_og_padding_top_name" ) )
                .setDesc( lng( "cfg_tab_og_padding_top_desc" ) )
                .addSlider( slider => slider
                    .setLimits( 0, 30, 1 )
                    .setValue( this.plugin.settings.blk_pad_t )
                    .onChange( async ( val ) =>
                    {
                        val_st_padding.innerText            = " " + val.toString( )
                        this.plugin.settings.blk_pad_t      = val

                        this.plugin.saveSettings( )
                    } )
                ).settingEl.createDiv( '', ( el ) =>
                {
                    val_st_padding          = el
                    el.innerText            = " " + this.plugin.settings.blk_pad_t.toString( )
                } ).classList.add( 'gistr-settings-elm-slider-preview' )

            /*
                Codeblock > Padding > Bottom
            */

            let val_sb_padding: HTMLDivElement
            new Setting( elm )
                .setName( lng( "cfg_tab_og_padding_bottom_name" ) )
                .setDesc( lng( "cfg_tab_og_padding_bottom_desc" ) )
                .addSlider( slider => slider
                    .setLimits( 0, 30, 1 )
                    .setValue( this.plugin.settings.blk_pad_b )
                    .onChange( async ( val ) =>
                    {
                        val_sb_padding.innerText            = " " + val.toString( )
                        this.plugin.settings.blk_pad_b      = val

                        this.plugin.saveSettings( )
                    } )
                )
                .settingEl.createDiv( '', ( el ) =>
                {
                    val_sb_padding          = el
                    el.innerText            = " " + this.plugin.settings.blk_pad_b.toString( )
                } ).classList.add( 'gistr-settings-elm-slider-preview' )

            /*
                Codeblock > Theme
            */

            new Setting( elm )
                .setName( lng( "cfg_tab_og_theme_name" ) )
                .setDesc( lng( "cfg_tab_og_theme_desc" ) )
                .addDropdown( dropdown =>
                {
                    dropdown
                        .addOption( Themes.LIGHT, Themes_GetName[ Themes.LIGHT ] )
                        .addOption( Themes.DARK, Themes_GetName[ Themes.DARK ] )
                        .setValue( this.plugin.settings.theme )
                        .onChange( async ( val ) =>
                        {
                            this.plugin.settings.theme = val
                            await this.plugin.saveSettings( )
                        } )
                } )

            /*
                Codeblock > CSS Override
            */

            new Setting( elm )
                .setName( lng( "cfg_tab_og_css_name" ) )
                .setDesc( lng( "cfg_tab_og_css_desc" ) )
                .addTextArea
                (
                    text => text
                    .setPlaceholder( lng( "cfg_tab_og_css_pholder" ) )
                    .setValue( this.plugin.settings.css_og )
                    .onChange( async ( val ) =>
                    {
                        this.plugin.settings.css_og = val
                        await this.plugin.saveSettings( )
                    }
                ) )

            /*
                Tab Footer Spacer
            */

            elm.createEl( 'div',
            {
                cls: "gistr-settings-section-footer",
                text: ""
            } )
        }

    /*
        Tab > Github Gists > New
    */

        Tab_Github_New( elm: HTMLElement )
        {
            const Tab_GH = elm.createEl( "h2", { text: lng( "cfg_tab_gh_title" ), cls: `gistr-settings-header${ this.Hide_Github?" isfold" : "" }` } )
            Tab_GH.addEventListener( "click", ( )=>
            {
                this.Hide_Github = !this.Hide_Github
                Tab_GH.classList.toggle( "isfold", this.Hide_Github )
                this.Tab_Github_CreateSettings( )
            } )
        }

        Tab_Github_CreateSettings( )
        {
            this.Tab_Github.empty( )
            if ( this.Hide_Github ) return
            
            this.Tab_Github_ShowSettings( this.Tab_Github )
        }

        Tab_Github_ShowSettings( elm: HTMLElement )
        {

            elm.createEl( 'small',
            {
                attr: { style: 'display: block' },
                text: lng( "cfg_tab_gh_header" )
            } )

            /*
                Codeblock > CSS Override
            */

            new Setting( elm )
                .setName( lng( "cfg_tab_gh_css_name" ) )
                .setDesc( lng( "cfg_tab_gh_css_desc" ) )
                .addTextArea( text => text
                    .setPlaceholder( lng( "cfg_tab_gh_css_pholder" ) )
                    .setValue( this.plugin.settings.css_gh )
                    .onChange( async ( val ) =>
                    {
                        this.plugin.settings.css_gh = val
                        await this.plugin.saveSettings( )
                    }
                ))

            /*
                Tab Footer Spacer
            */

            elm.createEl( 'div',
            {
                cls: "gistr-settings-section-footer",
                text: ""
            } )
        }


    /*
        Tab > Support > New
    */

        Tab_Support_New( elm: HTMLElement )
        {
            const tab_og = elm.createEl( "h2", { text: lng( "cfg_tab_sp_title" ), cls: `gistr-settings-header${ this.Hide_Support?" isfold" : "" }` } )
            tab_og.addEventListener( "click", ( )=>
            {
                this.Hide_Support = !this.Hide_Support
                tab_og.classList.toggle( "isfold", this.Hide_Support )
                this.Tab_Support_CreateSettings( )
            } )
        }

        Tab_Support_CreateSettings( )
        {
            this.Tab_Support.empty( )
            if ( this.Hide_Support ) return
            
            this.Tab_Support_ShowSettings( this.Tab_Support )
        }

        Tab_Support_ShowSettings( elm: HTMLElement )
        {

            /*
                Section -> Support Buttons
            */

            elm.createEl( 'small',
            {
                cls: "gistr-settings-section-description",
                text: lng( "cfg_tab_su_desc" )
            } )

            /*
                Button > Getting Started > Open Interface
            */

            new Setting( elm )
                .setName( lng( "cfg_tab_su_gs_name" ) )
                .setDesc( lng( "cfg_tab_su_gs_desc" ) )
                .addButton( btn =>
                {
                    btn.setButtonText( lng( "cfg_tab_su_gs_btn" ) )
                        .setCta( )
                        .onClick( async( ) =>
                        {
                            const action = await new ModalGettingStarted( this.plugin, this.app, false ).openAndAwait( )
                        } )
                } )

            /*
                Button -> Plugin Repo
            */

            new Setting( elm )
                .setName( lng( "cfg_tab_su_repo_label" ) )
                .setDesc( lng( "cfg_tab_su_repo_url" ) )
                .addButton( ( btn ) =>
                {
                    btn.setButtonText( lng( "cfg_tab_su_repo_btn" ) ).onClick( ( ) =>
                    {
                        window.open( lng( "cfg_tab_su_repo_url" ) )
                    } )
                } )

            /*
                Button -> OpenGist > Download
            */

            new Setting( elm )
                .setName( lng( "cfg_tab_su_ogrepo_label" ) )
                .setDesc( lng( "cfg_tab_su_ogrepo_url" ) )
                .addButton( ( btn ) =>
                {
                    btn.setButtonText( lng( "cfg_tab_su_ogrepo_btn" ) ).onClick( ( ) =>
                    {
                        window.open( lng( "cfg_tab_su_ogrepo_url" ) )
                    } )
                } )

            /*
                Button -> OpenGist > Docs
            */

            new Setting( elm )
                .setName( lng( "cfg_tab_su_ogdocs_label" ) )
                .setDesc( lng( "cfg_tab_su_ogdocs_url" ) )
                .addButton( ( btn ) =>
                {
                    btn.setButtonText( lng( "cfg_tab_su_ogdocs_btn" ) ).onClick( ( ) =>
                    {
                        window.open( lng( "cfg_tab_su_ogdocs_url" ) )
                    } )
                } )

            /*
                Button -> OpenGist > Docs
            */

            new Setting( elm )
                .setName( lng( "cfg_tab_su_ogdemo_label" ) )
                .setDesc( lng( "cfg_tab_su_ogdemo_url" ) )
                .addButton( ( btn ) =>
                {
                    btn.setButtonText( lng( "cfg_tab_su_ogdemo_btn" ) ).onClick( ( ) =>
                    {
                        window.open( lng( "cfg_tab_su_ogdemo_url" ) )
                    } )
                } )

            /*
                Button -> Github Gist
            */

            new Setting( elm )
                .setName( lng( "cfg_tab_su_gist_label" ) )
                .setDesc( lng( "cfg_tab_su_gist_url" ) )
                .addButton( ( btn ) =>
                {
                    btn.setButtonText( lng( "cfg_tab_su_gist_btn" ) ).onClick( ( ) =>
                    {
                        window.open( lng( "cfg_tab_su_gist_url" ) )
                    } )
                } )

            /*
                Button -> Donate
            */

            const div_Donate = elm.createDiv( { cls: "gistr-donate" } )
            const lnk_Donate = new DocumentFragment( )
            lnk_Donate.append(
                sanitizeHTMLToDom(`
                    <a href="https://buymeacoffee.com/aetherinox">
                    <img alt="" src="https://img.buymeacoffee.com/button-api/?text=Donate Java&emoji=🤓&slug=aetherinox&button_colour=e8115c&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00"/>
                    </a>
                `),
            )
        
            new Setting( div_Donate ).setDesc( lnk_Donate )
        }

}

/*
    Calculate colors when converting hsl and rgb
*/

function CalcColor( str : string ) : string
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

function CSS_GetValue( property: CLR_VAR ): CLR_HEX
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
		console.warn( `Gistr: Unknown color format - ${value}` )

	return `#${ ColorTranslator.toHEXA( value ).substring( 1 ) }`
}

/*
    Get Color from CSS Value
*/

export function GetColor( clr: Color ): Color
{
	return bValidCSS( clr ) ? CSS_GetValue( clr ) : clr
}

/*
    Check Valid CSS
*/

export function bValidCSS( css: string ): css is CLR_VAR
{
	return typeof css === "string" && css.startsWith( "--" )
}