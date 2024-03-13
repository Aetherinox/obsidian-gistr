import { App, PluginSettingTab, Setting, sanitizeHTMLToDom, ExtraButtonComponent, MarkdownRenderer, Notice, requestUrl } from 'obsidian'
import GistrPlugin from "src/main"
import { SettingsDefaults } from 'src/settings/defaults'
import { ColorPicker, GetColor } from 'src/utils'
import { GHStatusAPI, GHTokenSet, GHTokenGet } from 'src/backend/services'
import ModalGettingStarted from "src/modals/GettingStartedModal"
import { NoxComponent } from 'src/api'
import { lng } from 'src/lang'
import Pickr from "@simonwep/pickr"
import lt from 'semver/functions/lt'
import gt from 'semver/functions/gt'

/*
    Color picker options

    @todo   : if a large variety of options are available in the future, possible
              theme system should be integrated.
*/

export interface ColorPickrOpts
{
    'sy_clr_lst_icon'?:     string

    'og_clr_bg_light'?:     string
    'og_clr_bg_dark'?:      string
    'og_clr_sb_light'?:     string
    'og_clr_sb_dark'?:      string
    'og_clr_tx_light'?:     string
    'og_clr_tx_dark'?:      string

    'gh_clr_bg_light'?:     string
    'gh_clr_bg_dark'?:      string
    'gh_clr_sb_light'?:     string
    'gh_clr_sb_dark'?:      string
    'gh_clr_tx_light'?:     string
    'gh_clr_tx_dark'?:      string
}

/*
    default colors : type Color
*/

const ColorPickrDefaults: Record< string, Color > =
{
    'sy_clr_lst_icon':      "#757575E6",

	"og_clr_bg_light":      "#CBCBCB",
	"og_clr_bg_dark":       "#121315",
	"og_clr_sb_light":      "#BA4956",
	"og_clr_sb_dark":       "#4960ba",
	"og_clr_tx_light":      "#2A2626",
	"og_clr_tx_dark":       "#CAD3F5",

	"gh_clr_bg_light":      "#E5E5E5",
	"gh_clr_bg_dark":       "#121315",
	"gh_clr_sb_light":      "#BA4956",
	"gh_clr_sb_dark":       "#BA496A",
	"gh_clr_tx_light":      "#2A2626",
	"gh_clr_tx_dark":       "#CAD3F5",
}

/*
    CSS Color Values
*/

export type CLR_VAR         = `--${string}`         // css variable
export type CLR_HEX         = `#${string}`          // css hex
export type Color           = CLR_HEX | CLR_VAR

/*
    Get > Theme Options
*/

export enum THEMES { LIGHT = "Light", DARK = "Dark" }
export const GetTheme: { [ key in THEMES ]: string } =
{
	[ THEMES.LIGHT ]:       lng( "base_theme_light" ),
	[ THEMES.DARK ]:        lng( "base_theme_dark" ),
}

/*
    Get > Text Wrap Option
*/

export enum TEXTWRAP { WRAP_OFF = "Disabled", WRAP_ON = "Enabled" }
export const GetTextwrap: { [ key in TEXTWRAP ]: string } =
{
	[ TEXTWRAP.WRAP_OFF ]:  lng( "base_opt_disabled" ),
	[ TEXTWRAP.WRAP_ON ]:   lng( "base_opt_enabled" ),
}

/*
    Settings Tab
*/

export class SettingsSection extends PluginSettingTab
{
    readonly plugin:            GistrPlugin
    private Hide_Global:        boolean
    private Hide_Github:        boolean
    private Hide_Opengist:      boolean
    private Hide_SaveSync:      boolean
    private Hide_Support:       boolean
    private Tab_Global:         HTMLElement
    private Tab_Github:         HTMLElement
    private Tab_OpenGist:       HTMLElement
    private Tab_SaveSync:       HTMLElement
    private Tab_Support:        HTMLElement
    private Opacity_Enabled:    string
    private Opacity_Disabled:   string
    private Obj_Github_Api:     Setting
    private cPickr:             Record< string, ColorPicker >

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
        this.Hide_SaveSync      = true
		this.Hide_Support       = false
        this.Opacity_Enabled    = "1"
        this.Opacity_Disabled   = "0.4"
        this.Obj_Github_Api     = null
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
            .on( "init", ( color: Pickr.HSVaColor, instance: Pickr ) =>
            {
                const currColor = this.plugin.settings[ id ]
                pickr.setColor( currColor )
            } )

            .on( "show", ( color: Pickr.HSVaColor, instance: Pickr ) =>
            {
                if ( typeof bHidden !== "undefined" && bHidden( ) )
                    instance.hide( )
            } )

            .on( "save", ( color: Pickr.HSVaColor, instance: ColorPicker ) =>
            {

                const clr : Color = `#${ color.toHEXA( ).toString( ).substring( 1 ) }`

                this.plugin.settings[ id ] = clr
                this.plugin.saveSettings( )

                instance.hide( )
                instance.addSwatch( clr )
                instance.ActionSave( clr )

                this.plugin.renderModeReading( )
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
                    .setTooltip     ( lng( "pickr_restore_default_btn_tip" ) )
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
		this.Hide_SaveSync      = true
		this.Hide_Support       = false

        
        this.CreateHeader       ( containerEl )
		this.CreateMenus        ( containerEl )
    }

    /*
        Section -> Header
    */

    CreateHeader( elm: HTMLElement )
    {
        elm.empty( )
        elm.addClass( 'gistr-settings-modal' )
        elm.createEl( "p", { cls: "gistr-settings-section-header", text: lng( "cfg_modal_desc" ) } )
    }

    /*
        Create Menus
    */

	CreateMenus( elm: HTMLElement )
    {
        this.Tab_Global_New     ( elm )
		this.Tab_Global         = elm.createDiv( )

        this.Tab_OpenGist_New   ( elm )
		this.Tab_OpenGist       = elm.createDiv( )

        this.Tab_Github_New     ( elm )
		this.Tab_Github         = elm.createDiv( )

        this.Tab_SaveSync_New   ( elm )
        this.Tab_SaveSync       = elm.createDiv( )

        this.Tab_Support_New    ( elm )
		this.Tab_Support        = elm.createDiv( )

        this.Tab_Support_ShowSettings( this.Tab_Support )
	}

    /*
        Tab > General > New
    */

        Tab_Global_New( elm: HTMLElement )
        {
            const Tab_GN = elm.createEl( "h2", { text: lng( "cfg_tab_ge_title" ), cls: `gistr-settings-header${ this.Hide_Global?" isfold" : "" }` } )
            Tab_GN.addEventListener( "click", ( )=>
            {
                this.Hide_Global = !this.Hide_Global
                Tab_GN.classList.toggle( "isfold", this.Hide_Global )
                this.Tab_Global_CreateSettings( )
            } )
        }

        Tab_Global_CreateSettings( )
        {
            this.Tab_Global.empty( )
            if ( this.Hide_Global ) return
            
            this.Tab_Global_ShowSettings( this.Tab_Global )
        }

        Tab_Global_ShowSettings( elm: HTMLElement )
        {

            /*
                Github > Header Intro
            */

            elm.createEl( 'small', { cls: "gistr-settings-section-description", text: lng( "cfg_tab_ge_header" ) } )

            /*
                Codeblock > Theme
            */

            const cfg_tab_ge_theme_desc = new DocumentFragment( )
            cfg_tab_ge_theme_desc.append(
                sanitizeHTMLToDom( `${ lng( "cfg_tab_ge_theme_desc" ) }` ),
            )

            new NoxComponent( elm )
                .setName( lng( "cfg_tab_ge_theme_name" ) )
                .setDesc( cfg_tab_ge_theme_desc )
                .setClass( "gistr-dropdown" )
                .addNoxDropdown( dropdown => dropdown
                    .addOption( THEMES.LIGHT, GetTheme[ THEMES.LIGHT ] )
                    .addOption( THEMES.DARK, GetTheme[ THEMES.DARK ] )
                    .setValue( this.plugin.settings.theme )
                    .onChange( async ( val ) =>
                    {
                        this.plugin.settings.theme = val
                        await this.plugin.saveSettings( )
                        this.plugin.renderModeReading( )
                    }),
                    ( ) =>
                    ( 
                        SettingsDefaults.theme as string
                    ),
                )

            elm.createEl( 'div', { cls: "gistr-settings-section-separator", text: "" } )

            /*
                Dropdown > Text Wrap
            */

            const cfg_tab_ge_wrap_desc = new DocumentFragment( )
            cfg_tab_ge_wrap_desc.append(
                sanitizeHTMLToDom( `${ lng( "cfg_tab_ge_wrap_desc" ) }` ),
            )

            new NoxComponent( elm )
                .setName( lng( "cfg_tab_ge_wrap_name" ) )
                .setDesc( cfg_tab_ge_wrap_desc )
                .setClass( "gistr-dropdown" )
                .addNoxDropdown( dropdown => dropdown
                    .addOption( TEXTWRAP.WRAP_OFF, GetTextwrap[ TEXTWRAP.WRAP_OFF ] )
                    .addOption( TEXTWRAP.WRAP_ON, GetTextwrap[ TEXTWRAP.WRAP_ON ] )
                    .setValue( this.plugin.settings.textwrap )
                    .onChange( async ( val ) =>
                    {
                        this.plugin.settings.textwrap = val
                        await this.plugin.saveSettings( )
                        this.plugin.renderModeReading( )
                    }),
                    ( ) =>
                    ( 
                        SettingsDefaults.textwrap as string
                    ),
                )

                elm.createEl( 'div', { cls: "gistr-settings-section-separator", text: "" } )

            /*
                Command Keyword

                changing this will cause all opengist portals to not function until the keyword is changed
                within the box.
            */

                const cfg_tab_ge_keyword_desc = new DocumentFragment( )
                cfg_tab_ge_keyword_desc.append(
                    sanitizeHTMLToDom( `${ lng( "cfg_tab_ge_keyword_desc" ) }` ),
                )
    
                new NoxComponent( elm )
                    .setName( lng( "cfg_tab_ge_keyword_name" ) )
                    .setDesc( cfg_tab_ge_keyword_desc )
                    .addNoxTextbox( text => text
                        .setValue( this.plugin.settings.keyword )
                        .onChange( async ( val ) =>
                        {
                            this.plugin.settings.keyword = val
                            await this.plugin.saveSettings( )
                            this.plugin.renderModeReading( )
                        }),
                        ( ) =>
                        ( 
                            SettingsDefaults.keyword.toString( ) as string
                        ),
                    )

                elm.createEl( 'div', { cls: "gistr-settings-section-separator", text: "" } )

            /*
                Plugin update notifications
            */

            const cfg_tab_ge_noti_update_desc = new DocumentFragment( )
            cfg_tab_ge_noti_update_desc.append(
                sanitizeHTMLToDom( `${ lng( "cfg_tab_ge_noti_update_desc" ) }` ),
            )

            new NoxComponent( elm )
                .setName( lng( "cfg_tab_ge_noti_update_name" ) )
                .setDesc( cfg_tab_ge_noti_update_desc )
                .addNoxToggle( toggle => toggle
                    .setValue( this.plugin.settings.ge_enable_updatenoti )
                    .onChange( async ( val ) =>
                    {
                        this.plugin.settings.ge_enable_updatenoti = val
                        await this.plugin.saveSettings( )
                    }),
                    ( ) =>
                    ( 
                        SettingsDefaults.ge_enable_updatenoti as boolean
                    ),
                )

            elm.createEl( 'div', { cls: "gistr-settings-section-separator", text: "" } )

            /*
                Notification Time (in seconds)
            */

            const cfg_tab_ge_noti_dur_desc = new DocumentFragment( )
            cfg_tab_ge_noti_dur_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_ge_noti_dur_desc" ) }`),
            )

            let val_st_notitime: HTMLDivElement
            new NoxComponent( elm )
                .setName( lng( "cfg_tab_ge_noti_dur_name" ) )
                .setDesc( cfg_tab_ge_noti_dur_desc )
                .setClass( "gistr-slider" )
                .addNoxSlider( slider => slider
                    .setLimits( 0, 120, 1 )
                    .setDynamicTooltip( )
                    .setValue( this.plugin.settings.notitime )
                    .onChange( async ( val ) =>
                    {
                        val_st_notitime.innerText       = " " + val.toString( ) + "s"

                        this.plugin.settings.notitime = val
                        await this.plugin.saveSettings( )
                    }),
                    ( ) =>
                    ( 
                        SettingsDefaults.notitime as number
                    ),
                ).settingEl.createDiv( '', ( el ) =>
                {
                    val_st_notitime         = el
                    el.innerText            = " " + this.plugin.settings.notitime.toString( ) + "s"
                } ).classList.add( 'gistr-settings-elm-slider-preview' )

            elm.createEl( 'div', { cls: "gistr-settings-section-separator", text: "" } )

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

            const cfg_tab_og_cb_light_desc = new DocumentFragment( )
            cfg_tab_og_cb_light_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_og_cb_light_desc" ) }`),
            )

            new Setting( elm )
                .setName( lng( "cfg_tab_og_cb_light_name" ) )
                .setDesc( cfg_tab_og_cb_light_desc )
                .then( ( setting ) => { this.new_ColorPicker
                (
                    this.plugin, elm, setting,
                    "og_clr_bg_light",
                ) } )

            /*
                Background color (Dark)
            */

            const cfg_tab_og_cb_dark_desc = new DocumentFragment( )
            cfg_tab_og_cb_dark_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_og_cb_dark_desc" ) }`),
            )

            new Setting( elm )
                .setName( lng( "cfg_tab_og_cb_dark_name" ) )
                .setDesc( cfg_tab_og_cb_dark_desc )
                    .then( ( setting ) => { this.new_ColorPicker
                    (
                        this.plugin, elm, setting,
                        "og_clr_bg_dark",
                ) } )

            /*
                Text color (Light)
            */

            const cfg_tab_og_tx_light_desc = new DocumentFragment( )
            cfg_tab_og_tx_light_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_og_tx_light_desc" ) }`),
            )

            new Setting( elm )
                .setName( lng( "cfg_tab_og_tx_light_name" ) )
                .setDesc( cfg_tab_og_tx_light_desc )
                .then( ( setting ) => { this.new_ColorPicker
                (
                    this.plugin, elm, setting,
                    "og_clr_tx_light",
                ) } )

            /*
                Text color (Dark)
            */

            const cfg_tab_og_tx_dark_desc = new DocumentFragment( )
            cfg_tab_og_tx_dark_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_og_tx_dark_desc" ) }`),
            )

            new Setting( elm )
                .setName( lng( "cfg_tab_og_tx_dark_name" ) )
                .setDesc( cfg_tab_og_tx_dark_desc )
                    .then( ( setting ) => { this.new_ColorPicker
                    (
                        this.plugin, elm, setting,
                        "og_clr_tx_dark",
                ) } )

            /*
                Scrollbar Track Color (Light)
            */

            const cfg_tab_og_sb_light_desc = new DocumentFragment( )
            cfg_tab_og_sb_light_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_og_sb_light_desc" ) }`),
            )

            new Setting( elm )
                .setName( lng( "cfg_tab_og_sb_light_name" ) )
                .setDesc( cfg_tab_og_sb_light_desc )
                    .then( ( setting ) => { this.new_ColorPicker
                    (
                        this.plugin, elm, setting,
                        "og_clr_sb_light",
                ) } )

            /*
                Scrollbar Track Color (Dark)
            */

            const cfg_tab_og_sb_dark_desc = new DocumentFragment( )
            cfg_tab_og_sb_dark_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_og_sb_dark_desc" ) }`),
            )

            new Setting( elm )
                .setName( lng( "cfg_tab_og_sb_dark_name" ) )
                .setDesc( cfg_tab_og_sb_dark_desc )
                    .then( ( setting ) => { this.new_ColorPicker
                    (
                        this.plugin, elm, setting,
                        "og_clr_sb_dark",
                ) } )

            /*
                Codeblock Opacity
            */

            const cfg_tab_og_opacity_desc = new DocumentFragment( )
            cfg_tab_og_opacity_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_og_opacity_desc" ) }`),
            )

            let val_og_opacity: HTMLDivElement
            new NoxComponent( elm )
                .setName( lng( "cfg_tab_og_opacity_name" ) )
                .setDesc( cfg_tab_og_opacity_desc )
                .setClass( "gistr-slider" )
                .addNoxSlider( slider => slider
                    .setDynamicTooltip( )
                    .setLimits( 0.20, 1, 0.05 )
                    .setValue( this.plugin.settings.og_opacity )
                    .onChange( async ( val ) =>
                    {
                        const opacity_calc          = val * 100
                        val_og_opacity.innerText    = " " + opacity_calc.toString( ) + "%"

                        this.plugin.settings.og_opacity = val
                        await this.plugin.saveSettings( )
                        this.plugin.renderModeReading( )
                    }),
                    ( ) =>
                    ( 
                        SettingsDefaults.og_opacity as number
                    ),
                ).settingEl.createDiv( '', ( el ) =>
                {
                    val_og_opacity          = el
                    const opacity_calc      = this.plugin.settings.og_opacity * 100
                    el.innerText            = " " + opacity_calc.toString( ) + "%"
                } ).classList.add( 'gistr-settings-elm-slider-preview' )

            /*
                Codeblock > Padding > Top
            */

            const cfg_tab_og_pad_top_desc = new DocumentFragment( )
            cfg_tab_og_pad_top_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_og_pad_top_desc" ) }`),
            )

            let val_og_padding_top: HTMLDivElement
            new NoxComponent( elm )
                .setName( lng( "cfg_tab_og_pad_top_name" ) )
                .setDesc( cfg_tab_og_pad_top_desc )
                .setClass( "gistr-slider" )
                .addNoxSlider( slider => slider
                    .setDynamicTooltip( )
                    .setLimits( 0, 30, 1 )
                    .setValue( this.plugin.settings.blk_pad_t )
                    .onChange( async ( val ) =>
                    {
                        const padding_calc              = val
                        val_og_padding_top.innerText    = " " + padding_calc.toString( ) + "px"

                        this.plugin.settings.blk_pad_t = val
                        await this.plugin.saveSettings( )
                        this.plugin.renderModeReading( )
                    }),
                    ( ) =>
                    ( 
                        SettingsDefaults.blk_pad_t as number
                    ),
                ).settingEl.createDiv( '', ( el ) =>
                {
                    val_og_padding_top      = el
                    const padding_calc      = this.plugin.settings.blk_pad_t
                    el.innerText            = " " + padding_calc.toString( ) + "px"
                } ).classList.add( 'gistr-settings-elm-slider-preview' )

            /*
                Codeblock > Padding > Bottom
            */

            const cfg_tab_og_pad_btm_desc = new DocumentFragment( )
            cfg_tab_og_pad_btm_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_og_pad_btm_desc" ) }`),
            )

            let val_og_padding_btm: HTMLDivElement
            new NoxComponent( elm )
                .setName( lng( "cfg_tab_og_pad_btm_name" ) )
                .setDesc( cfg_tab_og_pad_btm_desc )
                .setClass( "gistr-slider" )
                .addNoxSlider( slider => slider
                    .setDynamicTooltip( )
                    .setLimits( 0, 30, 1 )
                    .setValue( this.plugin.settings.blk_pad_b )
                    .onChange( async ( val ) =>
                    {
                        const padding_calc              = val
                        val_og_padding_btm.innerText    = " " + padding_calc.toString( ) + "px"

                        this.plugin.settings.blk_pad_b = val
                        await this.plugin.saveSettings( )
                        this.plugin.renderModeReading( )
                    }),
                    ( ) =>
                    ( 
                        SettingsDefaults.blk_pad_b as number
                    ),
                ).settingEl.createDiv( '', ( el ) =>
                {
                    val_og_padding_btm      = el
                    const padding_calc      = this.plugin.settings.blk_pad_b
                    el.innerText            = " " + padding_calc.toString( ) + "px"
                } ).classList.add( 'gistr-settings-elm-slider-preview' )

            /*
                Codeblock > CSS Override
            */

            const cfg_tab_og_css_desc = new DocumentFragment( )
            cfg_tab_og_css_desc.append(
                sanitizeHTMLToDom( `${ lng( "cfg_tab_og_css_desc" ) }` ),
            )

            new NoxComponent( elm )
                .setName( lng( "cfg_tab_og_css_name" ) )
                .setDesc( cfg_tab_og_css_desc )
                .setClass( "gistr-settings-elm-textarea" )
                .addNoxTextarea( text => text
                    .setPlaceholder( lng( "cfg_tab_og_css_pholder" ) )
                    .setValue( this.plugin.settings.css_og )
                    .onChange( async ( val ) =>
                    {
                        this.plugin.settings.css_og = val
                        await this.plugin.saveSettings( )
                        this.plugin.renderModeReading( )
                    }),
                    ( ) =>
                    ( 
                        SettingsDefaults.css_og.toString( ) as string
                    ),
                )

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
            
            /*
                Get github api status
            */

            let json_delay = 0.5 * 1000
            const gh_status = requestUrl( "https://www.githubstatus.com/api/v2/summary.json" ).then( ( res ) =>
            {
                if ( res.status === 200 )
                    return res.json.components[ 0 ].status || lng( "gist_status_issues" )
                else
                    return lng( "gist_status_issues" )
            } )

            const Tab_GH    = elm.createEl( "h2",       { text: "", cls: `gistr-settings-header-sublevel` } )
            const Tab_GH_L  = Tab_GH.createEl( "h2",    { text: lng( "cfg_tab_gh_title" ), cls: `gistr-settings-header-int-l${ this.Hide_Github?" isfold" : "" }` } )
            const Tab_GH_R  = Tab_GH.createEl( "h2",    { text: " ", cls: `gistr-settings-header-int-r` } )
            const Tab_GH_C  = Tab_GH.createEl( "div",   { text: "", cls: `gistr-settings-header-int-c` } )

            new Setting( Tab_GH_R )
                .addText( async ( text ) =>
                {
                    text
                        .setPlaceholder ( lng( "gist_status_connecting" ) )
                        .setValue       ( lng( "gist_status_connecting" ) )
                        .setDisabled    ( true )

                        const el        = Tab_GH_R.querySelector( ".setting-item-control" )
                        el.addClass     ( "gistr-settings-status-connecting" )

                    /*
                        Fetch Github API status
                            - operational
                            - degraded_performance
                            - partial_outage
                            - major_outage
                    */

                    let github_status = await gh_status

                    setTimeout( function( )
                    {

                        /*
                            Find API status language entry in array
                        */

                        const gb_api_status: string = GHStatusAPI[ github_status ]

                        /*
                            Text > Github Token Not Specified
                        */

                        if ( !GHTokenGet( ) )
                        {
                            const el                    = Tab_GH_R.querySelector( ".setting-item-control" )
                            el.removeClass              ( "gistr-settings-status-connecting" )
                            el.addClass                 ( "gistr-settings-status-error" )
                            text.inputEl.setAttribute   ( "size", lng( "gist_status_no_api" ).length.toString( ) )
                            text.setValue               ( lng( "gist_status_no_api" ) )

                            return
                        }

                        /*
                            Text > Github API > Operational
                        */

                        if ( github_status === lng( "gist_status_operational_raw" ) )
                        {
                            const el                    = Tab_GH_R.querySelector( ".setting-item-control" )
                            el.removeClass              ( "gistr-settings-status-connecting" )
                            el.addClass                 ( "gistr-settings-status-success" )
                            text.inputEl.setAttribute   ( "size", lng( "gist_status_connected" ).length.toString( ) )
                            text.setValue               ( lng( "gist_status_connected" ) )
                        }
                        else if ( github_status === lng( "gist_status_issues" ) )
                        {
                            text.inputEl.setAttribute   ( "size", lng( "gist_status_noconnection" ).length.toString( ) )
                            text.setValue               (  lng( "gist_status_noconnection" ) )
                        }
                        else
                        {

                            /*
                                Button > Github API > Connection Issue
                            */

                            const el                    = Tab_GH_R.querySelector( ".setting-item-control" )
                            el.removeClass              ( "gistr-settings-status-connecting" )
                            el.addClass                 ( "gistr-settings-status-warning" )
                            text.inputEl.setAttribute   ( "size", gb_api_status.length.toString( ) )
                            text.setValue               ( gb_api_status )
                        }
                    }, json_delay )
                } )
                .addExtraButton( async ( btn ) =>
                {
                    btn
                    .setIcon        ( 'circle-off' )
                    .setTooltip     ( lng( "gist_status_connecting_btn_tip" ) )

                    btn.extraSettingsEl.classList.add( "gistr-settings-icon-cur" )
                    btn.extraSettingsEl.classList.add( "gistr-anim-spin" )
                    btn.extraSettingsEl.classList.add( "gistr-settings-status-connecting" )

                    /*
                        Fetch Github API status
                            - operational
                            - degraded_performance
                            - partial_outage
                            - major_outage
                    */

                    let github_status = await gh_status

                    setTimeout( function( )
                    {

                        /*
                            Find API status language entry in array
                        */

                        const gb_api_status:  string = GHStatusAPI[ github_status ]

                        /*
                            Text > Github Token Not Specified
                        */

                            if ( !GHTokenGet( ) )
                            {
                                btn.setIcon     ( "circle-off" )
                                btn.setTooltip  ( lng( "gist_status_no_api_btn_tip" ) )
    
                                btn.extraSettingsEl.classList.remove     ( "gistr-settings-status-connecting" )
                                btn.extraSettingsEl.classList.add        ( "gistr-settings-icon-error" )
                                btn.extraSettingsEl.classList.remove     ( "gistr-settings-icon-ok" )
    
                                return
                            }

                        /*
                            Button > Github API > Operational
                        */

                        if ( github_status === lng( "gist_status_operational_raw" ) )
                        {
                            btn.setIcon     ( "github" )
                            btn.setTooltip  ( lng( "gist_status_success_btn_tip" ) )

                            btn.extraSettingsEl.classList.remove     ( "gistr-settings-status-connecting" )
                            btn.extraSettingsEl.classList.add        ( "gistr-settings-icon-ok" )
                        }
                        else
                        {

                            /*
                                Button > Github API > Connection Issue
                            */

                            btn.setIcon     ( "circle-off" )
                            btn.setTooltip  ( lng( "gist_status_issues_btn_tip" ) )

                            btn.extraSettingsEl.classList.remove     ( "gistr-settings-status-connecting" )
                            btn.extraSettingsEl.classList.add        ( "gistr-settings-icon-error" )
                            btn.extraSettingsEl.classList.remove     ( "gistr-settings-icon-ok" )
                        }

                        btn.onClick( ( ) =>
                        {
                            window.open( "https://www.githubstatus.com/" )
                        } )

                    }, json_delay )
                } )


            Tab_GH_L.addEventListener( "click", ( )=>
            {
                this.Hide_Github = !this.Hide_Github
                Tab_GH_L.classList.toggle( "isfold", this.Hide_Github )
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

            /*
                Github > Define
            */

            const gistToken = GHTokenGet( )

            /*
                Section -> Support Buttons
            */

            elm.createEl( 'small', { cls: "gistr-settings-section-description", text: lng( "cfg_tab_gh_header" ) } )

            /*
                Personal Access Token > Description

                This is used for sharing gists between the obsidian vault and Github Gist.
            */

            const DOM_Token_Desc = new DocumentFragment( )
            DOM_Token_Desc.append(
                sanitizeHTMLToDom(`
                    ${ lng( "cfg_tab_gh_pat_desc_l1" ) }
                    <br />
                    <br />
                    ${ lng( "cfg_tab_gh_pat_desc_l2" ) }
                    <ul>
                        <li class="gistr-settings-elm-li">
                            ${ lng( "cfg_tab_gh_pat_perm_1" ) }
                        </li>
                        <li class="gistr-settings-elm-li">
                            ${ lng( "cfg_tab_gh_pat_perm_2" ) }
                        </li>
                        <li class="gistr-settings-elm-li">
                            ${ lng( "cfg_tab_gh_pat_perm_3" ) }
                        </li>
                        <li class="gistr-settings-elm-li">
                            ${ lng( "cfg_tab_gh_pat_perm_4" ) }
                        </li>
                    </ul>
                    <br />
                    ${ lng( "cfg_tab_gh_pat_footer" ) }
                    <br />
                    ${ lng( "cfg_tab_gh_pat_help" ) }
                `),
            )

            /*
                Personal Access Token

                This is used for sharing gists between the obsidian vault and Github Gist.
            */

            let val_Token:      HTMLInputElement | null = null
            let btn_Github:     ExtraButtonComponent

            this.Obj_Github_Api = new Setting( elm )
                .setName( lng( "cfg_tab_gh_pat_name" ) )
                .setDesc( DOM_Token_Desc )
                .addText( ( val ) =>
                {
                    val_Token           = val.inputEl
                    val.inputEl.type    = 'password'

                    val.setPlaceholder( lng( "cfg_tab_gh_pat_pholder" ) )
                    .setValue( gistToken ?? '' )
                    .onChange( async ( val ) =>
                    {
                        const input_PAT         = val.trim( )
                        const b_PAT_Token       = /^github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}$/g.test( input_PAT )
                        const b_PAT_Classic     = /^ghp_[A-Za-z0-9_]{36,251}$/g.test( input_PAT )

                        /*
                            Personal Access Token Valid
                        */

                        if ( b_PAT_Token || b_PAT_Classic )
                        {
                            btn_Github.setIcon      ( 'check' )
                            btn_Github.setTooltip   ( lng( "cfg_tab_gh_pat_ok_btn_tip" ) )

                            btn_Github.extraSettingsEl.classList.add        ( "gistr-settings-icon-ok" )
                            btn_Github.extraSettingsEl.classList.remove     ( "gistr-settings-icon-github" )
                            btn_Github.extraSettingsEl.classList.remove     ( "gistr-settings-icon-invalid" )

                            let token_Type = lng( "cfg_tab_gh_pat_notice_type_fine" )
                            if ( b_PAT_Classic )
                                token_Type = lng( "cfg_tab_gh_pat_notice_type_classic" )

                            new Notice ( lng( "cfg_tag_gh_pat_notice_msg_success" ) + "\n\n" + token_Type )

                            GHTokenSet( input_PAT )

                            this.display( )
                        }
                        else
                        {

                            /*
                                Personal Access Token > invalid
                            */

                            if ( input_PAT.length > 0 )
                            {
                                btn_Github.setTooltip       ( lng( "cfg_tab_gh_pat_invalid_btn_tip" ) )

                                btn_Github.extraSettingsEl.classList.add        ( "gistr-settings-icon-invalid" )
                                btn_Github.extraSettingsEl.classList.remove     ( "gistr-settings-icon-github" )
                                btn_Github.extraSettingsEl.classList.remove     ( "gistr-settings-icon-ok" )
                            }

                            /*
                                Personal Access Token > Empty
                            */

                            else
                            {
                                btn_Github.setIcon          ( 'github' )
                                btn_Github.setTooltip       ( lng( "cfg_tab_gh_pat_bad_btn_tip" ) )

                                btn_Github.extraSettingsEl.classList.add        ( "gistr-settings-icon-github" )
                                btn_Github.extraSettingsEl.classList.remove     ( "gistr-settings-icon-ok" )
                                btn_Github.extraSettingsEl.classList.remove     ( "gistr-settings-icon-invalid" )

                                GHTokenSet( "" )

                                new Notice ( lng( "cfg_tag_gh_pat_notice_msg_cleared" ) )
                            }
                        }
                    } )
                } )

                .addExtraButton( ( btn ) =>
                {
                    const btn_Visibility = ( bTokenVis: boolean ) =>
                    {
                        btn
                            .setIcon        ( bTokenVis ? 'eye' : 'eye-off' )
                            .setTooltip     ( bTokenVis ? lng( "cfg_tab_gh_pat_btn_tip_state_show" ) : lng( "cfg_tab_gh_pat_btn_tip_state_hide" ) )

                            btn.extraSettingsEl.classList.add( "gistr-settings-icon-cur" )
                    }

                    btn_Visibility( true )

                    btn.onClick( ( ) =>
                    {
                        if ( !val_Token ) return

                        if ( val_Token.type === 'password' )
                        {
                            val_Token.type = 'text'
                            btn_Visibility( false )
                        }
                        else
                        {
                            val_Token.type = 'password'
                            btn_Visibility( true )
                        }
                    } )
                } )

                .addExtraButton( ( btn ) =>
                {
                    btn_Github = btn
                    const btn_GetTokenStatus = ( bHasValue: boolean ) =>
                    {
                        btn
                            .setIcon        ( 'github' )
                            .setTooltip     ( lng( "cfg_tab_gh_pat_bad_btn_tip" ) )

                            btn.extraSettingsEl.classList.add( "gistr-settings-icon-cur" )
                            btn.extraSettingsEl.classList.add( "gistr-settings-icon-github" )

                            const b_PAT_Token       = /^github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}$/g.test( gistToken )
                            const b_PAT_Classic     = /^ghp_[A-Za-z0-9_]{36,251}$/g.test( gistToken )

                            if ( b_PAT_Token == true || b_PAT_Classic == true )
                            {
                                btn_Github.setIcon      ( 'check' )
                                btn_Github.setTooltip   ( lng( "cfg_tab_gh_pat_ok_btn_tip" ) )

                                btn_Github.extraSettingsEl.classList.add        ( "gistr-settings-icon-ok" )
                                btn_Github.extraSettingsEl.classList.remove     ( "gistr-settings-icon-github" )
                            }
                            else
                            {
                                btn_Github.setIcon      ( 'github' )
                                btn_Github.setTooltip   ( lng( "cfg_tab_gh_pat_bad_btn_tip" ) )
                                
                                btn_Github.extraSettingsEl.classList.add        ( "gistr-settings-icon-github" )
                                btn_Github.extraSettingsEl.classList.remove     ( "gistr-settings-icon-ok" )
                            }
                    }

                    btn_GetTokenStatus( true )
                    btn.onClick( ( ) =>
                    {
                        window.open( lng( "cfg_tab_gh_pat_url_btn" ) )
                    } )
                } )


            /*
                Background color (Light)
            */

            const cfg_tab_gh_cb_light_desc = new DocumentFragment( )
            cfg_tab_gh_cb_light_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_gh_cb_light_desc" ) }`),
            )

            new Setting( elm )
                .setName( lng( "cfg_tab_gh_cb_light_name" ) )
                .setDesc( cfg_tab_gh_cb_light_desc )
                .then( ( setting ) => { this.new_ColorPicker
                (
                    this.plugin, elm, setting,
                    "gh_clr_bg_light",
                ) } )

            /*
                Background color (Dark)
            */

            const cfg_tab_gh_cb_dark_desc = new DocumentFragment( )
            cfg_tab_gh_cb_dark_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_gh_cb_dark_desc" ) }`),
            )

            new Setting( elm )
                .setName( lng( "cfg_tab_gh_cb_dark_name" ) )
                .setDesc( cfg_tab_gh_cb_dark_desc )
                    .then( ( setting ) => { this.new_ColorPicker
                    (
                        this.plugin, elm, setting,
                        "gh_clr_bg_dark",
                ) } )

            /*
                Text color (Light)
            */

            const cfg_tab_gh_tx_light_desc = new DocumentFragment( )
            cfg_tab_gh_tx_light_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_gh_tx_light_desc" ) }`),
            )

            new Setting( elm )
                .setName( lng( "cfg_tab_gh_tx_light_name" ) )
                .setDesc( cfg_tab_gh_tx_light_desc )
                .then( ( setting ) => { this.new_ColorPicker
                (
                    this.plugin, elm, setting,
                    "gh_clr_tx_light",
                ) } )

            /*
                Text color (Dark)
            */

            const cfg_tab_gh_tx_dark_desc = new DocumentFragment( )
            cfg_tab_gh_tx_dark_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_gh_tx_dark_desc" ) }`),
            )

            new Setting( elm )
                .setName( lng( "cfg_tab_gh_tx_dark_name" ) )
                .setDesc( cfg_tab_gh_tx_dark_desc )
                    .then( ( setting ) => { this.new_ColorPicker
                    (
                        this.plugin, elm, setting,
                        "gh_clr_tx_dark",
                ) } )


            /*
                Scrollbar Track Color (Light)
            */

            const cfg_tab_gh_sb_light_name = new DocumentFragment( )
            cfg_tab_gh_sb_light_name.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_gh_sb_light_desc" ) }`),
            )

            new Setting( elm )
                .setName( lng( "cfg_tab_gh_sb_light_name" ) )
                .setDesc( cfg_tab_gh_sb_light_name )
                    .then( ( setting ) => { this.new_ColorPicker
                    (
                        this.plugin, elm, setting,
                        "gh_clr_sb_light",
                ) } )

            /*
                Scrollbar Track Color (Dark)
            */

            const cfg_tab_gh_sb_dark_desc = new DocumentFragment( )
            cfg_tab_gh_sb_dark_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_gh_sb_dark_desc" ) }`),
            )

            new Setting( elm )
                .setName( lng( "cfg_tab_gh_sb_dark_name" ) )
                .setDesc( cfg_tab_gh_sb_dark_desc )
                    .then( ( setting ) => { this.new_ColorPicker
                    (
                        this.plugin, elm, setting,
                        "gh_clr_sb_dark",
                ) } )

            /*
                Codeblock Opacity
            */

            const cfg_tab_gh_opacity_desc = new DocumentFragment( )
            cfg_tab_gh_opacity_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_gh_opacity_desc" ) }`),
            )

            let val_gh_opacity: HTMLDivElement
            new NoxComponent( elm )
                .setName( lng( "cfg_tab_gh_opacity_name" ) )
                .setDesc( cfg_tab_gh_opacity_desc )
                .setClass( "gistr-slider" )
                .addNoxSlider( slider => slider
                    .setDynamicTooltip( )
                    .setLimits( 0.20, 1, 0.05 )
                    .setValue( this.plugin.settings.gh_opacity )
                    .onChange( async ( val ) =>
                    {
                        const opacity_calc          = val * 100
                        val_gh_opacity.innerText    = " " + opacity_calc.toString( ) + "%"

                        this.plugin.settings.gh_opacity = val
                        await this.plugin.saveSettings( )
                        this.plugin.renderModeReading( )
                    }),
                    ( ) =>
                    ( 
                        SettingsDefaults.gh_opacity as number
                    ),
                ).settingEl.createDiv( '', ( el ) =>
                {
                    val_gh_opacity          = el
                    const opacity_calc      = this.plugin.settings.gh_opacity * 100
                    el.innerText            = " " + opacity_calc.toString( ) + "%"
                } ).classList.add( 'gistr-settings-elm-slider-preview' )

            /*
                Codeblock > CSS Override
            */

            const cfg_tab_gh_css_desc = new DocumentFragment( )
            cfg_tab_gh_css_desc.append(
                sanitizeHTMLToDom( `${ lng( "cfg_tab_gh_css_desc" ) }` ),
            )

            let gh_css = new NoxComponent( elm )
                .setName( lng( "cfg_tab_gh_css_name" ) )
                .setDesc( cfg_tab_gh_css_desc )
                .setClass( "gistr-settings-elm-textarea" )
                .addNoxTextarea( text => text
                    .setPlaceholder( lng( "cfg_tab_gh_css_pholder" ) )
                    .setValue( this.plugin.settings.css_gh )
                    .onChange( async ( val ) =>
                    {
                        this.plugin.settings.css_gh = val
                        await this.plugin.saveSettings( )
                        this.plugin.renderModeReading( )
                    }),
                    ( ) =>
                    ( 
                        SettingsDefaults.css_gh.toString( ) as string
                    ),
                )
                
            /*
                Tab Footer Spacer
            */

            elm.createEl( 'div', { cls: "gistr-settings-section-footer", text: "" } )
        }

    /*
        Tab > Save & Sync > New
    */

        Tab_SaveSync_New( elm: HTMLElement )
        {
            const Tab_SY = elm.createEl( "h2", { text: lng( "cfg_tab_sy_title" ), cls: `gistr-settings-header${ this.Hide_SaveSync?" isfold" : "" }` } )
            Tab_SY.addEventListener( "click", ( )=>
            {
                this.Hide_SaveSync = !this.Hide_SaveSync
                Tab_SY.classList.toggle( "isfold", this.Hide_SaveSync )
                this.Tab_SaveSync_CreateSettings( )
            } )
        }

        Tab_SaveSync_CreateSettings( )
        {
            this.Tab_SaveSync.empty( )
            if ( this.Hide_SaveSync ) return
            
            this.Tab_SaveSync_ShowSettings( this.Tab_SaveSync )
        }

        Tab_SaveSync_ShowSettings( elm: HTMLElement )
        {

            let setting_allow_gist_updates: NoxComponent
            let setting_autosave_enable:    NoxComponent
            let setting_autosave_strict:    NoxComponent
            let setting_autosave_noti:      NoxComponent
            let setting_autosave_dur:       NoxComponent

            let bAutosaveEnabled            = this.plugin.settings.sy_enable_autosave

            /*
                Github > Header Intro
            */

            elm.createEl( 'small', { cls: "gistr-settings-section-description", text: lng( "cfg_tab_sy_header" ) } )

            /*
                Enable Allow Gist Updates

                Notes must be manually saved
            */

            const cfg_tab_sy_tog_allow_gist_updates_desc = new DocumentFragment( )
            cfg_tab_sy_tog_allow_gist_updates_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_sy_tog_allow_gist_updates_desc" ) }`),
            )

            setting_allow_gist_updates = new NoxComponent( elm )
                .setName( lng( "cfg_tab_sy_tog_allow_gist_updates_name" ) )
                .setDesc( cfg_tab_sy_tog_allow_gist_updates_desc )
                .addNoxToggle( toggle => toggle
                    .setValue( this.plugin.settings.sy_enable_autoupdate )
                    .onChange( async ( val ) =>
                    {
                        this.plugin.settings.sy_enable_autoupdate = val
                        await this.plugin.saveSettings( )
                    }),
                    ( ) =>
                    ( 
                        SettingsDefaults.sy_enable_autoupdate as boolean
                    ),
                )
                
            elm.createEl( 'div', { cls: "gistr-settings-section-separator", text: "" } )

            /*
                Autosave > Toggle
            */

            const cfg_tab_sy_tog_autosave_enable_desc = new DocumentFragment( )
            cfg_tab_sy_tog_autosave_enable_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_sy_tog_autosave_enable_desc" ) }`),
            )

            setting_autosave_enable = new NoxComponent( elm )
                .setName( lng( "cfg_tab_sy_tog_autosave_enable_name" ) )
                .setDesc( cfg_tab_sy_tog_autosave_enable_desc )
                .addNoxToggle( toggle => toggle
                    .setValue( this.plugin.settings.sy_enable_autosave )
                    .onChange( async ( val ) =>
                    {
                        this.plugin.settings.sy_enable_autosave = val
                        await this.plugin.saveSettings( )

                        setting_autosave_strict.setDisabled( !val )
                        setting_autosave_strict.settingEl.style.opacity = ( val == false ? this.Opacity_Disabled : this.Opacity_Enabled )

                        setting_autosave_noti.setDisabled( !val )
                        setting_autosave_noti.settingEl.style.opacity = ( val == false ? this.Opacity_Disabled : this.Opacity_Enabled )

                        setting_autosave_dur.setDisabled( !val )
                        setting_autosave_dur.settingEl.style.opacity = ( val == false ? this.Opacity_Disabled : this.Opacity_Enabled )
                    } ),
                    ( ) =>
                    ( 
                        SettingsDefaults.sy_enable_autosave as boolean
                    ),
                )

            elm.createEl( 'div', { cls: "gistr-settings-section-separator", text: "" } )

            /*
                Autosave > Strict Mode
            */

            const cfg_tab_sy_tog_autosave_strict_desc = new DocumentFragment( )
            cfg_tab_sy_tog_autosave_strict_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_sy_tog_autosave_strict_desc", this.plugin.settings.sy_save_duration.toString( ) ) }`),
            )

            setting_autosave_strict = new NoxComponent( elm )
                .setName( lng( "cfg_tab_sy_tog_autosave_strict_name" ) )
                .setDesc( cfg_tab_sy_tog_autosave_strict_desc )
                .addNoxToggle( toggle => toggle
                    .setValue( this.plugin.settings.sy_enable_autosave_strict )
                    .onChange( async ( val ) =>
                    {
                        this.plugin.settings.sy_enable_autosave_strict = val
                        await this.plugin.saveSettings( )
                    }),
                    ( ) =>
                    ( 
                        SettingsDefaults.sy_enable_autosave_strict as boolean
                    ),
                )

                setting_autosave_strict.setDisabled( !bAutosaveEnabled )
                setting_autosave_strict.settingEl.style.opacity = ( bAutosaveEnabled == false ? this.Opacity_Disabled : this.Opacity_Enabled )
                
            elm.createEl( 'div', { cls: "gistr-settings-section-separator", text: "" } )
                
            /*
                Autosave > Notifications
            */

            const cfg_tab_sy_tog_autosave_noti_desc = new DocumentFragment( )
            cfg_tab_sy_tog_autosave_noti_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_sy_tog_autosave_noti_desc" ) }`),
            )

            setting_autosave_noti = new NoxComponent( elm )
                .setName( lng( "cfg_tab_sy_tog_autosave_noti_name" ) )
                .setDesc( cfg_tab_sy_tog_autosave_noti_desc )
                .addNoxToggle( toggle => toggle
                    .setValue( this.plugin.settings.sy_enable_autosave_notice )
                    .onChange( async ( val ) =>
                    {
                        this.plugin.settings.sy_enable_autosave_notice = val
                        await this.plugin.saveSettings( )
                    }),
                    ( ) =>
                    ( 
                        SettingsDefaults.sy_enable_autosave_notice as boolean
                    ),
                )

                setting_autosave_noti.setDisabled( !bAutosaveEnabled )
                setting_autosave_noti.settingEl.style.opacity = ( bAutosaveEnabled == false ? this.Opacity_Disabled : this.Opacity_Enabled )

            elm.createEl( 'div', { cls: "gistr-settings-section-separator", text: "" } )

            /*
                Autosave > Duration
            */

            const cfg_tab_sy_num_save_dur_desc = new DocumentFragment( )
            cfg_tab_sy_num_save_dur_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_sy_num_save_dur_desc", this.plugin.settings.sy_save_duration.toString( ) ) }`),
            )

            let val_save_dur: HTMLDivElement
            setting_autosave_dur = new NoxComponent( elm )
                .setName( lng( "cfg_tab_sy_num_save_dur_name" ) )
                .setDesc( cfg_tab_sy_num_save_dur_desc )
                .setClass( "gistr-slider" )
                .addNoxSlider( slider => slider
                    .setLimits( 0, 120, 1 )
                    .setDynamicTooltip( )
                    .setValue( this.plugin.settings.sy_save_duration )
                    .onChange( async ( val ) =>
                    {
                        val_save_dur.innerText       = " " + val.toString( ) + "s"

                        this.plugin.settings.sy_save_duration = val
                        await this.plugin.saveSettings( )

                        const lng_desc_autosave_strict      = new DocumentFragment( )
                        lng_desc_autosave_strict.append     ( sanitizeHTMLToDom( `${ lng( "cfg_tab_sy_tog_autosave_strict_desc", this.plugin.settings.sy_save_duration.toString( ) ) }` ) )
                        setting_autosave_strict.setDesc     ( lng_desc_autosave_strict )

                        const lng_desc_autosave_duration    = new DocumentFragment( )
                        lng_desc_autosave_duration.append   ( sanitizeHTMLToDom( `${ lng( "cfg_tab_sy_num_save_dur_desc", this.plugin.settings.sy_save_duration.toString( ) ) }` ) )
                        setting_autosave_dur.setDesc        ( lng_desc_autosave_duration )
                    }),
                    ( ) =>
                    ( 
                        SettingsDefaults.sy_save_duration as number
                    ),
                )
                
                setting_autosave_dur.settingEl.createDiv( '', ( el ) =>
                {
                    val_save_dur        = el
                    el.innerText        = " " + this.plugin.settings.sy_save_duration.toString( ) + "s"
                } ).classList.add( 'gistr-settings-elm-slider-preview' )
                    
                setting_autosave_dur.setDisabled( !bAutosaveEnabled )
                setting_autosave_dur.settingEl.style.opacity = ( bAutosaveEnabled == false ? this.Opacity_Disabled : this.Opacity_Enabled )

            elm.createEl( 'div', { cls: "gistr-settings-section-separator", text: "" } )

            /*
                Include frontmatter when gist saved online
            */

            const cfg_tab_sy_tog_inc_fm_desc = new DocumentFragment( )
            cfg_tab_sy_tog_inc_fm_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_sy_tog_inc_fm_desc" ) }`),
            )

            new NoxComponent( elm )
                .setName( lng( "cfg_tab_sy_tog_inc_fm_name" ) )
                .setDesc( cfg_tab_sy_tog_inc_fm_desc )
                .addNoxToggle( toggle => toggle
                    .setValue( this.plugin.settings.sy_add_frontmatter )
                    .onChange( async ( val ) =>
                    {
                        this.plugin.settings.sy_add_frontmatter = val
                        await this.plugin.saveSettings( )
                    }),
                    ( ) =>
                    ( 
                        SettingsDefaults.sy_add_frontmatter as boolean
                    ),
                )

            elm.createEl( 'div', { cls: "gistr-settings-section-separator", text: "" } )

            /*
                Background color (Dark)
            */

            const cfg_tab_sy_list_icon_desc = new DocumentFragment( )
            cfg_tab_sy_list_icon_desc.append(
                sanitizeHTMLToDom(`${ lng( "cfg_tab_sy_list_icon_desc" ) }`),
            )

            new Setting( elm )
                .setName( lng( "cfg_tab_sy_list_icon_name" ) )
                .setDesc( cfg_tab_sy_list_icon_desc )
                    .then( ( setting ) => { this.new_ColorPicker
                    (
                        this.plugin, elm, setting,
                        "sy_clr_lst_icon",
                ) } )

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

            let json_delay = 0.5 * 1000
            const get_ver_stable = requestUrl( lng( "ver_url", "main" ) ).then( ( res ) =>
            {
                if ( res.status === 200 )
                    return res.json.version || lng( "cfg_tab_su_ver_connection_issues" )
                else
                    return lng( "cfg_tab_su_ver_connection_issues" )
            } )

            const get_ver_beta = requestUrl( lng( "ver_url", "beta" ) ).then( ( res ) =>
            {
                if ( res.status === 200 )
                    return res.json.version || lng( "cfg_tab_su_ver_connection_issues" )
                else
                    return lng( "cfg_tab_su_ver_connection_issues" )
            } )

            /*
                Section -> Support Buttons
            */

            elm.createEl( 'small', { cls: "gistr-settings-section-description", text: lng( "cfg_tab_su_desc" ) } )

            /*
                Current Version
            */

            const Tab_SU_Ver_Stable     = elm.createEl( "div",                  { text: "", cls: `gistr-settings-ver-sublevel` } )
            const Tab_SU_Ver_Stable_L   = Tab_SU_Ver_Stable.createEl( "div",    { text: lng( "cfg_tab_su_ver_cur_name" ), cls: `setting-item-name gistr-settings-ver-int-l` } )
            const Tab_SU_Ver_Stable_R   = Tab_SU_Ver_Stable.createEl( "div",    { text: " ", cls: `gistr-settings-ver-int-r` } )
            const Tab_SU_Ver_Stable_C   = Tab_SU_Ver_Stable.createEl( "div",    { text: "", cls: `gistr-settings-ver-int-c` } )
            const Tab_SU_Ver_Desc       = Tab_SU_Ver_Stable.createEl( "div",    { text: lng( "cfg_tab_su_ver_cur_desc" ), cls: `setting-item-description` } )

            new Setting( Tab_SU_Ver_Stable_R )
                .addText( async ( text ) =>
                {
                    text
                    .setPlaceholder( lng( "cfg_tab_su_ver_status_checking" ) )
                    .setValue( lng( "cfg_tab_su_ver_status_checking" ) )
                    .setDisabled( true )
                    .inputEl.setAttribute( "size", lng( "cfg_tab_su_ver_status_checking" ).length.toString( ) )

                    const el = Tab_SU_Ver_Stable_R.querySelector( ".setting-item-control" )
                    el.addClass( "gistr-settings-status-connecting" )

                    let ver_running     = this.plugin.manifest.version
                    let ver_stable      = await get_ver_stable
                    let ver_beta        = await get_ver_beta

                    setTimeout( function( )
                    {

                        /*
                            Text > Could not communicate with server and get stable / beta version
                        */

                        if ( ver_stable == lng( "cfg_tab_su_ver_connection_issues" ) || ver_beta == lng( "cfg_tab_su_ver_connection_issues" ) )
                        {
                            const el                = Tab_SU_Ver_Stable_R.querySelector( ".setting-item-control" )
                            el.removeClass          ( "gistr-settings-status-connecting" )
                            el.addClass             ( "gistr-settings-status-error" )
                            text.setValue           ( lng( "cfg_tab_su_ver_connection_issues" ) )
                        }
                        else
                        {
                            /*
                                Text > Beta version available
                            */

                            if ( gt( ver_beta, ver_stable ) && lt( ver_running, ver_beta ) )
                            {
                                const el            = Tab_SU_Ver_Stable_R.querySelector( ".setting-item-control" )
                                text.setValue       ( ver_running + "  ➜  " + ver_beta + "-beta" )
                            }

                            /*
                                Text > Stable version available
                            */

                            else if ( lt( ver_beta, ver_stable ) && lt( ver_running, ver_stable ) )
                            {
                                const el            = Tab_SU_Ver_Stable_R.querySelector( ".setting-item-control" )
                                text.setValue       ( ver_running + "  ➜  " + ver_stable + "-stable" )
                            }

                            /*
                                Text > No Updates
                            */

                            else
                            {
                                const el            = Tab_SU_Ver_Stable_R.querySelector( ".setting-item-control" )
                                el.removeClass      ( "gistr-settings-status-connecting" )
                                el.addClass         ( "gistr-settings-status-success" )
                                text.setValue       ( ver_running )
                            }
                        }

                        
                    }, json_delay )
                } )
                .addExtraButton( async ( btn ) =>
                {
                    btn
                    .setIcon        ( 'circle-off' )
                    .setTooltip     ( lng( "cfg_tab_su_ver_status_checking_btn_tip" ) )

                    btn.extraSettingsEl.classList.add( "gistr-settings-icon-cur" )
                    btn.extraSettingsEl.classList.add( "gistr-anim-spin" )
                    btn.extraSettingsEl.classList.add( "gistr-settings-status-connecting" )

                    let ver_running     = this.plugin.manifest.version
                    let ver_stable      = await get_ver_stable
                    let ver_beta        = await get_ver_beta

                    setTimeout( function( )
                    {

                        /*
                            Button > Could not communicate with server and get stable / beta version
                        */

                        if ( ver_stable == lng( "cfg_tab_su_ver_connection_issues" ) || ver_beta == lng( "cfg_tab_su_ver_connection_issues" ) )
                        {
                            btn.setIcon         ( "circle-off" )
                            btn.setTooltip      ( lng( "cfg_tab_su_ver_status_error_btn_tip" ) )

                            btn.extraSettingsEl.classList.remove     ( "gistr-settings-status-connecting" )
                            btn.extraSettingsEl.classList.add        ( "gistr-settings-icon-error" )
                            btn.extraSettingsEl.classList.remove     ( "gistr-settings-icon-ok" )
                        }
                        else
                        {

                            /*
                                Button > Beta version available
                            */

                            if ( gt( ver_beta, ver_stable ) && lt( ver_running, ver_beta ) )
                            {
                                btn.setTooltip                      ( lng( "cfg_tab_su_ver_status_new_beta_btn_tip" ) )
                                btn.setIcon                         ( "alert" )
                                btn.extraSettingsEl.classList.add   ( "gistr-settings-icon-update" )
                            }

                            /*
                                Button > Stable version available
                            */

                            else if ( lt( ver_beta, ver_stable ) && lt( ver_running, ver_stable ) )
                            {
                                btn.setTooltip                      ( lng( "cfg_tab_su_ver_status_new_stable_btn_tip" ) )
                                btn.setIcon                         ( "alert" )
                                btn.extraSettingsEl.classList.add   ( "gistr-settings-icon-update" )
                            }

                            /*
                                Button > No Updates
                            */

                            else
                            {
                                btn.setIcon                             ( "check" )
                                btn.setTooltip                          ( lng( "cfg_tab_su_ver_status_updated_btn_tip" ) )
                                btn.extraSettingsEl.classList.remove    ( "gistr-settings-status-connecting" )
                                btn.extraSettingsEl.classList.add       ( "gistr-settings-icon-ok" )
                            }
                        }

                        btn.onClick( ( ) =>
                        {
                            window.open( lng( "cfg_tab_su_ver_releases" ) )
                        } )

                    }, json_delay )
                } )

            elm.createEl( 'div', { cls: "gistr-settings-section-separator-15", text: "" } )

            /*
                GUID & UUID
            */

            const env_guid              = process.env.BUILD_GUID    // static
            const env_uuid              = process.env.BUILD_UUID    // dynamic

            const Tab_SU_GUID           = elm.createEl( "div",              { text: "", cls: `gistr-settings-ver-sublevel` } )
            const Tab_SU_GUID_L         = Tab_SU_GUID.createEl( "div",      { text: lng( "cfg_tab_su_guid_cur_name" ), cls: `setting-item-name gistr-settings-ver-int-l` } )
            const Tab_SU_GUID_R         = Tab_SU_GUID.createEl( "div",      { text: " ", cls: `gistr-settings-ver-int-r` } )
            const Tab_SU_GUID_C         = Tab_SU_GUID.createEl( "div",      { text: "", cls: `gistr-settings-ver-int-c` } )
            const Tab_SU_GUID_esc       = Tab_SU_GUID.createEl( "div",      { text: lng( "cfg_tab_su_guid_cur_desc" ), cls: `setting-item-description` } )

            new Setting( Tab_SU_GUID_R )
                .addText( async ( text ) =>
                {
                    text
                    .setPlaceholder( env_guid )
                    .setValue( env_guid )
                    .setDisabled( true )
                    .inputEl.setAttribute( "size", lng( "cfg_tab_su_ver_status_checking" ).length.toString( ) )

                    const el        = Tab_SU_GUID_R.querySelector( ".setting-item-control" )
                    el.addClass     ( "gistr-settings-support-build-id" )
                } )
                .addExtraButton( async ( btn ) =>
                {
                    btn
                    .setIcon        ( 'copy' )
                    .setTooltip     ( lng( "cfg_tab_su_guid_btn_tip" ) )

                    btn.onClick( ( ) =>
                    {
                        navigator.clipboard.writeText( env_guid )
                        new Notice( lng( "cfg_tab_su_guid_notice", env_guid ) )
                    } )
                } )

            elm.createEl( 'div', { cls: "gistr-settings-section-separator-15", text: "" } )

            /*
                GUID & UUID
            */

            const Tab_SU_UUID           = elm.createEl( "div",              { text: "", cls: `gistr-settings-ver-sublevel` } )
            const Tab_SU_UUID_L         = Tab_SU_UUID.createEl( "div",      { text: lng( "cfg_tab_su_uuid_cur_name" ), cls: `setting-item-name gistr-settings-ver-int-l` } )
            const Tab_SU_UUID_R         = Tab_SU_UUID.createEl( "div",      { text: " ", cls: `gistr-settings-ver-int-r` } )
            const Tab_SU_UUID_C         = Tab_SU_UUID.createEl( "div",      { text: "", cls: `gistr-settings-ver-int-c` } )
            const Tab_SU_UUID_esc       = Tab_SU_UUID.createEl( "div",      { text: lng( "cfg_tab_su_uuid_cur_desc" ), cls: `setting-item-description` } )

            new Setting( Tab_SU_UUID_R )
                .addText( async ( text ) =>
                {
                    text
                    .setPlaceholder( env_uuid )
                    .setValue( env_uuid )
                    .setDisabled( true )
                    .inputEl.setAttribute( "size", lng( "cfg_tab_su_ver_status_checking" ).length.toString( ) )

                    const el        = Tab_SU_UUID_R.querySelector( ".setting-item-control" )
                    el.addClass     ( "gistr-settings-support-build-id" )
                } )
                .addExtraButton( async ( btn ) =>
                {
                    btn
                    .setIcon        ( 'copy' )
                    .setTooltip     ( lng( "cfg_tab_su_uuid_btn_tip" ) )

                    btn.onClick( ( ) =>
                    {
                        navigator.clipboard.writeText( env_uuid )
                        new Notice( lng( "cfg_tab_su_uuid_notice", env_uuid ) )
                    } )
                } )

            elm.createEl( 'div', { cls: "gistr-settings-section-separator-15", text: "" } )

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
                            const action = await new ModalGettingStarted( this.app, this.plugin, this.plugin.manifest, this.plugin.settings, false ).openAndAwait( )
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