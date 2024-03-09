const GISTR_GITHUB_PAT = 'gistr_github_pat'

/*
    Github > Personal Access Token > Set
*/

export const GithubTokenSet = ( token: string ): void =>
{
    localStorage.setItem( GISTR_GITHUB_PAT, token )
}

/*
    Github > Personal Access Token > Get
*/

export const GithubTokenGet = ( ): string =>
{
    return localStorage.getItem( GISTR_GITHUB_PAT )
}
