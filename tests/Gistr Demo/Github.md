The following examples show you how to integrate a Github Gist snippet into your notes.

## Single Gist
This is a single note specified by the base URL associated with your Github Gist snippet.
```gistr
https://gist.github.com/Aetherinox/cbb70244bdd1aeca236a7f4a19cb1aa1
```



---


## Multiple Gists
This example shows a gist which has multiple files associated to it.

```gistr
https://gist.github.com/Aetherinox/4994ad5f611300aa7cda780dbeb89f8d
```



---


## Multiple Gist (Select)
This demo takes the two notes in the previous section [[#Multiple Gists]] and picks out a specific one of the two to display by appending `#filename` to the end of the URL.
```gistr
https://gist.github.com/Aetherinox/4994ad5f611300aa7cda780dbeb89f8d#obsidian_demo_gistr_multiple_1
```



---


## Theme Override
In the `Gistr Settings` tab, you can select which theme you wish to use
- Light
- Dark

However, if you wish to force a particular theme for only one gist, you can append `&themename` on the end of your gist URL. Replacing `themename` with either `dark` or `light`.


#### Force `Light` Theme
````
```gistr
https://gist.github.com/Aetherinox/4994ad5f611300aa7cda780dbeb89f8d&light
```
````

```gistr
https://gist.github.com/Aetherinox/4994ad5f611300aa7cda780dbeb89f8d&light
```



#### Force `Dark` Theme
````
```gistr
https://gist.github.com/Aetherinox/4994ad5f611300aa7cda780dbeb89f8d&dark
```
````

```gistr
https://gist.github.com/Aetherinox/4994ad5f611300aa7cda780dbeb89f8d&dark
```



#### Combining Multiple Files and Specify Theme
If you have a group of gists and wish to target a specific file, as well as set the theme, you can combine what was shown earlier

````
```gistr
https://gist.github.com/Aetherinox/4994ad5f611300aa7cda780dbeb89f8d#obsidian_demo_gistr_multiple_1&dark
```
````

```gistr
https://gist.github.com/Aetherinox/4994ad5f611300aa7cda780dbeb89f8d#obsidian_demo_gistr_multiple_1&dark
```



---


## Gist Error
This will display when the URL you have specified is invalid.
```gistr
https://gist.github.com/Aetherinox/4994ad5f611300aa7cda780dbe000000
```

