const GISTR_OGIST_PAT = 'gistr_opengist_pat'

/*
    OpenGist > Personal Access Token > Set
*/

export const OpengistTokenSet = ( token: string ): void =>
{
    localStorage.setItem( GISTR_OGIST_PAT, token )
}

/*
    OpenGist > Personal Access Token > Get
*/

export const OpengistTokenGet = ( ): string =>
{
    return localStorage.getItem( GISTR_OGIST_PAT )
}