import { App, Modal } from 'obsidian'
import GistrPlugin from "src/main"
import { SaturynFormPortalEdit } from './FormPortalEdit'
import { SaturynParams } from './Parameters'

export class SaturynModalPortalEdit extends Modal
{
    portalOptions:          SaturynParams
    onSubmit:               ( result: SaturynParams ) => void
    readonly plugin:        GistrPlugin
    private cblk_preview: 	HTMLElement

    constructor( app: App, plugin: GistrPlugin, portalOptions: SaturynParams, onSubmit: ( res: SaturynParams ) => void )
    {
        super( app )

        this.plugin 		= plugin
        this.onSubmit       = onSubmit
        this.portalOptions  = portalOptions
    }

    /*
        On Open
    */

    onOpen( )
    {
        const { contentEl } = this
        
		/*
			Style main modal
		*/

		this.modalEl.classList.add( 'gistr-portal-edit-modal' )

        contentEl.createEl( 'h3', { text: 'Gistr: Portal' } )
        SaturynFormPortalEdit( this.plugin, contentEl, this.portalOptions, ( res ) =>
        {
            this.onSubmit( res )
            this.close( )
        })
    }

    /*
        On Close
    */

    onClose( )
    {
        const { contentEl } = this
        contentEl.empty( )
    }
}