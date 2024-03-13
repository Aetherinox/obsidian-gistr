/*
    Import

    @note       : semver has issues with rollup. do not import semver's entire package.
                  import the methods you need individually, otherwise you'll receive circular dependencies error.
*/

import { App, Plugin, WorkspaceLeaf, Debouncer, debounce, TFile, Menu, MarkdownView, PluginManifest, Notice, requestUrl } from 'obsidian'
import { GistrSettings, SettingsGet, SettingsDefaults, SettingsSection } from 'src/settings/'
import { BackendCore } from 'src/backend'
import { GHGistGet, GHGistCopy, GHGistUpdate } from 'src/backend/services'
import { Env, PID, FrontmatterPrepare, GistrAPI, GistrEditor } from 'src/api'
import { lng } from 'src/lang'
import ModalGettingStarted from "src/modals/GettingStartedModal"
import ShowContextMenu from 'src/menus/context'
import lt from 'semver/functions/lt'
import gt from 'semver/functions/gt'

/*
    Basic Declrations
*/

const AppBase               = 'app://obsidian.md'

/*
    Extend Plugin
*/

export default class GistrPlugin extends Plugin
{
    readonly plugin:        GistrPlugin
    readonly api:           GistrAPI
    readonly editor:        GistrEditor
    // private think_last   = +new Date( ) 
    // private think_now    = +new Date( ) 
    private bLayoutReady    = false
    settings:               GistrSettings

    constructor( app: App, manifest: PluginManifest )
    {
        super( app, manifest )
        Env._Initialize( app, manifest )
    }

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
        this.addSettingTab          ( new SettingsSection( this.app, this ) )

		this.app.workspace.onLayoutReady( async ( ) =>
        {
            if ( this.settings.firststart === true )
            {
                const opt_selected = await new ModalGettingStarted( this.app, this.plugin, this.manifest, this.settings, true ).openAndAwait( )
                if ( opt_selected === "settings-open" )
                {
    
                    /*
                        open settings
                    */
    
                    // @ts-ignore
                    this.app.setting.open( this.manifest.id )
                    // @ts-ignore
                    this.app.setting.openTabById( this.manifest.id )
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
                editorCallback:     GHGistGet( { plugin: this, app: this.app, is_public: true } )
            }
        )
        
        this.addCommand
        (
            {
                id:                 'gistr-github-gist-secret-save',
                name:               lng( "cfg_context_gist_secret" ),
                callback:           GHGistGet( { plugin: this, app: this.app, is_public: false } ),
            }
        )
        
        this.addCommand
        (
            {
                id:                 'gistr-github-gist-copy',
                name:               lng( "cfg_context_gist_copy" ),
                callback:           GHGistCopy( { plugin: this, app: this.app } ),
            }
        )

        /*
            Gist > Monitor Changes
        */

        this.gistMonitorChanges( )

        /*
            Register Events
        */

        const gistBackend                       = new BackendCore( this.settings )
        this.registerDomEvent                   ( window, "message", gistBackend.messageEventHandler )
        this.registerMarkdownCodeBlockProcessor ( this.settings.keyword, gistBackend.processor )
        this.registerEvent                      ( this.app.workspace.on( "editor-menu", this.GetContextMenu ) )

        /*
            Version checking
        */

        if ( this.settings.ge_enable_updatenoti )
        {
            this.versionCheck( )
        }
    }

    /*
        Unload
    */
    
    async onunload( )
    {
        console.debug( "Unloaded " + this.manifest.name )
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
            const note_raw          = FrontmatterPrepare( note_full )

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
                await GHGistUpdate( { plugin: this, app: this.app, note_full, file } ), this.settings.sy_save_duration * 1000, this.settings.sy_enable_autosave_strict )
            }

            const { sy_enable_autosave } = await SettingsGet( this )
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
        this.settings = Object.assign( { }, SettingsDefaults, await this.loadData( ) )
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
		const ver_running   = this.manifest.version
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

        console.debug( lng( "base_debug_updater_1", process.env.NAME ) )
        console.debug( lng( "base_debug_updater_2", "Current : ..... ", ver_running ) )
        console.debug( lng( "base_debug_updater_2", "Stable  : ..... ", ver_stable ) )
        console.debug( lng( "base_debug_updater_2", "Beta    : ..... ", ver_beta ) )

        if ( gt( ver_beta, ver_stable ) && lt( ver_running, ver_beta ) )
        {
            new Notice( lng( "ver_update_beta" ), 0 )
        }
        else if ( lt( ver_beta, ver_stable ) && lt( ver_running, ver_stable ) )
        {
            new Notice( lng( "ver_update_stable" ), 0 )
        }
	}

}