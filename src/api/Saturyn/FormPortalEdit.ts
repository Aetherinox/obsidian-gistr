import { Setting, sanitizeHTMLToDom, MarkdownRenderer } from 'obsidian'
import GistrPlugin from "src/main"
import { SaturynParams, SaturynParamsType } from './Parameters'
import { SaturynParamsHandle } from './ParametersHandle'
import { SettingsDefaults } from 'src/settings/defaults'
import { NoxComponent } from 'src/api'
import { lng } from 'src/lang'

export const SaturynFormPortalEdit = ( plugin: GistrPlugin, contentEl: HTMLElement, params: SaturynParams, onSubmit?: ( result: SaturynParams ) => void ) =>
{

    const elm = contentEl

    /*
        Header
    */

    elm.createEl( 'small', { cls: "gistr-settings-section-description", text: lng( "cfg_tab_gh_header" ) } )

    /*
        URL
    */

        const cfg_po_edit_url_desc = new DocumentFragment( )
        cfg_po_edit_url_desc.append(
            sanitizeHTMLToDom( `${ lng( "cfg_po_edit_url_desc" ) }` ),
        )

        new NoxComponent( elm )
            .setName( lng( 'cfg_po_edit_url_name' ) )
            .setDesc( cfg_po_edit_url_desc )
            .setClass( 'saturyn--form-field' )
            .addNoxTextbox( text => text
                .setPlaceholder( lng( 'cfg_po_edit_url_hold' ) )
                .setValue( params.url )
                .onChange( async ( val ) =>
                {
                    params.url = val
                }),
                ( ) =>
                ( 
                    SettingsDefaults.sy_save_list_datetime.toString( ) as string
                ),
            )

        elm.createEl( 'div', { cls: "gistr-settings-section-separator", text: "" } )

    /*
        Name
    */

        const cfg_po_edit_name_desc = new DocumentFragment( )
        cfg_po_edit_name_desc.append(
            sanitizeHTMLToDom( `${ lng( "cfg_po_edit_name_desc" ) }` ),
        )

        new NoxComponent( elm )
            .setName( lng( 'cfg_po_edit_name_name' ) )
            .setDesc( cfg_po_edit_name_desc )
            .setClass( 'saturyn--form-field' )
            .addNoxTextbox( text => text
                .setPlaceholder( lng( 'cfg_po_edit_name_hold' ) )
                .setValue( params.title )
                .onChange( async ( val ) =>
                {
                    params.title = val
                }),
                ( ) =>
                ( 
                    params.title.toString( ) as string
                ),
            )

            const ct_Note           = elm.createDiv( )
            const md_notFinished    = "```````" + "\n" + "```" + "saturyn" + "\n" + "title:     " + params.title + "\n" + "```" + "\n```````"
            MarkdownRenderer.render( plugin.app, md_notFinished, ct_Note, "" + md_notFinished, plugin )

        elm.createEl( 'div', { cls: "gistr-settings-section-separator-15", text: "" } )
            
    /*
        Dock
    */

        const cfg_po_edit_dock_desc = new DocumentFragment( )
        cfg_po_edit_dock_desc.append(
            sanitizeHTMLToDom( `${ lng( "cfg_po_edit_dock_desc" ) }` ),
        )

        new NoxComponent( elm )
            .setName( lng( "cfg_po_edit_dock_name" ) )
            .setDesc( cfg_po_edit_dock_desc )
            .setClass( "saturyn--dropdown" )
            .addNoxDropdown( dropdown => dropdown
                .addOption( 'left', 'left'      )
                .addOption( 'center', 'center'  )
                .addOption( 'right', 'right'    )
                .setValue( params.dock ?? 'right' )
                .onChange( async ( val ) =>
                {
                    params.dock = val as SaturynParamsType
                }),
                ( ) =>
                ( 
                    SettingsDefaults.theme as string
                ),
            )

        elm.createEl( 'div', { cls: "gistr-settings-section-separator", text: "" } )
            
    /*
        PIN to Menu
    */

        const cfg_po_edit_pin_desc = new DocumentFragment( )
        cfg_po_edit_pin_desc.append(
            sanitizeHTMLToDom( `${ lng( "cfg_po_edit_pin_desc" ) }` ),
        )

        new NoxComponent( elm )
            .setName( lng( "cfg_po_edit_pin_name" ) )
            .setDesc( cfg_po_edit_pin_desc )
            .setClass( 'saturyn--toggle' )
            .addNoxToggle( toggle => toggle
                .setValue( params.hasRibbon === true )
                .onChange( async ( val ) =>
                {
                    params.hasRibbon = val
                }),
                ( ) =>
                ( 
                    SettingsDefaults.ge_enable_updatenoti as boolean
                ),
            )

        elm.createEl( 'div', { cls: "gistr-settings-section-separator", text: "" } )

    /*
        Profile Key
    */

        const cfg_po_edit_pkey_desc = new DocumentFragment( )
        cfg_po_edit_pkey_desc.append(
            sanitizeHTMLToDom( `${ lng( "cfg_po_edit_pkey_desc" ) }` ),
        )

        new NoxComponent( elm )
            .setName( lng( 'cfg_po_edit_pkey_name' ) )
            .setDesc( cfg_po_edit_pkey_desc )
            .setClass( 'saturyn--form-field' )
            .addNoxTextbox( text => text
                .setPlaceholder( lng( 'cfg_po_edit_pkey_hold' ) )
                .setValue( params.profileKey ?? '' )
                .onChange( async ( val ) =>
                {
                    if ( val === '' )
                        val = 'saturyn'

                    params.profileKey = val
                }),
                ( ) =>
                ( 
                    SettingsDefaults.sy_save_list_datetime.toString( ) as string
                ),
            )

    /*
        Zoom
    */

        const cfg_po_edit_zoom_desc = new DocumentFragment( )
        cfg_po_edit_zoom_desc.append(
            sanitizeHTMLToDom(`${ lng( "cfg_po_edit_zoom_desc" ) }`),
        )

        let val_zoom: HTMLDivElement
        new NoxComponent( elm )
            .setName( lng( "cfg_po_edit_zoom_name" ) )
            .setDesc( cfg_po_edit_zoom_desc )
            .setClass( 'saturyn--slider' )
            .addNoxSlider( slider => slider
                .setDynamicTooltip( )
                .setLimits( 0.00, 3, 0.05 )
                .setValue( params.zoom )
                .onChange( async ( val ) =>
                {
                    let zoom_calc           = val * 100
                    zoom_calc               = Math.round( zoom_calc * 100 ) / 100
                    val_zoom.innerText      = " " + zoom_calc.toString( ) + "%"

                    params.zoom = val
                }),
                ( ) =>
                ( 
                    SettingsDefaults.og_opacity as number
                ),
            ).settingEl.createDiv( '', ( el ) =>
            {
                val_zoom            = el
                let zoom_calc       = params.zoom * 100
                zoom_calc           = Math.round( zoom_calc * 100 ) / 100
                el.innerText        = " " + zoom_calc.toString( ) + "%"
            } ).classList.add( 'gistr-settings-elm-slider-preview' )

    /*
        Advanced Options

        Toggle switch to display advanced options
    */

        const cfg_po_edit_advtoggle_desc = new DocumentFragment( )
        cfg_po_edit_advtoggle_desc.append(
            sanitizeHTMLToDom( `${ lng( "cfg_po_edit_advtoggle_desc" ) }` ),
        )

        new NoxComponent( elm )
            .setName( lng( "cfg_po_edit_advtoggle_name" ) )
            .setDesc( cfg_po_edit_advtoggle_desc )
            .setClass( 'saturyn--toggle' )
            .addNoxToggle( toggle => toggle
                .setValue( false )
                .onChange( async ( val ) =>
                {
                    if ( val )
                        advancedOptions.addClass( 'saturyn--advanced-options--show' )
                    else
                        advancedOptions.removeClass( 'saturyn--advanced-options--show' )
                }),
                ( ) =>
                ( 
                    SettingsDefaults.ge_enable_updatenoti as boolean
                ),
            )

        elm.createEl( 'div', { cls: "gistr-settings-section-separator", text: "" } )
            
    /*
        Advanced Toggle
    */

        const advancedOptions = contentEl.createDiv( { cls: 'saturyn--advanced-options' } )

    /*
        Icon
    */

        const cfg_po_edit_icon_desc = new DocumentFragment( )
        cfg_po_edit_icon_desc.append(
            sanitizeHTMLToDom( `${ lng( "cfg_po_edit_icon_desc" ) }` ),
        )

        new NoxComponent( advancedOptions )
            .setName( lng( "cfg_po_edit_icon_name" ) )
            .setDesc( cfg_po_edit_icon_desc )
            .setClass( "gistr-settings-elm-textarea" )
            .addNoxTextarea( text => text
                .setPlaceholder( lng( "cfg_po_edit_icon_hold" ) )
                .setValue( params.icon )
                .onChange( async ( val ) =>
                {
                    params.icon = val
                }),
                ( ) =>
                ( 
                    SettingsDefaults.css_og.toString( ) as string
                ),
            )

    /*
        User agent
    */

        const cfg_po_edit_agent_desc = new DocumentFragment( )
        cfg_po_edit_agent_desc.append(
            sanitizeHTMLToDom( `${ lng( "cfg_po_edit_agent_desc" ) }` ),
        )

        new NoxComponent( advancedOptions )
            .setName( lng( "cfg_po_edit_agent_name" ) )
            .setDesc( cfg_po_edit_agent_desc )
            .setClass( "gistr-settings-elm-textarea" )
            .addNoxTextarea( text => text
                .setPlaceholder( lng( "cfg_po_edit_agent_hold" ) )
                .setValue( params.userAgent ?? '' )
                .onChange( async ( val ) =>
                {
                    params.userAgent = val
                }),
                ( ) =>
                ( 
                    SettingsDefaults.css_og.toString( ) as string
                ),
            )

    /*
        CSS
    */

        const cfg_po_edit_css_desc = new DocumentFragment( )
        cfg_po_edit_css_desc.append(
            sanitizeHTMLToDom( `${ lng( "cfg_po_edit_css_desc" ) }` ),
        )

        new NoxComponent( advancedOptions )
            .setName( lng( "cfg_po_edit_css_name" ) )
            .setDesc( cfg_po_edit_css_desc )
            .setClass( "gistr-settings-elm-textarea" )
            .addNoxTextarea( text => text
                .setPlaceholder( lng( "cfg_po_edit_css_hold" ) )
                .setValue( params.css ?? '' )
                .onChange( async ( val ) =>
                {
                    params.css = val
                }),
                ( ) =>
                ( 
                    SettingsDefaults.css_og.toString( ) as string
                ),
            )

    /*
        Javascript
    */

        const cfg_po_edit_js_desc = new DocumentFragment( )
        cfg_po_edit_js_desc.append(
            sanitizeHTMLToDom( `${ lng( "cfg_po_edit_js_desc" ) }` ),
        )

        new NoxComponent( advancedOptions )
            .setName( lng( "cfg_po_edit_js_name" ) )
            .setDesc( cfg_po_edit_js_desc )
            .setClass( "gistr-settings-elm-textarea" )
            .addNoxTextarea( text => text
                .setPlaceholder( lng( "cfg_po_edit_js_hold" ) )
                .setValue( params.js ?? '' )
                .onChange( async ( val ) =>
                {
                    params.js = val
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

    /*
        Button > Create / Update
    */

        new Setting( elm )
            .setName( lng( "cfg_po_button_name" ) )
            .setDesc( lng( "cfg_po_button_desc" ) )
            .addButton( btn =>
            {
                btn.setButtonText( params.id ? lng( 'cfg_po_button_opt_update' ) : lng( 'cfg_po_button_opt_create' ) )
                    .setCta( )
                    .onClick( async( ) =>
                    {
                        params = SaturynParamsHandle( params )
                        onSubmit && onSubmit( params )
                    } )
            } )
}
