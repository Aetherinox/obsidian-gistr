import { GistrSettings } from 'src/settings'

/*
    Default Settings
*/

export const SettingsDefaults: GistrSettings =
{
    keyword:                    "gistr",
    firststart:                 true,
    css_og:                     "",
    css_gh:                     "",
    theme:                      "Light",
    blk_pad_t:                  16,
    blk_pad_b:                  19,
    textwrap:                   "Enabled",
    notitime:                   10,
    ge_enable_updatenoti:       true,

    sy_clr_lst_icon:            "#757575E6",

    og_clr_bg_light:            "#CBCBCB",
    og_clr_bg_dark:             "#121315",
    og_clr_sb_light:            "#BA4956",
    og_clr_sb_dark:             "#4960ba",
    og_clr_tx_light:            "#2A2626",
    og_clr_tx_dark:             "#CAD3F5",
    og_opacity:                 1,

    gh_clr_bg_light:            "#E5E5E5",
    gh_clr_bg_dark:             "#121315",
    gh_clr_sb_light:            "#BA4956",
    gh_clr_sb_dark:             "#BA496A",
    gh_clr_tx_light:            "#2A2626",
    gh_clr_tx_dark:             "#CAD3F5",
    gh_opacity:                 1,

    ge_enable_ribbon_icons:     false,
    sy_enable_ribbon_icons:     true,
    sy_enable_autoupdate:       true,
    sy_enable_autosave:         false,
    sy_enable_autosave_strict:  false,
    sy_enable_autosave_notice:  false,
    sy_add_frontmatter:         false,
    sy_save_list_showall:       false,
    sy_save_list_datetime:      "MM.DD.YYYY h:m:s a",
    sy_save_duration:           120,
    ge_contextmenu_sorting:     [],
    portals:                    {},
    uuid:                       ""
}
