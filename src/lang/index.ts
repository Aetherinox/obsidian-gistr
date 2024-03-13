/*
    Languages Helper
*/

import { moment } from "obsidian"
import en from "./locale/en"

/*
    Language entries
*/

const SetupLocale: { [ i: string ]: Partial< typeof en > } =
{
    en,
}

/*
    get locale val
*/

const locale = SetupLocale[ moment.locale( ) ]

/*
    Language Method
*/

export function lng( item: keyof typeof en, ...args: string[] ) : string
{
    if ( !locale )
        console.error( "Gistr language not found", moment.locale( ) )

    let val = ( locale && locale[ item ] ) || en[ item ]
    return val.replace( /{(\d+)}/g, ( match, index ) =>
    {
        const replace = args[ index ]
        return typeof replace !== 'undefined' ? replace : match
    } )
}