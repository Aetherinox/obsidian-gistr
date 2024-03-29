/*
    Allows for titles to be utilized
*/

export const SaturynTitle = async ( url: string ): Promise< string > =>
{
    let resp    = await fetch( url )
    let text    = await resp.text( )
    let dom     = new DOMParser( ).parseFromString( text, 'text/html' )

    return dom.title
}