

## [7.9.1](https://github.com/memori-ai/memori-react/compare/v7.9.0...v7.9.1) (2024-11-21)


### Bug Fixes

* refactor api client vs url usage, fix engine url in client init ([ff4958e](https://github.com/memori-ai/memori-react/commit/ff4958ed3a7c75ec8e1a8fab5c2359ced075fcc6))

## [7.9.0](https://github.com/memori-ai/memori-react/compare/v7.8.8...v7.9.0) (2024-11-20)


### Features

* added isactive flag for reusable button component ([ec80372](https://github.com/memori-ai/memori-react/commit/ec8037272912fce5f797c74d93b109594fc276ae))
* added isAvatar3D flag for making the Avatar Controls visible ([779b9ad](https://github.com/memori-ai/memori-react/commit/779b9ad610f0af067fe8219ef83e8b2b45d68233))
* added isTotem prop in Avatar Component for managing default avatar size for different layouts ([d704f9b](https://github.com/memori-ai/memori-react/commit/d704f9bcea7489a3eb00e719dc8d406e952d1d5b))
* added new slider component ([d1bb0be](https://github.com/memori-ai/memori-react/commit/d1bb0be1757f47fbc7af483aee86ce7d2e48634b))
* added position controller to handle height and camera depth of the 3d avatar ([c54ca4b](https://github.com/memori-ai/memori-react/commit/c54ca4b52149aee56a7d1b91d92874628318fbb9))
* added position controls for height and depth ([be348fd](https://github.com/memori-ai/memori-react/commit/be348fd17d27f17330e6b0910a144b78f53c3c9a))
* added script that make local web server working on emulator ([c62de47](https://github.com/memori-ai/memori-react/commit/c62de475703c0b303e2763991cfd3cf002e18582))
* adjusted fixed positions for totem ([45edd05](https://github.com/memori-ai/memori-react/commit/45edd05aed3877af6c65dae9bb8d1c9db36e7467))
* for slider component improved compatibility for mobile and animations ([e32d511](https://github.com/memori-ai/memori-react/commit/e32d511f356234f64e7d8e0f10ac6725572a9813))
* for TOTEM layout get the position values from the local storage otherwise are fixed ([85624a3](https://github.com/memori-ai/memori-react/commit/85624a3498011f2092325573d8b49ec2e0ee9974))
* half body and full body dynamic position update ([3b2f1a6](https://github.com/memori-ai/memori-react/commit/3b2f1a6deda00a8a67925d9a74ecf5ea62a9d570))
* **lang:** updated lang ([388de3f](https://github.com/memori-ai/memori-react/commit/388de3feab6d7f239d52d7160c801dfd8edd55ec))
* **lang:** updated translations ([b7cea50](https://github.com/memori-ai/memori-react/commit/b7cea5050b2b0b00cee989e7bc8aa2dc549c1ca1))
* passed enablePositionControl to avatar component ([1177358](https://github.com/memori-ai/memori-react/commit/1177358b6bdc9b59d03aaabc9022fe0cc8349cdb))
* settings drawer added enable controls checkbox ([792cae0](https://github.com/memori-ai/memori-react/commit/792cae0e876085c4c1521ccbfb6a2882ad83e8d3))
* updated slider component, now the label can be a ReactNode ([f213711](https://github.com/memori-ai/memori-react/commit/f2137111475af423e5006c3e4049773c916d6de9))


### Bug Fixes

* lint css ([2f40128](https://github.com/memori-ai/memori-react/commit/2f401282069cb0a450ca00c96e25ada999f7e401))
* on mount disabled textarea focus only for TOTEM layout ([a8b0ab4](https://github.com/memori-ai/memori-react/commit/a8b0ab44b282e61c49eef39adbaa054222a18d08))
* reintroduced head movement for half body avatar and removed unused speaking prop ([997f6f5](https://github.com/memori-ai/memori-react/commit/997f6f568a5c753386de7df72fcfaa66e1c0271b))
* removed hands for half body avatar ([c0bd4a0](https://github.com/memori-ai/memori-react/commit/c0bd4a0221bfec3f81773eb7a66d315be202cddd))
* removed important from reusable button css ([c8774d4](https://github.com/memori-ai/memori-react/commit/c8774d438aa3f31acb9b00987f8d1830e0a59fb9))
* removed keyboard automatic focus on mobile after audio recording ([ae8d737](https://github.com/memori-ai/memori-react/commit/ae8d737de031a9b2434c4bb7ba951bf9f9ea1d13))
* removed negative range values for depth slider and asjusted default layout values position for the avatar ([5c197d8](https://github.com/memori-ai/memori-react/commit/5c197d8c7d4c7e093df6e2625c002d9f3c8abada))
* removed style that was cropping the half body avatar ([cab622c](https://github.com/memori-ai/memori-react/commit/cab622c81ce09f3a68103a09d22f7922590ec138))
* removed unused prop and fixed reset textarea focus logic ([b5ff368](https://github.com/memori-ai/memori-react/commit/b5ff368922614791d26a358d5e6c92bfb471a1c1))
* removed unused prop for PositionControls Component ([fff69d1](https://github.com/memori-ai/memori-react/commit/fff69d1dec3fcb38e85561e851637e1e0b7da4e8))
* removed unused props for FullbodyAvatar component ([b28ff76](https://github.com/memori-ai/memori-react/commit/b28ff7646852f971517c8f37b0afc8423e0c6578))
* removed wrong state update and logs ([7570aa4](https://github.com/memori-ai/memori-react/commit/7570aa4f3906a51e27f45c038fc26fd25dde5a3f))
* replaced undefined type with null for avatarType prop ([d4cd4fb](https://github.com/memori-ai/memori-react/commit/d4cd4fbc90f65756a7bec03ab7d63093e684b8ad))
* update slider state and fixed depth buttons ([4192537](https://github.com/memori-ai/memori-react/commit/41925376863a26205735c86e2847175debd3ea87))
* updated avatar test ([4bcd669](https://github.com/memori-ai/memori-react/commit/4bcd6693ef632a86719bd27c9b5f0a39c3e963fa))
* updated flag isChatAlreadyStarted as soon as the avatar isLoading ([9b13b55](https://github.com/memori-ai/memori-react/commit/9b13b555a118ef7492011ebd3705b3f056b07e12))


### Maintenance

* update api client ([87de67e](https://github.com/memori-ai/memori-react/commit/87de67e8720425cb5592e76cdbcd3cd19354b461))


### Changes

* add timezoneOffset in session opening ([4e4a4cb](https://github.com/memori-ai/memori-react/commit/4e4a4cb69e622edf6954c4b1617e4618bfcf1cc9))
* enhanced UI of Position Controls for totem layout ([99a2008](https://github.com/memori-ai/memori-react/commit/99a20082eac9b97603308b26ef0ed95490d97bbb))
* replaced constants and morp target controller to the parent directory for better organization ([c1097ce](https://github.com/memori-ai/memori-react/commit/c1097ce00b90a6acae021a7cb3b32bdd577766d5))

## [7.8.8](https://github.com/memori-ai/memori-react/compare/v7.8.7...v7.8.8) (2024-11-14)


### Bug Fixes

* replace regex lookbehind to support old safari versions ([4aea110](https://github.com/memori-ai/memori-react/commit/4aea1108450e36018a90cab5bdd86cf3a1737275))

## [7.8.7](https://github.com/memori-ai/memori-react/compare/v7.8.6...v7.8.7) (2024-11-11)


### Changes

* prisma as external dep from cdn ([f93abb8](https://github.com/memori-ai/memori-react/commit/f93abb8f2ea6786373e7089908b046fd980f2bfc))

## [7.8.6](https://github.com/memori-ai/memori-react/compare/v7.8.5...v7.8.6) (2024-11-11)


### Maintenance

* update female fullbody animation glb url ([afb11f7](https://github.com/memori-ai/memori-react/commit/afb11f71b3efce56e1439bbc523abaa335b4c624))

## [7.8.5](https://github.com/memori-ai/memori-react/compare/v7.8.4...v7.8.5) (2024-11-07)


### Features

* added idle random after every animation except for Loading ([18264fa](https://github.com/memori-ai/memori-react/commit/18264fa892a77bb7154548566039a3fc297d544b))


### Bug Fixes

* condition to avoid repeating the same idle animation twice ([6137575](https://github.com/memori-ai/memori-react/commit/61375754dbc176a6e3875b9d25d34cc2d822251b))


### Changes

* fine tuned lip sync constant values ([2756914](https://github.com/memori-ai/memori-react/commit/2756914a023b6ccc90316698ccc2dbba8df7b4c1))
* handle full body avatar animation and morph target in separated classes ([f8c20d1](https://github.com/memori-ai/memori-react/commit/f8c20d15ff67c6b7c6857f893c1ec14dd88660c9))
* removed logs and set max idle count ([12d06b7](https://github.com/memori-ai/memori-react/commit/12d06b7f154387cfe405545f0db8ba3ade5fd966))

## [7.8.4](https://github.com/memori-ai/memori-react/compare/v7.8.3...v7.8.4) (2024-10-31)


### Maintenance

* change speech services region ([d851f29](https://github.com/memori-ai/memori-react/commit/d851f29b2381335fc2978d69db45bbd54c18a06f))

## [7.8.3](https://github.com/memori-ai/memori-react/compare/v7.8.2...v7.8.3) (2024-10-28)


### Bug Fixes

* restored working speak function ([4981353](https://github.com/memori-ai/memori-react/commit/498135332357520df43e65bd070827e81805f1d5))


### Changes

* speak function and viseme handling ([237f20d](https://github.com/memori-ai/memori-react/commit/237f20de397427370a98356613c74bb276063530))


### Maintenance

* refactor lip sync process, calculate time relative to when processing started ([0d33986](https://github.com/memori-ai/memori-react/commit/0d33986f4566e6de911e9fd724184785e2ac61f2))
* the visemeContext begin visemes process when AudioContext starts ([11c78ab](https://github.com/memori-ai/memori-react/commit/11c78ab5d9017d45b163d973bca909e7a43cca09))

## [7.8.2](https://github.com/memori-ai/memori-react/compare/v7.8.1...v7.8.2) (2024-10-21)


### Bug Fixes

* correctly reset emotion morph targets ([e0c3828](https://github.com/memori-ai/memori-react/commit/e0c38283e48a0dddeb70cf9019abb385780ef523))
* removed unused prop into AvatarComponent ([57774d4](https://github.com/memori-ai/memori-react/commit/57774d4b5f6b1598914009691fcbf409e7d067f8))

## [7.8.1](https://github.com/memori-ai/memori-react/compare/v7.8.0...v7.8.1) (2024-10-21)


### Features

* added new female animations ([8f26840](https://github.com/memori-ai/memori-react/commit/8f26840c4c4d395171941d0e7345e5aabc3ab724))

## [7.8.0](https://github.com/memori-ai/memori-react/compare/v7.8.0-rc.1...v7.8.0) (2024-10-18)

## [7.8.0-rc.1](https://github.com/memori-ai/memori-react/compare/v7.8.0-rc.0...v7.8.0-rc.1) (2024-10-18)


### Features

* fine tuned lip sync params ([25f6d53](https://github.com/memori-ai/memori-react/commit/25f6d5328855564f8ae186e31d1f070d472dd0dc))
* improved fullbody avatar state management ([ddac623](https://github.com/memori-ai/memori-react/commit/ddac623afcd4ca58cd887b35d950cf23d3caf8f2))
* removed scroll beahviour for ZOOMED FULL BODY ([2c9e1ae](https://github.com/memori-ai/memori-react/commit/2c9e1ae9eb468d68fe9b0892f00b03c8fbb41ed4))


### Bug Fixes

* adjusted ZOOMED FULL BODY layout style ([cefab1e](https://github.com/memori-ai/memori-react/commit/cefab1e4759a4a01c50cd21c3c828ae6a1cbe3c1))
* fixed starting twice audio ([d108ea8](https://github.com/memori-ai/memori-react/commit/d108ea89265564b81c6a181347621676780b36af))

## [7.8.0-rc.0](https://github.com/memori-ai/memori-react/compare/v7.7.1...v7.8.0-rc.0) (2024-10-17)


### Features

* fine tuned lip sync ([f8557ee](https://github.com/memori-ai/memori-react/commit/f8557ee744016967cb70cd4458ab869838027fbd))
* reintroduced old lip sync system ([3626b55](https://github.com/memori-ai/memori-react/commit/3626b55b8098fc2b832d9b7f74104c13bfc127fc))
* reintroduced old lip sync system ([0678e46](https://github.com/memori-ai/memori-react/commit/0678e46f93ece534e7ecff6784dc5430ea67428b))


### Bug Fixes

* adjusted half body avatar component woth lip sync and blink ([5c8f8cd](https://github.com/memori-ai/memori-react/commit/5c8f8cd201cbcd4ac00e53779d2d31b8e8e8f9da))
* half body avatar ([c70ca97](https://github.com/memori-ai/memori-react/commit/c70ca979a0642e9a44847697eb6e3ec99489bb14))
* zoomed full body styles ([47cfc0d](https://github.com/memori-ai/memori-react/commit/47cfc0de775cb7d6e61125eba1ec27db1e176507))


### Maintenance

* adapt showFullHistory for hidden chat layout ([872b28d](https://github.com/memori-ai/memori-react/commit/872b28d4b5871590e6f12acb9468988be2cdcea0))
* reduce VISEME_OVERLAP ([474e3ea](https://github.com/memori-ai/memori-react/commit/474e3ea852377970244d4e20f22d76a4df24d6e3))

## [7.7.1](https://github.com/memori-ai/memori-react/compare/v7.7.0...v7.7.1) (2024-10-15)


### Features

* fine tuned lip sync ([5d71023](https://github.com/memori-ai/memori-react/commit/5d71023b78a1722872096a0577cb14cae8848eb8))


### Bug Fixes

* fine tuned lip sync and base animations ([6905874](https://github.com/memori-ai/memori-react/commit/69058747e48944c7054802e829654895d4b7823a))

## [7.7.0](https://github.com/memori-ai/memori-react/compare/v7.6.1...v7.7.0) (2024-10-15)


### Features

* improve lip sync ([#20](https://github.com/memori-ai/memori-react/issues/20)) ([e13f520](https://github.com/memori-ai/memori-react/commit/e13f520eb91bd8af1cc42578da29316f0b25033e))


### Bug Fixes

* avatar 3d animations, fine tuned lip sync values and removed useless function to useEffect ([1a51c26](https://github.com/memori-ai/memori-react/commit/1a51c26a0220bc9a312c7c34072188e642742111))


### Changes

* translate api as post ([04a963c](https://github.com/memori-ai/memori-react/commit/04a963c4bab72d613bbee4a0d7af01715ec1b0e0))

## [7.6.1](https://github.com/memori-ai/memori-react/compare/v7.6.0...v7.6.1) (2024-10-11)


### Bug Fixes

* added 'memori-' to all of hidden chat classes ([adebe23](https://github.com/memori-ai/memori-react/commit/adebe23427d249be67b9ee138f32dcaa312af672))
* added DateSelector inside the Jest ignore patterns ([92787c6](https://github.com/memori-ai/memori-react/commit/92787c6db38d88fb5f5ff56dca732e2bf29c7a40))

## [7.6.0](https://github.com/memori-ai/memori-react/compare/v7.5.1...v7.6.0) (2024-10-11)


### Features

* added context for handling visemes and lips animation ([82d68e4](https://github.com/memori-ai/memori-react/commit/82d68e49c7354310b74dc34b8956e440cf7e7278))
* added emotion to XML audio tag ([c188673](https://github.com/memori-ai/memori-react/commit/c188673485078a6f001bc09f99c46a9349e5c184))
* added face mesh when animation is triggered and eye blink ([76c9374](https://github.com/memori-ai/memori-react/commit/76c937437ea7c111978823f57a6bcf24ff1eaa38))
* added loading animations ([2c53776](https://github.com/memori-ai/memori-react/commit/2c53776529c303b2128ff28ac6adc15634d1ab54))
* added mistral and anthropic to completion provider status ([70f05ec](https://github.com/memori-ai/memori-react/commit/70f05ec763579ba75ff30b6fe984ee40ba48dfc5))
* added mouth movement using visemes based on the text provided ([af55d34](https://github.com/memori-ai/memori-react/commit/af55d342ab4150ea579c0d56ad7c8405674ecbf3))
* added new animations for Male and Female avatar ([0d63458](https://github.com/memori-ai/memori-react/commit/0d634586d311380d91b7825ce1628ddc7844d5d9))
* added new hidden chat layout ([a83800d](https://github.com/memori-ai/memori-react/commit/a83800d87a8bdf71817ced43eb1592ea9008d2c2))
* added new zoomed avatar layout ([b031488](https://github.com/memori-ai/memori-react/commit/b03148818014ca193565131cfb313651c73c09b8))
* made avatar mesh transitions smoother and added emotion animation based on chat tag ([82a1fae](https://github.com/memori-ai/memori-react/commit/82a1faea17280174875a6ad80d477b66c9816063))
* removed unused hooks and linked context function for lips animation ([dea3740](https://github.com/memori-ai/memori-react/commit/dea374098259671f4117ec6b77747f989088d7e1))
* **temp:** modified default prop show animations controls to true ([a3b2adc](https://github.com/memori-ai/memori-react/commit/a3b2adcb6cda2db5506e4724158bf9510f4049ad))
* updated skinned mesh name for the latest glb released ([278ccb8](https://github.com/memori-ai/memori-react/commit/278ccb86ca13b70714e50ad44675f690c961a877))


### Bug Fixes

* **a11y:** add aria label on hidden chat controls ([c858262](https://github.com/memori-ai/memori-react/commit/c858262eae34c969775cd3caedb5ced4c7aaa44d))
* added padding to HIDDEN_CHAT layout ([5856be7](https://github.com/memori-ai/memori-react/commit/5856be7e9d3fb6db731d765364ff2a26777ea6b4))
* auto translate ui if not multilingual ([754f6a8](https://github.com/memori-ai/memori-react/commit/754f6a8ba00f7229ee5543d87d743cbdb6e97e11))
* fixed name of new layout ZOOMED_FULL_BODY ([353bf32](https://github.com/memori-ai/memori-react/commit/353bf32b7ecb69f782912da38978345eb39502bc))
* hidden chat layout doesn't overlapse with the content ([055cbe5](https://github.com/memori-ai/memori-react/commit/055cbe55ddb19c5165d9effdcfb9c29bf8d6aa48))
* import style ([543157d](https://github.com/memori-ai/memori-react/commit/543157da01d02981f931e25485e738f4d69c3176))
* reinserted inside half body the blink and speak animation ([80e4889](https://github.com/memori-ai/memori-react/commit/80e488936e236ce8a7fea482cc0c10745ccec56c))
* removed chat visibility on mobile ([3aa1fa8](https://github.com/memori-ai/memori-react/commit/3aa1fa8677fa0bdc68930abf8dd45b4beac71b69))
* removed tag <output> from speech text and adjusted viseme smoothing value ([fe5b4dd](https://github.com/memori-ai/memori-react/commit/fe5b4ddc698517de1eff3b9447361fdf758c808e))
* **style:** fixed hidden chat layout style ([b95eb60](https://github.com/memori-ai/memori-react/commit/b95eb60e2a099f5f252e32f79e0e463945c59e7d))


### Maintenance

* get visemes data from azure and processed the visemes data when speak ([14c76a8](https://github.com/memori-ai/memori-react/commit/14c76a837d0cc045e48e53019d3100af921052a2))
* update api client ([034eb38](https://github.com/memori-ai/memori-react/commit/034eb38181287d4a5af68f00d5c0074ed6959e70))


### Changes

* strip html in msg parsing for TTS, fix plaintext to copy ([4d95f39](https://github.com/memori-ai/memori-react/commit/4d95f392e6f86bf7d512dc7ce1be0ce44b5402a1))

## [7.5.1](https://github.com/memori-ai/memori-react/compare/v7.5.0...v7.5.1) (2024-09-24)


### Bug Fixes

* avatar view add suspense ([b3d21ca](https://github.com/memori-ai/memori-react/commit/b3d21ca5cba02d8120297930935a35c1c7873e4e))
* output tag parsing for tts ([a641461](https://github.com/memori-ai/memori-react/commit/a6414612bbf744d9e4b0f5fce28bc45887132902))

## [7.5.0](https://github.com/memori-ai/memori-react/compare/v7.4.6...v7.5.0) (2024-09-23)


### Features

* add new ui langs es, fr, de ([a15341c](https://github.com/memori-ai/memori-react/commit/a15341ceec7f8bc85a5b7c231b8e06ab6364cbcd))
* added additive action weights change ([0fe809e](https://github.com/memori-ai/memori-react/commit/0fe809e20e58bae196936a9f9109910c4c6bbce5))
* added showControls prop to Storybook ([fdb1f42](https://github.com/memori-ai/memori-react/commit/fdb1f4206b3ba8f949cdfe58d98568e53e0ca836))
* added smooth animation transition ([c6abba8](https://github.com/memori-ai/memori-react/commit/c6abba85e5d396e218fb556a9f607eeab3df5b28))
* added talking and loading animations triggered by corresponding props ([601f81d](https://github.com/memori-ai/memori-react/commit/601f81d520c7dda903be6ac74c4b7ef6544c48c4))
* change ui lang updating spoken lang ([d30b921](https://github.com/memori-ai/memori-react/commit/d30b9210ef6300fe1fe6704a620e8605fec3c8a5))


### Changes

* added new gui for animations control ([428cb6f](https://github.com/memori-ai/memori-react/commit/428cb6f898d42b3775be7f0c4da6681dd0d71a35))
* refactored directories RPM 3D Avatar ([1a1b9fa](https://github.com/memori-ai/memori-react/commit/1a1b9faf1018e9ce2e8ab7c67227fdfb05236b0d))


### Maintenance

* cleanup, fix avatar blob fallback ([74b522e](https://github.com/memori-ai/memori-react/commit/74b522e26f8de499ecf3e53050b8f33a782e9bbc))
* update error codes ([b760518](https://github.com/memori-ai/memori-react/commit/b760518e64cfd472426cf3d718ec764d0b43739f))
* update error codes ([7995e5d](https://github.com/memori-ai/memori-react/commit/7995e5d0b782bafa8f85bffb83dfc2ee104783f5))

## [7.4.6](https://github.com/memori-ai/memori-react/compare/v7.4.5...v7.4.6) (2024-09-19)


### Bug Fixes

* icons jsx attr camelcase ([97362da](https://github.com/memori-ai/memori-react/commit/97362da774318ff3dcd21e2711e1410085416523))
* katex parsing with special characters, refactor kiss, cover other edge cases with spaces ([89c15dd](https://github.com/memori-ai/memori-react/commit/89c15dd217f4023dae555385994b800022568c7a))
* prevent mathjax to throw and explode ([cec112e](https://github.com/memori-ai/memori-react/commit/cec112e877c4b7a7845c9028706ddcdf45e9c802))

## [7.4.5](https://github.com/memori-ai/memori-react/compare/v7.4.4...v7.4.5) (2024-09-16)


### Bug Fixes

* default audio value for mute speaker ([09022bc](https://github.com/memori-ai/memori-react/commit/09022bcf30fe331e8ddf31edfe8073a5077a9693))
* knownfacts header icon disabled color ([34225bd](https://github.com/memori-ai/memori-react/commit/34225bd87381316fac2925ddd36070ec8325cb57))

## [7.4.4](https://github.com/memori-ai/memori-react/compare/v7.4.3...v7.4.4) (2024-09-11)


### Bug Fixes

* readability and a11y about disabled buttons ([452559e](https://github.com/memori-ai/memori-react/commit/452559eb6447c88f267da636fb42e80e9d83d46b))

## [7.4.3](https://github.com/memori-ai/memori-react/compare/v7.4.2...v7.4.3) (2024-09-11)


### Changes

* hide output tags in chat, strip them for TTS ([02e2e42](https://github.com/memori-ai/memori-react/commit/02e2e423226ec9643c83b371c78e3e468e044737))

## [7.4.2](https://github.com/memori-ai/memori-react/compare/v7.4.1...v7.4.2) (2024-09-10)


### Maintenance

* update api client + remove gamification ([e159713](https://github.com/memori-ai/memori-react/commit/e15971388168e1d18360bbff23f000c77e57046c))

## [7.4.1](https://github.com/memori-ai/memori-react/compare/v7.4.0...v7.4.1) (2024-09-09)


### Changes

* adapt changes from new completions config ([ce5343a](https://github.com/memori-ai/memori-react/commit/ce5343a0f186239a20fb66e0c84844f2202fd2f2))

## [7.4.0](https://github.com/memori-ai/memori-react/compare/v7.3.1...v7.4.0) (2024-08-29)


### Features

* add enableAudio prop, read also from config ([240c03c](https://github.com/memori-ai/memori-react/commit/240c03c60796a2174cb1354d819ded273a0d1c2e))


### Bug Fixes

* **ui:** made the disabled buttons visible ([e848145](https://github.com/memori-ai/memori-react/commit/e8481456f3fec7e7a8184c791d98d74c75a9cf8c))


### Changes

* remove gamification ([64c3f7e](https://github.com/memori-ai/memori-react/commit/64c3f7eed4b56c7cc4eaa3a550b62497ce4efe2f))

## [7.3.1](https://github.com/memori-ai/memori-react/compare/v7.3.0...v7.3.1) (2024-08-20)


### Bug Fixes

* fixed multi language prop bug ([de66171](https://github.com/memori-ai/memori-react/commit/de661712a9a68872b29dc293142ca365ec7462db))

## [7.3.0](https://github.com/memori-ai/memori-react/compare/v7.2.0...v7.3.0) (2024-08-02)


### Features

* add showTranslationOriginal, keep emission as from engine and use translatedEmission in msg and state ([38a4302](https://github.com/memori-ai/memori-react/commit/38a4302392a2e960776769b68af074d7b696266d))


### Bug Fixes

* prevent <output> tags from translations, use correct default endpoint to skip redirections ([8107c00](https://github.com/memori-ai/memori-react/commit/8107c00f23a85d7ae95505e69690c080ec70f169))


### Changes

* make message and state handling resilient on translations failures ([919e126](https://github.com/memori-ai/memori-react/commit/919e1268d22a16fc1270c54db4a38db5e87cffbb))

## [7.2.0](https://github.com/memori-ai/memori-react/compare/v7.1.3...v7.2.0) (2024-07-31)


### Features

* add copy buttons ([e80d12c](https://github.com/memori-ai/memori-react/commit/e80d12c2a373f786a3e65932b06dc34b9474ee38))


### Changes

* change copy icon ([6d6fd26](https://github.com/memori-ai/memori-react/commit/6d6fd263a6150a4a6d0a5767aa31b140b0493a71))

## [7.1.3](https://github.com/memori-ai/memori-react/compare/v7.1.2...v7.1.3) (2024-07-30)


### Maintenance

* turn console error in warn/debug for non essential/handled errors ([8693910](https://github.com/memori-ai/memori-react/commit/86939103c4b5aaae748ef4350af2d0c902602e1c))

## [7.1.2](https://github.com/memori-ai/memori-react/compare/v7.1.1...v7.1.2) (2024-07-24)


### Bug Fixes

* dont include media wrapper if no media is shown ([b492706](https://github.com/memori-ai/memori-react/commit/b4927064a411c40a1a3a0785adfe0c70ba092840))


### Maintenance

* enhancements for new lines parsing ([c30cde5](https://github.com/memori-ai/memori-react/commit/c30cde58a42db15b25406214d0ee4b73578ca607))

## [7.1.1](https://github.com/memori-ai/memori-react/compare/v7.1.0...v7.1.1) (2024-07-22)


### Bug Fixes

* chat layout responsiveness width ([adfc95a](https://github.com/memori-ai/memori-react/commit/adfc95aa0549084a04446118647962bb488cb7c7))
* remove microphone button mouse leave event, caused conflicts sending on hover ([625626f](https://github.com/memori-ai/memori-react/commit/625626fea505648517c838ea630090460916d016))

## [7.1.0](https://github.com/memori-ai/memori-react/compare/v7.0.8...v7.1.0) (2024-07-18)


### Features

* new event MemoriNewDialogState emitted when receiving new state from engine ([9da9690](https://github.com/memori-ai/memori-react/commit/9da9690173d7cd140baac6a7f2aa611eb8b12ddb))

## [7.0.8](https://github.com/memori-ai/memori-react/compare/v7.0.7...v7.0.8) (2024-07-16)


### Changes

* chat layout progressive max-width ([80c8ab8](https://github.com/memori-ai/memori-react/commit/80c8ab8fd237147311be81f68a467eae16fe4143))

## [7.0.7](https://github.com/memori-ai/memori-react/compare/v7.0.6...v7.0.7) (2024-07-12)


### Bug Fixes

* typos ([6d62495](https://github.com/memori-ai/memori-react/commit/6d62495fe575942c10588ad0113d99d5836af6bd))

## [7.0.6](https://github.com/memori-ai/memori-react/compare/v7.0.5...v7.0.6) (2024-07-12)


### Maintenance

* add new prop disableTextEnteredEvents to disable listeners ([b4ab8b7](https://github.com/memori-ai/memori-react/commit/b4ab8b7c88d9d79bc19a6bc64694f30bbea0c2e4))
* add try catch on message sending, stopping loading on error ([079bd15](https://github.com/memori-ai/memori-react/commit/079bd1504354c40cadf18c6620d9f2db49d0e72a))

## [7.0.5](https://github.com/memori-ai/memori-react/compare/v7.0.4...v7.0.5) (2024-07-11)


### Changes

* fix mathjax selector overlap on parenthesis, refactor mathjax config ([faf91e7](https://github.com/memori-ai/memori-react/commit/faf91e73d790a2c03c9493032b8570e12006605d))

## [7.0.4](https://github.com/memori-ai/memori-react/compare/v7.0.3...v7.0.4) (2024-07-09)


### Bug Fixes

* textarea margins ([086b13e](https://github.com/memori-ai/memori-react/commit/086b13e29826033a6934d7dfb15c8318f6f7da4f))


### Changes

* dont store preference and remove selector for send on enter, different defaults for desktop and mobile ([e6af1ba](https://github.com/memori-ai/memori-react/commit/e6af1baf680cd77dc61a29148c70173e0661e3b9))

## [7.0.3](https://github.com/memori-ai/memori-react/compare/v7.0.2...v7.0.3) (2024-07-05)


### Maintenance

* change dompurify sanitize import ([4279ac0](https://github.com/memori-ai/memori-react/commit/4279ac028bba93948705a6243d041cd786c45028))


### Changes

* fix media item rgb color sizes ([1be970c](https://github.com/memori-ai/memori-react/commit/1be970cd6d267c1cdc29558b050f815bb918be0a))
* rgb media items without link ([656517b](https://github.com/memori-ai/memori-react/commit/656517bdb23b3461371281c2074e0c2b8de01b04))
* table compact styles ([56556db](https://github.com/memori-ai/memori-react/commit/56556dbccbee2a626adbe9de55f3245ffa86b1c7))

## [7.0.2](https://github.com/memori-ai/memori-react/compare/v7.0.1...v7.0.2) (2024-07-04)


### Changes

* better parse markdown avoiding nested markdown code ([41910a3](https://github.com/memori-ai/memori-react/commit/41910a33f2527a913522ff6953b3139f4a8dec1b))

## [7.0.1](https://github.com/memori-ai/memori-react/compare/v7.0.0...v7.0.1) (2024-07-03)


### Bug Fixes

* chat link word break ([7ba2993](https://github.com/memori-ai/memori-react/commit/7ba2993e298e3ab0214c92054d35c00c956ced21))
* markdown link parsing url ([94cab0f](https://github.com/memori-ai/memori-react/commit/94cab0f3951f9e8480e0e92f9873045dd9a259ab))

## [7.0.0](https://github.com/memori-ai/memori-react/compare/v6.8.2...v7.0.0) (2024-06-26)


### ⚠ BREAKING CHANGES

* split engine and backend endpoints

### Changes

* split engine and backend endpoints ([6bcb56d](https://github.com/memori-ai/memori-react/commit/6bcb56df8b059c8bb3a9cfe3c4a14691f541aa1d))


### Maintenance

* update proptypes ([0dbdfb2](https://github.com/memori-ai/memori-react/commit/0dbdfb268a8844c42014f73a17db1e4ab0db4f9c))

## [6.8.2](https://github.com/memori-ai/memori-react/compare/v6.8.1...v6.8.2) (2024-06-21)


### Changes

* completion provider status from openai selecting only API component ([36f37f0](https://github.com/memori-ai/memori-react/commit/36f37f0111d765c5580e53f013b1ec7437a81e71))
* mobile chat text content size ([5146d85](https://github.com/memori-ai/memori-react/commit/5146d85445d43513b518445a087b8c713bcb1691))

## [6.8.1](https://github.com/memori-ai/memori-react/compare/v6.8.0...v6.8.1) (2024-06-21)


### Bug Fixes

* import katex styles from cdn ([f4cd80d](https://github.com/memori-ai/memori-react/commit/f4cd80dae8558ee2052e27e1360d3858db172d6c))
* mathjax loading and parsing, moved to effect ([cbd1274](https://github.com/memori-ai/memori-react/commit/cbd12740e4e7764a3f12aa8f3916b19e1c3b42a6))

## [6.8.0](https://github.com/memori-ai/memori-react/compare/v6.7.2...v6.8.0) (2024-06-19)


### Features

* add arabic, chinese and japanese langs, add dir auto to emissions ([e7dafd2](https://github.com/memori-ai/memori-react/commit/e7dafd2b51285d7bec19e0239eb47768fca103a8))


### Changes

* add selectors for MathJax elements in parsing ([f0e6724](https://github.com/memori-ai/memori-react/commit/f0e6724e7d042863b34708aa1c6b7bd855ce17e2))
* enable markdown parsing for emissions, not user messages ([1e34242](https://github.com/memori-ai/memori-react/commit/1e342421eecf578f570591b1453d80305fa48d81))
* enhance markdown + mathjax parsing for links, strip markdown and syntax symbols for TTS ([e76c8ea](https://github.com/memori-ai/memori-react/commit/e76c8ea4fbe82c4b27146ff5efc7bcd80724379b))

## [6.7.2](https://github.com/memori-ai/memori-react/compare/v6.7.1...v6.7.2) (2024-06-18)


### Maintenance

* update error codes and translations ([c065d68](https://github.com/memori-ai/memori-react/commit/c065d68d555061b087b2f2581df19b36d4077d30))

## [6.7.1](https://github.com/memori-ai/memori-react/compare/v6.7.0...v6.7.1) (2024-06-13)


### Changes

* handle credit check with deep thought enabled + update error codes ([69f4bab](https://github.com/memori-ai/memori-react/commit/69f4bab687b6ac207b68cbaa4ee692e8293f1e8d))

## [6.7.0](https://github.com/memori-ai/memori-react/compare/v6.6.2...v6.7.0) (2024-06-13)


### Features

* add credits check, handle not enough credits to open session ([bac77ed](https://github.com/memori-ai/memori-react/commit/bac77ed7883734d0ffac1867123d8f45f489f76e))


### Bug Fixes

* media item caption size and word break ([c2f865a](https://github.com/memori-ai/memori-react/commit/c2f865ac00b4c0e81b199cd8e0b956d332c90237))


### Maintenance

* change other references to twincreator to aisuru ([2780e01](https://github.com/memori-ai/memori-react/commit/2780e015d376f3d7469750dd72ea6ebeaa613620))
* update api client and typings ([8cfe352](https://github.com/memori-ai/memori-react/commit/8cfe35290c12098a1e77d62b15a92518036703ec))

## [6.6.2](https://github.com/memori-ai/memori-react/compare/v6.6.1...v6.6.2) (2024-06-11)


### Maintenance

* cleanup ([f3c9a20](https://github.com/memori-ai/memori-react/commit/f3c9a2056661e156432f8bf3641dbc944e74970e))


### Changes

* add video/quicktime to media widget ([d89ea9a](https://github.com/memori-ai/memori-react/commit/d89ea9a2f67db879894f98335cacfe8649093850))
* dont show hints while loading answer ([8a777c6](https://github.com/memori-ai/memori-react/commit/8a777c6a8274a00133adb9b24e757e6aa17f3966))
* media items grid smaller size ([349547e](https://github.com/memori-ai/memori-react/commit/349547ebf083d863c5f4aff72240e1b05a6fe1a9))
* media items grid smaller size ([d60b752](https://github.com/memori-ai/memori-react/commit/d60b7527b087da74fa0af2c7559059f91dec953d))

## [6.6.1](https://github.com/memori-ai/memori-react/compare/v6.6.0...v6.6.1) (2024-06-07)


### Bug Fixes

* run mathjax only for chat bubbles content ([d51d1ef](https://github.com/memori-ai/memori-react/commit/d51d1ef5c321789bb3b6ca83fabf7941f0b491ea))

## [6.6.0](https://github.com/memori-ai/memori-react/compare/v6.5.3...v6.6.0) (2024-06-06)


### Features

* extended markdown parsing with tables, links, mathml + mathjax ([072ebae](https://github.com/memori-ai/memori-react/commit/072ebae83d91b8e1f0bd4ca2e2ebe04e447bcc67))

## [6.5.3](https://github.com/memori-ai/memori-react/compare/v6.5.2...v6.5.3) (2024-06-03)


### Bug Fixes

* show consecutive br in msg ([38ac194](https://github.com/memori-ai/memori-react/commit/38ac194fd4da7af005be8d4913f67785a746c9b5))

## [6.5.2](https://github.com/memori-ai/memori-react/compare/v6.5.1...v6.5.2) (2024-05-17)


### Bug Fixes

* position widget has to be the first in header ([b1e9062](https://github.com/memori-ai/memori-react/commit/b1e9062a77ff274abc462adc81cd3544282dde78))
* totem layout dont show position place name ([9a2a5d1](https://github.com/memori-ai/memori-react/commit/9a2a5d14bc72be9a90ba787a645bfc2131402c63))

## [6.5.1](https://github.com/memori-ai/memori-react/compare/v6.5.0...v6.5.1) (2024-05-13)


### Bug Fixes

* account form validation ([37eb892](https://github.com/memori-ai/memori-react/commit/37eb8920a3647d8981ba034dc8b227d852e5ec71))

## [6.5.0](https://github.com/memori-ai/memori-react/compare/v6.4.6...v6.5.0) (2024-05-09)


### ⚠ BREAKING CHANGES

* use new aisuru color as default primary

### Features

* add account management in login drawer ([1d03455](https://github.com/memori-ai/memori-react/commit/1d0345543f9d7ffb7a5d93427d1952181f2559ca))
* add change pwd to login ([cbe4ca5](https://github.com/memori-ai/memori-react/commit/cbe4ca5134bf58c4533b6247c253f53e04f73191))
* add signup from login drawer ([95c3510](https://github.com/memori-ai/memori-react/commit/95c35103e559134cac1d5de411bc9962f6021e8b))


### Bug Fixes

* venue widget mobile buttons ([3f07570](https://github.com/memori-ai/memori-react/commit/3f07570fb2011d532f243419bda91b5827617a84))


### Changes

* use new aisuru color as default primary ([57066cf](https://github.com/memori-ai/memori-react/commit/57066cf4421e51270699b0fda30145d710c94dfe))


### Maintenance

* update error codes and translations, fix error translation ([bd8484d](https://github.com/memori-ai/memori-react/commit/bd8484d6125e2c20f87d33e9c6580dbafb5d28c7))

## [6.4.6](https://github.com/memori-ai/memori-react/compare/v6.4.5...v6.4.6) (2024-05-07)


### Maintenance

* add greek lang ([d3767e2](https://github.com/memori-ai/memori-react/commit/d3767e2397101daca1f91f2469a2c365905dd784))


### Changes

* show why this answer from integration config, defaults to true ([41e7369](https://github.com/memori-ai/memori-react/commit/41e7369eab695ea110860c9d72472af30a16b665))

## [6.4.5](https://github.com/memori-ai/memori-react/compare/v6.4.4...v6.4.5) (2024-05-06)


### Maintenance

* update api client ([501eb90](https://github.com/memori-ai/memori-react/commit/501eb90f43ef85290e7eb6f1fbb959de97d76859))


### Changes

* add memorytags in message history + why this answer ([1f7e074](https://github.com/memori-ai/memori-react/commit/1f7e07428a3b436f8ef6f4da7f464be072aaa5ec))

## [6.4.4](https://github.com/memori-ai/memori-react/compare/v6.4.3...v6.4.4) (2024-05-03)


### Bug Fixes

* first emission timeout triggering ([fecc207](https://github.com/memori-ai/memori-react/commit/fecc207237b05ed5649d4fc637f6ec7339c4bc55))
* force https for extracted images in links ([2c7f408](https://github.com/memori-ai/memori-react/commit/2c7f4089bb96a358207c76c58b935ac3d307462f))
* timeout events triggering ([a001e27](https://github.com/memori-ai/memori-react/commit/a001e27f856a3ab504db01d9173e25cd7d2ff37e))


### Maintenance

* cleanup logs ([2f5ce87](https://github.com/memori-ai/memori-react/commit/2f5ce875eb2e553eab121be60e21bfedec479092))

## [6.4.3](https://github.com/memori-ai/memori-react/compare/v6.4.2...v6.4.3) (2024-05-02)


### Bug Fixes

* totem layout header button size and spacings ([f79ed7d](https://github.com/memori-ai/memori-react/commit/f79ed7d5328f548b4638654d68a8804e6691d988))


### Changes

* add forced timeout from integration config ([8fdf5c1](https://github.com/memori-ai/memori-react/commit/8fdf5c1816e689754d5f3bb0e925a0f167393bdd))

## [6.4.2](https://github.com/memori-ai/memori-react/compare/v6.4.1...v6.4.2) (2024-04-30)


### Maintenance

* update api client ([88c5311](https://github.com/memori-ai/memori-react/commit/88c5311a76422d60b1435daac0ca374fb0f61600))


### Changes

* add current tag to message history + whyThisAnswer search ([29c3676](https://github.com/memori-ai/memori-react/commit/29c36766acc6df1ffb0e32373f2100d09b9901f1))

## [6.4.1](https://github.com/memori-ai/memori-react/compare/v6.4.0...v6.4.1) (2024-04-30)


### Bug Fixes

* why this answer loading spin with skeleton ([45ecf68](https://github.com/memori-ai/memori-react/commit/45ecf68463cab21e775bebd42733333936f8b60c))


### Maintenance

* show max 3 contents in why this answer ([29c9114](https://github.com/memori-ai/memori-react/commit/29c91148eba5f14b5a51cc00b22ec6b7f1cc0464))


### Changes

* why this answer links + multiline source with expand ([10ff06d](https://github.com/memori-ai/memori-react/commit/10ff06de610aafec725965106902133cae0e45f2))

## [6.4.0](https://github.com/memori-ai/memori-react/compare/v6.3.1...v6.4.0) (2024-04-29)


### Features

* add expandable ([afaed3e](https://github.com/memori-ai/memori-react/commit/afaed3eb5d4fde7be413596dba0f65345333620e))
* add new props to snippet ([b75e9df](https://github.com/memori-ai/memori-react/commit/b75e9df7b1f0c33b0d879a92e34ae30adb692780))
* add why this answer panel ([d525f17](https://github.com/memori-ai/memori-react/commit/d525f176d4cee1ed5aaecfd2994ed35704415f1e))


### Bug Fixes

* header position place name mobile ([69fe42f](https://github.com/memori-ai/memori-react/commit/69fe42f9d912748b95e1227c6ecf0c97ef67d192))


### Maintenance

* update api client ([b5020be](https://github.com/memori-ai/memori-react/commit/b5020be4633e7dc33eded5877315f3aa3d8aecb7))


### Changes

* parse questions in why this answers ([98eda36](https://github.com/memori-ai/memori-react/commit/98eda365c7c342ad5b3a7d570e43dde97c7d99d9))

## [6.3.1](https://github.com/memori-ai/memori-react/compare/v6.3.0...v6.3.1) (2024-04-22)


### Changes

* allow rgb bg in media images ([6800a61](https://github.com/memori-ai/memori-react/commit/6800a611eb8b0a66518cf7b68337671ef5ff648a))

## [6.3.0](https://github.com/memori-ai/memori-react/compare/v6.2.0...v6.3.0) (2024-04-17)


### Features

* allow null position as negation, dont display that as venue ([17cd359](https://github.com/memori-ai/memori-react/commit/17cd35929d8a89433f12d29ddf712a86a7f1572c))
* save position to localStorage ([4dd10dc](https://github.com/memori-ai/memori-react/commit/4dd10dc3223e0c1b2a3e9a6ee32a88ca7e7d30b5))


### Bug Fixes

* position drawer rendering ([02766ac](https://github.com/memori-ai/memori-react/commit/02766ac57a139c67d202a79f77a5f55946cce293))
* sending position event, cleanup ([79be3bf](https://github.com/memori-ai/memori-react/commit/79be3bff3705d570e8d728af21ab7674888dbc31))


### Maintenance

* transform default context vars uppercase ([7627eb1](https://github.com/memori-ai/memori-react/commit/7627eb1290182b8245e093b9a01d628257729b5b))


### Changes

* add helper description for position request ([f08c2a7](https://github.com/memori-ai/memori-react/commit/f08c2a7691bb9f25ac92f961e636d929432abefa))
* cleanup ([77f2e2b](https://github.com/memori-ai/memori-react/commit/77f2e2be28577c81469c69cc24a9ed3e872fea31))
* position drawer + start icons, styles, formatting and overflow in header ([db5993d](https://github.com/memori-ai/memori-react/commit/db5993db77c771d156cc7f78d7dd7af75acfb44d))

## [6.2.0](https://github.com/memori-ai/memori-react/compare/v6.1.7...v6.2.0) (2024-04-16)


### Features

* add position drawer + dates and position events in widget ([da48175](https://github.com/memori-ai/memori-react/commit/da48175792260f11a17eaee2bf926a9fd3657254))
* add venue widget ([843c96e](https://github.com/memori-ai/memori-react/commit/843c96eba631d69bb98c93b4a2d4eaa0028e7414))


### Bug Fixes

* async events for dates, updating and hints conflicts ([9d81255](https://github.com/memori-ai/memori-react/commit/9d81255f4f362e07a1f3eb10406f1824a93c5fab))


### Maintenance

* add newline handling in messages after marked parsing ([2031fd6](https://github.com/memori-ai/memori-react/commit/2031fd6e5cdeb7d58d53e7cd834e12ec2926b157))
* add newline handling in messages after marked parsing ([4e49005](https://github.com/memori-ai/memori-react/commit/4e49005592767be3765e21b14b5d43d4d95399a6))
* update api client ([562610c](https://github.com/memori-ai/memori-react/commit/562610c9ae13cbc2a7c3b637f6ba6a942b4a45fd))

## [6.1.7](https://github.com/memori-ai/memori-react/compare/v6.1.6...v6.1.7) (2024-04-09)


### Bug Fixes

* chat bubble content text size ([b781eb4](https://github.com/memori-ai/memori-react/commit/b781eb4c3e219292ef475adca680b2fb5b9201f4))

## [6.1.6](https://github.com/memori-ai/memori-react/compare/v6.1.5...v6.1.6) (2024-04-02)


### Bug Fixes

* disabled signup margins ([6abe01d](https://github.com/memori-ai/memori-react/commit/6abe01d4577b4ec849442d59bd884e9d8eb2b152))

## [6.1.5](https://github.com/memori-ai/memori-react/compare/v6.1.4...v6.1.5) (2024-03-29)


### Bug Fixes

* mobile layout fixes + chat layout enhancements ([1bdb6c3](https://github.com/memori-ai/memori-react/commit/1bdb6c3ce337e1fadb9dffb1a473e2575cd6097e))


### Maintenance

* update api client ([56f3f4c](https://github.com/memori-ai/memori-react/commit/56f3f4c65a83dc29d01e93842a3e655af88c51b4))

## [6.1.4](https://github.com/memori-ai/memori-react/compare/v6.1.3...v6.1.4) (2024-03-28)


### Bug Fixes

* drawer mobile width ([0973105](https://github.com/memori-ai/memori-react/commit/0973105012e00f3acff89d07d3c4660e9af4554b))

## [6.1.3](https://github.com/memori-ai/memori-react/compare/v6.1.2...v6.1.3) (2024-03-25)


### Bug Fixes

* apply integration css vars customizations to modals and drawers ([3ce73b2](https://github.com/memori-ai/memori-react/commit/3ce73b29208df84f124de5df4c58a147309295ff))
* settings drawer css enhancements ([dc95406](https://github.com/memori-ai/memori-react/commit/dc95406cc60dffba386d032d2ce6cab5efa3f220))


### Maintenance

* update api client ([4efa1b2](https://github.com/memori-ai/memori-react/commit/4efa1b2b21c63e730ccbb71d7522809c09cddfa2))

## [6.1.2](https://github.com/memori-ai/memori-react/compare/v6.1.1...v6.1.2) (2024-03-19)


### Changes

* use adminEmail to request access if signup disabled ([22f7e47](https://github.com/memori-ai/memori-react/commit/22f7e47effc43295e97083f8f61cfb58fa1d4ed0))

## [6.1.1](https://github.com/memori-ai/memori-react/compare/v6.1.0...v6.1.1) (2024-03-19)


### Bug Fixes

* ensure login token in opening session ([9da5fd0](https://github.com/memori-ai/memori-react/commit/9da5fd02272e38c146bfcb184e7e152c0aeb36bf))


### Changes

* show login default if deep thought enabled ([0580201](https://github.com/memori-ai/memori-react/commit/0580201194088b8bfa39ef07fb7de3651964c310))


### Maintenance

* update error codes and translations ([c408242](https://github.com/memori-ai/memori-react/commit/c408242957dca7bc498976b508166591454088e0))

## [6.1.0](https://github.com/memori-ai/memori-react/compare/v6.0.0...v6.1.0) (2024-03-15)


### Changes

* change theme font following new brand book ([31677bc](https://github.com/memori-ai/memori-react/commit/31677bc6eb9d026f1b563b47b418e771d86fb8e9))


### Maintenance

* add configuration entry for login token ([2891c5e](https://github.com/memori-ai/memori-react/commit/2891c5e181b133cbdd96443456b0617b9b551cf8))
* wrap localstorage access in try/catch to prevent errors in storybook ([b676cac](https://github.com/memori-ai/memori-react/commit/b676cac1fc4dc4e84c577cef8bbf286bdd9c64ef))

## [6.0.0](https://github.com/memori-ai/memori-react/compare/v6.0.0-rc.3...v6.0.0) (2024-03-15)

## [6.0.0-rc.3](https://github.com/memori-ai/memori-react/compare/v6.0.0-rc.2...v6.0.0-rc.3) (2024-03-15)


### Maintenance

* add removeLocalConfig helper, fix undefined error ([5ed27f9](https://github.com/memori-ai/memori-react/commit/5ed27f92c977f1f66970a2d213c1cc8db5391f15))

## [6.0.0-rc.2](https://github.com/memori-ai/memori-react/compare/v6.0.0-rc.1...v6.0.0-rc.2) (2024-03-15)


### Changes

* start panel deep thought disclaimer selector + login button padding ([c6e7e5c](https://github.com/memori-ai/memori-react/commit/c6e7e5cefa66f3fb2172d4c1e7cde3c488726ec2))

## [6.0.0-rc.1](https://github.com/memori-ai/memori-react/compare/v6.0.0-rc.0...v6.0.0-rc.1) (2024-03-14)


### Bug Fixes

* logged in state checks ([6e20c90](https://github.com/memori-ai/memori-react/commit/6e20c904a16ed60fcacc5d5ba07f6156a40b3d85))

## [6.0.0-rc.0](https://github.com/memori-ai/memori-react/compare/v5.1.0...v6.0.0-rc.0) (2024-03-14)


### Features

* add login ([cc8b88d](https://github.com/memori-ai/memori-react/commit/cc8b88d3f7a84c12c48eb45590f46f51314e15c8))
* preserve login token ([2765ec5](https://github.com/memori-ai/memori-react/commit/2765ec5f0d3b18ec9935847f3bb6147fd2cfcfa9))

## [5.1.0](https://github.com/memori-ai/memori-react/compare/v5.0.2...v5.1.0) (2024-03-11)


### Features

* new prop default speaker active ([f854573](https://github.com/memori-ai/memori-react/commit/f8545737a47c4fdcaf1febf52a5d32f88e49b9bb))

## [5.0.2](https://github.com/memori-ai/memori-react/compare/v5.0.1...v5.0.2) (2024-03-06)


### Maintenance

* powered by memori.ai with analytics params ([dda9e57](https://github.com/memori-ai/memori-react/commit/dda9e57d14339c86bec6ae915191159b3074171b))

## [5.0.1](https://github.com/memori-ai/memori-react/compare/v5.0.0...v5.0.1) (2024-03-06)


### Maintenance

* powered by memori.ai ([562d96b](https://github.com/memori-ai/memori-react/commit/562d96b75d0c6bab4515d3b8138292450b02c2a1))

## [5.0.0](https://github.com/memori-ai/memori-react/compare/v4.4.1...v5.0.0) (2024-02-16)


### ⚠ BREAKING CHANGES

* rename usage of twincreator in aisuru

### Features

* add deep thought disclaimers with new flags ([42d6f12](https://github.com/memori-ai/memori-react/commit/42d6f12a81e1e263c6d62dcace3c1e88f3371343))


### Bug Fixes

* remove hide emissions handling from website assistant ([95b1c36](https://github.com/memori-ai/memori-react/commit/95b1c36c04865aa4c1a84a3d2e98a56e5e327c18))


### Maintenance

* rename usage of twincreator in aisuru ([6a7778d](https://github.com/memori-ai/memori-react/commit/6a7778ddca1c9075478b96bb8b79ac8e0514d30f))
* rename usage of twincreator in aisuru, update powered by ([20094db](https://github.com/memori-ai/memori-react/commit/20094dbeecd08ed1161c06c166ab3bb9f3fcaa39))
* update api client ([b606f45](https://github.com/memori-ai/memori-react/commit/b606f45f465f358c5d1fea97366db477e7dd6ac3))
* update api client ([ab6eb01](https://github.com/memori-ai/memori-react/commit/ab6eb016e50143f7002542730cf7de2f34aebe81))
* update mocks ([13dd147](https://github.com/memori-ai/memori-react/commit/13dd147799a4462a7f97debdd3a5d507553243d1))

## [4.4.1](https://github.com/memori-ai/memori-react/compare/v4.4.0...v4.4.1) (2024-02-06)


### Bug Fixes

* deep tought disclaimer title color ([d3fb917](https://github.com/memori-ai/memori-react/commit/d3fb917f461e96cc59cec821c23a6295bea088e7))


### Changes

* boe loading indicator with initial delay, smaller font ([94929a4](https://github.com/memori-ai/memori-react/commit/94929a489138f1257b170e523a22465db966c7fa))


### Maintenance

* enhance uilang typings ([7b94bcf](https://github.com/memori-ai/memori-react/commit/7b94bcf8d0e34c034ee386386ed51fc74f68ba0f))
* prepare for dynamic voice for boe ([bf04616](https://github.com/memori-ai/memori-react/commit/bf0461603b340d9bbe12137e58f7532be12ee47d))

## [4.4.0](https://github.com/memori-ai/memori-react/compare/v4.3.1...v4.4.0) (2024-01-30)


### Features

* add typing sentences list, add BoE loading sentences ([aa7e743](https://github.com/memori-ai/memori-react/commit/aa7e743408c1d50b4ba94c774935cad150095057))

## [4.3.1](https://github.com/memori-ai/memori-react/compare/v4.3.0...v4.3.1) (2024-01-26)


### Bug Fixes

* known facts pagination ([4a17dc3](https://github.com/memori-ai/memori-react/commit/4a17dc3e0bb2db63dd3c794c02a381cde413c544))

## [4.3.0](https://github.com/memori-ai/memori-react/compare/v4.2.0...v4.3.0) (2024-01-15)


### Features

* add experts drawer in widget for board of experts ([2725e13](https://github.com/memori-ai/memori-react/commit/2725e1340010b816b01b9ac5ed7722d43b10af19))

## [4.2.0](https://github.com/memori-ai/memori-react/compare/v4.1.1...v4.2.0) (2024-01-05)


### Features

* add known facts drawer ui ([02180ea](https://github.com/memori-ai/memori-react/commit/02180ea2e0dd047f0db8555abe2c217125ffff20))
* checkbox indeterminate state ([e60a9c1](https://github.com/memori-ai/memori-react/commit/e60a9c1636ce044b3418ff3b8fdc668d61870654))
* use known facts ui, add action in header, add deep thought disclaimer ([b516184](https://github.com/memori-ai/memori-react/commit/b5161848f3f2f6308139ed7a5a7b9bd4104b4df5))


### Changes

* fix button danger, minor ui improvements ([e924b47](https://github.com/memori-ai/memori-react/commit/e924b47cb97f5bb9c8e22b6b79377c08a9e322bc))


### Maintenance

* add new chevron icons ([2cbcf7d](https://github.com/memori-ai/memori-react/commit/2cbcf7d72eccc646e7c6b90b15bc708798ce72ce))
* fix lint warning ([cdaf407](https://github.com/memori-ai/memori-react/commit/cdaf407825f7dc1f17ff5314f1f7920211ba83ec))
* update api client ([e4c9526](https://github.com/memori-ai/memori-react/commit/e4c952653b379076109bd7db89292d5f55d34125))

## [4.1.1](https://github.com/memori-ai/memori-react/compare/v4.1.0...v4.1.1) (2023-12-22)


### Changes

* add loading state while submitting birth date ([8c082ee](https://github.com/memori-ai/memori-react/commit/8c082eee1bdda0163eaadb4c9056fdb84d81c74a))

## [4.1.0](https://github.com/memori-ai/memori-react/compare/v4.0.1...v4.1.0) (2023-12-18)


### Features

* add deep thought disclaimer and indicators ([551ad43](https://github.com/memori-ai/memori-react/commit/551ad43086ded19653ebf0cc1b103e6b3df0e6f4))


### Bug Fixes

* fix get tenant origin url ([a44a470](https://github.com/memori-ai/memori-react/commit/a44a4705f746d8efd5a3132279bbc0957446487b))


### Maintenance

* add deepthought icon ([59292cf](https://github.com/memori-ai/memori-react/commit/59292cfe8ea624b2ed2262eb043d2c15789d9529))
* cleanup ([91be6f7](https://github.com/memori-ai/memori-react/commit/91be6f7998738a3e57560a521a5bf93737339196))
* upgrade microsoft speech sdk ([02214d6](https://github.com/memori-ai/memori-react/commit/02214d652eeb270b8aa7817406bebf728b693c5c))

## [4.0.1](https://github.com/memori-ai/memori-react/compare/v4.0.0...v4.0.1) (2023-12-14)


### Bug Fixes

* markdown parsing with translated text if present ([c1006da](https://github.com/memori-ai/memori-react/commit/c1006da73daf2b00bc8ebb4f9e9dde37920eca9a))

## [4.0.0](https://github.com/memori-ai/memori-react/compare/v3.0.2...v4.0.0) (2023-12-14)


### ⚠ BREAKING CHANGES

* remove antd and related, momentjs + cleanup to make pkg lighter

### Features

* add markdown parsing in messages ([f1064aa](https://github.com/memori-ai/memori-react/commit/f1064aa9589413b0c169b4e6bc079f0c534f10c1))


### Changes

* remove antd and related packages ([d8d85c6](https://github.com/memori-ai/memori-react/commit/d8d85c69269469abcd2d825ea5361cb897be1d05))
* remove antd and related, momentjs + cleanup to make pkg lighter ([4ab5093](https://github.com/memori-ai/memori-react/commit/4ab5093855543f2eca2799f1c355071be68050fe))
* switch to luxon instead of moment ([3f7da0c](https://github.com/memori-ai/memori-react/commit/3f7da0c5f1e37db435f89fde88517236a1946edd))


### Maintenance

* add i18n wrapper to layout stories ([87694f1](https://github.com/memori-ai/memori-react/commit/87694f10f83f1077fda9b9616daa426d7762177f))
* cleanup jest config ([b1a593d](https://github.com/memori-ai/memori-react/commit/b1a593d7aa38e5f7576eebfebf8151f8d3fbf8cb))
* restore needed jest config ([9e9c3f4](https://github.com/memori-ai/memori-react/commit/9e9c3f4a058b6061a276b5cc6d67f19ef8f5d97c))
* update example ([3f20f67](https://github.com/memori-ai/memori-react/commit/3f20f678c6362e32db1b928a6e87edf7b808cfed))

## [3.0.2](https://github.com/memori-ai/memori-react/compare/v3.0.1...v3.0.2) (2023-12-11)


### Bug Fixes

* header z-index ([7d0cbb1](https://github.com/memori-ai/memori-react/commit/7d0cbb1ef6ca84770ce40082f64a68a34e4f32f0))

## [3.0.1](https://github.com/memori-ai/memori-react/compare/v3.0.0...v3.0.1) (2023-12-11)


### Bug Fixes

* board of expert twin avatar fallback ([32ca5f3](https://github.com/memori-ai/memori-react/commit/32ca5f3750f4d12ac9af616961436453a6f8cbe8))


### Maintenance

* update memori-api-client ([8472d3f](https://github.com/memori-ai/memori-react/commit/8472d3f862e6ba4a2a86f78cbaf8b9c35f5c7d37))

## [3.0.0](https://github.com/memori-ai/memori-react/compare/v3.0.0-rc.0...v3.0.0) (2023-12-11)

## [3.0.0-rc.0](https://github.com/memori-ai/memori-react/compare/v2.23.0...v3.0.0-rc.0) (2023-12-11)


### ⚠ BREAKING CHANGES

* use i18next with local provider as lib

### Changes

* use i18next with local provider as lib ([d7a192c](https://github.com/memori-ai/memori-react/commit/d7a192cb6ed04d0a901748b812e8099821fc0712))

## [2.23.0](https://github.com/memori-ai/memori-react/compare/v2.22.0...v2.23.0) (2023-12-08)


### Features

* add boe indicators, chat avatar with emitters ([9c1f162](https://github.com/memori-ai/memori-react/commit/9c1f16207b8accfe6f109387912a3428ca577bf3))

## [2.22.0](https://github.com/memori-ai/memori-react/compare/v2.21.0...v2.22.0) (2023-12-06)


### Features

* fix loading animations, united in one glb ([e56fbd3](https://github.com/memori-ai/memori-react/commit/e56fbd33e8614f9f74d2d8f2462af454213e40f4))

## [2.21.0](https://github.com/memori-ai/memori-react/compare/v2.20.2...v2.21.0) (2023-12-05)


### Features

* share qr code with tenant logo, retrieve tenant data and config from api ([42cf28f](https://github.com/memori-ai/memori-react/commit/42cf28f4befa30c3d0079ce8e4725f94965a55de))

## [2.20.2](https://github.com/memori-ai/memori-react/compare/v2.20.1...v2.20.2) (2023-12-05)


### Bug Fixes

* temporarily disable fullbody avatar loading anim, update anim assets url ([56e5dbb](https://github.com/memori-ai/memori-react/commit/56e5dbb08416193607cdd916eba39d251165a86c))


### Maintenance

* update stories and example tenants ([bae67a0](https://github.com/memori-ai/memori-react/commit/bae67a0c15ebf03113f9ea2806123ea6965c65a7))

## [2.20.1](https://github.com/memori-ai/memori-react/compare/v2.20.0...v2.20.1) (2023-11-24)


### Bug Fixes

* cleanup ui on mobile textarea focus ([778934d](https://github.com/memori-ai/memori-react/commit/778934df1fb27c7c78de2e35e81c72e57f7e8a5f))

## [2.20.0](https://github.com/memori-ai/memori-react/compare/v2.19.2...v2.20.0) (2023-11-22)


### Features

* show completion provider status if down ([d5f31fb](https://github.com/memori-ai/memori-react/commit/d5f31fbc9b5d8408f8a61f99ed96eca599618a1e))


### Changes

* provide any way to pass login token to session ([c7adf7c](https://github.com/memori-ai/memori-react/commit/c7adf7c6e832ac95ae7808a2f6b532204bc5c80d))

## [2.19.2](https://github.com/memori-ai/memori-react/compare/v2.19.1...v2.19.2) (2023-11-15)


### Bug Fixes

* language selector bg and color on windows ([94598f7](https://github.com/memori-ai/memori-react/commit/94598f7ed0e949926fcaba21d463f909b29eb5c7))

## [2.19.1](https://github.com/memori-ai/memori-react/compare/v2.19.0...v2.19.1) (2023-11-15)


### Bug Fixes

* personification in open session from pwd required state ([dc47a6a](https://github.com/memori-ai/memori-react/commit/dc47a6a3c835bb02e80022fc1dda8cfdb0754da9))

## [2.19.0](https://github.com/memori-ai/memori-react/compare/v2.18.9...v2.19.0) (2023-11-13)


### Features

* add user avatar ([36abed9](https://github.com/memori-ai/memori-react/commit/36abed9ce77badb7bda715eee973fbb1e3d4ce25))

## [2.18.9](https://github.com/memori-ai/memori-react/compare/v2.18.8...v2.18.9) (2023-10-19)


### Bug Fixes

* ios safari speech bug ([c9bf892](https://github.com/memori-ai/memori-react/commit/c9bf89232218121759bec24b370a553e9bd4ffa5))
* ios safari typeMessage events, cleanup ([f7d4d4d](https://github.com/memori-ai/memori-react/commit/f7d4d4de0beee37dfde4287e27591783aaec7b65))


### Maintenance

* enhance minAge check with fallback ([c03cef3](https://github.com/memori-ai/memori-react/commit/c03cef3956c0ccf0f57a77807659496f8f417dd5))

## [2.18.8](https://github.com/memori-ai/memori-react/compare/v2.18.7...v2.18.8) (2023-10-04)


### Bug Fixes

* update proptypes and widget props to pass down ([b47323b](https://github.com/memori-ai/memori-react/commit/b47323b64add4dbea632d053daa2be234d299630))

## [2.18.7](https://github.com/memori-ai/memori-react/compare/v2.18.6...v2.18.7) (2023-10-04)


### Maintenance

* update proptypes ([cb8e358](https://github.com/memori-ai/memori-react/commit/cb8e3586d4db87914b12bae11c838c4233c4d4b1))

## [2.18.6](https://github.com/memori-ai/memori-react/compare/v2.18.5...v2.18.6) (2023-09-28)


### Changes

* stop audio closing webassistant panel ([5943302](https://github.com/memori-ai/memori-react/commit/594330238a583b7b37dfd3f16e1311b7bef0fd8a))

## [2.18.5](https://github.com/memori-ai/memori-react/compare/v2.18.4...v2.18.5) (2023-09-28)


### Bug Fixes

* style fixes ([8e4ccd1](https://github.com/memori-ai/memori-react/commit/8e4ccd1652ecd950cb8ec4f395c00e4fa63efbc5))


### Changes

* enhancements for website assistant layout ([b8de59b](https://github.com/memori-ai/memori-react/commit/b8de59b641040fca7cfbf78bdfc18863e00edebb))
* ui enhancements for website assistant layout ([585920e](https://github.com/memori-ai/memori-react/commit/585920e7dea4baac51e28d9020e274137c3229a8))

## [2.18.4](https://github.com/memori-ai/memori-react/compare/v2.18.3...v2.18.4) (2023-09-26)


### Features

* add default context vars with pathname and route ([4c6ae03](https://github.com/memori-ai/memori-react/commit/4c6ae03459b4114b89eb4937978853771e7238ff))


### Maintenance

* add finnish lang ([36f7c14](https://github.com/memori-ai/memori-react/commit/36f7c14e82c51881e43956d99ab427d8f2220921))

## [2.18.3](https://github.com/memori-ai/memori-react/compare/v2.18.2...v2.18.3) (2023-09-26)


### Changes

* remove old scroll method ([aadc51d](https://github.com/memori-ai/memori-react/commit/aadc51de83cc86cd4073d1a3da6435aae4c7dffc))


### Maintenance

* fix linter warning ([2f51269](https://github.com/memori-ai/memori-react/commit/2f512698257d9858e82c31d324bf926338875c62))

## [2.18.2](https://github.com/memori-ai/memori-react/compare/v2.18.1...v2.18.2) (2023-09-25)


### Bug Fixes

* animate mouth speaking if speaking and not speaker not muted ([565a543](https://github.com/memori-ai/memori-react/commit/565a543ec51094c4e206caf50c0cff32ab11fdb3))

## [2.18.1](https://github.com/memori-ai/memori-react/compare/v2.18.0...v2.18.1) (2023-09-22)


### Changes

* do not apply global styles for website assistant layout ([a7274db](https://github.com/memori-ai/memori-react/commit/a7274dbd20aee83a2731933be1c4d64c26d44848))

## [2.18.0](https://github.com/memori-ai/memori-react/compare/v2.17.1...v2.18.0) (2023-09-21)


### Features

* add showClear button + showOnlyLastMessages props ([6bd2b18](https://github.com/memori-ai/memori-react/commit/6bd2b181c98893e35831a77b3ce19d04c9681fd9))


### Bug Fixes

* lint css order issue ([e98faf2](https://github.com/memori-ai/memori-react/commit/e98faf23a504e736ac814c4b81b26c9c027a2234))
* website assistant trigger button touch action ([5101bbb](https://github.com/memori-ai/memori-react/commit/5101bbbd2829d0aafd411384210eb0268d8edfd1))


### Changes

* adapt website assistant layout avatar css ([5236a55](https://github.com/memori-ai/memori-react/commit/5236a551b59dfa1803316b24d9de72d90009e567))
* adapt website assistant layout avatar css ([f8b824d](https://github.com/memori-ai/memori-react/commit/f8b824da89754d92c0576101b33f53dd90430f40))
* add avatar type classes + adapt website assistant layout avatar css ([730dd16](https://github.com/memori-ai/memori-react/commit/730dd16d73429ded46f09e683eae63c8b7c97682))
* webassistant layout chat bubbles opacity on hover ([03c7bb4](https://github.com/memori-ai/memori-react/commit/03c7bb4126a444853d949c40bd32ccd65dbb0ff5))
* website assistant layout show only 2 messages as totem ([efdb8a8](https://github.com/memori-ai/memori-react/commit/efdb8a831023a21cf39896aead7b8d59faa2bc71))

## [2.17.1](https://github.com/memori-ai/memori-react/compare/v2.17.0...v2.17.1) (2023-09-21)


### Bug Fixes

* website assistant layout css ([4088a8a](https://github.com/memori-ai/memori-react/commit/4088a8a9280efe708703b3cb6bf5e27717821daf))


### Changes

* disable outer scroll on website assistant layout ([939d46b](https://github.com/memori-ai/memori-react/commit/939d46be63565342e4826ec937ef0a5fdb2f560f))

## [2.17.0](https://github.com/memori-ai/memori-react/compare/v2.16.1...v2.17.0) (2023-09-20)


### Features

* add new layout WEBSITE_ASSISTANT ([298a52a](https://github.com/memori-ai/memori-react/commit/298a52a1c32e0df6781ea0288dffa40805e9193f))


### Bug Fixes

* mobile styles for webassistant layout ([587d222](https://github.com/memori-ai/memori-react/commit/587d2221dd5b6d56407b3534a8527af268b84dd5))
* mobile styles for webassistant layout ([cfd2086](https://github.com/memori-ai/memori-react/commit/cfd2086677aec12840d1307b01dbbae6c3ac5ab0))


### Changes

* add avatar pic in website-assistant blob ([19fea88](https://github.com/memori-ai/memori-react/commit/19fea88271382728fe28eeee041863e0d66a94f0))

## [2.16.1](https://github.com/memori-ai/memori-react/compare/v2.16.0...v2.16.1) (2023-09-15)


### Bug Fixes

* bug was causing session errors loops for 403 ([ec8ff79](https://github.com/memori-ai/memori-react/commit/ec8ff790e670ca2b5cfe65053ad43ad7328bbc4c))

## [2.16.0](https://github.com/memori-ai/memori-react/compare/v2.15.1...v2.16.0) (2023-09-11)


### Features

* add MemoriResetUIEffects event listener, reset ui timeout + speech ([ce55826](https://github.com/memori-ai/memori-react/commit/ce558260428c9b1e17f2625c64dceb6be38286bf))

## [2.15.1](https://github.com/memori-ai/memori-react/compare/v2.15.0...v2.15.1) (2023-09-03)


### Bug Fixes

* stop audio and ui timeout when unmounting ([e53df8e](https://github.com/memori-ai/memori-react/commit/e53df8ead2207428b81b600552a41a4154156e24))

## [2.15.0](https://github.com/memori-ai/memori-react/compare/v2.14.0...v2.15.0) (2023-09-01)


### Features

* add new param to typeMessage, add typeBatchMessages ([1e7960b](https://github.com/memori-ai/memori-react/commit/1e7960b040e25b54c4c2c1c08a96cf9c7f9e6c05))


### Bug Fixes

* typing updates and fixes ([79f9d1f](https://github.com/memori-ai/memori-react/commit/79f9d1f208a154d85b45789644ac5de360cdd782))


### Maintenance

* upgrade storybook ([4cc9db3](https://github.com/memori-ai/memori-react/commit/4cc9db306ad48a42f0fa081fb487ae716c9c8ff9))

## [2.14.0](https://github.com/memori-ai/memori-react/compare/v2.13.1...v2.14.0) (2023-08-31)


### Features

* add MemoriEndSpeak event emission ([f659e13](https://github.com/memori-ai/memori-react/commit/f659e13ee087aecf84fb5098ff30f57c75b3775e))


### Changes

* change textarea disabled states ([0a64fd7](https://github.com/memori-ai/memori-react/commit/0a64fd7fd2723c7b4263fd42b88e676d2390074e))
* mobile msg text smaller ([7618026](https://github.com/memori-ai/memori-react/commit/7618026f18e6da2286dd1d06df0f20142356b400))

## [2.13.1](https://github.com/memori-ai/memori-react/compare/v2.13.0...v2.13.1) (2023-08-29)


### Bug Fixes

* automatically send msg only if listening ([c7fb638](https://github.com/memori-ai/memori-react/commit/c7fb638131774db0e0f00f7b6c61287a9881f0d2))


### Maintenance

* lower snippet timeout ([e265657](https://github.com/memori-ai/memori-react/commit/e26565709e225e0476a1ced3a1dd8e6f199c3301))

## [2.13.0](https://github.com/memori-ai/memori-react/compare/v2.12.0...v2.13.0) (2023-08-28)


### Features

* change typing with custom sentence, defaults with none, adds params to typeMessage ([4e18989](https://github.com/memori-ai/memori-react/commit/4e18989253421ea0c32fb617f7b9f1b90db6da18))


### Maintenance

* update storybook ([3e248a0](https://github.com/memori-ai/memori-react/commit/3e248a0e1aee20d8815cf1078a201f2302428921))


### Changes

* replace additionalInfo email + userID with loginToken ([b323f04](https://github.com/memori-ai/memori-react/commit/b323f04503b7fc583103b89243fb37389aed4062))
* typing as separate component, add text anim ([02e027e](https://github.com/memori-ai/memori-react/commit/02e027ec7f19c3d08afe3ba2c119e25fc3742e70))

## [2.12.0](https://github.com/memori-ai/memori-react/compare/v2.11.0...v2.12.0) (2023-08-21)


### ⚠ BREAKING CHANGES

* memoize container components, move snippet exec to main running once on state change

### Changes

* memoize container components, move snippet exec to main running once on state change ([869f058](https://github.com/memori-ai/memori-react/commit/869f0588d266b5be92e06a25829b63c2314290b8))

## [2.11.0](https://github.com/memori-ai/memori-react/compare/v2.10.2...v2.11.0) (2023-08-14)


### Features

* add active session css class ([f161d23](https://github.com/memori-ai/memori-react/commit/f161d23155f509e1243adf1528b1376e1822836f))


### Changes

* mic button larger on any layout ([baff50e](https://github.com/memori-ai/memori-react/commit/baff50edfb3cca372907052d3520a478af6378a1))

## [2.10.2](https://github.com/memori-ai/memori-react/compare/v2.10.1...v2.10.2) (2023-08-14)


### Bug Fixes

* speech async handling, avoids double voice ([ee6e45a](https://github.com/memori-ai/memori-react/commit/ee6e45a98a948a4cc5055b84243353e0b865d2b4))


### Maintenance

* restore new session mark ([883567d](https://github.com/memori-ai/memori-react/commit/883567d4ce1f2bbcea0b435c6f0788f3a742c37d))

## [2.10.1](https://github.com/memori-ai/memori-react/compare/v2.10.0...v2.10.1) (2023-08-10)


### Bug Fixes

* remove emojis from spoken text ([92e2cb6](https://github.com/memori-ai/memori-react/commit/92e2cb6e5a90b228c091a41afb7b202938c03ad8))


### Changes

* add waitForPrevious param to typeMessage ([6aae935](https://github.com/memori-ai/memori-react/commit/6aae935188abc388aee29dc1ef631819d73fbd0e))

## [2.10.0](https://github.com/memori-ai/memori-react/compare/v2.9.2...v2.10.0) (2023-08-10)


### Features

* add typeMessage and typeMessageHidden as event-based functions ([f717fb7](https://github.com/memori-ai/memori-react/commit/f717fb7f44105cbb61a921695b01036925671bf9))
* typeMessage(hidden) awaits previous emission to be read before submitting ([85ac7ae](https://github.com/memori-ai/memori-react/commit/85ac7ae72dcc3cf8e759a25b5df017d361e47355))


### Changes

* cleanup typeMessage and typeMessageHidden ([0eff5fc](https://github.com/memori-ai/memori-react/commit/0eff5fc0b1033ff9c67e864bdcf8fed735a0a931))
* start button test speakers on try catch ([9337764](https://github.com/memori-ai/memori-react/commit/93377648937e0e21b19b8ac50d87062955d7c899))

## [2.9.2](https://github.com/memori-ai/memori-react/compare/v2.9.1...v2.9.2) (2023-08-03)


### Changes

* add specific css classes to header buttons ([c57f123](https://github.com/memori-ai/memori-react/commit/c57f123948c3b6de9cf1f40e4558aeae224682c2))

## [2.9.1](https://github.com/memori-ai/memori-react/compare/v2.9.0...v2.9.1) (2023-08-03)


### Bug Fixes

* pass settings drawer additionalSettings in widget ([67ec2de](https://github.com/memori-ai/memori-react/commit/67ec2de0f587d9ccce3282dd4a51155dfdc394ff))

## [2.9.0](https://github.com/memori-ai/memori-react/compare/v2.8.3...v2.9.0) (2023-08-02)


### Features

* add additionalSettings ([8eac525](https://github.com/memori-ai/memori-react/commit/8eac52513eb260b91611941c7c615e44349fa495))


### Bug Fixes

* enforce loading text alignment ([2b513fd](https://github.com/memori-ai/memori-react/commit/2b513fd47fcedb2e8b9fdb2131056ddedff51ca0))

## [2.8.3](https://github.com/memori-ai/memori-react/compare/v2.8.2...v2.8.3) (2023-07-31)


### Bug Fixes

* do not send timeout event if waiting for memori response ([c6ad751](https://github.com/memori-ai/memori-react/commit/c6ad751448a4e8e853a48731144e3550c1203bd7))

## [2.8.2](https://github.com/memori-ai/memori-react/compare/v2.8.1...v2.8.2) (2023-07-28)


### Changes

* re-add polish voices, fix additionalInfo lang codes ([3151f3d](https://github.com/memori-ai/memori-react/commit/3151f3de5879fa30142c475c6220ac0192c1225e))

## [2.8.1](https://github.com/memori-ai/memori-react/compare/v2.8.0...v2.8.1) (2023-07-28)


### Bug Fixes

* enhancements to speak func, add polish voices ([8356152](https://github.com/memori-ai/memori-react/commit/8356152d4269a4625e87f37ee423352b3bae3ac1))

## [2.8.0](https://github.com/memori-ai/memori-react/compare/v2.7.2...v2.8.0) (2023-07-21)


### Features

* add customMediaRenderer prop ([ae66ae9](https://github.com/memori-ai/memori-react/commit/ae66ae9f0076e3e9954d27256a2a0f36c80177dc))

## [2.7.2](https://github.com/memori-ai/memori-react/compare/v2.7.1...v2.7.2) (2023-07-20)


### Bug Fixes

* use native select for lang selector in start panel ([24f567d](https://github.com/memori-ai/memori-react/commit/24f567dd111c0068c9717a3cfe7552162db3ba4d))

## [2.7.1](https://github.com/memori-ai/memori-react/compare/v2.7.0...v2.7.1) (2023-07-19)


### Bug Fixes

* userlang initial message translation ([7f79906](https://github.com/memori-ai/memori-react/commit/7f79906a99cee9949a4033f906d8675ab5ef3035))

## [2.7.0](https://github.com/memori-ai/memori-react/compare/v2.6.6...v2.7.0) (2023-07-17)


### Features

* new additionalInfo on OpenSession params ([93f7e0e](https://github.com/memori-ai/memori-react/commit/93f7e0e7389a5a73950f1ccc9c85584092efd301))


### Bug Fixes

* **i18n:** auth modal title ([2b02247](https://github.com/memori-ai/memori-react/commit/2b0224773b0fc77c51ab2c40ad20260f9d08e805))


### Maintenance

* update api client ([fe6b549](https://github.com/memori-ai/memori-react/commit/fe6b549eadcba4f245e93550802d4114db1da4cf))

## [2.6.6](https://github.com/memori-ai/memori-react/compare/v2.6.5...v2.6.6) (2023-07-14)


### Bug Fixes

* age verification modal zindex ([3ce6ec7](https://github.com/memori-ai/memori-react/commit/3ce6ec76aa347d2b015addee51fb8396b22c1a40))
* muted speaker on welcome message coherently ([43129c6](https://github.com/memori-ai/memori-react/commit/43129c6badd7486c3e25a8c99cc83ddfa357730a))

## [2.6.5](https://github.com/memori-ai/memori-react/compare/v2.6.4...v2.6.5) (2023-07-14)


### Bug Fixes

* init session state between auth and age verification flows ([2acab69](https://github.com/memori-ai/memori-react/commit/2acab69640c0fb3509663feaddc7c3e96113a01f))

## [2.6.4](https://github.com/memori-ai/memori-react/compare/v2.6.3...v2.6.4) (2023-07-12)


### Bug Fixes

* media url with external links, add tests for helpers ([1e4244b](https://github.com/memori-ai/memori-react/commit/1e4244b2da8f44e10168c14f2caaea919990624c))


### Maintenance

* run prettier ([575bf83](https://github.com/memori-ai/memori-react/commit/575bf838ec5beba0a738441b96225c453dae8b6f))

## [2.6.3](https://github.com/memori-ai/memori-react/compare/v2.6.2...v2.6.3) (2023-07-07)


### Bug Fixes

* use spotlight for ios environment light ([4191975](https://github.com/memori-ai/memori-react/commit/4191975f2917773b7316a45789e03af32d86b98a))

## [2.6.2](https://github.com/memori-ai/memori-react/compare/v2.6.1...v2.6.2) (2023-06-30)


### Features

* add polish lang ([d50a62b](https://github.com/memori-ai/memori-react/commit/d50a62bbd829faca4e133be5ae11f7781c294cce))

## [2.6.1](https://github.com/memori-ai/memori-react/compare/v2.6.0...v2.6.1) (2023-06-23)


### Bug Fixes

* defaults for multilanguage prop ([33c956a](https://github.com/memori-ai/memori-react/commit/33c956a7b2871bfafdc3f46e3cec58d937c016f2))

## [2.6.0](https://github.com/memori-ai/memori-react/compare/v2.5.1...v2.6.0) (2023-06-20)


### Features

* load azure token from api ([9dc0116](https://github.com/memori-ai/memori-react/commit/9dc0116fe82bb133919b30fea00437ae672f91b6))

## [2.5.1](https://github.com/memori-ai/memori-react/compare/v2.5.0...v2.5.1) (2023-06-20)


### Bug Fixes

* select colors and font ([cf4e98a](https://github.com/memori-ai/memori-react/commit/cf4e98ad96770fbe5fa5404a6d751275a68e0a5d))

## [2.5.0](https://github.com/memori-ai/memori-react/compare/v2.4.2...v2.5.0) (2023-06-20)


### Features

* add multilingual as prop, showShare from config as fallback ([61c07ac](https://github.com/memori-ai/memori-react/commit/61c07ac81b7ed27726a380730e58377d3df036c1))


### Bug Fixes

* show more hints button bg and color ([74a451c](https://github.com/memori-ai/memori-react/commit/74a451ca3b4c929d8421d4a13dbbff6ec6b8b3a4))

## [2.4.2](https://github.com/memori-ai/memori-react/compare/v2.4.1...v2.4.2) (2023-06-20)


### Features

* add extension div in layouts ([cd9486a](https://github.com/memori-ai/memori-react/commit/cd9486aa8196d5dd76219a34d410529153c08c54))


### Bug Fixes

* select bg color ([929b151](https://github.com/memori-ai/memori-react/commit/929b1510eaac4ff060709cef938c391d56870486))
* set localconfig for mutespeaker ([f0c3c3d](https://github.com/memori-ai/memori-react/commit/f0c3c3dd004a3c948d1fc7a100659060a170ee1c))

## [2.4.1](https://github.com/memori-ai/memori-react/compare/v2.4.0...v2.4.1) (2023-06-19)


### Bug Fixes

* default spoken lang order, first is prop ([eadac28](https://github.com/memori-ai/memori-react/commit/eadac284d96f2f5d974967a178638b4314dac3be))

## [2.4.0](https://github.com/memori-ai/memori-react/compare/v2.3.1...v2.4.0) (2023-06-07)


### Changes

* chat layout with layout props ([eee4cf5](https://github.com/memori-ai/memori-react/commit/eee4cf5e893dd65e7b341516a0f2dcfb65519841))
* move everything as layout prop ([1c42027](https://github.com/memori-ai/memori-react/commit/1c42027083ba772b533c9d8035e599327fa19e6f))

## [2.3.1](https://github.com/memori-ai/memori-react/compare/v2.3.0...v2.3.1) (2023-06-07)


### Bug Fixes

* environment url from drei cdn ([773e0fe](https://github.com/memori-ai/memori-react/commit/773e0fedf2d300fd00cca4310a35dc24418bdfb1))

## [2.3.0](https://github.com/memori-ai/memori-react/compare/v2.2.2...v2.3.0) (2023-06-06)


### Features

* add chat layout ([70f00e7](https://github.com/memori-ai/memori-react/commit/70f00e77e3a5683ebc85fafc5b68d22b9c7bda27))


### Changes

* share button enforce normal font weight ([37c645c](https://github.com/memori-ai/memori-react/commit/37c645cae864c9f585339333de581969a5c570ad))

## [2.2.2](https://github.com/memori-ai/memori-react/compare/v2.2.1...v2.2.2) (2023-05-31)


### Bug Fixes

* aggregate whole trascript in usermessage after pause ([ddc800f](https://github.com/memori-ai/memori-react/commit/ddc800f65c46af42a1445f07e5d76cd149ed0090))
* close audio context only if not closed ([c1cd222](https://github.com/memori-ai/memori-react/commit/c1cd2226e6a9360e54c4d92aefcb7f8e27efcdb3))
* css vars declaration entrypoints ([1215ccb](https://github.com/memori-ai/memori-react/commit/1215ccbb45842da821a43b1a169954b04bf2660c))
* share qr button colors ([ae44e26](https://github.com/memori-ai/memori-react/commit/ae44e262addf3e531b43bd8d8fe382a16e5ae049))

## [2.2.1](https://github.com/memori-ai/memori-react/compare/v2.2.0...v2.2.1) (2023-05-29)


### Bug Fixes

* add webkit prefix for backdrop filter ([5c57636](https://github.com/memori-ai/memori-react/commit/5c57636166a21e29fc05e3b8d0f349ea5625c1bb))
* prevent vars not being loaded for portal roots with lt ([d11f9bc](https://github.com/memori-ai/memori-react/commit/d11f9bc08dc01b7a894bcef4e58cf7401ed2a425))
* show blob on mobile totem ([558aba3](https://github.com/memori-ai/memori-react/commit/558aba3cc3e7105e0b40a7be8664b999a9a55982))


### Maintenance

* run prettier formatting ([416ad37](https://github.com/memori-ai/memori-react/commit/416ad379a9db6f971a7ccdaa99e199b4ad56ffc1))


### Changes

* defaults for mobile totem dont show settings button ([619e773](https://github.com/memori-ai/memori-react/commit/619e773408608827f4649c68a23387dbe405eba2))
* defaults for mobile totem with controls on bottom + dont show send on enter menu ([a5a887c](https://github.com/memori-ai/memori-react/commit/a5a887cc1c092dbbcc1a87912df7f48435ca2351))

## [2.2.0](https://github.com/memori-ai/memori-react/compare/v2.1.0...v2.2.0) (2023-05-26)


### Features

* add hold to talk mic mode, set as default; improvements to tooltip ([2ed0949](https://github.com/memori-ai/memori-react/commit/2ed0949fb9d44fa2b5e8548c13c934e7a25fef33))


### Bug Fixes

* default spoken lang from integration config ([8078736](https://github.com/memori-ai/memori-react/commit/80787366843bb9d3ba438ab5c60fd6ba4c9484c9))


### Changes

* add 60s timeout if completions enabled ([97c770f](https://github.com/memori-ai/memori-react/commit/97c770f3b79b5b2af472c857c25929500847cfdc))

## [2.1.0](https://github.com/memori-ai/memori-react/compare/v2.0.11...v2.1.0) (2023-05-09)


### Features

* add custom layout override as prop ([a6e0de7](https://github.com/memori-ai/memori-react/commit/a6e0de73f3610f763bcd8e28deb7626fea91f0d1))


### Bug Fixes

* do not add sessino id to external media urls ([78e368a](https://github.com/memori-ai/memori-react/commit/78e368a266ab0b7cb38b5f93bab97696e36e585a))

## [2.0.11](https://github.com/memori-ai/memori-react/compare/v2.0.10...v2.0.11) (2023-05-08)


### Bug Fixes

* start + end avatar speaking events ([8b8bdf5](https://github.com/memori-ai/memori-react/commit/8b8bdf5246be1ebc29f132af9dc3f816c741704c))


### Changes

* show settings hide emissions without conditions ([40d87bf](https://github.com/memori-ai/memori-react/commit/40d87bfe5783e54cc8140723bbdb265f19beb788))


### Maintenance

* fix ts warning ([9b97363](https://github.com/memori-ai/memori-react/commit/9b9736362758c1dfd82ab659695801003458a7b9))

## [2.0.10](https://github.com/memori-ai/memori-react/compare/v2.0.9...v2.0.10) (2023-05-05)


### Bug Fixes

* remove loading avatar margins ([f0898b6](https://github.com/memori-ai/memori-react/commit/f0898b694bf5f5052beb21121dcff3930b759de8))


### Maintenance

* check device width and orientation for controls position default value ([79dda42](https://github.com/memori-ai/memori-react/commit/79dda4205fcd30a788f5a99ffddcc448f8d11e83))


### Changes

* add parameter to lexicon to check case (in)sensitive, fix separate word match ([0233cc6](https://github.com/memori-ai/memori-react/commit/0233cc61aab6b45ceb53b290f327bf4feabcb173))

## [2.0.9](https://github.com/memori-ai/memori-react/compare/v2.0.8...v2.0.9) (2023-05-03)


### Changes

* hide emissions as separate checkbox not control positions value ([943f06a](https://github.com/memori-ai/memori-react/commit/943f06adddf2495b69b9713a1f898552a076f5c4))

## [2.0.8](https://github.com/memori-ai/memori-react/compare/v2.0.7...v2.0.8) (2023-04-27)


### Bug Fixes

* ssml encoding ([db335ed](https://github.com/memori-ai/memori-react/commit/db335edc0810e6927185ad74e8aca442e589eb29))
* ssml encoding ([e0e477b](https://github.com/memori-ai/memori-react/commit/e0e477b1d2f6aa09e2a831c9c9caf02a617a4d90))

## [2.0.7](https://github.com/memori-ai/memori-react/compare/v2.0.6...v2.0.7) (2023-04-27)


### Bug Fixes

* dont make avatar smiling while talking ([910d866](https://github.com/memori-ai/memori-react/commit/910d866565115e6f01e29dcef4fa71e47de1c950))

## [2.0.6](https://github.com/memori-ai/memori-react/compare/v2.0.5...v2.0.6) (2023-04-27)


### Bug Fixes

* loading animation from separate glb, add smiling + loading anim morph targets influences ([754a711](https://github.com/memori-ai/memori-react/commit/754a711c5f185a76ed8b201207ea29888053b944))

## [2.0.5](https://github.com/memori-ai/memori-react/compare/v2.0.4...v2.0.5) (2023-04-24)


### Bug Fixes

* totem layout blob z-index ([5808bdf](https://github.com/memori-ai/memori-react/commit/5808bdfa6875a3083e787b40f49c3cc836edfdd5))

## [2.0.4](https://github.com/memori-ai/memori-react/compare/v2.0.3...v2.0.4) (2023-04-24)


### Features

* add layout config hidden ([aa0855b](https://github.com/memori-ai/memori-react/commit/aa0855b019b366b002779b2167d8900bdf23ffd7))

## [2.0.3](https://github.com/memori-ai/memori-react/compare/v2.0.2...v2.0.3) (2023-04-24)


### Maintenance

* add layout to propTypes ([2693869](https://github.com/memori-ai/memori-react/commit/269386988292ec9937730e4639e4179b3f5f68be))

## [2.0.2](https://github.com/memori-ai/memori-react/compare/v2.0.1...v2.0.2) (2023-04-24)


### Bug Fixes

* vars in portal root ([2f6856a](https://github.com/memori-ai/memori-react/commit/2f6856a49296c757ce2cfee7c5fea86b75db1888))

## [2.0.1](https://github.com/memori-ai/memori-react/compare/v2.0.0...v2.0.1) (2023-04-24)


### Bug Fixes

* copy css files ([866a97f](https://github.com/memori-ai/memori-react/commit/866a97fe078c9758e2a420ea4c4aca2008ee7644))

## [2.0.0](https://github.com/memori-ai/memori-react/compare/v1.2.1...v2.0.0) (2023-04-24)


### ⚠ BREAKING CHANGES

* add totem layout, add prop to select layout, refactor defualt to fullpage
* add age verification, settings panel, ui components

### Features

* add age verification, settings panel, ui components ([92f390c](https://github.com/memori-ai/memori-react/commit/92f390c086413349fc655bca9fc0eb9b4ea02797))
* add controls position in settings, place controls on that config on totem layout ([fcfb23e](https://github.com/memori-ai/memori-react/commit/fcfb23ee61642494eae803de0d0222ec3e24f8c6))
* add fullscreen button, fix styles for totem layout, fix fullbody camera/obj rotation ([ad694a4](https://github.com/memori-ai/memori-react/commit/ad694a42eb90e67c9a932d4959d3b830a07fbe57))
* add modal in media item for images and videos ([348018a](https://github.com/memori-ai/memori-react/commit/348018a5237696d048cea4d8b30b7a30bb735322))
* add modal in media item for images and videos ([99cc6e2](https://github.com/memori-ai/memori-react/commit/99cc6e2c7ec5d0d73359f495fff5f57e7ca568b9))
* add refresh button in header ([5029462](https://github.com/memori-ai/memori-react/commit/5029462d406e3b08bf5408201ad4648e89e9ec06))
* add totem layout, add prop to select layout, refactor defualt to fullpage ([4717cb2](https://github.com/memori-ai/memori-react/commit/4717cb2bf19e76beb9a5e2e3ab68a845a718d7d3))
* open links in another window ([a7825f7](https://github.com/memori-ai/memori-react/commit/a7825f790d856135279fa5103ae0b1fb746317bd))


### Bug Fixes

* audio first message ([773307f](https://github.com/memori-ai/memori-react/commit/773307ffd80c3dea7022e2b849e41dc7e0b24409))
* avatar fullbody animations male vs female ([c5366a5](https://github.com/memori-ai/memori-react/commit/c5366a503e1c88473e769232c77cb3f50583bfe0))
* chat typing wave animation ([77597c4](https://github.com/memori-ai/memori-react/commit/77597c482608a63c2a39908b10e6254fffb2dce3))
* continuous speech issues ([4e99871](https://github.com/memori-ai/memori-react/commit/4e998713834838e7003bde536bd5f10f49b6e1a6))
* female avatars mouth moving speaking ([246d054](https://github.com/memori-ai/memori-react/commit/246d05486cae1759f223c372e7cfeb359bb344a0))
* import css order ([8d23656](https://github.com/memori-ai/memori-react/commit/8d236566819510b8c4e02b9c5acc5deb2c6ef4da))
* max width totem controls ([8e0378e](https://github.com/memori-ai/memori-react/commit/8e0378e58cd4da40cc3aa98f117a4fb28a910ce9))
* media modal styles ([e08c946](https://github.com/memori-ai/memori-react/commit/e08c9460d02c710bf631faf5d888330a8c5ad71e))
* minor fixes, add base background ([5dbb196](https://github.com/memori-ai/memori-react/commit/5dbb19611c6b57d77c4366e6a106c843ca4d15f9))
* minor style fixes ([cd7a5b4](https://github.com/memori-ai/memori-react/commit/cd7a5b42262926ad4b140dd813a698961adfbdfb))
* minor style fixes, fix avatar loader, stop audio on hints click or type textarea ([235ad81](https://github.com/memori-ai/memori-react/commit/235ad8187bc0fa8163553597c7c520aea3b7122e))
* minor styles fixes ([940b066](https://github.com/memori-ai/memori-react/commit/940b066574c8648f3074d4bad4bc59fd559886af))
* missing session id on img link ([3a3b48e](https://github.com/memori-ai/memori-react/commit/3a3b48e74a2185cd508961d1634cc0911435feb8))
* share menu overlay zindex in totem layout ([55f9b8a](https://github.com/memori-ai/memori-react/commit/55f9b8a8e51b2cc97803840b23790401c232c36c))
* totem controls width ([e6df8db](https://github.com/memori-ai/memori-react/commit/e6df8dbb38ed1e3cb9e7404ce6a81797cbf62b75))
* totem height ([46e3e90](https://github.com/memori-ai/memori-react/commit/46e3e90762c76d3f38c22652ed50501dbd8339cd))
* totem height ([46cfb4f](https://github.com/memori-ai/memori-react/commit/46cfb4f6f02a69e63f05fea40e07a4dfbeca8f0b))
* typo translation bottom ([239e7c4](https://github.com/memori-ai/memori-react/commit/239e7c43f0151afca7510f45b68ffc889cf39dfb))


### Maintenance

* add demos ([3d64061](https://github.com/memori-ai/memori-react/commit/3d6406102283359cf12651fe72cbfc6d40cdc8e3))
* add refresh icon ([055402e](https://github.com/memori-ai/memori-react/commit/055402e42d2ef0c37ed1910eff06f8f1f6a713a4))
* upgrade api client ([d0a4c51](https://github.com/memori-ai/memori-react/commit/d0a4c51374b322faf5351ca5035efe784bd40f73))
* upgrade api client ([08533d6](https://github.com/memori-ai/memori-react/commit/08533d64d2aabd593467d114f1f34022fd247e9c))
* upgrade to storybook@7 ([62342f2](https://github.com/memori-ai/memori-react/commit/62342f2eab4386cc0ca72eba5bebd2ab093a26eb))


### Changes

* change defaults, use reload in header if totem ([74d1bd7](https://github.com/memori-ai/memori-react/commit/74d1bd72f934a601c388daa5420b851a16ef9785))
* cleanup ([a972fde](https://github.com/memori-ai/memori-react/commit/a972fdecca5d6a4b26563d4e1415b8ada796a857))
* defaults + fix styles ([f3852dd](https://github.com/memori-ai/memori-react/commit/f3852ddc8074c6368fbd20043d5b308b67d213f8))
* start panel stories args ([b0cd83c](https://github.com/memori-ai/memori-react/commit/b0cd83ce0e275bc52016bdeb552a001ba27e0bc3))
* use new ui select for lang selector in start panel ([5f3feef](https://github.com/memori-ai/memori-react/commit/5f3feefb1fa49ff2c3f3bbc924969f0f3ddc5eec))

## [1.2.1](https://github.com/memori-ai/memori-react/compare/v1.2.0...v1.2.1) (2023-04-13)


### Maintenance

* setup ts as peer dep ([b2f285e](https://github.com/memori-ai/memori-react/commit/b2f285eba9ee78a130cd12b553949aa84c8863c3))

## [1.2.0](https://github.com/memori-ai/memori-react/compare/v1.1.0...v1.2.0) (2023-04-03)


### Features

* refactor styles, add powered by ([3605c04](https://github.com/memori-ai/memori-react/commit/3605c04ca9c7cd7a6421095411204e5561f73dc2))

## [1.1.0](https://github.com/memori-ai/memori-react/compare/v1.0.2...v1.1.0) (2023-03-25)


### Features

* add animations + fullbody avatar ([6e2d83a](https://github.com/memori-ai/memori-react/commit/6e2d83a777dc5ac4c5c2fb278d409e9ddc4266cb))


### Bug Fixes

* keep hints on G1 on timeout ([4c62ecd](https://github.com/memori-ai/memori-react/commit/4c62ecd6a241055124d8e8fcb392c324430fb41d))
* transform media url with session id ([2a30ef2](https://github.com/memori-ai/memori-react/commit/2a30ef2fea7ae54c9437ca770fcbf6d2f79354b0))


### Maintenance

* migrate to yarn@3 ([d9e92a3](https://github.com/memori-ai/memori-react/commit/d9e92a3668daf041f16a61777f6ecff24fd76233))
* update api client ([828e184](https://github.com/memori-ai/memori-react/commit/828e1849dfc0ab37aae1f126eb4948ed00aaf755))
* upgrade api client, refactor linter ([88d233b](https://github.com/memori-ai/memori-react/commit/88d233b1645e660163f8c8811427287cf0ba988e))

## [1.0.2](https://github.com/memori-ai/memori-react/compare/v1.0.1...v1.0.2) (2023-03-03)


### Bug Fixes

* dont disable mic btn while speaking ([4baba70](https://github.com/memori-ai/memori-react/commit/4baba70131a2c5ea4e672660a79242714fa31d84))
* reopen audio context if closed before audio termination ([dec1f12](https://github.com/memori-ai/memori-react/commit/dec1f12f9439dcdf3e4859b4870b2e7adcf1e8d5))

## [1.0.1](https://github.com/memori-ai/memori-react/compare/v1.0.0...v1.0.1) (2023-03-02)


### Maintenance

* cleanup logs ([19f99e7](https://github.com/memori-ai/memori-react/commit/19f99e753a1b3725867f941a7c1d331680560414))

## [1.0.0](https://github.com/memori-ai/memori-react/compare/v1.0.0-rc.6...v1.0.0) (2023-03-02)

## [1.0.0-rc.6](https://github.com/memori-ai/memori-react/compare/v1.0.0-rc.5...v1.0.0-rc.6) (2023-03-02)


### Bug Fixes

* webcomponent styles ([3a708f7](https://github.com/memori-ai/memori-react/commit/3a708f734063a3fe210b8de179fdd1a815cbdc85))

## [1.0.0-rc.5](https://github.com/memori-ai/memori-react/compare/v1.0.0-rc.4...v1.0.0-rc.5) (2023-03-02)


### Bug Fixes

* import fonts from cdn for webcomponent compatibility ([16b15df](https://github.com/memori-ai/memori-react/commit/16b15df781dc77b62a546407a19b58ea05ebeffe))

## [1.0.0-rc.4](https://github.com/memori-ai/memori-react/compare/v1.0.0-rc.3...v1.0.0-rc.4) (2023-02-27)


### Features

* blob pulse on speaking ([bd0ef1c](https://github.com/memori-ai/memori-react/commit/bd0ef1cb69e8277c07556b96b6e3167c23938ae1))


### Bug Fixes

* default styles ([66ae787](https://github.com/memori-ai/memori-react/commit/66ae787a8255d691821434a9aec239d2e8e3b7d0))
* widget audio on ios ([eab3e16](https://github.com/memori-ai/memori-react/commit/eab3e16be90a5b2a6b783ba983c8bc1a48081e66))


### Maintenance

* add sb script + viewport for sb preview ([38a963b](https://github.com/memori-ai/memori-react/commit/38a963b207a3f1fb4f8d6db8bb741b4e4260f0ef))


### Changes

* dont show 3d avatar on mobile by default ([636dae4](https://github.com/memori-ai/memori-react/commit/636dae4356d5ccc4f1e28cd7abe78c0e221966ac))
* minor css fixes, backdrop blur + padding ([a0138dc](https://github.com/memori-ai/memori-react/commit/a0138dc0a2a34e46fe81974c06334e3f9b52f69e))

## [1.0.0-rc.3](https://github.com/memori-ai/memori-react/compare/v1.0.0-rc.2...v1.0.0-rc.3) (2023-02-16)


### Bug Fixes

* encapsulate css properties in memori-widget ([03221bd](https://github.com/memori-ai/memori-react/commit/03221bd5967c6278a6d5540f4c4192f0efe5110c))

## [1.0.0-rc.2](https://github.com/memori-ai/memori-react/compare/v1.0.0-rc.1...v1.0.0-rc.2) (2023-02-16)


### Maintenance

* use antd 4x ([8b5e4d7](https://github.com/memori-ai/memori-react/commit/8b5e4d761ffe137d508330c0c35241b786fb08bc))

## [1.0.0-rc.1](https://github.com/memori-ai/memori-react/compare/v1.0.0-rc.0...v1.0.0-rc.1) (2023-02-16)


### Bug Fixes

* font css url import ([97c2c71](https://github.com/memori-ai/memori-react/commit/97c2c713ff4c300da1df6873c796bd57b96acfc6))


### Maintenance

* fix relative imports ([ef269da](https://github.com/memori-ai/memori-react/commit/ef269dadaac0c1e1e39187556c66ab0fe83c2524))
* upgrade api-client to v1.1.0 ([b2254e1](https://github.com/memori-ai/memori-react/commit/b2254e1723dc1dda3d5ebfdbb7c10d1828e0934b))

## [1.0.0-rc.0](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.24...v1.0.0-rc.0) (2023-02-16)


### ⚠ BREAKING CHANGES

* remove css imports, add single style.css file with imports

### Changes

* pass apiURL through for asset helper ([0dd9a69](https://github.com/memori-ai/memori-react/commit/0dd9a69c6ff29229e19f9d9723773fb61f5c8b62))
* remove css imports, add single style.css file with imports ([1887357](https://github.com/memori-ai/memori-react/commit/188735746081ca58cc0c0790f1d44df9804ca7a8))

## [1.0.0-alpha.24](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.23...v1.0.0-alpha.24) (2023-02-02)


### Features

* add feedback buttons on acceptsFeedback ([8be4ca4](https://github.com/memori-ai/memori-react/commit/8be4ca4a5bff4eeafc467170795761c96e54ff3b))
* add icon to show if a msg is generated by AI ([c0a5ab7](https://github.com/memori-ai/memori-react/commit/c0a5ab79631cf853c21c184a3b831d3a3d058074))
* import new feedback + completions disclaimer ([8fe3170](https://github.com/memori-ai/memori-react/commit/8fe31703c6c0602c76008c532591e74ae9de5c42))


### Bug Fixes

* minor css fixes ([79fb904](https://github.com/memori-ai/memori-react/commit/79fb90456676ae0cb25d2eb95a7d49098891def8))


### Changes

* add show AI icon in integration config ([36575c9](https://github.com/memori-ai/memori-react/commit/36575c90f423e1bd38cb0e442fb307fb74ac1cc8))
* pick completion flag for generated by ai icon ([4ae8658](https://github.com/memori-ai/memori-react/commit/4ae8658056955232314143c012bc2929342e3511))
* show feedback buttons + ai icon on chat bubble floating addon ([3dbd011](https://github.com/memori-ai/memori-react/commit/3dbd0113c0af844822812ab06e3f9a611193b1b3))


### Maintenance

* **i18n:** add translation for generated by ai ([a7694bc](https://github.com/memori-ai/memori-react/commit/a7694bc8ac538185ae9f25833ba386b84e4fcad9))
* upgrade api client ([c65fb57](https://github.com/memori-ai/memori-react/commit/c65fb572af5b7c6de8e32657ab36be53e8b99812))

## [1.0.0-alpha.23](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.22...v1.0.0-alpha.23) (2023-01-19)


### Changes

* fixes for listening events ([76bc5f6](https://github.com/memori-ai/memori-react/commit/76bc5f616538d6621ff51b7ad41a9b07b8ad59ba))

## [1.0.0-alpha.22](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.21...v1.0.0-alpha.22) (2023-01-17)


### Bug Fixes

* audio issues, refactor tts ([e66c83a](https://github.com/memori-ai/memori-react/commit/e66c83a35e1a98ae7e24ee532923653d9032c3f3))


### Maintenance

* cleanup ([bd755c7](https://github.com/memori-ai/memori-react/commit/bd755c7de3736f4685e66076f058ff7ca6d513d2))

## [1.0.0-alpha.21](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.20...v1.0.0-alpha.21) (2023-01-14)


### Bug Fixes

* chat user bubble size ([27bf2c6](https://github.com/memori-ai/memori-react/commit/27bf2c67bc7344b1033b6613bf5eeb82e1ab178d))
* make stt work on safari ([a1a1ff9](https://github.com/memori-ai/memori-react/commit/a1a1ff9ee3bdc1fd4c4ebebaa5c39f01c7241a21))


### Maintenance

* pin azure sdk to 1.20.0 ([a615436](https://github.com/memori-ai/memori-react/commit/a615436b989a8c55008d5561fecea54fbd70ff41))

## [1.0.0-alpha.20](https://github.com/memori-ai/memori-react/compare/v1.0.0-alpha.19...v1.0.0-alpha.20) (2023-01-13)


### Features

* add mutationObserver to detect if authToken attr from wc is changed, show upload media button only if authToken present ([33fef98](https://github.com/memori-ai/memori-react/commit/33fef986709e7dc06c832765e9e08427a41cf4cd))


### Bug Fixes

* link item preview img fallback ([1d739d6](https://github.com/memori-ai/memori-react/commit/1d739d65ff66374ad2dc4723cee779d0347b71ce))
* send on enter menu btn sizes ([6ca6887](https://github.com/memori-ai/memori-react/commit/6ca6887464f9b9320b74cf9e64625ac587512710))

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


### ⚠ BREAKING CHANGES

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