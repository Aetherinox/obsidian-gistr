---
#icon: material/circle-small
title: "Settings > Github"
tags:
  - settings
---
# Github

These settings an be accessed via the **Gistr Plugin Settings**.

- Open Obsidian Settings ⚙️ interface
- Select Community Plugins in left menu
- Locate Gistr plugin, and click Settings ⚙️ icon
- Click the **Github** tab

<br />

<figure markdown="span">
  ![Gistr > Settings > Github](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/568a5942-098f-4e19-808f-606cca0b4bfc){ width="100%" }
  <figcaption>Gistr > Settings > Github</figcaption>
</figure>

<br />

---

<br />

## Personal Access Token
<!-- md:version stable-1.3.0 -->
<!-- md:default `none` -->
<!-- md:control textbox -->

The **Personal Access Token** is a token given to you by Github which allows you to access your Github account from 3rd party services such as Obsidian.md. If you are simply reading gists from within your Obsidian notes; you do not need a Github token, however, if you want to make use of the feature to create and update gists from Obsidian to Github; you must have a Github token linked to the Gistr Github settings.

<br />

```embed
url:          https://github.com/settings/tokens?type=beta
name:         Github: Create Token
image:        https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png
```

<br />

Visit the link above, ensure you are signed in to Github.

<br />

<figure markdown="span">
  ![Generate new fine-grained token](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/98f6fb92-cf52-4a4b-9fe6-63d98b92590c){ width="100%" }
  <figcaption>Generate new fine-grained token</figcaption>
</figure>

<br />

Click **Generate New Token**

<br />

<figure markdown="span">
  ![Provide fine-grained token name and description](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/270f9e01-e6ba-4174-966f-4ee15b6f53d5){ width="100%" }
  <figcaption>Provide fine-grained token name and description</figcaption>
</figure>

<br />

Fill in the top part of the form with information similar to what is provided in the screenshot above. For the **Expiration**; you are only allowed to specify a max of 1 year in the future. So be aware that in one year, you must come back to this page, and create a new token.

<br />

When everything is filled out, scroll down to **Repository Access**:

<figure markdown="span">
  ![Target repository selection](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/3a95342f-85f7-4d2f-b536-078e9c451c1e){ width="100%" }
  <figcaption>Target repository selection</figcaption>
</figure>

<br />

Select `All Repositories`

<br />

You will need to apply the following permission changes under the two sections.

| Category | Permission Name | Set To |
| --- | --- | --- |
| `Account Permissions` | Gists | `Read-and-write` |
| `Repository Permissions` | Pull Requests | `Read-only` |
| `Repository Permissions` | Contents | `Read-only` |
| `Repository Permissions` | Issues | `Read-only` |

<br />

You should have the following when you scroll to the bottom:

<figure markdown="span">
  ![Github token permission requirements](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/5397e63e-3979-4560-a70d-2a20a515a457){ width="100%" }
  <figcaption>Github token permission requirements</figcaption>
</figure>

<br />

Be aware that the permission `Metadata` is manditory, so it will automatically be granted permission when you enable the others. It should be set to `Read-Only`

<br />

After confirming the permissions, click **Generate Token**

<figure markdown="span">
  ![Creating a fine-grained Github token](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/dacbb39e-f5ed-4a3a-9a65-4924bf365611){ width="100%" }
  <figcaption>Creating a fine-grained Github token</figcaption>
</figure>

<br />

Your new personal access token will be generated. Copy this token somewhere secure such as in a password manager like Bitwarden or KeePassXC.

<br />

Next, launch Obsidian and click the Settings Cog Icon ⚙️. On the left, select Community Plugins and find the `Gistr` plugin.

<br />

Ensure Gistr is enabled by clicking the <img src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/3e512f8a-5c7d-4bff-a3e8-3ef88e673e72" data-canonical-src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/3e512f8a-5c7d-4bff-a3e8-3ef88e673e72" height=20px /> toggle icon, and then click the cog icon ⚙️ to access the plugin settings.

<br />

Click the **Github** tab in the Gistr plugin settings, and navigate to the **Personal Access Token** textbox. You will need to paste your token here.

<br />

<figure markdown="span">
  ![Enter and apply github token](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/3c00e83e-09e4-4d59-a586-97aadbc9dcb5){ width="100%" }
  <figcaption>Enter and apply github token</figcaption>
</figure>

<br />

You should also see a notification if your token has been accepted and applied:

<figure markdown="span">
  ![Valid Github Token detected](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/313d46fd-5d9e-40db-acfa-cf717dd3fa20){ width="100%" }
  <figcaption>Valid Github Token detected</figcaption>
</figure>

You are now ready to create and update gists to Github.

<br />

## Codeblock Background Color
<!-- md:version stable-1.2.0 -->
<!-- md:default `#E5E5E5 | #121315` -->
<!-- md:control color #E5E5E5 #121315 -->

These settings allow you to adjust the overall background color of the codeblock. The setting is broken up into two schemes; **light** and **dark**.

<br />

<figure markdown="span">
  ![Codeblock Background Color (Light)](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/e4f1bdb8-8ddd-4143-b7d5-5a9835feb083){ width="100%" }
  <figcaption>Codeblock Background Color (Light)</figcaption>
</figure>


<figure markdown="span">
  ![Codeblock Background Color (Dark)](https://github.com/Aetherinox/obsidian-gistr/assets/118329232/92c1edf1-4351-402c-b01f-3926b527392d){ width="100%" }
  <figcaption>Codeblock Background Color (Dark)</figcaption>
</figure>

<br />

## Codeblock Text Color
<!-- md:version stable-1.2.0 -->
<!-- md:default `#2A2626 | #CAD3F5` -->
<!-- md:control color #2A2626 #CAD3F5 -->

These settings allow you to adjust the overall text color of the codeblock. This is the color of text that is **not** affected by syntax highlighting; which is dependent on the language the codeblock is written for. The setting is broken up into two schemes; **light** and **dark**.

<br />

## Codeblock Scrollbar Track Color
<!-- md:version stable-1.2.0 -->
<!-- md:default `#BA4956 | #4960BA` -->
<!-- md:control color #BA4956 #4960BA -->

These settings allow you to adjust the color of the horizontal scrollbar which appears within codeblocks which have scrolling enabled, or the text exceeds the width of the codeblock. The setting is broken up into two schemes; **light** and **dark**.

<br />

## Codeblock Opacity
<!-- md:version stable-1.3.0 -->
<!-- md:default `1` -->
<!-- md:control slider -->

This setting allow you to adjust the opacity / transparency of the codeblocks. Acceptable values are between `0` - `1`, with numbers in the middle being decimals.

| Value | Percentage | Note |
| --- | --- | --- |
| `0` | 0% | completely invisible |
| `0.25` | 25% | one quarter 1/4 visible |
| `0.50` | 50% | one half 1/2 as visibile as normal |
| `1` | 100% | completely visible |

<br />

## Custom CSS
<!-- md:version stable-1.0.0 -->
<!-- md:default `none` -->
<!-- md:control textbox -->

This setting allows you to override the default CSS for Github and use your own color scheme.

<br />


<br /><br />