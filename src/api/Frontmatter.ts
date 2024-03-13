import frontmatter from 'front-matter'

/*
    Clean Frontmatter
*/

export const FrontmatterPrepare    = ( body: string ): string => frontmatter( body ).body