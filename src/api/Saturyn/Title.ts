/*
    Allows for titles to be utilized
*/

export const SaturynTitle = async ( url: string ): Promise< string > =>
{
    const resp      = await fetch( url )
    const text      = await resp.text( )
    const dom       = new DOMParser( ).parseFromString( text, 'text/html' )

    return dom.title
}
