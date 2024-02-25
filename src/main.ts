/*
    Import
*/

import { App, Plugin, PluginSettingTab, Setting, sanitizeHTMLToDom, MarkdownRenderer } from 'obsidian';
import GistrSettings from 'src/settings/settings';
import { GistrBackend } from 'src/backend/backend';
import ModalGettingStarted from "./modals/GettingStartedModal";
import { lng, PluginID } from 'src/lang/helpers';
export const CFG_CBLK_PREFIX = "";

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
    og_clr_bg_light:    "cbcbcb",
    og_clr_bg_dark:     "121315"
}

/*
    Theme Options
*/

export enum Themes
{
    LIGHT = "Light",
    DARK = "Dark",
}

export const Themes_GetName: { [ key in Themes ]: string } =
{
	[ Themes.LIGHT ]: "Light",
	[ Themes.DARK ]: "Dark",
};

/*
    Extend Plugin
*/

export default class GistrPlugin extends Plugin
{
    private bLayoutReady = false;

    settings:   GistrSettings
    plugin:     GistrPlugin;

    /*
        Settings > Load
    */

    async onload( )
    {
        // load settings tab
        await this.loadSettings     ( )
        this.addSettingTab          ( new OG_Tab_Settings( this.app, this ) );

		// activate initial load
		this.app.workspace.onLayoutReady( async ( ) =>
        {
			if ( this.settings.firststart === true )
            {
				this.settings.firststart = false;
				this.saveSettings( );
	
				const actSelected = await new ModalGettingStarted( this.plugin, this.app, true ).openAndAwait( );
				if ( actSelected === "settings-open" )
                {

                    /*
                        Mute
                    */

					// @ts-ignore
					this.app.setting.open( "${PluginName}" );
					// @ts-ignore
					this.app.setting.openTabById( "${PluginName}" );
				}
			}

			this.bLayoutReady = true;
		} );

        const gistBackend                       = new GistrBackend( this.settings )
        this.registerDomEvent                   ( window, "message", gistBackend.messageEventHandler )
        this.registerMarkdownCodeBlockProcessor ( this.settings.keyword, gistBackend.processor )
    }

    /*
        Settings > Load
    */

    async loadSettings( )
    {
        this.settings = Object.assign( {}, CFG_DEFAULT, await this.loadData( ) );
    }

    /*
        Settings > Save
    */

    async saveSettings( )
    {
        await this.saveData( this.settings );
    }
}

/*
    Settings Tab
*/

class OG_Tab_Settings extends PluginSettingTab
{
    plugin:         GistrPlugin;
	HideGeneral:    boolean;
	HideGithub:     boolean;
	HideOpengist:   boolean;
	HideSupport:    boolean;
    tab_general:    HTMLElement;
    tab_github:     HTMLElement;
    tab_opengist:   HTMLElement;
    tab_support:    HTMLElement;

    constructor( app: App, plugin: GistrPlugin )
    {
        super( app, plugin );

        this.plugin         = plugin;
		this.HideGeneral    = true;
		this.HideGithub     = true;
		this.HideOpengist   = true;
		this.HideSupport    = false;
    }

    /*
        Display
    */

    display( ): void
    {
        const { containerEl }   = this;

        this.HideGeneral        = true;
		this.HideGithub         = true;
		this.HideOpengist       = true;
		this.HideSupport        = false;

        this.createHeader       ( containerEl )
		this.createMenus        ( containerEl )
    }

    /*
        Section -> Header
    */

    createHeader( elm: HTMLElement )
    {
        elm.empty( )
        elm.createEl( "h1", { text: lng( "cfg_title" ) } )
        elm.createEl( "p",
        {
            text: lng( "cfg_desc" ),
            attr:
            {
                style: 'padding-bottom: 25px'
            },
        } );   
    }

    /*
        Create Menus
    */

	createMenus( elm: HTMLElement )
    {
        this.Tab_General_New    ( elm )
		this.tab_general        = elm.createDiv( );

        this.Tab_OpenGist_New   ( elm )
		this.tab_opengist       = elm.createDiv( );

        this.Tab_Github_New     ( elm );
		this.tab_github         = elm.createDiv( );

        this.Tab_Support_New    ( elm );
		this.tab_support        = elm.createDiv( );

        this.Tab_Support_ShowSettings( this.tab_support )
	}

    /*
        Tab > General > New
    */

        Tab_General_New( elm: HTMLElement )
        {
            const tab_og = elm.createEl( "h2", { text: lng( "cfg_tab_ge_title" ), cls: `gistr-settings-header${ this.HideGeneral?" isfold":"" }` } );
            tab_og.addEventListener( "click", ( )=>
            {
                this.HideGeneral = !this.HideGeneral;
                tab_og.classList.toggle( "isfold", this.HideGeneral );
                this.Tab_General_CreateSettings( );
            } );
        }

        Tab_General_CreateSettings( )
        {
            this.tab_general.empty( );
            if ( this.HideGeneral ) return;
            
            this.Tab_General_ShowSettings( this.tab_general );
        }

        Tab_General_ShowSettings( elm: HTMLElement )
        {
        
            elm.createEl( 'small',
            {
                attr:
                {
                    style: 'display: block; margin-bottom: 25px'
                },
                text: lng( "cfg_tab_ge_header" )
            } )

            /*
                Command Keyword

                changing this will cause all opengist portals to not function until the keyword is changed
                within the box.
            */

            new Setting( elm )
                .setName( lng( "cfg_sec_keyword_name" ) )
                .setDesc( lng( "cfg_sec_keyword_desc" ) )
                .addText( text =>
                {
                    text.setValue( this.plugin.settings.keyword.toString( ) )
                        .onChange( async ( val ) =>
                        {
                            this.plugin.settings.keyword = val;
                            await this.plugin.saveSettings( );
                        } );
                } );

            /*
                Tab Footer Spacer
            */

            elm.createEl( 'div',
            {
                attr:
                {
                    style: 'padding-bottom: 40px'
                },
                text: ""
            } )

        }


    /*
        Tab > OpenGist > New
    */

        Tab_OpenGist_New( elm: HTMLElement )
        {
            const tab_og = elm.createEl( "h2", { text: lng( "cfg_tab_og_title" ), cls: `gistr-settings-header${ this.HideOpengist?" isfold":"" }` } );
            tab_og.addEventListener( "click", ( )=>
            {
                this.HideOpengist = !this.HideOpengist;
                tab_og.classList.toggle( "isfold", this.HideOpengist );
                this.Tab_OpenGist_CreateSettings( );
            } );
        }

        Tab_OpenGist_CreateSettings( )
        {
            this.tab_opengist.empty( );
            if ( this.HideOpengist ) return;
            
            this.Tab_OpenGist_ShowSettings( this.tab_opengist );
        }

        Tab_OpenGist_ShowSettings( elm: HTMLElement )
        {
        
            elm.createEl( 'small',
            {
                attr: { style: 'display: block; margin-bottom: 25px' },
                text: lng( "cfg_tab_og_header" )
            } )

            /*
                Development notice
            */

            const ct_Note           = elm.createDiv( );
            const md_notFinished    = "> [!NOTE] " + lng( "base_underdev_title" ) + "\n> <small>" + lng( "base_underdev_msg" ) + "</small>";
            MarkdownRenderer.render( this.plugin.app, md_notFinished, ct_Note, CFG_CBLK_PREFIX + md_notFinished, this.plugin );

            /*
                Background color (Light)
            */

            new Setting( elm )
                .setName( "Codeblock BG Color (Light)" )
                .setDesc( "Hex Color for Opengist codeblock background color (Light Theme) -- Color picker coming soon" )
                .addText( text =>
                {
                    text.setPlaceholder( "cbcbcb" )
                        .setValue( this.plugin.settings.og_clr_bg_light )
                        .onChange( async ( val ) =>
                        {
                            this.plugin.settings.og_clr_bg_light = val;
                            this.plugin.saveSettings( );
                        } );
                } );

            /*
                Background color (Dark)
            */

            new Setting( elm )
                .setName( "Codeblock BG Color (Dark)" )
                .setDesc( "Hex Color for Opengist codeblock background color (Dark Theme) -- Color picker coming soon" )
                .addText( text =>
                {
                    text.setPlaceholder( "121315" )
                        .setValue( this.plugin.settings.og_clr_bg_dark )
                        .onChange( async ( val ) =>
                        {
                            this.plugin.settings.og_clr_bg_dark = val;
                            this.plugin.saveSettings( );
                        } );
                } );

            /*
                Codeblock > Padding > Top
            */

            let val_st_padding: HTMLDivElement;
            new Setting( elm )
                .setName( lng( "cfg_sec_padding_top_name" ) )
                .setDesc( lng( "cfg_sec_padding_top_desc" ) )
                .addSlider( slider => slider
                    .setLimits( 0, 30, 1 )
                    .setValue( this.plugin.settings.blk_pad_t )
                    .onChange( async ( val ) =>
                    {
                        val_st_padding.innerText            = " " + val.toString();
                        this.plugin.settings.blk_pad_t      = val;

                        this.plugin.saveSettings( );
                    } ) )
                .settingEl.createDiv( '', ( el ) =>
                {
                    val_st_padding          = el;
                    el.style.minWidth       = "30px";
                    el.style.textAlign      = "right";
                    el.innerText            = " " + this.plugin.settings.blk_pad_t.toString( );
                } );

            /*
                Codeblock > Padding > Bottom
            */

            let val_sb_padding: HTMLDivElement;
            new Setting( elm )
                .setName( lng( "cfg_sec_padding_bottom_name" ) )
                .setDesc( lng( "cfg_sec_padding_bottom_desc" ) )
                .addSlider( slider => slider
                    .setLimits( 0, 30, 1 )
                    .setValue( this.plugin.settings.blk_pad_b )
                    .onChange( async ( val ) =>
                    {
                        val_sb_padding.innerText            = " " + val.toString( );
                        this.plugin.settings.blk_pad_b      = val;

                        this.plugin.saveSettings( );
                    } ) )
                .settingEl.createDiv( '', ( el ) =>
                {
                    val_sb_padding          = el;
                    el.style.minWidth       = "30px";
                    el.style.textAlign      = "right";
                    el.innerText            = " " + this.plugin.settings.blk_pad_b.toString( );
                } );

            /*
                Codeblock > Theme
            */

            new Setting( elm )
                .setName( lng( "cfg_sec_theme_name" ) )
                .setDesc( lng( "cfg_sec_theme_desc" ) )
                .addDropdown( dropdown =>
                {
                    dropdown
                        .addOption( Themes.LIGHT, Themes_GetName[ Themes.LIGHT ] )
                        .addOption( Themes.DARK, Themes_GetName[ Themes.DARK ] )
                        .setValue( this.plugin.settings.theme )
                        .onChange( async ( val ) =>
                        {
                            this.plugin.settings.theme = val;
                            await this.plugin.saveSettings( );
                        } );
            } );

            /*
                Codeblock > CSS Override
            */

            new Setting( elm )
                .setName( lng( "cfg_sec_css_name" ) )
                .setDesc( lng( "cfg_sec_css_desc" ) )
                .addTextArea( text => text
                    .setPlaceholder( lng( "cfg_sec_css_placeholder" ) )
                    .setValue( this.plugin.settings.css_og )
                    .onChange( async ( val ) =>
                    {
                        this.plugin.settings.css_og = val;
                        await this.plugin.saveSettings( );
                    }
                ));

            /*
                Tab Footer Spacer
            */

            elm.createEl( 'div',
            {
                attr:
                {
                    style: 'padding-bottom: 40px'
                },
                text: ""
            } )

        }

    /*
        Tab > Github Gists > New
    */

        Tab_Github_New( elm: HTMLElement )
        {
            const tab_gh = elm.createEl( "h2", { text: lng( "cfg_tab_gh_title" ), cls: `gistr-settings-header${ this.HideGithub?" isfold":"" }` } );
            tab_gh.addEventListener( "click", ( )=>
            {
                this.HideGithub = !this.HideGithub;
                tab_gh.classList.toggle( "isfold", this.HideGithub );
                this.Tab_Github_CreateSettings( );
            } );
        }

        Tab_Github_CreateSettings( )
        {
            this.tab_github.empty( );
            if ( this.HideGithub ) return;
            
            this.Tab_Github_ShowSettings( this.tab_github );
        }

        Tab_Github_ShowSettings( elm: HTMLElement )
        {

            elm.createEl( 'small',
            {
                attr:
                {
                    style: 'display: block'
                },
                text: lng( "cfg_tab_gh_header" )
            } )

            /*
                Codeblock > CSS Override
            */

            new Setting( elm )
                .setName( lng( "cfg_sec_css_name" ) )
                .setDesc( lng( "cfg_sec_css_desc" ) )
                .addTextArea( text => text
                    .setPlaceholder( lng( "cfg_sec_css_placeholder" ) )
                    .setValue( this.plugin.settings.css_gh )
                    .onChange( async ( val ) =>
                    {
                        this.plugin.settings.css_gh = val;
                        await this.plugin.saveSettings( );
                    }
                ));

            /*
                Tab Footer Spacer
            */

                elm.createEl( 'div',
                {
                    attr:
                    {
                        style: 'padding-bottom: 40px'
                    },
                    text: ""
                } )

        }


    /*
        Tab > Support > New
    */

        Tab_Support_New( elm: HTMLElement )
        {
            const tab_og = elm.createEl( "h2", { text: lng( "cfg_tab_sp_title" ), cls: `gistr-settings-header${ this.HideSupport?" isfold":"" }` } );
            tab_og.addEventListener( "click", ( )=>
            {
                this.HideSupport = !this.HideSupport;
                tab_og.classList.toggle( "isfold", this.HideSupport );
                this.Tab_Support_CreateSettings( );
            } );
        }

        Tab_Support_CreateSettings( )
        {
            this.tab_support.empty( );
            if ( this.HideSupport ) return;
            
            this.Tab_Support_ShowSettings( this.tab_support );
        }

        Tab_Support_ShowSettings( elm: HTMLElement )
        {

            /*
                Section -> Support Buttons
            */

            elm.createEl( 'small',
            {
                attr:
                {
                    style: 'display: block; margin-bottom: 25px'
                },
                text: lng( "cfg_sec_support_desc" )
            } )

            new Setting( elm )
                .setName( lng( "cfg_sec_support_gs_name" ) )
                .setDesc( lng( "cfg_sec_support_gs_desc" ) )
                .addButton( btn =>
                {
                    btn.setButtonText( lng( "cfg_sec_support_gs_btn" ) )
                        .setCta( )
                        .onClick( async( ) =>
                        {
                            const action = await new ModalGettingStarted( this.plugin, this.app, false ).openAndAwait( );
                        } );
                } );

            /*
                Button -> Plugin Repo
            */

            new Setting( elm )
                .setName( lng( "cfg_sec_support_repo_label" ) )
                .setDesc( lng( "cfg_sec_support_repo_url" ) )
                .addButton( ( btn ) =>
                {
                    btn.setButtonText( lng( "cfg_sec_support_repo_btn" ) ).onClick( ( ) =>
                    {
                        window.open( lng( "cfg_sec_support_repo_url" ) )
                    } )
                } )

            /*
                Button -> OpenGist > Download
            */

            new Setting( elm )
                .setName( lng( "cfg_sec_support_ogrepo_label" ) )
                .setDesc( lng( "cfg_sec_support_ogrepo_url" ) )
                .addButton( ( btn ) =>
                {
                    btn.setButtonText( lng( "cfg_sec_support_ogrepo_btn" ) ).onClick( ( ) =>
                    {
                        window.open( lng( "cfg_sec_support_ogrepo_url" ) )
                    } )
                } )

            /*
                Button -> OpenGist > Docs
            */

            new Setting( elm )
                .setName( lng( "cfg_sec_support_ogdocs_label" ) )
                .setDesc( lng( "cfg_sec_support_ogdocs_url" ) )
                .addButton( ( btn ) =>
                {
                    btn.setButtonText( lng( "cfg_sec_support_ogdocs_btn" ) ).onClick( ( ) =>
                    {
                        window.open( lng( "cfg_sec_support_ogdocs_url" ) )
                    } )
                } )

            /*
                Button -> OpenGist > Docs
            */

            new Setting( elm )
                .setName( lng( "cfg_sec_support_ogdemo_label" ) )
                .setDesc( lng( "cfg_sec_support_ogdemo_url" ) )
                .addButton( ( btn ) =>
                {
                    btn.setButtonText( lng( "cfg_sec_support_ogdemo_btn" ) ).onClick( ( ) =>
                    {
                        window.open( lng( "cfg_sec_support_ogdemo_url" ) )
                    } )
                } )

            /*
                Button -> Github Gist
            */

            new Setting( elm )
                .setName( lng( "cfg_sec_support_gist_label" ) )
                .setDesc( lng( "cfg_sec_support_gist_url" ) )
                .addButton( ( btn ) =>
                {
                    btn.setButtonText( lng( "cfg_sec_support_gist_btn" ) ).onClick( ( ) =>
                    {
                        window.open( lng( "cfg_sec_support_gist_url" ) )
                    } )
                } )

            /*
                Button -> Donate
            */

            const div_Donate = elm.createDiv( { cls: "gistr-donate" } )
            const lnk_Donate = new DocumentFragment( );
            lnk_Donate.append(
                sanitizeHTMLToDom(`
                    <a href="https://buymeacoffee.com/aetherinox">
                    <img alt="" src="https://img.buymeacoffee.com/button-api/?text=Donate Java&emoji=🤓&slug=aetherinox&button_colour=e8115c&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00"/>
                    </a>
                `),
            );
        
            new Setting( div_Donate ).setDesc( lnk_Donate );
        }

}