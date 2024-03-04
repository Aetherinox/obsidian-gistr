export default interface GistrSettings
{
    firststart:         boolean
    keyword:            string | "gistr"
    css_og:             string | null
    css_gh:             string | null
    theme:              string | null
    blk_pad_t:          number | 10
    blk_pad_b:          number | 15

    og_clr_bg_light:    string | "cbcbcb"
    og_clr_bg_dark:     string | "121315"
    og_clr_sb_light:    string | "#808080"
    og_clr_sb_dark:     string | "#363636"
    og_clr_tx_light:    string | "#2A2626"
    og_clr_tx_dark:     string | "#CAD3F5"

    gh_clr_bg_light:    string | "E5E5E5"
    gh_clr_bg_dark:     string | "121315"
    gh_clr_sb_light:    string | "#3d85c4"
    gh_clr_sb_dark:     string | "#363636"
    gh_clr_tx_light:    string | "#2A2626"
    gh_clr_tx_dark:     string | "#CAD3F5"
}