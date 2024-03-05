import GistrPlugin from "src/main"
import { lng, PluginID } from 'src/lang/helpers'

/*
    Settings
*/

export default interface GistrSettings
{
    firststart:         boolean
    keyword:            string | "gistr"
    css_og:             string | null
    css_gh:             string | null
    theme:              string | null
    blk_pad_t:          number | 16
    blk_pad_b:          number | 18
    textwrap:           string | "Enabled"

    og_clr_bg_light:    string | "CBCBCB"
    og_clr_bg_dark:     string | "121315"
    og_clr_sb_light:    string | "#808080"
    og_clr_sb_dark:     string | "#4960BA"
    og_clr_tx_light:    string | "#2A2626"
    og_clr_tx_dark:     string | "#CAD3F5"
    og_opacity:         number | 1

    gh_clr_bg_light:    string | "E5E5E5"
    gh_clr_bg_dark:     string | "121315"
    gh_clr_sb_light:    string | "#3D85C4"
    gh_clr_sb_dark:     string | "#BA496A"
    gh_clr_tx_light:    string | "#2A2626"
    gh_clr_tx_dark:     string | "#CAD3F5"
    gh_opacity:         number | 1
}

/*
    Settings > Get
*/

export const getSettings = async ( plugin: GistrPlugin ): Promise < GistrSettings > =>
{
    await plugin.loadSettings( )
    return plugin.settings
}