---
tags:
  - settings
---

# Global Settings
These are generic settings that do not belong to a specific category.

| Setting | Description |
| --- | --- |
| `Theme` | The theme that will be used to display gists embedded in your notes. If you force a single gist snippet to use a particular theme, this will be overwritten for that one gist only. |
| `Text Wrapping` | This will determine if gists display a horizontal scrollbar. If a gist contains text that is not wrapped, a scrollbar will appear and allow you to scroll over the width of the gist.<br /><br />Enabled = text will be wrapped to the next line.<br />Disabled = codeblock will display horizontal scrollbar |
| `Trigger Keyword` | This is the phrase to use when initializing a new gist codeblock. If you change this value, you must go through your notes and also change to the new keyword. |
| `Enable Gistr update notifications Keyword` | This will determine if you receive a notification box when you first launch Obsidian if Gistr has a new update available. This includes both stable and beta versions. |
| `Notification duration` | If Gistr sends you a notification, this will determine how long you see the notification for.<br><br>Set to `0` if you wish for notifications to stay open and not disappear until you click on them. |

<br />

# Theme
Gistr comes with two themes:

 1. Light Mode
 2. Dark Mode

<br />

The `Themes` setting allows you to flip between these two themes for your gist codeblocks; no matter what theme you use for Obsidian.

On top of being able to select which theme that gists are displayed in; you will also be able to override this setting for any specific gist. These settings however, are covered in the sections:

- [Github](github.md)
- [Opengist](opengist.md)

<br />

# Text Wrapping
This feature will determine how text from your gist snippets appears in Obsidian codeblocks. 


`Enabled`

:   No matter what the structure of the text in the gist is; Gistr will attempt to word-wrap lines that exceed the width of the gist codeblock.

<figure markdown="span">
  ![Text Wrapping: Enabled](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/0670cb0c-56d7-4495-8ee2-9776ec9befca){ width="100%" }
  <figcaption>Text Wrapping: Enabled</figcaption>
</figure>

<br />


`Disabled`

:   Gist codeblocks will try to make text appear just as it does in your original gist. If you embed a paste which has text only on one line; Gistr will attempt to display your gist in the same exact manner.

<figure markdown="span">
  ![Text Wrapping: Disabled](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/f0c11152-a047-4398-93e4-ffc8f114c08a){ width="100%" }
  <figcaption>Text Wrapping: Disabled</figcaption>
</figure>