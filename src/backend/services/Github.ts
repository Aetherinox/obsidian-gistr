import { App, Notice, SuggestModal, MarkdownView, TFile } from 'obsidian'
import GistrPlugin from 'src/main'
import { GistrSettings, SettingsGet } from 'src/settings/settings'
import { FrontmatterPrepare } from 'src/api'
import Noxkit from '@aetherinox/noxkit'
import frontmatter from 'front-matter'
import { Octokit } from '@octokit/rest'
import { lng } from 'src/lang'

/*
    Github Status

    do not change the values, these are assigned by Github
*/

enum Status
{
    success     = 'succeeded',
    fail        = 'failed',
}

/*
    default api status types
*/

export const GHStatusAPI: Record< string, string > =
{
    'operational':              lng( "gist_status_connected" ),
	"degraded_performance":     lng( "gist_status_degraded_performance" ),
	"partial_outage":           lng( "gist_status_partial_outage" ),
	"major_outage":             lng( "gist_status_major_outage" ),
}

/*
    Github Gist Structure
*/

interface GistData
{
    file:       string,
    is_public:  boolean,
    id:         string,
    url:        string,
    user:       string,
    revisions:  number,
    created_at: string,
    updated_at: string,
}

/*
    Github > Personal Access Token
*/

const GISTR_GITHUB_PAT = 'gistr_github_pat'

/*
    Github > Personal Access Token > Set
*/

export const GHTokenSet = ( token: string ): void =>
{
    localStorage.setItem( GISTR_GITHUB_PAT, token )
}

/*
    Github > Personal Access Token > Get
*/

export const GHTokenGet = ( ): string =>
{
    return localStorage.getItem( GISTR_GITHUB_PAT )
}

/*
    Interface > Gist Result
*/

interface ResultsCreateGist
{
    gistArray:          GistData | null
    status:             Status
    errorMessage:       string | null
}

/*
    Interface > Options > Create
*/

interface OptionsCreate
{
    is_public:          boolean
    file:               string
    content:            string
    token:              string
}

/*
    Interface > Options > Update
*/

interface OptionsUpdate
{
    gistArray:          GistData
    content:            string
    token:              string
}

/*
    Interface > Params > Autosave
*/

interface ParamsAutosave
{
    plugin:             GistrPlugin
    app:                App
    note_full:          string
    file:               TFile
}

/*
    Github > Args
*/

interface ArgsGet   { app: App, plugin: GistrPlugin, is_public: boolean }
interface ArgsCopy  { app: App, plugin: GistrPlugin }

/*
    Gist > Get File

    @json       gist json
                    : {
                        "modified": "2024-03-06T14:59:39.000Z",
                        "gists": [
                            {
                                "id":           "XXXX",
                                "url":          "https://gist.github.com/Aetherinox/XXXXXX",
                                "created_at":   "2024-03-07T00:19:23Z",
                                "updated_at":   "2024-03-07T00:31:12Z",
                                "file":         "Note File.md",
                                "is_public":    true || false
                            }
                        ]
                    }
*/

const FindExistingGist = ( gistContents: string ): GistData[ ] =>
{
    const { attributes: json }  = frontmatter<{ gists: GistData[] }>( gistContents )
    const gists                 = json.gists || []

    return ( gists as GistData[] )
}

/*
    Gist > Update

    @body:              gist json
    @content:           formatted vault contents

    @package-frontmatter:
        content.attributes      contains the extracted yaml attributes in json form
        content.body            contains the string contents below the yaml separators
        content.bodyBegin       contains the line number the body contents begins at
        content.frontmatter     contains the original yaml string contents
*/

const InsertFrontmatter = ( gistArray: GistData, note_contents: string ): string =>
{

    const { body: note, attributes: data } = frontmatter<{ gists: GistData[] }>( note_contents )

    const GistList              = ( data.gists || [] ) as GistData[]
    const GistMatching          = GistList.find( ( GistExisting ) => GistExisting.id === gistArray.id )

    /*
        Existing Gist
    */

    if ( GistMatching )
    {
        const otherGists        = GistList.filter( ( GistExisting ) => GistExisting !== GistMatching )
        const gists             = [ ... otherGists, gistArray ]
        const updatedData       = { ... data, gists }

        return Noxkit.stringify( note, updatedData )
    }

    /*
        New Gist

        @updatedData:   gist json
                        : {
                            "modified": "2024-03-06T14:59:39.000Z",
                            "gists": [
                                {
                                    "id":           "XXXX",
                                    "url":          "https://gist.github.com/Aetherinox/XXXXXX",
                                    "created_at":   "2024-03-07T00:19:23Z",
                                    "updated_at":   "2024-03-07T00:31:12Z",
                                    "file":         "Note File.md",
                                    "is_public":    true || false
                                }
                            ]
                        }

        @note:          Test Note Body Contents
    */

    const gists             = [ ... GistList, gistArray ]
    const updatedData       = { ... data, gists }

    return Noxkit.stringify( note, updatedData )
}

/*
    Gist > Update
*/

const Update = async ( args: OptionsUpdate ): Promise< ResultsCreateGist > =>
{
    const { token, gistArray, content } = args

    try
    {
        const octokit       = new Octokit( { auth: token } )
        const response      = await octokit.rest.gists.update( { gist_id: gistArray.id, files: { [ gistArray.file ]: { content } } } )

        return { status: Status.success, gistArray: { ... gistArray, updated_at: response.data.updated_at, user: response.data.owner.login, revisions: response.data.history.length }, errorMessage: null }
    }
    catch ( e )
    {
        return { status: Status.fail, gistArray: gistArray, errorMessage: e.message }
    }
}

/*
    Gist > Create
*/

const Create = async ( args: OptionsCreate ): Promise< ResultsCreateGist > =>
{
    try
    {
        const { file, content, is_public, token } = args

        const octokit           = new Octokit( { auth: token } )
        const octogist          = await octokit.rest.gists.create( { description: file, public: is_public, files: { [ file ]: { content } } } )

        return {
            status:             Status.success, gistArray:
            {
                file,
                is_public,
                id:             octogist.data.id as string,
                url:            octogist.data.html_url as string,
                user:           octogist.data.owner.login as string,
                revisions:      octogist.data.history.length as number,
                created_at:     octogist.data.created_at as string,
                updated_at:     octogist.data.updated_at as string,
            },

            errorMessage: null,
        }
    }
    catch ( e )
    {
        return{ status: Status.fail, gistArray: null, errorMessage: e.message }
    }
}

/*
    DateTime Format

    need to break it up into these crazy steps to allow for customization
*/

const dateTimeformat = ( date: Date ): string =>
{
    const month 	    = date.getMonth( ) + 1
    const month_str     = month.toString( ).padStart( 2, '0' )
    const day 			= date.getDate( ).toString( ).padStart( 2, '0' )
    const year 			= date.getFullYear( ).toString( ).padStart( 2, '0' )

    let hours 		    = date.getHours( )
    const mins 	        = date.getMinutes( )
    const mins_str      = mins.toString( ).padStart( 2, '0' )
    const x 		    = hours >= 12 ? lng( "base_time_pm" ) : lng( "base_time_am" )
    hours 				= hours % 12
    hours 				= hours ? hours : 12

    return month_str + '.' + day + '.' + year + ' ' + hours + ':' + mins_str + ' ' + x
}

/*
    Modal > Select Existing Gist
*/

class SelectExistingModal extends SuggestModal < GistData >
{
    gists:                  GistData[]
    bAllowGistCreateNew:    boolean
    settings:               GistrSettings

    /*
        Suggestion > Submit
    */

    onSubmit: ( gistArray: GistData | null ) => Promise < void >

    /*
        Suggestion > Constructor
    */

    constructor( app: App, settings: GistrSettings, gists: GistData[ ], bAllowGistCreateNew: boolean, onSubmit: ( gistArray: GistData ) => Promise < void > )
    {
        super( app )

        this.settings               = settings
        this.gists                  = gists
        this.bAllowGistCreateNew    = bAllowGistCreateNew
        this.onSubmit               = onSubmit
    }

    /*
        Suggestion > Get
    */

    getSuggestions( ): Array < GistData | null >
    {
        if ( this.bAllowGistCreateNew )
            return this.gists.concat( null )
        else
            return this.gists
    }

    /*
        Suggestion > Render
    */

    renderSuggestion( gistArray: GistData | null, el: HTMLElement )
    {

        /*
            object empty, show "Create New Gist" button
        */

        if ( Object.is( gistArray, null ) )
        {
            const div_Create        = el.createEl( 'div', { text: "", cls: 'gistr-suggest-create' } )
            div_Create.createEl     ( 'div', { text: lng( "gist_btn_create_new" ) } )
    
            return
        }

        /*
            Existing gist found > populate list
        */

        const div_scope             = gistArray.is_public ? lng( "lst_repotype_pub" ) : lng( "lst_repotype_pri" )
        let date                    = new Date( `${ gistArray.updated_at }` )
        let date_created            = dateTimeformat( date )

        const div_Parent            = el.createEl( 'div',   { text: "", cls: 'gistr-suggest-container' } )
        const svg_Icon              = div_Parent.createEl   ( 'div', { text: "", cls: 'gistr-suggest-icon' } )
        svg_Icon.insertAdjacentHTML ( 'afterbegin', "<svg style='color:" + this.settings.sy_clr_lst_icon + "' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 496 512' fill='currentColor'><path d='M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z'></path></svg>" )
        const div_Sub_l             = div_Parent.createEl   ( 'div', { text: "", cls: 'gistr-suggest-sub-container-l' } )
        div_Sub_l.createEl          ( 'div',                { text: gistArray.file, cls: "gistr-suggest-sub-title" } )
        const div_Sub_r             = div_Parent.createEl   ( 'div', { text: "", cls: 'gistr-suggest-sub-container-r' } )
        div_Sub_r.createEl          ( 'div',                { text: div_scope, cls: "gistr-suggest-sub-scope" } )
        div_Parent.createEl         ( 'div',                { text: "", cls: 'gistr-suggest-clear' } )
        div_Sub_l.createEl          ( 'div',                { text: "", cls: 'gistr-suggest-clear' } )
        div_Sub_l.createEl          ( 'div',                { text: `Created: ${ date_created }`, cls: "gistr-suggest-sub-time" } )
    }

    /*
        Suggestion > Choose
    */

    onChooseSuggestion( gistArray: GistData | null )
    {
        this.onSubmit( gistArray ).then( ( ) => this.close( ) )
    }
}

/*
    Github Gist > Get

    Initialized by Obsidian command palette and right-click menu
*/

export const GHGistGet = ( args: ArgsGet ) => async ( ) =>
{

    const { is_public, app, plugin }    = args
    const token                         = GHTokenGet( )
    const repoTarget                    = is_public ? lng( "lst_repotype_pub" ) : lng( "lst_repotype_pri" )
    const
    {
        sy_enable_autoupdate,
        sy_add_frontmatter,
        notitime
    } = await SettingsGet( plugin )

    /*
        User token not specified in settings
    */

    if ( !token )
    {
        new Notice( lng( "err_gist_token_missing" ), notitime * 1000 )
        return
    }

    /*
        Current view
    */

    if ( !app.workspace.getActiveViewOfType( MarkdownView ) )
    {
        new Notice( lng( "gist_upload_no_active_file" ), notitime * 1000 )
        return
    }

    /*
        Continue fetching gist information
    */

    const getView               = app.workspace.getActiveViewOfType( MarkdownView )
    const file                  = getView.file.name
    const editor                = getView.editor
    const noteOrig              = editor.getValue( )
    const ExistingGist          = FindExistingGist( noteOrig ).filter( ( gistArray ) => gistArray.is_public === is_public )
    const gistContent           = sy_add_frontmatter ? noteOrig : FrontmatterPrepare( noteOrig )

    if ( ExistingGist.length && sy_enable_autoupdate )
    {

        new SelectExistingModal
        ( 
            app, plugin.settings, ExistingGist, true, async ( gistArray ) =>
            {

                let output = null

                /*
                    Update or Create
                */

                if ( !gistArray )
                    output = await Create( { file, content: gistContent, token, is_public } )
                else
                    output = await Update( { gistArray, token, content: gistContent } )

                /*
                    API call failed
                */

                if ( process.env.ENV === "dev" )
                    console.log( output )

                if ( output.status === Status.fail )
                {
                    const error_msg     = output.errorMessage
                    const bNotFound     = error_msg.toLowerCase( ).includes( "not found" )

                    if ( bNotFound )
                        new Notice( lng( "gist_not_found" ), notitime * 1000 )

                    new Notice( lng( "gist_upload_fail_api", output.errorMessage ), notitime * 1000 )
                    return
                }

                /*
                    Copy to clipboard
                */

                navigator.clipboard.writeText( output.gistArray.url )

                /*
                    API call Success
                */

                new Notice( lng( "gist_copy_success_file", repoTarget ), notitime * 1000 )
                const editor_newvalue = InsertFrontmatter( output.gistArray, noteOrig )

                if ( process.env.ENV === "dev" )
                    console.log( "GHGistGet -> Insert into editor" )

                editor.setValue( editor_newvalue )

            },
        ).open( )
    }
    else
    {
        const result = await Create( { file, content: gistContent, token, is_public } )

        if ( process.env.ENV === "dev" )
            console.log( result )

        /*
            Failure
        */

        if ( result.status !== Status.success )
            new Notice( lng( "gh_status_error_api", result.errorMessage ) )

        /*
            Success
        */

        navigator.clipboard.writeText( result.gistArray.url )
        const repo_type = is_public ? lng( "lst_repotype_pub" ) : lng( "lst_repotype_pri" )
        new Notice( lng( "gist_copy_success_file", repo_type ), notitime * 1000 )

        /*
            Autosave Feature
        */

        if ( sy_enable_autoupdate )
        {
            const contentResult = InsertFrontmatter( result.gistArray, noteOrig )

            /*
                Create -> Insert frontmatter text into editor window
            */

            if ( process.env.ENV === "dev" )
                console.log( "Create -> Insert into editor" )

            app.vault.modify( getView.file, contentResult )
            editor.refresh( )
        }

    }
}

/*
    Github Gist > Copy

    Copies a gist url to the user's clipboard
*/

export const GHGistCopy = ( args: ArgsCopy ) => async ( ) =>
{
    const { app, plugin }           = args
    const { sy_enable_autoupdate, notitime } = await SettingsGet( plugin )

    if ( !sy_enable_autoupdate )
        return new Notice( lng( "gist_upload_req_allowupload" ), notitime * 1000 )

    const getView = app.workspace.getActiveViewOfType( MarkdownView )

    /*
        No active file focus
    */

    if ( !getView )
        return new Notice( "gist_no_active_file" )

    const editor                = getView.editor
    const noteOrig              = editor.getValue( )
    const ExistingGist          = FindExistingGist( noteOrig )

    /*
        Nothing to copy
    */

    if ( ExistingGist.length === 0 )
        return new Notice( lng( "gist_copy_fail_notagist" ), notitime * 1000 );

    /*
        Obsidian note only has one gist
    */

    if ( ExistingGist.length === 1 )
    {
        const gistArray = ExistingGist[ 0 ]
        navigator.clipboard.writeText( gistArray.url )

        return new Notice( lng( "gist_copy_success" ), notitime * 1000 )
    }

    /*
        Obsidian note has more than one gist associated to it.
        will display the suggestion box and allow the user to select
        which note they wish to copy the url for.

        such examples include making a gist both public and secret
    */

    new SelectExistingModal
    (
        app, plugin.settings, ExistingGist, false, async ( gistArray ) =>
        {
            navigator.clipboard.writeText( gistArray.url )
            new Notice( lng( "gist_copy_success" ), notitime * 1000 )
        },
    ).open( )
}

/*
    Gist > Update Existing

    this process updates an existing github gist.
    the user must have already manually saved the gist.

    if autosave is enabled, this will be ran every x seconds to ensure
    the contents of the note are updated to a gist online.
*/

export const GHGistUpdate = async ( args: ParamsAutosave ) =>
{
    const { plugin, file, note_full: note_full } = args
    const { sy_add_frontmatter, sy_enable_autosave_notice, notitime } = await SettingsGet( plugin )

    /*
        User token not specified in settings
    */

    const token = GHTokenGet( )
    
    if ( !token )
        return new Notice( lng( "err_gist_token_missing" ), notitime * 1000 )
  
    /*
        Find existing notes
    */

    const note_existing         = FindExistingGist( note_full )
    const content               = sy_add_frontmatter ? note_full : FrontmatterPrepare( note_full )
  
    /*
        Validate
    */

    if ( !note_existing.length ) return

    for ( const gistArray of note_existing )
    {
        const res = await Update( { gistArray, token, content } )

        if ( res.status !== Status.success )
        {

            /*
                Update Failed
            */

            new Notice( lng( "gist_upload_fail_api", res.errorMessage ), notitime * 1000 )
        }
        else
        {

            /*
                Update Success
            */

            const note_updated = InsertFrontmatter( res.gistArray, note_full )
            await file.vault.adapter.write( file.path, note_updated )
    
            /*
                Save Notice Enabled
            */
    
            if ( sy_enable_autosave_notice )
                new Notice( lng( "gist_upload_success", file.path ), notitime * 1000 )
        }
    }
}
  