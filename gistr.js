#!/usr/bin/env node

//  Execute:
//      npx --quiet env-cmd --no-override node gistr.js version
//      npx --quiet env-cmd --no-override node gistr.js guid
//      npx --quiet env-cmd --no-override node gistr.js uuid

const args      = process.argv.slice( 2, process.argv.length );
const action    = args[ 0 ];
const a         = args[ 1 ];
const b         = args[ 2 ];

if ( action === "guid" )
{
    console.log( `${ process.env.GUID }` );
}
else if( action === "uuid" )
{
    console.log( `${ process.env.UUID }` );
}
else
{
    console.log( require( './package.json' ).version );
}

process.exit( 0 );