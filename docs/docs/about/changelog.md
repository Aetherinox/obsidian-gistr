---
tags:
  - changelog
---

# Changelog

![Version](https://img.shields.io/github/v/tag/Aetherinox/obsidian-gistr?logo=GitHub&label=version&color=ba5225) ![Downloads](https://img.shields.io/github/downloads/Aetherinox/obsidian-gistr/total) ![Repo Size](https://img.shields.io/github/repo-size/Aetherinox/obsidian-gistr?label=size&color=59702a) ![Last Commit)](https://img.shields.io/github/last-commit/Aetherinox/obsidian-gistr?color=b43bcc)

### <!-- md:version stable- --> 1.7.0 <small>July 13, 2024</small> { id="1.7.0" }

- `refactor`: performed linting on all files
- `build`: updated main gistr.js build script
- `dep`: bump `@types/node` from 20.12.7 to 20.14.10
- `dep`: bump `electron` from 30.0.1 to 31.1.0
- `dep`: bump `@types/chrome` from 0.0.266 to 0.0.268
- `dep`: bump `rollup` from 4.16.4 to 4.18.0
- `dep`: bump `yaml` from 2.3.4 to 2.4.5
- `dep`: add `@aetherinox/noxenv`
- `dep`: add `typescript-eslint`
- `dep`: add `@typescript-eslint/parser`
- `dep`: add `@typescript-eslint/eslint-plugin`
- `dep`: add `prettier`
- `fix`: fixed bug with calling target file using legacy format
- `tests`: bump version 1.7.0

### <!-- md:version stable- --> 1.6.8 <small>April 26, 2024</small> { id="1.6.8" }

- `build`: updated main gistr.js build script
- `dep`: bump `rollup` from 4.14.0 to 4.16.4
- `dep`: bump `electron` from 29.2.0 to 30.0.1
- `dep`: bump `@codemirror/view` from 6.26.1 to 6.26.3
- `dep`: bump `@types/node` from 20.12.5 to 20.12.7
- `dep`: bump `@types/chrome` from 0.0.265 to 0.0.266

### <!-- md:version stable- --> 1.6.7 <small>April 05, 2024</small> { id="1.6.7" }

- `dep`: bump `@types/chrome` from 0.0.263 to 0.0.265
- `dep`: bump `@types/node` from 20.12.4 to 20.12.5

### <!-- md:version stable- --> 1.6.6 <small>April 04, 2024</small> { id="1.6.6" }

- `dep`: bump `@types/node` from 20.12.3 to 20.12.4
- `dep`: bump `@octokit/rest` from 20.0.2 to 20.1.0
- `build`: update rollup build scripts

### <!-- md:version stable- --> 1.6.5 <small>April 04, 2024</small> { id="1.6.5" }

- `chore`: update language entries
- `chore`: update environment vars for branch main and stable
- `change`: github default dark theme scrollbar color
- `change`: add Env.Api to store api links
- `change`: remove 'AppBase' declaration, migrated to pluginBase
- `tests`: bump version 1.6.5
- `fix`: opengist bug improperly formatting text
- `fix`: css syntax errors

### <!-- md:version stable- --> 1.6.4 <small>April 02, 2024</small> { id="1.6.4" }

- `feat`: add `gistr-web` codeblock as alternative to `raw: true`
- `change`: remove spacer from documentation button in Gistr settings
- `chore`: clean up developer prints
- `chore`: give integrated browser unique id as to not conflict with other plugins
- `fix`: report latest version in settings tab with alternative vars
- `fix`: update checker getting stuck when it cannot contact the github branch
- `tests`: bump demo vault 1.6.4
- `dep`: update @types/node 20.11.30 -> 20.12.3
- `build`: bump version v1.6.4

### <!-- md:version stable- --> 1.6.3 <small>April 01, 2024</small> { id="1.6.3" }

- `feat`: added property `css` for **raw mode**
- `change`: added documentation button to Gistr settings support tab
- `change`: uuid for gists now generated by in-house method instead of nanoid
- `refactor`: major clean up of code, old dependency remnants, and tidy up code
- `perf`: further enhanced performance times and how caching is managed for codeblocks embedded in a note
- `change`: prep-work for next major release and new features coming out, including Github repo support
- `dep`: update rollup 3.29.3 -> 4.13.2
- `dep`: added `@rollup/plugin-replace`
- `remove`: `rollup-plugin-define`
- `remove`: `nanoid`
- `build`: github bot @AdminServ now verified

### <!-- md:version stable- --> 1.6.2 <small>March 31, 2024</small> { id="1.6.2" }

- `fix`: update language entries, fixed a few typos
- `fix`: update leaf header icon tooltip
- `change`: time formatting link in settings changed to: https://aetherinox.github.io/obsidian-gistr/cheatsheets/datetime/
- `change`: default autosave duration, 15 -> 120 seconds
- `change`: datetime format url switched over to mkdocs
- `dep`: bump `electron` from 23.3.13 to 29.1.6
- `dep`: bump `typescript` from 4.9.5 to 5.4.3

### <!-- md:version stable- --> 1.6.1 <small>March 30, 2024</small> { id="1.6.1" }

- `feat`: added new header ribbon button `refresh` which can be enabled in Gistr Global Settings
    - can be enabled in Gistr Settings panel under `Global` with new setting labeled `Enable refresh icon`
    - Allows you to force refresh all of your embedded gist blocks when you change colors and see changes immediately. Gistr initially caches everything so that codeblocks are quicker to load.
- `change`: updated Gistr settings panel link for Personal Access Token documentation, goes to new docs website now
- `perf`: optimized loading of blocks when Obsidian first launched

### <!-- md:version stable- --> 1.6.0 <small>March 29, 2024</small> { id="1.6.0" }

- `feat`: added `raw` property
    - added property `height`
    - added property `zoom`
    - `height` and `zoom` only available in **raw mode**
- `feat`: added ability to view gists with a secondary method which acts as a browser. gives the ability to sign into Github, view, and edit gists.
- `feat`: added compatibility for Gist **mermaid graphs**
- `dep`: added **Saturyn** package for Chromium integration
- `perf` optimizations for loading gists and caching information
- `docs`: updated demo vault to include new examples and the introduction of **property mode**

### <!-- md:version stable- --> 1.5.0 <small>March 25, 2024</small> { id="1.5.0" }

- `feat`: added new format for embedded gists
- `feat`: added 'background' property to codeblocks
- `feat`: added 'color' property to codeblocks
- `refactor`: replaced individual variables with style interface
- `perf`: optmizations to performance, no longer sending 1 call per line.

### <!-- md:version stable- --> 1.4.7 <small>March 23, 2024</small> { id="1.4.7" }

- `change`: updated Github light theme color scheme
  - variables were showing up as bright colors. set light theme to match the color scheme used on Github.com
- `chore`: update types/mode dependency to 20.11.30
- `change`: implement new regex pattern which will allow for v1.5.0 new format coming

### <!-- md:version stable- --> 1.4.6 <small>March 15, 2024</small> { id="1.4.6" }

- `feat`: ability to specify custom datetime format for gists in save list
    - new setting added under **Gist Save & Sync** section
- `feat`: ability to specify showing public and secret gists in save list by themselves or together
    - new setting added under **Gist Save & Sync** section
- `change`: operating system desktop notification for available updates.
    - ties into the autoupdate toggle setting so that it can be enabled / disabled
- `package`: added moment.js package for datetime formatting
- `remove`: removed old datetime method

<br />

### <!-- md:version stable- --> 1.4.5 <small>March 14, 2024</small> { id="1.4.5" }

- `feat`: added ribbon icons on left side of Obsidian
- `feat`: added new setting to enable/disable ribbon
- `chore`: revised code to make plugin compatible with newer dependencies
- `chore`: updated dependency rollup from v2 to v3

<br />

### <!-- md:version stable- --> 1.4.4 <small>March 12, 2024</small> { id="1.4.4" }

- `refactor`: completely changed the structure of the plugin in order to get organized so that new Github features can be added.
- `fix`: corrected icons missing
- `change`: adjusted the timeout duration so that things are quicker to respond
- `change`: added a number of new commands that will be used for connecting OpenGist with Github note saving
- `perf`: optimized numerous methods for performance purposes

<br />

### <!-- md:version stable- --> 1.4.3 <small>March 12, 2024</small> { id="1.4.3" }

- `refactor`: completely changed the structure of the plugin in order to get organized so that new Github features can be added.
- `fix`: corrected icons missing
- `change`: adjusted the timeout duration so that things are quicker to respond
- `change`: added a number of new commands that will be used for connecting OpenGist with Github note saving
- `perf`: optimized numerous methods for performance purposes

<br />

### <!-- md:version stable- --> 1.4.2 <small>March 11, 2024</small> { id="1.4.2" }

- `feat`: added **Reset Defaults** option to all settings so that users can convert back to default settings on any property
- `feat`: added plugin update check to **Support** tab in Gistr plugin settings
- `change`: updated css so that buttons, sliders, and dropdowns would use a proper pointer on any theme, but only for gistr
- `change`: re-structured settings functionality in Gistr (only noteworthy to developer)
- `fix`: default bottom padding for OpenGist to match top padding

<br />

### <!-- md:version stable- --> 1.4.1 <small>March 10, 2024</small> { id="1.4.1" }


- `feat`: added global setting to disable Gistr update notifications
- `feat`: added additional settings to control the colors of things in the Settings interface.
  - accessible by installing the [Obsidian Style Settings](https://github.com/mgmeyers/obsidian-style-settings) plugin.
- `build`: users now get notifications in Obsidian when beta releases of the plugin are available.
    - can be installed using the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat), OR;
    - can be installed manually by downloading and manually copying over the `.js`, `.json`, and `.css` files in the releases section
- `change`: javascript minification now fully implemented to make file sizes smaller
- `chore`: cleaned up css / stylesheet file
- `fix`: content security policy (csp) error which appeared when using OpenGist demo website and other untrusted domains
- `deps`: removed numerous deprecated packages, upgraded them to the latest releases

<br />

### <!-- md:version stable- --> 1.4.0 <small>March 09, 2024</small> { id="1.4.0" }


- `feat`: added the ability to create, save, and update Github with your obsidian vault notes.
      - Can be activated by either right-clicking in your note somewhere, OR opening your Obsidian **Command Palette** and selecting the **Save** options.
- `feat`: added new setting to adjust notification time in settings **Global** tab
- `feat`: added Gistr plugin update notification for both stable and beta releases
- `feat`: added new settings tab **Save & Sync**
- `feat`: added github gist api status indicator in settings
      - `todo:` add setting in v1.4.1 to disable update notification if the user wishes. for now it just pops up for a few seconds as a notification box in the top right.
- `feat`: added ability to either manualy create gists, or have Gistr constantly monitor notes for changes and then push those changes to a gist repo.
- `change`: all sliders now have visual integer to the right of the slider so that users dont have to hover to view the current configured value
- `change`: getting started modal interface updated
- `change`: made minor edits to color scheme for OpenGist
      - `todo`: add color options for different language objects, (e.g.: variables, functions, globals, comments, etc)
- `change`: stable releases will now be minified to reduce code / comments
- `change`: codeblock opacity minimum changed from **0** to **0.20**
- `housekeeping`: cleaned up debug prints, ensured others dont display unless in development environment
- `perf`: made changes to help increase performance. since there is now a feature to constantly check for updates to notes, every microsecond counts.
- `fix`: getting started modal was not opening for users. fixed the variable being stored.

<br />

### <!-- md:version stable- --> 1.3.1 <small>March 07, 2024</small> { id="1.3.1" }

- `change`: stylesheet properties
- `fixed`: ew minor inconsistencies
- `added`: prep-work libraries for upcoming v1.4.0 update
- `added`: frontmatter package to handle adding / editing gists

<br />

### <!-- md:version stable- --> 1.3.0 <small>March 06, 2024</small> { id="1.3.0" }

- `feat`: added opacity setting for Github and Opengist code blocks
- `feat`: added auto-refresh in reading / preview mode
    - When changes to the settings are made, they will automatically update in Reading mode
- `feat`: added "Text Wrapping" mode in **Global Settings**
    - If enabled, text will wrap to the next line instead of showing a scrollbar for certain types of documents.
    - Text wrapping mode does NOT work if you have a gist which has absolutely no spaces anywhere in the text.
- `feat`: added Github **Personal Access Token** field
    - This will be used for the upcoming features which allow you to save / edit gists from your Obsidian vault.
    - It is not needed if you want to just embed gists in your notes.
    - Validates the token entered and notifies the user if the token is proper
- `change`: modified theme colors for Github and Opengist to make things more colorful
- `change`: made custom CSS boxes wider since certain themes were tiny
- `change`: colored settings text between Light and Dark theme settings to make things easier to read
- `change`: tabs in settings now has cursor pointer to indicate it is clickable

<br />

### <!-- md:version stable- --> 1.2.0 <small>March 04, 2024</small> { id="1.2.0" }

- `feat`(github): added support for Github dark theme
- `feat`(github): added new colorization options for github themes
- `feat`(themes): added new color theme option to change codeblock text color
- `feat`(themes): can now force a specific theme on both Github and Opengist snippets
    - append `&themename` to the end of the gist url
- `change`(themes): theme dropdown box moved to "Global" menu tab
- `perf`: minor optimization adjustments
- `chore`: cleaned up stylesheet management for Github and OpenGist

<br />

### <!-- md:version stable- --> 1.1.0 <small>March 02, 2024</small> { id="1.1.0" }

- `added`: color-picker for settings
- `added`: new theme system for OpenGist snippets which allows each gist codeblock to be assigned a different theme
- `chore`: cleaned up code
- `perf`: minor optimizations to how gists are processed which makes them faster loading now.

<br />

### <!-- md:version stable- --> 1.0.0 <small>Feb 29, 2024</small> { id="1.0.0" }

- Initial release
