/*
	Modal > Getting Started
*/

import { App, Modal, ButtonComponent, Setting, requestUrl, MarkdownRenderer } from "obsidian"
import GistrPlugin from "src/main"
import { GistrSettings } from 'src/settings/'
import { lng } from 'src/lang'

/*
    Declare Json
*/

export interface ManifestJson
{
	id: 			string
    name:     		string
    version?:  		string
	description?: 	string
	author?: 		string
	authorUrl?:		string
}

/*
	Modal > Getting Started > Class
*/

export default class ModalGettingStarted extends Modal
{
	private resolve: 		( ( value: string ) => void )
	private plugin: 		GistrPlugin
	private manifest: 		ManifestJson
	private settings: 		GistrSettings
	private cblk_preview: 	HTMLElement
	private firststart: 	boolean

	/*
		Getting Started > Constructor
	*/

	constructor( app: App, plugin: GistrPlugin, manifest: ManifestJson, settings: GistrSettings, bFirstLoad: boolean  )
	{
		super( app )

		this.plugin 		= plugin
		this.manifest 		= manifest
		this.settings 		= settings
		this.firststart 	= bFirstLoad

	}

	/*
		Modal > Getting Started > Action > Open & Wait
	*/

	openAndAwait( )
	{
		return new Promise<string>( ( call ) =>
		{
			this.resolve = call
			this.open( )
		} )
	}

	/*
		Modal > Getting Started > Action > On Open
	*/

	onOpen( )
	{
		const { contentEl } = this

		/*
			Helper method for handling add each line of content
		*/

		const AddLine = ( elmParent: HTMLElement, value: string, htmltag: keyof HTMLElementTagNameMap | null = null, cls: string | null = null ) =>
		{
			if ( htmltag )
				return elmParent.createEl( htmltag, { text: value,  cls: cls } )
			else
			{
				elmParent.appendText( value )
				return elmParent
			}
		}

		/*
			Style main modal
		*/

		this.modalEl.classList.add( 'gistr-gs-modal' )

		/*
			Modal > Getting Started > Content > Header
		*/

		AddLine( contentEl, ( this.manifest.name || process.env.name ) + " " + "v" + ( this.manifest.version || process.env.PLUGIN_VERSION ), "h2" )
		AddLine( contentEl, lng( "gs_base_header" ), "small" )
		AddLine( contentEl, "", "div", "gistr-gs-separator" )

		/*
			Modal > Getting Started > Content > Getting Started
		*/

		AddLine( contentEl, "", "div", "gistr-gs-separator" )

		const Tab_GH_L  	= contentEl.createEl( "h3",    { text: lng( "gs_gh_name" ), cls: `gistr-gs-header-int-l` } )
		const Tab_GH_R  	= contentEl.createEl( "h2",    { text: " ", cls: `gistr-gs-header-int-r` } )
		const Tab_GH_C  	= contentEl.createEl( "div",   { text: "", cls: `gistr-gs-header-int-c` } )
		contentEl.createEl	( 'small', { cls: "", text: lng( "gs_gh_desc" ) } )

		/*
			Get github api status
		*/

		let json_delay 	= 1 * 1000
		const gh_status = requestUrl( "https://www.githubstatus.com/api/v2/summary.json" ).then( ( res ) =>
		{
			if ( res.status === 200 )
				return res.json.components[ 0 ].status || lng( "gist_status_issues" )
			else
				return lng( "gist_status_issues" )
		} )

		new Setting( Tab_GH_R )
			.addText( async ( text ) =>
			{
				text
					.setPlaceholder( lng( "gist_status_connecting" ) )
					.setValue( lng( "gist_status_connecting" ) )
					.setDisabled( true )

					const controlEl = Tab_GH_R.querySelector( ".setting-item-control" )
					controlEl.addClass( "gistr-settings-status-connecting" )

				let github_status = await gh_status

				setTimeout( function( )
				{
					if ( github_status === lng( "gist_status_operational_raw" ) )
					{
						const controlEl 		= Tab_GH_R.querySelector( ".setting-item-control" )
						controlEl.removeClass	( "gistr-settings-status-connecting" )
						controlEl.addClass		( "gistr-settings-status-success" )
						text.setValue			( lng( "gist_status_connected" ) )
					}
					else
					{
						const controlEl 		= Tab_GH_R.querySelector(".setting-item-control" )
						controlEl.removeClass	( "gistr-settings-status-connecting" )
						controlEl.addClass		( "gistr-settings-status-warning" )
						text.setValue			( github_status )
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

				let github_status = await gh_status

				setTimeout( function( )
				{
					if ( github_status === lng( "gist_status_operational_raw" ) )
					{
						btn.setIcon		( "github" )
						btn.setTooltip 	( lng( "gist_status_success_btn_tip" ) )

						btn.extraSettingsEl.classList.remove     ( "gistr-settings-status-connecting" )
						btn.extraSettingsEl.classList.add        ( "gistr-settings-icon-ok" )
					}
					else
					{
						btn.setIcon		( "circle-off" )
						btn.setTooltip 	( lng( "gist_status_issues_btn_tip" ) )

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


		this.cblk_preview = contentEl.createDiv( )

		const gs_UsageCodeblock_gh = "```````" + "\n" + "```" + this.settings.keyword + "\n" + "gist.github.com/username/YOUR_GIST_ID" + "\n" + "gist.github.com/username/YOUR_GIST_ID#file_name" + "\n" + "gist.github.com/username/YOUR_GIST_ID&theme_name" + "\n" + "```" + "\n```````"
		MarkdownRenderer.render( this.app, gs_UsageCodeblock_gh, this.cblk_preview, gs_UsageCodeblock_gh, this.plugin )

		AddLine( contentEl, "", "div", "gistr-gs-separator" )

		/*
			Modal > Getting Started > Content > Getting Started
		*/

		AddLine( contentEl, lng( "gs_og_name" ), "h3" )
		AddLine( contentEl, lng( "gs_og_desc" ), "small" )

		const div_GettingStarted = contentEl.createDiv( { cls: "gistr-gs-modal-button-container" } )

		new ButtonComponent( div_GettingStarted )
			.setButtonText( lng( "gs_og_btn_repo" ) )
			.setCta( )
			.onClick( ( ) =>
			{
				window.open( lng( "cfg_tab_su_ogrepo_url" ) )
			} )

		new ButtonComponent( div_GettingStarted )
			.setButtonText( lng( "gs_og_btn_docs" ) )
			.onClick( ( ) =>
			{
				window.open( lng( "cfg_tab_su_ogdocs_url" ) )
			} )

		AddLine( contentEl, lng( "gs_og_sub_1" ), "small" )

		/*
			Markdown Render Preview
		*/

		this.cblk_preview = contentEl.createDiv( )

		const gs_UsageCodeblock = "```````" + "\n" + "```" + this.settings.keyword + "\n" + "gist.domain.com/username/YOUR_GIST_ID" + "\n" + "gist.domain.com/username/YOUR_GIST_ID&theme_name" + "\n" + "```" + "\n```````"
		MarkdownRenderer.render( this.app, gs_UsageCodeblock, this.cblk_preview, gs_UsageCodeblock, this.plugin )

		/*
			Footer Buttons
		*/

		const div_Footer = contentEl.createDiv( { cls: "modal-button-container" } )

		if ( this.firststart === true )
		{
			new ButtonComponent( div_Footer )
				.setButtonText( lng( "gs_btn_settings_open" ) )
				.setCta( )
				.onClick( ( ) =>
				{
					this.resolve( "settings-open" )
					this.close( )
				} )

			new ButtonComponent( div_Footer )
				.setButtonText( lng( "gs_btn_close" ) )
				.onClick( ( ) =>
				{
					this.close()
				} )
		}
		else
		{
			new ButtonComponent( div_Footer )
				.setButtonText( lng( "gs_btn_close" ) )
				.onClick( ( ) =>
				{
					this.close( )
				} )
		}
	}

	/*
		Modal > Getting Started > Action > Close
	*/

	close( )
	{
		this.resolve( "" )
		super.close( )
	}

	/*
		Modal > Getting Started > Action > On Close
	*/

	onClose( ): void
	{
		this.contentEl.empty( )
	}
}