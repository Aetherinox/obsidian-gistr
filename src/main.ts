/*
    Import
*/

import { Plugin, WorkspaceLeaf, Debouncer, debounce, TFile, Menu, MarkdownView, PluginManifest, Notice, requestUrl } from 'obsidian'
import { GistrBackend } from 'src/backend/backend'
import { SettingsTab } from "src/settings/tab_settings";
import GistrSettings, { GetSettings } from 'src/settings/settings'
import ModalGettingStarted from "./modals/GettingStartedModal"
import { lng, PluginID } from 'src/lang/helpers'
import { Github_GetGist, Github_CopyGist, HandleFrontmatter, Github_UpdateExistingGist } from 'src/backend/services/github'
import { GistrAPI, GistrEditor } from "src/api/types"
import ShowContextMenu from "src/menus/context"

/*
    Basic Declrations
*/

const PluginName            = PluginID( )
const AppBase               = 'app://obsidian.md'

/*
    Default Settings
*/

const SETTINGS_DEFAULTs: GistrSettings =
{
    keyword:                    "gistr",
    firststart:                 true,
    css_og:                     null,
    css_gh:                     null,
    theme:                      "Light",
    blk_pad_t:                  16,
    blk_pad_b:                  18,
    textwrap:                   "Enabled",
    notitime:                   10,

    sy_clr_lst_icon:            "#757575E6",

    og_clr_bg_light:            "#CBCBCB",
    og_clr_bg_dark:             "#121315",
    og_clr_sb_light:            "#BA4956",
    og_clr_sb_dark:             "#4960ba",
    og_clr_tx_light:            "#2A2626",
    og_clr_tx_dark:             "#CAD3F5",
    og_opacity:                 1,

    gh_clr_bg_light:            "#E5E5E5",
    gh_clr_bg_dark:             "#121315",
    gh_clr_sb_light:            "#BA4956",
    gh_clr_sb_dark:             "#BA496A",
    gh_clr_tx_light:            "#2A2626",
    gh_clr_tx_dark:             "#CAD3F5",
    gh_opacity:                 1,

    sy_enable_autoupdate:       true,
    sy_enable_autosave:         false,
    sy_enable_autosave_strict:  false,
    sy_enable_autosave_notice:  false,
    sy_add_frontmatter:         false,
    sy_save_duration:           15,
    context_sorting:            [],
}

/*
    Extend Plugin
*/

export default class GistrPlugin extends Plugin
{
    readonly plugin:        GistrPlugin
    readonly api:           GistrAPI
    readonly editor:        GistrEditor
    readonly manifest:      PluginManifest
    //private think_last      = +new Date( ) 
    //private think_now       = +new Date( ) 
    private bLayoutReady    = false
    settings:               GistrSettings

    /*
        Rehash Reading View
    */

	renderModeReading( ): void
    {
		this.app.workspace.iterateRootLeaves( ( leaf: WorkspaceLeaf ) =>
        {
			if ( leaf.view instanceof MarkdownView && leaf.view.getMode( ) === "preview" )
				leaf.view.previewMode.rerender( true )
		} )
	}

    /*
        Development use re-rendering
    */

	async renderDevelopment( )
    {
		for ( const leaf of this.app.workspace.getLeavesOfType( 'markdown' ) )
        {
			const view          = leaf.view as MarkdownView
			const state         = view.getState( )
			const etateEph      = view.getEphemeralState( )

			view.previewMode.rerender( true )

			const editor        = view.editor
			editor.setValue     ( editor.getValue( ) )
    
			if ( state.mode === 'preview' )
            {
				state.mode = 'source'
				await view.setState( state, { history: false } )
				state.mode = 'preview'
				await view.setState( state, { history: false } )
			}

			view.setEphemeralState( etateEph )
		}
	}

    /*
        Settings > Load
    */

    async onload( )
    {
        console.debug( lng( "base_debug_loading", process.env.NAME, process.env.PLUGIN_VERSION, process.env.AUTHOR ) )

        await this.loadSettings     ( )
        this.versionCheck           ( )
        this.addSettingTab          ( new SettingsTab( this.app, this ) )

		this.app.workspace.onLayoutReady( async ( ) =>
        {
            if ( this.settings.firststart === true )
            {
                const opt_selected = await new ModalGettingStarted( this.app, this.plugin, this.manifest, this.settings, true ).openAndAwait( )
                if ( opt_selected === "settings-open" )
                {
    
                    /*
                        Mute
                    */
    
                    // @ts-ignore
                    this.app.setting.open( "${ PluginName }" )
                    // @ts-ignore
                    this.app.setting.openTabById( "${ PluginName }" )
                }
    
                this.settings.firststart = false
                this.saveSettings( )
            }
		} )

        /*
            Command Palette Items
        */

        this.addCommand
        (
            {
                id:                 'gistr-github-gist-public-save',
                name:               lng( "cfg_context_gist_public" ),
                editorCallback:     Github_GetGist( { plugin: this, app: this.app, is_public: true } )
            }
        )
        
        this.addCommand
        (
            {
                id:                 'gistr-github-gist-secret-save',
                name:               lng( "cfg_context_gist_secret" ),
                callback:           Github_GetGist( { plugin: this, app: this.app, is_public: false } ),
            }
        )
        
        this.addCommand
        (
            {
                id:                 'gistr-github-gist-copy',
                name:               lng( "cfg_context_gist_copy" ),
                callback:           Github_CopyGist( { plugin: this, app: this.app } ),
            }
        )

        /*
            Gist > Monitor Changes
        */

        this.gistMonitorChanges( )

        /*
            Register Events
        */

        const gistBackend                       = new GistrBackend( this.settings )
        this.registerDomEvent                   ( window, "message", gistBackend.messageEventHandler )
        this.registerMarkdownCodeBlockProcessor ( this.settings.keyword, gistBackend.processor )
        this.registerEvent                      ( this.app.workspace.on( "editor-menu", this.GetContextMenu ) )

    }

    /*
        Gist Saving > Monitor for Changes
    */

    gistMonitorChanges( )
    {

        const note_previous:        Record< string, string > = { }
        const denounce_register:    Record< string, Debouncer< [ string, TFile ], Promise< Notice > > > = { }

        let last = +new Date( )
        this.app.vault.on( 'modify', async( file: TFile ) =>
        {
            /*
            this.think_now          = +new Date( )
            if ( this.think_now - this.think_last < ( this.settings.sy_save_duration * 1000 ) )
            {
                if ( process.env.ENV === "dev" )
                    console.log( "gistMonitorChanges.modify on cooldown" )

                return
            }
            */

            /*
                Get note contents with frontmatter
            */

            const note_full         = await file.vault.adapter.read( file.path )
            const note_raw          = HandleFrontmatter( note_full )

            /*
                Strip Frontmatter from note contents and leave just the note body
            */

            if ( note_raw === note_previous[ file.path ] )
            {
                return
            }

            /*
                Store current copy of note to record for comparison the next time the note is changed.
            */

            note_previous[ file.path ] = note_raw

            /*
                Initialize bouncer
            */

            if ( !denounce_register[ file.path ] )
            {
                if ( process.env.ENV === "dev" )
                    console.log( "gistMonitorChanges.modify: Denouncer does not exist, creating" )   

                denounce_register[ file.path ] = debounce( async ( note_full: string, file: TFile ) =>
                await Github_UpdateExistingGist( { plugin: this, app: this.app, note_full, file } ), this.settings.sy_save_duration * 1000, this.settings.sy_enable_autosave_strict )
            }

            const { sy_enable_autosave } = await GetSettings( this )
            if ( sy_enable_autosave )
            {

                await denounce_register[ file.path ]( note_full, file )

                if ( process.env.ENV === "dev" )
                    console.log( "gistMonitorChanges.modify: Autosave Denouncer" )         

                /*
                if ( now - last > ( this.settings.sy_save_duration * 1000 ) )
                {
                    last = now
                    await denounce_register[ file.path ]( note_full, file )

                    if ( process.env.ENV === "dev" )
                        console.log( "gistMonitorChanges.modify: Autosave Denouncer" )         
                }
                */
            }
        } )
    }
    
    /*
        Right-click context menu
    */
    
    GetContextMenu = ( menu: Menu, editor: GistrEditor ): void =>
    {
        ShowContextMenu( this, this.settings, this.api, menu, editor )
    }

    /*
        Settings > Load
    */

    async loadSettings( )
    {
        this.settings = Object.assign( { }, SETTINGS_DEFAULTs, await this.loadData( ) )
    }

    /*
        Settings > Save
    */

    async saveSettings( )
    {
        await this.saveData( this.settings )
    }

    /*
        Check for newer versions

        utilizes env variables in rollup.config.js
    */

	async versionCheck( )
    {
		const ver_running   = process.env.PLUGIN_VERSION
		const ver_stable    = await requestUrl( lng( "ver_url", "main" ) ).then( async ( res ) =>
        {
			if ( res.status === 200 )
            {
				const resp = await res.json
				return resp.version
			}
		} )

		const ver_beta = await requestUrl( lng( "ver_url", "beta" ) ).then( async ( res ) =>
        {
			if ( res.status === 200 )
            {
				const resp = await res.json
				return resp.version
			}
		} )

        /*
            Output notice to user on possible updates
        */

		if ( ver_running?.indexOf( "beta" ) !== -1 && ver_running !== ver_beta )
	        new Notice( lng( "ver_update_beta" ), 0 )
        else if ( ver_running !== ver_stable )
			new Notice( lng( "ver_update_stable" ), 0 )
	}

}