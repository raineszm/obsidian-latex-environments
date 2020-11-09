# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
