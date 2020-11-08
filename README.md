# obsidian-latex-environments
![Version](https://img.shields.io/badge/version-0.0.4-blue.svg?cacheSeconds=2592000)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)
> Quickly insert and change latex environments within math blocks in Obsidian.

## Installation

### Manual Installation
To manually install 
 1. download the latest `zip`from the [latest Github Release](https://github.com/raineszm/obsidian-latex-environments/releases/latest)
 1. unzip the contents into the `.plugins/obisidian-latex-env` subdirectory of your vault.
 1. reload obsidian
 1. go into settings > third party plugins and activate obsidian-latex-environments

For details see [the forums](https://forum.obsidian.md/t/plugins-mini-faq/7737).

## Usage

![](latexenv.gif)

###  Commands

This plugin currently provides 2 commands, which do not have default bindings.
Both commands only work when the cursor is inside a math block.
Both commands will also query for the name of the environment.

#### Insert Environment

Insert a new LaTeX environment at the cursor.

**With a selection** inserts a new LaTeX environment around the selection.


#### Change Environment

Change the name of the surrounding LaTeX environment.

*If the cursor is on a `\begin` or `\end`, it is the corresponding environment that will be changed.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

