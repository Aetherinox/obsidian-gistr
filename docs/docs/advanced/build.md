---
title: "Gistr: Build"
tags:
  - build
---



# Summary <!-- omit from toc -->

- [Build](#build)
- [Contributing](#contributing)

<br />

---

<br />

# Build
The following instructions explain how to build your own copy of Obsidian Gistr.

<br />

Before beginning, you must install the following on your system:
- [NodeJS](https://nodejs.org/en/download/)
- [npm](https://phoenixnap.com/kb/install-node-js-npm-on-windows)

<br />

The instructions for this vary depending on your operating system. After they are both installed, you must ensure you have the `PATH` added to your operating system's environment variables so that you can access the command `npm` from any folder. There are plenty of tutorials online for doing this.

<br />

Once you have the system set up with the correct software, download a copy of this repo's [src folder](https://github.com/Aetherinox/obsidian-gistr/tree/main/src) and place the files and folders somewhere on your system. If you want to be able to make changes to the plugin's source code, and immediately test them within Obsidian, you'll need to create a test vault, and place the source files inside a plugin's folder. 

<br />

Obsidian stores plugins in:
```
x:\Path\To\Vault\.obsidian\plugins
```

<br />

Create a new sub-folder inside the Obsidian plugin's folder such as:
```
x:\Path\To\Vault\.obsidian\plugins\gistr
```

<br />

Next, open up terminal or command prompt, and navigate to the folder

```shell
cd x:\Path\To\Vault\.obsidian\plugins\gistr
```

<br />

Download the plugin dependencies by running:

```shell
npm install
```

<br />

Next, compile the source code for the plugin:

```shell
npm run dev
```

<br />

Your console should output:
```shell
rollup v2.79.1
bundles src/main.ts → ...
created  in 1.1s

[2024-02-29 05:08:38] waiting for changes...
```

<br />

You are now ready to open the source code `.ts` files and make your own changes. Every time you save a file, npm will automatically re-compile the plugin and will display any errors in your launched terminal / command prompt if there are issues.

<br />

Each time the plugin is re-built, it will convert all of the source file files into a single `main.js` file, which will be placed inside the `dist` sub-folder of where you ran `npm` from.

<br />

If you want to change the sub-folder ( `dist` ) used to output the compiled file, open the file `rollup.config.js` in notepad, kwrite, or some text editor.

<br />

You will see the following code:

```js
output: {
  dir: 'dist/',             < ---------
  sourcemap: 'inline',
  sourcemapExcludeSources: isProd,
  format: 'cjs',
  exports: 'named',
  banner,
},
```

<br />

Find the line `dir` located in `output.dir` and change the folder where your compiled file will go. If you want it to compile the main.js file in the same plugin parent folder as the source folders, change `output.dir` to:

```js
dir: './',
```

<br />

If you do not change this from `dist\` to `./`, every time the plugin files are built, they will be placed inside the folder:

```
x:\Path\To\Vault\.obsidian\plugins\gistr\dist
```

<br />

This means that in order to test the plugin within Obsidian, you must copy the `main.js` file from the `dist` folder, and place it one directory up so that it's in the root `gistr` plugin folder.

<br />

Save `rollup.config.js`, close your existing terminal / command prompt, and then re-run `npm run dev` for the changes to take affect.

<br />

When you have completely finished making changes to the plugin, you should do a final production build, which will clean up the code and give you a significantly smaller filesize; run the command:
```shell
npm run build
```

<br />
 
The above command will spit out one final `main.js` , depending on which folder you assigned above, it could either be in one of two locations:

```
x:\Path\To\Vault\.obsidian\plugins\gistr\dist\main.js

OR

x:\Path\To\Vault\.obsidian\plugins\gistr\main.js
```

<br />

For the plugin to work properly, ensure you have the following three files, all in the same root plugin directory which is `x:\Path\To\Vault\.obsidian\plugins\gistr\`:

- main.js
- style.css
- manifest.json

<br />

Launch Obsidian. If you already have Obsidian opened, you must refresh the plugin before you'll see your changes. Open **Obsidian Settings** ⚙️ and navigate to the **Community Plugins** tab.



<br />

In your list of plugins, scroll down until you see **Gistr**, disable the plugin, and re-enable it by clicking <img src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/fac69477-2ec9-4cfd-a991-24865fe7e920" data-canonical-src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/fac69477-2ec9-4cfd-a991-24865fe7e920g" height=20px />

<br />

<p align="center"><img style="width: 65%;text-align: center;border: 1px solid #353535;" src="https://github.com/Aetherinox/obsidian-gistr/assets/118329232/b580c1da-e649-4c83-bd9a-54c0b5177462"></p>

<br />

You now have a modified plugin. 

<br />

---

<br />

# Contributing
If you think you've added something cool that others would enjoy, consider submitting a [Pull Request](https://github.com/Aetherinox/obsidian-gistr/pulls).

Before submitting your code, ensure you read our [Contributing Guide](https://github.com/Aetherinox/obsidian-gistr/blob/main/CONTRIBUTING.md).

<br />
<br />