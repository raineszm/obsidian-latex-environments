# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.2.1](https://github.com/raineszm/obsidian-latex-environments/compare/0.2.0...0.2.1) (2020-12-17)


### Features

* **completion:** provide a more complete list of support mathjax environment names ([c0a98d5](https://github.com/raineszm/obsidian-latex-environments/commit/c0a98d537736cf5b0e2be2c2c6865a5ab5341390))

## [0.2.0](https://github.com/raineszm/obsidian-latex-environments/compare/0.1.3...0.2.0) (2020-12-16)


### Features

* **modal:** switch to using obsidian's FuzzyMatchModal for environment queries ([959f14d](https://github.com/raineszm/obsidian-latex-environments/commit/959f14d7a592a1f4a908f3c2299b24686cd48699))
* **settings:** add setting for extra environments for completion ([c684dc8](https://github.com/raineszm/obsidian-latex-environments/commit/c684dc8b4b89650a31a7b75f5546b4c85dc737a4))

### [0.1.3](https://github.com/raineszm/obsidian-latex-environments/compare/0.1.2...0.1.3) (2020-12-16)


### Bug Fixes

* **wrap:** fix surrounding environment detection ([921a9c2](https://github.com/raineszm/obsidian-latex-environments/commit/921a9c2bbfdab4039d7213dd192f65243d5ede2a)), closes [#14](https://github.com/raineszm/obsidian-latex-environments/issues/14)

### [0.1.2](https://github.com/raineszm/obsidian-latex-environments/compare/0.1.1...0.1.2) (2020-11-23)


### Bug Fixes

* **environment:** update calculation of cursor position after operations ([9dfaaa7](https://github.com/raineszm/obsidian-latex-environments/commit/9dfaaa7001235963b5841167d51133530d4c54ed)), closes [#11](https://github.com/raineszm/obsidian-latex-environments/issues/11)

### [0.1.1](https://github.com/raineszm/obsidian-latex-environments/compare/0.1.0...0.1.1) (2020-11-14)


### Features

* don't add whitespace when changing without enclosing environment ([de5315a](https://github.com/raineszm/obsidian-latex-environments/commit/de5315a9a69f345505f3b22902da3ef5ad74c5d0)), closes [#5](https://github.com/raineszm/obsidian-latex-environments/issues/5)


### Bug Fixes

* fix handling of environments occurring after the cursor ([7c39dbf](https://github.com/raineszm/obsidian-latex-environments/commit/7c39dbfb29cb13bfd69de0589b04a16773ca381a)), closes [#9](https://github.com/raineszm/obsidian-latex-environments/issues/9)
* **environment:** fix cursor position after changing a math block without an environment ([289df5b](https://github.com/raineszm/obsidian-latex-environments/commit/289df5bd41a7722e9750ce0f6bf4e6782a6e73c8))
* add whitespace when changing environment if only one line ([7260b75](https://github.com/raineszm/obsidian-latex-environments/commit/7260b75d18a2fb2bdaeb7f6fbed96c5790e6a3c8))
* **shields:** point minappversion shield to manifest.json instead of package.json ([85884b5](https://github.com/raineszm/obsidian-latex-environments/commit/85884b501cf3755686fffa3eb0af842bcf96db57))

## [0.1.0](https://github.com/raineszm/obsidian-latex-environments/compare/0.0.5...0.1.0) (2020-11-09)


### Features

* automatically select text in popup modal ([5569155](https://github.com/raineszm/obsidian-latex-environments/commit/55691551b4a2f50878d55453e59bd3c239227e40))
* **change:** error on mismatched environments ([048dfc6](https://github.com/raineszm/obsidian-latex-environments/commit/048dfc69774c05e2a7763298314fe543501d8e09)), closes [#4](https://github.com/raineszm/obsidian-latex-environments/issues/4)
* **main:** display notice when command errors ([0e164a5](https://github.com/raineszm/obsidian-latex-environments/commit/0e164a512f8139015d392825b54a50f212ea59b8))
* **modal:** prettify the environment selection modal ([dd7d111](https://github.com/raineszm/obsidian-latex-environments/commit/dd7d1112bafc35d69be22f3b1dfe3d4738c19e97))


### Bug Fixes

* correct formatting on inserted string ([ba2002b](https://github.com/raineszm/obsidian-latex-environments/commit/ba2002b74fd8599ebfd96e1d0974753ac6639432))
* explicitly call getDoc when passing to inner methods ([1fc4915](https://github.com/raineszm/obsidian-latex-environments/commit/1fc49159b212704f375b63393385687e3c6e2ec1))

### [0.0.5](https://github.com/raineszm/obsidian-latex-environments/compare/v0.0.4...v0.0.5) (2020-11-08)


### Bug Fixes

* ensure settings are always available ([1f86248](https://github.com/raineszm/obsidian-latex-environments/commit/1f862481097f0c54ed12790dd38c979565a97c1d))
* handle undefineds in mathblock ([3287162](https://github.com/raineszm/obsidian-latex-environments/commit/32871622d261f4c90eea0957deb1a9903cdcd157))

### [0.0.4](https://github.com/raineszm/obsidian-latex-environments/compare/v0.0.3...v0.0.4) (2020-11-08)


### Bug Fixes

* change handler in modal to keypress ([a5b5a41](https://github.com/raineszm/obsidian-latex-environments/commit/a5b5a41f91f13da9ac7196add8cf2f7affcdb291)), closes [#2](https://github.com/raineszm/obsidian-latex-environments/issues/2)

### [0.0.3](https://github.com/raineszm/obsidian-latex-environments/compare/v0.0.2...v0.0.3) (2020-11-07)


### Bug Fixes

* cancel insertion if modal is closed instad of submitted ([e3251fe](https://github.com/raineszm/obsidian-latex-environments/commit/e3251feb5da17896518b3779f4e596b004fea750))

### [0.0.2](https://github.com/raineszm/obsidian-latex-environments/compare/v0.0.1...v0.0.2) (2020-11-07)


### Features

* allow wrapping selected text with an environment ([4207c68](https://github.com/raineszm/obsidian-latex-environments/commit/4207c68d10fededfc6f85801917313b635970375))
* wrap modifications in CodeMirror.operation ([adc126b](https://github.com/raineszm/obsidian-latex-environments/commit/adc126bc70a3ab133f9827b52c5d631aa9b04215))


### Bug Fixes

* use hmdInnerMode to check for math state ([be524f0](https://github.com/raineszm/obsidian-latex-environments/commit/be524f039ecabdb75f5020da2659608e42741cdf)), closes [#1](https://github.com/raineszm/obsidian-latex-environments/issues/1)

### 0.0.1 (2020-11-06)


### Features

* add change environment command ([2476ba0](https://github.com/raineszm/obsidian-latex-environments/commit/2476ba0a35faed5c548b521130b33ce7b92e36dc))
* add modal for picking environment name ([e552cf8](https://github.com/raineszm/obsidian-latex-environments/commit/e552cf8f006ff853c21b665069db608093a3e529))
* insert new environment at point ([84f3398](https://github.com/raineszm/obsidian-latex-environments/commit/84f3398ade4076537d31b844bd959235dc934463))
* only insert env inside math mode ([5fa8d48](https://github.com/raineszm/obsidian-latex-environments/commit/5fa8d484ddcc844e4d27b510b06f7b74584f03f3))
* **config:** add setting for defaultEnvironment ([b3b962d](https://github.com/raineszm/obsidian-latex-environments/commit/b3b962de887f826b8d7b5d4a0c56d39dafab54f4))


### Bug Fixes

* reset focus after inserting environments ([ebd411c](https://github.com/raineszm/obsidian-latex-environments/commit/ebd411c2b8154902bf394b1002d6064cbcd6e8a7))
