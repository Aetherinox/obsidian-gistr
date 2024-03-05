/*
    Import
*/

import { Plugin, WorkspaceLeaf, MarkdownView, Notice } from 'obsidian'
import { GistrBackend } from 'src/backend/backend'
import { SettingsTab } from "src/settings/tab_settings";
import GistrSettings from 'src/settings/settings'
import ModalGettingStarted from "./modals/GettingStartedModal"
import { lng, PluginID } from 'src/lang/helpers'
import { getGithubPAT, setGithubPAT } from 'src/backend/github'

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
    keyword:            "gistr",
    firststart:         true,
    css_og:             null,
    css_gh:             null,
    theme:              "Light",
    blk_pad_t:          16,
    blk_pad_b:          18,
    textwrap:           "Enabled",

    og_clr_bg_light:    "#CBCBCB",
    og_clr_bg_dark:     "#121315",
    og_clr_sb_light:    "#BA4956",
    og_clr_sb_dark:     "#4960ba",
    og_clr_tx_light:    "#2A2626",
    og_clr_tx_dark:     "#CAD3F5",
    og_opacity:         1,

    gh_clr_bg_light:    "#E5E5E5",
    gh_clr_bg_dark:     "#121315",
    gh_clr_sb_light:    "#BA4956",
    gh_clr_sb_dark:     "#BA496A",
    gh_clr_tx_light:    "#2A2626",
    gh_clr_tx_dark:     "#CAD3F5",
    gh_opacity:         1,
}

/*
    Extend Plugin
*/

export default class GistrPlugin extends Plugin
{
    private bLayoutReady = false

    public settings:    GistrSettings
    readonly plugin:    GistrPlugin

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
			const view      = leaf.view as MarkdownView
			const state     = view.getState( )
			const etateEph  = view.getEphemeralState( )

			view.previewMode.rerender( true )

			const editor = view.editor
			editor.setValue( editor.getValue( ) )
    
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
        await this.loadSettings     ( )
        this.addSettingTab          ( new SettingsTab( this.app, this ) )

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
        this.settings = Object.assign( { }, SETTINGS_DEFAULTs, await this.loadData( ) )
    }

    /*
        Settings > Save
    */

    async saveSettings( )
    {
        await this.saveData( this.settings )
    }
}