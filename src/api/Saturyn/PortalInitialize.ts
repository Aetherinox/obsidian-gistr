import { Platform, ItemView, WorkspaceLeaf, Menu } from 'obsidian'
import { SaturynParams } from './Parameters'
import { SaturynCreateWebapp } from './PortalCreateWebapp'
import { SaturynCreateIframe } from './PortalCreateIframe'
import WebviewTag = Electron.WebviewTag

export class SaturynPortalInitialize extends ItemView
{
    private readonly params:        SaturynParams
    private frame:                  WebviewTag | HTMLIFrameElement
    private readonly bUseIframe:    boolean = false
    private IframeCB:               Function[]
    private bFrameReady:            boolean = false

    constructor( leaf: WorkspaceLeaf, params: SaturynParams )
    {
        super( leaf )

        this.navigation             = false
        this.params                 = params
        this.bUseIframe             = Platform.isMobileApp
        this.IframeCB               = []
    }

    /*
        addAction
    */

    addActions( ): void
    {
        this.addAction( 'refresh-ccw', 'Reload', ( ) =>
        {
            if ( this.frame instanceof HTMLIFrameElement )
                this.frame.contentWindow?.location.reload( )
            else
                this.frame.reload( )
        } )

        this.addAction( 'home', 'Home page', ( ) =>
        {
            if ( this.frame instanceof HTMLIFrameElement )
                this.frame.src = this.params?.url ?? 'about:blank'
            else
                this.frame.loadURL( this.params?.url ?? 'about:blank' )
        })
    }

    /*
        Webview Frame
    */

    isWebviewFrame( ): boolean
    {
        return this.frame! instanceof HTMLIFrameElement
    }

    /*
        onLoad
    */

    onload( ): void
    {
        super.onload( )
        this.addActions( )

        this.contentEl.empty( )
        this.contentEl.addClass( 'saturyn-view' )

        const onReady = ( ) =>
        {
            if ( !this.bFrameReady )
            {
                this.bFrameReady = true
                this.IframeCB.forEach( ( cb ) => cb( ) )
            }
        }

        if ( this.bUseIframe )
            this.frame = SaturynCreateIframe( this.params, onReady )
        else
            this.frame = SaturynCreateWebapp( this.params, onReady )

        this.contentEl.appendChild( this.frame as unknown as HTMLElement )
    }

    /*
        onUnload
    */

    onunload( ): void
    {
        this.frame.remove( )
        super.onunload( )
    }

    /*
        onPanelmenu
    */

    onPaneMenu( menu: Menu, src: string ): void
    {
        super.onPaneMenu( menu, src )

        /*
            Right-Click Menu > Open in Default Browser
        */

        menu.addItem( ( item ) =>
        {
            item.setTitle( 'Open in browser' )
            item.setIcon( 'globe' )
            item.onClick( ( ) =>
            {
                if ( this.frame instanceof HTMLIFrameElement )
                {
                    window.open( this.frame.src )
                    return
                }

                window.open( this.frame.getURL( ) )
            } )
        } )

        /*
            Right-Click Menu > Reload
        */

        menu.addItem( ( item ) =>
        {
            item.setTitle( 'Reload' )
            item.setIcon( 'refresh-ccw' )
            item.onClick( ( ) =>
            {
                if ( this.frame instanceof HTMLIFrameElement )
                    this.frame.contentWindow?.location.reload( )
                else
                    this.frame.reload( )
            } )
        } )

        /*
            Right-Click Menu > Home
        */

        menu.addItem( ( item ) =>
        {
            item.setTitle( 'Home' )
            item.setIcon( 'home' )
            item.onClick( async ( ) =>
            {
                if ( this.frame instanceof HTMLIFrameElement )
                    this.frame.src = this.params?.url ?? 'about:blank'
                else
                    await this.frame.loadURL( this.params?.url ?? 'about:blank' )
            } )
        } )
    }

    getViewType( ): string
    {
        return this.params?.id ?? 'portal'
    }

    getDisplayText( ): string
    {
        return this.params?.title ?? 'Portal'
    }

    getIcon( ): string
    {
        if ( this.params?.icon.startsWith( '<svg' ) )
            return this.params.id

        return this.params?.icon ?? 'globe'
    }

    /*
        Run code after frame is loaded
    */

    onFrameReady( cb: Function )
    {
        if ( this.bFrameReady )
            cb( )
        else
            this.IframeCB.push( cb )
    }

    /*
        dynamically route from to different url
    */

    async setUrl( url: string )
    {
        if ( this.frame instanceof HTMLIFrameElement )
            this.frame.src = url
        else
        {
            if ( this.frame.isLoading( ) )
            {
                this.frame.stop( )
            }

            await this.frame.loadURL( url )
        }
    }
}