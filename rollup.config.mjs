/*
*   @package:     gistr
*   @module:      obsidian.md
*   @author:      Aetherinox
*   @url:         https://github.com/Aetherinox/obsidian-gistr
*/

/*
*    import
*/

import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import moment from 'moment';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import license from 'rollup-plugin-license';
import image from '@rollup/plugin-image';
import replace from '@rollup/plugin-replace';
import { v5 as uuidv5 } from 'uuid';
import { readFileSync, writeFileSync } from 'fs';

/*
*    declrations > package.json
*/

const {
    name,
    author,
    version,
    repository
} = JSON.parse( readFileSync( './package.json') );

/*
*    declrations > constants
*/

const now             = moment( ).milliseconds( 0 ).toISOString( );
const build_date      = now;
const bIsProd         = ( process.env.BUILD === 'production' );
const bIsDev          = ( process.env.BUILD === 'dev' );
const year            = moment( now ).year( );
const build_guid      = uuidv5( ` + repository + `, uuidv5.URL )
const build_uuid      = uuidv5( version, build_guid )
const path_save_home  = './'
const path_save_dist  = 'dist/'

/*
*    write build id to file
*
*    export $(cat .env | xargs)
*/

const ids = `
GUID=${ build_guid }
UUID=${ build_uuid }
`;

/*
*    write const ids to .env file
*/

writeFileSync( ".env", ids,
{
    flag: "w"
})

const asdad = process.env.NAME = "reee"

/*
*    banner
*/

const header_banner = `
@name:        ${ name } v${ version }
@author:      ${ author }
@url:         ${ repository.url }
@copyright:   (c) ${ year } ${ author }
@license:     MIT
@build:       ${ build_date }
@guid:        ${ build_guid }
@uuid:        ${ build_uuid }
`;

/*
*    banner output
*/

console.log( header_banner );
console.log( `Running in ${ bIsDev ? 'development' : 'production' } mode` );

/*
*    rollup config
*/

export default {
  input: 'src/main.ts',
  output: {
    dir: path_save_home,
    sourcemap: 'inline',
    sourcemapExcludeSources: bIsProd,
    format: 'cjs',
    exports: 'named'
  },
  external: [
      'obsidian',
      'electron',
      'uuid',
 ],
  plugins: [
    replace( {
      preventAssignment: true,
      values: {
        "process.env.NODE_ENV": bIsProd ? '"production"' : '"dev"',
        "process.env.ENV": bIsProd ? '"production"' : '"dev"',
        "process.env.BUILD": bIsProd ? '"production"' : '"dev"',
        "process.env.PLUGIN_VERSION": `"${ version }"`,
        "process.env.BUILD_GUID": `"${ build_guid }"`,
        "process.env.BUILD_UUID": `"${ build_uuid }"`,
        "process.env.BUILD_DATE": JSON.stringify( moment( now ) ),
        "process.env.AUTHOR": `"${ author }"`,
      },
    } ),
    typescript( ),
    nodeResolve( { browser: true } ),
    commonjs( ),
    image( ),
    terser( {
      ecma: 2020,
      mangle: { toplevel: true },
      compress: {
        module: true,
        toplevel: true,
        unsafe_arrows: true
      },
      format: { comments: false }
    } ),
    license( {
      sourcemap: true,
      banner: {
        content:  `${ header_banner }`,
        commentStyle: 'regular',
      },
    } ),
  ]
};