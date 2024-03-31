---
#icon: material/circle-small
title: "Settings > Save & Sync"
tags:
  - settings
---
# Github

These settings an be accessed via the **Gistr Plugin Settings**.

- Open Obsidian Settings ⚙️ interface
- Select Community Plugins in left menu
- Locate Gistr plugin, and click Settings ⚙️ icon
- Click the **Save & Sync** tab

<br />

<figure markdown="span">
  ![Gistr > Settings > Github](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/d39c21e7-f711-4465-96c0-5b68b70ae9b0){ width="100%" }
  <figcaption>Gistr > Settings > Save & Sync</figcaption>
</figure>

<br />

---

<br />

## Enable Ribbon Icons
<!-- md:version stable-1.4.0 -->
<!-- md:default `true` -->
<!-- md:control toggle -->

Adds the following buttons to your Obsidian ribbon on the left-side of the interface:

- Save Public Gist
- Save Private Gist

<figure markdown="span">
  ![Enable save icons](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/c2afb8ab-1741-45d7-9fee-b22a2e4247b6){ width="100%" }
  <figcaption>Enable save icons</figcaption>
</figure>

<br />

<!-- md:control toggle_on --> `Enabled`

:   Two new buttons will be displayed on the left-side Ribbon of Obsidian which allow you to save public and private gists.

<!-- md:control toggle_off --> `Disabled`

:   You will need to open the Obsidian **Command Palette** if you wish to save public or private gists from your notes.

<br />

## Allow Updating Gists
<!-- md:version stable-1.4.0 -->
<!-- md:default `true` -->
<!-- md:control toggle -->

This setting allows you to update gists that you have created from your notes.

<br />

<!-- md:control toggle_on --> `Enabled`

:   You will be able to make changes to any gists you have created from your notes by using the **Save Gist** command or button.

<!-- md:control toggle_off --> `Disabled`

:   You will only be able to create gists from your notes, once the note has been uploaded as a gist, you will not have the option to update the gist later if you need to make changes.

<br />

## Enable Autosave
<!-- md:version stable-1.4.0 -->
<!-- md:default `false` -->
<!-- md:control toggle -->

When this setting is enabled; Gistr will keep monitoring your activity when you are editing a note that you have previously uploaded as a gist. When you stop typing in your note, the system will start the clock on how long it has been since your last edit. Once a certain duration is reached; Gistr will push your changes from your Obsidian note and upload those so that your gist reflects the same changes.

<br />

<!-- md:control toggle_on --> `Enabled`

:   Any notes you have previously uploaded as a gist will be constantly monitored for changes and those changes will be pushed to your gist automatically.

<!-- md:control toggle_off --> `Disabled`

:   You will need to manually save changes you have made to your gists by using either the **Save Buttons** which can be enabled with the setting [Enable Ribbon Icons](#enable-ribbon-icons), or by opening your Obsidian command palette.

<br />

## Enable Autosave Strict Saving
<!-- md:version stable-1.4.0 -->
<!-- md:default `false` -->
<!-- md:control toggle -->

This setting determines how autosave will behave. [Autosave duration](#autosave-duration) can be modified further down in these settings.

<br />

<!-- md:control toggle_on --> `Enabled`

:   Your notes will be saved to the gist service precisely on time every 15 seconds, whether you are still typing or not.

<!-- md:control toggle_off --> `Disabled`

:   Time until save will not start until you have finished typing in that note. If you continue typing, the saving countdown will not start until your final key is pressed.

<br />

## Enable Autosave Notices
<!-- md:version stable-1.4.0 -->
<!-- md:default `true` -->
<!-- md:control toggle -->

Each time your note is saved automatically, a notice will appear on-screen informing you of the action. This only works if [Enable Autosave](#enable-autosave) is turned **on**.

<br />

<!-- md:control toggle_on --> `Enabled`

:   You will receive a notice on every autosave triggered.

<!-- md:control toggle_off --> `Disabled`

:   Autosave will complete silently.

## Autosave Duration
<!-- md:version stable-1.4.0 -->
<!-- md:default `120` -->
<!-- md:control slider -->

How often autosave will execute in seconds. Set this to a fair amount so that the calls aren\'t being ran excessively to the gist API server (Github or OpenGist).

The save countdown timer will begin shortly after you stop typing.

If you wish to change this to save precisely every X seconds, enable the setting [Autosave Strict Saving](#enable-autosave-strict-saving) located above.

You may also change the [Autosave duration](#autosave-duration).

<br />

## Include Frontmatter
<!-- md:version stable-1.4.0 -->
<!-- md:default `false` -->
<!-- md:control toggle -->

When saving your note as a new gist, frontmatter will be included in the upload when the gist is saved to the online service. 

No matter if this setting is enabled or not, frontmatter will be at the top of your actual note. However, this setting determines if that frontmatter is carried over to your uploaded gist.

Frontmatter begins with `---` at the top of your note, with the following structure:

```markdown
---
gists:
  - file: Your Note.md
    is_public: false
    id: 567cae123abc456def012abc456def12
    url: 'https://gist.github.com/Aetherinox/567cae123abc456def012abc456def12'
    user: Aetherinox
    revisions: 1
    created_at: '2024-03-31T06:33:38Z'
    updated_at: '2024-03-31T06:33:38Z'
---
```

<br />

<!-- md:control toggle_on --> `Enabled`

:   Frontmatter added to your notes will be included when your note is pushed to a gist service.

<!-- md:control toggle_off --> `Disabled`

:   The note will be cleaned before it is pushed to the gist service and no frontmatter fields will be present in the online version.

<br />

## Save List: Show All
<!-- md:version stable-1.4.0 -->
<!-- md:default `false` -->
<!-- md:control toggle -->

This setting effects how the gist save list displays saved gists. By default, if you have the same note saved as both a public and a secret gist; the save list will only show the saved gist depending on the button you have pressed.


<figure markdown="span">
  ![Ribbon save buttons](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/beece4f0-277e-4fdd-8493-bb6ebd6989be){ width="100%" }
  <figcaption>Ribbon save buttons</figcaption>
</figure>

This means that if you press **Save Public**, only the public gist will appear in the list, and the same goes for secret gists. However, if this is **enabled**, both public and secret saves will show in the same list.

<figure markdown="span">
  ![Gist Save List](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/df851924-5802-449a-b7d0-6793efef2b21){ width="100%" }
  <figcaption>Gist Save List</figcaption>
</figure>

<br />

<!-- md:control toggle_on --> `Enabled`

:   When saving an existing gist, the suggestion box will display ALL saves for that note in the same list; both public and secret.

<!-- md:control toggle_off --> `Disabled`

:   Public and secret gist saves will be separated when being displayed in the existing gist save list.

<br />

## Save List: Datetime Format
<!-- md:version stable-1.4.6 -->
<!-- md:default `MM.DD.YYYY h:m:s a` -->
<!-- md:control textbox -->

This setting affects the gist save list and allows you to customize how the date and time will appear next to each gist in your save list which indicates when you saved last.

??? info "Date and Time Formats"

    | Type | Flag | Output |
    | --- | --- | --- |
    | Month | `M` | 1 2 ... 11 12 |
    | | `Mo` | 1st 2nd ... 11th 12th |
    | | `MM` | 01 02 ... 11 12 | 
    | | `MMM` | Jan Feb ... Nov Dec |
    | | `MMMM` | January February ... November December |
    | Quarter | Q | 1 2 3 4 |
    | | Qo | 1st 2nd 3rd 4th |
    | Day of Month | D | 1 2 ... 30 31 |
    | | Do | 1st 2nd ... 30th 31st |
    | | DD | 01 02 ... 30 31 |
    | Day of Year | DDD | 1 2 ... 364 365 |
    | | DDDo | 1st 2nd ... 364th 365th |
    | | DDDD | 001 002 ... 364 365 |
    | Day of Week | d | 0 1 ... 5 6 |
    | | do | 0th 1st ... 5th 6th |
    | | dd | Su Mo ... Fr Sa |
    | | ddd | Sun Mon ... Fri Sat |
    | | dddd | Sunday Monday ... Friday Saturday |
    | Day of Week (Locale) | e | 0 1 ... 5 6 |
    | Day of Week (ISO) | E | 1 2 ... 6 7 |
    | Week of Year | w | 1 2 ... 52 53 |
    | | wo | 1st 2nd ... 52nd 53rd |
    | | ww | 01 02 ... 52 53 |
    | Week of Year (ISO) | W | 1 2 ... 52 53 |
    | | Wo | 1st 2nd ... 52nd 53rd |
    | | WW | 01 02 ... 52 53 |
    | Year | YY | 70 71 ... 29 30 |
    | | YYYY | 1970 1971 ... 2029 2030 |
    | | YYYYYY | -001970 -001971 ... +001907 +001971<br>Note: Expanded Years (Covering the full time value range of approximately 273,790 years forward or backward from 01 January, 1970) |
    | | Y | 1970 1971 ... 9999 +10000 +10001<br>Note: This complies with the ISO 8601 standard for dates past the year 9999 |
    | Era Year | y | 1 2 ... 2020 ... |
    | Era | N, NN, NNN | BC AD |
    | | NNNN | Before Christ, Anno Domini |
    | | NNNNN | BC AD |
    | Week Year | gg | 70 71 ... 29 30 |
    | | gggg | 1970 1971 ... 2029 2030 |
    | Week Year (ISO) | GG | 70 71 ... 29 30 |
    | | GGGG | 1970 1971 ... 2029 2030 |
    | AM/PM | A | AM PM |
    | | a | am pm |
    | Hour | H | 0 1 ... 22 23 |
    | | HH | 00 01 ... 22 23 |
    | | h | 1 2 ... 11 12 |
    | | hh | 01 02 ... 11 12 |
    | | k | 1 2 ... 23 24 |
    | | kk | 01 02 ... 23 24 |
    | Minute | m | 0 1 ... 58 59 |
    | | mm | 00 01 ... 58 59 |
    | Second | s | 0 1 ... 58 59 |
    | | ss | 00 01 ... 58 59 |
    | Fractional Second | S | 0 1 ... 8 9 |
    | | SS | 00 01 ... 98 99 |
    | | SSS | 000 001 ... 998 999 |
    | | SSSS ... <br> SSSSSSSSS | 000[0..] 001[0..] ... 998[0..] 999[0..] |
    | Time Zone | z or zz | EST CST ... MST PST |
    | | Z | -07:00 -06:00 ... +06:00 +07:00 |
    | | ZZ | -0700 -0600 ... +0600 +0700 |
    | Unix Timestamp | X | 1360013296 |
    | Unix Millisecond Timestamp | x | 1360013296123 |

<br />

## Save List: Icon Color
<!-- md:version stable-1.4.6 -->
<!-- md:default `#757575E6` -->
<!-- md:control color #757575E6 -->

Color for icon in gist save list

<figure markdown="span">
  ![Save List Icon Color](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/2acf3c9f-ea96-4ea5-b503-c24b95291c8a){ width="100%" }
  <figcaption>Save List Icon Color</figcaption>
</figure>

<br />

<br /><br />