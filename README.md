<p align="center"><img src="https://raw.githubusercontent.com/Aetherinox/obsidian-gistr/main/Docs/images/banner.png" width="860"></p>
<h1 align="center"><b>Obsidian: Gistr</b></h1>

<div align="center">

![Version](https://img.shields.io/github/v/tag/Aetherinox/obsidian-gistr?logo=GitHub&label=version&color=ba5225) ![Downloads](https://img.shields.io/github/downloads/Aetherinox/obsidian-gistr/total) ![Repo Size](https://img.shields.io/github/repo-size/Aetherinox/obsidian-gistr?label=size&color=59702a) ![Last Commit)](https://img.shields.io/github/last-commit/Aetherinox/obsidian-gistr?color=b43bcc)

</div>

---

<br />

- [About](#about)
- [Features](#features)
- [Usage](#usage)
  - [Github Gist](#github-gist)
  - [OpenGist](#opengist)
- [Install](#install)
  - [Manual](#manual)
  - [BRAT Plugin Manager](#brat-plugin-manager)
- [Build](#build)
- [OpenGist - How It Works](#opengist---how-it-works)
- [Shoutouts](#shoutouts)


<br />

---

<br />

# About

Gistr allows the following:
- Take certain Obsidian notes and upload them as gists
  - Public and secret gists supported
  - Manual upload or enable autosave
- Integrate gist snippets into your notes as codeblocks with any of the following services:
  - [Github Gist](https://gist.github.com)
  - [OpenGist](https://github.com/thomiceli/opengist) (self-hosted)

<br />

<p align="center"><img style="width: 85%;text-align: center;border: 1px solid #353535;" src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/2275ea7f-b94c-47d5-87ec-f623b1cbf0c5"></p>

<br />

To use this plugin, you must either have a Github account for Github Gists, or an installation of [OpenGist](https://github.com/thomiceli/opengist)

<br />

<div align="center">

[![OG-Demo](https://img.shields.io/badge/%20-%20Try%20%20OpenGist%20Demo-%20%236c2368?style=for-the-badge&logo=github&logoColor=FFFFFF)](https://demo.opengist.io/all)
[![OG-Download](https://img.shields.io/badge/%20-%20Download%20OpenGist-%20%23de2343?style=for-the-badge&logo=github&logoColor=FFFFFF)](https://github.com/thomiceli/opengist/releases)
[![OG-Docs](https://img.shields.io/badge/%20-%20View%20%20OpenGist%20Docs-%20%23296ca7?style=for-the-badge&logo=github&logoColor=FFFFFF)](https://github.com/thomiceli/opengist/blob/master/docs/index.md)

</div>

<br />

---

<br />

# Features
**Services**:
- [Github Gists](https://gist.github.com)
- [OpenGist Server](https://github.com/thomiceli/opengist)

<br />

**Themes**:
- Includes **Light** & **Dark** mode for both services
- Ability to customize individual colors
- CSS stylesheet override
- Thinner and customizable scrollbar
- Force theme on each individual gist paste

<br />

**Functionality**:
- Save notes from Obsidian as public or secret gists
  - Manually create or autosave
  - Requires Github [[Personal Access Token]](https://github.com/settings/tokens?type=beta)
- Line numbering
- Link access to view Github Gist or Opengist snippets on website (opens in browser)
- Display single gist from groups with multiple files
- Enable / Disable text wrapping and horizontal scrollbar
- Auto-refresh any edits to your settings in reading mode
- Creating & sharing gists between your Obsidian vault and Github **(coming soon)**

<br />

---

<br />

# Usage
To embed a Github Gist snippet or OpenGist, add a new code block:

<br />

## Github Gist

````shell
```gistr
https://gist.github.com/username/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
gist.github.com/username/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
````

<br />

This plugin can also fetch a Gist which contains multiple notes in a single gist collection:

<br />

<p align="center"><img style="width: 85%;text-align: center;border: 1px solid #353535;" src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/062f2dc0-c14a-4d4f-a3e0-5358458a528a"></p>

<br />

If your gist contains multiple files, you may  target a specific note inside a gist, append `#filename` to the end of your gist url:

````shell
```gistr
https://gist.github.com/Aetherinox/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx#file1
```
````

<br />

If you do not target a specific file on a gist which contains multiple files, all files with that matching URL will be displayed on top of each other.

<br />

Despite whatever theme you have selected in the Gistr settings, you can force a gist note to use a specific theme by appending `&themename` to the end of the url

<br />

**Theme Options:**
- `dark`
- `light`

<br />

````shell
```gistr
https://gist.github.com/Aetherinox/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&dark
```
````

<br />

<br />

## OpenGist
Showing gists from your OpenGist server work in a similar manner to Github. To display gists from OpenGist, create a new codeblock and add your gist URL:

<br />

````shell
```gistr
https://gist.yourdomain.com/username/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
gist.yourdomain.com/username/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
````

<br />

<p align="center"><img style="width: 85%;text-align: center;border: 1px solid #353535;" src="Docs/images/3.png"></p>

<br />

To force a specific theme, append `&themename` at the end of the url

<br />

**Theme Options:**
- `dark`
- `light`

<br />

```shell
https://gist.yourdomain.com/Username/Gist_ID&light
https://gist.yourdomain.com/Username/Gist_ID&dark
```

<br />

<p align="center"><img style="width: 85%;text-align: center;border: 1px solid #353535;" src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/89283b6f-474c-40c5-b008-2966f506e9e1"></p>

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
- Locate `Gistr` and enable it. <img src="https://raw.githubusercontent.com/Aetherinox/obsidian-opengist/main/Docs/images/ui/obsidian-enable.png" data-canonical-src="https://raw.githubusercontent.com/Aetherinox/obsidian-opengist/main/Docs/images/ui/obsidian-enable.png" height=20px />

<br />
<br />

## BRAT Plugin Manager

Plugin can also be installed utilizing the [BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin.
- Install [BRAT](https://github.com/TfTHacker/obsidian42-brat) using the Obsidian Plugin manager
- In your Obsidian settings on the left, select **BRAT** in the list.
- In BRAT settings, click the button **Add Beta Plugin**
- In the textbox, supply the URL to this repo
  - `https://github.com/Aetherinox/obsidian-gistr`
- Once Gistr is installed, activate it in your Obsidian settings. <img src="https://raw.githubusercontent.com/Aetherinox/obsidian-opengist/main/Docs/images/ui/obsidian-enable.png" data-canonical-src="https://raw.githubusercontent.com/Aetherinox/obsidian-opengist/main/Docs/images/ui/obsidian-enable.png" height=20px />

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