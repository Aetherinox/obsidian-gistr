export type SaturynParamsType = 'left' | 'center' | 'right'

/*
    Saturyn Parameters

    id:             browser id
    icon:           svg code / icon id from lucide.dev icons
    title:          browser title
    url:            browser URL
    profileKey:     chrome profile
    hasRibbon:      true: icon appears in the left sidebar
    userAgent:      user agent
    zoom:           zoom ( 0.5 = 50%, 1.0 = 100%, 2.0 = 200%, {...} )
    css:            custom css
    js:             custom js
    dock:           'left' || 'center' || 'right'
*/

export type SaturynParams =
{
    id:             string,
    icon:           string,
    title:          string,
    url:            string,
    profileKey?:    string,
    hasRibbon?:     boolean,
    userAgent?:     string,
    zoom?:          number,
    css?:           string,
    js?:            string,
    dock?:          SaturynParamsType,
}