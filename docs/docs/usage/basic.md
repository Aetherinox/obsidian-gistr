---
tags:
  - usage
---

# Basic Usage
Gistr allows you to embed gist snippets from Github and Opengist directly into your [Obsidian.md](https://obsidian.md) notes. When creating an embedded gist; you have two options for creating the link:

<br />

# Single-Line Method
This format allows you to create an embedded gist by making a codeblock which begins with the keyword `gistr`, and then providing the link to the gist you wish to embed.

<br />

````
```gistr
https://gist.github.com/Aetherinox/5143c674e9adea5b256f5f58fe54ffbc
```
````

<br />

If you wish to specify a certain theme that will be forced for that particular gist; append `&themename` at the end of your URL:

````
```gistr
https://gist.github.com/Aetherinox/5143c674e9adea5b256f5f58fe54ffbc&dark
```
````

<br />

If you have a gist with multiple files and you want to only target one specific file; you can append `#filename` to the end of your gist url:

````
```gistr
https://gist.github.com/Aetherinox/5143c674e9adea5b256f5f58fe54ffbc#obsidian_demo_doc_2&dark
```
````

The above code will create an embedded gist, targeting the file `obsidian_demo_doc_2`, and uses the `dark` theme.

!!! note "Background & text color compatibility"

    The `single-line nethod` does **not** support specifying a background image or text color.

    You must use the [#block-style] explained below.


<br />

# Property Method
The `property method` structure allows you to embed a gist using a list of properties and values as the example below shows; which will embedded a gist using the `dark` theme, the targeted file `obsidian_demo_doc_2`, with white text `FFFFFF` and a background image from imgur.com.

````
```gistr
url:          https://gist.github.com/Aetherinox/5143c674e9adea5b256f5f58fe54ffbc
theme:        dark
file:         obsidian_demo_doc_2
color:        FFFFFF
background:   https://i.imgur.com/95Tajqd.png
```
````

<br />

The above example links an embedded gist, using the `dark` theme, the targeted file `obsidian_demo_doc_2`, with white text `FFFFFF` and a background image from imgur.com

<br />

With the introduction of `raw mode`, you may also integrate an actual gist website into your notes using:

````
```gistr
url:          https://gist.github.com/Aetherinox/5143c674e9adea5b256f5f58fe54ffbc
raw:          true
height:       500
zoom:         0.7
````
