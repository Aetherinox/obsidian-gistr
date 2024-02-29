<h1 align="center"><b>Contributing</b></h1>

<div align="center">

![Version](https://img.shields.io/github/v/tag/Aetherinox/obsidian-gistr?logo=GitHub&label=version&color=ba5225) ![Downloads](https://img.shields.io/github/downloads/Aetherinox/obsidian-gistr/total) ![Repo Size](https://img.shields.io/github/repo-size/Aetherinox/obsidian-gistr?label=size&color=59702a) ![Last Commit)](https://img.shields.io/github/last-commit/Aetherinox/obsidian-gistr?color=b43bcc)

</div>

<br />

---

<br />

- [Submitting Bugs](#submitting-bugs)
- [Contributing](#contributing)
  - [Pull requests eligible for review](#pull-requests-eligible-for-review)
  - [Conventional Commit Specification](#conventional-commit-specification)
    - [Types](#types)
  - [References](#references)
  - [Vertical alignment](#vertical-alignment)
  - [Spaces Instead Of Tabs](#spaces-instead-of-tabs)
  - [Indentation Style](#indentation-style)
  - [Commenting](#commenting)
  - [Casing](#casing)


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

Unless you are fixing a known bug, we strongly recommend discussing it with the core team via a GitHub issue before getting started to ensure your work does not conflict with future plans.

All contributions are made via pull requests. To make a pull request, you will need a GitHub account; if you are unclear on this process, see [GitHub's documentation on forking and pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork). Pull requests should be targeted at the master branch. 

<br />

### Pull requests eligible for review

- Follow the repository's code formatting conventions (see below);
- Include tests that prove that the change works as intended and does not add regressions;
- Document the changes in the code and/or the project's documentation;
- Pass the CI pipeline;
- Include a proper git commit message following the [Conventional Commit Specification](https://www.conventionalcommits.org/en/v1.0.0/#specification).

<br />

If all of these items are checked, the pull request is ready to be reviewed and you should change the status to "Ready for review" and request review from a maintainer.

Reviewers will approve the pull request once they are satisfied with the patch.

<br />

### Conventional Commit Specification

When commiting your changes, we require you to follow the Conventional Commit Specification, described below.

**The Conventional Commits** is a specification for the format and content of a commit message. The concept behind Conventional Commits is to provide a rich commit history that can be read and understood by both humans and automated tools. Conventional Commits have the following format:

<br />

```
<type>[(optional <scope>)]: <description>

[optional <body>]

[optional <footer(s)>]
```

#### Types
| Type | Description |
| --- | --- |
| `feat` | Introduces a new feature |
| `fix` | A bug fix for the end user |
| `docs` | A change to the website or Markdown documents |
| `build` | The commit alters the build process. E.g: creating a new build task, updating the release script, editing Makefile. |
| `test` | Adds missing tests, refactoring tests; no production code change. Usually changes the suite of automated tests for the product. |
| `pref` | Improves performance of algorithms or general execution time of the product, but does not fundamentally change an existing feature. |
| `style` | Updates or reformats the style of the source code, but does not otherwise change the product implementation. Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) |
| `refactor` | A change to production code that leads to no behavior difference, e.g. splitting files, renaming internal variables, improving code style, etc. |
| `change` | Changes the implementation of an existing feature. |
| `chore` | Includes a technical or preventative maintenance task that is necessary for managing the product or the repository, but is not tied to any specific feature. E.g. updating dependencies. These are usually done for maintanence purposes. |
| `ci` | Changes related to Continuous Integration (usually `yml` and other configuration files). |
| `misc` | Anything else that doesn't change production code, yet is not ci, test or chore. |
| `revert` | Revert to a previous commit |
| `remove` | Removes a feature from the product. Typically features are deprecated first for a period of time before being removed. Removing a feature from the product may be considered a breaking change that will require a major version number increment. |
| `deprecate` | Deprecates existing functionality, but does not remove it from the product. |

<br />

Example:

```
feat(core): allow overriding of webpack config
^--^^----^  ^------------^
|   |       |
|   |       +-> (DESC): Summary in present tense. Use lower case not title case!
|   |
|   +-> (SCOPE): The package(s) that this change affects
|
+-------> (TYPE): see above for the list
```

<br />

### References
If you are pushing a commit which addresses a submitted issue, reference your issue in the description of your commit. You may also optionally add the major issue to the end of your commit title.

References should be on their own line, following the word `Ref` or `Refs`

```
Title:          fix(opengist): fix error message displayed for users. [#22]
Description:    The description of your commit

                Ref: #22, #34, #37
```

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
Comment your code. If someone else comes along, they should be able to do a quick glance and have an idea of what is going on. Plus it helps novice readers to better understand the process.

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

The case style may vary and we're not extremely picky on this, but ensure it is labeled properly and not generic.