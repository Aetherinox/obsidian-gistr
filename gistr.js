#!/usr/bin/env node

/*
    build gistr by running
        npm run build

    guid and uuid will be automatically generated and placed
    inside .env file which will then be read by the github workflow
    build script.
*/

/*
    This script handles the following:
        - read package.json
        - create .env file
        - return uuid, guid, version

    can be called with the following external commands:
        - node gistr.js                 returns version of gistr
        - node gistr.js generate        generates uuid / guid and shows all env vars in console
        - node gistr.js uuid            returns gistr uuid
        - node gistr.js guid            returns gistr guid
        - node gistr.js versiom         returns version of gistr

    can be called with the following gistr commands:
        - npm run gistr
        - npm run gistr:generate
        - npm run env-gistr
        - npm run env-uuid
        - npm run env-guid
        - npm run env-version
*/

const fs = require('fs')
const { v5: uuid } = require('uuid')

/*
 *    declrations > package.json
 */

const { version, repository } = JSON.parse(fs.readFileSync('package.json'))
const args = process.argv.slice(2, process.argv.length)
const action = args[0]
// const a       = args[ 1 ];
// const b       = args[ 2 ];

if (action === 'guid') {
    console.log(`${process.env.GUID}`)
} else if (action === 'setup') {
    fs.writeFileSync('.env', '', (err) => {
        if (err) {
            console.error(err)
        } else {
            console.log(`Wrote to .env successfully`)
        }
    })
} else if (action === 'generate') {
    const buildGuid = uuid(`${repository.url}`, uuid.URL)
    const buildUuid = uuid(version, buildGuid)

    const ids = `
VERSION=${version}
GUID=${buildGuid}
UUID=${buildUuid}
`

    console.log(version)
    console.log(buildGuid)
    console.log(buildUuid)

    fs.writeFileSync('.env', ids, (err) => {
        if (err) {
            console.error(`Could not write env vars: ${err}`)
        } else {
            console.log(`Wrote env vars to .env`)
        }
    })
} else if (action === 'uuid') {
    console.log(`${process.env.UUID}`)
} else {
    console.log(version)
}

process.exit(0)
