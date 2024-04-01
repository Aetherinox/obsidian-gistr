/*
    Import

    @note       : semver has issues with rollup. do not import semver's entire package.
                  import the methods you need individually, otherwise you'll receive circular dependencies error.
*/

import { App, Plugin, WorkspaceLeaf, Debouncer, debounce, TFile, Menu, MarkdownView, PluginManifest, Notice, requestUrl, addIcon, ObsidianProtocolData, ItemView, View } from 'obsidian'
import { GistrSettings, SettingsGet, SettingsDefaults, SettingsSection } from 'src/settings/'
import { BackendCore } from 'src/backend'
import { GHGistGet, GHGistCopy, GHGistUpdate } from 'src/backend/services'
import { Env, FrontmatterPrepare, GistrAPI, GistrEditor, IconGithubPublic, IconGithubSecret, IconGithubReload, AssetGithubIcon, PortalID, PortalURLDefault, LeafButton_Refresh } from 'src/api'
import { SaturynRegister, SaturynParams, SaturynParamsHandle, SaturynUnload, SaturynPortalInitialize, SaturynModalPortalEdit, SaturynCodeblock, SaturynOpen, SaturynIsOpen } from 'src/api/Saturyn'
import { lng } from 'src/lang'
import type {  LeafButtonBase  } from 'src/types'
import { base64ToArrayBuffer, arrayBufferToBase64, readString, writeString, uint8ArrayToHexString } from "src/api/Storage/ByteStr";
import { GetButtonIcon, GetIconSize, RemoveLeafButtonsAll } from 'src/utils'
import ModalGettingStarted from "src/modals/GettingStartedModal"
import ShowContextMenu from 'src/menus/context'
import lt from 'semver/functions/lt'
import gt from 'semver/functions/gt'
import crypto from 'crypto'

/*
    Extend Plugin
*/

export default class GistrPlugin extends Plugin
{
    readonly plugin:            GistrPlugin
    readonly api:               GistrAPI
    readonly editor:            GistrEditor
    private ribbonIcon_pub:     HTMLElement
    private ribbonIcon_sec:     HTMLElement
    private ribbonIcon_reload:  HTMLElement
    private leaf:               WorkspaceLeaf
    settings:                   GistrSettings
    buttons                     = new WeakMap<ItemView, Map<string, HTMLElement>>();

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
        Portal > Initialize
    */

    private async InitializePortal( )
    {
        for ( const portalID in this.settings.portals )
        {
            SaturynRegister( this, this.settings.portals[ portalID ] )
        }

        SaturynRegister(
            this, SaturynParamsHandle(
            {
                title:  'Satuyrn',
                id:     PortalID,
                icon:   'globe',
                url:    PortalURLDefault
            } )
        )
    }

    /*
        on load
    */

    async onload( )
    {
        console.debug( lng( "base_debug_loading", process.env.NAME, process.env.PLUGIN_VERSION, process.env.AUTHOR ) )

        if ( process.env.ENV === "dev" )
        {
            //console.log( process.env.NODE_ENV )
            //console.log( process.env.ENV )
            //console.log( process.env.BUILD )
            //console.log( process.env.PLUGIN_VERSION )
            //console.log( process.env.BUILD_GUID )
            //console.log( process.env.BUILD_UUID )
            //console.log( process.env.BUILD_DATE )
            //console.log( process.env.AUTHOR )
        }

        await this.loadSettings     ( )
        await this.InitializePortal ( )
        this.addSettingTab          ( new SettingsSection( this.app, this ) )
        this.registerPortal         ( )
        SaturynCodeblock            ( this )

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

            /*
                Manage leaf header icon
            */

            addIcon( 'gistr-github-refresh', IconGithubReload )

            if ( this.settings.ge_enable_ribbon_icons )
                this.addButtonToAllLeaves( )
            else
                this.removeButtonFromAllLeaves( )

            this.registerEvent(
                this.app.workspace.on( 'layout-change', ( ) =>
                {
                    const activeLeaf = this.app.workspace.getActiveViewOfType( View )
                    if ( !activeLeaf ) return
    
                    if ( this.settings.ge_enable_ribbon_icons )
                        this.addButtonToLeaf( activeLeaf.leaf, LeafButton_Refresh )
                    else
                        this.removeButtonFromLeaf( activeLeaf.leaf, LeafButton_Refresh )
                } )
            )

        } )

        /*
            Command Palette Items
                displayed by opening Obsidian command palette
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
            Left side file previewer icon
        */

        this.registerRibbon( )

        /*
            Gist > Monitor Changes
        */

        this.gistMonitorChanges( )

        /*
            Register Events
        */

        const gistBackend                       = new BackendCore( this.settings, this )
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
        Portal > Add
    */

    async addSaturyn( portal: SaturynParams )
    {
        const normalizePortal = SaturynParamsHandle( portal )

        if ( !this.settings.portals.hasOwnProperty( normalizePortal.id ) )
            SaturynRegister( this, normalizePortal )
        else
            new Notice( lng( 'po_notice_restart_obsidian' ) )

        this.settings.portals[ normalizePortal.id ] = normalizePortal

        await this.saveSettings( )
    }

    /*
        Portal > Remove
    */

    async RemoveSaturyn( portalID: string )
    {
        if ( !this.settings.portals[ portalID ] )
            new Notice( lng( 'po_notice_portal_not_found' ) )

        const portal            = this.settings.portals[ portalID ]
        await SaturynUnload     ( this.app.workspace, portal )

        delete this.settings.portals[ portalID ]
        await this.saveSettings ( )

        new Notice( lng( 'po_notice_portal_not_found' ) )
    }

    /*
        Portal > Register
    */

    private registerPortal( )
    {
        this.registerObsidianProtocolHandler( 'saturyn', this.handlePortal.bind( this ) )
    }

    /*
        Portal > Get Params
    */

    getPortalParams( data: ObsidianProtocolData ): SaturynParams | undefined
    {
        const { title, url, id } = data

        let targetPortal: SaturynParams | undefined

        if ( id && this.settings.portals[ id ] )
            targetPortal = this.settings.portals[ id ]

        if ( targetPortal === undefined && title )
            targetPortal = Object.values( this.settings.portals ).find(( portal ) => portal.title.toLowerCase( ) === title.toLowerCase( ) )

        if ( targetPortal === undefined && url )
            targetPortal = Object.values( this.settings.portals ).find( ( portal ) => portal.url.toLowerCase( ) === url.toLowerCase( ) )

        if ( targetPortal !== undefined && url )
            targetPortal.url = url

        return targetPortal
    }

    /*
        Find Portal
    */

    findPortal( field: 'title' | 'url', value: string ): SaturynParams | undefined
    {
        return Object.values( this.settings.portals ).find( ( portal ) =>
            portal[ field ].toLowerCase( ) === value.toLowerCase( )
        )
    }

    /*
        Portal > Handle
    */

    async handlePortal( data: ObsidianProtocolData )
    {
        let targetPortal= this.getPortalParams( data )
        if ( targetPortal === undefined )
        {
            if ( !data.url )
            {
                new Notice( lng( 'po_url_missing' ) )
                return
            }
        }

        const portal        = await SaturynOpen( this.app.workspace, targetPortal?.id || PortalID, targetPortal?.dock )
        const portalView    = portal.view as SaturynPortalInitialize

        portalView?.onFrameReady( ( ) =>
        {
            portalView.setUrl( data.url )
        } )
    }

    /*
        Unload
    */
    
    async onunload( )
    {
        console.debug( "Unloaded " + this.manifest.name )
        RemoveLeafButtonsAll( )
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
                    console.debug( "gistMonitorChanges.modify: Denouncer does not exist, creating" )   

                denounce_register[ file.path ] = debounce( async ( note_full: string, file: TFile ) =>
                await GHGistUpdate( { plugin: this, app: this.app, note_full, file } ), this.settings.sy_save_duration * 1000, this.settings.sy_enable_autosave_strict )
            }

            const { sy_enable_autosave } = await SettingsGet( this )
            if ( sy_enable_autosave )
            {
                await denounce_register[ file.path ]( note_full, file )

                if ( process.env.ENV === "dev" )
                    console.debug( "gistMonitorChanges.modify: Autosave Denouncer" )         
            }
        } )
    }
    
    /*
        Ribbon > Register

        Plugin:     this
        App:        this.app
        Manifest:   this.manifest.id
    */

    async registerRibbon( )
    {
        if ( this.settings.sy_enable_ribbon_icons == true )
        {
            addIcon( 'gistr-github-public', IconGithubPublic )
            this.ribbonIcon_pub = this.addRibbonIcon( "gistr-github-public", lng( "cfg_context_gist_public" ), ( ) =>
            {
                GHGistGet( { plugin: this, app: this.app, is_public: true } )( )
            } )

            addIcon( 'gistr-github-secret', IconGithubSecret )
            this.ribbonIcon_sec = this.addRibbonIcon( "gistr-github-secret", lng( "cfg_context_gist_secret" ), ( ) =>
            {
                GHGistGet( { plugin: this, app: this.app, is_public: false } )( )
            } )
        }
    }

    /*
        Ribbon > Unregister
    */

    async unregisterRibbon( )
    {
        this.ribbonIcon_pub.remove( )
        this.ribbonIcon_sec.remove( )
    }

    /*
        Ribbon > Register > Debug

        These icons give extra functionality for users, such as refreshing the interface

        Plugin:     this
        App:        this.app
        Manifest:   this.manifest.id
    */

    async registerRibbonDebug( )
    {
        if ( this.settings.ge_enable_ribbon_icons == true )
        {
            addIcon( 'gistr-github-reload', IconGithubReload )
            this.ribbonIcon_reload = this.addRibbonIcon( "gistr-github-reload", lng( "cfg_context_gist_reload" ), ( ) =>
            {
                this.reloadPlugin( this.app, this )
            } )
        }
    }

    /*
        Ribbon > Unregister > Debug
    */

    async unregisterRibbonDebug( )
    {
        this.ribbonIcon_reload.remove( )
    }

    /*
        Leafy > Add button to header

        @assoc      : removeButtonFromLeaf
                      addButtonToLeaf
                      addButtonToAllLeaves
                      removeButtonFromAllLeaves
    */

    async addHeaderButtons( viewActions: Element, button: LeafButtonBase )
    {
        const { id, icon, name }    = button
        const iconSize              = GetIconSize( )
        const classNames            = [ 'view-action', 'clickable-icon', Env.pluginId ]
        const btn_Ico               = GetButtonIcon( name, id, icon, iconSize, classNames )

        btn_Ico.addEventListener( 'click', ( ) =>
        {
            this.reloadPlugin( this.app, this )
        })

        viewActions.prepend( btn_Ico )
    }

    /*
        Leafy > Remove button from header leaf
    */

    async removeButtonFromLeaf( leaf: WorkspaceLeaf, button: LeafButtonBase )
    {
        const activeLeaf    = leaf?.view.containerEl
        const viewActions   = activeLeaf?.getElementsByClassName( 'view-actions' )[ 0 ]

        if ( !viewActions ) return

        /*
            Remove existing elements
        */

        viewActions.getElementsByClassName( `view-action ${ Env.pluginId } ${ button.id }` )[ 0 ]?.detach( )
    }

    /*
        Leafy > Add button to header leaf
    */

    async addButtonToLeaf( leaf: WorkspaceLeaf, button: LeafButtonBase )
    {
        const activeLeaf    = leaf?.view.containerEl
        const viewActions   = activeLeaf?.getElementsByClassName( 'view-actions' )[ 0 ]

        if ( !viewActions ) return

        /*
            Remove existing elements
        */

        viewActions.getElementsByClassName( `view-action ${ Env.pluginId } ${ button.id }` )[ 0 ]?.detach( )

        /*
            Add new button
        */

        this.addHeaderButtons( viewActions, button )
    }

    /*
        Leafy > Add button to all leafs
    */

    async addButtonToAllLeaves( )
    {
        this.app.workspace.iterateAllLeaves( ( leaf ) =>
            this.addButtonToLeaf( leaf, LeafButton_Refresh )
        )

        this.app.workspace.onLayoutChange( )
    }

    /*
        Leafy > remove button from all leafs
    */

    async removeButtonFromAllLeaves( )
    {
        this.app.workspace.iterateAllLeaves( ( leaf ) =>
            this.removeButtonFromLeaf( leaf, LeafButton_Refresh )
        )

        this.app.workspace.onLayoutChange( )
    }

    /*
        Settings > Load
    */

    async loadSettings( )
    {
        this.settings = await this.loadData( )
        
        this.settings =
        {
            ...SettingsDefaults,
            ...this.settings
        }

        if ( !this.settings.portals )
        {
            this.settings.portals = { }
        }

        for ( const portalID in this.settings.portals )
        {
            this.settings.portals[ portalID ] = SaturynParamsHandle( this.settings.portals[ portalID ] )
        }
    }

    /*
        Settings > Save
    */

    async saveSettings( )
    {
        await this.saveData( this.settings )
    }

    /*
        Reload plugin
    */

    async reloadPlugin(app: App, plugin: GistrPlugin )
    {
        await ( app as any).plugins.disablePlugin( plugin.manifest.id )
        this.app.workspace.updateOptions( )
        await ( app as any ).plugins.enablePlugin( plugin.manifest.id )
        this.app.workspace.updateOptions( )

        new Notice( lng( 'base_reload_notice' ), 2000 )
    }

    /*
        Right-click context menu
    */
    
    GetContextMenu = ( menu: Menu, editor: GistrEditor ): void =>
    {
        ShowContextMenu( this, this.settings, this.api, menu, editor )
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

            new Notification( lng( "ver_update_beta_dn_title", this.manifest.name ),
            {
                body:   lng( "ver_update_beta_dn_msg", ver_running, ver_beta ),
                icon:   AssetGithubIcon,
                badge:  AssetGithubIcon,
            } )
        }
        else if ( lt( ver_beta, ver_stable ) && lt( ver_running, ver_stable ) )
        {
            new Notice( lng( "ver_update_stable" ), 0 )

            new Notification( lng( "ver_update_stable_dn_title", this.manifest.name ),
            {
                body:   lng( "ver_update_stable_dn_msg", ver_running, ver_stable ),
                icon:   AssetGithubIcon,
                badge:  AssetGithubIcon,
            } )
        }
    }

    /*
        Generate UUID

        utilized to generate temp ids for portal and gist embed frame ids
    */

    public generateUuid( )
    {
        const uuid = crypto.randomUUID( );
        return `${ uuid }`
    }

}