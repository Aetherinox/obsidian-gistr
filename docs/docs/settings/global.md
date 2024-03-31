---
title: "Settings > Global"
tags:
  - settings
---

# Global Settings
These are generic settings that do not belong to a specific category.

| Setting | Description |
| --- | --- |
| [Theme](#theme) | The theme that will be used to display gists embedded in your notes. If you force a single gist snippet to use a particular theme, this will be overwritten for that one gist only. |
| [Text Wrapping](#text-wrapping) | This will determine if gists display a horizontal scrollbar. If a gist contains text that is not wrapped, a scrollbar will appear and allow you to scroll over the width of the gist.<br /><br />Enabled = text will be wrapped to the next line.<br />Disabled = codeblock will display horizontal scrollbar |
| [Trigger Keyword](#trigger-keyword) | This is the phrase to use when initializing a new gist codeblock. If you change this value, you must go through your notes and also change to the new keyword. |
| [Enable update notifications](#enable-update-notifications) | This will determine if you receive a notification box when you first launch Obsidian if Gistr has a new update available. This includes both stable and beta versions. |
| [Notification duration](#notification-duration) | If Gistr sends you a notification, this will determine how long you see the notification for.<br><br>Set to `0` if you wish for notifications to stay open and not disappear until you click on them. |
| [Enable refresh icon](#enable-refresh-icon) | Adds a special icon to the top header ribbon of your Obsidian interface which forcefully refreshes all of your embedded gist codeblocks, making color changes appear immediately. |

<br />

## Theme
<!-- md:version stable-1.0.0 -->
<!-- md:default `light` -->
<!-- md:control dropdown -->

This setting allows you to switch the color which is used for codeblocks that are turned into gists.

<br />

Gistr comes with two themes:

 1. Light Mode
 2. Dark Mode

<br />

The `Themes` setting allows you to flip between these two themes for your gist codeblocks; no matter what theme you use for Obsidian.

On top of being able to select which theme that gists are displayed in; you will also be able to override this setting for any specific gist. These settings however, are covered in the sections:

- [Github](github.md)
- [Opengist](opengist.md)

<br />

---

<br />

## Text Wrapping
<!-- md:version stable-1.3.0 -->
<!-- md:default `false` -->
<!-- md:control toggle -->

This feature will determine how text from your gist snippets appears in Obsidian codeblocks. 

<br />

<!-- md:control toggle_on --> `Enabled`

:   No matter what the structure of the text in the gist is; Gistr will attempt to word-wrap lines that exceed the width of the gist codeblock.

<figure markdown="span">
  ![Text Wrapping: Enabled](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/0670cb0c-56d7-4495-8ee2-9776ec9befca){ width="100%" }
  <figcaption>Text Wrapping: Enabled</figcaption>
</figure>

<br />


<!-- md:control toggle_off --> `Disabled`

:   Gist codeblocks will try to make text appear just as it does in your original gist. If you embed a paste which has text only on one line; Gistr will attempt to display your gist in the same exact manner.

<figure markdown="span">
  ![Text Wrapping: Disabled](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/f0c11152-a047-4398-93e4-ffc8f114c08a){ width="100%" }
  <figcaption>Text Wrapping: Disabled</figcaption>
</figure>

<br />

## Trigger Keyword
<!-- md:version stable-1.0.0 -->
<!-- md:default `gistr` -->
<!-- md:control textbox -->

This is the phrase to use when initializing a new gist codeblock. If you change this value, you must go through your notes and also change to the new keyword.

The keyword is what begins your codeblock for embedding gists:

````
```keyword
```
````

By default, the keyword is `gistr`

````
```gistr
```
````

<br />

## Enable Update Notifications
<!-- md:version stable-1.4.6 -->
<!-- md:default `true` -->
<!-- md:control toggle -->

This will determine if you receive a notification box when you first launch Obsidian if Gistr has a new update available. This includes both stable and beta versions.

<br />

<!-- md:control toggle_on --> `Enabled`

:   When launching Obsidian; you will receive a system notification indicating an update is available for Gistr. This feature uses your operating system notification functionality. This includes both stable and beta releases.

<!-- md:control toggle_off --> `Disabled`

:   No notification will display when updates are available. You must manually check.

<br />

## Notification Duration
<!-- md:version stable-1.4.0 -->
<!-- md:default `10 seconds` -->
<!-- md:control slider -->

If Gistr sends you a notification, this will determine how long you see the notification for.
Set to `0` if you wish for notifications to stay open and not disappear until you click on them.

This setting is for ALL notifications, not just update notifications.

<br />

## Enable Refresh Icon
<!-- md:version stable-1.6.1 -->
<!-- md:default `false` -->
<!-- md:control toggle -->

Adds a special icon to the top header ribbon of your Obsidian interface. This button will force your embedded gistr codeblocks to automatically refresh once pressed. By default, Gistr caches any codeblocks you have added to ensure that content from Github and Opengist appears immediately. This means that when you change settings such as colors; the change will not appear immediately. By using this button, changes will immediately take affect and be visible in your notes.

<figure markdown="span">
  ![Refresh icon](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/a3062f02-4576-4651-8695-6dbcbf2c8224){ width="100%" }
  <figcaption>Refresh icon</figcaption>
</figure>

<br />

<!-- md:control toggle_on --> `Enabled`

:   Icon will appear in top-right Obsidian ribbon.

<!-- md:control toggle_off --> `Disabled`

:   No icon will appear

<br /><br />