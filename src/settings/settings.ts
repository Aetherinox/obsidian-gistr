import GistrPlugin from "src/main"

/*
    Settings
*/

export interface GistrSettings
{
    firststart:                 boolean
    keyword:                    string | "gistr"
    css_og:                     string | null
    css_gh:                     string | null
    theme:                      string | null
    blk_pad_t:                  number | 16
    blk_pad_b:                  number | 19
    textwrap:                   string | "Enabled"
    notitime:                   number | 10
    sy_clr_lst_icon:            string | "757575E6"
    ge_enable_updatenoti:       boolean | true

    og_clr_bg_light:            string | "CBCBCB"
    og_clr_bg_dark:             string | "121315"
    og_clr_sb_light:            string | "808080"
    og_clr_sb_dark:             string | "4960BA"
    og_clr_tx_light:            string | "2A2626"
    og_clr_tx_dark:             string | "CAD3F5"
    og_opacity:                 number | 1

    gh_clr_bg_light:            string | "E5E5E5"
    gh_clr_bg_dark:             string | "121315"
    gh_clr_sb_light:            string | "3D85C4"
    gh_clr_sb_dark:             string | "BA496A"
    gh_clr_tx_light:            string | "2A2626"
    gh_clr_tx_dark:             string | "CAD3F5"
    gh_opacity:                 number | 1

    sy_enable_ribbon_icons:     boolean | true
    sy_enable_autoupdate:       boolean | true
    sy_enable_autosave:         boolean | false
    sy_enable_autosave_strict:  boolean | false
    sy_enable_autosave_notice:  boolean | false
    sy_add_frontmatter:         boolean | false
    sy_save_list_showall:       boolean | false
    sy_save_list_datetime:      string | "MM.DD.YYYY h:m:s a"
    sy_save_duration:           number | 10

    context_sorting:    [],
}

/*
    Settings > Get
*/

export const SettingsGet = async ( plugin: GistrPlugin ): Promise < GistrSettings > =>
{
    await plugin.loadSettings( )
    return plugin.settings
}