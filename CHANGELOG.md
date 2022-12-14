

## [1.0.0-alpha.19](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.18...v1.0.0-alpha.19) (2023-01-11)


### Bug Fixes

* update prop types ([782008e](https://github.com/memori-ai/memori-react/commit/782008ea18a368b02b7a957b8b9c3d3536b1e45d))

## [1.0.0-alpha.18](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.17...v1.0.0-alpha.18) (2023-01-11)


### Features

* add link attachment modal with preview ([e20c8ca](https://github.com/memori-ai/memori-react/commit/e20c8ca42ab2a763492109991a1bfc663271fed2))
* add media upload + media attachment modal ([6066f06](https://github.com/memori-ai/memori-react/commit/6066f065d63e6c12c56d9489da6f9eceacf103fa))


### Maintenance

* add general usage story ([309de4b](https://github.com/memori-ai/memori-react/commit/309de4b22a675f2597aa9ebbc97c3929b3983a5a))

## [1.0.0-alpha.17](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.16...v1.0.0-alpha.17) (2023-01-11)


### Bug Fixes

* button selector to click in typeMessage ([493c7a0](https://github.com/memori-ai/memori-react/commit/493c7a094d965f889ae037013c1484cb036cda24))
* pass baseURL to all img handlers ([8083c12](https://github.com/memori-ai/memori-react/commit/8083c12af181aa41bb0ff714491c73916a57bd61))
* update dialog state on timeout only with emission, prevent hints to hide ([6132140](https://github.com/memori-ai/memori-react/commit/61321402750cbd591c43dc0a18af959c577bfb4b))


### Changes

* show media upload if dialogState givers acceptMedia ([01701d1](https://github.com/memori-ai/memori-react/commit/01701d1298ff99b5305c8c66e04359df1918b18b))


### Maintenance

* pick stories in whole src dir for sb ([9675109](https://github.com/memori-ai/memori-react/commit/9675109a3c34dca0cfeac9d731a16ccda8f9e1c4))

## [1.0.0-alpha.16](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.15...v1.0.0-alpha.16) (2023-01-06)


### Changes

* remove feedback button ([a50c5d4](https://github.com/memori-ai/memori-react/commit/a50c5d442a69078ae87db355663d14186a40f762))

## [1.0.0-alpha.15](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.14...v1.0.0-alpha.15) (2023-01-05)


### Bug Fixes

* stt init lang ([b2d5a4b](https://github.com/memori-ai/memori-react/commit/b2d5a4b8cc3a783840f0200d4c4f532c83aa97bb))

## [1.0.0-alpha.14](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.13...v1.0.0-alpha.14) (2023-01-05)


### Bug Fixes

* reopen session on z0 only if textentered gave 404 response ([d6f48a8](https://github.com/memori-ai/memori-react/commit/d6f48a84ebd18ab8f603c9dc4a11019e01f014a4))

## [1.0.0-alpha.13](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.12...v1.0.0-alpha.13) (2023-01-05)


### Features

* add chat message feedback button ([e74b391](https://github.com/memori-ai/memori-react/commit/e74b3916db64f95d68178faa5effc62a4d5823c4))


### Maintenance

* update api client ([80299cd](https://github.com/memori-ai/memori-react/commit/80299cd7b5a857dcd2d40d9135101771e0b21781))
* update api client ([da76587](https://github.com/memori-ai/memori-react/commit/da76587f4feee0a3e3939cb656dc7b3854e206a1))

## [1.0.0-alpha.12](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.11...v1.0.0-alpha.12) (2022-12-28)


### Features

* add microphone button + listening ([b2b3a3b](https://github.com/memori-ai/memori-react/commit/b2b3a3b7dc683174cd270173d77a9de6c53dc80f))

## [1.0.0-alpha.11](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2022-12-23)


### Bug Fixes

* timeout units ([4bbee10](https://github.com/memori-ai/memori-react/commit/4bbee10ce6215877eb7662d1265686c0c5e4de14))

## [1.0.0-alpha.10](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2022-12-21)


### Features

* set user interaction timeout from engine state if set, calc random otherwise ([6d4bace](https://github.com/memori-ai/memori-react/commit/6d4baced6df8d9e743a4286cc29493fde709b9cb))


### Bug Fixes

* timeout from engine already has read time ([59eddf9](https://github.com/memori-ai/memori-react/commit/59eddf97a33ec5188a72efaac9c25e51253e9476))


### Maintenance

* update memori-api-client ([1b8771c](https://github.com/memori-ai/memori-react/commit/1b8771c2e94ef12c55d033287d1b7812c1b3b4ae))
* update memori-api-client ([ccc404f](https://github.com/memori-ai/memori-react/commit/ccc404f47c0411974a6dba3612f6520ad5695c80))

## [1.0.0-alpha.9](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2022-12-19)


### ??? BREAKING CHANGES

* open session on clicking start button

### Features

* add auth for private memori ([c1bef59](https://github.com/memori-ai/memori-react/commit/c1bef59088fb2fce2f098c161975e3053b778708))


### Bug Fixes

* chat bubble with initial msg ([cea6fe7](https://github.com/memori-ai/memori-react/commit/cea6fe7912e97d00ba986e8d7d64856f663223af))
* set height from props ([a65e0b4](https://github.com/memori-ai/memori-react/commit/a65e0b4d0c52fb3e501b517d57cc76dc469bcfa5))
* use secret while opening session if present ([726e131](https://github.com/memori-ai/memori-react/commit/726e131df885ad73b1c4399a679a72cb41139b92))
* vertical scrolling consintency ([c01c952](https://github.com/memori-ai/memori-react/commit/c01c952329208ac4ec41f9e4f3669a8f198e46e0))


### Changes

* add canInstruct in ChangeMode ([6300e18](https://github.com/memori-ai/memori-react/commit/6300e184bdb64ee57f9b3e8f7fd92df8b733f077))
* apply sessionID prop ([0eb6880](https://github.com/memori-ai/memori-react/commit/0eb68808f05f1751d60e86f391e766bb1979e602))
* cleanup ([2df3fbb](https://github.com/memori-ai/memori-react/commit/2df3fbbf80360e9662a51f264b74f14a633c7f8e))
* open session on clicking start button ([6372e89](https://github.com/memori-ai/memori-react/commit/6372e89aba6a74743b7bec9fa4d6dab597dd9ddb))


### Maintenance

* pass secret to widget ([a13e29e](https://github.com/memori-ai/memori-react/commit/a13e29e19a5bf548dfdb7b615e390b3ffe1858d9))
* **storybook:** set stories order ([568d3d4](https://github.com/memori-ai/memori-react/commit/568d3d40e7d3a7dd9bdb697b594bc62b2a291479))
* widget storybook layout options + rename ([d48863f](https://github.com/memori-ai/memori-react/commit/d48863f28483ae2d84de7b689deadf0fac7d727f))

## [1.0.0-alpha.8](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2022-12-07)


### Bug Fixes

* allow global methods within webcomponent ([afa5133](https://github.com/memori-ai/memori-react/commit/afa513316329e31e02ed531d6808c1f1bce9dbd8))

## [1.0.0-alpha.7](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2022-12-07)


### Bug Fixes

* root for css properties compatible with webcomponent ([f06ff64](https://github.com/memori-ai/memori-react/commit/f06ff642d4a32a2eaa3586857f3ba40b8811dda2))

## [1.0.0-alpha.6](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2022-12-07)


### Bug Fixes

* blob styles ([56d1e5f](https://github.com/memori-ai/memori-react/commit/56d1e5fc941ebc7c487381cc804561c1569853d1))

## [1.0.0-alpha.5](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2022-12-07)


### Features

* apply integration config css properties, fix styles ([91d495d](https://github.com/memori-ai/memori-react/commit/91d495d352ce9ee6b17dc221ff534d0756ed0f74))


### Maintenance

* upgrade api client ([f7f218b](https://github.com/memori-ai/memori-react/commit/f7f218bbda39ca27f3e670cbc5ffc7f9d297656f))

## [1.0.0-alpha.4](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2022-12-06)


### Maintenance

* cleanup package.json ([e482423](https://github.com/memori-ai/memori-react/commit/e482423b7e4911bf2ea8d503242f665ac723b399))
* **i18n:** add title to snippet copy button ([aa56073](https://github.com/memori-ai/memori-react/commit/aa560731faf0911d9bfb67350086534889cdcfd7))

## [1.0.0-alpha.3](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2022-12-06)


### Features

* add prop-types ([2dc4e23](https://github.com/memori-ai/memori-react/commit/2dc4e237bb4e59f395a66032e54849579e5f7561))

## [1.0.0-alpha.2](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2022-12-06)


### Features

* add onStateChange callback ([e4f55bd](https://github.com/memori-ai/memori-react/commit/e4f55bdc12a51ee311a8fe63a9fcc0e7125bdc32))


### Maintenance

* add details in package.json + upgrade api client ([f0ce68a](https://github.com/memori-ai/memori-react/commit/f0ce68ade744fd02c4af3a08d4b2849fbbef9113))
* cleanup ([94fb8b0](https://github.com/memori-ai/memori-react/commit/94fb8b06a118e42da695da5dd4bbf307ff723914))
* cleanup deps and lockfile ([3044342](https://github.com/memori-ai/memori-react/commit/3044342b9dde3e758c92968a4547a829d2984dd5))

## [1.0.0-alpha.1](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2022-12-06)


### Maintenance

* fix version ([95725fe](https://github.com/memori-ai/memori-react/commit/95725fe484c3bcf025bbddbdb1c5e834b98a31fe))
* prepare for release ([a6a6db6](https://github.com/memori-ai/memori-react/commit/a6a6db678068717093ea7b14e3eac262b9507c73))

## 1.0.0-alpha.0 (2022-12-06)


### Features

* add auth widget ([9c43a0d](https://github.com/memori-ai/memori-react/commit/9c43a0d0dfbebcca3788dedd1307609d14b7389a))
* add avatar universal component ([5ca549f](https://github.com/memori-ai/memori-react/commit/5ca549f169d1d726208feebce82954d5c22e4e94))
* add blob ([56ee173](https://github.com/memori-ai/memori-react/commit/56ee1736eaea2fa5ccd8a94a775cd275aa8a664d))
* add block prop to button, update card snapshot ([dcac744](https://github.com/memori-ai/memori-react/commit/dcac74459dca2a825f56426e3cb547b5bb14a0a7))
* add change mode as separate component ([141c8ad](https://github.com/memori-ai/memori-react/commit/141c8ad543dfc3355e9fca0c2de7ced63f44ae5f))
* add chat bubble ([645fb11](https://github.com/memori-ai/memori-react/commit/645fb11bfa1c4de2f62bc3e527edb599a0355690))
* add chat component ([5a4fed6](https://github.com/memori-ai/memori-react/commit/5a4fed6ac4c6e019ac77c480ce05dd99c3b00b7f))
* add chat inputs ([626963d](https://github.com/memori-ai/memori-react/commit/626963da19b60e7914fed0bcb4ba754d1e2e71b8))
* add chat textarea ([b2b0236](https://github.com/memori-ai/memori-react/commit/b2b023626cdfe4492a60599bf349ef247ff283cc))
* add custom glb model viewer ([7a2ccd3](https://github.com/memori-ai/memori-react/commit/7a2ccd310e3b700d2dcded5e7876a267561613d9))
* add error boundary ([88e1a52](https://github.com/memori-ai/memori-react/commit/88e1a5204d1acec10c1db6bd1192ec8d9b8ef9fb))
* add example ([9271c63](https://github.com/memori-ai/memori-react/commit/9271c63fb4ed3653c69792710df2f4dea14a57f4))
* add export history button, fix avatar lint issues ([1947099](https://github.com/memori-ai/memori-react/commit/1947099d812deb3d3e838fc391d82ad483bda1ca))
* add first ui components ([dcc515e](https://github.com/memori-ai/memori-react/commit/dcc515e7bf189edc61efe8d715abf932d1863289))
* add ghost button ([9641815](https://github.com/memori-ai/memori-react/commit/964181519ef45b5d849b78d0bb367fa8cf666020))
* add header ([e26ee8d](https://github.com/memori-ai/memori-react/commit/e26ee8d679fb5fac401ca6a1c0c6d190fe950be6))
* add icons ([86c1b30](https://github.com/memori-ai/memori-react/commit/86c1b30ffa503a57203e4484251f72e12ccf4693))
* add icons ([f76ad0c](https://github.com/memori-ai/memori-react/commit/f76ad0c3c3ed3f76c7dbe68e78141681046a66d5))
* add icons ([674e528](https://github.com/memori-ai/memori-react/commit/674e5284a3f1534e55e8b7521ce35d3592da99db))
* add index entrypoint ([e86893b](https://github.com/memori-ai/memori-react/commit/e86893bdd0605657e599f75264dece4bd77f537a))
* add media widget ([12a65a4](https://github.com/memori-ai/memori-react/commit/12a65a44b61abe9e12e5d181fe3e70917dc01064))
* add rpm avatar view ([0dc4489](https://github.com/memori-ai/memori-react/commit/0dc4489a95205f0aef3ed85150af1d48dc1e92f2))
* add send on enter menu ([84a398e](https://github.com/memori-ai/memori-react/commit/84a398ede83ca011c95d47ee2c747e06b7150200))
* add share button ([603a6c8](https://github.com/memori-ai/memori-react/commit/603a6c8f9bde169619c209865c7cc395a1a52e14))
* add snippet ([6442c85](https://github.com/memori-ai/memori-react/commit/6442c85b15071fdb5bd3d24f21508bf4434a6e80))
* add start panel as separate component ([923368d](https://github.com/memori-ai/memori-react/commit/923368db2a0d7d6552be5f07e8a45a7195eaa2a0))
* add ui card, fix tooltip ([11be456](https://github.com/memori-ai/memori-react/commit/11be45666836108ee74ac9b36684d296663ebdb4))
* add ui drawer, enhance modal ([b2b9f38](https://github.com/memori-ai/memori-react/commit/b2b9f3859a7373c20ed30cc5b9711a4b4bb0d728))
* add ui modal ([704c747](https://github.com/memori-ai/memori-react/commit/704c74725031cd141d5e0b7c90329c3462040c30))
* add ui spin ([ee734a9](https://github.com/memori-ai/memori-react/commit/ee734a949794e42cc67c42996283ad4786fe0df9))
* add ui tooltip + blocked memori badge ([4e4c92e](https://github.com/memori-ai/memori-react/commit/4e4c92ebe5f37f1cdd21984c641769e03e5d5338))
* add upload menu ([f3fdd6a](https://github.com/memori-ai/memori-react/commit/f3fdd6ad106feaf28400b20d24cd5ecdffa59e4c))
* enhance ui components ([4447ad7](https://github.com/memori-ai/memori-react/commit/4447ad7ee83f017d837c81ea67f5fe8f70eee3e8))
* import helpers ([a8a73b6](https://github.com/memori-ai/memori-react/commit/a8a73b6a177c4799394c52eeb9a10311b8d6654e))
* working on widget ([5af9d82](https://github.com/memori-ai/memori-react/commit/5af9d8280ad52d2bb3787b8441bc1ada5b4d109c))


### Bug Fixes

* export history button btn classes ([fcc0bf6](https://github.com/memori-ai/memori-react/commit/fcc0bf696388461c49a5ffd24ee98d134fb35d4a))
* i18n import ([8791dbf](https://github.com/memori-ai/memori-react/commit/8791dbfe69abac45ff470efeaeeaa21b10285b5f))
* lint issues ([86251d5](https://github.com/memori-ai/memori-react/commit/86251d5ee1c37c9fc3777d4c0d590c7ca8a366c9))
* share button menu styles ([3cdee0f](https://github.com/memori-ai/memori-react/commit/3cdee0f11682cefd24b42e85cf88a0fe2acbc24c))
* styles + font ([28b5136](https://github.com/memori-ai/memori-react/commit/28b51366b2fc3f4367b923722574feb546c364fa))
* tooltip align left styles ([72ee3cf](https://github.com/memori-ai/memori-react/commit/72ee3cf3c41e3c8eb41f02d9481ce3d92e29e99e))


### Changes

* cleanup helpers ([2213be8](https://github.com/memori-ai/memori-react/commit/2213be892771a37ffc8f2c45f9c35d72da862dd6))
* move widget ui to default layout ([4eacf30](https://github.com/memori-ai/memori-react/commit/4eacf3000c4dc4525ac170426bfec403dd092984))
* remove splitted code from widget, refactor start method, widget params ([1eebbe3](https://github.com/memori-ai/memori-react/commit/1eebbe319cff0e1630b61ded38b1ed8cf93ae09c))
* tenantID as fallback for baseURL ([2276529](https://github.com/memori-ai/memori-react/commit/2276529e1dc9a5f6a9d842eb8805e344b752fda0))


### Maintenance

* add commitlint, husky, release-it ([159098d](https://github.com/memori-ai/memori-react/commit/159098da55f6bee2c9297a703528844ffadedf34))
* add formatting config + run prettier ([fbba151](https://github.com/memori-ai/memori-react/commit/fbba151ac8d7d90b4d62166da4ac3b30b72c9236))
* add husky pre-commit test + lint run ([aa709e4](https://github.com/memori-ai/memori-react/commit/aa709e48c25543c3cddf76ca838d9e10ecde6ec7))
* add license ([622da6b](https://github.com/memori-ai/memori-react/commit/622da6bf48be827af2ce932bfb354ad2a9b451d3))
* add linting tools ([9622e7d](https://github.com/memori-ai/memori-react/commit/9622e7d5ec5ad156893b98fe283181c2c54273b3))
* add mock data ([d03f361](https://github.com/memori-ai/memori-react/commit/d03f3611ad65933386f2d50d5ba0d96595fb7df0))
* add showSettings in header, default to false, add i18n ([cb91eeb](https://github.com/memori-ai/memori-react/commit/cb91eeb87587715c5406e5e0653963bc0cacfe4a))
* add storybook url in package.json, set node >= 16 ([10f5b85](https://github.com/memori-ai/memori-react/commit/10f5b85f4ccb9b446d500ee6e729741405ecfe0c))
* add storybook-static to gitignore ([294a9e3](https://github.com/memori-ai/memori-react/commit/294a9e3a9026f37d774c675bef1bca70cbf593da))
* add typecheck script ([5228a43](https://github.com/memori-ai/memori-react/commit/5228a43e6686256e4944ab44a505e13ad4405dc8))
* add typecheck script in husky pre-commit ([9754349](https://github.com/memori-ai/memori-react/commit/9754349cbf938204c3a189082ff4cf491ae784ab))
* cleanup ([8d0cd0b](https://github.com/memori-ai/memori-react/commit/8d0cd0b03fc94234c7e266f9345dded2fc1ff218))
* cleanup moved css from widget to change mode ([92be8eb](https://github.com/memori-ai/memori-react/commit/92be8ebf3c57dd528d5fa0fbf2b09dce167b39d3))
* fix export history button align ([97afcc6](https://github.com/memori-ai/memori-react/commit/97afcc64b4cd7e7d3dbede3be8ff9d053676428e))
* fix icons story imports ([d3d7bf4](https://github.com/memori-ai/memori-react/commit/d3d7bf489e3949d6eaf8c063e042e1fea0a26138))
* fix lint issues ([243c50d](https://github.com/memori-ai/memori-react/commit/243c50dabb2f59838564f4b4da37c9dccc660b37))
* fix lint issues ([4a28e22](https://github.com/memori-ai/memori-react/commit/4a28e22d4c4d367ea6acbf6f260c44790d8d1a24))
* fix lint issues ([2215492](https://github.com/memori-ai/memori-react/commit/2215492a2a9c260301531e6cd7ec81a4d9e18d4d))
* fix text area expand button styles ([49df632](https://github.com/memori-ai/memori-react/commit/49df632ff3b5248fd2f2501abf96dee7736e57b6))
* fix windows issue on end of line ([f1b99b0](https://github.com/memori-ai/memori-react/commit/f1b99b034d09e781d6cdf0bd844357375945a458))
* **i18n:** add i18n + translations files ([6790724](https://github.com/memori-ai/memori-react/commit/679072475a10dc30eb2fe9b90fb33721568ac756))
* **i18n:** add translations for blocked memori badge ([50d6af9](https://github.com/memori-ai/memori-react/commit/50d6af950d41ee010d48d08d47594fee1ade46e6))
* **i18n:** add translations for send on enter menu + fix width ([4917b1f](https://github.com/memori-ai/memori-react/commit/4917b1f2d9f6df00d1deba25c0b5a7552d15b25c))
* **i18n:** add translations for share button + fix width ([39af177](https://github.com/memori-ai/memori-react/commit/39af177b5f1ef5910ff8d7f946d5d4c7a9be27e3))
* **i18n:** add translations to auth, add tests ([cc16d64](https://github.com/memori-ai/memori-react/commit/cc16d64c43ba9119fcce8d31241d08b393d48b1d))
* mock position drawer for now ([27fd297](https://github.com/memori-ai/memori-react/commit/27fd297e10de1c90f50dbf05882f7a72af91415c))
* prepare for release ([99c839c](https://github.com/memori-ai/memori-react/commit/99c839c90b372cd0bfb0d5dbdac5514649cd79ae))
* prepare for release ([a553186](https://github.com/memori-ai/memori-react/commit/a5531863ebfa6d2e28a5d66013a62516207a82cc))
* remove tsup, go without bundler ([eb2e5b8](https://github.com/memori-ai/memori-react/commit/eb2e5b8d36a90d9f94720742dca736fe03176166))
* set pkg non-version ([abd5e9e](https://github.com/memori-ai/memori-react/commit/abd5e9e97c822917d0310496cc9f19dbbeeb9325))
* storybook compatibility with react 17 ([4ed785b](https://github.com/memori-ai/memori-react/commit/4ed785b299c2a9546eba4c204892dfdda202045b))
* switch to tsup ([54d1436](https://github.com/memori-ai/memori-react/commit/54d1436a6195303806c2c32985f6801ae6292d67))
* update gitignore ([7305a24](https://github.com/memori-ai/memori-react/commit/7305a24c1ae5b35c8f377988f710a50747c2182b))
* update lockfile ([eed8d8b](https://github.com/memori-ai/memori-react/commit/eed8d8bbd621319be3f7a8eb54989e126ba21d85))
* update tsconfig ([f008b7d](https://github.com/memori-ai/memori-react/commit/f008b7d9be9b67596a5626515ec99bcf3e0cdc7c))
* upgrade api client lib ([8f11101](https://github.com/memori-ai/memori-react/commit/8f1110195b8975135e2b9da9e6a265cd7380569d))
* upgrade cognitive-services-speech-sdk-js ([e1f9ed5](https://github.com/memori-ai/memori-react/commit/e1f9ed57c128791297c9215f780032104b7664a2))