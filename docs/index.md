# Overview

Gistr is a plugin for [Obsidian.md](https://obsidian.md/) which allows you to do a variety of things with services such as Github and Opengist.

<br />

Such tasks include:

- Embed public and private gists from Github or Opengist directly into your notes.
- Display pull request summaries from Github
- Create & update gists from your notes and push them to Github.
- Make gists seamlessly integrate into your notes with customizable themes including both light and dark modes.

<br />

!!! hint "Embedding public gists from Github or Opengist do not require an account or API token, however, private gist integration will require an API token to be generated."

<br />


## Using Gistr

Gistr includes several primary functions; with new aspects being integrated all the time.

!!! info "Additional info available on the linked documentation pages"
    This section gives a brief overview, however, visit the linked pages to get a more detailed explaination of how to use Gistr.

<br />

### Embedding Gists

One of the primary features of Gistr is the ability to integrate gist snippets from services such as Github and the open-source gist program [Opengist](https://github.com/thomiceli/opengist), directly into your notes.

<br />

The syntax is as follows:

````markdown
```gistr
https://gist.github.com/username/gist_id
```
````

<br />

For Opengist, you will use the URL to your installed copy of Opengist:

````markdown
```gistr
https://yourdomain.com/username/gist_id
```
````

<br />

You may also specify a more simple version of the URL:

````markdown
```gistr
gist.github.com/username/gist_id
yourdomain.com/username/gist_id
```
````

<br />

### Creating & Updating Gists

Gistr allows you to irectly convert your Obsidian notes into gists by accessing the built-in Gistr menu. Once you have finished creating a note and wish to convert it over to a gist, you have a few different ways of accessing the menu options to convert:


- Right-click inside your note somewhere and select **Save Gist**

<br />

<p align="center"><img style="width: 25%;text-align: center;border: 1px solid #353535;" src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/c52c670d-378b-4c52-9de5-f722165a9084"></p>

<br />

- If you have `Enable Ribbon Icons` enabled in your **Gistr Plugin Settings**, you should see two icons on the left side of your Obsidian interface. To view what these icons look like, view the section Update Existing Gists, OR;

<br />

<p align="center"><img style="width: 80%;text-align: center;border: 1px solid #353535;" src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/4bc4fad9-ea91-4754-8e3b-8d68b4bea74e"></p>

<br />

<p align="center"><img style="width: 20%;text-align: center;border: 1px solid #353535;" src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/6497bb38-fbdf-48a3-bae4-8ba27383af86"></p>

<br />

- Open your Obsidian command pallete (usually `CTRL + P`). Start typing the word `gist` and you should see two options appear:
    - Save Gist [Github Public]
    - Save Gist [Github Private]

<br />

<p align="center"><img style="width: 70%;text-align: center;border: 1px solid #353535;" src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/e9f1eb3a-7214-4017-b7a1-ff55280ac7cb"></p>

<br />

After your Obsidian note is converted to a gist, you'll notice new frontmatter has been added to the top of your note, similar to the following:

!!! info "Important"
    Do not delete the frontmatter added to the top of your note. Removing this will make the Gistr plugin unable to find any existing saves of your note, and it will then upload a fresh copy.


<br />

```yml
---
gists:
  - file: Gistr Changelog (V1.4.0).md
    is_public: true
    id: 6a18c11b614e1dbcc1ac1efcbe6b6b50
    url: 'https://gist.github.com/Aetherinox/6a18c11b614e1dbcc1ac1efcbe6b6b50'
    user: Aetherinox
    revisions: 1
    created_at: '2024-03-11T23:58:19Z'
    updated_at: '2024-03-11T00:00:13Z'
---
```

<br />

## Additional Help

This section was intended to give you a brief rundown on how to utilize Gistr. For a more detailed explaination of each feature, use the menu to the left and navigate to the desired chapter.
