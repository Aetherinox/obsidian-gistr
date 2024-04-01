---
title: Properties
tags:
  - usage
---

# Properties
This section explains the various properties that can be used when creating an embedded gist. A list of the available properties have been outlined below, as well as a description of what each one does and how to use them.

<br />

## Overview
You have numerous properties you can set for each embedded gist:

| Property | Description |
| --- | --- |
| `url` | Path to the gist you want to link to |
| `file` | Specify a target file for gists which contain multiple files |
| `theme` | Theme to use for a specific embedded gist block |
| `color` | Text color to use for non syntax-highlighted code |
| `background` | Direct URL to image which will be used as the background for the codeblock. |
| `raw` | Allows you to integrate gists with mermaid graphs as a actual website instead of a codeblock. This property also works with normal gists. Gives you the ability to sign in to Github, as well as edit gists. |
| `zoom` | _**(Raw Mode Only)**_: Determines how big the content and text will appear in the gist window. Default value: `1`. 50% would be `0.5`|
| `height` | _**(Raw Mode Only)**_: Specify the height of the window when displaying a gist. |

<br />
<br />


### URL
<!-- md:version stable-1.0.0 -->
<!-- md:flag required -->

The `url` property is the only **required** property that you must set when embedding a gist. Simply specify the `url` property, followed by a colon `:`, and then the URL to the website you wish to mebed.

````ini
```gistr
url:          https://gist.github.com/Aetherinox/5143c674e9adea5b256f5f58fe54ffbc
```
````

<br />

### File
<!-- md:version stable-1.0.0 -->
<!-- md:default `empty` -->

The `file` property allows you to target a specific file if your gist link contains more than one file. 

````ini
```gistr
url:          https://gist.github.com/Aetherinox/5143c674e9adea5b256f5f58fe54ffbc
file:         my_second_file.md
```
````

<br />

<figure markdown="span">
  ![Github: Multiple Files](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/78d9f05e-34a3-4b35-bdc0-b11cc7233cd2){ width="100%" }
  <figcaption>Github: Multiple Files</figcaption>
</figure>

<br />

You can find the name of your gist's associated files by clicking on the gist within Github or Opengist. The filename should appear to the top-left of the actual text for the gist.

<br />

### Theme
<!-- md:version stable-1.2.0 -->
<!-- md:default `Light` -->

The `theme` property allows you to specify a specific theme that a codeblock will use. This property overrides whatever theme you have selected in the [Settings](../settings/global.md#theme) panel.

Available options:

- Light
- Dark

````ini
```gistr
url:          https://gist.github.com/Aetherinox/5143c674e9adea5b256f5f58fe54ffbc
theme:        dark
```
````

<br />

!!! warning "Caching & Theme Changes"

    To make embedded gists appear quickly; the data in your notes is cached. This means that if you change the theme for a codeblock; you will not see the change automatically unless you leave the note and return.

    You can also refresh the page by going into **Reading Mode** and then back into **Editing Mode**.

<br />

### Color
<!-- md:version stable-1.5.0 -->
<!-- md:default `#FFFFFF | #000000` -->
<!-- md:control color #FFFFFF #000000 -->

The `color` property allows you to change the overall text which appears inside an embedded gist. The text color depends on which theme you have selected. Light theme displays black text, dark theme shows white text.

````ini
```gistr
url:          https://gist.github.com/Aetherinox/5143c674e9adea5b256f5f58fe54ffbc
color:        FFFFFF
```
````

<br />

This setting is especially useful if you also combine it with the [Background](#background) setting and add backgrounds that have similar colors to the existing text color.

Text color accepts a hex color value. The hex color value typically begins with a pound symbol ( `#`), however, this symbol is optional with this plugin. The plugin will automatically take care of it.

<br />

#### Using Hex

To create custom colors, you can use combinations of the hexadecimal numbers, which represent specific colors. For a hex color, there are six digits of hexadecimal values. Each pair of two digits represents **red**, **green**, and **blue**. The pattern looks like `#RRGGBB` (where red is R, green is G, and blue is B).

<br />

Colors are represented by a combination of red, green, and blue values. The lowest value (00) will be the darkest version of the color (closest to black), and the highest value (FF) will be the lightest version of the color (closest to white).

<br />

Each single value can be any of the following:

| Type | Characters |
| --- | --- |
| Numerical | 0, 1, 2, 3, 4, 5, 6, 7, 8, and 9 |
| Alphabetic | A, B, C, D, E, F |

<br />

The following is a list of common colors to show how your color values should appear:

| Color | Hex |
| --- | --- |
| <span class='color-box-left' style='background-color: #000000;'>  </span> Black | `000000` |
| <span class='color-box-left' style='background-color: #FFFFFF;'>  </span> White | `FFFFFF` |
| <span class='color-box-left' style='background-color: #C0C0C0;'>  </span> Silver | `C0C0C0` |
| <span class='color-box-left' style='background-color: #808080;'>  </span> Gray | `808080` |
| <span class='color-box-left' style='background-color: #FF0000;'>  </span> Red | `FF0000` |
| <span class='color-box-left' style='background-color: #FFFF00;'>  </span> Yellow | `FFFF00` |
| <span class='color-box-left' style='background-color: #008000;'>  </span> Green | `008000` |
| <span class='color-box-left' style='background-color: #0000FF;'>  </span> Blue | `0000FF` |

<br />

#### Using Hex Opacity

When it comes to hex colors with opacity / transparency, you will add an additional two values to the hex color, meaning in total, you will have 8 values with the structure `RRGGBBAA`. `00` being completely opaque / transparent, and `FF` being solid. A list of the values for opacity and their percentages have been listed below. _(click the box to show)_
<br />

??? info "Hex Opacity / Transparency Values"

    ``` { .annotate }
      100% — FF
      99% — FC
      98% — FA
      97% — F7
      96% — F5
      95% — F2
      94% — F0
      93% — ED
      92% — EB
      91% — E8
      90% — E6
      89% — E3
      88% — E0
      87% — DE
      86% — DB
      85% — D9
      84% — D6
      83% — D4
      82% — D1
      81% — CF
      80% — CC
      79% — C9
      78% — C7
      77% — C4
      76% — C2
      75% — BF
      74% — BD
      73% — BA
      72% — B8
      71% — B5
      70% — B3
      69% — B0
      68% — AD
      67% — AB
      66% — A8
      65% — A6
      64% — A3
      63% — A1
      62% — 9E
      61% — 9C
      60% — 99
      59% — 96
      58% — 94
      57% — 91
      56% — 8F
      55% — 8C
      54% — 8A
      53% — 87
      52% — 85
      51% — 82
      50% — 80
      49% — 7D
      48% — 7A
      47% — 78
      46% — 75
      45% — 73
      44% — 70
      43% — 6E
      42% — 6B
      41% — 69
      40% — 66
      39% — 63
      38% — 61
      37% — 5E
      36% — 5C
      35% — 59
      34% — 57
      33% — 54
      32% — 52
      31% — 4F
      30% — 4D
      29% — 4A
      28% — 47
      27% — 45
      26% — 42
      25% — 40
      24% — 3D
      23% — 3B
      22% — 38
      21% — 36
      20% — 33
      19% — 30
      18% — 2E
      17% — 2B
      16% — 29
      15% — 26
      14% — 24
      13% — 21
      12% — 1F
      11% — 1C
      10% — 1A
      9% — 17
      8% — 14
      7% — 12
      6% — 0F
      5% — 0D
      4% — 0A
      3% — 08
      2% — 05
      1% — 03
      0% — 00
    ```

<br />

#### Colorpicker
If you would like a visual color picker, utilize the tool below:

```embed
url:          https://www.webfx.com/web-design/color-picker/
name:         Online Color Picker
image:        https://play-lh.googleusercontent.com/DoTrq2XuQOteT32rxsxOgiw2vwjU5nZJP8FFB_0D4VrXfb17c_LEUoW0Rj3my4mAbg
```

<br />

For a color picker with Hex + Opacity, visit:

```embed
url:          https://rgbcolorpicker.com/0-1
name:         Online Color Picker with Opacity
image:        https://is4-ssl.mzstatic.com/image/thumb/Purple124/v4/46/71/a9/4671a9a2-bfdd-ffda-5a8b-5b88f7520c7f/AppIcon-1x_U007emarketing-0-7-0-85-220.png/256x256bb.jpg
```

<br />

### Background
<!-- md:version stable-1.5.0 -->
<!-- md:default `none` -->

The `background` property allows you specify your own images that will be used as the background for each embedded gist codeblock. You must use an absolute full URL to an image hosted online.

````ini
```gistr
url:           https://gist.github.com/Aetherinox/5143c674e9adea5b256f5f58fe54ffbc
background:    https://i.imgur.com/95Tajqd.png
```
````

<br />

This property especially useful when combining it with the [[#Color]] property. If you use a background that is similar to your text color; you can force the text color to be another hex value.

<br />

````ini
```gistr
url:           https://gist.github.com/Aetherinox/5143c674e9adea5b256f5f58fe54ffbc
background:    https://i.imgur.com/95Tajqd.png
color:         FFFFFF
```
````

<br />

### Raw
<!-- md:version stable-1.6.0 -->
<!-- md:default `false` -->

The `raw` property allows you to integrate gists which utilize **Mermaid Graphs**.  This property makes the gist act like an integrated browser which gives you the ability to actually sign in to Github, view the mermaid graph, and even edit it.

This property also works with normal gists if you wish to view the gist in a browser-like environment.

````ini
```gistr
url:     https://gist.github.com/Aetherinox/8e4707e6ae0d688935065133a4cbd398
raw:     true
```
````

<br />

<figure markdown="span">
  ![Github: Mermaid Graph](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/a1104ae2-00b5-4835-97f5-9edd51f39f6e){ width="100%" }
  <figcaption>Github: Mermaid Graph using `raw` mode</figcaption>
</figure>

<br />

If you do decide to use the `raw` property; you will also gain access to a few additional properties you can add:

<br />

#### Property: Zoom
<!-- md:version stable-1.6.0 -->
<!-- md:default `1` -->

Since the `raw` property makes your gists behave more like a real browser, we've included the `zoom` property which allows you to make the contents of the site bigger or smaller.

The default value is `1` which equals `100%`. If you would like to use `50%`, then you would enter `0.5`. You may also set the content size to `2` which would make the content appear at `200%`.

<br />

#### Property: Height
<!-- md:version stable-1.6.0 -->
<!-- md:default `600` -->

The `height` property allows you to specify how tall the window will be within your Obsidian note. If you do not specify a custom height, then it will default to `600`, which represents 600 **pixels**.

<br />

#### Property: CSS
<!-- md:version stable-1.6.3 -->
<!-- md:default `none` -->

The `css` property allows you to override any website's default CSS.

````
```gistr
url:    https://gist.github.com/Aetherinox/f7525990fba2cba6a3ee7b61ac626c21
raw:    true
zoom:   0.8
height: 500
css: | 
   body { background-color: #FFF !important; }
   h1 { font-size: 60pt !important; color: #000 !important; }
```
````

<br />

The above example will force all `h1` headers to use a larger font size, and change the text color to black, as well as make the entire website background color white.

CSS rules can be on their own lines, or on the same line as the property name.

````
```gistr
url:    https://gist.github.com/Aetherinox/f7525990fba2cba6a3ee7b61ac626c21
raw:    true
css:    body { background-color: #FFF !important; }
```
````

!!! important "Overriding CSS"

    Certain websites such as Github utilize the [!important](https://www.w3schools.com/css/css_important.asp) property on quite a few CSS rules.

    You must use `!important` at the end of your property to attempt overriding Github's rule. 

<br />

<br />
<br />