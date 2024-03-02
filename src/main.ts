/*
    Import
*/

import { App, Plugin, PluginSettingTab, Setting, sanitizeHTMLToDom, ExtraButtonComponent, MarkdownRenderer } from 'obsidian'
import { GistrBackend } from 'src/backend/backend'
import GistrSettings from 'src/settings/settings'
import ModalGettingStarted from "./modals/GettingStartedModal"
import { lng, PluginID } from 'src/lang/helpers'
import Pickr from "@simonwep/pickr"
import ColorPicker from 'src/backend/colorpicker'
import { GetColor } from 'src/backend/colorpicker'

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
    'og_clr_bg_light'?:     string
    'og_clr_bg_dark'?:      string
    'og_clr_sb_light'?:     string
    'og_clr_sb_dark'?:      string
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
    private Hide_Global:        boolean
    private Hide_Github:        boolean
    private Hide_Opengist:      boolean
    private Hide_Support:       boolean
    private Tab_Gobal:          HTMLElement
    private Tab_Github:         HTMLElement
    private Tab_OpenGist:       HTMLElement
    private Tab_Support:        HTMLElement
    cPickr:                     Record<string, ColorPicker>

    /*
        Class > Constructor
    */
    constructor( app: App, plugin: GistrPlugin )
    {
        super( app, plugin )

        this.plugin             = plugin
		this.Hide_Global        = true
		this.Hide_Github        = true
		this.Hide_Opengist      = true
		this.Hide_Support       = false
        this.cPickr             = { }
    }


    /*
        Create Object > Color Picker

        @arg    : bHidden
                  associated to hovering color picker, not color element
    */

    new_ColorPicker( plugin: GistrPlugin, el: HTMLElement, setting: Setting, id: keyof ColorPickrOpts, bHidden?: ( ) => boolean )
    {
        const pickr: ColorPicker = new ColorPicker( plugin, el, setting )

        pickr
            .on( "init", ( colour: Pickr.HSVaColor, instance: Pickr ) =>
            {
                const currColor = this.plugin.settings[ id ]
                pickr.setColor( currColor )
            } )

            .on( "show", ( colour: Pickr.HSVaColor, instance: Pickr ) =>
            {
                if ( typeof bHidden !== "undefined" && bHidden( ) )
                    instance.hide( )
            } )

            .on( "save", ( colour: Pickr.HSVaColor, instance: ColorPicker ) =>
            {

                const clr : Color = `#${ colour.toHEXA( ).toString( ).substring( 1 ) }`

                this.plugin.settings[ id ] = clr
                this.plugin.saveSettings( )

                instance.hide( )
                instance.addSwatch( clr )
                instance.ActionSave( clr )
            } )

            .on( "cancel", ( instance: ColorPicker ) =>
            {
                instance.hide( )
            } )

            setting.addExtraButton
            (
                ( btn ) =>
                {
                    pickr.AddButtonReset = btn

                    .setIcon        ( "reset" )
                    .setDisabled    ( false )
                    .setTooltip     ( lng( "pickr_tip_restore_default" ) )
                    .onClick( ( ) =>
                    {
                        const resetColour:  Color = ColorPickrDefaults[ id ]
                        pickr.setColor      ( GetColor( resetColour ) )
                        pickr.ActionSave    ( resetColour )
                    } )
                }
            )

        this.cPickr[ id ] = pickr
    }

    /*
        Display
    */

    display( ): void
    {
        const { containerEl }   = this

        this.Hide_Global        = true
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
        this.Tab_Gobal_New      ( elm )
		this.Tab_Gobal          = elm.createDiv( )

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

        Tab_Gobal_New( elm: HTMLElement )
        {
            const Tab_GN = elm.createEl( "h2", { text: lng( "cfg_tab_ge_title" ), cls: `gistr-settings-header${ this.Hide_Global?" isfold" : "" }` } )
            Tab_GN.addEventListener( "click", ( )=>
            {
                this.Hide_Global = !this.Hide_Global
                Tab_GN.classList.toggle( "isfold", this.Hide_Global )
                this.Tab_Gobal_CreateSettings( )
            } )
        }

        Tab_Gobal_CreateSettings( )
        {
            this.Tab_Gobal.empty( )
            if ( this.Hide_Global ) return
            
            this.Tab_Gobal_ShowSettings( this.Tab_Gobal )
        }

        Tab_Gobal_ShowSettings( elm: HTMLElement )
        {
        
            elm.createEl( 'small', { cls: "gistr-settings-section-description", text: lng( "cfg_tab_ge_header" ) } )

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

            elm.createEl( 'div', { cls: "gistr-settings-section-footer", text: "" } )
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

            elm.createEl( 'small', { cls: "gistr-settings-section-description", text: lng( "cfg_tab_og_header" ) } )

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
                .setName( lng( "cfg_tab_og_cb_light_name" ) )
                .setDesc( lng( "cfg_tab_og_cb_light_desc" ) )
                .then( ( setting ) => { this.new_ColorPicker
                (
                    this.plugin, elm, setting,
                    "og_clr_bg_light",
                ) } )


            /*
                Background color (Dark)
            */

            new Setting( elm )
                .setName( lng( "cfg_tab_og_cb_dark_name" ) )
                .setDesc( lng( "cfg_tab_og_cb_dark_desc" ) )
                    .then( ( setting ) => { this.new_ColorPicker
                    (
                        this.plugin, elm, setting,
                        "og_clr_bg_dark",
                ) } )

            /*
                Scrollbar Track Color (Light)
            */

            new Setting( elm )
                .setName( lng( "cfg_tab_og_sb_light_name" ) )
                .setDesc( lng( "cfg_tab_og_sb_light_desc" ) )
                    .then( ( setting ) => { this.new_ColorPicker
                    (
                        this.plugin, elm, setting,
                        "og_clr_sb_light",
                ) } )

            /*
                Scrollbar Track Color (Dark)
            */

            new Setting( elm )
                .setName( lng( "cfg_tab_og_sb_dark_name" ) )
                .setDesc( lng( "cfg_tab_og_sb_dark_desc" ) )
                    .then( ( setting ) => { this.new_ColorPicker
                    (
                        this.plugin, elm, setting,
                        "og_clr_sb_dark",
                ) } )

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

            elm.createEl( 'div', { cls: "gistr-settings-section-footer", text: "" } )
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

            elm.createEl( 'div', { cls: "gistr-settings-section-footer", text: "" } )
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

            elm.createEl( 'small', { cls: "gistr-settings-section-description", text: lng( "cfg_tab_su_desc" ) } )

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
                Button -> Plugin Demo Vault
            */

            new Setting( elm )
                .setName( lng( "cfg_tab_su_vault_label" ) )
                .setDesc( lng( "cfg_tab_su_vault_url" ) )
                .addButton( ( btn ) =>
                {
                    btn.setButtonText( lng( "cfg_tab_su_vault_btn" ) ).onClick( ( ) =>
                    {
                        window.open( lng( "cfg_tab_su_vault_url" ) )
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