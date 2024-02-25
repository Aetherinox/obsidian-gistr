<h1 align="center"><b>Contributing</b></h1>

<div align="center">

![Version](https://img.shields.io/github/v/tag/Aetherinox/obsidian-gistr?logo=GitHub&label=version&color=ba5225) ![Downloads](https://img.shields.io/github/downloads/Aetherinox/obsidian-gistr/total) ![Repo Size](https://img.shields.io/github/repo-size/Aetherinox/obsidian-gistr?label=size&color=59702a) ![Last Commit)](https://img.shields.io/github/last-commit/Aetherinox/obsidian-gistr?color=b43bcc)

</div>

<br />

---

<br />

## Submitting Bugs

Please ensure that when you submit bugs; you are detailed.

* Explain the issue
* Describe how the function should operate, and what you are experiencing instead.
* Provide possible options for a resolution or insight

<br />

---

<br />

## Contributing

The source is here for everyone to collectively share and colaborate on. If you think you have a possible solution to a problem; don't be afraid to get your hands dirty.

If you wish to submit your own contribution, simply follow a few guidelines:

<br />

### Vertical alignment
Align similar elements vertically, to make typo-generated bugs more obvious

```typescript
const CFG_DEFAULT: GistrSettings =
{
    keyword:            "gistr",
    theme:              "Light",
    firststart:         true,
    css_og:             null,
    css_gh:             null,
    blk_pad_t:          10,
    blk_pad_b:          20,
    og_clr_bg_light:    "cbcbcb",
    og_clr_bg_dark:     "121315"
}
```

<br />

### Spaces Instead Of Tabs
When writing your code, set your IDE to utilize **spaces**, with a configured tab size of `4 characters`.

<br />

### Indentation Style
Try to stick to `Allman` as your style for indentations. This style puts the brace associated with a control statement on the next line, indented to the same level as the control statement. Statements within the braces are indented to the next level

```typescript
createHeader( elm: HTMLElement )
{

    elm.empty( )
    elm.createEl( "h1", { text: lng( "cfg_title" ) } )
    elm.createEl( "p",
    {
        text: lng( "cfg_desc" ),
        attr:
        {
            style: 'padding-bottom: 25px'
        },
    } );
    
}
```

<br />

### Commenting
Please comment your code. If someone else comes along, they should be able to do a quick glance and have an idea of what is going on. Plus it helps novice readers with better understanding the process.

You may use block style commenting, or single lines:

```typescript
/*
    https://fonts.googleapis.com

    policy directive error if certain attributes arent used. doesnt affect the plugin, but erors are bad
*/

ct_iframe.setAttribute  ( 'csp', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' ${host} ;" )

```

<br />

### Casing
When writing your code, stick to one of three different styles:

| Style | Example |
| --- | --- |
| Snake Case | `my_variable` |
| Camel Case | `myVariable` |
| Camel Snake Case | `my_Variable` |

<br />

The case style depends on the length of a method or variable name.