import { App, PluginManifest, apiVersion } from 'obsidian'

/*
    Plugin ID

    hardcoded because it's needed as quickly as possible.
    without this id, gists will not load. it doesnt have time
    to wait on Env.manifest.id
*/

export function PID( ) : string
{
    return 'gistr'
}

/*
    Web URL string
*/

type HttpsUrl = `https://${ string }`

/*
    Repository Strings
*/

type Repo =
{
    urlDocs?:       HttpsUrl
    urlRepo?:       HttpsUrl
    urlWiki?:       HttpsUrl
    urlIssues?:     HttpsUrl
    urlReleases?:   HttpsUrl
    urlPackage?:    HttpsUrl
    urlDemoVault?:  HttpsUrl
}

/*
    Class > Env
*/

export abstract class Env
{

    private static _obsidianApiVer:     string
    private static _manifest:           PluginManifest

    public static readonly Links: Repo =
    {
        urlDocs:        'https://aetherinox.github.io/obsidian-gistr',
        urlRepo:        'https://github.com/Aetherinox/obsidian-gistr',
        urlWiki:        'https://github.com/Aetherinox/obsidian-gistr/wiki',
        urlIssues:      'https://github.com/Aetherinox/obsidian-gistr/issues',
        urlReleases:    'https://github.com/Aetherinox/obsidian-gistr/releases',
        urlPackage:     'https://raw.githubusercontent.com/Aetherinox/obsidian-gistr/{0}/package.json',
        urlDemoVault:   'https://github.com/Aetherinox/obsidian-gistr/tree/main/tests/gistr-vault',
    }

    /*
        Initialize
    */

    static _Initialize( app: App, manifest: PluginManifest )
    {
        if ( this._manifest || this._obsidianApiVer )
            throw console.log( 'Plugin attempted to define data more than once' )

        this._obsidianApiVer    = apiVersion
        this._manifest          = manifest
    }

    /*
        Obsidian API Version
    */

    static get obsidianVersion( )
    {
        if ( !this._obsidianApiVer )
            throw console.log( 'Obsidian version not set. Ensure Env._Initialize() has fired. ' )

        return this._obsidianApiVer
    }

    /*
        Plugin ID
    */

    static get pluginId( ): string
    {
        return this.manifest.id
    }

    /*
        Plugin Name
    */

    static get pluginName( ): string
    {
        return this.manifest.name
    }

    /*
        Plugin manifest
    */

    static get manifest( ): PluginManifest
    {
        if ( !this._manifest )
            throw console.log( 'Plugin manifest not set. Ensure Env._Initialize() has fired.' )

        return this._manifest
    }

    /*
        Long Identity
    */

    static get longIdent( ): string
    {
        return `${ this.manifest.name } ( ${ this.manifest.id } @ v${ this.manifest.version } )`
    }

    /*
        GUID ( global identifier )
    */

        static get guid( ): string
        {
            return `${ process.env.BUILD_GUID }`
        }

    /*
        UUID ( unique identifier )
    */

    static get uuid( ): string
    {
        return `${ process.env.BUILD_UUID }`
    }

    /*
        build date
    */

    static get buildDate( ): string
    {
        return `${ process.env.BUILD_DATE }`
    }

}