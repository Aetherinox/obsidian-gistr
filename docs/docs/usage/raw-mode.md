---
title: "Using Raw Mode"
tags:
  - usage
---

# Raw Mode
Setting a codeblock to run in `raw mode` is a unique feature introduced in [v1.6.0](../changelog.md#160-march-29-2024--id160).

It allows you to display a gist in a web-browser environment instead of as a simple codeblock. This is useful for gists which include mermaid graphs.

Github has configured gists to require numerous javascript files in order to navigate the graph and view the data; which cannot be obtained through conventional methods that are used for normal codeblocks / text. Whereas raw mode allows for these javascript files to be loaded locally in your Obsidian notes.

!!! note annotate  "Website Support"

    `Raw Mode` was specially developed as a way to display gists with mermaid graphs; however, raw mode will actually work for any website on the internet being displayed.

<br />

## Cookies & Sign-in
Raw mode allows you to view a full version of the specified website; which means you also have the option to sign into websites such as Github just as you would in a normal browser. This gives you access to not only view your gists, but also edit them, as well as view any other content available on Github or your Opengist website.

<br />

## Enabling Raw Mode
To switch your codeblock from a normal text codeblock over to raw mode; you must structure your codeblock in the following manner:

````
```gistr
url:     https://gist.github.com/Aetherinox/f7525990fba2cba6a3ee7b61ac626c21
raw:     true
zoom:    0.8
height:  500
```
````

<br />

## Additional Properties
Along with specifying `raw`, you also have access to the properties:

- `zoom`
- `height`

<br />

| Property | Description |
| --- | --- |
| [zoom](../usage/properties.md#property-zoom) | _**(Raw Mode Only)**_: Determines how big the content and text will appear in the gist window. Default value: `1`. 50% would be `0.5`|
| [height](../usage/properties.md#property-height) | _**(Raw Mode Only)**_: Specify the height of the window when displaying a gist. |
| [css](../usage/properties.md#property-css) | _**(Raw Mode Only)**_: Allows you to override a targeted website's default css |

<br />

Detailed information on these properties can be found on the [Properties](../usage/properties.md) page.
