<div align="center">
<h1>♾️ Gistr Plugin ♾️</h1>
<br />
<p>A plugin for Obsidian.md which allows you to create, convert, and update notes from Obsidian to Github or Opengist.</p>

<br />

<img src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/106bcb32-6c6f-423c-a8c6-c6aee3d31c65" width="630">

<br />

</div>

<div align="center">

<!-- prettier-ignore-start -->
[![Version][badge-version-gh]][link-version-gh] [![Build Status][badge-build]][link-build] [![Downloads][badge-downloads-gh]][link-downloads-gh] [![Size][badge-size-gh]][badge-size-gh] [![Last Commit][badge-commit]][badge-commit] [![Contributors][badge-all-contributors]](#contributors-)
<!-- prettier-ignore-end -->

</div>

<br />

---

<br />

- [About](#about)
- [Features](#features)
  - [Methods:](#methods)
    - [Method 1: Codeblock](#method-1-codeblock)
    - [Method 2: Integrated Browser](#method-2-integrated-browser)
  - [Convert Note to Gist:](#convert-note-to-gist)
- [Usage](#usage)
  - [Github Gist](#github-gist)
  - [OpenGist](#opengist)
- [Install](#install)
  - [Manual](#manual)
  - [BRAT Plugin Manager](#brat-plugin-manager)
- [Build](#build)
- [OpenGist - How It Works](#opengist---how-it-works)
- [Shoutouts](#shoutouts)
  - [Contributors ✨](#contributors-)


<br />

---

<br />

# About
The following is an outline of what Gistr can do for you:

<br />

**Supported Services**:
- [Github Gists](https://gist.github.com)
- [OpenGist Server](https://github.com/thomiceli/opengist)
- _As of v1.6.x_: Any website

<br />

**Functionality**:
- Two modes for embedding: **Codeblock mode** and **Website mode**.
- (**Website Mode**): Embed any website into your Obsidian notes. Fully functioning browser with ability to sign in to accounts and navigate.
  - Can be used for Github / Gist mermaid graphs
  - Activated with [raw](https://aetherinox.github.io/obsidian-gistr/usage/properties/#raw) property
  - [raw](https://aetherinox.github.io/obsidian-gistr/usage/properties/#raw) property supports the ability to specify additional properties:
    - [zoom](https://aetherinox.github.io/obsidian-gistr/usage/properties/#property-zoom): change the size of the website
    - [height](https://aetherinox.github.io/obsidian-gistr/usage/properties/#property-height): change the height of the website frame
    - [css](https://aetherinox.github.io/obsidian-gistr/usage/properties/#property-css): override existing CSS on the embedded website
- Save notes from Obsidian as public or secret gists
  - Manual and autosave settings available
  - Requires Github [Personal Access Token](https://github.com/settings/tokens?type=beta) (free).
    - [Click here to read setup instructions](https://aetherinox.github.io/obsidian-gistr/settings/github/)
- Line numbering & syntax highlighting
- Open embedded Github Gist or Opengist snippets from your notes in your device browser
- Filter out gists that contain more than one file
- Enable / Disable text wrapping and horizontal scrollbar
- Fast performance and caching
- Complete customization for almost every aspect of the plugin and the sites you embed

<br />

**Themes**:
- Includes **Light** & **Dark** themes for Github and Opengist
- Customize individual colors through Gistr settings, or use CSS stylesheet override
- Thin and customizable scrollbar
- Force amy theme on each individual gist paste

<br />

---

<br />

# Features
This section gives a brief explanation of what Gistr can do. Please note that the list below is very minimal and does not cover everything the plugin can do. To view a full feature list; read the documentation:

- [Docs: Basic Usage](https://aetherinox.github.io/obsidian-gistr/usage/basic/)
- [Docs: Properties List](https://aetherinox.github.io/obsidian-gistr/usage/properties/)

<br />

## Methods:
As of version `1.6.0`, Gistr now includes **two** ways to integrate gists into your obsidian.md notes.

- Method 1: [Codeblocks](#method-1-codeblock)
- Method 2: [Integrated Browser](#method-2-integrated-browser)

<br />

### Method 1: Codeblock
This option displays gists in a codeblock with line numbers, and the text of the gist.

<br />

<p align="center"><img style="width: 85%;text-align: center;border: 1px solid #353535;" src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/0670cb0c-56d7-4495-8ee2-9776ec9befca"></p>

<br /><br />

### Method 2: Integrated Browser
This option displays gists in a browser-like environment. It allows you to sign into Github or your Opengist site and view / edit your gists.

<br />

<p align="center"><img style="width: 85%;text-align: center;border: 1px solid #353535;" src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/a1104ae2-00b5-4835-97f5-9edd51f39f6e"></p>

<br />
<br />

## Convert Note to Gist:
This feature allows you to take notes in your Obsidian vault and upload them as gists to Github or Opengist.

<br />

After writing your note in Obsidian, right-click anywhere in your note and select **Save Gist**, then choose the type: `public` or `secret`.

<br />

If you have already uploaded an Obsidian note as a gist, you can update the gist right from Obsidian. Either manually save, or allow the plugint o automatically update your gist every x minutes (can be changed in the plugin settings).

<br />

<p align="center"><img style="width: 85%;text-align: center;border: 1px solid #353535;" src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/d787bb1c-1179-4293-bf67-d2bc3dbf0e5b"></p>

<br />

> [!NOTE]
>
> To convert your notes into gists, you must register for a [Personal Access Token](https://github.com/settings/tokens?type=beta) on Github.

<br />

---

<br />

# Usage
To embed a snippet from Github or OpenGist, add a new code block:

<br />

## Github Gist

````shell
```gistr
url:    https://gist.github.com/username/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
````

<br />

<p align="center"><img style="width: 85%;text-align: center;border: 1px solid #353535;" src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/062f2dc0-c14a-4d4f-a3e0-5358458a528a"></p>

<br />

This plugin can also fetch a Gist which contains multiple notes in a single collection. If your gist contains multiple files, you can target a specific note to show by using the `file`
property:

````shell
```gistr
url:    https://gist.github.com/Aetherinox/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
file:   file1
```
````

<br />

If you do not target a specific file on a gist which contains multiple files, all files with that matching URL will be displayed on top of each other.

<br />

You can force an individual gist to use a specific theme. You may choose the theme `dark` or `light`:

````shell
```gistr
url:    https://gist.github.com/Aetherinox/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
theme:  dark
```
````

<br />

<br />

## OpenGist
Showing gists from your OpenGist server work in a similar manner to Github. To display gists from OpenGist, create a new codeblock and add your gist URL:

<br />

````shell
```gistr
url:    https://gist.yourdomain.com/username/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
````

<br />

<p align="center"><img style="width: 85%;text-align: center;border: 1px solid #353535;" src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/3e396b9f-7b31-4e9c-8557-2d6276c9afaa"></p>

<br />

You can force an individual gist to use a specific theme. You may choose the theme `dark` or `light`:

<br />

```shell
url:    https://gist.yourdomain.com/Username/Gist_ID
theme:  light
```

<br />

<p align="center"><img style="width: 85%;text-align: center;border: 1px solid #353535;" src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/89283b6f-474c-40c5-b008-2966f506e9e1"></p>

<br />

To use Opengist, you must install the program on your system as a service, or you can rent a web server. To view a demo of Opengist, as well as full documentation; visit the links below:

<br />

<div align="center">

[![OG-Demo](https://img.shields.io/badge/%20-%20Try%20%20OpenGist%20Demo-%20%236c2368?style=for-the-badge&logo=github&logoColor=FFFFFF)](https://demo.opengist.io/all)
[![OG-Download](https://img.shields.io/badge/%20-%20Download%20OpenGist-%20%23de2343?style=for-the-badge&logo=github&logoColor=FFFFFF)](https://github.com/thomiceli/opengist/releases)
[![OG-Docs](https://img.shields.io/badge/%20-%20View%20%20OpenGist%20Docs-%20%23296ca7?style=for-the-badge&logo=github&logoColor=FFFFFF)](https://github.com/thomiceli/opengist/blob/master/docs/index.md)

</div>

<br />

---

<br />

# Install
The following instructions explain how to install this plugin for Obsidian.

<br />

## Manual

- Install [Obsidian.md](obsidian.md/)
- Go to the [Releases](https://github.com/Aetherinox/obsidian-gistr/releases) tab in this Github repo, and download the associated files:
  - `main.js`
  - `manifest.json`
  - `styles.css`
  - <small>all releases also include a `.zip` with the files above.</small>

- Locate your Obsidian Plugins Folder `X:\.obsidian\plugins`
- Create new folder in **Plugins** folder labeled `gistr`
- Inside the new folder, paste the files you have downloaded from this Github repo.

```
📂 .obsidian
   📂 plugins
      📂 gistr
         📄 main.js
         📄 manifest.json
         📄 styles.css
```
- Launch Obsidian and click the Settings Cog Icon `⚙️`
- On the left, select **Community Plugins**
- Locate `Gistr` and enable it. <img src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/3e512f8a-5c7d-4bff-a3e8-3ef88e673e72" data-canonical-src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/3e512f8a-5c7d-4bff-a3e8-3ef88e673e72" height=20px />

<br />
<br />

## BRAT Plugin Manager

Plugin can also be installed utilizing the [BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin.
- Install [BRAT](https://github.com/TfTHacker/obsidian42-brat) using the Obsidian Plugin manager
- In your Obsidian settings on the left, select **BRAT** in the list.
- In BRAT settings, click the button **Add Beta Plugin**
- In the textbox, supply the URL to this repo
  - `https://github.com/Aetherinox/obsidian-gistr`
- Once Gistr is installed, activate it in your Obsidian settings. <img src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/3e512f8a-5c7d-4bff-a3e8-3ef88e673e72" data-canonical-src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/3e512f8a-5c7d-4bff-a3e8-3ef88e673e72" height=20px />

<br />

---

<br />

# Build
For a detailed set of instructions on how to download this plugin's source files and compile your own version, check out the wiki link below:
- [How to Build Gistr](https://github.com/Aetherinox/obsidian-gistr/wiki/3.-Build)

<br />

---

<br />

# OpenGist - How It Works
The following explains the procedure behind this plugin and OpenGist.

As of v1.6.0, [OpenGist](https://github.com/thomiceli/opengist) includes a feature which works much like Github. Every time you upload a new gist to your OpenGist website, you can view that gist normally by going to the associated link:

```
https://gist.yourdomain.com/username/000abcdef1234567abcdef1234567abc
```

<br />

With OpenGist, you may now fetch `JSON` information about a gist, and include your gist in outside programs such as Obsidian.md.

<br />

To manually view the JSON, HTML, Javascript, and CSS feeds for each of your OpenGists, append `.json` to the end of your URL:

```
https://gist.yourdomain.com/username/000abcdef1234567abcdef1234567abc.json
```

<br />

You will be presented with JSON which defines the values associated to your created gist:

```json
{
  "created_at": "2023-09-24T00:00:000",
  "description": "Opengist Demo Paste",
  "embed": {
    "css": "https://gist.domain.com/assets/embed-abcde123.css",
    "html": "<div class=\"opengist-embed\" id=\"000abcdef1234567abcdef1234567abc\">\n    <div class=\"html \">\n    \n        <div class=\"rounded-md border-1 border-gray-100 dark:border-gray-800 overflow-auto mb-4\">\n            <div class=\"border-b-1 border-gray-100 dark:border-gray-700 text-xs p-2 pl-4 bg-gray-50 dark:bg-gray-800 text-gray-400\">\n                <a target=\"_blank\" href=\"https://gist.domain.com/Username/000abcdef1234567abcdef1234567abc#file-demo\"><span class=\"font-bold text-gray-700 dark:text-gray-200\">Opengist Demo Paste</span> · 145 B · Text</a>\n                <span class=\"float-right\"><a target=\"_blank\" href=\"https://gist.domain.com\">Hosted via Opengist</a> · <span class=\"text-gray-700 dark:text-gray-200 font-bold\"><a target=\"_blank\" href=\"https://gist.domain.com/Username/000abcdef1234567abcdef1234567abc/raw/HEAD/demo_file.md\">view raw</a></span></span>\n            </div>\n            \n            \n            \n            <div class=\"code dark:bg-gray-900\">\n            \n            \n                <table class=\"chroma table-code w-full whitespace-pre\" data-filename-slug=\"demo\" data-filename=\"demo\" style=\"font-size: 0.8em; border-spacing: 0; border-collapse: collapse;\">\n                    <tbody>\n                        \n                        \n                        <tr><td id=\"file-demo-1\" class=\"select-none line-num px-4\">1</td><td class=\"line-code\">Opengist Demo Paste\n</td></tr>\n                    </tbody>\n                </table>\n            \n            </div>\n            \n\n        </div>\n    \n    </div>\n</div>\n",
    "js": "https://gist.domain.com/Username/000abcdef1234567abcdef1234567abc.js",
    "js_dark": "https://gist.domain.com/Username/000abcdef1234567abcdef1234567abc.js?dark"
  },
  "files": [
    {
      "filename": "demo",
      "size": 743,
      "human_size": "145 B",
      "content": "Opengist Demo Paste",
      "truncated": false,
      "type": "Text"
    }
  ],
  "id": "000abcdef1234567abcdef1234567abc",
  "owner": "Username",
  "title": "Opengist Demo Paste",
  "uuid": "000abcdef1234567abcdef1234567abc",
  "visibility": "unlisted"
}
```

<br />

---

<br />

# Shoutouts
- [thomiceli](https://github.com/thomiceli)  over at [OpenGist](https://github.com/thomiceli/opengist) for implementing the JSON functionality request.
- [linjunpop](https://github.com/linjunpop) for developing the first Obsidian [Gist](https://github.com/linjunpop/obsidian-gist) plugin. It was a top choice in my list of plugins used.


<br />

---

<br />

## Contributors ✨
We are always looking for contributors. If you feel that you can provide something useful to Gistr, then we'd love to review your suggestion. Before submitting your contribution, please review the following resources:

- [Pull Request Procedure](.github/PULL_REQUEST_TEMPLATE.md)
- [Contributor Policy](CONTRIBUTING.md)

<br />

Want to help but can't write code?
- Review [active questions by our community](https://github.com/Aetherinox/obsidian-gistr/labels/help%20wanted) and answer the ones you know.

<br />

The following people have helped get this project going:

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![Contributors][badge-all-contributors]](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://gitlab.com/Aetherinox"><img src="https://avatars.githubusercontent.com/u/118329232?v=4?s=40" width="40px;" alt="Aetherinox"/><br /><sub><b>Aetherinox</b></sub></a><br /><a href="https://github.com/Aetherinox/obsidian-gistr/commits?author=Aetherinox" title="Code">💻</a> <a href="#projectManagement-Aetherinox" title="Project Management">📆</a> <a href="#fundingFinding-Aetherinox" title="Funding Finding">🔍</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->



<br />
<br />

<!-- prettier-ignore-start -->

<!-- BADGE > GENERAL -->
[link-general-npm]: https://npmjs.com
[link-general-nodejs]: https://nodejs.org
[link-npmtrends]: http://npmtrends.com/obsidian-gistr

<!-- BADGE > VERSION > GITHUB -->
[badge-version-gh]: https://img.shields.io/github/v/tag/Aetherinox/obsidian-gistr?logo=GitHub&label=Version&color=ba5225
[link-version-gh]: https://github.com/Aetherinox/obsidian-gistr/releases

<!-- BADGE > VERSION > NPMJS -->
[badge-version-npm]: https://img.shields.io/npm/v/obsidian-gistr?logo=npm&label=Version&color=ba5225
[link-version-npm]: https://npmjs.com/package/obsidian-gistr

<!-- BADGE > LICENSE -->
[badge-license-mit]: https://img.shields.io/badge/MIT-FFF?logo=creativecommons&logoColor=FFFFFF&label=License&color=9d29a0
[link-license-mit]: https://github.com/Aetherinox/obsidian-gistr/blob/main/LICENSE

<!-- BADGE > BUILD -->

[badge-build]: https://img.shields.io/github/actions/workflow/status/Aetherinox/obsidian-gistr/release-npm.yml?logo=github&logoColor=FFFFFF&label=Build&color=%23278b30
[link-build]: https://github.com/Aetherinox/obsidian-gistr/actions/workflows/release-npm.yml

<!-- BADGE > DOWNLOAD COUNT -->
[badge-downloads-gh]: https://img.shields.io/github/downloads/Aetherinox/obsidian-gistr/total?logo=github&logoColor=FFFFFF&label=Downloads&color=376892
[link-downloads-gh]: https://github.com/Aetherinox/obsidian-gistr/releases

[badge-downloads-npm]: https://img.shields.io/npm/dw/%40aetherinox%2Fmarked-alert-fa?logo=npm&&label=Downloads&color=376892
[link-downloads-npm]: https://npmjs.com/package/obsidian-gistr

<!-- BADGE > DOWNLOAD SIZE -->
[badge-size-gh]: https://img.shields.io/github/repo-size/Aetherinox/obsidian-gistr?logo=github&label=Size&color=59702a
[link-size-gh]: https://github.com/Aetherinox/obsidian-gistr/releases

[badge-size-npm]: https://img.shields.io/npm/unpacked-size/obsidian-gistr/latest?logo=npm&label=Size&color=59702a
[link-size-npm]: https://npmjs.com/package/obsidian-gistr

<!-- BADGE > COVERAGE -->
[badge-coverage]: https://img.shields.io/codecov/c/github/Aetherinox/obsidian-gistr?token=MPAVASGIOG&logo=codecov&logoColor=FFFFFF&label=Coverage&color=354b9e
[link-coverage]: https://codecov.io/github/Aetherinox/obsidian-gistr

<!-- BADGE > ALL CONTRIBUTORS -->
[badge-all-contributors]: https://img.shields.io/github/all-contributors/Aetherinox/obsidian-gistr?logo=contributorcovenant&color=de1f6f&label=contributors
[link-all-contributors]: https://github.com/all-contributors/all-contributors

[badge-tests]: https://img.shields.io/github/actions/workflow/status/Aetherinox/marked-alert-fa/npm-tests.yml?logo=github&label=Tests&color=2c6488
[link-tests]: https://github.com/Aetherinox/obsidian-gistr/actions/workflows/tests.yml

[badge-commit]: https://img.shields.io/github/last-commit/Aetherinox/obsidian-gistr?logo=conventionalcommits&logoColor=FFFFFF&label=Last%20Commit&color=313131
[link-commit]: https://github.com/Aetherinox/obsidian-gistr/commits/main/

<!-- prettier-ignore-end -->

