const GISTR_GITHUB_PAT = 'gistr_github_pat'

/*
    Github > Personal Access Token > Get
*/

export const getGithubPAT = ( ): string =>
{
    return localStorage.getItem( GISTR_GITHUB_PAT )
}

/*
    Github > Personal Access Token > Set
*/

export const setGithubPAT = ( token: string ): void =>
{
    localStorage.setItem( GISTR_GITHUB_PAT, token )
}