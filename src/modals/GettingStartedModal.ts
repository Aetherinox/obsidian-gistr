/*
	Modal > Getting Started
*/

import { App, Modal, ButtonComponent, MarkdownRenderer } from "obsidian"
import GistrPlugin from "src/main"
import { lng } from 'src/lang/helpers'

/*
    Declare Json
*/

export interface ManifestJson
{
	id: 			string
	description: 	string
    name:     		string
    version:  		string
}

/*
	Modal > Getting Started > Class
*/

export default class ModalGettingStarted extends Modal
{
	private resolve: 		( ( value: string ) => void )
	private firststart: 	boolean
	private manifest: 		ManifestJson
	private plugin: 		GistrPlugin
	private cblk_preview: 	HTMLElement

	/*
		Getting Started > Constructor
	*/

	constructor( plugin: GistrPlugin, app: App, bFirstLoad: boolean  )
	{
		super( app )

		this.plugin 		= plugin
		this.manifest 		= plugin.manifest
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
			Customize moodal stylesheet
		*/

		this.modalEl.classList.add( 'gistr-gs-modal' )

		/*
			Modal > Getting Started > Content > Header
		*/

		AddLine( contentEl, this.manifest.name + " " + "v" + this.manifest.version, "h2" )
		AddLine( contentEl, lng( "gs_base_header" ), "small" )

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

		const gs_UsageCodeblock = "```````" + "\n" + "```" + this.plugin.settings.keyword + "\n" + "gist.domain.com/username/YOUR_GIST_ID" + "\n" + "```" + "\n```````"
		MarkdownRenderer.render( this.plugin.app, gs_UsageCodeblock, this.cblk_preview, gs_UsageCodeblock, this.plugin )

		AddLine( contentEl, "", "div", "gistr-gs-separator" )

		/*
			Modal > Getting Started > Content > Getting Started
		*/

		AddLine( contentEl, lng( "gs_gh_name" ), "h3" )
		AddLine( contentEl, lng( "gs_gh_desc" ), "small" )

		this.cblk_preview = contentEl.createDiv( )

		const gs_UsageCodeblock_gh = "```````" + "\n" + "```" + this.plugin.settings.keyword + "\n" + "gist.github.com/username/YOUR_GIST_ID" + "\n" + "gist.github.com/username/YOUR_GIST_ID#file_name" + "\n" + "```" + "\n```````"
		MarkdownRenderer.render( this.plugin.app, gs_UsageCodeblock_gh, this.cblk_preview, gs_UsageCodeblock_gh, this.plugin )

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