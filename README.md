# Markdown Links

## Índice

* [1. Description](#1-description)
* [2. Installation](#2-installation)
* [3. How to use](#3-how-to-use)
* [4. Developer](#4-developer)

***

## 1. Description

Command line tool (CLI) in JavaScript, which reads and analyzes files in `Markdown` format, to verify the links they contain and report some statistics.

![md-links](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuyPl0YQ-2daE3bS6CClXVY4EerEM3JnCvVQ&usqp=CAU)

## 2. Installation

To use the tool, the following code must be executed:

```js
npm install md-links-my;
```

## 3. How to use

`mdLinks(path, options)`

##### Arguments

* `path`: **Absolute** or **relative** path to the **file** or **directory**.
If the path passed is relative, it should resolve to relative to the directory
where node is invoked from - _current working directory_).
* `options`: An object with **only** the following property:
   - `validate`: Boolean that determines if you want to validate the links
     found.
   - `stats`: Determines the structure of the response.
    
The executable of the tool should be executed as follows
way through the **terminal**:

##### `default`

Example:

```sh
md-links <path-to-file> [options]
```

![image](https://user-images.githubusercontent.com/64874044/172696095-70c11952-a4d7-4ca1-8cc1-9b8a4ac3fc9d.png)

By default it does not validate if the URLs respond ok or fail, it only identifies the markdown file (based on the path it receives as an argument), analyzes the Markdown file and prints the links it finds, along with the path of the file where it appears and the text inside the link.

#### Options

##### `--validate`

If we pass the `--validate` option, the module makes an HTTP request to find out if the link works or not. If the link results in a redirect to a URL that responds ok, then we'll consider the link ok.

Example:

```sh
md-links <path-to-file> [options] --validate
```
![image](https://user-images.githubusercontent.com/64874044/172696926-7398ab5b-20fe-4907-ad23-90659f331777.png)

The _output_ in this case includes the word `ok` or `fail` after the URL, as well as the status of the response received to the HTTP request to that URL.

##### `--stats`

If we pass the `--stats` option the output will be a text with basic statistics about the links.

```sh
md-links <path-to-file> [options] --stats
```

![image](https://user-images.githubusercontent.com/64874044/172697171-fb10e70d-7c26-4a66-b440-cc3388023c93.png)

##### `--stats --validate`

You can also combine `--stats` and `--validate` to get statistics you need from the validation results.

```sh
md-links <path-to-file> [options] --stats --validate
```

![image](https://user-images.githubusercontent.com/64874044/172697431-e8800de4-69e3-48d9-90b9-46df877ceffa.png)

## 4. Developer

`By Myriam Helen Salazar.`