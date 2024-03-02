/*
    @locale     : English (en)
*/

export default
{

    /*
        Tab > Settings > Header
    */

    cfg_modal_desc:                     'Embed Github and Opengist snippets in your notes. For a detailed set of examples, view the demo vault in the support section.',
    cfg_modal_expand:                   'Expand',

    /*
        Tab > Settings > General
    */

    cfg_tab_ge_title:                   'Global',
    cfg_tab_ge_header:                  'These settings affect all aspects of this plugin, including both Opengist and Github. If you change the trigger keyword, ensure you go back through your existing gist snippets and change the keyword at the top of each codeblock; otherwise embedded gists will not appear.',
    cfg_tab_og_title:                   'OpenGist',
    cfg_tab_og_header:                  'Opengist is a self-hosted pastebin powered by Git. All snippets are stored in a Git repository and can be read and/or modified using standard Git commands, or with the web interface. It is similiar to GitHub Gist, but open-source and is self-hosted. OpenGist supports Windows, Linux, and MacOS.',
    cfg_tab_gh_title:                   'Github',
    cfg_tab_gh_header:                  'Github Gists let you store and distribute code snippets without setting up a full-fledged repository. Store snippets such as strings, bash scripts, markdown, text files, and other small pieces of data.',
    cfg_tab_sp_title:                   'Support',
    cfg_tab_ge_keyword_name:            'Trigger keyword',
    cfg_tab_ge_keyword_desc:            'Word to use inside codeblocks to designate as a portal for showing gists',

    /*
        Tab > Settings > OpenGist
    */

    cfg_tab_og_cb_light_name:           'Codeblock bg color (Light)',
    cfg_tab_og_cb_light_desc:           'Color for Opengist codeblock background color (Light Theme)',
    cfg_tab_og_cb_dark_name:            'Codeblock bg color (Dark)',
    cfg_tab_og_cb_dark_desc:            'Color for Opengist codeblock background color (Dark Theme)',
    cfg_tab_og_sb_light_name:           'Scrollbar track color (Light)',
    cfg_tab_og_sb_light_desc:           'Color for gist scrollbar track (Light Theme)',
    cfg_tab_og_sb_dark_name:            'Scrollbar track color (Dark)',
    cfg_tab_og_sb_dark_desc:            'Color for gist scrollbar track (Dark Theme)',
    cfg_tab_og_padding_top_name:        'Padding: top',
    cfg_tab_og_padding_top_desc:        'Padding between gist codeblock header and code.',
    cfg_tab_og_padding_bottom_name:     'Padding: bottom',
    cfg_tab_og_padding_bottom_desc:     'Padding between gist codeblock and the bottom scrollbar.',
    cfg_tab_og_theme_name:              'Theme',
    cfg_tab_og_theme_desc:              'This determines what color scheme will be used when loading an OpenGist code block. MUST reload your note for the new stylesheet to be loaded.',
    cfg_tab_og_css_name:                'Custom CSS',
    cfg_tab_og_css_desc:                'This textarea allows you to enter custom CSS properties to override existing colors.',
    cfg_tab_og_css_pholder:             'Paste CSS here',

    /*
        Tab > Settings > Github
    */

    cfg_tab_gh_css_name:                'Custom CSS',
    cfg_tab_gh_css_desc:                'This textarea allows you to enter custom CSS properties to override existing colors.',
    cfg_tab_gh_css_pholder:             'Paste CSS here',

    /*
        Tab > Settings > Support
    */

    cfg_tab_su_desc:                    'The following buttons are associated to useful resources for this plugin.',
    cfg_tab_su_gs_name:                 'Introduction',
    cfg_tab_su_gs_desc:                 'View brief introduction to getting started with this plugin',
    cfg_tab_su_gs_btn:                  'Open',
    cfg_tab_su_repo_label:              'Plugin repo',
    cfg_tab_su_repo_url:                'https://github.com/Aetherinox/obsidian-gistr',
    cfg_tab_su_repo_btn:                'View',
    cfg_tab_su_vault_label:             'Plugin demo vault',
    cfg_tab_su_vault_url:               'https://github.com/Aetherinox/obsidian-gistr/tree/main/tests/gistr-vault',
    cfg_tab_su_vault_btn:               'View',
    cfg_tab_su_ogrepo_label:            'OpenGist: download',
    cfg_tab_su_ogrepo_url:              'https://github.com/thomiceli/opengist/releases',
    cfg_tab_su_ogrepo_btn:              'View',
    cfg_tab_su_ogdocs_label:            'OpenGist: docs',
    cfg_tab_su_ogdocs_url:              'https://github.com/thomiceli/opengist/blob/master/docs/index.md',
    cfg_tab_su_ogdocs_btn:              'View',
    cfg_tab_su_ogdemo_label:            'OpenGist: demo',
    cfg_tab_su_ogdemo_url:              'https://opengist.thomice.li/all',
    cfg_tab_su_ogdemo_btn:              'View',
    cfg_tab_su_gist_label:              'Github gist',
    cfg_tab_su_gist_url:                'https://gist.github.com/',
    cfg_tab_su_gist_btn:                'View',

    /*
        Getting Started
    */

    gs_base_header:                     'This plugin allows you to integrate both OpenGist and Github Gist pastes within your Obsidian notes. To use this plugin, you can either create a new Github gist, or setup your own OpenGist server. OpenGist is free, and takes only minutes to configure.',
    gs_og_btn_repo:                     'Download OpenGist',
    gs_og_btn_docs:                     'OpenGist Docs',
    gs_og_sub_1:                        'Once you install and set up OpenGist, you can sign in to your OpenGist website and create your first Gist. After your Gist is created, return to your Obsidian node, and integrate your Gist into your note using code similar to the following:',
    gs_og_name:                         'OpenGist integration',
    gs_og_desc:                         'OpenGist supports Windows, Linux, MacOS, and Docker. To download and set up OpenGist, click below.',
    gs_gh_name:                         'Github integration',
    gs_gh_desc:                         'To paste a Github Gist into your note, use a command similar to the following examples:',
    gs_btn_settings_open:               'Open Settings',
    gs_btn_close:                       'Close',
    base_underdev_title:                'Feature Under Development',
    base_underdev_msg:                  'I am currently working with the developer of OpenGist to make minor changes to how OpenGist pastes appear, including moving the "view raw" button to the bottom so that Obsidian\'s edit button does not overlap.',

    /*
        Element > Color Picker
    */

    pickr_dialog:                       'Color Picker',
    pickr_swatch:                       'Color Swatch',
    pickr_toggle:                       'Pick Color',
    pickr_last:                         'Use Last Color',
    pickr_save:                         'Save',
    pickr_cancel:                       'Cancel',
    pickr_clear:                        'Clear',
    pickr_tip_restore_default:          'Restore default color',
    pickr_dev_unknown:                  'Gistr: Unknown color format: {0}',

    /*
        Gist Load Error
    */

    err_gist_loading_fail_name:         '⚠️ Gistr: Failed to load gist:',
    err_gist_loading_fail_resp:         '{0}',
    err_gist_loading_fail_detail:       'Could not load a valid Javascript from gist url: {0}',
    err_gist_loading_fail_url:          'Could not find gist id -- Make sure correct URL is specified. {0}',
}