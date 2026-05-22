

## 9.0.0-alpha.0 (2026-05-22)


### ⚠ BREAKING CHANGES

* split engine and backend endpoints
* use new aisuru color as default primary
* rename usage of twincreator in aisuru
* remove antd and related, momentjs + cleanup to make pkg lighter
* use i18next with local provider as lib
* memoize container components, move snippet exec to main running once on state change
* add totem layout, add prop to select layout, refactor defualt to fullpage
* add age verification, settings panel, ui components
* remove css imports, add single style.css file with imports
* open session on clicking start button

### Features

*  chat languages sorted alphabetically ([8dc7c05](https://github.com/memori-ai/memori-react/commit/8dc7c0523be6cac778e5462dba3de9331e9a8b39))
* add 'TOTEM' layout option and refactor TTS chunk handling in useTTS ([9019764](https://github.com/memori-ai/memori-react/commit/901976416813643a7f195c4779ee4fefdbe9cb83))
* add account management in login drawer ([1d03455](https://github.com/memori-ai/memori-react/commit/1d0345543f9d7ffb7a5d93427d1952181f2559ca))
* add active session css class ([f161d23](https://github.com/memori-ai/memori-react/commit/f161d23155f509e1243adf1528b1376e1822836f))
* add additional layout props for enhanced customization in DefaultLayout story ([be0a03f](https://github.com/memori-ai/memori-react/commit/be0a03fa66bdebdf65f5189df27efc88a61f33c8))
* add additionalSettings ([8eac525](https://github.com/memori-ai/memori-react/commit/8eac52513eb260b91611941c7c615e44349fa495))
* add age verification, settings panel, ui components ([92f390c](https://github.com/memori-ai/memori-react/commit/92f390c086413349fc655bca9fc0eb9b4ea02797))
* add AgeVerificationModal to Showcase ([cb8e5bd](https://github.com/memori-ai/memori-react/commit/cb8e5bdc75b22b9132b454b9b8df40e2fd84b133))
* add AI icon display in ChatBubble component with tooltip support ([b9eb8ee](https://github.com/memori-ai/memori-react/commit/b9eb8eeac44dfe8469d03bbdc4fe1d457ed576fb))
* add Alert component with multiple variants and customization options ([8ddc456](https://github.com/memori-ai/memori-react/commit/8ddc4565318b09729c0c30d7e54750bc639f56d1))
* add animations + fullbody avatar ([6e2d83a](https://github.com/memori-ai/memori-react/commit/6e2d83a777dc5ac4c5c2fb278d409e9ddc4266cb))
* add AnimationSequenceTest story ([2be61d9](https://github.com/memori-ai/memori-react/commit/2be61d97fbdac1436bc11503a1201a1b1c35a7bd))
* add anonymous retention notice to file preview and update translations ([d22e353](https://github.com/memori-ai/memori-react/commit/d22e353ceeb50bdf5d29a5fc51fe06d2a9645e61))
* add arabic, chinese and japanese langs, add dir auto to emissions ([e7dafd2](https://github.com/memori-ai/memori-react/commit/e7dafd2b51285d7bec19e0239eb47768fca103a8))
* add artifact creation event dispatching in ArtifactHandler ([1fb558b](https://github.com/memori-ai/memori-react/commit/1fb558bdf530d2feabb33f29689c27223ed126a1))
* add auth for private memori ([c1bef59](https://github.com/memori-ai/memori-react/commit/c1bef59088fb2fce2f098c161975e3053b778708))
* add auth widget ([9c43a0d](https://github.com/memori-ai/memori-react/commit/9c43a0d0dfbebcca3788dedd1307609d14b7389a))
* add autoStart prop to HiddenChat component ([f0381ec](https://github.com/memori-ai/memori-react/commit/f0381ec13d29886b58c3d95a90ef4b42e7b96972))
* add autoStart prop to MemoriWidget and update HiddenChatLayout logic ([6e95d46](https://github.com/memori-ai/memori-react/commit/6e95d46d659d9b09dc61d785b4848199d855b906))
* add avatar universal component ([5ca549f](https://github.com/memori-ai/memori-react/commit/5ca549f169d1d726208feebce82954d5c22e4e94))
* add avatar3dHidden prop to MemoriWidget ([359e88f](https://github.com/memori-ai/memori-react/commit/359e88fe48502b44b24ee9af03b6dad94198ac99))
* add avatar3dHidden prop to WebsiteAssistant layout ([8803b75](https://github.com/memori-ai/memori-react/commit/8803b751df3f34aff37af500a650b29ccb012218))
* add back button functionality and improve header layout in ChatHistoryDrawer ([9522f3f](https://github.com/memori-ai/memori-react/commit/9522f3fe47892cc6ffb5a3bc09ca34c96e0bbe9e))
* add blob ([56ee173](https://github.com/memori-ai/memori-react/commit/56ee1736eaea2fa5ccd8a94a775cd275aa8a664d))
* add block prop to button, update card snapshot ([dcac744](https://github.com/memori-ai/memori-react/commit/dcac74459dca2a825f56426e3cb547b5bb14a0a7))
* add boe indicators, chat avatar with emitters ([9c1f162](https://github.com/memori-ai/memori-react/commit/9c1f16207b8accfe6f109387912a3428ca577bf3))
* add change mode as separate component ([141c8ad](https://github.com/memori-ai/memori-react/commit/141c8ad543dfc3355e9fca0c2de7ced63f44ae5f))
* add change pwd to login ([cbe4ca5](https://github.com/memori-ai/memori-react/commit/cbe4ca5134bf58c4533b6247c253f53e04f73191))
* add chat bubble ([645fb11](https://github.com/memori-ai/memori-react/commit/645fb11bfa1c4de2f62bc3e527edb599a0355690))
* add chat component ([5a4fed6](https://github.com/memori-ai/memori-react/commit/5a4fed6ac4c6e019ac77c480ce05dd99c3b00b7f))
* add chat inputs ([626963d](https://github.com/memori-ai/memori-react/commit/626963da19b60e7914fed0bcb4ba754d1e2e71b8))
* add chat layout ([70f00e7](https://github.com/memori-ai/memori-react/commit/70f00e77e3a5683ebc85fafc5b68d22b9c7bda27))
* add chat message feedback button ([e74b391](https://github.com/memori-ai/memori-react/commit/e74b3916db64f95d68178faa5effc62a4d5823c4))
* add chat textarea ([b2b0236](https://github.com/memori-ai/memori-react/commit/b2b023626cdfe4492a60599bf349ef247ff283cc))
* add ChatHistoryDrawer component with API integration and styling ([3d3529f](https://github.com/memori-ai/memori-react/commit/3d3529fe811e729bf62dc1cb9968e71aaa3ebd4b))
* add ChatHistoryDrawer component with storybook stories and tests ([ff68960](https://github.com/memori-ai/memori-react/commit/ff689606ddfb59d6cd794f4d001062e9409cb3f7))
* add ChatRound icon component and enhance History icon with disabled state styling ([5c97dda](https://github.com/memori-ai/memori-react/commit/5c97ddaac594e55242e1a319538e50cbe91bcd5f))
* add ConfirmDialog component with styling and stories ([fcd51da](https://github.com/memori-ai/memori-react/commit/fcd51dad2ebff94e2d262bde4c798db40c5d5d5e))
* add confirmDialogTitle and confirmDialogMessage props ([0869a65](https://github.com/memori-ai/memori-react/commit/0869a65af4687b6a0f9546322646f63bf2990644))
* add controls position in settings, place controls on that config on totem layout ([fcfb23e](https://github.com/memori-ai/memori-react/commit/fcfb23ee61642494eae803de0d0222ec3e24f8c6))
* add copy buttons ([e80d12c](https://github.com/memori-ai/memori-react/commit/e80d12c2a373f786a3e65932b06dc34b9474ee38))
* add credits check, handle not enough credits to open session ([bac77ed](https://github.com/memori-ai/memori-react/commit/bac77ed7883734d0ffac1867123d8f45f489f76e))
* add custom glb model viewer ([7a2ccd3](https://github.com/memori-ai/memori-react/commit/7a2ccd310e3b700d2dcded5e7876a267561613d9))
* add custom layout override as prop ([a6e0de7](https://github.com/memori-ai/memori-react/commit/a6e0de73f3610f763bcd8e28deb7626fea91f0d1))
* add customizable lighting component for avatar rendering ([e362cb4](https://github.com/memori-ai/memori-react/commit/e362cb4f626d4b3b1784c8b2a19497b4a63d1777))
* add customMediaRenderer prop ([ae66ae9](https://github.com/memori-ai/memori-react/commit/ae66ae9f0076e3e9954d27256a2a0f36c80177dc))
* add dark theme detection to MemoriWidget ([7b4cf2e](https://github.com/memori-ai/memori-react/commit/7b4cf2e9441ea11e225ac8eb8c004e525e771f2e))
* add deep thought disclaimer and indicators ([551ad43](https://github.com/memori-ai/memori-react/commit/551ad43086ded19653ebf0cc1b103e6b3df0e6f4))
* add deep thought disclaimers with new flags ([42d6f12](https://github.com/memori-ai/memori-react/commit/42d6f12a81e1e263c6d62dcace3c1e88f3371343))
* add default context vars with pathname and route ([4c6ae03](https://github.com/memori-ai/memori-react/commit/4c6ae03459b4114b89eb4937978853771e7238ff))
* add disablePastedText prop to control pasted text ([adc224e](https://github.com/memori-ai/memori-react/commit/adc224e56a53d4a8cee1661263f337c0564fcb97))
* add disablePastedText prop to control pasted text ([b694915](https://github.com/memori-ai/memori-react/commit/b694915f8d4d2dd24d36183f36de749842ffeb78))
* add document and image class to upload menu items ([78c8afa](https://github.com/memori-ai/memori-react/commit/78c8afa5f4b6e9289dbcb0a5b98b06b9eb9a7c78))
* add download chat button and localization support in ChatHistoryDrawer ([2b5cb43](https://github.com/memori-ai/memori-react/commit/2b5cb43d55c75d1b021678f632af95d2301571ae))
* add download chat button and localization support in ChatHistoryDrawer ([130524c](https://github.com/memori-ai/memori-react/commit/130524c6bb600cb51922cfae2336cfe27fa2b499))
* add drawerClassName prop to LoginDrawer and PositionDrawer ([8ec2646](https://github.com/memori-ai/memori-react/commit/8ec26467f82f90573dfc713b9001575fa6917930))
* add DrawerFooter component ([e126ae8](https://github.com/memori-ai/memori-react/commit/e126ae8df5d5612a137451ad5a209506d662f62d))
* add Dropdown component styles and remove unused import from Header ([43cfcd6](https://github.com/memori-ai/memori-react/commit/43cfcd6cf94616c3276af1a692ab5b874a232124))
* add dynamic sessionId handling ([c80f0f5](https://github.com/memori-ai/memori-react/commit/c80f0f5a2ad497999218e6b401c8aeef1b9db02b))
* add dynamic shadow rendering for avatar with emotion-based shadow properties ([78030e2](https://github.com/memori-ai/memori-react/commit/78030e2729b00c5bb09fb666e5cd746e8a2ed065))
* add enableAudio prop, read also from config ([240c03c](https://github.com/memori-ai/memori-react/commit/240c03c60796a2174cb1354d819ded273a0d1c2e))
* add enter and leave animation for Artifact Drawer in mobile layout ([42531e0](https://github.com/memori-ai/memori-react/commit/42531e0c0b77976e44181ff32221d2790e107fe6))
* add error boundary ([88e1a52](https://github.com/memori-ai/memori-react/commit/88e1a5204d1acec10c1db6bd1192ec8d9b8ef9fb))
* add error message handling in ChatBubble for system errors ([380f83d](https://github.com/memori-ai/memori-react/commit/380f83d0521e67e4b67c6eb6d16671a70c087104))
* add example ([9271c63](https://github.com/memori-ai/memori-react/commit/9271c63fb4ed3653c69792710df2f4dea14a57f4))
* add expandable ([afaed3e](https://github.com/memori-ai/memori-react/commit/afaed3eb5d4fde7be413596dba0f65345333620e))
* add expandable object for localization in multiple languages ([549a73a](https://github.com/memori-ai/memori-react/commit/549a73a0d60889c8b68b903ecf6ce5a2fc9276d4))
* add experts drawer in widget for board of experts ([2725e13](https://github.com/memori-ai/memori-react/commit/2725e1340010b816b01b9ac5ed7722d43b10af19))
* add export history button, fix avatar lint issues ([1947099](https://github.com/memori-ai/memori-react/commit/1947099d812deb3d3e838fc391d82ad483bda1ca))
* add extension div in layouts ([cd9486a](https://github.com/memori-ai/memori-react/commit/cd9486aa8196d5dd76219a34d410529153c08c54))
* add feedback buttons on acceptsFeedback ([8be4ca4](https://github.com/memori-ai/memori-react/commit/8be4ca4a5bff4eeafc467170795761c96e54ff3b))
* add first ui components ([dcc515e](https://github.com/memori-ai/memori-react/commit/dcc515e7bf189edc61efe8d715abf932d1863289))
* add fullscreen button, fix styles for totem layout, fix fullbody camera/obj rotation ([ad694a4](https://github.com/memori-ai/memori-react/commit/ad694a42eb90e67c9a932d4959d3b830a07fbe57))
* add function cache modal and debug button in ChatBubble component ([64d65d0](https://github.com/memori-ai/memori-react/commit/64d65d0bced4ac2e8b14ce6dc3732fae25ec7426))
* add GasStation icon and update Header component for sustainability button ([92ac136](https://github.com/memori-ai/memori-react/commit/92ac13625c777fb7d2bac762ed928a173d368978))
* add GasStation icon and update Header component for sustainability button ([434c61a](https://github.com/memori-ai/memori-react/commit/434c61a02eeb493261fe44d343b337a8727b83d1))
* add ghost button ([9641815](https://github.com/memori-ai/memori-react/commit/964181519ef45b5d849b78d0bb367fa8cf666020))
* add header ([e26ee8d](https://github.com/memori-ai/memori-react/commit/e26ee8d679fb5fac401ca6a1c0c6d190fe950be6))
* add hold to talk mic mode, set as default; improvements to tooltip ([2ed0949](https://github.com/memori-ai/memori-react/commit/2ed0949fb9d44fa2b5e8548c13c934e7a25fef33))
* add icon to show if a msg is generated by AI ([c0a5ab7](https://github.com/memori-ai/memori-react/commit/c0a5ab79631cf853c21c184a3b831d3a3d058074))
* add icons ([86c1b30](https://github.com/memori-ai/memori-react/commit/86c1b30ffa503a57203e4484251f72e12ccf4693))
* add icons ([f76ad0c](https://github.com/memori-ai/memori-react/commit/f76ad0c3c3ed3f76c7dbe68e78141681046a66d5))
* add icons ([674e528](https://github.com/memori-ai/memori-react/commit/674e5284a3f1534e55e8b7521ce35d3592da99db))
* add ignoreClientAttributes param from layout to block attr/props ([8e5838d](https://github.com/memori-ai/memori-react/commit/8e5838d7ec1d9b36584e93eece8acac88bf9afc7))
* add image compression functionality to UploadImages ([f9497be](https://github.com/memori-ai/memori-react/commit/f9497be057181240fcb858a236ac0e746833a4c7))
* add index entrypoint ([e86893b](https://github.com/memori-ai/memori-react/commit/e86893bdd0605657e599f75264dece4bd77f537a))
* add input length and value validation for day, month, and year ([7d443c2](https://github.com/memori-ai/memori-react/commit/7d443c23f0c9b9877d845a27bc4a4fc6303064d7))
* add isChatlogPanel prop to Chat and Artifact components ([1cae0b8](https://github.com/memori-ai/memori-react/commit/1cae0b82f39fb851c37acd98d027284e59256eb4))
* add isHistoryView prop to Chat component ([05f2730](https://github.com/memori-ai/memori-react/commit/05f2730a5bc901df5dbeedcc012427d48b36549b))
* add isTyping prop to Chat and ChatInputs components to avoid multiple user messages ([b2a1a59](https://github.com/memori-ai/memori-react/commit/b2a1a592fb1c8df292297bba5ca61874aa1a910c))
* add known facts drawer ui ([02180ea](https://github.com/memori-ai/memori-react/commit/02180ea2e0dd047f0db8555abe2c217125ffff20))
* add layout config hidden ([aa0855b](https://github.com/memori-ai/memori-react/commit/aa0855b019b366b002779b2167d8900bdf23ffd7))
* add layout option to TTS configuration ([6fe466f](https://github.com/memori-ai/memori-react/commit/6fe466f128ac6cbf9687697a40be080353d77d13))
* add link attachment modal with preview ([e20c8ca](https://github.com/memori-ai/memori-react/commit/e20c8ca42ab2a763492109991a1bfc663271fed2))
* add localized messages for completion provider outages and degraded performance ([e712b31](https://github.com/memori-ai/memori-react/commit/e712b31c15be9bd238eb5b136a10dbf94c094e8a))
* add login ([cc8b88d](https://github.com/memori-ai/memori-react/commit/cc8b88d3f7a84c12c48eb45590f46f51314e15c8))
* add markdown parsing in messages ([f1064aa](https://github.com/memori-ai/memori-react/commit/f1064aa9589413b0c169b4e6bc079f0c534f10c1))
* add maxLength attribute to textarea inputs in Chat and ChatTextArea components ([46c1d6e](https://github.com/memori-ai/memori-react/commit/46c1d6e60514f50178e9bf11ebda15061e5abfd3))
* add maxTextareaCharacters prop to limit chat input ([0d9f1b6](https://github.com/memori-ai/memori-react/commit/0d9f1b6f9457da1c09218be5c6fd5e3c515ecd2d))
* add maxTextareaCharacters prop to limit chat input ([dbb4778](https://github.com/memori-ai/memori-react/commit/dbb47786e8cc9030040fdce42c6a10733225755c))
* add media handling and AI-generated note to Chat components, update button styles in Header ([9619830](https://github.com/memori-ai/memori-react/commit/9619830a0aeff6b539f75803d60035393816de35))
* add media upload + media attachment modal ([6066f06](https://github.com/memori-ai/memori-react/commit/6066f065d63e6c12c56d9489da6f9eceacf103fa))
* add media widget ([12a65a4](https://github.com/memori-ai/memori-react/commit/12a65a44b61abe9e12e5d181fe3e70917dc01064))
* add MemoriEndSpeak event emission ([f659e13](https://github.com/memori-ai/memori-react/commit/f659e13ee087aecf84fb5098ff30f57c75b3775e))
* add memoriID parameter to uploadAsset function for enhanced asset management ([60d55e4](https://github.com/memori-ai/memori-react/commit/60d55e4313e2dd9a0e66923ab4c73a7da4299cbe))
* add MemoriResetUIEffects event listener, reset ui timeout + speech ([ce55826](https://github.com/memori-ai/memori-react/commit/ce558260428c9b1e17f2625c64dceb6be38286bf))
* add message consumption feature with UI updates and localization support ([293c58f](https://github.com/memori-ai/memori-react/commit/293c58fcc9d57391679c1959dd22d1cc456528ea))
* add microphone button + listening ([b2b3a3b](https://github.com/memori-ai/memori-react/commit/b2b3a3b7dc683174cd270173d77a9de6c53dc80f))
* add minimum messages filter to ChatHistoryDrawer ([2f0970f](https://github.com/memori-ai/memori-react/commit/2f0970f13b1ae8c7ce49046c3f813138b3f2e5f4))
* add modal in media item for images and videos ([348018a](https://github.com/memori-ai/memori-react/commit/348018a5237696d048cea4d8b30b7a30bb735322))
* add modal in media item for images and videos ([99cc6e2](https://github.com/memori-ai/memori-react/commit/99cc6e2c7ec5d0d73359f495fff5f57e7ca568b9))
* add multi-language support for upload functionality in locales ([a0dddc5](https://github.com/memori-ai/memori-react/commit/a0dddc5b7b0102fb70129d288bca8fa5b3d0cf9a))
* add multilingual as prop, showShare from config as fallback ([61c07ac](https://github.com/memori-ai/memori-react/commit/61c07ac81b7ed27726a380730e58377d3df036c1))
* add multilingual support for artifact-related terms in localization files ([312b2b5](https://github.com/memori-ai/memori-react/commit/312b2b5ebaf80ef733c64104c676fac6a6cbb3db))
* add multiple document upload functionality with validation and error handling ([8ada71b](https://github.com/memori-ai/memori-react/commit/8ada71b6b70176f22ade287da0c3f0b0b42d6813))
* add mutationObserver to detect if authToken attr from wc is changed, show upload media button only if authToken present ([33fef98](https://github.com/memori-ai/memori-react/commit/33fef986709e7dc06c832765e9e08427a41cf4cd))
* add new Alert and Info icons, update Warning icon for improved accessibility and styling ([5af4ee8](https://github.com/memori-ai/memori-react/commit/5af4ee80b1988c5dc347a7f2435b5cef30641416))
* add new Document, Image, Preview, and Upload icons components ([0a93941](https://github.com/memori-ai/memori-react/commit/0a93941ca6364b88e6736701ab9923677a544e00))
* add new layout WEBSITE_ASSISTANT ([298a52a](https://github.com/memori-ai/memori-react/commit/298a52a1c32e0df6781ea0288dffa40805e9193f))
* add new param to typeMessage, add typeBatchMessages ([1e7960b](https://github.com/memori-ai/memori-react/commit/1e7960b040e25b54c4c2c1c08a96cf9c7f9e6c05))
* add new props to snippet ([b75e9df](https://github.com/memori-ai/memori-react/commit/b75e9df7b1f0c33b0d879a92e34ae30adb692780))
* add new story for GiovannaProvaWithPreviousSession with session details ([cade750](https://github.com/memori-ai/memori-react/commit/cade750b199aa94d050d277b17e380fd470a064a))
* add new story variants for Giovanna and enhance MorphTargetController with detailed comments ([ee944c8](https://github.com/memori-ai/memori-react/commit/ee944c8d272c7d4877b23132ab99962950318303))
* add new ui langs es, fr, de ([a15341c](https://github.com/memori-ai/memori-react/commit/a15341ceec7f8bc85a5b7c231b8e06ab6364cbcd))
* add onClick prop to Card component and update styles for pointer cursor ([88cf6bb](https://github.com/memori-ai/memori-react/commit/88cf6bb4544b2f72c8f7b0fec8a916a5565c2c7f))
* add onClickStart prop to MemoriWidget and trigger on sidebar open in HiddenChat ([05df27d](https://github.com/memori-ai/memori-react/commit/05df27dcda4860495086ff7ee5e553691c1f0351))
* add onStateChange callback ([e4f55bd](https://github.com/memori-ai/memori-react/commit/e4f55bdc12a51ee311a8fe63a9fcc0e7125bdc32))
* add PDF export functionality for chat history with localization support ([3e84e62](https://github.com/memori-ai/memori-react/commit/3e84e62f695f1b3d79c0959365e6f7f2ceb6350f))
* add polish lang ([d50a62b](https://github.com/memori-ai/memori-react/commit/d50a62bbd829faca4e133be5ae11f7781c294cce))
* add position drawer + dates and position events in widget ([da48175](https://github.com/memori-ai/memori-react/commit/da48175792260f11a17eaee2bf926a9fd3657254))
* add preventBackdropClose prop to Drawer and adjust ArtifactDrawer styles ([89969f8](https://github.com/memori-ai/memori-react/commit/89969f8ef3679b5289a303dc55f3da99a45ecbd0))
* add preview context detection to whitelist domain check ([9fce89c](https://github.com/memori-ai/memori-react/commit/9fce89c7fd4691d0611b68949ad300fa2ca15d5b))
* add preview context detection to whitelist domain check ([c288d33](https://github.com/memori-ai/memori-react/commit/c288d3364e075e455f7dd0461a5f71f11933bad7))
* add privacy explanation section to StartPanel with localized text and styling ([48e5b30](https://github.com/memori-ai/memori-react/commit/48e5b30c385460464d888d832c3596054769b04b))
* add privacy explanation section to StartPanel with tooltip and translations ([1f214b7](https://github.com/memori-ai/memori-react/commit/1f214b719e77e3c2d4df9de340806042b99e01d1))
* add prop-types ([2dc4e23](https://github.com/memori-ai/memori-react/commit/2dc4e237bb4e59f395a66032e54849579e5f7561))
* add provider prop to Chat and ChatInputs components for TTS integration ([c362f9a](https://github.com/memori-ai/memori-react/commit/c362f9a759f087ef32f1965ad87483506ebf6c13))
* add pulse integration ([07ebd60](https://github.com/memori-ai/memori-react/commit/07ebd601cee1ddb36330ba3f88e21cfcdb3ef17e))
* add reasoning tag <think> formatted display ([20d61c7](https://github.com/memori-ai/memori-react/commit/20d61c7c3bb08a85a7d93f9a56dbd7a1dc0a4459))
* add refresh button in header ([5029462](https://github.com/memori-ai/memori-react/commit/5029462d406e3b08bf5408201ad4648e89e9ec06))
* add resume button translations for German, Spanish, and French locales ([f36d358](https://github.com/memori-ai/memori-react/commit/f36d358d9515b1c979a4979945c3931c832adda3))
* add rpm avatar view ([0dc4489](https://github.com/memori-ai/memori-react/commit/0dc4489a95205f0aef3ed85150af1d48dc1e92f2))
* add send on enter menu ([84a398e](https://github.com/memori-ai/memori-react/commit/84a398ede83ca011c95d47ee2c747e06b7150200))
* add settings button to Totem layout for enhanced user configuration ([31f4d1f](https://github.com/memori-ai/memori-react/commit/31f4d1fe2837fbf5ec433fa9307210e6fc7f8bfc))
* add share button ([603a6c8](https://github.com/memori-ai/memori-react/commit/603a6c8f9bde169619c209865c7cc395a1a52e14))
* add showChatHistory prop to Memori component for chat history visibility ([9fd1f95](https://github.com/memori-ai/memori-react/commit/9fd1f9559369a55a49223ba2ba29a033a716a517))
* add showClear button + showOnlyLastMessages props ([6bd2b18](https://github.com/memori-ai/memori-react/commit/6bd2b181c98893e35831a77b3ce19d04c9681fd9))
* add showFunctionCache prop to Chat, ChatBubble, and MemoriWidget components ([6dc9107](https://github.com/memori-ai/memori-react/commit/6dc9107d2a68d90de3051de93e7fbd9891bcc7dc))
* add showTranslationOriginal, keep emission as from engine and use translatedEmission in msg and state ([38a4302](https://github.com/memori-ai/memori-react/commit/38a4302392a2e960776769b68af074d7b696266d))
* add signup from login drawer ([95c3510](https://github.com/memori-ai/memori-react/commit/95c35103e559134cac1d5de411bc9962f6021e8b))
* add skeleton loading indicators and upload state management for file previews ([8a363ae](https://github.com/memori-ai/memori-react/commit/8a363ae2fe429256f2c67c50a7dfc1ce513f38c6))
* add skeleton loading indicators and upload state management for file previews ([00cea0e](https://github.com/memori-ai/memori-react/commit/00cea0e4542528bbf308e9923b824f610cde51ae))
* add snippet ([6442c85](https://github.com/memori-ai/memori-react/commit/6442c85b15071fdb5bd3d24f21508bf4434a6e80))
* add social media icons ([dda3fcc](https://github.com/memori-ai/memori-react/commit/dda3fcc154129880eb9fa735cdb81271e954a60a))
* add start panel as separate component ([923368d](https://github.com/memori-ai/memori-react/commit/923368db2a0d7d6552be5f07e8a45a7195eaa2a0))
* add status message display in ChatBubble and update session handling in MemoriWidget ([c2af0f6](https://github.com/memori-ai/memori-react/commit/c2af0f634fd106804a45cdb89967eef245312627))
* add Storybook stories for ArtifactDrawer ([3465875](https://github.com/memori-ai/memori-react/commit/3465875f01cd803fbf80c3eef95cb5a4c4dca1b9))
* add styling for combobox group labels and disable hover effect on expandable button ([a8aef46](https://github.com/memori-ai/memori-react/commit/a8aef46e78747f8a65d0b6a2fa0cfe179798a171))
* add styling for combobox group labels and disable hover effect on expandable button ([65604c6](https://github.com/memori-ai/memori-react/commit/65604c648c4524661c95e210b59c1a357b78ce1a))
* add support for additional programming languages in Snippet ([39e0906](https://github.com/memori-ai/memori-react/commit/39e0906365c6ee80bd53ae50d44a7a02a21e1ac6))
* add support for code snippets in MediaItemWidget with modal display ([3bd2c6b](https://github.com/memori-ai/memori-react/commit/3bd2c6b2c1fbf97fe9c146452b3d0cd76d7da880))
* add support for custom trigger node in ChatConsumptionDropdown component ([9aa576c](https://github.com/memori-ai/memori-react/commit/9aa576ced88c997065365f6c709944fe724e2356))
* add support for custom trigger node in ChatConsumptionDropdown component ([0563208](https://github.com/memori-ai/memori-react/commit/0563208cc661e130f322429545e9df84a58ee581))
* add support for multiple artifacts in chat messages ([47081e9](https://github.com/memori-ai/memori-react/commit/47081e9c2c6f20d6d8ab90b481347e7b356f6c32))
* add support for multiple image types in MediaItemWidget stories ([dccf8d1](https://github.com/memori-ai/memori-react/commit/dccf8d1d7556b5eff0d8248e662bac13f03d7b98))
* add support for rendering document attachments in messages with expandable details ([388b93f](https://github.com/memori-ai/memori-react/commit/388b93f871ba1a1a45ad050abd0aa597f30de216))
* add SVG artifact support to ArtifactDrawer and ArtifactPreview components ([d8af976](https://github.com/memori-ai/memori-react/commit/d8af976fc4274d3eb2dac010214202a3db02d4f0))
* add text sanitization helper functions and useTTS hook for speech synthesis ([c6ab5cb](https://github.com/memori-ai/memori-react/commit/c6ab5cb23c2a7817d8065abf3be823e83e53f3ca))
* add tooltip styling and improve MicrophoneButton component functionality ([719b2b1](https://github.com/memori-ai/memori-react/commit/719b2b181e61c6eb0cc122222c6d9806995b969f))
* add totem layout, add prop to select layout, refactor defualt to fullpage ([4717cb2](https://github.com/memori-ai/memori-react/commit/4717cb2bf19e76beb9a5e2e3ab68a845a718d7d3))
* add TTS voice utility module with Azure and OpenAI voice configurations ([391efc6](https://github.com/memori-ai/memori-react/commit/391efc6d119996523eb856b63e2ec1c44e915929))
* add typeMessage and typeMessageHidden as event-based functions ([f717fb7](https://github.com/memori-ai/memori-react/commit/f717fb7f44105cbb61a921695b01036925671bf9))
* add typing sentences list, add BoE loading sentences ([aa7e743](https://github.com/memori-ai/memori-react/commit/aa7e743408c1d50b4ba94c774935cad150095057))
* add ui card, fix tooltip ([11be456](https://github.com/memori-ai/memori-react/commit/11be45666836108ee74ac9b36684d296663ebdb4))
* add ui drawer, enhance modal ([b2b9f38](https://github.com/memori-ai/memori-react/commit/b2b9f3859a7373c20ed30cc5b9711a4b4bb0d728))
* add ui modal ([704c747](https://github.com/memori-ai/memori-react/commit/704c74725031cd141d5e0b7c90329c3462040c30))
* add ui spin ([ee734a9](https://github.com/memori-ai/memori-react/commit/ee734a949794e42cc67c42996283ad4786fe0df9))
* add ui tooltip + blocked memori badge ([4e4c92e](https://github.com/memori-ai/memori-react/commit/4e4c92ebe5f37f1cdd21984c641769e03e5d5338))
* add uiLang and spokenLang props to MemoriWidget ([f066cd6](https://github.com/memori-ai/memori-react/commit/f066cd6a930bbcd6201801c8d96e20c5be454646))
* add upload menu ([f3fdd6a](https://github.com/memori-ai/memori-react/commit/f3fdd6ad106feaf28400b20d24cd5ecdffa59e4c))
* add user avatar ([36abed9](https://github.com/memori-ai/memori-react/commit/36abed9ce77badb7bda715eee973fbb1e3d4ce25))
* add user typing state management to MemoriWidget ([0a0b1da](https://github.com/memori-ai/memori-react/commit/0a0b1daab1cab1266d2d7eb997918f833273e4b4))
* add venue widget ([843c96e](https://github.com/memori-ai/memori-react/commit/843c96eba631d69bb98c93b4a2d4eaa0028e7414))
* add Website Assistant overlay on Memori website with improved z-index ([7cfb9e5](https://github.com/memori-ai/memori-react/commit/7cfb9e5071bb0279ceeaa99732eaabf2502215c6))
* add white listed domains filter from layout config ([3fe2522](https://github.com/memori-ai/memori-react/commit/3fe2522db8a0cfdb3ea2dea27e60178d2bf0866a))
* add why this answer panel ([d525f17](https://github.com/memori-ai/memori-react/commit/d525f176d4cee1ed5aaecfd2994ed35704415f1e))
* add WithChatHistory story to showcase chat history functionality ([335a3db](https://github.com/memori-ai/memori-react/commit/335a3dbe26680310b06062b8c1033612b587a766))
* add WithExpandable story to Chat component and update snapshots for expandable chat bubbles ([ec0e37f](https://github.com/memori-ai/memori-react/commit/ec0e37f1ddb18a7fb6e178a4e9908aefe1b7e30f))
* add WithFunctionCache story to ChatBubble ([5b638a0](https://github.com/memori-ai/memori-react/commit/5b638a0bca964bc951d741b1787c9a4d2d5a325b))
* add WithPrivateAgent story to showcase private agent configuration in Storybook ([9b191dd](https://github.com/memori-ai/memori-react/commit/9b191dddee454bd2d212c300073a078365050b77))
* added additive action weights change ([0fe809e](https://github.com/memori-ai/memori-react/commit/0fe809e20e58bae196936a9f9109910c4c6bbce5))
* added AnimationLoader for flexible avatar animation management ([d0837a1](https://github.com/memori-ai/memori-react/commit/d0837a1d2e94a6ae898a12ed86258fb844425919))
* added AnimationParser for advanced avatar animation parsing ([f66daf2](https://github.com/memori-ai/memori-react/commit/f66daf20f7d2de994a240b91f8b31188b2b73e5d))
* added attached media handling for resume chat ([5da312c](https://github.com/memori-ai/memori-react/commit/5da312c83ad9f05b1ea77c3999b627ed1f5b3ff6))
* added comments to separeted handling for GLB and RPM ([893ad9f](https://github.com/memori-ai/memori-react/commit/893ad9f938fa6e323325b1803f4be636910f5aaf))
* added context for handling visemes and lips animation ([82d68e4](https://github.com/memori-ai/memori-react/commit/82d68e49c7354310b74dc34b8956e440cf7e7278))
* added emotion to XML audio tag ([c188673](https://github.com/memori-ai/memori-react/commit/c188673485078a6f001bc09f99c46a9349e5c184))
* added face mesh when animation is triggered and eye blink ([76c9374](https://github.com/memori-ai/memori-react/commit/76c937437ea7c111978823f57a6bcf24ff1eaa38))
* added idle random after every animation except for Loading ([18264fa](https://github.com/memori-ai/memori-react/commit/18264fa892a77bb7154548566039a3fc297d544b))
* added images deselection functionality integrated with API ([f03cda6](https://github.com/memori-ai/memori-react/commit/f03cda6e17baf3d041688ab4e06f3a220b25d119))
* added isactive flag for reusable button component ([ec80372](https://github.com/memori-ai/memori-react/commit/ec8037272912fce5f797c74d93b109594fc276ae))
* added isAvatar3D flag for making the Avatar Controls visible ([779b9ad](https://github.com/memori-ai/memori-react/commit/779b9ad610f0af067fe8219ef83e8b2b45d68233))
* added isTotem prop in Avatar Component for managing default avatar size for different layouts ([d704f9b](https://github.com/memori-ai/memori-react/commit/d704f9bcea7489a3eb00e719dc8d406e952d1d5b))
* added loading animations ([2c53776](https://github.com/memori-ai/memori-react/commit/2c53776529c303b2128ff28ac6adc15634d1ab54))
* added mistral and anthropic to completion provider status ([70f05ec](https://github.com/memori-ai/memori-react/commit/70f05ec763579ba75ff30b6fe984ee40ba48dfc5))
* added mouth movement using visemes based on the text provided ([af55d34](https://github.com/memori-ai/memori-react/commit/af55d342ab4150ea579c0d56ad7c8405674ecbf3))
* added new animations for Male and Female avatar ([0d63458](https://github.com/memori-ai/memori-react/commit/0d634586d311380d91b7825ce1628ddc7844d5d9))
* added new female animations ([8f26840](https://github.com/memori-ai/memori-react/commit/8f26840c4c4d395171941d0e7345e5aabc3ab724))
* added new hidden chat layout ([a83800d](https://github.com/memori-ai/memori-react/commit/a83800d87a8bdf71817ced43eb1592ea9008d2c2))
* added new lines before and after the content of the <document_attachment /> ([ad5bf12](https://github.com/memori-ai/memori-react/commit/ad5bf12864e33c92fbf96d63212d5082e0371f22))
* added new slider component ([d1bb0be](https://github.com/memori-ai/memori-react/commit/d1bb0be1757f47fbc7af483aee86ce7d2e48634b))
* added new zoomed avatar layout ([b031488](https://github.com/memori-ai/memori-react/commit/b03148818014ca193565131cfb313651c73c09b8))
* added position controller to handle height and camera depth of the 3d avatar ([c54ca4b](https://github.com/memori-ai/memori-react/commit/c54ca4b52149aee56a7d1b91d92874628318fbb9))
* added position controls for height and depth ([be348fd](https://github.com/memori-ai/memori-react/commit/be348fd17d27f17330e6b0910a144b78f53c3c9a))
* added script that make local web server working on emulator ([c62de47](https://github.com/memori-ai/memori-react/commit/c62de475703c0b303e2763991cfd3cf002e18582))
* added sequence animation handling system ([e2d6518](https://github.com/memori-ai/memori-react/commit/e2d65186a3a4d52d30b7d4cf9c47085adba4a56e))
* added showControls prop to Storybook ([fdb1f42](https://github.com/memori-ai/memori-react/commit/fdb1f4206b3ba8f949cdfe58d98568e53e0ca836))
* added smooth animation transition ([c6abba8](https://github.com/memori-ai/memori-react/commit/c6abba85e5d396e218fb556a9f607eeab3df5b28))
* added sperated blend shape emotions handling for RPM and custom GLB ([511e716](https://github.com/memori-ai/memori-react/commit/511e716788aa76670568649dcce7c533e214a966))
* added talking and loading animations triggered by corresponding props ([601f81d](https://github.com/memori-ai/memori-react/commit/601f81d520c7dda903be6ac74c4b7ef6544c48c4))
* added total consumptin  as new popover button in the Header ([eef32aa](https://github.com/memori-ai/memori-react/commit/eef32aaf3d270bdf6c814a737eb8ff9fc30560b6))
* added total consumptin  as new popover button in the Header ([5d70a17](https://github.com/memori-ai/memori-react/commit/5d70a17f936f689de035ada54645a6d5dd02209e))
* added unlogged images upload ([0697bfe](https://github.com/memori-ai/memori-react/commit/0697bfe61ad063f71eccde7270ffac47f91d8c3c))
* adjusted fixed positions for totem ([45edd05](https://github.com/memori-ai/memori-react/commit/45edd05aed3877af6c65dae9bb8d1c9db36e7467))
* allow Alt/Option+Enter to insert a newline ([7f20e8b](https://github.com/memori-ai/memori-react/commit/7f20e8b6199591a8d9bf66fc8506bb9779d14899))
* allow null position as negation, dont display that as venue ([17cd359](https://github.com/memori-ai/memori-react/commit/17cd35929d8a89433f12d29ddf712a86a7f1572c))
* apply integration config css properties, fix styles ([91d495d](https://github.com/memori-ai/memori-react/commit/91d495d352ce9ee6b17dc221ff534d0756ed0f74))
* artifact MIME icons, drawer context, and chat UI polish ([3ca7d96](https://github.com/memori-ai/memori-react/commit/3ca7d966f72e50dc38f4893de0e42513e248fe51))
* auto start prop, starts chat on load ([773feae](https://github.com/memori-ai/memori-react/commit/773feaeb5715c40ba61c27aba4dab3d44536cc94))
* blob pulse on speaking ([bd0ef1c](https://github.com/memori-ai/memori-react/commit/bd0ef1cb69e8277c07556b96b6e3167c23938ae1))
* centralized error handling inside the UploadButton ([e5e06ca](https://github.com/memori-ai/memori-react/commit/e5e06ca244cc8e55a4bf0ba27f4f6f0027d086e7))
* change typing with custom sentence, defaults with none, adds params to typeMessage ([4e18989](https://github.com/memori-ai/memori-react/commit/4e18989253421ea0c32fb617f7b9f1b90db6da18))
* change ui lang updating spoken lang ([d30b921](https://github.com/memori-ai/memori-react/commit/d30b9210ef6300fe1fe6704a620e8605fec3c8a5))
* **ChatBubble:** integrate file upload and preview features ([7651640](https://github.com/memori-ai/memori-react/commit/7651640e984afb4775cf73762a21825cb7715bb6))
* **Chat:** enhance chat inputs with file upload functionality and media handling ([2bdd9bb](https://github.com/memori-ai/memori-react/commit/2bdd9bb1a1a729edf9dc9c5b40f14fb48b40ebaa))
* checkbox indeterminate state ([e60a9c1](https://github.com/memori-ai/memori-react/commit/e60a9c1636ce044b3418ff3b8fdc668d61870654))
* conditionally apply and save position based on memori.needsPosition flag ([cf73ae3](https://github.com/memori-ai/memori-react/commit/cf73ae362c878b9c4566b2a1329c582e155edee1))
* consolidate avatar animation constants into a single file with the emotions mapping constants ([98d6085](https://github.com/memori-ai/memori-react/commit/98d60859bb349aadff34fca079378bb72c9c02bc))
* create AnimationRegistry for centralized avatar animation management ([0c735ef](https://github.com/memori-ai/memori-react/commit/0c735ef87e00bfd57efcdce20a99017e2992faa5))
* disable continuous speech when speaker is muted ([663fd94](https://github.com/memori-ai/memori-react/commit/663fd94ee782cbc79a0f10ec400e9736c082b866))
* enhance accessibility and  improving responsivness ([1dd4b2a](https://github.com/memori-ai/memori-react/commit/1dd4b2af93d809c01c990aa9cca8b151b3675948))
* enhance accessibility and localization across various components ([2841b2f](https://github.com/memori-ai/memori-react/commit/2841b2fe44259d8aae0e180901e59697a4f0b6ad))
* enhance ArtifactActions and ArtifactDrawer with mobile support ([541d979](https://github.com/memori-ai/memori-react/commit/541d979f4569c4b5cac8b00481d486dc41a3c72e))
* enhance ArtifactPreview component with improved iframe scrolling ([8e2f9b7](https://github.com/memori-ai/memori-react/commit/8e2f9b713bff452b9217663c46af8ea11eceecb4))
* enhance audio processing with Safari compatibility and silence detection ([fab7b50](https://github.com/memori-ai/memori-react/commit/fab7b5035af09fa09173b11057ad98578161c5ac))
* enhance AuthWidget with loading state and error handling for authentication ([fbb5882](https://github.com/memori-ai/memori-react/commit/fbb58829673a9f78fd04a98ec0e2c41466db0d7c))
* enhance avatar animations and add new story example ([a02564d](https://github.com/memori-ai/memori-react/commit/a02564df11cc1c2b71d6475ac772c1185007041d))
* enhance avatar detection logic for custom avatars with dynamic morph target checks ([ad8d6b8](https://github.com/memori-ai/memori-react/commit/ad8d6b8a437dd04b668b8fdc26b673f2e73e9c7d))
* enhance button and input focus styles ([3ba82f6](https://github.com/memori-ai/memori-react/commit/3ba82f6f9ff6d5ef1777de754c9ac288e3e8dbe1))
* enhance Chat and ChatBubble components with new media handling and styling improvements ([079cc7d](https://github.com/memori-ai/memori-react/commit/079cc7d856f62294b87645c590248fa368a83e29))
* enhance chat history search functionality and improve chat log display in ChatHistoryDrawer ([939bc5d](https://github.com/memori-ai/memori-react/commit/939bc5d9ef6e5c569992151136663d045e212fe5))
* enhance chat history search functionality and improve chat log display in ChatHistoryDrawer ([c871926](https://github.com/memori-ai/memori-react/commit/c871926e0020a526c72a0c04177cc970fc096251))
* enhance chat layout with artifact drawer and responsive design adjustments ([2c37bc5](https://github.com/memori-ai/memori-react/commit/2c37bc5cfb15ce56395157f98f3ff3466d97a5eb))
* enhance ChatHistoryDrawer and ShareButton components with new styles and functionality ([2173dd0](https://github.com/memori-ai/memori-react/commit/2173dd034e3d856744346ad5654a4c95611f53d5))
* enhance ChatHistoryDrawer with date display and layout adjustments ([5d6acb1](https://github.com/memori-ai/memori-react/commit/5d6acb174519d91cf1188fc768f38f88e4d3ae65))
* enhance CompletionProviderStatus component, improved status handling and visual feedback ([a0da536](https://github.com/memori-ai/memori-react/commit/a0da5363799e359255f02a3521c1e27a00daeebb))
* enhance component styles and layout across various modules, including z-index adjustments, responsive design improvements, and updated button interactions ([01536b8](https://github.com/memori-ai/memori-react/commit/01536b8ed44dfbc863fcb5d718d3e14a045abe62))
* enhance Expandable component with character and word limit options ([31b7e07](https://github.com/memori-ai/memori-react/commit/31b7e07818b9e358931b693a43b705ba6cc4f608))
* enhance FeedbackButtons and Header components with alert integration ([7e1faa8](https://github.com/memori-ai/memori-react/commit/7e1faa8c2a70953ddfb73428e61ce0a772bd65e9))
* enhance file upload and preview functionality with attachment handling ([85b37e4](https://github.com/memori-ai/memori-react/commit/85b37e4b55c37a8fd31ebeacc3483dab22d349c5))
* enhance FilePreview component to support image and document previews ([0d1dffc](https://github.com/memori-ai/memori-react/commit/0d1dffc315a3f74d69f5708f661322d55fa57910))
* enhance Header and HiddenChat components with new user actions and layout adjustments ([07e4599](https://github.com/memori-ai/memori-react/commit/07e459912b9bc440702fd0d684a1e13aa67a9c7d))
* enhance Header component with chat history button and tooltip integration ([f6cdfe1](https://github.com/memori-ai/memori-react/commit/f6cdfe14fbdf63e3bb82dff295121b791da3107b))
* enhance Header component with detailed chat consumption metrics and improved styling ([75d2809](https://github.com/memori-ai/memori-react/commit/75d2809e996d9c5af1ac147bc8acf01c54b3db8f))
* enhance Header component with responsive chat history button and brand avatar handling ([feec235](https://github.com/memori-ai/memori-react/commit/feec235e29977ebc34fd50d84caf3e56db408bdf))
* enhance image handling in MediaItemWidget with error handling and URL validation ([bfaab83](https://github.com/memori-ai/memori-react/commit/bfaab83f3edddef72e777e5eab5ecd0ebc0c91ae))
* enhance image handling in MediaItemWidget with improved error handling and URL validation ([68ac439](https://github.com/memori-ai/memori-react/commit/68ac4392654ef2e92661475238f78beb06d9a4a1))
* enhance language selection by grouping popular and all languages in StartPanel ([98a8db8](https://github.com/memori-ai/memori-react/commit/98a8db8501967a16c007e3a1c65f3fa9f38287e4))
* enhance login feedback by updating status message display and localizations ([5351527](https://github.com/memori-ai/memori-react/commit/53515270d53debaf4ebe513bbc96e3fcfbbe97ae))
* enhance LoginDrawer and StartPanel components with improved styling and structure ([cd18ba0](https://github.com/memori-ai/memori-react/commit/cd18ba0520fdd6566ae76eb8113609f2dd39a8b5))
* enhance LoginDrawer with OTP functionality and user data handling ([88abe88](https://github.com/memori-ai/memori-react/commit/88abe883f7dde4cb596d2215940d38d2dfae0fd7))
* enhance MathJax rendering and initialization in ChatBubble ([3fe76f5](https://github.com/memori-ai/memori-react/commit/3fe76f54d163ebe14b9c46ccf6f2cb80719b1de6))
* enhance MediaItemWidget interaction and styling for image links ([67c3d27](https://github.com/memori-ai/memori-react/commit/67c3d279e7cbc662b4b42338da69aa7eb935f8aa))
* enhance MediaItemWidget with improved media handling ([e2d5032](https://github.com/memori-ai/memori-react/commit/e2d503210bfc5384ed7e39ccf7d22ac406eaee6d))
* enhance MediaItemWidget with improved media handling and preview capabilities ([a7011e4](https://github.com/memori-ai/memori-react/commit/a7011e4cd59c7f808c491a1fcae526d5a7e973a5))
* enhance MemoriArtifactAPI with new global JavaScript methods for artifact management ([b94ebaa](https://github.com/memori-ai/memori-react/commit/b94ebaa123dd784be4507475d07d3a7421b9b811))
* enhance MemoriWidget and MobileSessionPanel with new layout options and session info display ([a67aab8](https://github.com/memori-ai/memori-react/commit/a67aab8b49f9ee00efc94b7f5920c2a0e32a821d))
* enhance MemoriWidget to support optional place data ([a486fda](https://github.com/memori-ai/memori-react/commit/a486fdab893da30020d317ace6d1981b637e115c))
* enhance message sanitization across components by implementing stripAllInternalTags function ([671a9d2](https://github.com/memori-ai/memori-react/commit/671a9d27a629746e08d4e0853f44b8e5bb14ca02))
* enhance message sanitization across components by implementing stripAllInternalTags function ([dff89cb](https://github.com/memori-ai/memori-react/commit/dff89cbe32a6cba521fee55ea99ebb43aa989b62))
* enhance mobile experience with modal for privacy and deep thought information ([feea227](https://github.com/memori-ai/memori-react/commit/feea227fadb27af8c7df749d0fc13d3c87f66da4))
* enhance organization of avatar animation configuration ([312f3a2](https://github.com/memori-ai/memori-react/commit/312f3a21f0edc1b4d7e6eae557666aa336ff2e08))
* enhance OTP login form with username input, validation, and loading states ([833bcf3](https://github.com/memori-ai/memori-react/commit/833bcf35d873ebcfeb3ec8634425b5ec381a881e))
* enhance pagination in ChatHistory and KnownFacts ([13713aa](https://github.com/memori-ai/memori-react/commit/13713aa18b2242e59dcf2a200495718653aa36d1))
* enhance paste handling with boundary checks ([fe24c1b](https://github.com/memori-ai/memori-react/commit/fe24c1b338c665e82dbbf38294f7c4af24ff41dd))
* enhance paste handling with boundary checks ([1950778](https://github.com/memori-ai/memori-react/commit/19507788e15f0ebb8ea94ed884421a0ebda6ffe7))
* enhance PDF text extraction with PDF.js fallback and dynamic file type support ([25964c7](https://github.com/memori-ai/memori-react/commit/25964c7730cf9ace1e10a41778f2e1faebd4de3f))
* enhance PII detection with tests ([3edd59e](https://github.com/memori-ai/memori-react/commit/3edd59e93ed796a1562c2595c1e770904f32e187))
* enhance snippet preview capabilities ([de3624f](https://github.com/memori-ai/memori-react/commit/de3624fa7610a07a1c89a2ebaaf0c67a8cca072f))
* enhance styling and layout across components ([df1809f](https://github.com/memori-ai/memori-react/commit/df1809fa91ea30157252b067c4d1e64ae40b0ecb))
* enhance styling and layout for chat and start panel ([bf80729](https://github.com/memori-ai/memori-react/commit/bf807294925add9dc9883fca7eaafce79f7c6439))
* enhance Typing component layout and add tooltip support for UploadButton ([72bae78](https://github.com/memori-ai/memori-react/commit/72bae7868b7410919f4fda516463f8c16e3c6785))
* enhance UI and UX across various components ([96b8b55](https://github.com/memori-ai/memori-react/commit/96b8b55d9f10f6e07b43193067cd43dda8d42bf9))
* enhance ui components ([4447ad7](https://github.com/memori-ai/memori-react/commit/4447ad7ee83f017d837c81ea67f5fe8f70eee3e8))
* enhance UI components by integrating new input ([f083bd1](https://github.com/memori-ai/memori-react/commit/f083bd15af6267881b010deb7a99b616ec0e70d9))
* enhance upload modal styling and layout for image previews ([ba08194](https://github.com/memori-ai/memori-react/commit/ba081940131c2d3578bc53e13d8adc7880da5d29))
* enhance UploadButton component with unified media upload limits ([cc9c564](https://github.com/memori-ai/memori-react/commit/cc9c56468afdfc62b3b944790273fda24b62f469))
* enhance UploadButton to support XLSX and CSV file uploads with improved error handling ([574a47c](https://github.com/memori-ai/memori-react/commit/574a47c273c1445ef8426cb7db8054279fff49fd))
* enhance UploadButton with image count indicator and improved upload menu styling ([c141517](https://github.com/memori-ai/memori-react/commit/c141517823b725cb48a0c640d876f24573bcc694))
* enhance WhyThisAnswer component with receiver details and context variables ([5251cb1](https://github.com/memori-ai/memori-react/commit/5251cb195f2cbe8da6a8867ed13abb2843a25dba))
* enhance XLSX file parsing and formatting in UploadButton component ([419d866](https://github.com/memori-ai/memori-react/commit/419d8669f74fe6ea9bc6d345b0c213c6092c0cd1))
* extended markdown parsing with tables, links, mathml + mathjax ([072ebae](https://github.com/memori-ai/memori-react/commit/072ebae83d91b8e1f0bd4ca2e2ebe04e447bcc67))
* **FilePreview:** add FilePreview component with styles, stories, and tests ([0bb6262](https://github.com/memori-ai/memori-react/commit/0bb6262b99828695d5acbdeadb0851e66ddbd042))
* fine tuned lip sync ([f8557ee](https://github.com/memori-ai/memori-react/commit/f8557ee744016967cb70cd4458ab869838027fbd))
* fine tuned lip sync ([5d71023](https://github.com/memori-ai/memori-react/commit/5d71023b78a1722872096a0577cb14cae8848eb8))
* fine tuned lip sync params ([25f6d53](https://github.com/memori-ai/memori-react/commit/25f6d5328855564f8ae186e31d1f070d472dd0dc))
* fix loading animations, united in one glb ([e56fbd3](https://github.com/memori-ai/memori-react/commit/e56fbd33e8614f9f74d2d8f2462af454213e40f4))
* fixed viseme handling for TTS ([e284034](https://github.com/memori-ai/memori-react/commit/e284034990990cc48e559466dfb8183b19d6bbaa))
* for slider component improved compatibility for mobile and animations ([e32d511](https://github.com/memori-ai/memori-react/commit/e32d511f356234f64e7d8e0f10ac6725572a9813))
* for TOTEM layout get the position values from the local storage otherwise are fixed ([85624a3](https://github.com/memori-ai/memori-react/commit/85624a3498011f2092325573d8b49ec2e0ee9974))
* half body and full body dynamic position update ([3b2f1a6](https://github.com/memori-ai/memori-react/commit/3b2f1a6deda00a8a67925d9a74ecf5ea62a9d570))
* implement AnimationStateMachine for advanced avatar animation control ([1aefb00](https://github.com/memori-ai/memori-react/commit/1aefb00129bc6c5bce01308c71bca56f3a8ab285))
* implement artifact auto-opening and enhance artifact handling in chat ([c7a3720](https://github.com/memori-ai/memori-react/commit/c7a372029b8b2d0864e5cc329bc66a6d180cc581))
* implement AvatarAnimator as comprehensive animation management system ([3049ef7](https://github.com/memori-ai/memori-react/commit/3049ef77125a1b5986b00029f8a3366594e1984e))
* implement chat history pagination and enhance chat log display in ChatHistoryDrawer ([6bfdcc1](https://github.com/memori-ai/memori-react/commit/6bfdcc18e331ae8c933c0446a7c074cfb252b730))
* implement ChatResumeDrawer component with new styles and functionality for resuming conversations ([0cef69c](https://github.com/memori-ai/memori-react/commit/0cef69cbe38f164ef551cf24143bed9359e70e67))
* implement copy buttons for user messages in ChatBubble component with feedback ([1af6569](https://github.com/memori-ai/memori-react/commit/1af6569ebb7b197562f5f842ec19fd3f94007433))
* implement custom markdown rendering in ArtifactDrawer ([1405c48](https://github.com/memori-ai/memori-react/commit/1405c48a89e5815bd7031265e4f39cd061227682))
* implement custom markdown rendering in ArtifactDrawer ([4677132](https://github.com/memori-ai/memori-react/commit/46771327d99302e5a02aa3fb4f2a8bc208a27919))
* implement custom minimum messages filter in ChatHistoryDrawer with localization support ([54f3146](https://github.com/memori-ai/memori-react/commit/54f31468fb9f62355b550a3ac7efb5100e03b495))
* implement custom trigger functionality in ChatConsumptionDropdown tests ([8e742d8](https://github.com/memori-ai/memori-react/commit/8e742d84f8d89d06706def494c9088e0f38564a9))
* implement date range filtering for chat history ([2027a30](https://github.com/memori-ai/memori-react/commit/2027a3074d79f0e64782d02ceef6f2fba2cf2df4))
* implement drag-and-drop file upload functionality in Chat component ([e7b3a21](https://github.com/memori-ai/memori-react/commit/e7b3a212bbeadc3ecb40a4dbeda39faf9cd22463))
* implement Dropdown component with styles and Logout icon ([68f09ec](https://github.com/memori-ai/memori-react/commit/68f09ec09c6cafabf56b29ca5bef597d7dca1249))
* implement enhanced artifact detection and processing in ArtifactHandler component ([00d0b36](https://github.com/memori-ai/memori-react/commit/00d0b36803a5a8584de4397301a08e12c1413f82))
* implement fullscreen functionality for hidden chat layout and fixed reopening chat ([1158775](https://github.com/memori-ai/memori-react/commit/1158775fe8cc904dcf01c9350095f8fcf35cd2c6))
* implement image title input and preview modal in upload functionality ([a1358c1](https://github.com/memori-ai/memori-react/commit/a1358c144fed1f76370423ffe12812e4c9427892))
* Implement localized placeholders for date inputs ([5fa4176](https://github.com/memori-ai/memori-react/commit/5fa417638d36feded39da37d7dae7725eca716dd))
* implement logic for avatar3dHidden prop in MemoriWidget ([609ed74](https://github.com/memori-ai/memori-react/commit/609ed74978c1197159754fcf9357431a96e38b57))
* implement markdown rendering and PDF export enhancements for Safari compatibility ([6bf1990](https://github.com/memori-ai/memori-react/commit/6bf19907083fb2b4a593ced9cb215412f052d846))
* implement OTP login functionality in LoginDrawer ([b378ed3](https://github.com/memori-ai/memori-react/commit/b378ed3c8c2821cbd1ae858cb406f8273967fd50))
* implement partial asset upload handling and add corresponding translations ([8f0797e](https://github.com/memori-ai/memori-react/commit/8f0797edfe559847dcd51a113860a7a08c985e6d))
* implement partial asset upload handling and add corresponding translations ([a11c513](https://github.com/memori-ai/memori-react/commit/a11c513f8cc95ae84c441c5214c417d72f1c350e))
* implement paste handling for text input ([33561d3](https://github.com/memori-ai/memori-react/commit/33561d3125d7e8359cc448bd937a6ac0b310cbda))
* implement paste handling for text input ([36836f6](https://github.com/memori-ai/memori-react/commit/36836f652dc6af54f943b842667175ad95368c45))
* implement PII detection configuration ([02be73c](https://github.com/memori-ai/memori-react/commit/02be73cc1f62247a331143c1cad60009dc7c24d4))
* implement resume chat functionality in ChatHistoryDrawer with updated UI elements ([200c456](https://github.com/memori-ai/memori-react/commit/200c45684cc5665217669ef0aeb5ac82faf451e5))
* implement server-side pagination for chat logs in ChatHistory component ([c3ad0ba](https://github.com/memori-ai/memori-react/commit/c3ad0baf08a5e00e613cb493b9a9a1c0364d7c63))
* implement spaced layout for header buttons in MemoriWidget ([f4604f0](https://github.com/memori-ai/memori-react/commit/f4604f0a3042fe6d62d651f44d969eaa04663d7c))
* implement theme-aware styling ([af72e67](https://github.com/memori-ai/memori-react/commit/af72e67fde6027bf8f577473a09952b234d49fbe))
* implement user avatar upload functionality in Header component ([e936f14](https://github.com/memori-ai/memori-react/commit/e936f1434d8ccb9c333c46efd9ad24b0b2be020f))
* implement WAV format conversion for Azure STT support in useSTT hook ([4b10032](https://github.com/memori-ai/memori-react/commit/4b10032998274ba738c66c69d532f7bc4544cfc0))
* import helpers ([a8a73b6](https://github.com/memori-ai/memori-react/commit/a8a73b6a177c4799394c52eeb9a10311b8d6654e))
* import new feedback + completions disclaimer ([8fe3170](https://github.com/memori-ai/memori-react/commit/8fe31703c6c0602c76008c532591e74ae9de5c42))
* improve accessibility and localization by adding aria attribute--no-verify ([ebc6167](https://github.com/memori-ai/memori-react/commit/ebc6167b852b0a96a9784cad4fb28cd7dc126438))
* improve accessibility by adding aria-labels and aria-hidden attributes to ShareButton ([6d8cbd0](https://github.com/memori-ai/memori-react/commit/6d8cbd087b67a4e83a1ecead353ad85d93b1124b))
* improve AuthWidget validation and error handling ([607fb5d](https://github.com/memori-ai/memori-react/commit/607fb5d685eeba054fafbe55ceb2df771e8463ec))
* improve CSS styling for Blob component ([92bed78](https://github.com/memori-ai/memori-react/commit/92bed7807d0762c30615a571d56f36b958632a0e))
* improve file preview interactions ([5eda278](https://github.com/memori-ai/memori-react/commit/5eda27835e0a70a4b30a0812e8866dc14d50822c))
* improve file preview interactions ([cd4bbb4](https://github.com/memori-ai/memori-react/commit/cd4bbb44722d2c1858e16e339b1e384505ddfdbf))
* improve file upload with robust error handling and validation ([1851d5e](https://github.com/memori-ai/memori-react/commit/1851d5ec8d96031c3c4401e1e6eb0066772d8983))
* improve lip sync ([#20](https://github.com/memori-ai/memori-react/issues/20)) ([e13f520](https://github.com/memori-ai/memori-react/commit/e13f520eb91bd8af1cc42578da29316f0b25033e))
* improve media handling and user interaction in MediaWidget ([64f5a23](https://github.com/memori-ai/memori-react/commit/64f5a23f0036351d3cb0375ac354664407dee5f1))
* improve mobile chat and session panel UX ([09c22cc](https://github.com/memori-ai/memori-react/commit/09c22cc9fc4dc4372f8a738573ac0e0ff071873b))
* improve RPM avatar detection and animation merging logic ([1e86edb](https://github.com/memori-ai/memori-react/commit/1e86edb8c294d3a59e4223a3a654077fc3de5f95))
* improve silence detection and audio activity analysis in useSTT ([50260a9](https://github.com/memori-ai/memori-react/commit/50260a98f7457b0a86e4155932e9f9b007285f93))
* improved fullbody avatar state management ([ddac623](https://github.com/memori-ai/memori-react/commit/ddac623afcd4ca58cd887b35d950cf23d3caf8f2))
* improved UI of Chat History component ([210ef22](https://github.com/memori-ai/memori-react/commit/210ef223c67c7ec2f17f7847ab0952c4037c06af))
* integrate [@memori](https://github.com/memori).ai/ui components ([82e4d9f](https://github.com/memori-ai/memori-react/commit/82e4d9f348eabd468071fedef72941d596a11623))
* integrate alert system in ChatHistoryDrawer ([51775e3](https://github.com/memori-ai/memori-react/commit/51775e3def6b07caa2095ef23f1af88c902277da))
* integrate artifact context into HiddenChat and adjust sidebar toggle styles ([8f27bec](https://github.com/memori-ai/memori-react/commit/8f27bec47128cb217c805c6833a6637ba4629c7e))
* integrate ArtifactProvider into Avatar, Header, and MemoriWidget stories ([1724b72](https://github.com/memori-ai/memori-react/commit/1724b72abc10ea772ed82f5fb14ec4485aa38642))
* integrate ArtifactSystemProvider for enhanced artifact management across layouts ([3201f45](https://github.com/memori-ai/memori-react/commit/3201f454b14a2880bb3f3e5cf72f6d7fa380d445))
* integrate chat history functionality into Header and MemoriWidget components ([830a4c7](https://github.com/memori-ai/memori-react/commit/830a4c75e9b3f0a88ce5c2fa4ce8e2d1eb8322c2))
* integrate ChatHistoryDrawer styles and implement pagination for chat logs ([4975190](https://github.com/memori-ai/memori-react/commit/4975190ac6c24e4b6bcf237129474470961e3e9a))
* integrate Expandable component in ChatBubble and WhyThisAnswer for improved text display ([0509d65](https://github.com/memori-ai/memori-react/commit/0509d6574eae7aeb94b3eb0fda4f1577fe1159b9))
* integrate Memori table into i18n and enhance ChatHistoryDrawer styles for improved layout ([f121690](https://github.com/memori-ai/memori-react/commit/f121690f1b473e1062e501f9c00fb08fb8d4ae41))
* integrate MemoriArtifactSystem for enhanced artifact handling in chat ([d1f6cd9](https://github.com/memori-ai/memori-react/commit/d1f6cd91e503d9fad1fc1b86a4c3d3556c7000f7))
* integrate preview file management in Chat components ([6349fed](https://github.com/memori-ai/memori-react/commit/6349fedbad42c1977194e897280fbd6b0d58cb86))
* **internal:** allow integration object as prop ([63b3f0f](https://github.com/memori-ai/memori-react/commit/63b3f0f3c005741ff062b101212d53a57a342df7))
* introduce ArtifactAPIBridge for global access to artifact management functions ([baa0175](https://github.com/memori-ai/memori-react/commit/baa0175e347764873764e58276be6d7e6e4545fb))
* **lang:** updated lang ([388de3f](https://github.com/memori-ai/memori-react/commit/388de3feab6d7f239d52d7160c801dfd8edd55ec))
* **lang:** updated translations ([b7cea50](https://github.com/memori-ai/memori-react/commit/b7cea5050b2b0b00cee989e7bc8aa2dc549c1ca1))
* load azure token from api ([9dc0116](https://github.com/memori-ai/memori-react/commit/9dc0116fe82bb133919b30fea00437ae672f91b6))
* localize pasted text label ([3a6bf5d](https://github.com/memori-ai/memori-react/commit/3a6bf5d7e8a3fddf30a2cb58c5419f3bdf1a82d3))
* localize pasted text label ([df8d637](https://github.com/memori-ai/memori-react/commit/df8d63768d1e10743dbb87ca301b0df737b39a31))
* made avatar mesh transitions smoother and added emotion animation based on chat tag ([82a1fae](https://github.com/memori-ai/memori-react/commit/82a1faea17280174875a6ad80d477b66c9816063))
* markdown parsing for user messages too ([34f991d](https://github.com/memori-ai/memori-react/commit/34f991dceec9a04e501faab2f0947678a9d40ce3))
* math markdown parsing by flag (config or props) ([31c272f](https://github.com/memori-ai/memori-react/commit/31c272fc47825a2292e3a620df55c9a3c615c855))
* new additionalInfo on OpenSession params ([93f7e0e](https://github.com/memori-ai/memori-react/commit/93f7e0e7389a5a73950f1ccc9c85584092efd301))
* new event MemoriNewDialogState emitted when receiving new state from engine ([9da9690](https://github.com/memori-ai/memori-react/commit/9da9690173d7cd140baac6a7f2aa611eb8b12ddb))
* new prop default speaker active ([f854573](https://github.com/memori-ai/memori-react/commit/f8545737a47c4fdcaf1febf52a5d32f88e49b9bb))
* open links in another window ([a7825f7](https://github.com/memori-ai/memori-react/commit/a7825f790d856135279fa5103ae0b1fb746317bd))
* optimize Avatar Canvas rendering performance ([7147cb2](https://github.com/memori-ai/memori-react/commit/7147cb209a31814828b7bdb19a35aa83ce8ad09e))
* pass memori prop to MemoriWidget for enhanced functionality ([ff64219](https://github.com/memori-ai/memori-react/commit/ff64219ddbb7d59e50599ee35f067df183640fb0))
* passed enablePositionControl to avatar component ([1177358](https://github.com/memori-ai/memori-react/commit/1177358b6bdc9b59d03aaabc9022fe0cc8349cdb))
* preserve login token ([2765ec5](https://github.com/memori-ai/memori-react/commit/2765ec5f0d3b18ec9935847f3bb6147fd2cfcfa9))
* refactor DateSelector for mobile/desktop inputs ([1199989](https://github.com/memori-ai/memori-react/commit/1199989ebc729f368a58abd0a6028d9bcc1b6727))
* refactor ShareButton for HTML-based export ([1a8bb55](https://github.com/memori-ai/memori-react/commit/1a8bb55fec9e6d7a36da486ec26f7160c484977d))
* refactor styles, add powered by ([3605c04](https://github.com/memori-ai/memori-react/commit/3605c04ca9c7cd7a6421095411204e5561f73dc2))
* refactored Drawer component with advanced features and improved UX ([729d188](https://github.com/memori-ai/memori-react/commit/729d188b1ddf9fdf97584309359813b8dd88f77a))
* refine message rendering and translation handling with improved tag processing ([848d491](https://github.com/memori-ai/memori-react/commit/848d4916620a86e930bfc74c8a24cfd45560186c))
* reintegrated AccountForm component for user account management ([d3f3284](https://github.com/memori-ai/memori-react/commit/d3f3284856877d24a326e8702ede473ca7fbacb2))
* reintroduced old lip sync system ([3626b55](https://github.com/memori-ai/memori-react/commit/3626b55b8098fc2b832d9b7f74104c13bfc127fc))
* reintroduced old lip sync system ([0678e46](https://github.com/memori-ai/memori-react/commit/0678e46f93ece534e7ecff6784dc5430ea67428b))
* remove 'postPlaceChangedEvent' and send position through 'postTextEnteredEvent' ([7c63f45](https://github.com/memori-ai/memori-react/commit/7c63f45156766a3552d12855a242172b36d0cbf5))
* removed scroll beahviour for ZOOMED FULL BODY ([2c9e1ae](https://github.com/memori-ai/memori-react/commit/2c9e1ae9eb468d68fe9b0892f00b03c8fbb41ed4))
* removed unused hooks and linked context function for lips animation ([dea3740](https://github.com/memori-ai/memori-react/commit/dea374098259671f4117ec6b77747f989088d7e1))
* reopening chat session with new flag 'continueFromChatLogID' ([26029ec](https://github.com/memori-ai/memori-react/commit/26029ec2a40ea3af7d024039250a4d8052264e64))
* reorganized Website Assistant layout stories ([ba9c9b1](https://github.com/memori-ai/memori-react/commit/ba9c9b130821141de93c48d31e10b24da21b166a))
* resume previous session with sessionID set ([8524d85](https://github.com/memori-ai/memori-react/commit/8524d85f41f5a4cc17f9c876d220f0e36c02dab0))
* save position to localStorage ([4dd10dc](https://github.com/memori-ai/memori-react/commit/4dd10dc3223e0c1b2a3e9a6ee32a88ca7e7d30b5))
* set user interaction timeout from engine state if set, calc random otherwise ([6d4bace](https://github.com/memori-ai/memori-react/commit/6d4baced6df8d9e743a4286cc29493fde709b9cb))
* settings drawer added enable controls checkbox ([792cae0](https://github.com/memori-ai/memori-react/commit/792cae0e876085c4c1521ccbfb6a2882ad83e8d3))
* share chat link in share button ([53d33f5](https://github.com/memori-ai/memori-react/commit/53d33f59e58db690e92780fabd76eadd829ae840))
* share qr code with tenant logo, retrieve tenant data and config from api ([42cf28f](https://github.com/memori-ai/memori-react/commit/42cf28f4befa30c3d0079ce8e4725f94965a55de))
* show completion provider status if down ([d5f31fb](https://github.com/memori-ai/memori-react/commit/d5f31fbc9b5d8408f8a61f99ed96eca599618a1e))
* show typing text after 30s ([4b53e75](https://github.com/memori-ai/memori-react/commit/4b53e756c782b73d9c5b67d24988c0bcf7e921f6))
* sort chat history icon ([3c5eab1](https://github.com/memori-ai/memori-react/commit/3c5eab1eaafa4002f52a09b7969844d1156f62e1))
* standardize confirm dialog translations across locales ([60f380d](https://github.com/memori-ai/memori-react/commit/60f380dca44dda46d6d30b993561234dcf84cd85))
* standardizing image source resolution ([cd57bf2](https://github.com/memori-ai/memori-react/commit/cd57bf2b16837358eb6eb4342ce966d6fe6cd357))
* **style:** updated opacity for website assistant layout ([ee89183](https://github.com/memori-ai/memori-react/commit/ee891834d7e4f4646c7c8e8f7773d66026f10303))
* support for login-required sessions ([631388a](https://github.com/memori-ai/memori-react/commit/631388afa101d4b41d29feff1e0880a4b924e32f))
* synchronize local state with fullscreen changes in Header component ([2fa1a1d](https://github.com/memori-ai/memori-react/commit/2fa1a1d35ebc7ecde87a2c93e7823127bde021bc))
* **temp:** modified default prop show animations controls to true ([a3b2adc](https://github.com/memori-ai/memori-react/commit/a3b2adcb6cda2db5506e4724158bf9510f4049ad))
* typeMessage(hidden) awaits previous emission to be read before submitting ([85ac7ae](https://github.com/memori-ai/memori-react/commit/85ac7ae72dcc3cf8e759a25b5df017d361e47355))
* **ui:** add margin to chat inputs in website assistant layout ([d488e14](https://github.com/memori-ai/memori-react/commit/d488e1412c3d0ef266af79bf818e516e3fe65790))
* **ui:** enhance responsiveness of chat and start panel components ([cad3abf](https://github.com/memori-ai/memori-react/commit/cad3abf7c2e468ae65f4606072540ac4fef3e311))
* **ui:** enhance styling and responsiveness across components, update translations for clarity ([3e13a9f](https://github.com/memori-ai/memori-react/commit/3e13a9fac79ac35372ad30930cc334ab8df3b772))
* **ui:** implement text sanitization for ChatBubble and WhyThisAnswer components ([1759b5b](https://github.com/memori-ai/memori-react/commit/1759b5bd660afc17aece24a682052e2f3d9c0364))
* **ui:** implement text sanitization for ChatBubble and WhyThisAnswer components ([2cae536](https://github.com/memori-ai/memori-react/commit/2cae536da331fd528d383733b83405c664907b22))
* **ui:** improve MobileSessionPanel button styles and update translations for consistency ([8fa0078](https://github.com/memori-ai/memori-react/commit/8fa007820ed4d0b5fd5aa39c088c36ba2ab7295f))
* **ui:** refine fullpage/zoomed layouts and storybook setup ([470d059](https://github.com/memori-ai/memori-react/commit/470d059b43b43d012c63d7d1796a595a7fdb353c))
* **ui:** refresh header, layouts, powered-by, and i18n ([1c3c8e2](https://github.com/memori-ai/memori-react/commit/1c3c8e2d8c697ccf64749eb27a1d6a96ab375fa4))
* **ui:** update [@memori](https://github.com/memori).ai/ui to version 1.14.0 and enhance popover trigger button active states ([637d944](https://github.com/memori-ai/memori-react/commit/637d9444f45d66380bb32d1ab875f667cb9ab04a))
* **ui:** update styling for header and chat components, enhance position popover functionality ([bc7cdba](https://github.com/memori-ai/memori-react/commit/bc7cdba1361eb3a0707475d58a5d38150aa8a32d))
* update [@memori](https://github.com/memori).ai/ui ([e8ca002](https://github.com/memori-ai/memori-react/commit/e8ca002a61bbfb8054a43d5db6abafa81fc3eb1a))
* update chat resume functionality in ChatHistoryDrawer and adjust initial state in MemoriWidget ([cbc78b6](https://github.com/memori-ai/memori-react/commit/cbc78b61f82ea9515eeb7b6523fcdf5535367bcb))
* update ChatConsumptionDropdown to improve AI usage display and improved responsivness ([0e6b189](https://github.com/memori-ai/memori-react/commit/0e6b1891161b97260adafc0269811dc264a393c3))
* update Header component to use localized strings for total chat consumption ([87f21c5](https://github.com/memori-ai/memori-react/commit/87f21c5cc5eed59babbe32c322bb9033ba280fee))
* update Header component to use localized strings for total chat consumption ([6173c7e](https://github.com/memori-ai/memori-react/commit/6173c7e880aeed5947fa74f0abfa0854231f8e99))
* update layout styles and button margins for WebsiteAssistant ([73bdf4d](https://github.com/memori-ai/memori-react/commit/73bdf4ddf08edfe8994c8631c100684073e8a578))
* update layouts and chat components ([6b4382e](https://github.com/memori-ai/memori-react/commit/6b4382eac91aeeeffdc2395ae9395849c9a18b82))
* update MemoriWidget to conditionally send dateUTC ([81f5c50](https://github.com/memori-ai/memori-react/commit/81f5c504022b8c186b5369921bc42b40b672349d))
* update paste handling to allow inline pastes ([64f0ee2](https://github.com/memori-ai/memori-react/commit/64f0ee282a6e5d8e77bf3fb307d9f58a853aae6f))
* update paste handling to allow inline pastes ([8bc1f53](https://github.com/memori-ai/memori-react/commit/8bc1f53655062ad2b5a95f2680fac68f10fbebb1))
* update PII detection rules to support localized labels ([1629c74](https://github.com/memori-ai/memori-react/commit/1629c7406d559a1b7e478270fba3aec08e5418ef))
* update styles for responsive alert viewport, enhance button styles, and improve layout consistency across components ([435d310](https://github.com/memori-ai/memori-react/commit/435d310db86c399df1d0a2cd6ceccabc5b33f01c))
* update Tooltip alignment options and enhance z-index for better layering ([b1e8810](https://github.com/memori-ai/memori-react/commit/b1e8810721daf030f586eee0019ed47797455ba8))
* updated skinned mesh name for the latest glb released ([278ccb8](https://github.com/memori-ai/memori-react/commit/278ccb86ca13b70714e50ad44675f690c961a877))
* updated slider component, now the label can be a ReactNode ([f213711](https://github.com/memori-ai/memori-react/commit/f2137111475af423e5006c3e4049773c916d6de9))
* updated snapshots ([9a04d6d](https://github.com/memori-ai/memori-react/commit/9a04d6dd210e839534615b236701de3f80e6b5c6))
* **UploadButton:** add file upload component with styling and stories ([bd9d526](https://github.com/memori-ai/memori-react/commit/bd9d526473c9531bb5f3cbc159cef04aeeef6573))
* **upload:** enhance error handling and user feedback ([bac9431](https://github.com/memori-ai/memori-react/commit/bac943132cb017799d9a0ac6f7341890fcfac628))
* **upload:** enhance error handling and user feedback ([7f71b30](https://github.com/memori-ai/memori-react/commit/7f71b303b7bc4df00a1a6a5a785d8536b44ce071))
* **upload:** smart upload — partial upload when over file or payload limits ([45b7825](https://github.com/memori-ai/memori-react/commit/45b78259eacd79a4401e71073a793eeae9dc416a))
* **upload:** smart upload — partial upload when over file or payload limits ([b70767e](https://github.com/memori-ai/memori-react/commit/b70767e98cb0cb30a4be0503d887267cbd210277))
* use known facts ui, add action in header, add deep thought disclaimer ([b516184](https://github.com/memori-ai/memori-react/commit/b5161848f3f2f6308139ed7a5a7b9bd4104b4df5))
* working on widget ([5af9d82](https://github.com/memori-ai/memori-react/commit/5af9d8280ad52d2bb3787b8441bc1ada5b4d109c))


### Bug Fixes

*  localization strings ([d98f091](https://github.com/memori-ai/memori-react/commit/d98f0913d4f7f324fde504c16ec342a1878b04ed))
*  preview medium file for documents and images ([7b28cd0](https://github.com/memori-ai/memori-react/commit/7b28cd0d8b0abe53c2d104444be65a7d5722fea1))
* **a11y:** add aria label on hidden chat controls ([c858262](https://github.com/memori-ai/memori-react/commit/c858262eae34c969775cd3caedb5ced4c7aaa44d))
* account form validation ([37eb892](https://github.com/memori-ai/memori-react/commit/37eb8920a3647d8981ba034dc8b227d852e5ec71))
* add modal import ([8d9bd4a](https://github.com/memori-ai/memori-react/commit/8d9bd4acc4f7e4688a598e5d89038c4ab14cb3e7))
* add RTL support to MediaWidget link items ([afea49c](https://github.com/memori-ai/memori-react/commit/afea49c06716e24d0a2c570283278544f0bc5142))
* add showSettings prop from integrationConfig ([d6fe636](https://github.com/memori-ai/memori-react/commit/d6fe6362f6f5e0ae8cf93501137fdee1e197c5c1))
* add webkit prefix for backdrop filter ([5c57636](https://github.com/memori-ai/memori-react/commit/5c57636166a21e29fc05e3b8d0f349ea5625c1bb))
* added 'memori-' to all of hidden chat classes ([adebe23](https://github.com/memori-ai/memori-react/commit/adebe23427d249be67b9ee138f32dcaa312af672))
* added DateSelector inside the Jest ignore patterns ([92787c6](https://github.com/memori-ai/memori-react/commit/92787c6db38d88fb5f5ff56dca732e2bf29c7a40))
* added padding to HIDDEN_CHAT layout ([5856be7](https://github.com/memori-ai/memori-react/commit/5856be7e9d3fb6db731d765364ff2a26777ea6b4))
* adjust artifact opening logic based on chat log panel state ([c76f35b](https://github.com/memori-ai/memori-react/commit/c76f35b983fa24cbf59f866c2a63a06c74bc305e))
* adjust image compression quality and add HEIC handling ([0b64fc2](https://github.com/memori-ai/memori-react/commit/0b64fc2c748a87f67cdddcd0586c93a2f5dd2b69))
* adjust min-height property in chat layout for better responsiveness ([065a8ee](https://github.com/memori-ai/memori-react/commit/065a8ee63ee32a2c040c5fc9a7d791a7d6dbfe28))
* adjust silence timeout handling in useSTT hook for accurate recording control ([7c831b0](https://github.com/memori-ai/memori-react/commit/7c831b091d59ea0802f7904f900f35ce6e98404b))
* adjusted half body avatar component woth lip sync and blink ([5c8f8cd](https://github.com/memori-ai/memori-react/commit/5c8f8cd201cbcd4ac00e53779d2d31b8e8e8f9da))
* adjusted ZOOMED FULL BODY layout style ([cefab1e](https://github.com/memori-ai/memori-react/commit/cefab1e4759a4a01c50cd21c3c828ae6a1cbe3c1))
* age verification modal zindex ([3ce6ec7](https://github.com/memori-ai/memori-react/commit/3ce6ec76aa347d2b015addee51fb8396b22c1a40))
* **AgeVerificationModal:** update z-index for improved modal visibility ([ddbe6e3](https://github.com/memori-ai/memori-react/commit/ddbe6e39812b0070df06c8d05d19fde3da900232))
* **AgeVerificationModal:** update z-index for improved modal visibility ([39043c7](https://github.com/memori-ai/memori-react/commit/39043c779b30551bc66b79c8901b2228ad3a1956))
* aggregate whole trascript in usermessage after pause ([ddc800f](https://github.com/memori-ai/memori-react/commit/ddc800f65c46af42a1445f07e5d76cd149ed0090))
* aligned user media items to the right ([790031d](https://github.com/memori-ai/memori-react/commit/790031dec51455e5f8df5cb69face522ac54af22))
* alignment of the media items ([b17890d](https://github.com/memori-ai/memori-react/commit/b17890ddff229531a1e54f66c0a925814a0e1870))
* allow global methods within webcomponent ([afa5133](https://github.com/memori-ai/memori-react/commit/afa513316329e31e02ed531d6808c1f1bce9dbd8))
* animate mouth speaking if speaking and not speaker not muted ([565a543](https://github.com/memori-ai/memori-react/commit/565a543ec51094c4e206caf50c0cff32ab11fdb3))
* apply integration css vars customizations to modals and drawers ([3ce73b2](https://github.com/memori-ai/memori-react/commit/3ce73b29208df84f124de5df4c58a147309295ff))
* async events for dates, updating and hints conflicts ([9d81255](https://github.com/memori-ai/memori-react/commit/9d81255f4f362e07a1f3eb10406f1824a93c5fab))
* audio first message ([773307f](https://github.com/memori-ai/memori-react/commit/773307ffd80c3dea7022e2b849e41dc7e0b24409))
* audio issues, refactor tts ([e66c83a](https://github.com/memori-ai/memori-react/commit/e66c83a35e1a98ae7e24ee532923653d9032c3f3))
* auto translate ui if not multilingual ([754f6a8](https://github.com/memori-ai/memori-react/commit/754f6a8ba00f7229ee5543d87d743cbdb6e97e11))
* automatically send msg only if listening ([c7fb638](https://github.com/memori-ai/memori-react/commit/c7fb638131774db0e0f00f7b6c61287a9881f0d2))
* autoStart default for hidden chat layout ([c0e2f8c](https://github.com/memori-ai/memori-react/commit/c0e2f8cbe333d93216637fa963de5842f3edb5fb))
* avatar 3d animations, fine tuned lip sync values and removed useless function to useEffect ([1a51c26](https://github.com/memori-ai/memori-react/commit/1a51c26a0220bc9a312c7c34072188e642742111))
* avatar fullbody animations male vs female ([c5366a5](https://github.com/memori-ai/memori-react/commit/c5366a503e1c88473e769232c77cb3f50583bfe0))
* avatar view add suspense ([b3d21ca](https://github.com/memori-ai/memori-react/commit/b3d21ca5cba02d8120297930935a35c1c7873e4e))
* avoid issues with square brackets in text with markdown and math parsing ([a87569f](https://github.com/memori-ai/memori-react/commit/a87569f4be1f71217243b6d74dbfd20c8df64a71))
* baseurl from tenant protocol parsing accepts local http ([d1d595a](https://github.com/memori-ai/memori-react/commit/d1d595a7572444584ecedfa5de072795dffaa0e2))
* better parsing initial context and question ([52a0bef](https://github.com/memori-ai/memori-react/commit/52a0bef4fc65ce17910f9f4b590359229f366a7b))
* better parsing initial context and question ([9972821](https://github.com/memori-ai/memori-react/commit/9972821fb1d64243cdb1094028ebfc0087e60b94))
* blob styles ([56d1e5f](https://github.com/memori-ai/memori-react/commit/56d1e5fc941ebc7c487381cc804561c1569853d1))
* board of expert twin avatar fallback ([32ca5f3](https://github.com/memori-ai/memori-react/commit/32ca5f3750f4d12ac9af616961436453a6f8cbe8))
* boe avatar url ([7e32f25](https://github.com/memori-ai/memori-react/commit/7e32f254a2892396f9f881677e9a5dfe7611888a))
* bug was causing session errors loops for 403 ([ec8ff79](https://github.com/memori-ai/memori-react/commit/ec8ff790e670ca2b5cfe65053ad43ad7328bbc4c))
* button selector to click in typeMessage ([493c7a0](https://github.com/memori-ai/memori-react/commit/493c7a094d965f889ae037013c1484cb036cda24))
* center align loading and no results messages in VenueWidget and removed kated props ([9f84fae](https://github.com/memori-ai/memori-react/commit/9f84faed5cca8aeb2ae5f9ecfdf9467883054a81))
* change avatar parameter type from Blob to File in updateAvatar function ([1911c15](https://github.com/memori-ai/memori-react/commit/1911c15dce2b0513e8003b6e029f7f3f4780e240))
* change avatar parameter type from File to any in updateAvatar function ([e2b2f9b](https://github.com/memori-ai/memori-react/commit/e2b2f9b312fd335f3e1db011a3326f33cbbb0949))
* change language formatting in MemoriWidget to lowercase ([28903d2](https://github.com/memori-ai/memori-react/commit/28903d2980747dced6669b09dd505c4bea0f2f9d))
* chat bubble content text size ([b781eb4](https://github.com/memori-ai/memori-react/commit/b781eb4c3e219292ef475adca680b2fb5b9201f4))
* chat bubble headings color inherit ([4b342df](https://github.com/memori-ai/memori-react/commit/4b342df452a66422d7d6d8b5118895a907b98f1b))
* chat bubble with initial msg ([cea6fe7](https://github.com/memori-ai/memori-react/commit/cea6fe7912e97d00ba986e8d7d64856f663223af))
* chat history drawer z-index ([07619cf](https://github.com/memori-ai/memori-react/commit/07619cf6ba993eb6e793922aa63d255f5edcdcdd))
* chat history min msg filter no negative values ([4211f39](https://github.com/memori-ai/memori-react/commit/4211f3968805bdee43a5641b5b47b63f80aa53e8))
* chat layout responsiveness width ([adfc95a](https://github.com/memori-ai/memori-react/commit/adfc95aa0549084a04446118647962bb488cb7c7))
* chat link word break ([7ba2993](https://github.com/memori-ai/memori-react/commit/7ba2993e298e3ab0214c92054d35c00c956ced21))
* chat not starting when enableAudio is false ([26f87bf](https://github.com/memori-ai/memori-react/commit/26f87bfa43de68c6cd06a34e203d2259724653b4))
* chat typing wave animation ([77597c4](https://github.com/memori-ai/memori-react/commit/77597c482608a63c2a39908b10e6254fffb2dce3))
* chat user bubble size ([27bf2c6](https://github.com/memori-ai/memori-react/commit/27bf2c67bc7344b1033b6613bf5eeb82e1ab178d))
* cleanup ui on mobile textarea focus ([778934d](https://github.com/memori-ai/memori-react/commit/778934df1fb27c7c78de2e35e81c72e57f7e8a5f))
* close artifact when we are closing the HIDDEN CHAT ([207d40e](https://github.com/memori-ai/memori-react/commit/207d40e51c34ee16a6d77f0b49b4bb9216ec8ca1))
* close audio context only if not closed ([c1cd222](https://github.com/memori-ai/memori-react/commit/c1cd2226e6a9360e54c4d92aefcb7f8e27efcdb3))
* condition to avoid repeating the same idle animation twice ([6137575](https://github.com/memori-ai/memori-react/commit/61375754dbc176a6e3875b9d25d34cc2d822251b))
* constant import ([a75e6ea](https://github.com/memori-ai/memori-react/commit/a75e6ead875a17c65313cdbfbcb5d475d6a0a126))
* continuous speech issues ([4e99871](https://github.com/memori-ai/memori-react/commit/4e998713834838e7003bde536bd5f10f49b6e1a6))
* copy css files ([866a97f](https://github.com/memori-ai/memori-react/commit/866a97fe078c9758e2a420ea4c4aca2008ee7644))
* correct CSS variable naming in Drawer component for consistent styling ([a5cf788](https://github.com/memori-ai/memori-react/commit/a5cf7881a2686fbeca4322f915349b65c510cafa))
* correct text formatting in chat resume messages and update button label in ChatHistoryDrawer ([564e40d](https://github.com/memori-ai/memori-react/commit/564e40dc6cd8f9d90dd57a804cc6068853f60285))
* correct user acceptance state variable in LoginDrawer ([675b642](https://github.com/memori-ai/memori-react/commit/675b6426986da8d2a82b4f6fdd4b8314c8a01392))
* correctly reset emotion morph targets ([e0c3828](https://github.com/memori-ai/memori-react/commit/e0c38283e48a0dddeb70cf9019abb385780ef523))
* css vars declaration entrypoints ([1215ccb](https://github.com/memori-ai/memori-react/commit/1215ccbb45842da821a43b1a169954b04bf2660c))
* deep tought disclaimer title color ([d3fb917](https://github.com/memori-ai/memori-react/commit/d3fb917f461e96cc59cec821c23a6295bea088e7))
* default audio value for mute speaker ([09022bc](https://github.com/memori-ai/memori-react/commit/09022bcf30fe331e8ddf31edfe8073a5077a9693))
* default spoken lang from integration config ([8078736](https://github.com/memori-ai/memori-react/commit/80787366843bb9d3ba438ab5c60fd6ba4c9484c9))
* default spoken lang order, first is prop ([eadac28](https://github.com/memori-ai/memori-react/commit/eadac284d96f2f5d974967a178638b4314dac3be))
* default styles ([66ae787](https://github.com/memori-ai/memori-react/commit/66ae787a8255d691821434a9aec239d2e8e3b7d0))
* defaults for multilanguage prop ([33c956a](https://github.com/memori-ai/memori-react/commit/33c956a7b2871bfafdc3f46e3cec58d937c016f2))
* disable message consumption display in Memori component and update hover styles in Chat.css ([4bd10ce](https://github.com/memori-ai/memori-react/commit/4bd10cea051a35be1d48803b145ef30fe30fbe1f))
* disabled signup margins ([6abe01d](https://github.com/memori-ai/memori-react/commit/6abe01d4577b4ec849442d59bd884e9d8eb2b152))
* do not add sessino id to external media urls ([78e368a](https://github.com/memori-ai/memori-react/commit/78e368a266ab0b7cb38b5f93bab97696e36e585a))
* do not send timeout event if waiting for memori response ([c6ad751](https://github.com/memori-ai/memori-react/commit/c6ad751448a4e8e853a48731144e3550c1203bd7))
* dont disable mic btn while speaking ([4baba70](https://github.com/memori-ai/memori-react/commit/4baba70131a2c5ea4e672660a79242714fa31d84))
* dont include media wrapper if no media is shown ([b492706](https://github.com/memori-ai/memori-react/commit/b4927064a411c40a1a3a0785adfe0c70ba092840))
* dont make avatar smiling while talking ([910d866](https://github.com/memori-ai/memori-react/commit/910d866565115e6f01e29dcef4fa71e47de1c950))
* double backslashes for LaTeX parsing ([b81a2a8](https://github.com/memori-ai/memori-react/commit/b81a2a8e5d1dfcda27c9a7e405b4befd30ac63d3))
* double translation of last message when reopening session ([4f356bc](https://github.com/memori-ai/memori-react/commit/4f356bc7ef17daacd31de250a2898d403076c682))
* drawer mobile width ([0973105](https://github.com/memori-ai/memori-react/commit/0973105012e00f3acff89d07d3c4660e9af4554b))
* drawer z-index ([e28ec3f](https://github.com/memori-ai/memori-react/commit/e28ec3f960c9d25d99c405f8d94fe4e26e3e5fd8))
* duplicate uploaded image when copy/paste from local files ([dab3c3f](https://github.com/memori-ai/memori-react/commit/dab3c3f8567a1505b3abdfe07401ffc01ca37555))
* enable drag and drop functionality in Chat component based on showUpload state ([346da51](https://github.com/memori-ai/memori-react/commit/346da514896df335d39ee7f3e9fc50c9fab0b8ab))
* enable showUpload in DefaultLayout story ([77efcfe](https://github.com/memori-ai/memori-react/commit/77efcfea06cabcf2de6440b703c67de615f2c18a))
* enableAudio prop in MemoriWidget ([501d48e](https://github.com/memori-ai/memori-react/commit/501d48ec5dc7da66dc4b363e5a9738d0e7c69170))
* enabled upload documents for unauthenticated users ([88c7cc8](https://github.com/memori-ai/memori-react/commit/88c7cc892c729269ed4a80b2da0f40cf5cb6ecc6))
* encapsulate css properties in memori-widget ([03221bd](https://github.com/memori-ai/memori-react/commit/03221bd5967c6278a6d5540f4c4192f0efe5110c))
* enforce loading text alignment ([2b513fd](https://github.com/memori-ai/memori-react/commit/2b513fd47fcedb2e8b9fdb2131056ddedff51ca0))
* enhance autoStart logic in Memori to handle undefined cases and improve layout handling ([c0fa52f](https://github.com/memori-ai/memori-react/commit/c0fa52fea8dd7f3822a19747a4190134c459dc90))
* enhance error handling TTS components ([85eef2f](https://github.com/memori-ai/memori-react/commit/85eef2fec9339625549ad9dabaf35176fff60831))
* enhance file selection handling in UploadButton ([0651d2d](https://github.com/memori-ai/memori-react/commit/0651d2d9815823a719cd557fdd6d9451be8b0e66))
* enhance location handling in preview detection logic ([c53b1ff](https://github.com/memori-ai/memori-react/commit/c53b1ffc64a63f9a25b7d5567b940874e5147a2e))
* enhance media rendering in ChatBubble to prevent duplicates and filter out non-media items ([9918d82](https://github.com/memori-ai/memori-react/commit/9918d828bff11b612b9a1f5e1be1a57bc07e7319))
* enhance text sanitization and update TTS layout options ([26ab442](https://github.com/memori-ai/memori-react/commit/26ab4427b79caaca5239e8a69932e7a58a5889da))
* enhancements to speak func, add polish voices ([8356152](https://github.com/memori-ai/memori-react/commit/8356152d4269a4625e87f37ee423352b3bae3ac1))
* ensure audio playback respects defaultEnableAudio ([0ec1da5](https://github.com/memori-ai/memori-react/commit/0ec1da5f7444edfff23c8165484cf64bfc6b87e7))
* ensure audio playback respects defaultEnableAudio ([a0c9ffb](https://github.com/memori-ai/memori-react/commit/a0c9ffb3ef9dde733355cd0f12461b470e92b575))
* ensure login token in opening session ([9da5fd0](https://github.com/memori-ai/memori-react/commit/9da5fd02272e38c146bfcb184e7e152c0aeb36bf))
* ensure message is sent only when listening is active ([f2fc193](https://github.com/memori-ai/memori-react/commit/f2fc193a7ce5709e407098d65b03baaf8ea274bc))
* ensure preview files are set before sending messages ([f03b834](https://github.com/memori-ai/memori-react/commit/f03b834952159540539c425f0abee99d22960302))
* environment url from drei cdn ([773e0fe](https://github.com/memori-ai/memori-react/commit/773e0fedf2d300fd00cca4310a35dc24418bdfb1))
* errors opening session ([ba33f73](https://github.com/memori-ai/memori-react/commit/ba33f73c5733f9417fd5b6e17b4e2d5ab950d701))
* exclude HIDDEN_CHAT layout to showFullHistory condition ([4e98c38](https://github.com/memori-ai/memori-react/commit/4e98c38d589bc6358c6bb194ffb822837c913fed))
* exclude plain text media items from chat message filtering ([02e6213](https://github.com/memori-ai/memori-react/commit/02e621358ce99e5271d5a347b4b9c7a38ec19923))
* export history button btn classes ([fcc0bf6](https://github.com/memori-ai/memori-react/commit/fcc0bf696388461c49a5ffd24ee98d134fb35d4a))
* female avatars mouth moving speaking ([246d054](https://github.com/memori-ai/memori-react/commit/246d05486cae1759f223c372e7cfeb359bb344a0))
* fine tuned lip sync and base animations ([6905874](https://github.com/memori-ai/memori-react/commit/69058747e48944c7054802e829654895d4b7823a))
* first emission timeout triggering ([fecc207](https://github.com/memori-ai/memori-react/commit/fecc207237b05ed5649d4fc637f6ec7339c4bc55))
* fix get tenant origin url ([a44a470](https://github.com/memori-ai/memori-react/commit/a44a4705f746d8efd5a3132279bbc0957446487b))
* fixed multi language prop bug ([de66171](https://github.com/memori-ai/memori-react/commit/de661712a9a68872b29dc293142ca365ec7462db))
* fixed name of new layout ZOOMED_FULL_BODY ([353bf32](https://github.com/memori-ai/memori-react/commit/353bf32b7ecb69f782912da38978345eb39502bc))
* fixed starting twice audio ([d108ea8](https://github.com/memori-ai/memori-react/commit/d108ea89265564b81c6a181347621676780b36af))
* font css url import ([97c2c71](https://github.com/memori-ai/memori-react/commit/97c2c713ff4c300da1df6873c796bd57b96acfc6))
* for CompletionProviderStatus improved react renders and api calls ([911ee87](https://github.com/memori-ai/memori-react/commit/911ee8764eba8286549fd2131dc11804a3b3d61d))
* for Hidden Chat layout removed session init ([c81de97](https://github.com/memori-ai/memori-react/commit/c81de970be9a97320f411bc31e9d4189ff5f1484))
* for MediaItemWidget with modal preview for document content ([f6e5d3b](https://github.com/memori-ai/memori-react/commit/f6e5d3b131f68b83741980a2e6ae78c920f0a721))
* force https for extracted images in links ([2c7f408](https://github.com/memori-ai/memori-react/commit/2c7f4089bb96a358207c76c58b935ac3d307462f))
* half body avatar ([c70ca97](https://github.com/memori-ai/memori-react/commit/c70ca979a0642e9a44847697eb6e3ec99489bb14))
* handle position requirement before auto-starting memori ([1b1948d](https://github.com/memori-ai/memori-react/commit/1b1948ded9d773c0fb280623998f0f250f0f7015))
* handle showChatWithNoHistory prop filter ([4003549](https://github.com/memori-ai/memori-react/commit/40035497490441cd0f661e59675b77db3fe2ab8d))
* header position place name mobile ([69fe42f](https://github.com/memori-ai/memori-react/commit/69fe42f9d912748b95e1227c6ecf0c97ef67d192))
* header z-index ([7d0cbb1](https://github.com/memori-ai/memori-react/commit/7d0cbb1ef6ca84770ce40082f64a68a34e4f32f0))
* hidden chat layout doesn't overlapse with the content ([055cbe5](https://github.com/memori-ai/memori-react/commit/055cbe55ddb19c5165d9effdcfb9c29bf8d6aa48))
* hidden chat opens session on click, delete session on nav away ([f95c804](https://github.com/memori-ai/memori-react/commit/f95c8041ba8f70dc6a34eca5473b58a5952f3fd4))
* i18n import ([8791dbf](https://github.com/memori-ai/memori-react/commit/8791dbfe69abac45ff470efeaeeaa21b10285b5f))
* **i18n:** auth modal title ([2b02247](https://github.com/memori-ai/memori-react/commit/2b0224773b0fc77c51ab2c40ad20260f9d08e805))
* icons jsx attr camelcase ([97362da](https://github.com/memori-ai/memori-react/commit/97362da774318ff3dcd21e2711e1410085416523))
* import css order ([8d23656](https://github.com/memori-ai/memori-react/commit/8d236566819510b8c4e02b9c5acc5deb2c6ef4da))
* import fonts from cdn for webcomponent compatibility ([16b15df](https://github.com/memori-ai/memori-react/commit/16b15df781dc77b62a546407a19b58ea05ebeffe))
* import katex styles from cdn ([f4cd80d](https://github.com/memori-ai/memori-react/commit/f4cd80dae8558ee2052e27e1360d3858db172d6c))
* import style ([543157d](https://github.com/memori-ai/memori-react/commit/543157da01d02981f931e25485e738f4d69c3176))
* improve avatar mesh detection for different avatar types ([442a6c5](https://github.com/memori-ai/memori-react/commit/442a6c52304d25f980c3c90e404e9a16856a605d))
* improve AvatarAnimator idle and animation transition logic ([ee797aa](https://github.com/memori-ai/memori-react/commit/ee797aa51a6fc0b452ef518d2afeccaa71fb7776))
* improve cleanup commands in package.json ([18cddfb](https://github.com/memori-ai/memori-react/commit/18cddfb11211749984631f815c19d1b5553b4acd))
* improve condition for media handling in ChatBubble component ([89506e7](https://github.com/memori-ai/memori-react/commit/89506e738fee548537bc82cdb20472fc53162239))
* improve continuous speech and listening conditions ([ee74480](https://github.com/memori-ai/memori-react/commit/ee74480ed5d3dfdef433bf07711d4af22093e6c3))
* improve fullscreen handling ([5d0f350](https://github.com/memori-ai/memori-react/commit/5d0f3500f9d00737b778a9f9de2ccffb7d5440b0))
* improve fullscreen handling in Header component ([f92385d](https://github.com/memori-ai/memori-react/commit/f92385dd607c415fbff69441bc2d057ed5d9497d))
* improve line counting in MediaItemWidget to support multiple newline conventions ([ebde6ba](https://github.com/memori-ai/memori-react/commit/ebde6bad2776f177192208d687c4b86d9d76b404))
* improve receiver display logic and ensure context variables are handled correctly ([6ce1227](https://github.com/memori-ai/memori-react/commit/6ce12273974eaeeb0618769e50e4726c24cc95e3))
* improve speech key fetching and audio enabling logic ([f6ea5e2](https://github.com/memori-ai/memori-react/commit/f6ea5e2f23e0316b70702661670a487572cda07c))
* improve speech-to-text processing state management ([cfe9f4a](https://github.com/memori-ai/memori-react/commit/cfe9f4a18fc3dd43ba80b397d7c4965c37164b63))
* improve text handling to prevent empty or muted speech ([f1083bc](https://github.com/memori-ai/memori-react/commit/f1083bc0c3287fafa68bb869232a72fc1f0c77f2))
* improve URL formatting and error handling in speech key fetching ([95cc693](https://github.com/memori-ai/memori-react/commit/95cc693a2749bc525843c8ad8d3cd78c51be80b6))
* improved error handling for fetchSession and reopenSession functions ([b9b092a](https://github.com/memori-ai/memori-react/commit/b9b092aef1d427afd7d845ae0dc0d65c0ed95326))
* increase tooltip close delay and enable pointer events for content ([22f596b](https://github.com/memori-ai/memori-react/commit/22f596b308c0263331b93faf0b3b5b7c11af52b0))
* init session state between auth and age verification flows ([2acab69](https://github.com/memori-ai/memori-react/commit/2acab69640c0fb3509663feaddc7c3e96113a01f))
* initial session inside chat with layout HIDDEN CHAT ([ba23ea1](https://github.com/memori-ai/memori-react/commit/ba23ea1d66bd4da337c69f07004af99eab93e1b7))
* initialize user birth date and acceptance states in LoginDrawer ([397fe1e](https://github.com/memori-ai/memori-react/commit/397fe1e73c4b88d21648ce1594f647f509336fd6))
* ios safari speech bug ([c9bf892](https://github.com/memori-ai/memori-react/commit/c9bf89232218121759bec24b370a553e9bd4ffa5))
* ios safari typeMessage events, cleanup ([f7d4d4d](https://github.com/memori-ai/memori-react/commit/f7d4d4de0beee37dfde4287e27591783aaec7b65))
* ja zh lang labels ([cb16897](https://github.com/memori-ai/memori-react/commit/cb16897dd53af1de86a8b429f66a0e56277f7123))
* ja zh lang labels ([07e9d05](https://github.com/memori-ai/memori-react/commit/07e9d05815d60b387eafbd1bd86b6b790fa3948a))
* katex parsing with special characters, refactor kiss, cover other edge cases with spaces ([89c15dd](https://github.com/memori-ai/memori-react/commit/89c15dd217f4023dae555385994b800022568c7a))
* keep hints on G1 on timeout ([4c62ecd](https://github.com/memori-ai/memori-react/commit/4c62ecd6a241055124d8e8fcb392c324430fb41d))
* known facts pagination ([4a17dc3](https://github.com/memori-ai/memori-react/commit/4a17dc3e0bb2db63dd3c794c02a381cde413c544))
* knownfacts header icon disabled color ([34225bd](https://github.com/memori-ai/memori-react/commit/34225bd87381316fac2925ddd36070ec8325cb57))
* language selector bg and color on windows ([94598f7](https://github.com/memori-ai/memori-react/commit/94598f7ed0e949926fcaba21d463f909b29eb5c7))
* link item preview img fallback ([1d739d6](https://github.com/memori-ai/memori-react/commit/1d739d65ff66374ad2dc4723cee779d0347b71ce))
* links color in user chat bubbles ([813e557](https://github.com/memori-ai/memori-react/commit/813e5574bb32467f52f397a9ff3da1bfeb5b6b4c))
* lint ([ea3a110](https://github.com/memori-ai/memori-react/commit/ea3a110b6b6aff810fd83698048f4ae9e79f8b97))
* lint ([6891c1f](https://github.com/memori-ai/memori-react/commit/6891c1f6d0eb83c7da97cf5c851ee02352aded4f))
* lint ([85e2466](https://github.com/memori-ai/memori-react/commit/85e2466229d46d9d0d50bc6ea4484b0cc649a821))
* lint css ([2f40128](https://github.com/memori-ai/memori-react/commit/2f401282069cb0a450ca00c96e25ada999f7e401))
* lint css order issue ([e98faf2](https://github.com/memori-ai/memori-react/commit/e98faf23a504e736ac814c4b81b26c9c027a2234))
* lint issues ([86251d5](https://github.com/memori-ai/memori-react/commit/86251d5ee1c37c9fc3777d4c0d590c7ca8a366c9))
* linting ([bd671aa](https://github.com/memori-ai/memori-react/commit/bd671aa4a977c09a108e15263f31ba5011f4a247))
* linting ChatBubble ([cf5fb09](https://github.com/memori-ai/memori-react/commit/cf5fb09200499880fb4fb8ec23468529e2b0d0c2))
* loading animation from separate glb, add smiling + loading anim morph targets influences ([754a711](https://github.com/memori-ai/memori-react/commit/754a711c5f185a76ed8b201207ea29888053b944))
* locales and style for Chat History ([604a438](https://github.com/memori-ai/memori-react/commit/604a438474afd08777ec2fb50c76e6db6fbf0840))
* logged in state checks ([6e20c90](https://github.com/memori-ai/memori-react/commit/6e20c904a16ed60fcacc5d5ba07f6156a40b3d85))
* make showShare and showSettings optional props with default values ([ca33292](https://github.com/memori-ai/memori-react/commit/ca33292f4cc9485b1e06ef2ff2664ec538680814))
* make stt work on safari ([a1a1ff9](https://github.com/memori-ai/memori-react/commit/a1a1ff9ee3bdc1fd4c4ebebaa5c39f01c7241a21))
* markdown formatting lists and newlines ([ff42a33](https://github.com/memori-ai/memori-react/commit/ff42a33df9b45c32e503859c49147bc2b9c8ea39))
* markdown link parsing url ([94cab0f](https://github.com/memori-ai/memori-react/commit/94cab0f3951f9e8480e0e92f9873045dd9a259ab))
* markdown parsing with translated text if present ([c1006da](https://github.com/memori-ai/memori-react/commit/c1006da73daf2b00bc8ebb4f9e9dde37920eca9a))
* mathjax loading and parsing, moved to effect ([cbd1274](https://github.com/memori-ai/memori-react/commit/cbd12740e4e7764a3f12aa8f3916b19e1c3b42a6))
* max width totem controls ([8e0378e](https://github.com/memori-ai/memori-react/commit/8e0378e58cd4da40cc3aa98f117a4fb28a910ce9))
* media item caption size and word break ([c2f865a](https://github.com/memori-ai/memori-react/commit/c2f865ac00b4c0e81b199cd8e0b956d332c90237))
* media modal styles ([e08c946](https://github.com/memori-ai/memori-react/commit/e08c9460d02c710bf631faf5d888330a8c5ad71e))
* media url with external links, add tests for helpers ([1e4244b](https://github.com/memori-ai/memori-react/commit/1e4244b2da8f44e10168c14f2caaea919990624c))
* minor css fixes ([79fb904](https://github.com/memori-ai/memori-react/commit/79fb90456676ae0cb25d2eb95a7d49098891def8))
* minor fixes, add base background ([5dbb196](https://github.com/memori-ai/memori-react/commit/5dbb19611c6b57d77c4366e6a106c843ca4d15f9))
* minor style fixes ([cd7a5b4](https://github.com/memori-ai/memori-react/commit/cd7a5b42262926ad4b140dd813a698961adfbdfb))
* minor style fixes, fix avatar loader, stop audio on hints click or type textarea ([235ad81](https://github.com/memori-ai/memori-react/commit/235ad8187bc0fa8163553597c7c520aea3b7122e))
* minor styles fixes ([940b066](https://github.com/memori-ai/memori-react/commit/940b066574c8648f3074d4bad4bc59fd559886af))
* missing session id on img link ([3a3b48e](https://github.com/memori-ai/memori-react/commit/3a3b48e74a2185cd508961d1634cc0911435feb8))
* mobile layout fixes + chat layout enhancements ([1bdb6c3](https://github.com/memori-ai/memori-react/commit/1bdb6c3ce337e1fadb9dffb1a473e2575cd6097e))
* mobile styles for webassistant layout ([587d222](https://github.com/memori-ai/memori-react/commit/587d2221dd5b6d56407b3534a8527af268b84dd5))
* mobile styles for webassistant layout ([cfd2086](https://github.com/memori-ai/memori-react/commit/cfd2086677aec12840d1307b01dbbae6c3ac5ab0))
* move css import in tsx to main css file ([29714ac](https://github.com/memori-ai/memori-react/commit/29714ac793a6b310bb269c61c6f38d80745dad18))
* muted speaker on welcome message coherently ([43129c6](https://github.com/memori-ai/memori-react/commit/43129c6badd7486c3e25a8c99cc83ddfa357730a))
* on mobile, allow Enter to create a new line instead of sending ([86be6be](https://github.com/memori-ai/memori-react/commit/86be6be7ad507884300a29d37daadb1e2bc1b0d6))
* on mount disabled textarea focus only for TOTEM layout ([a8b0ab4](https://github.com/memori-ai/memori-react/commit/a8b0ab44b282e61c49eef39adbaa054222a18d08))
* only one document can be uploaded per message ([4102f2f](https://github.com/memori-ai/memori-react/commit/4102f2f7c2c2b6ae2a0eaca0f252692b8c87b73a))
* opening session current tag check + history ([adc90f9](https://github.com/memori-ai/memori-react/commit/adc90f9a0c1e7414ec24a55a19d6504a0aec65a8))
* optional chaining ([0a8b20c](https://github.com/memori-ai/memori-react/commit/0a8b20cce61afd2fe60e73b705a139d749ea451b))
* output tag parsing for tts ([a641461](https://github.com/memori-ai/memori-react/commit/a6414612bbf744d9e4b0f5fce28bc45887132902))
* pass baseURL to all img handlers ([8083c12](https://github.com/memori-ai/memori-react/commit/8083c12af181aa41bb0ff714491c73916a57bd61))
* pass settings drawer additionalSettings in widget ([67ec2de](https://github.com/memori-ai/memori-react/commit/67ec2de0f587d9ccce3282dd4a51155dfdc394ff))
* personification in open session from pwd required state ([dc47a6a](https://github.com/memori-ai/memori-react/commit/dc47a6a3c835bb02e80022fc1dda8cfdb0754da9))
* position drawer rendering ([02766ac](https://github.com/memori-ai/memori-react/commit/02766ac57a139c67d202a79f77a5f55946cce293))
* position widget has to be the first in header ([b1e9062](https://github.com/memori-ai/memori-react/commit/b1e9062a77ff274abc462adc81cd3544282dde78))
* prevent <output> tags from translations, use correct default endpoint to skip redirections ([8107c00](https://github.com/memori-ai/memori-react/commit/8107c00f23a85d7ae95505e69690c080ec70f169))
* prevent duplicate snippet execution by checking dialog state before calling onClickStart ([0e550ee](https://github.com/memori-ai/memori-react/commit/0e550ee22bbe2016e3b83e6dd8399c7579c35b8a))
* prevent mathjax to throw and explode ([cec112e](https://github.com/memori-ai/memori-react/commit/cec112e877c4b7a7845c9028706ddcdf45e9c802))
* prevent scrolling while rendering MathJax ([cec210a](https://github.com/memori-ai/memori-react/commit/cec210aad3d2d4f4bb98d1c954f5ddb064a15398))
* prevent sending messages while uploading files ([93004c5](https://github.com/memori-ai/memori-react/commit/93004c505a4c646cb989e7a0cd00106bab2a454b))
* prevent sending messages while uploading files ([eff0a43](https://github.com/memori-ai/memori-react/commit/eff0a43ae0dc88413c3a4bd5522a4daa44832ea4))
* prevent set instruct on pending sessions ([fcbc7c0](https://github.com/memori-ai/memori-react/commit/fcbc7c07a83c4cf7c563cca234db6e6f62558f89))
* prevent start session loops on error ([13032a9](https://github.com/memori-ai/memori-react/commit/13032a9f2c05366ceeb21501ae75c17752f7797d))
* prevent TTS on auto-start in HIDDEN_CHAT ([933857c](https://github.com/memori-ai/memori-react/commit/933857ca1ab8e7a4ab37c5ce1eb689aaf5a4862d))
* prevent user to upload multiple images and fix style button Cancel ([d084675](https://github.com/memori-ai/memori-react/commit/d0846758cda3346e10234f3d9acbbef8df70ce52))
* prevent vars not being loaded for portal roots with lt ([d11f9bc](https://github.com/memori-ai/memori-react/commit/d11f9bc08dc01b7a894bcef4e58cf7401ed2a425))
* prevent xss in user messages ([ada915f](https://github.com/memori-ai/memori-react/commit/ada915f015651bd28a1490c65cb7b13c36081823))
* readability and a11y about disabled buttons ([452559e](https://github.com/memori-ai/memori-react/commit/452559eb6447c88f267da636fb42e80e9d83d46b))
* reasoning tag <think> regex ([f7f0c22](https://github.com/memori-ai/memori-react/commit/f7f0c2258429da5646c5faee3b0fcf55562a4228))
* recover birthdate from localstorage or login ([fc7c54d](https://github.com/memori-ai/memori-react/commit/fc7c54d887c1184f31fcb258bd7a29cf00168324))
* refactor api client vs url usage, fix engine url in client init ([ff4958e](https://github.com/memori-ai/memori-react/commit/ff4958ed3a7c75ec8e1a8fab5c2359ced075fcc6))
* reference error on MAX_DOCUMENTS_PER_MESSAGE ([53dc3b7](https://github.com/memori-ai/memori-react/commit/53dc3b773fcee6b36214408a0ffd3da6884d0e36))
* reference error on MAX_DOCUMENTS_PER_MESSAGE ([8f32d13](https://github.com/memori-ai/memori-react/commit/8f32d1391c9541bf36f59d7a40f497d597ad2287))
* reinserted inside half body the blink and speak animation ([80e4889](https://github.com/memori-ai/memori-react/commit/80e488936e236ce8a7fea482cc0c10745ccec56c))
* reintroduced head movement for half body avatar and removed unused speaking prop ([997f6f5](https://github.com/memori-ai/memori-react/commit/997f6f568a5c753386de7df72fcfaa66e1c0271b))
* remove <think> tag in ChatBubble before copying to clipboard ([cd11c30](https://github.com/memori-ai/memori-react/commit/cd11c30bed6779bfb47c9fb60df45223e5581332))
* remove <think> tags from message rendering in renderMsg function ([d8de4df](https://github.com/memori-ai/memori-react/commit/d8de4dfcb0db9f8e21d7d6d9ee2587e58d23363d))
* remove deprecated API component names from CompletionProviderStatus ([68ff1ae](https://github.com/memori-ai/memori-react/commit/68ff1ae94a145e1d6e75520125a27295877af809))
* remove double fullscreen buttons in hidden chat layout ([a60e811](https://github.com/memori-ai/memori-react/commit/a60e8118c3ea12f9858498f10f39848a6c3bc494))
* remove emojis from spoken text ([92e2cb6](https://github.com/memori-ai/memori-react/commit/92e2cb6e5a90b228c091a41afb7b202938c03ad8))
* remove hide emissions handling from website assistant ([95b1c36](https://github.com/memori-ai/memori-react/commit/95b1c36c04865aa4c1a84a3d2e98a56e5e327c18))
* remove loading avatar margins ([f0898b6](https://github.com/memori-ai/memori-react/commit/f0898b694bf5f5052beb21121dcff3930b759de8))
* remove microphone button mouse leave event, caused conflicts sending on hover ([625626f](https://github.com/memori-ai/memori-react/commit/625626fea505648517c838ea630090460916d016))
* remove unused state and enhance logging in HiddenChat layout ([5df5817](https://github.com/memori-ai/memori-react/commit/5df58171b5d9c6c01a65855729677a0dae2b598e))
* removed chat visibility on mobile ([3aa1fa8](https://github.com/memori-ai/memori-react/commit/3aa1fa8677fa0bdc68930abf8dd45b4beac71b69))
* removed hands for half body avatar ([c0bd4a0](https://github.com/memori-ai/memori-react/commit/c0bd4a0221bfec3f81773eb7a66d315be202cddd))
* removed important from reusable button css ([c8774d4](https://github.com/memori-ai/memori-react/commit/c8774d438aa3f31acb9b00987f8d1830e0a59fb9))
* removed keyboard automatic focus on mobile after audio recording ([ae8d737](https://github.com/memori-ai/memori-react/commit/ae8d737de031a9b2434c4bb7ba951bf9f9ea1d13))
* removed negative range values for depth slider and asjusted default layout values position for the avatar ([5c197d8](https://github.com/memori-ai/memori-react/commit/5c197d8c7d4c7e093df6e2625c002d9f3c8abada))
* removed style that was cropping the half body avatar ([cab622c](https://github.com/memori-ai/memori-react/commit/cab622c81ce09f3a68103a09d22f7922590ec138))
* removed tag <output> from speech text and adjusted viseme smoothing value ([fe5b4dd](https://github.com/memori-ai/memori-react/commit/fe5b4ddc698517de1eff3b9447361fdf758c808e))
* removed unused prop and fixed reset textarea focus logic ([b5ff368](https://github.com/memori-ai/memori-react/commit/b5ff368922614791d26a358d5e6c92bfb471a1c1))
* removed unused prop for PositionControls Component ([fff69d1](https://github.com/memori-ai/memori-react/commit/fff69d1dec3fcb38e85561e851637e1e0b7da4e8))
* removed unused prop into AvatarComponent ([57774d4](https://github.com/memori-ai/memori-react/commit/57774d4b5f6b1598914009691fcbf409e7d067f8))
* removed unused props for FullbodyAvatar component ([b28ff76](https://github.com/memori-ai/memori-react/commit/b28ff7646852f971517c8f37b0afc8423e0c6578))
* removed wrong state update and logs ([7570aa4](https://github.com/memori-ai/memori-react/commit/7570aa4f3906a51e27f45c038fc26fd25dde5a3f))
* reopen audio context if closed before audio termination ([dec1f12](https://github.com/memori-ai/memori-react/commit/dec1f12f9439dcdf3e4859b4870b2e7adcf1e8d5))
* reopen session on z0 only if textentered gave 404 response ([d6f48a8](https://github.com/memori-ai/memori-react/commit/d6f48a84ebd18ab8f603c9dc4a11019e01f014a4))
* replace regex lookbehind to support old safari versions ([4aea110](https://github.com/memori-ai/memori-react/commit/4aea1108450e36018a90cab5bdd86cf3a1737275))
* replaced undefined type with null for avatarType prop ([d4cd4fb](https://github.com/memori-ai/memori-react/commit/d4cd4fbc90f65756a7bec03ab7d63093e684b8ad))
* reset padding bottom of chat content in ChatTextArea on collapse ([d1b969b](https://github.com/memori-ai/memori-react/commit/d1b969bebc309ac28a125ebf49bd297edbfef75b))
* resolve race condition in TTS audio playback and improve cleanup handling ([384d45e](https://github.com/memori-ai/memori-react/commit/384d45e29d970807fb4bb5d9f6b645ebe7dc4e53))
* restore max-height property in MediaItemWidget CSS ([869cb41](https://github.com/memori-ai/memori-react/commit/869cb41465dcad9c693e6a5f544b7bcaa4dcfdc6))
* restored old uiLang prop behavior ([c08f0ed](https://github.com/memori-ai/memori-react/commit/c08f0ed13e5c27314d2edb45198f110fb5529234))
* restored working speak function ([4981353](https://github.com/memori-ai/memori-react/commit/498135332357520df43e65bd070827e81805f1d5))
* resume session will create new session if expired ([a85ea67](https://github.com/memori-ai/memori-react/commit/a85ea6794a729c7a9fd01bf1c966e01abf877cd2))
* revert ChatTextArea CSS for better responsiveness and styling ([69a3199](https://github.com/memori-ai/memori-react/commit/69a3199916d8a1493b5b57e435c240efd08b677e))
* root for css properties compatible with webcomponent ([f06ff64](https://github.com/memori-ai/memori-react/commit/f06ff642d4a32a2eaa3586857f3ba40b8811dda2))
* run mathjax only for chat bubbles content ([d51d1ef](https://github.com/memori-ai/memori-react/commit/d51d1ef5c321789bb3b6ca83fabf7941f0b491ea))
* scrollIntoView optional chaining ([7c0a290](https://github.com/memori-ai/memori-react/commit/7c0a290d6205808da413ba03f0380cc747ec3ffe))
* select bg color ([929b151](https://github.com/memori-ai/memori-react/commit/929b1510eaac4ff060709cef938c391d56870486))
* select colors and font ([cf4e98a](https://github.com/memori-ai/memori-react/commit/cf4e98ad96770fbe5fa5404a6d751275a68e0a5d))
* send on enter menu btn sizes ([6ca6887](https://github.com/memori-ai/memori-react/commit/6ca6887464f9b9320b74cf9e64625ac587512710))
* sending position event, cleanup ([79be3bf](https://github.com/memori-ai/memori-react/commit/79be3bff3705d570e8d728af21ab7674888dbc31))
* set height from props ([a65e0b4](https://github.com/memori-ai/memori-react/commit/a65e0b4d0c52fb3e501b517d57cc76dc469bcfa5))
* set localconfig for mutespeaker ([f0c3c3d](https://github.com/memori-ai/memori-react/commit/f0c3c3dd004a3c948d1fc7a100659060a170ee1c))
* settings drawer css enhancements ([dc95406](https://github.com/memori-ai/memori-react/commit/dc95406cc60dffba386d032d2ce6cab5efa3f220))
* share button menu styles ([3cdee0f](https://github.com/memori-ai/memori-react/commit/3cdee0f11682cefd24b42e85cf88a0fe2acbc24c))
* share chat link props ([0561153](https://github.com/memori-ai/memori-react/commit/05611536a1812ebf38f2dce5548a434d810ce8fc))
* share menu overlay zindex in totem layout ([55f9b8a](https://github.com/memori-ai/memori-react/commit/55f9b8a8e51b2cc97803840b23790401c232c36c))
* share qr button colors ([ae44e26](https://github.com/memori-ai/memori-react/commit/ae44e262addf3e531b43bd8d8fe382a16e5ae049))
* shared chat url with usernames as fallback or skip if none available ([549a95f](https://github.com/memori-ai/memori-react/commit/549a95fb54a6a73f86d704190979ebca023f227b))
* shared url parameters and baseURL ([5c8eb2d](https://github.com/memori-ai/memori-react/commit/5c8eb2dec938457ac5342d45b2f35f4c92630502))
* show blob on mobile totem ([558aba3](https://github.com/memori-ai/memori-react/commit/558aba3cc3e7105e0b40a7be8664b999a9a55982))
* show consecutive br in msg ([38ac194](https://github.com/memori-ai/memori-react/commit/38ac194fd4da7af005be8d4913f67785a746c9b5))
* show login if requiredLoginToken enabled ([174722d](https://github.com/memori-ai/memori-react/commit/174722d10e37b4b953290c8e8e8b8ee772e66adc))
* show more hints button bg and color ([74a451c](https://github.com/memori-ai/memori-react/commit/74a451ca3b4c929d8421d4a13dbbff6ec6b8b3a4))
* showUpload fallback values ([ffc3c4e](https://github.com/memori-ai/memori-react/commit/ffc3c4eb46b16e67432e295809045bfb40286e91))
* showUpload from integration bool checking and fallbacks ([c87f5d8](https://github.com/memori-ai/memori-react/commit/c87f5d84863048d4ef067fec38573996351ee515))
* simplify attribute mutation check in Memori component ([e9758b8](https://github.com/memori-ai/memori-react/commit/e9758b836b38e0212bcb66ef5225770573071e82))
* simplify audio handling by removing showSpeaker prop ([4d3ea86](https://github.com/memori-ai/memori-react/commit/4d3ea865a3c23a8f2381ac95e92cfa53353a0900))
* simplify autoStart logic in Memori and update HiddenChatLayout handling ([ff0ce3f](https://github.com/memori-ai/memori-react/commit/ff0ce3f42bbb0c03aee64a9efe675a98f73a5145))
* skip pulse for sb on gh pages ([b8496dd](https://github.com/memori-ai/memori-react/commit/b8496dd98b4aa810706afcaede9d17eab6a1f930))
* speak on autostart ([b0d9917](https://github.com/memori-ai/memori-react/commit/b0d9917d8a13b410d92dc7c3853e3b5bad5c0755))
* speech async handling, avoids double voice ([ee6e45a](https://github.com/memori-ai/memori-react/commit/ee6e45a98a948a4cc5055b84243353e0b865d2b4))
* spinner loading chat style ([addc05b](https://github.com/memori-ai/memori-react/commit/addc05b713f5ea42b3c5f0ac3bee21a403538750))
* ssml encoding ([db335ed](https://github.com/memori-ai/memori-react/commit/db335edc0810e6927185ad74e8aca442e589eb29))
* ssml encoding ([e0e477b](https://github.com/memori-ai/memori-react/commit/e0e477b1d2f6aa09e2a831c9c9caf02a617a4d90))
* start + end avatar speaking events ([8b8bdf5](https://github.com/memori-ai/memori-react/commit/8b8bdf5246be1ebc29f132af9dc3f816c741704c))
* start button blocked conditions ([4ab53c6](https://github.com/memori-ai/memori-react/commit/4ab53c6539a8ad09262179c486273b748a9c7dbb))
* start panel scroll + expandable + hover bg ([21f0351](https://github.com/memori-ai/memori-react/commit/21f0351ffe4120499b81f898fa8921bd6e8013ce))
* stop audio and ui timeout when unmounting ([e53df8e](https://github.com/memori-ai/memori-react/commit/e53df8ead2207428b81b600552a41a4154156e24))
* streamline cleanup commands in package.json ([066e522](https://github.com/memori-ai/memori-react/commit/066e52235744d9020b2ed0f5a3e573c195594c24))
* strip reasoning content from tts ([eaa5c02](https://github.com/memori-ai/memori-react/commit/eaa5c0279eaf081f81b1bce4ead3070ea5b23a61))
* stripped out reasoning tag inside the detect artifact function ([4b1865c](https://github.com/memori-ai/memori-react/commit/4b1865c83b5416b078bfd8de708a0437d9d0bb6c))
* stt init lang ([b2d5a4b](https://github.com/memori-ai/memori-react/commit/b2d5a4b8cc3a783840f0200d4c4f532c83aa97bb))
* style fixes ([8e4ccd1](https://github.com/memori-ai/memori-react/commit/8e4ccd1652ecd950cb8ec4f395c00e4fa63efbc5))
* **style:** fixed hidden chat layout style ([b95eb60](https://github.com/memori-ai/memori-react/commit/b95eb60e2a099f5f252e32f79e0e463945c59e7d))
* styles + font ([28b5136](https://github.com/memori-ai/memori-react/commit/28b51366b2fc3f4367b923722574feb546c364fa))
* temporarily disable fullbody avatar loading anim, update anim assets url ([56e5dbb](https://github.com/memori-ai/memori-react/commit/56e5dbb08416193607cdd916eba39d251165a86c))
* **test:** reverted linting modifies on ChatBubble ([3e26519](https://github.com/memori-ai/memori-react/commit/3e26519d531934211f0201f1bec9530aae393a10))
* textarea margins ([086b13e](https://github.com/memori-ai/memori-react/commit/086b13e29826033a6934d7dfb15c8318f6f7da4f))
* timeout events triggering ([a001e27](https://github.com/memori-ai/memori-react/commit/a001e27f856a3ab504db01d9173e25cd7d2ff37e))
* timeout from engine already has read time ([59eddf9](https://github.com/memori-ai/memori-react/commit/59eddf97a33ec5188a72efaac9c25e51253e9476))
* timeout units ([4bbee10](https://github.com/memori-ai/memori-react/commit/4bbee10ce6215877eb7662d1265686c0c5e4de14))
* tooltip align left styles ([72ee3cf](https://github.com/memori-ai/memori-react/commit/72ee3cf3c41e3c8eb41f02d9481ce3d92e29e99e))
* totem controls width ([e6df8db](https://github.com/memori-ai/memori-react/commit/e6df8dbb38ed1e3cb9e7404ce6a81797cbf62b75))
* totem height ([46e3e90](https://github.com/memori-ai/memori-react/commit/46e3e90762c76d3f38c22652ed50501dbd8339cd))
* totem height ([46cfb4f](https://github.com/memori-ai/memori-react/commit/46cfb4f6f02a69e63f05fea40e07a4dfbeca8f0b))
* totem layout blob z-index ([5808bdf](https://github.com/memori-ai/memori-react/commit/5808bdfa6875a3083e787b40f49c3cc836edfdd5))
* totem layout dont show position place name ([9a2a5d1](https://github.com/memori-ai/memori-react/commit/9a2a5d14bc72be9a90ba787a645bfc2131402c63))
* totem layout header button size and spacings ([f79ed7d](https://github.com/memori-ai/memori-react/commit/f79ed7d5328f548b4638654d68a8804e6691d988))
* totem layout sharing z-index ([2dab8a5](https://github.com/memori-ai/memori-react/commit/2dab8a522095d9044d1fe971da467a9d8750e82b))
* transform media url with session id ([2a30ef2](https://github.com/memori-ai/memori-react/commit/2a30ef2fea7ae54c9437ca770fcbf6d2f79354b0))
* translate typingText if useLoaderTextAsMsg with multilingual ([6833f59](https://github.com/memori-ai/memori-react/commit/6833f5967a47b877d9c003917b2084cb16715f1c))
* typing updates and fixes ([79f9d1f](https://github.com/memori-ai/memori-react/commit/79f9d1f208a154d85b45789644ac5de360cdd782))
* typo translation bottom ([239e7c4](https://github.com/memori-ai/memori-react/commit/239e7c43f0151afca7510f45b68ffc889cf39dfb))
* typos ([6d62495](https://github.com/memori-ai/memori-react/commit/6d62495fe575942c10588ad0113d99d5836af6bd))
* **ui:** adjust height of MemoriWidget grid column for improved layout consistency ([58551d2](https://github.com/memori-ai/memori-react/commit/58551d2c9ade5320e44cbda71b5b865d20268e4b))
* **ui:** align content preview modal and assistant drawer z-index ([4431f08](https://github.com/memori-ai/memori-react/commit/4431f089cf07874019aa16d6a25781991d27819e))
* **ui:** made the disabled buttons visible ([e848145](https://github.com/memori-ai/memori-react/commit/e8481456f3fec7e7a8184c791d98d74c75a9cf8c))
* update active file count during document validation and processing ([ea998fc](https://github.com/memori-ai/memori-react/commit/ea998fc3539b70ef3670d96faed6ee6581fe9c42))
* update active file count during document validation and processing ([97b3ae9](https://github.com/memori-ai/memori-react/commit/97b3ae9815c2059438dcb0b73f939c9157371a88))
* update audio handling defaults and improve alert z-index ([4b10151](https://github.com/memori-ai/memori-react/commit/4b10151bbfc45ce3d9db2d663cbe77de412e66ff))
* update autoStart prop in Memori to allow undefined values ([096196d](https://github.com/memori-ai/memori-react/commit/096196d57b7158f1f084d45cf4042196dd4371c0))
* update Avatar component props in TotemLayout to include chatProps ([04c9737](https://github.com/memori-ai/memori-react/commit/04c97374bbb3af9b7c824f153d040242f1db6ddc))
* update button class in Header component to conditionally apply muted style ([bf35726](https://github.com/memori-ai/memori-react/commit/bf35726ecea7c5f2e1a8c2974fca18057be6bb83))
* update ChatBubble snapshot to reflect changes in output structure and parameter retrieval ([7697ecd](https://github.com/memori-ai/memori-react/commit/7697ecd0889101f12e0f5ef23b8851becb8217c2))
* update ChatBubble to conditionally truncate messages ([0cde2ab](https://github.com/memori-ai/memori-react/commit/0cde2aba665629e3f6546e64ab40ea4384eb085c))
* update ChatBubble to conditionally truncate messages ([4930971](https://github.com/memori-ai/memori-react/commit/4930971a9c8253643f10837a32c24c5d1d3c2b69))
* update color variables and improve loading spinner in ChatHistoryDrawer ([86b5126](https://github.com/memori-ai/memori-react/commit/86b5126baddc43dff490a4a4dfd4ff06bd2a5d9f))
* update default provider from OpenAI to Anthropic in CompletionProviderStatus component ([7a1847c](https://github.com/memori-ai/memori-react/commit/7a1847c9cce921d6763146a72f19bebfe16680e0))
* update DefaultLayout story ([27623d2](https://github.com/memori-ai/memori-react/commit/27623d23f235d527c908f27bb2c24326c8df335b))
* update dialog state on timeout only with emission, prevent hints to hide ([6132140](https://github.com/memori-ai/memori-react/commit/61321402750cbd591c43dc0a18af959c577bfb4b))
* update document upload button to correctly limit non-image file uploads ([210a258](https://github.com/memori-ai/memori-react/commit/210a258ba63f2b847aa9c563ab075ad1e0f2a62e))
* update engineURL to production and refactor boolean properties in story configurations ([14c2622](https://github.com/memori-ai/memori-react/commit/14c2622da8a7d0be91b4e027486ebff48d8e1f03))
* update fetch request in Memori to include tenant ID and set headers ([cbcad0a](https://github.com/memori-ai/memori-react/commit/cbcad0a5558c42e6d6d9e5e4cafe74d9edf36fd6))
* update file type display logic in FilePreview ([43e18c3](https://github.com/memori-ai/memori-react/commit/43e18c312204b6b1866106a8930a8f4c9b696dd5))
* update file type display logic in FilePreview ([b7f2935](https://github.com/memori-ai/memori-react/commit/b7f293503bae947fa4a0e9d1e3c00848509b1a85))
* update Header component snapshot to reflect muted button class change ([41c4758](https://github.com/memori-ai/memori-react/commit/41c475875510e9139e4cd502e21f013e9a6d7251))
* update login button visibility logic in MemoriWidget component ([f80da5c](https://github.com/memori-ai/memori-react/commit/f80da5ca22075ad299d54c4808f94c709e850369))
* update media filtering in Chat component to avoid excluding all the .txt files ([2e22963](https://github.com/memori-ai/memori-react/commit/2e2296358f0c28af7771ecb2f7e561e2d68e7d4b))
* update preview detection logic to improve whitelist bypass handling ([a9c3457](https://github.com/memori-ai/memori-react/commit/a9c34572e75e006e1070f705c2e6681e074da72b))
* update privacy explanation based on authentication ([5c89e4e](https://github.com/memori-ai/memori-react/commit/5c89e4e132bb67748c120e09ec521766ad4c2ccb))
* update privacy policy link handling in StartPanel component ([c1ed644](https://github.com/memori-ai/memori-react/commit/c1ed644e4748e37a1cf6d07ce450f3278edc88cc))
* update prop types ([782008e](https://github.com/memori-ai/memori-react/commit/782008ea18a368b02b7a957b8b9c3d3536b1e45d))
* update proptypes and widget props to pass down ([b47323b](https://github.com/memori-ai/memori-react/commit/b47323b64add4dbea632d053daa2be234d299630))
* update slider state and fixed depth buttons ([4192537](https://github.com/memori-ai/memori-react/commit/41925376863a26205735c86e2847175debd3ea87))
* update snapshot ([73fb756](https://github.com/memori-ai/memori-react/commit/73fb756b3032296ab84c58e68f110064d0a546a4))
* update snapshot ([8c763aa](https://github.com/memori-ai/memori-react/commit/8c763aaac1a4fdb30adad24f96682ab7cc4ff3f0))
* update snapshot to replace data attribute with id for toaster component ([5b757b4](https://github.com/memori-ai/memori-react/commit/5b757b49cd74b30b9c6eb31aee2ab0e8de04b67f))
* update snapshot to replace id with data attribute for toaster component ([574585d](https://github.com/memori-ai/memori-react/commit/574585d0dce7d676de98414a3c00f7129f835375))
* update text in Header component and add OTP digit paste functionality in LoginDrawer ([09ef8aa](https://github.com/memori-ai/memori-react/commit/09ef8aab17de321f5eea4c7229727330355e39f7))
* update timestamp in Chat component snapshot to reflect recent changes ([f4b0ef4](https://github.com/memori-ai/memori-react/commit/f4b0ef43aec3fc877c75879c71a50853e9962b39))
* update tooltip content classes for consistent styling across components ([b5121e4](https://github.com/memori-ai/memori-react/commit/b5121e433a77ac8cd3f251da966b02eb027d8ca9))
* update TTS API URL handling in MemoriWidget and useTTS ([c257064](https://github.com/memori-ai/memori-react/commit/c2570641d56b787d233519c81fb59d19f1c70939))
* update UploadButton title for improved clarity in file upload functionality ([24978ef](https://github.com/memori-ai/memori-react/commit/24978ef10ed0d5c34f63ab9d81140d74d89b26cd))
* update venue handling and improve user experience in location management ([9e3a871](https://github.com/memori-ai/memori-react/commit/9e3a8714e8edad12cd3bb96a5a04d4f5f69d93ac))
* update version script to resolve package path dynamically ([4930253](https://github.com/memori-ai/memori-react/commit/4930253ff50c23b5daa7065b576929f715bffc4e))
* updated avatar test ([4bcd669](https://github.com/memori-ai/memori-react/commit/4bcd6693ef632a86719bd27c9b5f0a39c3e963fa))
* updated flag isChatAlreadyStarted as soon as the avatar isLoading ([9b13b55](https://github.com/memori-ai/memori-react/commit/9b13b555a118ef7492011ebd3705b3f056b07e12))
* use native select for lang selector in start panel ([24f567d](https://github.com/memori-ai/memori-react/commit/24f567dd111c0068c9717a3cfe7552162db3ba4d))
* use secret while opening session if present ([726e131](https://github.com/memori-ai/memori-react/commit/726e131df885ad73b1c4399a679a72cb41139b92))
* use spotlight for ios environment light ([4191975](https://github.com/memori-ai/memori-react/commit/4191975f2917773b7316a45789e03af32d86b98a))
* userlang initial message translation ([7f79906](https://github.com/memori-ai/memori-react/commit/7f79906a99cee9949a4033f906d8675ab5ef3035))
* vars in portal root ([2f6856a](https://github.com/memori-ai/memori-react/commit/2f6856a49296c757ce2cfee7c5fea86b75db1888))
* venue widget mobile buttons ([3f07570](https://github.com/memori-ai/memori-react/commit/3f07570fb2011d532f243419bda91b5827617a84))
* vertical scrolling consintency ([c01c952](https://github.com/memori-ai/memori-react/commit/c01c952329208ac4ec41f9e4f3669a8f198e46e0))
* webcomponent styles ([3a708f7](https://github.com/memori-ai/memori-react/commit/3a708f734063a3fe210b8de179fdd1a815cbdc85))
* website assistant layout css ([4088a8a](https://github.com/memori-ai/memori-react/commit/4088a8a9280efe708703b3cb6bf5e27717821daf))
* website assistant layout not compatible with autostart ([7753f57](https://github.com/memori-ai/memori-react/commit/7753f57ea2480d25c551b15cfbe0008162e188fb))
* website assistant trigger button touch action ([5101bbb](https://github.com/memori-ai/memori-react/commit/5101bbbd2829d0aafd411384210eb0268d8edfd1))
* whitelisted domain check to include own tenant ([2270987](https://github.com/memori-ai/memori-react/commit/2270987194cce04cf78de2af707568f6c521e4a7))
* whitelisted domain check to include own tenant ([fe2ba28](https://github.com/memori-ai/memori-react/commit/fe2ba280e20592854469918c66d0c5227a312d12))
* why this answer loading spin with skeleton ([45ecf68](https://github.com/memori-ai/memori-react/commit/45ecf68463cab21e775bebd42733333936f8b60c))
* widget audio on ios ([eab3e16](https://github.com/memori-ai/memori-react/commit/eab3e16be90a5b2a6b783ba983c8bc1a48081e66))
* zoomed full body styles ([47cfc0d](https://github.com/memori-ai/memori-react/commit/47cfc0de775cb7d6e61125eba1ec27db1e176507))


### Maintenance

* adapt showFullHistory for hidden chat layout ([872b28d](https://github.com/memori-ai/memori-react/commit/872b28d4b5871590e6f12acb9468988be2cdcea0))
* add @base-ui/react dependency ([fc158f2](https://github.com/memori-ai/memori-react/commit/fc158f206b512acb95a201da1f7f6b7587c40594))
* add arrow icon, fix icon stories ([cfc58c8](https://github.com/memori-ai/memori-react/commit/cfc58c87a322c7faaf3b32033f4520d56bae4bd5))
* add commitlint, husky, release-it ([159098d](https://github.com/memori-ai/memori-react/commit/159098da55f6bee2c9297a703528844ffadedf34))
* add configuration entry for login token ([2891c5e](https://github.com/memori-ai/memori-react/commit/2891c5e181b133cbdd96443456b0617b9b551cf8))
* add deepthought icon ([59292cf](https://github.com/memori-ai/memori-react/commit/59292cfe8ea624b2ed2262eb043d2c15789d9529))
* add demos ([3d64061](https://github.com/memori-ai/memori-react/commit/3d6406102283359cf12651fe72cbfc6d40cdc8e3))
* add details in package.json + upgrade api client ([f0ce68a](https://github.com/memori-ai/memori-react/commit/f0ce68ade744fd02c4af3a08d4b2849fbbef9113))
* add finnish lang ([36f7c14](https://github.com/memori-ai/memori-react/commit/36f7c14e82c51881e43956d99ab427d8f2220921))
* add formatting config + run prettier ([fbba151](https://github.com/memori-ai/memori-react/commit/fbba151ac8d7d90b4d62166da4ac3b30b72c9236))
* add general usage story ([309de4b](https://github.com/memori-ai/memori-react/commit/309de4b22a675f2597aa9ebbc97c3929b3983a5a))
* add greek lang ([d3767e2](https://github.com/memori-ai/memori-react/commit/d3767e2397101daca1f91f2469a2c365905dd784))
* add husky pre-commit test + lint run ([aa709e4](https://github.com/memori-ai/memori-react/commit/aa709e48c25543c3cddf76ca838d9e10ecde6ec7))
* add i18n wrapper to layout stories ([87694f1](https://github.com/memori-ai/memori-react/commit/87694f10f83f1077fda9b9616daa426d7762177f))
* add layout to propTypes ([2693869](https://github.com/memori-ai/memori-react/commit/269386988292ec9937730e4639e4179b3f5f68be))
* add license ([622da6b](https://github.com/memori-ai/memori-react/commit/622da6bf48be827af2ce932bfb354ad2a9b451d3))
* add linting tools ([9622e7d](https://github.com/memori-ai/memori-react/commit/9622e7d5ec5ad156893b98fe283181c2c54273b3))
* add mock data ([d03f361](https://github.com/memori-ai/memori-react/commit/d03f3611ad65933386f2d50d5ba0d96595fb7df0))
* add new chevron icons ([2cbcf7d](https://github.com/memori-ai/memori-react/commit/2cbcf7d72eccc646e7c6b90b15bc708798ce72ce))
* add new error code from backend/assets ([e43e834](https://github.com/memori-ai/memori-react/commit/e43e834185719f5665ff82fdd4f269c1ebb514be))
* add new prop disableTextEnteredEvents to disable listeners ([b4ab8b7](https://github.com/memori-ai/memori-react/commit/b4ab8b7c88d9d79bc19a6bc64694f30bbea0c2e4))
* add newline handling in messages after marked parsing ([2031fd6](https://github.com/memori-ai/memori-react/commit/2031fd6e5cdeb7d58d53e7cd834e12ec2926b157))
* add newline handling in messages after marked parsing ([4e49005](https://github.com/memori-ai/memori-react/commit/4e49005592767be3765e21b14b5d43d4d95399a6))
* add refresh icon ([055402e](https://github.com/memori-ai/memori-react/commit/055402e42d2ef0c37ed1910eff06f8f1f6a713a4))
* add removeLocalConfig helper, fix undefined error ([5ed27f9](https://github.com/memori-ai/memori-react/commit/5ed27f92c977f1f66970a2d213c1cc8db5391f15))
* add sb script + viewport for sb preview ([38a963b](https://github.com/memori-ai/memori-react/commit/38a963b207a3f1fb4f8d6db8bb741b4e4260f0ef))
* add showSettings in header, default to false, add i18n ([cb91eeb](https://github.com/memori-ai/memori-react/commit/cb91eeb87587715c5406e5e0653963bc0cacfe4a))
* add storybook url in package.json, set node >= 16 ([10f5b85](https://github.com/memori-ai/memori-react/commit/10f5b85f4ccb9b446d500ee6e729741405ecfe0c))
* add storybook-static to gitignore ([294a9e3](https://github.com/memori-ai/memori-react/commit/294a9e3a9026f37d774c675bef1bca70cbf593da))
* add try catch on message sending, stopping loading on error ([079bd15](https://github.com/memori-ai/memori-react/commit/079bd1504354c40cadf18c6620d9f2db49d0e72a))
* add typecheck script ([5228a43](https://github.com/memori-ai/memori-react/commit/5228a43e6686256e4944ab44a505e13ad4405dc8))
* add typecheck script in husky pre-commit ([9754349](https://github.com/memori-ai/memori-react/commit/9754349cbf938204c3a189082ff4cf491ae784ab))
* added check to avoid translation if message is already translated + refactoring ([5a4b000](https://github.com/memori-ai/memori-react/commit/5a4b000e0cee808890481f86c5103546d4a31447))
* added story for chat history translation ([84fed16](https://github.com/memori-ai/memori-react/commit/84fed16fbba3b4e0d301bf70defcfffd5bb3c19a))
* added translations on chat history preview ([dfdc9b4](https://github.com/memori-ai/memori-react/commit/dfdc9b44a0c77824a3d4ebf652286bcfb4f266b2))
* align text privacy tooltip startpanel ([1f539eb](https://github.com/memori-ai/memori-react/commit/1f539ebd8e3f93bfb2c5aea9b935b180e7ce1070))
* avoid chatLog message translation if already translated from history ([c42f075](https://github.com/memori-ai/memori-react/commit/c42f075325324ab06fe372eb46b6acf1ae46051e))
* change dompurify sanitize import ([4279ac0](https://github.com/memori-ai/memori-react/commit/4279ac028bba93948705a6243d041cd786c45028))
* change other references to twincreator to aisuru ([2780e01](https://github.com/memori-ai/memori-react/commit/2780e015d376f3d7469750dd72ea6ebeaa613620))
* change speech services region ([d851f29](https://github.com/memori-ai/memori-react/commit/d851f29b2381335fc2978d69db45bbd54c18a06f))
* check device width and orientation for controls position default value ([79dda42](https://github.com/memori-ai/memori-react/commit/79dda4205fcd30a788f5a99ffddcc448f8d11e83))
* cleanup ([f3c9a20](https://github.com/memori-ai/memori-react/commit/f3c9a2056661e156432f8bf3641dbc944e74970e))
* cleanup ([91be6f7](https://github.com/memori-ai/memori-react/commit/91be6f7998738a3e57560a521a5bf93737339196))
* cleanup ([bd755c7](https://github.com/memori-ai/memori-react/commit/bd755c7de3736f4685e66076f058ff7ca6d513d2))
* cleanup ([94fb8b0](https://github.com/memori-ai/memori-react/commit/94fb8b06a118e42da695da5dd4bbf307ff723914))
* cleanup ([8d0cd0b](https://github.com/memori-ai/memori-react/commit/8d0cd0b03fc94234c7e266f9345dded2fc1ff218))
* cleanup + add global prop for showUpload ([fa29eb6](https://github.com/memori-ai/memori-react/commit/fa29eb690bbc027213207c39aac8a27065327867))
* cleanup deps and lockfile ([3044342](https://github.com/memori-ai/memori-react/commit/3044342b9dde3e758c92968a4547a829d2984dd5))
* cleanup jest config ([b1a593d](https://github.com/memori-ai/memori-react/commit/b1a593d7aa38e5f7576eebfebf8151f8d3fbf8cb))
* cleanup logs ([720ff84](https://github.com/memori-ai/memori-react/commit/720ff844cb6fce23b7990f02448dafe66e1de642))
* cleanup logs ([2f5ce87](https://github.com/memori-ai/memori-react/commit/2f5ce875eb2e553eab121be60e21bfedec479092))
* cleanup logs ([19f99e7](https://github.com/memori-ai/memori-react/commit/19f99e753a1b3725867f941a7c1d331680560414))
* cleanup moved css from widget to change mode ([92be8eb](https://github.com/memori-ai/memori-react/commit/92be8ebf3c57dd528d5fa0fbf2b09dce167b39d3))
* cleanup package.json ([e482423](https://github.com/memori-ai/memori-react/commit/e482423b7e4911bf2ea8d503242f665ac723b399))
* cleanup replace backend url with proxy ([1c9ea7a](https://github.com/memori-ai/memori-react/commit/1c9ea7aea315c7e4c0ae891752f05378061ef211))
* cleanup unused props ([f4ae85f](https://github.com/memori-ai/memori-react/commit/f4ae85f2175d3974e7c9de88f446971d822ca086))
* cleanup unused props ([53c421a](https://github.com/memori-ai/memori-react/commit/53c421aadf7d6a3d2f2561dea58e627b0a0b5970))
* cleanup, fix avatar blob fallback ([74b522e](https://github.com/memori-ai/memori-react/commit/74b522e26f8de499ecf3e53050b8f33a782e9bbc))
* **deps:** bump [@memori](https://github.com/memori).ai/ui to ^1.5.2 ([de74299](https://github.com/memori-ai/memori-react/commit/de74299807a0d0a295855240d82d7828b41097b3))
* **deps:** update dependencies ([729688f](https://github.com/memori-ai/memori-react/commit/729688f6c0b29079e9d594bc006f3f3928c0cbc9))
* disabled card of active chat on chat history ([ccfe96a](https://github.com/memori-ai/memori-react/commit/ccfe96ae0ad1422298cdb86afe9a70999362178d))
* downgrade convertapi-js version and update dependencies in package.json and yarn.lock ([ce33a34](https://github.com/memori-ai/memori-react/commit/ce33a343ae4ab18c4ee6543b57703f2ce0167647))
* enhance artifact handling in Chat component with new test cases ([d64f5cb](https://github.com/memori-ai/memori-react/commit/d64f5cb2f65b30a0ce81cf1564cb67053e59f94f))
* enhance minAge check with fallback ([c03cef3](https://github.com/memori-ai/memori-react/commit/c03cef3956c0ccf0f57a77807659496f8f417dd5))
* enhance uilang typings ([7b94bcf](https://github.com/memori-ai/memori-react/commit/7b94bcf8d0e34c034ee386386ed51fc74f68ba0f))
* enhancements for new lines parsing ([c30cde5](https://github.com/memori-ai/memori-react/commit/c30cde58a42db15b25406214d0ee4b73578ca607))
* expandable remove debug text, fix colors and css ([91175e1](https://github.com/memori-ai/memori-react/commit/91175e1206f0048c53b3b3795a18f634205bae95))
* fallback for translations ([997ad7a](https://github.com/memori-ai/memori-react/commit/997ad7ad0b39e7f55bf030ad8db1010661f4afb8))
* fix api client init, pass same instance down ([24a5113](https://github.com/memori-ai/memori-react/commit/24a5113f1607091cf9e3e7ad0dcb2e1e55af7318))
* fix export history button align ([97afcc6](https://github.com/memori-ai/memori-react/commit/97afcc64b4cd7e7d3dbede3be8ff9d053676428e))
* fix icons story imports ([d3d7bf4](https://github.com/memori-ai/memori-react/commit/d3d7bf489e3949d6eaf8c063e042e1fea0a26138))
* fix lint issues ([243c50d](https://github.com/memori-ai/memori-react/commit/243c50dabb2f59838564f4b4da37c9dccc660b37))
* fix lint issues ([4a28e22](https://github.com/memori-ai/memori-react/commit/4a28e22d4c4d367ea6acbf6f260c44790d8d1a24))
* fix lint issues ([2215492](https://github.com/memori-ai/memori-react/commit/2215492a2a9c260301531e6cd7ec81a4d9e18d4d))
* fix lint warning ([cdaf407](https://github.com/memori-ai/memori-react/commit/cdaf407825f7dc1f17ff5314f1f7920211ba83ec))
* fix linter warning ([2f51269](https://github.com/memori-ai/memori-react/commit/2f512698257d9858e82c31d324bf926338875c62))
* fix relative imports ([ef269da](https://github.com/memori-ai/memori-react/commit/ef269dadaac0c1e1e39187556c66ab0fe83c2524))
* fix text area expand button styles ([49df632](https://github.com/memori-ai/memori-react/commit/49df632ff3b5248fd2f2501abf96dee7736e57b6))
* fix ts warning ([9b97363](https://github.com/memori-ai/memori-react/commit/9b9736362758c1dfd82ab659695801003458a7b9))
* fix typo in stories ([1b71ac9](https://github.com/memori-ai/memori-react/commit/1b71ac9666c9160b650b6f37801184af75de1aec))
* fix version ([95725fe](https://github.com/memori-ai/memori-react/commit/95725fe484c3bcf025bbddbdb1c5e834b98a31fe))
* fix windows issue on end of line ([f1b99b0](https://github.com/memori-ai/memori-react/commit/f1b99b034d09e781d6cdf0bd844357375945a458))
* format storybook preview ([c77455b](https://github.com/memori-ai/memori-react/commit/c77455b39d78e7d835ee9d7cc6198f286ff11068))
* generated by ai label in chat with fallback ([f28199b](https://github.com/memori-ai/memori-react/commit/f28199be65f9ea010ef6c9b3c6bc6eb5700fb669))
* get visemes data from azure and processed the visemes data when speak ([14c76a8](https://github.com/memori-ai/memori-react/commit/14c76a837d0cc045e48e53019d3100af921052a2))
* **i18n:** add i18n + translations files ([6790724](https://github.com/memori-ai/memori-react/commit/679072475a10dc30eb2fe9b90fb33721568ac756))
* **i18n:** add title to snippet copy button ([aa56073](https://github.com/memori-ai/memori-react/commit/aa560731faf0911d9bfb67350086534889cdcfd7))
* **i18n:** add translation for generated by ai ([a7694bc](https://github.com/memori-ai/memori-react/commit/a7694bc8ac538185ae9f25833ba386b84e4fcad9))
* **i18n:** add translations for blocked memori badge ([50d6af9](https://github.com/memori-ai/memori-react/commit/50d6af950d41ee010d48d08d47594fee1ade46e6))
* **i18n:** add translations for send on enter menu + fix width ([4917b1f](https://github.com/memori-ai/memori-react/commit/4917b1f2d9f6df00d1deba25c0b5a7552d15b25c))
* **i18n:** add translations for share button + fix width ([39af177](https://github.com/memori-ai/memori-react/commit/39af177b5f1ef5910ff8d7f946d5d4c7a9be27e3))
* **i18n:** add translations to auth, add tests ([cc16d64](https://github.com/memori-ai/memori-react/commit/cc16d64c43ba9119fcce8d31241d08b393d48b1d))
* lower snippet timeout ([e265657](https://github.com/memori-ai/memori-react/commit/e26565709e225e0476a1ced3a1dd8e6f199c3301))
* migrate to yarn@3 ([d9e92a3](https://github.com/memori-ai/memori-react/commit/d9e92a3668daf041f16a61777f6ecff24fd76233))
* mock position drawer for now ([27fd297](https://github.com/memori-ai/memori-react/commit/27fd297e10de1c90f50dbf05882f7a72af91415c))
* pass secret to widget ([a13e29e](https://github.com/memori-ai/memori-react/commit/a13e29e19a5bf548dfdb7b615e390b3ffe1858d9))
* pick stories in whole src dir for sb ([9675109](https://github.com/memori-ai/memori-react/commit/9675109a3c34dca0cfeac9d731a16ccda8f9e1c4))
* pin azure sdk to 1.20.0 ([a615436](https://github.com/memori-ai/memori-react/commit/a615436b989a8c55008d5561fecea54fbd70ff41))
* powered by memori.ai ([562d96b](https://github.com/memori-ai/memori-react/commit/562d96b75d0c6bab4515d3b8138292450b02c2a1))
* powered by memori.ai with analytics params ([dda9e57](https://github.com/memori-ai/memori-react/commit/dda9e57d14339c86bec6ae915191159b3074171b))
* prepare for dynamic voice for boe ([bf04616](https://github.com/memori-ai/memori-react/commit/bf0461603b340d9bbe12137e58f7532be12ee47d))
* prepare for release ([a6a6db6](https://github.com/memori-ai/memori-react/commit/a6a6db678068717093ea7b14e3eac262b9507c73))
* prepare for release ([99c839c](https://github.com/memori-ai/memori-react/commit/99c839c90b372cd0bfb0d5dbdac5514649cd79ae))
* prepare for release ([a553186](https://github.com/memori-ai/memori-react/commit/a5531863ebfa6d2e28a5d66013a62516207a82cc))
* prevent errors server side ([de5203e](https://github.com/memori-ai/memori-react/commit/de5203e8f1933ed27101ead3a8f0d71510e98d9f))
* reduce VISEME_OVERLAP ([474e3ea](https://github.com/memori-ai/memori-react/commit/474e3ea852377970244d4e20f22d76a4df24d6e3))
* refactor lip sync process, calculate time relative to when processing started ([0d33986](https://github.com/memori-ai/memori-react/commit/0d33986f4566e6de911e9fd724184785e2ac61f2))
* refactor showOnlyLastMessages and default props, prevents issues ([3e72aff](https://github.com/memori-ai/memori-react/commit/3e72aff6c701f2e4475562254b1e1dff9f524bbd))
* release v1.0.0 ([ccfd04d](https://github.com/memori-ai/memori-react/commit/ccfd04d6070f423f38138197f0c5e198c622380e))
* release v1.0.0-alpha.0 ([bafa4bc](https://github.com/memori-ai/memori-react/commit/bafa4bc75b9bf62f7f46a9e6fe971d97d4820bec))
* release v1.0.0-alpha.1 ([8bfb662](https://github.com/memori-ai/memori-react/commit/8bfb66244f9242ecf122f7e7c7e136af70ff3d50))
* release v1.0.0-alpha.10 ([c438ece](https://github.com/memori-ai/memori-react/commit/c438ececd8b0fb959bb0b59b12f762928331cbea))
* release v1.0.0-alpha.11 ([f3f9451](https://github.com/memori-ai/memori-react/commit/f3f9451ddb2355437f42bbf2dbf131d02d89d43f))
* release v1.0.0-alpha.12 ([bef141b](https://github.com/memori-ai/memori-react/commit/bef141b24020c11e52a654c32397985cf8ff8dfb))
* release v1.0.0-alpha.13 ([24588b7](https://github.com/memori-ai/memori-react/commit/24588b7eec69efafa59411f6cc9eb1d22fbb96af))
* release v1.0.0-alpha.14 ([a647d7c](https://github.com/memori-ai/memori-react/commit/a647d7cd4084e084b399d6e80f5297bc0eee2481))
* release v1.0.0-alpha.15 ([117df25](https://github.com/memori-ai/memori-react/commit/117df25ffa1dcf8ef1bfdb0fdd7d02de93d65323))
* release v1.0.0-alpha.16 ([08d8c8b](https://github.com/memori-ai/memori-react/commit/08d8c8b14132af964e37ef9d6890fae23594765c))
* release v1.0.0-alpha.17 ([07dadd6](https://github.com/memori-ai/memori-react/commit/07dadd64a7dfab21b9a86f88075c97d44e60102a))
* release v1.0.0-alpha.18 ([60ff7f9](https://github.com/memori-ai/memori-react/commit/60ff7f900f61d3ca18460bb07f003a7f121a159e))
* release v1.0.0-alpha.19 ([5a9f0f8](https://github.com/memori-ai/memori-react/commit/5a9f0f87227d449afec990843d72368a92ecf03a))
* release v1.0.0-alpha.2 ([b1a4980](https://github.com/memori-ai/memori-react/commit/b1a4980b5c13a02b955203278089462cb0b8a7e9))
* release v1.0.0-alpha.20 ([4c2d8fe](https://github.com/memori-ai/memori-react/commit/4c2d8fe8818bcace50f65ceac88cce1f1c5a6842))
* release v1.0.0-alpha.21 ([2348ff7](https://github.com/memori-ai/memori-react/commit/2348ff781584228192a3625db9308d1bfc480693))
* release v1.0.0-alpha.22 ([7cf14cf](https://github.com/memori-ai/memori-react/commit/7cf14cf450b19ea1446c200d84cf26ee2da64ccb))
* release v1.0.0-alpha.23 ([fd526eb](https://github.com/memori-ai/memori-react/commit/fd526eb8dcb452be6df2e772bff7e5c1a59d61b3))
* release v1.0.0-alpha.24 ([5232eb8](https://github.com/memori-ai/memori-react/commit/5232eb86bf12dc330862d64112aad9cd69d744c6))
* release v1.0.0-alpha.3 ([470c6cd](https://github.com/memori-ai/memori-react/commit/470c6cd4854e8fccd6b14331b2b1a72b3851459a))
* release v1.0.0-alpha.4 ([d7342be](https://github.com/memori-ai/memori-react/commit/d7342befdfbade050a02a40f478c4c8d2f54d4d6))
* release v1.0.0-alpha.5 ([10fa4af](https://github.com/memori-ai/memori-react/commit/10fa4af528b74533126679f41ee48403d91e7855))
* release v1.0.0-alpha.6 ([726b133](https://github.com/memori-ai/memori-react/commit/726b133f0f1695b9a30080ce70ea276fc0ab1b07))
* release v1.0.0-alpha.7 ([ee0f67e](https://github.com/memori-ai/memori-react/commit/ee0f67ef4aa07e13bb52ef17158c04051ab3c31c))
* release v1.0.0-alpha.8 ([f1e26ae](https://github.com/memori-ai/memori-react/commit/f1e26ae14f162cd30e63385714221722255583fd))
* release v1.0.0-alpha.9 ([4373908](https://github.com/memori-ai/memori-react/commit/43739088d8c753dc7eb201c1a7b17a342055b0a0))
* release v1.0.0-rc.0 ([058dfd7](https://github.com/memori-ai/memori-react/commit/058dfd7d983139c1b704313c8609df2885193655))
* release v1.0.0-rc.1 ([74aa792](https://github.com/memori-ai/memori-react/commit/74aa7926d5f270268ad7f11b887b80b8a673e2fc))
* release v1.0.0-rc.2 ([d3aceec](https://github.com/memori-ai/memori-react/commit/d3aceecf130f775019c2a550833e3f7ebe54a76a))
* release v1.0.0-rc.3 ([8544038](https://github.com/memori-ai/memori-react/commit/85440385d69caedb72d1ff38303b1f626c41967a))
* release v1.0.0-rc.4 ([487fadf](https://github.com/memori-ai/memori-react/commit/487fadfdfb0d249ce6b8f0d9f1bfa2eba55f19d1))
* release v1.0.0-rc.5 ([b37b285](https://github.com/memori-ai/memori-react/commit/b37b28509b3f874c261cef9c5e444c2c752cb7e4))
* release v1.0.0-rc.6 ([21377f7](https://github.com/memori-ai/memori-react/commit/21377f794debde3f5cacc1afdb5d7f5213892c2a))
* release v1.0.1 ([e8ef261](https://github.com/memori-ai/memori-react/commit/e8ef261f513aaeeac756606b905da91212b5f6d4))
* release v1.0.2 ([de6738c](https://github.com/memori-ai/memori-react/commit/de6738c94a18d67afde5373580b2347c55c65509))
* release v1.1.0 ([b9a24ef](https://github.com/memori-ai/memori-react/commit/b9a24ef660221051627cda8827c0ffd4d21e09b9))
* release v1.2.0 ([9b32913](https://github.com/memori-ai/memori-react/commit/9b3291369b97b56c6ddb5195813ef7c9890d483d))
* release v1.2.1 ([9957fa0](https://github.com/memori-ai/memori-react/commit/9957fa070860a9dbdbd04dd3ed983e793905dc78))
* release v2.0.0 ([e8a1a99](https://github.com/memori-ai/memori-react/commit/e8a1a99820227e168955b36aae6b96e57c698bea))
* release v2.0.1 ([57d246a](https://github.com/memori-ai/memori-react/commit/57d246a4b6516505255e22c31424cf6de0ec8c0e))
* release v2.0.10 ([8229b38](https://github.com/memori-ai/memori-react/commit/8229b38cc12059ed8c3cf1c2deb23b6943300aaf))
* release v2.0.11 ([de99635](https://github.com/memori-ai/memori-react/commit/de99635d130e034e72cebe6f3704fe0f626025b2))
* release v2.0.2 ([0061b66](https://github.com/memori-ai/memori-react/commit/0061b66722d737763e869d6397c26fe12286fdc3))
* release v2.0.3 ([82f8849](https://github.com/memori-ai/memori-react/commit/82f88495864f22aaa9a7553f9d94ac8feef6f0cc))
* release v2.0.4 ([6109f92](https://github.com/memori-ai/memori-react/commit/6109f92387942d7aa9b56b87ff74ae1dca33dfa2))
* release v2.0.5 ([297ea53](https://github.com/memori-ai/memori-react/commit/297ea538f52c3071c927bedcb327cee49878a7f2))
* release v2.0.6 ([65086cd](https://github.com/memori-ai/memori-react/commit/65086cd6b0cc3e29e0b85b7928622e7456183f94))
* release v2.0.7 ([588c143](https://github.com/memori-ai/memori-react/commit/588c14358704e88178ba626993a5708115981a44))
* release v2.0.8 ([4b71a30](https://github.com/memori-ai/memori-react/commit/4b71a30560b7847f5575c93e8c5697d7ffd778fa))
* release v2.0.9 ([1ec893d](https://github.com/memori-ai/memori-react/commit/1ec893d7e6753b4eaf5eb331cea317a0b665551e))
* release v2.1.0 ([4170d68](https://github.com/memori-ai/memori-react/commit/4170d684ff8ee56068e8510507f702112af1bdb4))
* release v2.10.0 ([8ff96ed](https://github.com/memori-ai/memori-react/commit/8ff96ed3193a52d9b0e5884437d728be95bb2265))
* release v2.10.1 ([8e3dad8](https://github.com/memori-ai/memori-react/commit/8e3dad8ee9336ddc2e8a8403a81aeac70e4de169))
* release v2.10.2 ([de92daf](https://github.com/memori-ai/memori-react/commit/de92daf9bf9722882d261d44bea8d5c7354f0b72))
* release v2.11.0 ([992a037](https://github.com/memori-ai/memori-react/commit/992a0374074b2fc759f821075eecab2865aad55f))
* release v2.12.0 ([b99482a](https://github.com/memori-ai/memori-react/commit/b99482aa1229900340c6956376e9232a21dbe2c1))
* release v2.13.0 ([557db74](https://github.com/memori-ai/memori-react/commit/557db74dbd2ef164ed89966400108a904c4d1d4b))
* release v2.13.1 ([508d8cc](https://github.com/memori-ai/memori-react/commit/508d8ccfc1a278d21cede66c9193391411450629))
* release v2.14.0 ([fbf1e11](https://github.com/memori-ai/memori-react/commit/fbf1e1189e728b8092a074d7789b769dad2bffc3))
* release v2.15.0 ([4306ca6](https://github.com/memori-ai/memori-react/commit/4306ca64266738bd58bca58384b444ab6e65c748))
* release v2.15.1 ([ab3c6fa](https://github.com/memori-ai/memori-react/commit/ab3c6fac36dfb5b015f7f64423a12345c511d4b6))
* release v2.16.0 ([002162c](https://github.com/memori-ai/memori-react/commit/002162cd99381bd168cbb6f81c9f5e23f6270b27))
* release v2.16.1 ([7853507](https://github.com/memori-ai/memori-react/commit/7853507e0b1e674b018a79f5b1bdd27b644645e4))
* release v2.17.0 ([4d9a4b8](https://github.com/memori-ai/memori-react/commit/4d9a4b8348668b6fbdf6a7aafd34a1d6eb73d517))
* release v2.17.1 ([342f8c5](https://github.com/memori-ai/memori-react/commit/342f8c5af2a2bffe170246352096d0587b151d1d))
* release v2.18.0 ([d509ebd](https://github.com/memori-ai/memori-react/commit/d509ebd78fe8349f105affe73bcd7614748ffbc5))
* release v2.18.1 ([02c9bac](https://github.com/memori-ai/memori-react/commit/02c9bac31bbc6e229937357d9e9d8caf83e16048))
* release v2.18.2 ([df3c562](https://github.com/memori-ai/memori-react/commit/df3c562bc3df5b40556d0ded2ae9107fc4050a8c))
* release v2.18.3 ([f400cad](https://github.com/memori-ai/memori-react/commit/f400cad0735feddeb86237be2490297c86dd015a))
* release v2.18.4 ([62d92c2](https://github.com/memori-ai/memori-react/commit/62d92c23e7bbf15513b123015c1176c0d35692ad))
* release v2.18.5 ([81c15ff](https://github.com/memori-ai/memori-react/commit/81c15ff230b1bf6145cc72c9879aefcc618cdacc))
* release v2.18.6 ([3331495](https://github.com/memori-ai/memori-react/commit/3331495b53802a36aabbd12d5d57ec05d53331c6))
* release v2.18.7 ([ccc8393](https://github.com/memori-ai/memori-react/commit/ccc839307dba97f12b376d6d72820a310642ee5e))
* release v2.18.8 ([e4074e6](https://github.com/memori-ai/memori-react/commit/e4074e67a239b6c77923f0b888eda90cbfeb7d76))
* release v2.18.9 ([6e28622](https://github.com/memori-ai/memori-react/commit/6e28622b87003a3aad896c342debb469a6aaed2c))
* release v2.19.0 ([c7c0bf8](https://github.com/memori-ai/memori-react/commit/c7c0bf8b2629531080c2afbe07686a40a3fd3dba))
* release v2.19.1 ([d173df6](https://github.com/memori-ai/memori-react/commit/d173df66be2f0d68799de62ca81d980adc74149c))
* release v2.19.2 ([402eea0](https://github.com/memori-ai/memori-react/commit/402eea01f0420c171a57b010c64dc811e2ae673c))
* release v2.2.0 ([dc2c1a6](https://github.com/memori-ai/memori-react/commit/dc2c1a62e31ca470706f4d0222f23fa00d72a01b))
* release v2.2.1 ([371a8e4](https://github.com/memori-ai/memori-react/commit/371a8e4763fc5ed2cea810ecad515bf02022dc66))
* release v2.2.2 ([2432971](https://github.com/memori-ai/memori-react/commit/243297182a9051cb9958e7d7d73e8ab0dccf59bd))
* release v2.20.0 ([4c8cfdb](https://github.com/memori-ai/memori-react/commit/4c8cfdb116e99c9ed19cb8d91c380aed4f88f29d))
* release v2.20.1 ([93d6d1a](https://github.com/memori-ai/memori-react/commit/93d6d1a23e6e92612d548d7760219859185abae2))
* release v2.20.2 ([863941f](https://github.com/memori-ai/memori-react/commit/863941f4bcd5775472bfd80885b9e396d5ecfa01))
* release v2.21.0 ([32e10ea](https://github.com/memori-ai/memori-react/commit/32e10ea0d6a0b17d36578fbff41713e155b3b26d))
* release v2.22.0 ([c3f1d6e](https://github.com/memori-ai/memori-react/commit/c3f1d6e4cb41dbada2a0f3fdf60b40c52e098bad))
* release v2.23.0 ([9f78d95](https://github.com/memori-ai/memori-react/commit/9f78d95820f3d72c3379fe670911ba6e1defb487))
* release v2.3.0 ([5f35292](https://github.com/memori-ai/memori-react/commit/5f35292e828114ad21ad641e0d21286c1f1db925))
* release v2.3.1 ([865f79d](https://github.com/memori-ai/memori-react/commit/865f79d84f08fc4cce18a815978b63717d5cf9b0))
* release v2.4.0 ([63cf8c4](https://github.com/memori-ai/memori-react/commit/63cf8c40cf25cd374ec93c44eb230730ea776a0b))
* release v2.4.1 ([3140d2d](https://github.com/memori-ai/memori-react/commit/3140d2d01ec38a0d8551f62228b3e7f081204315))
* release v2.4.2 ([a7d878e](https://github.com/memori-ai/memori-react/commit/a7d878e72f416c7429d0efd33f28337b98cb6ccc))
* release v2.5.0 ([78d99c7](https://github.com/memori-ai/memori-react/commit/78d99c72ca1c1b433f15255f2ac1705ede89df70))
* release v2.5.1 ([d368cbd](https://github.com/memori-ai/memori-react/commit/d368cbde3b2f999200053dd3e8226ba31226aca8))
* release v2.6.0 ([6497a7d](https://github.com/memori-ai/memori-react/commit/6497a7d76d97e0b56460731973da67140195a8ab))
* release v2.6.1 ([33037b1](https://github.com/memori-ai/memori-react/commit/33037b1bac7e9969ba2b76248fbc90d46ee39478))
* release v2.6.2 ([24fd267](https://github.com/memori-ai/memori-react/commit/24fd267aa041cc7c53b781c2d849cbc8ce972d20))
* release v2.6.3 ([263da22](https://github.com/memori-ai/memori-react/commit/263da22a127580372e0b2fae3b6d82de3d03d707))
* release v2.6.4 ([6c619da](https://github.com/memori-ai/memori-react/commit/6c619da788c2754a7b375a479819bd6088297f87))
* release v2.6.5 ([31459b1](https://github.com/memori-ai/memori-react/commit/31459b1446862fb46a48ff5e5ad5e6a2d3f97ff2))
* release v2.6.6 ([5597429](https://github.com/memori-ai/memori-react/commit/559742985ad457e2bd0b88f2805fc66c8e26f946))
* release v2.7.0 ([40a930a](https://github.com/memori-ai/memori-react/commit/40a930a797a02f00b846e3ad7c59075e217bf86d))
* release v2.7.1 ([090a462](https://github.com/memori-ai/memori-react/commit/090a4627c19d827d74ac9ba2094afa482539f641))
* release v2.7.2 ([fe77f19](https://github.com/memori-ai/memori-react/commit/fe77f19ce4502a8dd65d3264e421abf86dcaf8b9))
* release v2.8.0 ([301bc2c](https://github.com/memori-ai/memori-react/commit/301bc2c52e961451a5895641bf882c77cc90393e))
* release v2.8.1 ([36970b4](https://github.com/memori-ai/memori-react/commit/36970b4a112084356c29481b52a5f86194ad98ad))
* release v2.8.2 ([d6ddaa0](https://github.com/memori-ai/memori-react/commit/d6ddaa07b1069da40ff64bce6f1ba32bbc24d3c3))
* release v2.8.3 ([cd93e16](https://github.com/memori-ai/memori-react/commit/cd93e162497bd5c7acf06e4cb75bbc456faa967f))
* release v2.9.0 ([1b559df](https://github.com/memori-ai/memori-react/commit/1b559df543ddd2f09a13c82f47251296a9e8864c))
* release v2.9.1 ([f647f8e](https://github.com/memori-ai/memori-react/commit/f647f8e6cd9978df8134bc14fe21c3236502c882))
* release v2.9.2 ([7873ae0](https://github.com/memori-ai/memori-react/commit/7873ae034129afe8bd851b15a8df02d6afb4df63))
* release v3.0.0 ([c1dbd91](https://github.com/memori-ai/memori-react/commit/c1dbd9177b6c8209ef1066b01c38eac109a40a51))
* release v3.0.0-rc.0 ([8588a2b](https://github.com/memori-ai/memori-react/commit/8588a2b454ae99d4d99891245b709b03323281de))
* release v3.0.1 ([f1964a0](https://github.com/memori-ai/memori-react/commit/f1964a0563bf63e7abb645de56f75729b2c70767))
* release v3.0.2 ([3ab1a31](https://github.com/memori-ai/memori-react/commit/3ab1a31fabb7948d768ff111e74b0350b162babe))
* release v4.0.0 ([dd4de9c](https://github.com/memori-ai/memori-react/commit/dd4de9c64e58e484bc66013ae80fccee86963acd))
* release v4.0.1 ([85c7f87](https://github.com/memori-ai/memori-react/commit/85c7f878e15bc67798889283545a28c0f634c715))
* release v4.1.0 ([26617a1](https://github.com/memori-ai/memori-react/commit/26617a1754027af63c4e8fdb724b97ce5c705c8f))
* release v4.1.1 ([fab0e88](https://github.com/memori-ai/memori-react/commit/fab0e88207dc5e5780c89074f2199bcdf7099965))
* release v4.2.0 ([5daecfc](https://github.com/memori-ai/memori-react/commit/5daecfc7e15291c128650999342fcbda689dbb22))
* release v4.3.0 ([e9267b2](https://github.com/memori-ai/memori-react/commit/e9267b2113897e76dedd932874d3e2020fe7a5c2))
* release v4.3.1 ([0592e90](https://github.com/memori-ai/memori-react/commit/0592e9096dbdc5a6485f9106ca39a9bbe3d96195))
* release v4.4.0 ([784a006](https://github.com/memori-ai/memori-react/commit/784a0064ac2366ccc2a54eaf74724a5b768d8d98))
* release v4.4.1 ([ca201b6](https://github.com/memori-ai/memori-react/commit/ca201b612e957a62d57cb5f894c19512d236aa7e))
* release v5.0.0 ([ead55a1](https://github.com/memori-ai/memori-react/commit/ead55a178cd4d99c863f1e32b315c18a03b17ea3))
* release v5.0.1 ([15f7479](https://github.com/memori-ai/memori-react/commit/15f747924d7bd6890ae6189a4b64bdec6cd587ad))
* release v5.0.2 ([235dbb0](https://github.com/memori-ai/memori-react/commit/235dbb00dd8b41887204b61ea46296379cc88b76))
* release v5.1.0 ([d1d3df7](https://github.com/memori-ai/memori-react/commit/d1d3df794d36120fa687f7c0ecb86618c8544968))
* release v6.0.0 ([b0e4d16](https://github.com/memori-ai/memori-react/commit/b0e4d1695d7a10b24d95b7535744dc28569fbdda))
* release v6.0.0-rc.0 ([66464e2](https://github.com/memori-ai/memori-react/commit/66464e2973689a7b348b7c96a5d0b2013a327922))
* release v6.0.0-rc.1 ([7dbf350](https://github.com/memori-ai/memori-react/commit/7dbf3507ecaca508f900df583cf33c1ad431e0d0))
* release v6.0.0-rc.2 ([ec14f6f](https://github.com/memori-ai/memori-react/commit/ec14f6f13d784df84f6df1a4574f4687230ea38d))
* release v6.0.0-rc.3 ([7bfd668](https://github.com/memori-ai/memori-react/commit/7bfd668b34462394282829c1ffeeb852d6ac8355))
* release v6.1.0 ([bd7f88a](https://github.com/memori-ai/memori-react/commit/bd7f88a33d4580e76b49d5b5294149017a5e4fc8))
* release v6.1.1 ([3da0480](https://github.com/memori-ai/memori-react/commit/3da0480a66226dea330a01e410b16bc862ff4bb0))
* release v6.1.2 ([d6bc172](https://github.com/memori-ai/memori-react/commit/d6bc1720590851ff79193956394769fea95134f8))
* release v6.1.3 ([2c76d84](https://github.com/memori-ai/memori-react/commit/2c76d84128f307974d939670b0d32e2fcb5e2986))
* release v6.1.4 ([3f10759](https://github.com/memori-ai/memori-react/commit/3f10759e30923538a0c427315b2042f98fbc53ba))
* release v6.1.5 ([aed0e38](https://github.com/memori-ai/memori-react/commit/aed0e382a7c265678237052b8d256a466ca6378a))
* release v6.1.6 ([3fbbdc4](https://github.com/memori-ai/memori-react/commit/3fbbdc43f169e440f79ff763837b5b5e5d6e1e85))
* release v6.1.7 ([3eaec66](https://github.com/memori-ai/memori-react/commit/3eaec66ad17a88fa6fb65ef6eb17c645db4fc350))
* release v6.2.0 ([a535462](https://github.com/memori-ai/memori-react/commit/a5354620eea9bcbdfcfa064fc0232bcd0a91ebd1))
* release v6.3.0 ([0d7e350](https://github.com/memori-ai/memori-react/commit/0d7e35005243e062cba71f2f4aa3bb3ba003ec20))
* release v6.3.1 ([c721f4d](https://github.com/memori-ai/memori-react/commit/c721f4d8b45e952400bd738186790a9c920fcd8f))
* release v6.4.0 ([379c5d0](https://github.com/memori-ai/memori-react/commit/379c5d0465ca2e67a95e2de3cefdc668d0d99560))
* release v6.4.1 ([1b53320](https://github.com/memori-ai/memori-react/commit/1b53320911eb935e81d06232b07eb343a9543cbc))
* release v6.4.2 ([228abd6](https://github.com/memori-ai/memori-react/commit/228abd6ea0f0a454dc65ae982414077226dfb5bb))
* release v6.4.3 ([3f19a9c](https://github.com/memori-ai/memori-react/commit/3f19a9c8ecb03aa1cd4ca3c0bad088109ee9affa))
* release v6.4.4 ([d2ed754](https://github.com/memori-ai/memori-react/commit/d2ed7549e0b80ce84a1ea43c2d2d6b90196b30d1))
* release v6.4.5 ([6bb1929](https://github.com/memori-ai/memori-react/commit/6bb1929831ec928c430519a2343c92297193d03a))
* release v6.4.6 ([2b8cda2](https://github.com/memori-ai/memori-react/commit/2b8cda290ea82a0f69b62b0a809806f9b0bf5d7d))
* release v6.5.0 ([5cd6629](https://github.com/memori-ai/memori-react/commit/5cd662956af4af346e6d18f37a36c0107e7bf98e))
* release v6.5.1 ([9a8e379](https://github.com/memori-ai/memori-react/commit/9a8e379d63dcd40067fc4f8bee228b1c856a90a9))
* release v6.5.2 ([52a5de3](https://github.com/memori-ai/memori-react/commit/52a5de3faa919d49c6ac99caebee387d6f1a7eb7))
* release v6.5.3 ([22e559f](https://github.com/memori-ai/memori-react/commit/22e559f94089626331d9f8187f3aa8d7e64639dd))
* release v6.6.0 ([e01850b](https://github.com/memori-ai/memori-react/commit/e01850b679ea4c3ec88144bd951b66aff2ba1601))
* release v6.6.1 ([da141b7](https://github.com/memori-ai/memori-react/commit/da141b7a71a17f5a471b78f38148906acfc621c2))
* release v6.6.2 ([a9eb0fc](https://github.com/memori-ai/memori-react/commit/a9eb0fc27f4490ebe7d27879d7e027b5f29e9292))
* release v6.7.0 ([37be1fb](https://github.com/memori-ai/memori-react/commit/37be1fb3a80d080281cb85b8db4f6a7aaab5aeb5))
* release v6.7.1 ([aad7ca7](https://github.com/memori-ai/memori-react/commit/aad7ca7d3405a88b43e05734743343824b81805b))
* release v6.7.2 ([4161456](https://github.com/memori-ai/memori-react/commit/4161456112306b4d17ed5805c8c40bf3faaf589f))
* release v6.8.0 ([3d0cdff](https://github.com/memori-ai/memori-react/commit/3d0cdfffc4345428d65250bc0aa800d7e1ae5bc8))
* release v6.8.1 ([bf398fb](https://github.com/memori-ai/memori-react/commit/bf398fbf12761550b4d46759689a023714b1199c))
* release v6.8.2 ([346dca9](https://github.com/memori-ai/memori-react/commit/346dca9fa6ca517b2ddcd807791f3212641e9697))
* release v6.8.4 ([93537db](https://github.com/memori-ai/memori-react/commit/93537dbe59edfe18762d5054c834f09b94d9ef49))
* release v7.0.0 ([bb9529a](https://github.com/memori-ai/memori-react/commit/bb9529a91b3f2740d59e545f075fcb2a767366f6))
* release v7.0.1 ([648330d](https://github.com/memori-ai/memori-react/commit/648330d551b716d6d9be605e36b962226e25422e))
* release v7.0.2 ([46508ff](https://github.com/memori-ai/memori-react/commit/46508ff3eeb392ffcb3330e8119162c52acc58ab))
* release v7.0.3 ([dcbdc0f](https://github.com/memori-ai/memori-react/commit/dcbdc0f75f507f643414f308ab309902f47bad71))
* release v7.0.4 ([fddc632](https://github.com/memori-ai/memori-react/commit/fddc63244814c423241a966550ee3e4f15f36c28))
* release v7.0.5 ([674c284](https://github.com/memori-ai/memori-react/commit/674c28474ed8b2b7644e6c27af8fed23760a8514))
* release v7.0.6 ([021be17](https://github.com/memori-ai/memori-react/commit/021be177653bf04d3b88960fb1a8fcb531c09ab3))
* release v7.0.7 ([975e8a9](https://github.com/memori-ai/memori-react/commit/975e8a9af63e6bad07f6322ea72d9ae12abe98bb))
* release v7.0.8 ([7ba6dad](https://github.com/memori-ai/memori-react/commit/7ba6dada0ddfac030f8486c6a0e96b9e596d3ddc))
* release v7.1.0 ([3f2a302](https://github.com/memori-ai/memori-react/commit/3f2a3023a0f4793c4788ba9c64d9d0bd8ed82cda))
* release v7.1.1 ([3196cbd](https://github.com/memori-ai/memori-react/commit/3196cbd6099d95d224632ade765ca2056b9176d2))
* release v7.1.2 ([2a2fe50](https://github.com/memori-ai/memori-react/commit/2a2fe50719cf3c433d35ccebf41552f66d4299f1))
* release v7.1.3 ([246cd70](https://github.com/memori-ai/memori-react/commit/246cd704bbe0d984d6dbc4bb8cee550ccd8f4272))
* release v7.10.0 ([fe11692](https://github.com/memori-ai/memori-react/commit/fe116923b25e1358fe6272611ae232b64bfbcb3f))
* release v7.11.0 ([0f71164](https://github.com/memori-ai/memori-react/commit/0f711644629f9771d02b7c7085951df2be537ac3))
* release v7.11.1 ([99d425d](https://github.com/memori-ai/memori-react/commit/99d425d4314ad720d2d53adff35d32e29e701ed8))
* release v7.11.2 ([700aaff](https://github.com/memori-ai/memori-react/commit/700aaff8254b02206efc2719d39cb6ba62f26f06))
* release v7.11.3 ([df97003](https://github.com/memori-ai/memori-react/commit/df97003c0685c00b0545bf11992d1f8f2dba4698))
* release v7.11.4 ([764f976](https://github.com/memori-ai/memori-react/commit/764f976ac8f1e9dfef2b1c0c2df2b80df94bbb1e))
* release v7.12.0 ([1251a98](https://github.com/memori-ai/memori-react/commit/1251a9817f3f4a3287e5c09fbd25c49ec37a570e))
* release v7.12.1 ([85ed96c](https://github.com/memori-ai/memori-react/commit/85ed96c1d8812879a7cd1cb1639f046723be05e2))
* release v7.12.2 ([12b323e](https://github.com/memori-ai/memori-react/commit/12b323e088f36cabd720447770a49e6e7f04c8c5))
* release v7.13.0 ([e532b2a](https://github.com/memori-ai/memori-react/commit/e532b2a1ba871672c1807ca31e8aa1b4c15770f1))
* release v7.13.1 ([1a70d88](https://github.com/memori-ai/memori-react/commit/1a70d88030953c268f98345948ccf68fc7985bc0))
* release v7.13.2 ([b0270cc](https://github.com/memori-ai/memori-react/commit/b0270ccfc76a4c819d506a273aa1c9936ec4a740))
* release v7.13.3 ([e83257c](https://github.com/memori-ai/memori-react/commit/e83257cfb684a0a6d2baa6752e94dd73e2683819))
* release v7.13.4 ([c33ab5e](https://github.com/memori-ai/memori-react/commit/c33ab5e89a2aa790eb7253a80827bc18f7ef4bb7))
* release v7.14.0 ([8d6cc6b](https://github.com/memori-ai/memori-react/commit/8d6cc6b6becbeff2465f26d2ba296d031039f113))
* release v7.14.1 ([cc63bd8](https://github.com/memori-ai/memori-react/commit/cc63bd8d418389432111b271be395c35f3737fe0))
* release v7.14.2 ([67bf366](https://github.com/memori-ai/memori-react/commit/67bf366610c68b52ab90fab6bb3e6c218900715c))
* release v7.15.0 ([016250e](https://github.com/memori-ai/memori-react/commit/016250e4f9adeadca78aa3b0f9f36b6e19a97105))
* release v7.15.1 ([f91a69e](https://github.com/memori-ai/memori-react/commit/f91a69e19e053506c0f7e4f01b778084b87f1563))
* release v7.15.2 ([06060f3](https://github.com/memori-ai/memori-react/commit/06060f37316be35c5ae61fc3ef6c618556e92145))
* release v7.16.0 ([bf9b265](https://github.com/memori-ai/memori-react/commit/bf9b265a06386122c8fedf7cf4d0e4b88b025b39))
* release v7.16.1 ([db13a57](https://github.com/memori-ai/memori-react/commit/db13a57fa6de46ae37c78f1f4567d9cc00d41908))
* release v7.16.2 ([5fb9e67](https://github.com/memori-ai/memori-react/commit/5fb9e6704650ec002818430fe58ab7e453453753))
* release v7.17.0 ([9e7c9ea](https://github.com/memori-ai/memori-react/commit/9e7c9ea3528e7a68b150b6eb1c182960ffb3d8e7))
* release v7.17.1 ([950ec0e](https://github.com/memori-ai/memori-react/commit/950ec0ef61e0d099d41ece5fc95b747435c9cc70))
* release v7.17.2 ([eea5a27](https://github.com/memori-ai/memori-react/commit/eea5a279e10dec4ae7e62eceda498b1885a067ca))
* release v7.18.0 ([61d9b70](https://github.com/memori-ai/memori-react/commit/61d9b706622f08ef7fe758a08d13dcaa436fb986))
* release v7.19.0 ([22447a2](https://github.com/memori-ai/memori-react/commit/22447a205d51f4814471a1bfc81350321b922fbc))
* release v7.19.1 ([7e151d2](https://github.com/memori-ai/memori-react/commit/7e151d2c16011b7e63123d0fcd057cee84eed705))
* release v7.19.2 ([41d2ff6](https://github.com/memori-ai/memori-react/commit/41d2ff6cae4111d55f1455adc45cce3eaec27a5a))
* release v7.2.0 ([53fb74c](https://github.com/memori-ai/memori-react/commit/53fb74c45ef7407323b7053fe7385b46b0139f6a))
* release v7.21.0 ([0011870](https://github.com/memori-ai/memori-react/commit/0011870548b42e28671486b5217537b4937dd320))
* release v7.21.1 ([94f362f](https://github.com/memori-ai/memori-react/commit/94f362ff15df542544c2a4ae98384d7e78aa7111))
* release v7.22.0 ([a8ffc09](https://github.com/memori-ai/memori-react/commit/a8ffc09452360d081fc6f1ec355f77d452b98642))
* release v7.23.0 ([0ccb68f](https://github.com/memori-ai/memori-react/commit/0ccb68f5ae4f6c66cee4be280f2698abfa97700c))
* release v7.23.1 ([9b43d04](https://github.com/memori-ai/memori-react/commit/9b43d048232c13df862b89c1b799a1a544bc3817))
* release v7.24.0 ([e4bc85b](https://github.com/memori-ai/memori-react/commit/e4bc85b54411bcf4364bd4c70d3ceb44ea32b087))
* release v7.25.0 ([8ecbb88](https://github.com/memori-ai/memori-react/commit/8ecbb881d3a1835e1170f1dd4ca1e4f04bed3446))
* release v7.25.1 ([fa97ad3](https://github.com/memori-ai/memori-react/commit/fa97ad3425593c8baddb122933970bbee152dca1))
* release v7.26.0 ([56c9706](https://github.com/memori-ai/memori-react/commit/56c97060353aafc3b3cfc89196fe18f013e02e19))
* release v7.26.1 ([7aea41a](https://github.com/memori-ai/memori-react/commit/7aea41acced084756775c3f5b288ed3e7e7ed448))
* release v7.26.2 ([12c79dd](https://github.com/memori-ai/memori-react/commit/12c79dd773e986c7b27b5276233395762aa760af))
* release v7.27.0 ([05a5b24](https://github.com/memori-ai/memori-react/commit/05a5b24dac490cee477054b1fd7ea8a1ae77a2f8))
* release v7.27.1 ([9a7c853](https://github.com/memori-ai/memori-react/commit/9a7c85316351850ab9958a4b6605f5fe1a95a64e))
* release v7.28.0 ([60a3bb7](https://github.com/memori-ai/memori-react/commit/60a3bb7086ebb18784bfc3797406bc62c71c2f22))
* release v7.28.1 ([386536c](https://github.com/memori-ai/memori-react/commit/386536c565ad5177887e180de425640d7fa87713))
* release v7.29.0 ([1b8ead3](https://github.com/memori-ai/memori-react/commit/1b8ead3653ad746f6b45378772c4eaa6d3ad9e47))
* release v7.29.1 ([7aa1a84](https://github.com/memori-ai/memori-react/commit/7aa1a84fc995107b10c7bfd1f6d26f71f9f77b6a))
* release v7.3.0 ([e822bc6](https://github.com/memori-ai/memori-react/commit/e822bc66c2c14722d2624b2f250c7b2cd0b3c37c))
* release v7.3.1 ([7f74c64](https://github.com/memori-ai/memori-react/commit/7f74c64b614134e42ced6a210d9de35d1c2b4ccf))
* release v7.30.0 ([21f7573](https://github.com/memori-ai/memori-react/commit/21f75734a6a5c35824d7ab1944b8a6e46b5d8595))
* release v7.30.1 ([9d477c1](https://github.com/memori-ai/memori-react/commit/9d477c1c7e6db150636b6c8b3155a7f263d159f9))
* release v7.30.2 ([6612883](https://github.com/memori-ai/memori-react/commit/6612883e25b28947879951b092f9d7acdde0c578))
* release v7.30.3 ([b6db2c4](https://github.com/memori-ai/memori-react/commit/b6db2c44f29e40fa3b6107b1110ea0f5a38ed0c5))
* release v7.30.4 ([4767b68](https://github.com/memori-ai/memori-react/commit/4767b68b8258d994a1afc8ab08b90325af0a7b87))
* release v7.30.5 ([9ce8f8a](https://github.com/memori-ai/memori-react/commit/9ce8f8a5b5a5cb7b847dcfbce541607d4d2cfee3))
* release v7.30.6 ([4c9a45e](https://github.com/memori-ai/memori-react/commit/4c9a45ec5e30ea84b8832c3430dfcdda95800315))
* release v7.31.0 ([4ab26c2](https://github.com/memori-ai/memori-react/commit/4ab26c2d1fc042f583316bc5df564f82b61cfeb2))
* release v7.31.1 ([b63fa4b](https://github.com/memori-ai/memori-react/commit/b63fa4be3901cd1adec694fcf97eb1e283f5fbfd))
* release v7.32.0 ([3c296e8](https://github.com/memori-ai/memori-react/commit/3c296e83a9187d8093b53770bc59ba83495fdb0d))
* release v7.32.1 ([ce05a0a](https://github.com/memori-ai/memori-react/commit/ce05a0ab7ccbebe84bf0d9d76e7a4c3c7e1afb9e))
* release v7.32.2 ([01833a7](https://github.com/memori-ai/memori-react/commit/01833a7996d311a04d47f13668bbd0e1da3b2ca2))
* release v7.32.3 ([a2eff53](https://github.com/memori-ai/memori-react/commit/a2eff538b7336e324ac2171ae38f0ab49313b2d4))
* release v7.32.4 ([956bbcd](https://github.com/memori-ai/memori-react/commit/956bbcdedb48a5da8930f26bf8c91348317301bc))
* release v7.32.5 ([36c99d4](https://github.com/memori-ai/memori-react/commit/36c99d46d63785b026e9ac9ca7b14e354a52f9f8))
* release v7.32.6 ([a38949c](https://github.com/memori-ai/memori-react/commit/a38949c86aafac54f4a64afdefa919bc569cb1e0))
* release v7.32.7 ([c4b919d](https://github.com/memori-ai/memori-react/commit/c4b919dfd60b255b3dfb49d013858ceb84d0d9a9))
* release v7.32.8 ([5754370](https://github.com/memori-ai/memori-react/commit/5754370e9fef7985f836e7683df3d07f01525cae))
* release v7.33.0 ([967359e](https://github.com/memori-ai/memori-react/commit/967359e9890730d6544e13cb2e44bcdd4dd70984))
* release v7.33.1 ([fc99e7f](https://github.com/memori-ai/memori-react/commit/fc99e7fcdce9132757980b7d9d20d3389b58cd24))
* release v7.33.2 ([df36a28](https://github.com/memori-ai/memori-react/commit/df36a28d5aa5e0a29fe19ae5e0debbb33d266e99))
* release v7.33.3 ([ee51004](https://github.com/memori-ai/memori-react/commit/ee51004b66407f800add2e6e100dd30b14abda87))
* release v7.33.4 ([a8a2d36](https://github.com/memori-ai/memori-react/commit/a8a2d3649bfbe023988b3af0e2f78640bd492d2a))
* release v7.34.0 ([bec7fd6](https://github.com/memori-ai/memori-react/commit/bec7fd603890ff32f28228c88c7c34609093cd09))
* release v7.34.1 ([1d69464](https://github.com/memori-ai/memori-react/commit/1d69464490c60dd53a83f00a491899c1f6f14ddb))
* release v7.34.2 ([cc38598](https://github.com/memori-ai/memori-react/commit/cc3859830b790c8b466278cb9bcff2efa9488c01))
* release v7.4.0 ([566bff5](https://github.com/memori-ai/memori-react/commit/566bff543e68641c003fe22f859d8c5b4b4f426d))
* release v7.4.1 ([4141a29](https://github.com/memori-ai/memori-react/commit/4141a2977fd2134a8fe33c2939a9e598edbf71cd))
* release v7.4.2 ([0e987c0](https://github.com/memori-ai/memori-react/commit/0e987c0c637f05c1a381529f63a5914f4c276349))
* release v7.4.3 ([19b642a](https://github.com/memori-ai/memori-react/commit/19b642a8f312474d091d1e7852365597337966e8))
* release v7.4.4 ([9d2e81b](https://github.com/memori-ai/memori-react/commit/9d2e81bdd7be31e112521f2ad6cd4dfbb2f048ea))
* release v7.4.5 ([0c9fd51](https://github.com/memori-ai/memori-react/commit/0c9fd5191b6470e07c6d67ae78ae7bc5f95171da))
* release v7.4.6 ([8b43247](https://github.com/memori-ai/memori-react/commit/8b43247a500d3eb40ba4b5e4fe10a828a9f14c62))
* release v7.5.0 ([36eec67](https://github.com/memori-ai/memori-react/commit/36eec6709c336b1da17ea3a933fe5cd660d83ff7))
* release v7.5.1 ([3007567](https://github.com/memori-ai/memori-react/commit/3007567ee09641201e4cea71fe704221df3dda8e))
* release v7.6.0 ([cca8f0d](https://github.com/memori-ai/memori-react/commit/cca8f0d592c1af18680a43360a7dd420cb9baaea))
* release v7.6.1 ([78f1fa4](https://github.com/memori-ai/memori-react/commit/78f1fa4b41711adf813ab5486469636a0cb86d9a))
* release v7.7.0 ([f80bb9b](https://github.com/memori-ai/memori-react/commit/f80bb9b280c612695dfc009abc6ebd50d43184cc))
* release v7.7.1 ([3ae8870](https://github.com/memori-ai/memori-react/commit/3ae88708a2579850f32efb2e27866bb75e6cfe11))
* release v7.8.0 ([639ae4e](https://github.com/memori-ai/memori-react/commit/639ae4ee6de95a7d1387a962e7790fd642f4189a))
* release v7.8.0-rc.0 ([25e1cd3](https://github.com/memori-ai/memori-react/commit/25e1cd36135d454023d4cada313d8156fa8d059b))
* release v7.8.0-rc.1 ([e133fa4](https://github.com/memori-ai/memori-react/commit/e133fa4b6f826c3e3796b31bb154ac95c8a3cda6))
* release v7.8.1 ([24a9f1a](https://github.com/memori-ai/memori-react/commit/24a9f1acd3e863c44ca05e6b95e3b55d61b1aa12))
* release v7.8.2 ([cd52afb](https://github.com/memori-ai/memori-react/commit/cd52afbfe1a4a84b4911778e833b3713943a72db))
* release v7.8.3 ([77622da](https://github.com/memori-ai/memori-react/commit/77622da95964a348b60a11726c9aeee1088655b9))
* release v7.8.4 ([daf5afc](https://github.com/memori-ai/memori-react/commit/daf5afcc45284711e104f76b6174a7495fd44ee6))
* release v7.8.5 ([a69327d](https://github.com/memori-ai/memori-react/commit/a69327dc27bcd4b0e43e48e9bfddc608389b192a))
* release v7.8.6 ([50894c6](https://github.com/memori-ai/memori-react/commit/50894c6876d97c1735fcf555534af6e7dbed8a00))
* release v7.8.7 ([0e17c24](https://github.com/memori-ai/memori-react/commit/0e17c247af8606eb64ce3757b785bb147018175f))
* release v7.8.8 ([e2f4f5f](https://github.com/memori-ai/memori-react/commit/e2f4f5f3b1905d6daf20f80ed1c7eb796ca525ea))
* release v7.9.0 ([f025efb](https://github.com/memori-ai/memori-react/commit/f025efbdefe03b6f6960011a09c5473d616a0f08))
* release v7.9.1 ([c71b9b2](https://github.com/memori-ai/memori-react/commit/c71b9b2bda76b444b80b7d53f51b1931363578b4))
* release v8.0.0-rc.0 ([46200d1](https://github.com/memori-ai/memori-react/commit/46200d18003fc3769c20cd49095ede48dfe3c8a0))
* release v8.0.0-rc.1 ([070a95f](https://github.com/memori-ai/memori-react/commit/070a95f06dd038f20f7623f08ff813e5e377d523))
* release v8.0.0-rc.10 ([6d621fd](https://github.com/memori-ai/memori-react/commit/6d621fdcd13e94cf2e82f0bab0dfc4ae2fa5c78a))
* release v8.0.0-rc.11 ([4a27a96](https://github.com/memori-ai/memori-react/commit/4a27a9665124900f73c0e09b6f39befe9ad40fe5))
* release v8.0.0-rc.12 ([8e8bb49](https://github.com/memori-ai/memori-react/commit/8e8bb49a27880969677cc20c7849ae30b1538817))
* release v8.0.0-rc.2 ([79a2e48](https://github.com/memori-ai/memori-react/commit/79a2e484cc309bed2ddb5be965b7411c3e1399b6))
* release v8.0.0-rc.3 ([8414644](https://github.com/memori-ai/memori-react/commit/8414644b64517033cc8dcc6d21513683757298d9))
* release v8.0.0-rc.4 ([7046827](https://github.com/memori-ai/memori-react/commit/7046827d1296bc1e0c729b8d6ef51dde5564c292))
* release v8.0.0-rc.5 ([d2b4034](https://github.com/memori-ai/memori-react/commit/d2b4034c25db44e490068dd8324037e8018610e0))
* release v8.0.0-rc.6 ([9c4ef54](https://github.com/memori-ai/memori-react/commit/9c4ef54e2a0d170039b3b60960f0fa0f71a12982))
* release v8.0.0-rc.7 ([7c216d9](https://github.com/memori-ai/memori-react/commit/7c216d994302c406b3d6267fcbd1a746073f3d7c))
* release v8.0.0-rc.8 ([231a6e0](https://github.com/memori-ai/memori-react/commit/231a6e039f128799a0ff83a102b3e114be2a9327))
* release v8.0.0-rc.9 ([d737453](https://github.com/memori-ai/memori-react/commit/d737453516801ce164f5a7f584f510c71d2f723c))
* release v8.0.2 ([a07c47a](https://github.com/memori-ai/memori-react/commit/a07c47a93077bd452baaccd6a5bd9d18df40ec78))
* release v8.1.0 ([a51a6d7](https://github.com/memori-ai/memori-react/commit/a51a6d74829149c51fd35a7099757c91cf492613))
* release v8.1.0-rc.0 ([56737c3](https://github.com/memori-ai/memori-react/commit/56737c32b4b7bf9480175789e7167ee424ec6dd1))
* release v8.10.0 ([600a465](https://github.com/memori-ai/memori-react/commit/600a465d91fd8e65f7da8a817174861a9a1d781e))
* release v8.10.1 ([f4b9819](https://github.com/memori-ai/memori-react/commit/f4b98196eb59a98be188aee6817a3a5ed45247d6))
* release v8.11.0 ([13553a7](https://github.com/memori-ai/memori-react/commit/13553a72edb765f6337e7c702156a0889c72ece4))
* release v8.12.0 ([1e72399](https://github.com/memori-ai/memori-react/commit/1e72399669673e729db2af57b5d769a46e433a54))
* release v8.13.0 ([4fd0920](https://github.com/memori-ai/memori-react/commit/4fd09203ed9ebce5acd50a260154a86872e0b29f))
* release v8.13.2 ([b8ceb53](https://github.com/memori-ai/memori-react/commit/b8ceb532cf941972604aab6d2d147a36efc02211))
* release v8.13.3 ([094a0b5](https://github.com/memori-ai/memori-react/commit/094a0b532529b24d1576141181dcd8407d224e07))
* release v8.13.4 ([4c0e894](https://github.com/memori-ai/memori-react/commit/4c0e89415fa6dc9af3a21c9cc62b1f5001fabc72))
* release v8.13.5 ([2346059](https://github.com/memori-ai/memori-react/commit/234605975849a5788d2681524ba778bba12f5279))
* release v8.14.0 ([b2ac965](https://github.com/memori-ai/memori-react/commit/b2ac96521245ead457cb373d20fdc64636080392))
* release v8.14.0-rc.0 ([3258c07](https://github.com/memori-ai/memori-react/commit/3258c075ea4ba5329a2803c534121c5cd6e87ec8))
* release v8.14.1 ([5647da8](https://github.com/memori-ai/memori-react/commit/5647da8f5026d9224556a89f26f1ff97160ad77a))
* release v8.14.2 ([516583a](https://github.com/memori-ai/memori-react/commit/516583a5745de6b1b00017b0eb42d77fab3d92ab))
* release v8.15.0 ([6642801](https://github.com/memori-ai/memori-react/commit/664280108a2a7ed3545ac410cadc2915f7ca057e))
* release v8.15.1 ([b07d8e5](https://github.com/memori-ai/memori-react/commit/b07d8e5354726479e48b90e7bb2d0e44c7e416e3))
* release v8.16.0 ([7515be9](https://github.com/memori-ai/memori-react/commit/7515be9dbd4635402349a3fc2fdabc8267ebdd26))
* release v8.16.1 ([93be48c](https://github.com/memori-ai/memori-react/commit/93be48c2828595721a0daa0fc49cc3fe9fcef962))
* release v8.17.0 ([c6b6600](https://github.com/memori-ai/memori-react/commit/c6b66008713cb679c9e0f1a02a7b98a864948855))
* release v8.17.1 ([e7d0c06](https://github.com/memori-ai/memori-react/commit/e7d0c066f96db6830dcd25d57de557e4a5100ed3))
* release v8.17.2 ([874fd7a](https://github.com/memori-ai/memori-react/commit/874fd7a4a87544a174ddaebe70a66b26361e9e12))
* release v8.17.3 ([81347cf](https://github.com/memori-ai/memori-react/commit/81347cf06f1e35e5a75b26fe0b44e4c919cd7352))
* release v8.17.3 ([5fd2919](https://github.com/memori-ai/memori-react/commit/5fd2919daadf517fcc6e7efad4d41c68dbe84877))
* release v8.18.0 ([34d0faf](https://github.com/memori-ai/memori-react/commit/34d0fafab825a80c7a8a3c9ec102aa22b4acef96))
* release v8.18.0 ([b65cf42](https://github.com/memori-ai/memori-react/commit/b65cf420ef2156b0bd36f31dcd1e3b51b36e5482))
* release v8.18.1 ([20c00fe](https://github.com/memori-ai/memori-react/commit/20c00fe9d61bc809973c86d345fe727534b0554a))
* release v8.18.1 ([1d45d87](https://github.com/memori-ai/memori-react/commit/1d45d878ca9f7c8e55b6216f1bfe6d0f4a8fceff))
* release v8.18.2 ([27cdab4](https://github.com/memori-ai/memori-react/commit/27cdab4c10d0ead3b4a0f9405317629b9880ae4c))
* release v8.18.2 ([73e3d53](https://github.com/memori-ai/memori-react/commit/73e3d5340ed1c013700468b12a8cb52fad9aa281))
* release v8.19.0 ([63a2d16](https://github.com/memori-ai/memori-react/commit/63a2d16a00295a63d357283f65df5b4e6712005b))
* release v8.19.0 ([a8b6bb0](https://github.com/memori-ai/memori-react/commit/a8b6bb0c86e3224ed26b7be744912a813ccbf431))
* release v8.19.1 ([f308716](https://github.com/memori-ai/memori-react/commit/f308716588d1a56ab11298c18ba566db1dfbaf6f))
* release v8.19.1 ([64d7ad5](https://github.com/memori-ai/memori-react/commit/64d7ad5f9183e9305572d7fcbba01dc8655acff1))
* release v8.19.2 ([6a01759](https://github.com/memori-ai/memori-react/commit/6a01759aa6705f387746f806cffb602ffe07c559))
* release v8.19.2 ([aa8eba8](https://github.com/memori-ai/memori-react/commit/aa8eba8c6dae44997d41f5e2b226468675678ea2))
* release v8.19.3 ([275e533](https://github.com/memori-ai/memori-react/commit/275e533734d82bdc8ad3bfe07f31e1544eb009eb))
* release v8.19.3 ([6863aac](https://github.com/memori-ai/memori-react/commit/6863aac86791cc695aa4c323386db21c0711f687))
* release v8.2.0 ([e56de15](https://github.com/memori-ai/memori-react/commit/e56de154603c974115f618c81007aab67db0683b))
* release v8.20.0 ([c7bfe2b](https://github.com/memori-ai/memori-react/commit/c7bfe2baf8804c82cf3c435964ea9e132648ed6a))
* release v8.21.0 ([5a660df](https://github.com/memori-ai/memori-react/commit/5a660dfb9ef8156b056e7a81dd6ef1eaf1e463d0))
* release v8.22.0 ([0f8b4a3](https://github.com/memori-ai/memori-react/commit/0f8b4a31b6a01aa79c337d854c67716bc2f081a4))
* release v8.23.0 ([da4e39b](https://github.com/memori-ai/memori-react/commit/da4e39b2f432269c702591e4d2fd7421097acd66))
* release v8.24.0 ([9ac38e8](https://github.com/memori-ai/memori-react/commit/9ac38e84d68cee431722c3b816ca1b102cf22bc5))
* release v8.25.0 ([6bc8a61](https://github.com/memori-ai/memori-react/commit/6bc8a61e3ac2db7081e145ccc88562774fd4df07))
* release v8.26.0 ([9cf72cb](https://github.com/memori-ai/memori-react/commit/9cf72cb4a258a1606b5047984da24e308a6c316b))
* release v8.27.0 ([7f896ef](https://github.com/memori-ai/memori-react/commit/7f896ef5849a0219f5998ee002d27f3e5d5c8d2b))
* release v8.28.0 ([38b1c0e](https://github.com/memori-ai/memori-react/commit/38b1c0e9c9e1b9bce1ab2f6d9deaacd323437c41))
* release v8.29.0 ([973c4e4](https://github.com/memori-ai/memori-react/commit/973c4e4157d7fddd8af2fd3b5ea7eb437c257fbb))
* release v8.29.1 ([92f8e5e](https://github.com/memori-ai/memori-react/commit/92f8e5ea6d297c8c1dbddf556673935514d578eb))
* release v8.3.0 ([558d606](https://github.com/memori-ai/memori-react/commit/558d6068384faad965924b4e171f1d99ff7cd7ab))
* release v8.30.0 ([3386c9a](https://github.com/memori-ai/memori-react/commit/3386c9a1a9305d041f6c073e200ff9f65205ca3f))
* release v8.30.1 ([13d29f1](https://github.com/memori-ai/memori-react/commit/13d29f1020da76f43c3a5d5568cfa0fad9b2c2e3))
* release v8.30.1 ([492bb12](https://github.com/memori-ai/memori-react/commit/492bb12164b3da2ec54654932682d4c47fc884e4))
* release v8.31.0 ([ad31500](https://github.com/memori-ai/memori-react/commit/ad3150056d9793a4f8795803a7de1b0666295e46))
* release v8.31.0 ([31c377b](https://github.com/memori-ai/memori-react/commit/31c377b8624f3946095c46d486643fbbe6e1fbc2))
* release v8.32.0 ([ac8f19a](https://github.com/memori-ai/memori-react/commit/ac8f19a996a8a0f5b20bd1df89a711c97903de35))
* release v8.32.0 ([9a5e240](https://github.com/memori-ai/memori-react/commit/9a5e2404c3f706c5ce33c418de51c742236a63e7))
* release v8.33.0 ([9a483c3](https://github.com/memori-ai/memori-react/commit/9a483c37663cfa367001947b68ee70d7b82f22e1))
* release v8.34.0 ([2fcc8bd](https://github.com/memori-ai/memori-react/commit/2fcc8bdf96b018a322cc7ce3d5f703c74d9261ec))
* release v8.34.0 ([3690f0f](https://github.com/memori-ai/memori-react/commit/3690f0fe7a47dfe47ac3790331229e86bf33ce61))
* release v8.35.0 ([b64d572](https://github.com/memori-ai/memori-react/commit/b64d572c442aea44a4f3666e50b0c9524a74ee7e))
* release v8.35.1 ([f468c4f](https://github.com/memori-ai/memori-react/commit/f468c4f7bf9f4e5b5e05e625e5c455ac5a18ed9c))
* release v8.35.2 ([dcb247d](https://github.com/memori-ai/memori-react/commit/dcb247d2031dd22040120f1b0dd85f19cee70680))
* release v8.36.0 ([f6d6c92](https://github.com/memori-ai/memori-react/commit/f6d6c92ae9e0a337a3db215ea1ff7fed17725227))
* release v8.36.0 ([aa13b17](https://github.com/memori-ai/memori-react/commit/aa13b17b469ca45a926e5cf5778476146b936ab7))
* release v8.37.0 ([80b208c](https://github.com/memori-ai/memori-react/commit/80b208cad3abed75703d8cd45c4b98182bf36564))
* release v8.37.0 ([ce53a5d](https://github.com/memori-ai/memori-react/commit/ce53a5dfb812705135d976fa49a6686cd11eb5d7))
* release v8.38.0 ([536d919](https://github.com/memori-ai/memori-react/commit/536d919b9a01ad178cbba6be9e845be038baf5a8))
* release v8.38.0 ([95ce680](https://github.com/memori-ai/memori-react/commit/95ce6806829fe6e9e7bf05a8355b5638656264a7))
* release v8.38.1 ([d19a323](https://github.com/memori-ai/memori-react/commit/d19a3232d5ad7677c77e65a35fcacc9edc7c77f6))
* release v8.38.1 ([26b3984](https://github.com/memori-ai/memori-react/commit/26b39846dfb34fdf3c903fc36ca14b5333a8f38a))
* release v8.38.2 ([94fc800](https://github.com/memori-ai/memori-react/commit/94fc8006306bdc1b8a44c601b20283cfdcb9a388))
* release v8.38.2 ([2148560](https://github.com/memori-ai/memori-react/commit/2148560b51a5fef6ff15f77b61ecc240513ef716))
* release v8.38.3 ([55deed8](https://github.com/memori-ai/memori-react/commit/55deed80fe13b3c69cadf9bae44ba62d6d2589f1))
* release v8.38.3 ([1ac5bc2](https://github.com/memori-ai/memori-react/commit/1ac5bc26d35e62dd17fb3a26afddfaf71d1bda9b))
* release v8.38.4 ([81b6116](https://github.com/memori-ai/memori-react/commit/81b61161ef22621166014a2f258c45f653105857))
* release v8.38.4 ([d631e8b](https://github.com/memori-ai/memori-react/commit/d631e8b6249f204c5ca714aebe4f7ba27a61e745))
* release v8.38.5 ([ad1fca7](https://github.com/memori-ai/memori-react/commit/ad1fca7bf34c7a10790607f00fdc94bb4775e08a))
* release v8.4.0 ([7ca091e](https://github.com/memori-ai/memori-react/commit/7ca091e50be950176388ccbc25eb6b435e0c33ae))
* release v8.4.0-rc.0 ([7115cc8](https://github.com/memori-ai/memori-react/commit/7115cc8a6a8ad9678018a6a913d2283d166adc35))
* release v8.4.0-rc.1 ([9b70052](https://github.com/memori-ai/memori-react/commit/9b70052aab152c89a85e8317dc92e9bea665cf9b))
* release v8.4.0-rc.2 ([76b8ca5](https://github.com/memori-ai/memori-react/commit/76b8ca54d8ba3abd25439ebdc293d507545d0900))
* release v8.4.0-rc.3 ([f177b2e](https://github.com/memori-ai/memori-react/commit/f177b2e584a8999ae60f00818d105e4a7fa6454f))
* release v8.4.0-rc.4 ([f744887](https://github.com/memori-ai/memori-react/commit/f74488742498313f728138bdc073e67505ff6b34))
* release v8.4.0-rc.5 ([4035c5a](https://github.com/memori-ai/memori-react/commit/4035c5ac89bf9fa52a4bbb63177bc5f9a61a3355))
* release v8.4.0-rc.6 ([c23683d](https://github.com/memori-ai/memori-react/commit/c23683dfa9dc62227d8814b5ba74d5b3b2f2180e))
* release v8.4.0-rc.7 ([9ecc934](https://github.com/memori-ai/memori-react/commit/9ecc934327d7274e5a9dd80020f16a0465d48517))
* release v8.4.0-rc.8 ([739bbcb](https://github.com/memori-ai/memori-react/commit/739bbcb5d0a1dfc9c5a6391ac62217bf78398bd0))
* release v8.4.0-rc.9 ([6469e0b](https://github.com/memori-ai/memori-react/commit/6469e0b618cbd73fcd21b9cb55ffb36d57a476b5))
* release v8.4.1 ([98584c0](https://github.com/memori-ai/memori-react/commit/98584c024145135535e4935d1bc618f31aa079dc))
* release v8.4.2 ([a964eb9](https://github.com/memori-ai/memori-react/commit/a964eb92a1aac76d465b2c6d69dcaadbf461326c))
* release v8.5.0 ([b0de46c](https://github.com/memori-ai/memori-react/commit/b0de46c2b081ec88d75bcee067b8e79e814d7d94))
* release v8.5.1 ([1df0c6e](https://github.com/memori-ai/memori-react/commit/1df0c6eec6fd40d45b42a724f3360f94e5061335))
* release v8.5.2 ([71adfeb](https://github.com/memori-ai/memori-react/commit/71adfeb1add583df8aba644b4680a9afc108bbcc))
* release v8.6.0 ([6a1d319](https://github.com/memori-ai/memori-react/commit/6a1d3192f52abb26e5ce8922517eeba2ffa070d8))
* release v8.6.1 ([041e2dd](https://github.com/memori-ai/memori-react/commit/041e2dd85ad134e7efdc892840637e07e0aea43a))
* release v8.6.2 ([273b0d3](https://github.com/memori-ai/memori-react/commit/273b0d3f3c4f13d38d838c3cb71fe78c27a7b30c))
* release v8.6.3 ([8106fbc](https://github.com/memori-ai/memori-react/commit/8106fbc4b1079a61a9cbc267c8939ac9b1900811))
* release v8.6.4 ([e777f44](https://github.com/memori-ai/memori-react/commit/e777f44c72712f71b2fc34ff85ca9d7d761a8271))
* release v8.6.5 ([e17ea41](https://github.com/memori-ai/memori-react/commit/e17ea411b3633cd73b546234c4e319db26fd17b5))
* release v8.6.6 ([466c6fe](https://github.com/memori-ai/memori-react/commit/466c6fe9229ccf23190580fda146a0f73dde684d))
* release v8.6.7 ([25c33e9](https://github.com/memori-ai/memori-react/commit/25c33e91fd6f0250965c5c3518c9cc43bd6b7197))
* release v8.7.0 ([6ae7b6a](https://github.com/memori-ai/memori-react/commit/6ae7b6a439c8020cdeed43366997dc4779565075))
* release v8.7.1 ([342e0f4](https://github.com/memori-ai/memori-react/commit/342e0f4f08f531351198dd8953cc3dc743336fc9))
* release v8.7.2 ([c70bba9](https://github.com/memori-ai/memori-react/commit/c70bba92e351b1dca27f6bcaefabc0c9845863c0))
* release v8.7.3 ([3cf0d66](https://github.com/memori-ai/memori-react/commit/3cf0d66ab05fa050ef0e27cc146abf51ab60df86))
* release v8.7.4 ([603c29e](https://github.com/memori-ai/memori-react/commit/603c29e9796556c7e47768429794c6c7bacb906e))
* release v8.7.5 ([c5987e2](https://github.com/memori-ai/memori-react/commit/c5987e236bc1d5fbb00109d8e0ea8b254ccae6e1))
* release v8.7.6 ([012b7f7](https://github.com/memori-ai/memori-react/commit/012b7f716478ba4cb376f8286ff23135ca9e47f5))
* release v8.7.7 ([2f42627](https://github.com/memori-ai/memori-react/commit/2f426270123943fa654f695e152cd860a50b2d96))
* release v8.7.8 ([6334e68](https://github.com/memori-ai/memori-react/commit/6334e684cca8418ba10e3ac3ec975a38ae60329e))
* release v8.7.9 ([5c3c693](https://github.com/memori-ai/memori-react/commit/5c3c6932396305b356d2743dfadd3fc055609612))
* release v8.8.0 ([a848c95](https://github.com/memori-ai/memori-react/commit/a848c954582f0d0df5f827cee37b541f156a0d35))
* release v8.8.1 ([1867827](https://github.com/memori-ai/memori-react/commit/1867827e3762fced78719564f0479f26fdd60edd))
* release v8.8.2 ([458b706](https://github.com/memori-ai/memori-react/commit/458b706a74e67c8ed128fd697495cf275e37f10b))
* release v8.8.3 ([e4932bd](https://github.com/memori-ai/memori-react/commit/e4932bd0d30914156d5f296774d7ca5639e99c0b))
* release v8.8.4 ([58ce4b3](https://github.com/memori-ai/memori-react/commit/58ce4b3769efb43f11c9d3d29432f9c925409683))
* release v8.8.5 ([bc6643b](https://github.com/memori-ai/memori-react/commit/bc6643b6966d97d7a04ccdf7934184d3cc673613))
* release v8.9.0 ([2ac3d17](https://github.com/memori-ai/memori-react/commit/2ac3d173b9fe97b585202f5a5fcd4d509584bb0e))
* release v8.9.1 ([d4a4a78](https://github.com/memori-ai/memori-react/commit/d4a4a784e21ef7519193f7026cfcda19b3ca655b))
* release v8.9.2 ([a75cdb7](https://github.com/memori-ai/memori-react/commit/a75cdb766cd9d7e406bfe0ef1ca2ad538724d0bc))
* remove AZURE_COGNITIVE_SERVICES_TTS_KEY as prop ([06ee821](https://github.com/memori-ai/memori-react/commit/06ee821d309532941121c949badeb6f9d3a6d297))
* remove ConvertAPI dependency and simplify file processing ([ff55006](https://github.com/memori-ai/memori-react/commit/ff5500668a631ae3bdb4b14893d6faf9022f0be5))
* remove giver/instruct flows ([8dbef44](https://github.com/memori-ai/memori-react/commit/8dbef4462fad41fafa1c0425c8a4e3e4be39f558))
* remove tsup, go without bundler ([eb2e5b8](https://github.com/memori-ai/memori-react/commit/eb2e5b8d36a90d9f94720742dca736fe03176166))
* remove unused CSS import from MediaItemWidget ([a830dc9](https://github.com/memori-ai/memori-react/commit/a830dc9473ae53aff5a19dc0e45b56d644fa0239))
* remove unused dependencies ([c7d6852](https://github.com/memori-ai/memori-react/commit/c7d685265b78f3e7d3214fe59ab1cea9300cf65c))
* remove unused dependencies from package.json ([5ea6c79](https://github.com/memori-ai/memori-react/commit/5ea6c795dc104772f572cbbadc8fedb07ef42666))
* rename get tenant api ([eeeaa2b](https://github.com/memori-ai/memori-react/commit/eeeaa2b3f3cfefe7ba8fb3c881f37eaa0f7b8026))
* rename memori/twin in agents ([179868d](https://github.com/memori-ai/memori-react/commit/179868d8a9171370edb5fe56b63be0efd2f7d152))
* rename usage of twincreator in aisuru ([6a7778d](https://github.com/memori-ai/memori-react/commit/6a7778ddca1c9075478b96bb8b79ac8e0514d30f))
* rename usage of twincreator in aisuru, update powered by ([20094db](https://github.com/memori-ai/memori-react/commit/20094dbeecd08ed1161c06c166ab3bb9f3fcaa39))
* replace default typing sentences ([fe50410](https://github.com/memori-ai/memori-react/commit/fe504108f62d39bd0e69fdb0d603b18ffca5d4f5))
* restore needed jest config ([9e9c3f4](https://github.com/memori-ai/memori-react/commit/9e9c3f4a058b6061a276b5cc6d67f19ef8f5d97c))
* restore new session mark ([883567d](https://github.com/memori-ai/memori-react/commit/883567d4ce1f2bbcea0b435c6f0788f3a742c37d))
* run prettier ([575bf83](https://github.com/memori-ai/memori-react/commit/575bf838ec5beba0a738441b96225c453dae8b6f))
* run prettier formatting ([416ad37](https://github.com/memori-ai/memori-react/commit/416ad379a9db6f971a7ccdaa99e199b4ad56ffc1))
* set pkg non-version ([abd5e9e](https://github.com/memori-ai/memori-react/commit/abd5e9e97c822917d0310496cc9f19dbbeeb9325))
* setup ts as peer dep ([b2f285e](https://github.com/memori-ai/memori-react/commit/b2f285eba9ee78a130cd12b553949aa84c8863c3))
* show max 3 contents in why this answer ([29c9114](https://github.com/memori-ai/memori-react/commit/29c91148eba5f14b5a51cc00b22ec6b7f1cc0464))
* storybook compatibility with react 17 ([4ed785b](https://github.com/memori-ai/memori-react/commit/4ed785b299c2a9546eba4c204892dfdda202045b))
* **storybook:** add theme decorator and sync with background control ([4787d5b](https://github.com/memori-ai/memori-react/commit/4787d5b915dc74ad1a0867ba2846789a946145dc))
* **storybook:** set stories order ([568d3d4](https://github.com/memori-ai/memori-react/commit/568d3d40e7d3a7dd9bdb697b594bc62b2a291479))
* switch state media to emittedMedia, with fallback ([f1d78ab](https://github.com/memori-ai/memori-react/commit/f1d78ab536244b4d689a87e095dbec6e010802b8))
* switch to tsup ([54d1436](https://github.com/memori-ai/memori-react/commit/54d1436a6195303806c2c32985f6801ae6292d67))
* **temp:** adopt cache proxy endpoint for backend ([00f5f42](https://github.com/memori-ai/memori-react/commit/00f5f42797f03a7eea0818be677cb18a3f69906b))
* **temp:** adopt cache proxy endpoint for backend ([1c70b8b](https://github.com/memori-ai/memori-react/commit/1c70b8bfa5f13c80e80cf10e9a433bbd9f68ac97))
* the visemeContext begin visemes process when AudioContext starts ([11c78ab](https://github.com/memori-ai/memori-react/commit/11c78ab5d9017d45b163d973bca909e7a43cca09))
* transform default context vars uppercase ([7627eb1](https://github.com/memori-ai/memori-react/commit/7627eb1290182b8245e093b9a01d628257729b5b))
* turn console error in warn/debug for non essential/handled errors ([8693910](https://github.com/memori-ai/memori-react/commit/86939103c4b5aaae748ef4350af2d0c902602e1c))
* typing text timeout timespans ([8e3e3cf](https://github.com/memori-ai/memori-react/commit/8e3e3cf6c7434c7c07a3beae046559676e64b541))
* unused chat props as optional ([6e90a9f](https://github.com/memori-ai/memori-react/commit/6e90a9fc9ea87725392532d9eebf4ed6118abf9a))
* update [@memori](https://github.com/memori).ai/memori-api-client ([760dcf7](https://github.com/memori-ai/memori-react/commit/760dcf722658ede6418332e45dfd66a55216dc88))
* update [@memori](https://github.com/memori).ai/memori-api-client ([3267fc2](https://github.com/memori-ai/memori-react/commit/3267fc25bb4af2668cb621f7ab8ce520c289a7e1))
* update [@memori](https://github.com/memori).ai/memori-api-client to version 6.0.3 in package.json and yarn.lock ([a6e80e4](https://github.com/memori-ai/memori-react/commit/a6e80e4ed12794c1b274a8154e9f398e35bde7a2))
* update [@memori](https://github.com/memori).ai/memori-api-client to version 6.17.0 ([1a46821](https://github.com/memori-ai/memori-react/commit/1a4682100f951aa3e4b7a08cb176868ee513a042))
* update [@memori](https://github.com/memori).ai/memori-api-client to version 6.22.0 ([a425cec](https://github.com/memori-ai/memori-react/commit/a425cec379a9086ea12b1407f718c7de3a01d46f))
* update [@memori](https://github.com/memori).ai/memori-api-client to version 6.5.5 ([f1388dd](https://github.com/memori-ai/memori-react/commit/f1388ddedc3f4a90c82d6f8421674834b1ac68bd))
* update [@memori](https://github.com/memori).ai/memori-api-client--no-verify ([1600f2d](https://github.com/memori-ai/memori-react/commit/1600f2ddae7f4d2880c69ac1eecd3dc5e15134be))
* update [@memori](https://github.com/memori).ai/ui ([3177beb](https://github.com/memori-ai/memori-react/commit/3177bebc8e212de5fb20f5f82a6473fdb9d2ae48))
* update [@memori](https://github.com/memori).ai/ui ([800908c](https://github.com/memori-ai/memori-react/commit/800908cb78a2bb82d7fe3c4780420645b8df05a0))
* update [@memori](https://github.com/memori).ai/ui ([bf447f1](https://github.com/memori-ai/memori-react/commit/bf447f199f2281c557e3fb66bc36edae894df100))
* update [@memori](https://github.com/memori).ai/ui dependency ([42ad4c6](https://github.com/memori-ai/memori-react/commit/42ad4c6a216f9e2881c4117fdf60c05a399d9521))
* update [@memori](https://github.com/memori).ai/ui dependency ([a310624](https://github.com/memori-ai/memori-react/commit/a310624b1e26e75dbfc5b4ef18058baab3e33fac))
* update [@memori](https://github.com/memori).ai/ui dependency ([892be2d](https://github.com/memori-ai/memori-react/commit/892be2d0deb977cd3664ffab475a60a7ae3763e6))
* update [@memori](https://github.com/memori).ai/ui to and adjust theme colors in Storybook preview ([a0d7116](https://github.com/memori-ai/memori-react/commit/a0d7116dda3705efe0ea6078f362af6f8e99e9ca))
* update [@memori](https://github.com/memori).ai/ui to version 1.14.1 ([65f4b10](https://github.com/memori-ai/memori-react/commit/65f4b10fc6afd16a9e5adc1adcfcb18aace8448a))
* update api client ([9ab11a4](https://github.com/memori-ai/memori-react/commit/9ab11a4f04f2ac5442d8c7cf9ce0ccc03b88ee4f))
* update api client ([46ed9d9](https://github.com/memori-ai/memori-react/commit/46ed9d90952dfe24562a48523cce28eb018731da))
* update api client ([8ab1bfd](https://github.com/memori-ai/memori-react/commit/8ab1bfd9cee3d486155bb053226666621e0aa295))
* update api client ([6bacc0b](https://github.com/memori-ai/memori-react/commit/6bacc0bd11fb2c7db40d39bf19be6175cedf2770))
* update api client ([a97c44e](https://github.com/memori-ai/memori-react/commit/a97c44e4ac052135b2e515aa36c76424bdf729b5))
* update api client ([6bd877e](https://github.com/memori-ai/memori-react/commit/6bd877eacb69acbd38b375f7ee7ceaa33b2abd83))
* update api client ([87de67e](https://github.com/memori-ai/memori-react/commit/87de67e8720425cb5592e76cdbcd3cd19354b461))
* update api client ([034eb38](https://github.com/memori-ai/memori-react/commit/034eb38181287d4a5af68f00d5c0074ed6959e70))
* update api client ([501eb90](https://github.com/memori-ai/memori-react/commit/501eb90f43ef85290e7eb6f1fbb959de97d76859))
* update api client ([88c5311](https://github.com/memori-ai/memori-react/commit/88c5311a76422d60b1435daac0ca374fb0f61600))
* update api client ([b5020be](https://github.com/memori-ai/memori-react/commit/b5020be4633e7dc33eded5877315f3aa3d8aecb7))
* update api client ([562610c](https://github.com/memori-ai/memori-react/commit/562610c9ae13cbc2a7c3b637f6ba6a942b4a45fd))
* update api client ([56f3f4c](https://github.com/memori-ai/memori-react/commit/56f3f4c65a83dc29d01e93842a3e655af88c51b4))
* update api client ([4efa1b2](https://github.com/memori-ai/memori-react/commit/4efa1b2b21c63e730ccbb71d7522809c09cddfa2))
* update api client ([b606f45](https://github.com/memori-ai/memori-react/commit/b606f45f465f358c5d1fea97366db477e7dd6ac3))
* update api client ([ab6eb01](https://github.com/memori-ai/memori-react/commit/ab6eb016e50143f7002542730cf7de2f34aebe81))
* update api client ([e4c9526](https://github.com/memori-ai/memori-react/commit/e4c952653b379076109bd7db89292d5f55d34125))
* update api client ([fe6b549](https://github.com/memori-ai/memori-react/commit/fe6b549eadcba4f245e93550802d4114db1da4cf))
* update api client ([828e184](https://github.com/memori-ai/memori-react/commit/828e1849dfc0ab37aae1f126eb4948ed00aaf755))
* update api client ([80299cd](https://github.com/memori-ai/memori-react/commit/80299cd7b5a857dcd2d40d9135101771e0b21781))
* update api client ([da76587](https://github.com/memori-ai/memori-react/commit/da76587f4feee0a3e3939cb656dc7b3854e206a1))
* update api client + remove gamification ([e159713](https://github.com/memori-ai/memori-react/commit/e15971388168e1d18360bbff23f000c77e57046c))
* update api client and typings ([8cfe352](https://github.com/memori-ai/memori-react/commit/8cfe35290c12098a1e77d62b15a92518036703ec))
* update configuration and add convertapi-js mock ([d961e72](https://github.com/memori-ai/memori-react/commit/d961e725b04cedf2580d063d4f55e79e65e6e6e9))
* update dependencies and add TTS module ([3e49360](https://github.com/memori-ai/memori-react/commit/3e49360dc7c8f48a594063cb925d22f40cea0582))
* update dependencies and package versions in package.json and yarn.lock ([fcc0220](https://github.com/memori-ai/memori-react/commit/fcc0220e200ba6eb4bca44d97e069fe3f542e3c1))
* update dependencies in package.json and yarn.lock for improved stability and performance ([e6f3023](https://github.com/memori-ai/memori-react/commit/e6f30233eef242604d265159c595178b0cb0cc75))
* update deps ([bb3dbc6](https://github.com/memori-ai/memori-react/commit/bb3dbc63a41a5952b8daf6a30ca2a4d4241a937f))
* update deps following npm audit ([f7a109f](https://github.com/memori-ai/memori-react/commit/f7a109f7055c37d8b5190a3f5148e428c140625a))
* update deps following npm audit ([5f6c878](https://github.com/memori-ai/memori-react/commit/5f6c8787c8f986fbe4eff64dec766b31cad4dd5c))
* update dompurify to version 3.4.0 ([50f2f48](https://github.com/memori-ai/memori-react/commit/50f2f48f826b5be3f81e34718167ce73b3715b40))
* update error codes ([9368041](https://github.com/memori-ai/memori-react/commit/9368041e2fc3b684e16054c037cf37c3832057b3))
* update error codes ([b760518](https://github.com/memori-ai/memori-react/commit/b760518e64cfd472426cf3d718ec764d0b43739f))
* update error codes ([7995e5d](https://github.com/memori-ai/memori-react/commit/7995e5d0b782bafa8f85bffb83dfc2ee104783f5))
* update error codes and translations ([c065d68](https://github.com/memori-ai/memori-react/commit/c065d68d555061b087b2f2581df19b36d4077d30))
* update error codes and translations ([c408242](https://github.com/memori-ai/memori-react/commit/c408242957dca7bc498976b508166591454088e0))
* update error codes and translations, fix error translation ([bd8484d](https://github.com/memori-ai/memori-react/commit/bd8484d6125e2c20f87d33e9c6580dbafb5d28c7))
* update example ([3f20f67](https://github.com/memori-ai/memori-react/commit/3f20f678c6362e32db1b928a6e87edf7b808cfed))
* update female fullbody animation glb url ([afb11f7](https://github.com/memori-ai/memori-react/commit/afb11f71b3efce56e1439bbc523abaa335b4c624))
* update gitignore ([7305a24](https://github.com/memori-ai/memori-react/commit/7305a24c1ae5b35c8f377988f710a50747c2182b))
* update lockfile ([eed8d8b](https://github.com/memori-ai/memori-react/commit/eed8d8bbd621319be3f7a8eb54989e126ba21d85))
* update memori-api-client ([8472d3f](https://github.com/memori-ai/memori-react/commit/8472d3f862e6ba4a2a86f78cbaf8b9c35f5c7d37))
* update memori-api-client ([1b8771c](https://github.com/memori-ai/memori-react/commit/1b8771c2e94ef12c55d033287d1b7812c1b3b4ae))
* update memori-api-client ([ccc404f](https://github.com/memori-ai/memori-react/commit/ccc404f47c0411974a6dba3612f6520ad5695c80))
* update mocks ([13dd147](https://github.com/memori-ai/memori-react/commit/13dd147799a4462a7f97debdd3a5d507553243d1))
* update mocks and PDF export helper ([ef74575](https://github.com/memori-ai/memori-react/commit/ef7457578144ce680618682e33c404b2c4606daa))
* update proptypes ([0dbdfb2](https://github.com/memori-ai/memori-react/commit/0dbdfb268a8844c42014f73a17db1e4ab0db4f9c))
* update proptypes ([cb8e358](https://github.com/memori-ai/memori-react/commit/cb8e3586d4db87914b12bae11c838c4233c4d4b1))
* update stories and example tenants ([bae67a0](https://github.com/memori-ai/memori-react/commit/bae67a0c15ebf03113f9ea2806123ea6965c65a7))
* update storybook ([3e248a0](https://github.com/memori-ai/memori-react/commit/3e248a0e1aee20d8815cf1078a201f2302428921))
* update storybook layout prop ([1b096ab](https://github.com/memori-ai/memori-react/commit/1b096abf7c5b9394e7d5a928a70bee783019f32c))
* update Storybook stories with new avatar configurations and layouts ([749c57a](https://github.com/memori-ai/memori-react/commit/749c57a3cae69edadf032240a5d7b3fd36afe213))
* update Storybook stories with test scenarios for RPM avatar animations and layouts ([b61a063](https://github.com/memori-ai/memori-react/commit/b61a063f6607d1216fcd7e967e60149f888ba51f))
* update tsconfig ([f008b7d](https://github.com/memori-ai/memori-react/commit/f008b7d9be9b67596a5626515ec99bcf3e0cdc7c))
* update yarn.lock ([4e7e96e](https://github.com/memori-ai/memori-react/commit/4e7e96e26029439cf14f8ec40e7c1e9d823c7f62))
* upgrade api client ([d0a4c51](https://github.com/memori-ai/memori-react/commit/d0a4c51374b322faf5351ca5035efe784bd40f73))
* upgrade api client ([08533d6](https://github.com/memori-ai/memori-react/commit/08533d64d2aabd593467d114f1f34022fd247e9c))
* upgrade api client ([c65fb57](https://github.com/memori-ai/memori-react/commit/c65fb572af5b7c6de8e32657ab36be53e8b99812))
* upgrade api client ([f7f218b](https://github.com/memori-ai/memori-react/commit/f7f218bbda39ca27f3e670cbc5ffc7f9d297656f))
* upgrade api client lib ([8f11101](https://github.com/memori-ai/memori-react/commit/8f1110195b8975135e2b9da9e6a265cd7380569d))
* upgrade api client, refactor linter ([88d233b](https://github.com/memori-ai/memori-react/commit/88d233b1645e660163f8c8811427287cf0ba988e))
* upgrade api-client to v1.1.0 ([b2254e1](https://github.com/memori-ai/memori-react/commit/b2254e1723dc1dda3d5ebfdbb7c10d1828e0934b))
* upgrade cognitive-services-speech-sdk-js ([e1f9ed5](https://github.com/memori-ai/memori-react/commit/e1f9ed57c128791297c9215f780032104b7664a2))
* upgrade microsoft speech sdk ([02214d6](https://github.com/memori-ai/memori-react/commit/02214d652eeb270b8aa7817406bebf728b693c5c))
* upgrade storybook ([4cc9db3](https://github.com/memori-ai/memori-react/commit/4cc9db306ad48a42f0fa081fb487ae716c9c8ff9))
* upgrade to storybook@7 ([62342f2](https://github.com/memori-ai/memori-react/commit/62342f2eab4386cc0ca72eba5bebd2ab093a26eb))
* use antd 4x ([8b5e4d7](https://github.com/memori-ai/memori-react/commit/8b5e4d761ffe137d508330c0c35241b786fb08bc))
* widget storybook layout options + rename ([d48863f](https://github.com/memori-ai/memori-react/commit/d48863f28483ae2d84de7b689deadf0fac7d727f))
* wrap localstorage access in try/catch to prevent errors in storybook ([b676cac](https://github.com/memori-ai/memori-react/commit/b676cac1fc4dc4e84c577cef8bbf286bdd9c64ef))


### Changes

*  removed media handling inside the ChatBubble and kept it all inside Chat ([d916e53](https://github.com/memori-ai/memori-react/commit/d916e537a86ddd320e39bb0acf14a9b2582b15d2))
* adapt changes from new completions config ([ce5343a](https://github.com/memori-ai/memori-react/commit/ce5343a0f186239a20fb66e0c84844f2202fd2f2))
* adapt website assistant layout avatar css ([5236a55](https://github.com/memori-ai/memori-react/commit/5236a551b59dfa1803316b24d9de72d90009e567))
* adapt website assistant layout avatar css ([f8b824d](https://github.com/memori-ai/memori-react/commit/f8b824da89754d92c0576101b33f53dd90430f40))
* add 60s timeout if completions enabled ([97c770f](https://github.com/memori-ai/memori-react/commit/97c770f3b79b5b2af472c857c25929500847cfdc))
* add avatar pic in website-assistant blob ([19fea88](https://github.com/memori-ai/memori-react/commit/19fea88271382728fe28eeee041863e0d66a94f0))
* add avatar type classes + adapt website assistant layout avatar css ([730dd16](https://github.com/memori-ai/memori-react/commit/730dd16d73429ded46f09e683eae63c8b7c97682))
* add canInstruct in ChangeMode ([6300e18](https://github.com/memori-ai/memori-react/commit/6300e184bdb64ee57f9b3e8f7fd92df8b733f077))
* add current tag to message history + whyThisAnswer search ([29c3676](https://github.com/memori-ai/memori-react/commit/29c36766acc6df1ffb0e32373f2100d09b9901f1))
* add forced timeout from integration config ([8fdf5c1](https://github.com/memori-ai/memori-react/commit/8fdf5c1816e689754d5f3bb0e925a0f167393bdd))
* add helper description for position request ([f08c2a7](https://github.com/memori-ai/memori-react/commit/f08c2a7691bb9f25ac92f961e636d929432abefa))
* add LANG context var opening session ([cbcbb4e](https://github.com/memori-ai/memori-react/commit/cbcbb4e250fd615bed2cf53303c83f860bcbf33b))
* add loading state while submitting birth date ([8c082ee](https://github.com/memori-ai/memori-react/commit/8c082eee1bdda0163eaadb4c9056fdb84d81c74a))
* add loginToken in getMemoriState ([f12f67c](https://github.com/memori-ai/memori-react/commit/f12f67cf16ad8590d9636ccfd1d8346bd2a652d9))
* add memorytags in message history + why this answer ([1f7e074](https://github.com/memori-ai/memori-react/commit/1f7e07428a3b436f8ef6f4da7f464be072aaa5ec))
* add parameter to lexicon to check case (in)sensitive, fix separate word match ([0233cc6](https://github.com/memori-ai/memori-react/commit/0233cc61aab6b45ceb53b290f327bf4feabcb173))
* add reloading session after user has logged in ([968fdfa](https://github.com/memori-ai/memori-react/commit/968fdfa93229a6fb0aba61df427b9ff3b8d5a6b7))
* add selectors for MathJax elements in parsing ([f0e6724](https://github.com/memori-ai/memori-react/commit/f0e6724e7d042863b34708aa1c6b7bd855ce17e2))
* add settings content check and improve fullscreen handling in Header component ([b87f3f4](https://github.com/memori-ai/memori-react/commit/b87f3f4468b07ac0d26cef6217edb4c31b898c59))
* add show AI icon in integration config ([36575c9](https://github.com/memori-ai/memori-react/commit/36575c90f423e1bd38cb0e442fb307fb74ac1cc8))
* add specific css classes to header buttons ([c57f123](https://github.com/memori-ai/memori-react/commit/c57f123948c3b6de9cf1f40e4558aeae224682c2))
* add timezoneOffset in session opening ([4e4a4cb](https://github.com/memori-ai/memori-react/commit/4e4a4cb69e622edf6954c4b1617e4618bfcf1cc9))
* add video/quicktime to media widget ([d89ea9a](https://github.com/memori-ai/memori-react/commit/d89ea9a2f67db879894f98335cacfe8649093850))
* add waitForPrevious param to typeMessage ([6aae935](https://github.com/memori-ai/memori-react/commit/6aae935188abc388aee29dc1ef631819d73fbd0e))
* added comments to the chunk TTS implementation ([c539602](https://github.com/memori-ai/memori-react/commit/c53960235ffc4560ada59fb619b572d8c0653146))
* added new gui for animations control ([428cb6f](https://github.com/memori-ai/memori-react/commit/428cb6f898d42b3775be7f0c4da6681dd0d71a35))
* adjust chat component CSS for full height and improved layout ([3296d08](https://github.com/memori-ai/memori-react/commit/3296d084e1f7f07449ebe37831559d95239a1d45))
* adjust chat layout styles for improved responsiveness and height calculations ([1e71c3b](https://github.com/memori-ai/memori-react/commit/1e71c3bc0e8aab5e448d28c9f9e1887c3a25769b))
* adjust emotion amplification and remove debug logging in MorphTargetController ([4af0a70](https://github.com/memori-ai/memori-react/commit/4af0a70ba23bc4b4dfc204008ffb4c0bdee82692))
* adjust padding and layout for ChatHistoryDrawer ([ff0b6ef](https://github.com/memori-ai/memori-react/commit/ff0b6ef6b52aa0aaeec1044d5d3852e63e584d27))
* adjust uploaded document limits in chat components ([be74c2f](https://github.com/memori-ai/memori-react/commit/be74c2f2f4352378a58861a203278a19ecc2a230))
* adjust viseme preloading time and clean up audio handling in useTTS ([8bfd5fe](https://github.com/memori-ai/memori-react/commit/8bfd5fed4cee8dbad7ee68f3dbff43547de17430))
* allow markdown as text upload ([546ba42](https://github.com/memori-ai/memori-react/commit/546ba424b63ecf533f1ed136504a2b752b9ab278))
* allow rgb bg in media images ([6800a61](https://github.com/memori-ai/memori-react/commit/6800a611eb8b0a66518cf7b68337671ef5ff648a))
* apply sessionID prop ([0eb6880](https://github.com/memori-ai/memori-react/commit/0eb68808f05f1751d60e86f391e766bb1979e602))
* better parse markdown avoiding nested markdown code ([41910a3](https://github.com/memori-ai/memori-react/commit/41910a33f2527a913522ff6953b3139f4a8dec1b))
* boe loading indicator with initial delay, smaller font ([94929a4](https://github.com/memori-ai/memori-react/commit/94929a489138f1257b170e523a22465db966c7fa))
* change copy icon ([6d6fd26](https://github.com/memori-ai/memori-react/commit/6d6fd263a6150a4a6d0a5767aa31b140b0493a71))
* change defaults, use reload in header if totem ([74d1bd7](https://github.com/memori-ai/memori-react/commit/74d1bd72f934a601c388daa5420b851a16ef9785))
* change textarea disabled states ([0a64fd7](https://github.com/memori-ai/memori-react/commit/0a64fd7fd2723c7b4263fd42b88e676d2390074e))
* change theme font following new brand book ([31677bc](https://github.com/memori-ai/memori-react/commit/31677bc6eb9d026f1b563b47b418e771d86fb8e9))
* chat layout progressive max-width ([80c8ab8](https://github.com/memori-ai/memori-react/commit/80c8ab8fd237147311be81f68a467eae16fe4143))
* chat layout width ([2aa5d23](https://github.com/memori-ai/memori-react/commit/2aa5d23d79896a9651973f7db940b55e4dc0a782))
* chat layout with layout props ([eee4cf5](https://github.com/memori-ai/memori-react/commit/eee4cf5e893dd65e7b341516a0f2dcfb65519841))
* **chat:** render message media inside ChatBubble ([356ed22](https://github.com/memori-ai/memori-react/commit/356ed2280f79a0c1ccf71ed818d36d9969ffb85f))
* clean up and enhance styling for Chat and MicrophoneButton components ([6feb5d2](https://github.com/memori-ai/memori-react/commit/6feb5d224330e9fff15a11f6488333999d95e8e6))
* clean up audio handling ([bb08519](https://github.com/memori-ai/memori-react/commit/bb085199781331abb3b3a2c2aa9864b3cf0c8fe5))
* clean up audio references ([31a4cf5](https://github.com/memori-ai/memori-react/commit/31a4cf5437a4f05b7e1631e45568832515b44daf))
* clean up Header component code for better readability and maintainability ([3f79c44](https://github.com/memori-ai/memori-react/commit/3f79c446b028943af016903f3eb078513cd6fd24))
* clean up LoginDrawer by removing unused email help text ([ffb767e](https://github.com/memori-ai/memori-react/commit/ffb767e6a308a32a4f2adc93361beed9f6aa4886))
* clean up MemoriWidget and useTTS for improved audio handling and state management ([ad69071](https://github.com/memori-ai/memori-react/commit/ad690719c8c28d1401a0d5743e365b44bc03448f))
* cleanup ([77f2e2b](https://github.com/memori-ai/memori-react/commit/77f2e2be28577c81469c69cc24a9ed3e872fea31))
* cleanup ([a972fde](https://github.com/memori-ai/memori-react/commit/a972fdecca5d6a4b26563d4e1415b8ada796a857))
* cleanup ([2df3fbb](https://github.com/memori-ai/memori-react/commit/2df3fbbf80360e9662a51f264b74f14a633c7f8e))
* cleanup helpers ([2213be8](https://github.com/memori-ai/memori-react/commit/2213be892771a37ffc8f2c45f9c35d72da862dd6))
* cleanup typeMessage and typeMessageHidden ([0eff5fc](https://github.com/memori-ai/memori-react/commit/0eff5fc0b1033ff9c67e864bdcf8fed735a0a931))
* comment out chat log reference retrieval in ChatHistory component ([e3f68fa](https://github.com/memori-ai/memori-react/commit/e3f68fa91c2fa22e5f248f282a77739503407fd3))
* comment out document and image count display logic in UploadButton ([8a32702](https://github.com/memori-ai/memori-react/commit/8a32702fef240cb9e6daa36928650c1a21de8c7b))
* comment out unused CSS rules in chat layout for clarity ([69ad366](https://github.com/memori-ai/memori-react/commit/69ad3662e8d39fcb52c5860cb51b287f1710cb69))
* comment out unused CSS rules in fullpage layout for clarity ([63e55ea](https://github.com/memori-ai/memori-react/commit/63e55eab2dec526ed58d6f4e32a13763bb038d47))
* comment out unused scroll effect in Chat component ([dc3a6d6](https://github.com/memori-ai/memori-react/commit/dc3a6d64b81b89f48c4b3139d5f3fa499059b586))
* completion provider status from openai selecting only API component ([36f37f0](https://github.com/memori-ai/memori-react/commit/36f37f0111d765c5580e53f013b1ec7437a81e71))
* **components:** adapt to [@memori](https://github.com/memori).ai/ui 1.5.2 ([e7a24ea](https://github.com/memori-ai/memori-react/commit/e7a24ea3109bc77c742bebc5d79c047a1c3323e5))
* debug icon in chat bubble color, tests and stories ([54ba7d5](https://github.com/memori-ai/memori-react/commit/54ba7d5a4220a355a2c87688151c5631f2261730))
* defaults + fix styles ([f3852dd](https://github.com/memori-ai/memori-react/commit/f3852ddc8074c6368fbd20043d5b308b67d213f8))
* defaults for mobile totem dont show settings button ([619e773](https://github.com/memori-ai/memori-react/commit/619e773408608827f4649c68a23387dbe405eba2))
* defaults for mobile totem with controls on bottom + dont show send on enter menu ([a5a887c](https://github.com/memori-ai/memori-react/commit/a5a887cc1c092dbbcc1a87912df7f48435ca2351))
* disable outer scroll on website assistant layout ([939d46b](https://github.com/memori-ai/memori-react/commit/939d46be63565342e4826ec937ef0a5fdb2f560f))
* do not apply global styles for website assistant layout ([a7274db](https://github.com/memori-ai/memori-react/commit/a7274dbd20aee83a2731933be1c4d64c26d44848))
* dont send date event every minute, but when opening session and sending TextEntered ([25f083e](https://github.com/memori-ai/memori-react/commit/25f083efadb8d07b311e371739711eabcdffdc1b))
* dont show 3d avatar on mobile by default ([636dae4](https://github.com/memori-ai/memori-react/commit/636dae4356d5ccc4f1e28cd7abe78c0e221966ac))
* dont show hints while loading answer ([8a777c6](https://github.com/memori-ai/memori-react/commit/8a777c6a8274a00133adb9b24e757e6aa17f3966))
* dont store preference and remove selector for send on enter, different defaults for desktop and mobile ([e6af1ba](https://github.com/memori-ai/memori-react/commit/e6af1baf680cd77dc61a29148c70173e0661e3b9))
* enable markdown parsing for emissions, not user messages ([1e34242](https://github.com/memori-ai/memori-react/commit/1e342421eecf578f570591b1453d80305fa48d81))
* enhance artifact action icons with fullscreen styling ([0f53e8c](https://github.com/memori-ai/memori-react/commit/0f53e8c850ba75ffbd0ac959ecfe33a97c72515a))
* enhance artifact copy functionality ([b78acb3](https://github.com/memori-ai/memori-react/commit/b78acb3a664e5be7c5ebb76995599096beedec3f))
* enhance ArtifactActions and ArtifactDrawer and improved layout and responsiveness ([af3139c](https://github.com/memori-ai/memori-react/commit/af3139c45726c76af454056cf4773098bf6face9))
* enhance AvatarAnimator with advanced animation management ([3cda44c](https://github.com/memori-ai/memori-react/commit/3cda44c679390fd5fe71befc18af571358a81bcd))
* enhance AvatarAnimator with advanced emotion and sequence handling ([f1e8f63](https://github.com/memori-ai/memori-react/commit/f1e8f630c324cbf2e41583da15c10fdd14a795c0))
* enhance chat components with responsive design and textarea expansion handling ([b3186c8](https://github.com/memori-ai/memori-react/commit/b3186c8c22c8815535761c3c08e888a7b24f6912))
* enhance ChatHistoryDrawer with export functionality and new title handling ([5b1b5f4](https://github.com/memori-ai/memori-react/commit/5b1b5f4cd367afea75d1f14f320d9154d8fbaf7a))
* enhance CSS variables and styling for Artifact components ([cbf4087](https://github.com/memori-ai/memori-react/commit/cbf4087616b2a9b4d3d11dea741751f141d1d2c0))
* enhance date polling in MemoriWidget to respect tab visibility ([64e6a6f](https://github.com/memori-ai/memori-react/commit/64e6a6f531adc4bfe7f91d75b5f64e382fa5bf3e))
* enhance Drawer component with improved footer structure and content handling ([4b22245](https://github.com/memori-ai/memori-react/commit/4b22245c87c760c34c42a8696f21025102f47dbd))
* enhance markdown + mathjax parsing for links, strip markdown and syntax symbols for TTS ([e76c8ea](https://github.com/memori-ai/memori-react/commit/e76c8ea4fbe82c4b27146ff5efc7bcd80724379b))
* enhance MediaItemWidget and Snippet styles for improved layout and responsiveness ([7121bcc](https://github.com/memori-ai/memori-react/commit/7121bcc360169511b9986f823469da91ec072a4b))
* enhance MemoriWidget audio handling and state management for mute functionality ([457ed1a](https://github.com/memori-ai/memori-react/commit/457ed1a7754c64a2b3f753cd4562761010badbfd))
* enhance MorphTargetController with dynamic emotion processing ([2fd8c2e](https://github.com/memori-ai/memori-react/commit/2fd8c2e34acfed487ffe0c1bdcd14c8a50049d35))
* enhance Prism script loading and code highlighting in Snippet component ([8a87e4e](https://github.com/memori-ai/memori-react/commit/8a87e4e101090085c45ac9cbc85b6b2682c6d646))
* enhance Slider and PositionControls UI styling and responsiveness ([adc3ff7](https://github.com/memori-ai/memori-react/commit/adc3ff7a43098bd4e4efe1d4af7727dba048fb7c))
* enhance speech processing with robust message handling ([1a1370f](https://github.com/memori-ai/memori-react/commit/1a1370f2c600223aa6911b27e72dc5a389939b1b))
* enhance speech recognition and audio handling logic ([c616547](https://github.com/memori-ai/memori-react/commit/c616547c709e70d461fddb180bcbd08ae1446b6d))
* enhance useTTS with detailed logging for debugging ([1bc8b9f](https://github.com/memori-ai/memori-react/commit/1bc8b9ffa53ba6d59f206f0999bc9d8dc3c92dc4))
* enhance viseme handling in useTTS and visemeContext for improved audio processing ([f6141c4](https://github.com/memori-ai/memori-react/commit/f6141c446f61314dd182eba47be34bcc8e169d44))
* enhanced UI of Position Controls for totem layout ([99a2008](https://github.com/memori-ai/memori-react/commit/99a20082eac9b97603308b26ef0ed95490d97bbb))
* enhancements for website assistant layout ([b8de59b](https://github.com/memori-ai/memori-react/commit/b8de59b641040fca7cfbf78bdfc18863e00edebb))
* expand textarea more ([c1e09ce](https://github.com/memori-ai/memori-react/commit/c1e09ce439c9ce314e37102d727e5ccc201d53f1))
* expandable fix overflow + add stories ([9332bb5](https://github.com/memori-ai/memori-react/commit/9332bb592973292542a933fef9d9396073cd7385))
* fine tuned lip sync constant values ([2756914](https://github.com/memori-ai/memori-react/commit/2756914a023b6ccc90316698ccc2dbba8df7b4c1))
* fine-tune avatar lighting parameters for improved visual quality ([7642549](https://github.com/memori-ai/memori-react/commit/7642549ef44275b209b20a62f3ee6492a8452db2))
* fine-tune viseme timing parameters for smoother lip movements ([1797582](https://github.com/memori-ai/memori-react/commit/17975824f7627e7c64b0b94f977dc3411c537980))
* fix button danger, minor ui improvements ([e924b47](https://github.com/memori-ai/memori-react/commit/e924b47cb97f5bb9c8e22b6b79377c08a9e322bc))
* fix mathjax selector overlap on parenthesis, refactor mathjax config ([faf91e7](https://github.com/memori-ai/memori-react/commit/faf91e73d790a2c03c9493032b8570e12006605d))
* fix media item rgb color sizes ([1be970c](https://github.com/memori-ai/memori-react/commit/1be970cd6d267c1cdc29558b050f815bb918be0a))
* fix session chat log retrieval in ChatHistory component ([8a55462](https://github.com/memori-ai/memori-react/commit/8a554626755f6921e1c8c3b4c69d2f7b639cffb6))
* fixes for listening events ([76bc5f6](https://github.com/memori-ai/memori-react/commit/76bc5f616538d6621ff51b7ad41a9b07b8ad59ba))
* get the expired session chat logs and set it in the new session ([ce46369](https://github.com/memori-ai/memori-react/commit/ce46369b1c3a0c9a179ce5ceae24aefb42faf75e))
* handle credit check with deep thought enabled + update error codes ([69f4bab](https://github.com/memori-ai/memori-react/commit/69f4bab687b6ac207b68cbaa4ee692e8293f1e8d))
* handle full body avatar animation and morph target in separated classes ([f8c20d1](https://github.com/memori-ai/memori-react/commit/f8c20d15ff67c6b7c6857f893c1ec14dd88660c9))
* hide emissions as separate checkbox not control positions value ([943f06a](https://github.com/memori-ai/memori-react/commit/943f06adddf2495b69b9713a1f898552a076f5c4))
* hide output tags in chat, strip them for TTS ([02e2e42](https://github.com/memori-ai/memori-react/commit/02e2e423226ec9643c83b371c78e3e468e044737))
* i18n and styles import ([c3ee4b3](https://github.com/memori-ai/memori-react/commit/c3ee4b333d66ef9c46acb3bb541dae02f6edff0e))
* implement centralized audio playback logic in MemoriWidget ([a31463b](https://github.com/memori-ai/memori-react/commit/a31463b928517c13a74184925ed7433d97ada5dc))
* implement document attachment tag stripping in Snippet ([852edd2](https://github.com/memori-ai/memori-react/commit/852edd2078d1be6e88f245a95485b27518d4c4b9))
* improve ChatTextArea CSS for better responsiveness and styling ([ec70a5e](https://github.com/memori-ai/memori-react/commit/ec70a5e09a2a2a214ec4c53a5f8517675e700e01))
* improve code readability and formatting in MemoriWidget component ([0fee720](https://github.com/memori-ai/memori-react/commit/0fee720b5e79ccea2e745dc97f4c756d25317b45))
* improve ConfirmDialog and Drawer components with enhanced z-index management and state handling ([4b6554f](https://github.com/memori-ai/memori-react/commit/4b6554f58a3adca7d4aef68c4e544a4063d4570a))
* improve emotion mapping and processing in MorphTargetController ([4a49461](https://github.com/memori-ai/memori-react/commit/4a49461985217f382d355883f9d52f7d15f7414d))
* improve file selection handling and document upload logic in UploadButton ([71117bc](https://github.com/memori-ai/memori-react/commit/71117bc0926779c103a57d9574ee69ccc6b914a8))
* improve incident status checking logic in CompletionProviderStatus ([730c68f](https://github.com/memori-ai/memori-react/commit/730c68f58b33eff1536ffcdc3f5f3bd3714faf26))
* improve markdown rendering and math formatting in ChatBubble ([df93671](https://github.com/memori-ai/memori-react/commit/df93671a953309db0b100c4ccbbf2752b1be5a64))
* improve media handling in ChatInputs component ([71944c5](https://github.com/memori-ai/memori-react/commit/71944c56cc4dac218adcb64a55946aa675bdd01c))
* improve responsiveness and styling of ArtifactActions ([9a960dc](https://github.com/memori-ai/memori-react/commit/9a960dc25ce1273b798a70090af200b714affa94))
* improve speech recognition ([c6d1a1c](https://github.com/memori-ai/memori-react/commit/c6d1a1ca39e42e8c6636aeb4d00772946a8463e6))
* improve speech recognition error handling and processing logic ([a33f7d8](https://github.com/memori-ai/memori-react/commit/a33f7d843d91fcef23edefb8265dcde81ee0ea5d))
* improve text-to-speech chunking and playback logic ([f06dd91](https://github.com/memori-ai/memori-react/commit/f06dd917b157bc8032b197f051c1c7647273e507))
* improve title calculation logic in ChatHistory component with significance scoring ([89a5c55](https://github.com/memori-ai/memori-react/commit/89a5c553663f566bd975a38fefb895fafc9602b4))
* improve UploadButton component structure and error handling ([d51e1fe](https://github.com/memori-ai/memori-react/commit/d51e1fe158a6b68029f9101b9f2e4ecc729a7b2d))
* improve UploadButton functionality for multiple file uploads ([b9f4d80](https://github.com/memori-ai/memori-react/commit/b9f4d8029b6930214cab03984983c65c8df94d7e))
* improve viseme queue management and clean up audio handling in useTTS ([c07b14e](https://github.com/memori-ai/memori-react/commit/c07b14ecc1fab4fc72be77a609d08b5d4929395c))
* improve XML formatting and readability in UploadButton component ([1842018](https://github.com/memori-ai/memori-react/commit/18420185387dce24f928918c5c3f6eed2d45ad16))
* increase position controls height in CSS ([b2fae15](https://github.com/memori-ai/memori-react/commit/b2fae15fe49c0edbe4c24e2cb6716b363f69744e))
* initial muteSpeaker value with autoStart + birth date fallbacks ([4a8e3a6](https://github.com/memori-ai/memori-react/commit/4a8e3a624e6d11a7ce8c7a51a20c7a4d3fe88108))
* install mathjax only if useMathFormatting is enabled ([8648ed0](https://github.com/memori-ai/memori-react/commit/8648ed00627801b8904bc77bd41fc15448756bf1))
* integrate new STT hook for improved speech recognition functionality ([515aa5f](https://github.com/memori-ai/memori-react/commit/515aa5fad382ccbf00da3c06deb401b51a74fee0))
* introduce context for improved artifact management ([42da76e](https://github.com/memori-ai/memori-react/commit/42da76e4d9ca57040efd31646d6b5669c52cb988))
* introduce PositionPopover component with styles and stories for enhanced functionality ([fe88857](https://github.com/memori-ai/memori-react/commit/fe888571611cea6ffdbbe340a1bbe086aae5a7c6))
* make message and state handling resilient on translations failures ([919e126](https://github.com/memori-ai/memori-react/commit/919e1268d22a16fc1270c54db4a38db5e87cffbb))
* media items grid smaller size ([349547e](https://github.com/memori-ai/memori-react/commit/349547ebf083d863c5f4aff72240e1b05a6fe1a9))
* media items grid smaller size ([d60b752](https://github.com/memori-ai/memori-react/commit/d60b7527b087da74fa0af2c7559059f91dec953d))
* memoize container components, move snippet exec to main running once on state change ([869f058](https://github.com/memori-ai/memori-react/commit/869f0588d266b5be92e06a25829b63c2314290b8))
* mic button larger on any layout ([baff50e](https://github.com/memori-ai/memori-react/commit/baff50edfb3cca372907052d3520a478af6378a1))
* minor css fixes, backdrop blur + padding ([a0138dc](https://github.com/memori-ai/memori-react/commit/a0138dc0a2a34e46fe81974c06334e3f9b52f69e))
* mobile chat text content size ([5146d85](https://github.com/memori-ai/memori-react/commit/5146d85445d43513b518445a087b8c713bcb1691))
* mobile msg text smaller ([7618026](https://github.com/memori-ai/memori-react/commit/7618026f18e6da2286dd1d06df0f20142356b400))
* move artifact detection logic to ArtifactHandler and simplify Chat component ([596e9a1](https://github.com/memori-ai/memori-react/commit/596e9a11d6f741a5993d1d39c2e4eb968173487b))
* move everything as layout prop ([1c42027](https://github.com/memori-ai/memori-react/commit/1c42027083ba772b533c9d8035e599327fa19e6f))
* move widget ui to default layout ([4eacf30](https://github.com/memori-ai/memori-react/commit/4eacf3000c4dc4525ac170426bfec403dd092984))
* moved AnimationController to controllers directory ([bef5e76](https://github.com/memori-ai/memori-react/commit/bef5e76aa8e503802ccf19b72d1277a145c0255a))
* new prop to apply css properties to :root ([055a189](https://github.com/memori-ai/memori-react/commit/055a189e8091e422477a0a16d21a95dfed074fd5))
* new scroll logic by last user msg ([bc469d3](https://github.com/memori-ai/memori-react/commit/bc469d30b3f00065e5d75d465c4984a8727bab7a))
* open session on clicking start button ([6372e89](https://github.com/memori-ai/memori-react/commit/6372e89aba6a74743b7bec9fa4d6dab597dd9ddb))
* optimize artifact detection and rendering in ArtifactHandler component ([aa92733](https://github.com/memori-ai/memori-react/commit/aa92733f9a8f62ead33a03552c1a9560ed0b0f43))
* optimize audio handling in useTTS for Android compatibility and adjust viseme preloading time ([40caf7a](https://github.com/memori-ai/memori-react/commit/40caf7a8ec70f015c0754d84a8b09a8e05227eee))
* optimize AvatarAnimator with advanced transition and sequence handling ([1f67479](https://github.com/memori-ai/memori-react/commit/1f674795dcb85f5a14d419426f324ac2f70e615d))
* optimize Drawer stories and translations for confirmation dialog ([26b303c](https://github.com/memori-ai/memori-react/commit/26b303cb5fff849839131bbec97a61d521a82271))
* optimize scroll behavior in Chat component to prevent unnecessary re-scrolling ([b285c79](https://github.com/memori-ai/memori-react/commit/b285c79eb6150c1155d898e6d105bb3a1633ff78))
* optimize settings content check and enhance Header component structure ([320b16e](https://github.com/memori-ai/memori-react/commit/320b16e3d0c6af531d48c17c48c8b3ec3d881655))
* optimize speech recognition and audio handling ([653d503](https://github.com/memori-ai/memori-react/commit/653d503b28ece5bbfac8bda6f0167d2eeb5cdc73))
* organize CSS layers for theme and integration overrides ([f89785d](https://github.com/memori-ai/memori-react/commit/f89785dd71c1a7fd44833284ee6f5b81b6c64cc3))
* organize CSS layers for theme and integration overrides ([3b31619](https://github.com/memori-ai/memori-react/commit/3b31619381018cfb3056b6ab4bd89ce85555be84))
* parse questions in why this answers ([98eda36](https://github.com/memori-ai/memori-react/commit/98eda365c7c342ad5b3a7d570e43dde97c7d99d9))
* pass apiURL through for asset helper ([0dd9a69](https://github.com/memori-ai/memori-react/commit/0dd9a69c6ff29229e19f9d9723773fb61f5c8b62))
* pick completion flag for generated by ai icon ([4ae8658](https://github.com/memori-ai/memori-react/commit/4ae8658056955232314143c012bc2929342e3511))
* position drawer + start icons, styles, formatting and overflow in header ([db5993d](https://github.com/memori-ai/memori-react/commit/db5993db77c771d156cc7f78d7dd7af75acfb44d))
* prisma as external dep from cdn ([f93abb8](https://github.com/memori-ai/memori-react/commit/f93abb8f2ea6786373e7089908b046fd980f2bfc))
* provide any way to pass login token to session ([c7adf7c](https://github.com/memori-ai/memori-react/commit/c7adf7c6e832ac95ae7808a2f6b532204bc5c80d))
* re-add polish voices, fix additionalInfo lang codes ([3151f3d](https://github.com/memori-ai/memori-react/commit/3151f3de5879fa30142c475c6220ac0192c1225e))
* refactored directories RPM 3D Avatar ([1a1b9fa](https://github.com/memori-ai/memori-react/commit/1a1b9faf1018e9ce2e8ab7c67227fdfb05236b0d))
* relies on uiLang for both interface and chat language ([ef6ac43](https://github.com/memori-ai/memori-react/commit/ef6ac437151dbbfc16a5edcce671275b8f1ef038))
* remove antd and related packages ([d8d85c6](https://github.com/memori-ai/memori-react/commit/d8d85c69269469abcd2d825ea5361cb897be1d05))
* remove antd and related, momentjs + cleanup to make pkg lighter ([4ab5093](https://github.com/memori-ai/memori-react/commit/4ab5093855543f2eca2799f1c355071be68050fe))
* remove AttachmentLinkModal and LinkItemWidget components ([4058548](https://github.com/memori-ai/memori-react/commit/405854859a8aa6e6e7ea46adc27c5b3ac1c684ec))
* remove completions-enabled tooltip from StartPanel and related snapshots ([032f984](https://github.com/memori-ai/memori-react/commit/032f98499ae2850a9fb48fc81b3ab08000d78066))
* remove ConfirmDialog from Drawer component ([95a1036](https://github.com/memori-ai/memori-react/commit/95a10368ede07a57d36c18ed7dc8c22f960021e4))
* remove console logs across various components for cleaner code ([df21f71](https://github.com/memori-ai/memori-react/commit/df21f718e87ab1527b7f985f1af9e0cec76deda1))
* remove console logs and simplify Drawer component logic ([39f8a78](https://github.com/memori-ai/memori-react/commit/39f8a78678481e166b35f9d82979b7e2f97a0d49))
* remove ConvertAPI token and fetch token dynamically in UploadButton component ([568da4f](https://github.com/memori-ai/memori-react/commit/568da4fcfbd58f1e1fb8ddcf567f1de3275efefc))
* remove css imports, add single style.css file with imports ([1887357](https://github.com/memori-ai/memori-react/commit/188735746081ca58cc0c0790f1d44df9804ca7a8))
* remove disablePastedText prop ([9e11114](https://github.com/memori-ai/memori-react/commit/9e111140051ae70f8298f91e634d84602a08461a))
* remove disablePastedText prop ([177881b](https://github.com/memori-ai/memori-react/commit/177881bc13fc9901f7126bf4b4aee40cb1081334))
* remove existing images from document preview files in UploadDocuments component ([e7ce3fc](https://github.com/memori-ai/memori-react/commit/e7ce3fcc9ede323d6d7eb2febfffedc211594b8a))
* remove expert description from drawer ([fc3181d](https://github.com/memori-ai/memori-react/commit/fc3181de6173b1a13cf0fb3bb76a1202e499ea48))
* remove feedback button ([a50c5d4](https://github.com/memori-ai/memori-react/commit/a50c5d442a69078ae87db355663d14186a40f762))
* remove gamification ([64c3f7e](https://github.com/memori-ai/memori-react/commit/64c3f7eed4b56c7cc4eaa3a550b62497ce4efe2f))
* remove interaction timeout logic from MemoriWidget for cleaner state management ([31d477b](https://github.com/memori-ai/memori-react/commit/31d477bbd934db288333952c2c0c2a2c46ba5f08))
* remove logs for useSTT hook ([cc1b132](https://github.com/memori-ai/memori-react/commit/cc1b132fd999aa61cc406169d75a6d1ee5d051bb))
* remove old scroll method ([aadc51d](https://github.com/memori-ai/memori-react/commit/aadc51de83cc86cd4073d1a3da6435aae4c7dffc))
* remove OTP-related functionality from LoginDrawer ([880f51d](https://github.com/memori-ai/memori-react/commit/880f51d1f989821c263738709625dd58daf719c3))
* remove SignupForm component and its associated tests and snapshots ([3e1229d](https://github.com/memori-ai/memori-react/commit/3e1229d7af96ecc9fa72b38a5a13842336b7bd3a))
* remove splitted code from widget, refactor start method, widget params ([1eebbe3](https://github.com/memori-ai/memori-react/commit/1eebbe319cff0e1630b61ded38b1ed8cf93ae09c))
* remove translations api ([8e4fc3a](https://github.com/memori-ai/memori-react/commit/8e4fc3a16abd37a586c02429b4ace5b71f1dba52))
* remove unnecessary concatenation in truncateMessage function ([7e1aacf](https://github.com/memori-ai/memori-react/commit/7e1aacf4956f0aa2959635af52a5c238edbf14da))
* remove unnecessary console log for unmatched animations in AvatarAnimator ([ecbea22](https://github.com/memori-ai/memori-react/commit/ecbea22a74aaacfa4de254ad166624c6cf06948d))
* remove unnecessary console logs ([49f9fb2](https://github.com/memori-ai/memori-react/commit/49f9fb2f515a3c970d1b6245dafd2a7358e93cea))
* remove unnecessary transitions and clean up CSS for Artifact components ([de9677a](https://github.com/memori-ai/memori-react/commit/de9677a20aef223d6cdc4a469f0d80b0fde5a9ff))
* remove unused artifact regex and related code in ArtifactHandler for improved clarity ([ef59c01](https://github.com/memori-ai/memori-react/commit/ef59c016157c7be2be59bdd018c5504184f44611))
* remove unused CSS import ([f54fc76](https://github.com/memori-ai/memori-react/commit/f54fc7611ccfa42333a07501a675963869d0876c))
* remove unused CSS import ([d8823f5](https://github.com/memori-ai/memori-react/commit/d8823f511885428fde73326254b556adbd453b3c))
* remove unused CSS rules and animations from ArtifactDrawer for cleaner styling ([25ee0f3](https://github.com/memori-ai/memori-react/commit/25ee0f3ec0ca009efc1b0601e93ff0dbb8ffb769))
* remove unused props from DefaultLayout story ([2d3586c](https://github.com/memori-ai/memori-react/commit/2d3586c4f64532ccf550eb06d834201e7d4f3ff5))
* remove unused speech SDK imports ([8121cdc](https://github.com/memori-ai/memori-react/commit/8121cdc68b12fc743567e032751f0adb2c5cc5bc))
* remove unused tooltip content from snapshots ([51ea7ab](https://github.com/memori-ai/memori-react/commit/51ea7abb5d270f185e965681d99fdbb7ed6bb22a))
* remove UploadMenu component and associated styles, tests, and stories ([a6ab2de](https://github.com/memori-ai/memori-react/commit/a6ab2debe9fcef65d926de10778a7f9b30e4857f))
* removed Export Chat Button form the Header component ([7ccd463](https://github.com/memori-ai/memori-react/commit/7ccd463ddebd0f3e9edb6104f8cf5bb35ce68e3e))
* removed initChat function from HiddenChatLayout ([c52c492](https://github.com/memori-ai/memori-react/commit/c52c492cbd7eb017f83f1d9abcf71530478443d8))
* removed logs and set max idle count ([12d06b7](https://github.com/memori-ai/memori-react/commit/12d06b7f154387cfe405545f0db8ba3ade5fd966))
* removed unused .scss file for ChatHistory component and improved UX ([cc1910b](https://github.com/memori-ai/memori-react/commit/cc1910b4a09872d86fe410383192c726946c28f3))
* removed unused or dangerous mathjax selectors ([0faf89f](https://github.com/memori-ai/memori-react/commit/0faf89f8d0a058a852ecfa2363e89908ea7e6473))
* removed UploadButton file upload shortcut ([41b32ec](https://github.com/memori-ai/memori-react/commit/41b32ec0720c2652bba8ac8a7e6c131c9c3e7014))
* rename AnimationSequenceTest to MoodChefAssistant and simplify args ([438dc8c](https://github.com/memori-ai/memori-react/commit/438dc8c5ba52a827068323bc4c338434cdd12dfe))
* replace additionalInfo email + userID with loginToken ([b323f04](https://github.com/memori-ai/memori-react/commit/b323f04503b7fc583103b89243fb37389aed4062))
* replace ArtifactSystemProvider with ArtifactProvider for improved context management ([6c79d50](https://github.com/memori-ai/memori-react/commit/6c79d5006e07d23b61433f62103a11f6b057f45d))
* replace Dropdown with Popover in Header component ([d52c9f8](https://github.com/memori-ai/memori-react/commit/d52c9f8b2d2fdb10d63ba3e0982b12abb84a1f43))
* replace hasTouchscreen with isMobileOrTablet ([7a995d2](https://github.com/memori-ai/memori-react/commit/7a995d267225ef3393447820917d0a1fee9015ea))
* replace hasTouchscreen with isMobileOrTablet ([6652160](https://github.com/memori-ai/memori-react/commit/6652160d7c99b873fe05a222d22b9e4fd8775374))
* replace icon imports with lucide-react ([5807c45](https://github.com/memori-ai/memori-react/commit/5807c45d102313d986208a021086982958667d09))
* replace react-hot-toast with custom alert manager ([941914a](https://github.com/memori-ai/memori-react/commit/941914a86ad6fe3b90b546b79ad2a3f0542b1d8b))
* replace setShowPositionDrawer with setVenue and introduce PositionPopover in Header ([45e7a74](https://github.com/memori-ai/memori-react/commit/45e7a742c9e9aded549da229ec56cef078baff52))
* replace speechKey state with provider state and update related API handling ([4fbdf5d](https://github.com/memori-ai/memori-react/commit/4fbdf5d146b958a3b34aa44a06f4ec3a171bfb5e))
* replaced AvatarPositionController and MorphTargetController directory position ([12fd311](https://github.com/memori-ai/memori-react/commit/12fd311444c09f55a60f948db09829c1a06139b5))
* replaced constants and morp target controller to the parent directory for better organization ([c1097ce](https://github.com/memori-ai/memori-react/commit/c1097ce00b90a6acae021a7cb3b32bdd577766d5))
* replaced error handling state for useTTS and useSTT with console error ([9db04c8](https://github.com/memori-ai/memori-react/commit/9db04c8b4c1b1b8b73cf6f9498a1016681f3a2fd))
* replaced old blenshapes name with updated ones ([3fffd62](https://github.com/memori-ai/memori-react/commit/3fffd62fe184057ad29031a75662681ad8946831))
* replaced old TTS logic useTTS hook and improve speech handling logic ([0b620d1](https://github.com/memori-ai/memori-react/commit/0b620d1b8356cab73f9bd8d05086ff0949692c60))
* restructure ChatBubble component layout and enhance media handling ([2a1b088](https://github.com/memori-ai/memori-react/commit/2a1b0888e0ec9f40180d3231bea86a6b59b1cd61))
* rgb media items without link ([656517b](https://github.com/memori-ai/memori-react/commit/656517bdb23b3461371281c2074e0c2b8de01b04))
* send initial question with previous session with empty history ([1a6ff68](https://github.com/memori-ai/memori-react/commit/1a6ff6838c19a2099da4bfe224150718d794fd6f))
* separate HTML links from media items in Chat component ([f4cb53f](https://github.com/memori-ai/memori-react/commit/f4cb53f336e52aca32fdfe38eb25702949838057))
* share button enforce normal font weight ([37c645c](https://github.com/memori-ai/memori-react/commit/37c645cae864c9f585339333de581969a5c570ad))
* show ai disclaimer under chat inputs ([5699c6d](https://github.com/memori-ai/memori-react/commit/5699c6d3d103e1b76e7c96f642013181474f50bb))
* show ai disclaimer under chat inputs ([399f9da](https://github.com/memori-ai/memori-react/commit/399f9dae9a6aae39b96d08c72c10d4c39a99e510))
* show feedback buttons + ai icon on chat bubble floating addon ([3dbd011](https://github.com/memori-ai/memori-react/commit/3dbd0113c0af844822812ab06e3f9a611193b1b3))
* show login default if deep thought enabled ([0580201](https://github.com/memori-ai/memori-react/commit/0580201194088b8bfa39ef07fb7de3651964c310))
* show media upload if dialogState givers acceptMedia ([01701d1](https://github.com/memori-ai/memori-react/commit/01701d1298ff99b5305c8c66e04359df1918b18b))
* show multiple function cache results if present ([f00c104](https://github.com/memori-ai/memori-react/commit/f00c104030066a97b139511fdd758f30a3102fc8))
* show reasoning output based on config or prop ([1a0b683](https://github.com/memori-ai/memori-react/commit/1a0b683e5f6e312744488904dbdbedf6e8f0e4b4))
* show settings hide emissions without conditions ([40d87bf](https://github.com/memori-ai/memori-react/commit/40d87bfe5783e54cc8140723bbdb265f19beb788))
* show typing while sending initial question with previous session ([6186353](https://github.com/memori-ai/memori-react/commit/618635369271f0fb7be46024bde064367c0a71bf))
* show why this answer from integration config, defaults to true ([41e7369](https://github.com/memori-ai/memori-react/commit/41e7369eab695ea110860c9d72472af30a16b665))
* simplify AvatarView component and remove unused animation-related props ([d84dbc0](https://github.com/memori-ai/memori-react/commit/d84dbc0e3c19a19c2bbcbfbab3d647998c658e34))
* simplify ChatBubble and ChatHistoryDrawer components by removing unnecessary styles ([777acb7](https://github.com/memori-ai/memori-react/commit/777acb7679f5ee09aa6fe0919e596aa09499c91b))
* simplify DateSelector component by replacing Listbox with native date input ([2520a44](https://github.com/memori-ai/memori-react/commit/2520a446166a1f1c862392d7780ebe8c48ec5670))
* simplify document processing by removing truncation logic from file extraction ([207e83c](https://github.com/memori-ai/memori-react/commit/207e83c59b71b5b25b88a6283c23ea5178d7a67b))
* simplify document processing by removing truncation logic from file extraction ([a1ca256](https://github.com/memori-ai/memori-react/commit/a1ca256c828ad6144cb34d5ad82c75552113aa8f))
* simplify DynamicShadow component with AvatarAnimator integration ([71c0991](https://github.com/memori-ai/memori-react/commit/71c09917b11baa96a252ff75882be3785f266f30))
* simplify handleSpeak function and improve TTS integration ([a85f128](https://github.com/memori-ai/memori-react/commit/a85f128985ff72776b3fff0dd0a208bb747bb5b5))
* simplify incident status checking logic in CompletionProviderStatus component ([44a70d9](https://github.com/memori-ai/memori-react/commit/44a70d9cdd9bc56d6db120b8882d79628dbb1102))
* simplify MediaItemWidget by removing unused state and optimizing image source handling ([87f931c](https://github.com/memori-ai/memori-react/commit/87f931c4f303bbeb72093d00caf61a8d5328ed77))
* simplify Memori component usage in layout stories ([c9e77c3](https://github.com/memori-ai/memori-react/commit/c9e77c3d007d2ca6a9b4f981be5aa34ec6c86bdb))
* simplify resumeSession parameters in ChatHistoryDrawer ([4e6de0a](https://github.com/memori-ai/memori-react/commit/4e6de0a65caf2b984af9ab7494a82d5512ffd2be))
* simplify translation namespace in Drawer confirmation dialog ([981df76](https://github.com/memori-ai/memori-react/commit/981df769ff6f32311c9f4af386e3bb568f4cd706))
* simplify useSTT hook by removing continious speech ([43af26b](https://github.com/memori-ai/memori-react/commit/43af26b40059f49ea4ac69e9415cc42c80351d89))
* speak function and viseme handling ([237f20d](https://github.com/memori-ai/memori-react/commit/237f20de397427370a98356613c74bb276063530))
* split engine and backend endpoints ([6bcb56d](https://github.com/memori-ai/memori-react/commit/6bcb56df8b059c8bb3a9cfe3c4a14691f541aa1d))
* start button test speakers on try catch ([9337764](https://github.com/memori-ai/memori-react/commit/93377648937e0e21b19b8ac50d87062955d7c899))
* start panel deep thought disclaimer selector + login button padding ([c6e7e5c](https://github.com/memori-ai/memori-react/commit/c6e7e5cefa66f3fb2172d4c1e7cde3c488726ec2))
* start panel stories args ([b0cd83c](https://github.com/memori-ai/memori-react/commit/b0cd83ce0e275bc52016bdeb552a001ba27e0bc3))
* stop audio closing webassistant panel ([5943302](https://github.com/memori-ai/memori-react/commit/594330238a583b7b37dfd3f16e1311b7bef0fd8a))
* streamline artifact handling and enhance API integration in MemoriWidget ([1c7dc48](https://github.com/memori-ai/memori-react/commit/1c7dc4874b082e20ce33821543c099ecf0ea9871))
* streamline ChatHistoryDrawer and ChatInputs, enhance styling in hidden-chat layout ([ab860ff](https://github.com/memori-ai/memori-react/commit/ab860ff5d3cccaa57e6636af55867ceb01bae38c))
* streamline CSS styles for ChatHistoryDrawer ([fba9d1e](https://github.com/memori-ai/memori-react/commit/fba9d1e2bc0c9ee2b00a78c9876a3ba3151e8db6))
* streamline default prop handling in MemoriWidget for better integration configuration ([f50e0d0](https://github.com/memori-ai/memori-react/commit/f50e0d080ec6a98157b169c079cb54d1b0fd0c6d))
* streamline error handling ([c052a81](https://github.com/memori-ai/memori-react/commit/c052a81765b362f0b2d29b03206f9639a8c23d20))
* streamline error handling ([a35b82b](https://github.com/memori-ai/memori-react/commit/a35b82bc4aa92036bb67bd7cbc453aa05f7d1965))
* streamline fullscreen handling for MemoriWidget and improve portal management ([2edb6df](https://github.com/memori-ai/memori-react/commit/2edb6df9adae125cadd2b1327bc702ba0403ca48))
* streamline HalfBodyAvatar component with simplified morph target and chat handling ([8d68795](https://github.com/memori-ai/memori-react/commit/8d687959c52056a4e01f3aa74e025a7567424405))
* streamline image source handling in stories and snapshots for consistency ([71d1108](https://github.com/memori-ai/memori-react/commit/71d1108b214f93c9f3b06e42e9950839d83eabde))
* streamline localization keys for artifact actions and improve css animations ([46ac364](https://github.com/memori-ai/memori-react/commit/46ac364cb6237cb627804e71ee89bf6becd5ddcb))
* strip html in msg parsing for TTS, fix plaintext to copy ([4d95f39](https://github.com/memori-ai/memori-react/commit/4d95f392e6f86bf7d512dc7ce1be0ce44b5402a1))
* switch to luxon instead of moment ([3f7da0c](https://github.com/memori-ai/memori-react/commit/3f7da0c5f1e37db435f89fde88517236a1946edd))
* table compact styles ([56556db](https://github.com/memori-ai/memori-react/commit/56556dbccbee2a626adbe9de55f3245ffa86b1c7))
* tenant types from backend, remove customizations from dashboard ([9aa6deb](https://github.com/memori-ai/memori-react/commit/9aa6deb8d9b46124154a516c49435ecce9cd90a5))
* tenantID as fallback for baseURL ([2276529](https://github.com/memori-ai/memori-react/commit/2276529e1dc9a5f6a9d842eb8805e344b752fda0))
* translate api as post ([04a963c](https://github.com/memori-ai/memori-react/commit/04a963c4bab72d613bbee4a0d7af01715ec1b0e0))
* truncate user messages ([a181614](https://github.com/memori-ai/memori-react/commit/a1816140c550a47c2c5dcc8476545aed5a2118b7))
* typing as separate component, add text anim ([02e027e](https://github.com/memori-ai/memori-react/commit/02e027ec7f19c3d08afe3ba2c119e25fc3742e70))
* ui enhancements for website assistant layout ([585920e](https://github.com/memori-ai/memori-react/commit/585920e7dea4baac51e28d9020e274137c3229a8))
* **ui:** improve layout consistency and add popover presentation to MobileSessionPanel ([a9f00e7](https://github.com/memori-ai/memori-react/commit/a9f00e7f869fb3054d6d2b9a1fa54a8707182716))
* unify chat and media components with consistent scroll item class ([20e6203](https://github.com/memori-ai/memori-react/commit/20e6203c2bc3981314bdc4841969551a3fd093d8))
* update  PositionPopover with new Popover component ([522ba47](https://github.com/memori-ai/memori-react/commit/522ba47f9642a484f6f09272b4df095a48cb76d7))
* update ArtifactActions and ArtifactDrawer for optional action handlers ([424807c](https://github.com/memori-ai/memori-react/commit/424807c07c9ef5a863ff73922036dc216b2beba6))
* update ArtifactDrawer and ArtifactPreview for improved layout and functionality ([e20a1a1](https://github.com/memori-ai/memori-react/commit/e20a1a1e88c2dddc7e61fc61bef8da57b9cbbcad))
* update ArtifactDrawer styles and enhance title extraction logic in ArtifactHandler ([8d6c503](https://github.com/memori-ai/memori-react/commit/8d6c5031e44c15d3ba1e98ccf2bc5a8736ce1ce5))
* update ArtifactHandler to use local state for currentArtifact ([8273c7d](https://github.com/memori-ai/memori-react/commit/8273c7dfb1ba2fcac039c68454b27eac0870f05e))
* update AvatarComponent for improved animation handling ([72e6b5c](https://github.com/memori-ai/memori-react/commit/72e6b5c40b66ea664e9d34d646fb4a6ffc415569))
* update button classes in ArtifactActions for improved styling and functionality ([8c557f5](https://github.com/memori-ai/memori-react/commit/8c557f51bbf18658d09e0dc1a57b171eebbb0e2a))
* update chat layout styles and improve component responsiveness ([51c3596](https://github.com/memori-ai/memori-react/commit/51c3596403eedfe842abd0fadd713420a1264f28))
* update ChatBubble component to remove reasoning details and adjust message rendering ([2bb8800](https://github.com/memori-ai/memori-react/commit/2bb8800eda2745171702b0337bb2f9cc446f6e5a))
* update ChatHistoryDrawer to include minimum messages filter ([7f93ee2](https://github.com/memori-ai/memori-react/commit/7f93ee22b5585bc3cfc43398ef9cdeda26d0541a))
* update ChatInputs snapshots and enhance MicrophoneButton functionality with touch event handling ([5625773](https://github.com/memori-ai/memori-react/commit/562577304809eba8ce2b0cc6962771a4f3b26e3e))
* update comments for RPM and GLB emotion handling in AvatarComponent ([533bd93](https://github.com/memori-ai/memori-react/commit/533bd937ac4aaf25f912c28713d0ed6a7f8ea221))
* update component logic and structure ([7271495](https://github.com/memori-ai/memori-react/commit/727149588feb47b0424bd44ff19a2e456dc00e99))
* update CSS styles for ChatInputs, ContentPreviewModal, FilePreview, MediaItemWidget, and MemoriWidget components ([a7207b5](https://github.com/memori-ai/memori-react/commit/a7207b5f4f9f647fbc2eff5e96371127bc78386a))
* update CSS styles for MemoriWidget and ArtifactActions components, adjusting background colors ([37ea36a](https://github.com/memori-ai/memori-react/commit/37ea36a3dc2b90c3243cdaa26a60a98fb7581dc5))
* update document upload limits to allow larger payloads ([115f52c](https://github.com/memori-ai/memori-react/commit/115f52cc583093e6013155a15c12522d331d4b20))
* update Header by replacing Info icon with MoreVertical, remove unused settings popover state ([0e4c684](https://github.com/memori-ai/memori-react/commit/0e4c68480479e14a77a918be0ee1d8891c3a5572))
* update import paths for avatar components ([1ee58c9](https://github.com/memori-ai/memori-react/commit/1ee58c944ebdd6dcc33d7a630327862ff6d7152e))
* update layout stories to use new Memori component structure and streamline props handling ([dcd098e](https://github.com/memori-ai/memori-react/commit/dcd098ec420d5bc54bd8b0fd5b0931948a6c5de4))
* update LoginDrawer styles and initial OTP form visibility ([b23629a](https://github.com/memori-ai/memori-react/commit/b23629a6e71ce2af292d6b356d9e7bce1eee24cf))
* update LoginDrawer to handle OTP login ([b2b5d9d](https://github.com/memori-ai/memori-react/commit/b2b5d9dd27e69efc31a3aadfcbd35137fbf1d335))
* update marked ([08bd938](https://github.com/memori-ai/memori-react/commit/08bd938d23bc214ddd0c8c12cc22f6099dcc7b23))
* update MediaItemWidget CSS to increase minimum column width for better layout ([2df373d](https://github.com/memori-ai/memori-react/commit/2df373dab4bea6e1b4c4ce032e214026bf1a5331))
* update MediaItemWidget styles for improved layout and responsiveness ([9f3520d](https://github.com/memori-ai/memori-react/commit/9f3520dd13dd8b3d0f49a7b015a9f4407e3ce884))
* update MemoriWidget to use pwl methods for user authentication and logout ([a27a302](https://github.com/memori-ai/memori-react/commit/a27a30232287e4c1c6c832d406e51879efe92725))
* update popular language codes and improve language grouping logic ([d8a2374](https://github.com/memori-ai/memori-react/commit/d8a23740aa7d93f5daa1e5536543ef4b3fadae3d))
* update snapshot tests to include consistent scroll item class ([e54257a](https://github.com/memori-ai/memori-react/commit/e54257a354a8e4564725124288c55e7eeaea6da7))
* update snapshots for layout components ([efa70f4](https://github.com/memori-ai/memori-react/commit/efa70f44d84905b164a344d18ba37a748cad797a))
* update speech key API to retrieve provider based on tenant ([84c2b97](https://github.com/memori-ai/memori-react/commit/84c2b97e89c1313096e7dcf6af11021179dc3829))
* update storybook layouts and remove unused story exports for improved organization ([deec85d](https://github.com/memori-ai/memori-react/commit/deec85d45e7917416288783ff70ee1936bf10715))
* update Test story with new parameters and localization settings ([96714b0](https://github.com/memori-ai/memori-react/commit/96714b0684fcea57c73a48d965b5afbbf9f949d7))
* update UploadButton component to support document and image uploads ([2809dfc](https://github.com/memori-ai/memori-react/commit/2809dfc7200dc50ecfd9d8946d5048e8f29261f5))
* upload accpets json ([49a76fa](https://github.com/memori-ai/memori-react/commit/49a76faa19cc85c5b2b828bfb65f7cb2f2d81687))
* upload button accepts pdf, txt and json ([36d8c65](https://github.com/memori-ai/memori-react/commit/36d8c65d9a7ace9399527b93cc36089c28a709d8))
* **UploadButton:** remove convertapiToken prop and streamline token fetching logic ([1bbc761](https://github.com/memori-ai/memori-react/commit/1bbc76134dbe52449b8c49f8cfb51040e711c64f))
* use adminEmail to request access if signup disabled ([22f7e47](https://github.com/memori-ai/memori-react/commit/22f7e47effc43295e97083f8f61cfb58fa1d4ed0))
* use i18next with local provider as lib ([d7a192c](https://github.com/memori-ai/memori-react/commit/d7a192cb6ed04d0a901748b812e8099821fc0712))
* use new aisuru color as default primary ([57066cf](https://github.com/memori-ai/memori-react/commit/57066cf4421e51270699b0fda30145d710c94dfe))
* use new ui select for lang selector in start panel ([5f3feef](https://github.com/memori-ai/memori-react/commit/5f3feefb1fa49ff2c3f3bbc924969f0f3ddc5eec))
* use useLayoutEffect for MathJax rendering ([e75676d](https://github.com/memori-ai/memori-react/commit/e75676d2a73f1524ec5d2dd04f7ab91cb6e8d0b5))
* webassistant layout chat bubbles opacity on hover ([03c7bb4](https://github.com/memori-ai/memori-react/commit/03c7bb4126a444853d949c40bd32ccd65dbb0ff5))
* website assistant layout show only 2 messages as totem ([efdb8a8](https://github.com/memori-ai/memori-react/commit/efdb8a831023a21cf39896aead7b8d59faa2bc71))
* why this answer i18n, ui and styles ([18292dc](https://github.com/memori-ai/memori-react/commit/18292dce56d9609ae56525a50f44503c762abeda))
* why this answer links + multiline source with expand ([10ff06d](https://github.com/memori-ai/memori-react/commit/10ff06de610aafec725965106902133cae0e45f2))

## [8.38.5](https://github.com/memori-ai/memori-react/compare/v8.38.4...v8.38.5) (2026-05-20)


### Bug Fixes

* increase tooltip close delay and enable pointer events for content ([22f596b](https://github.com/memori-ai/memori-react/commit/22f596b308c0263331b93faf0b3b5b7c11af52b0))


### Changes

* improve file selection handling and document upload logic in UploadButton ([71117bc](https://github.com/memori-ai/memori-react/commit/71117bc0926779c103a57d9574ee69ccc6b914a8))

## [8.38.4](https://github.com/memori-ai/memori-react/compare/v8.38.3...v8.38.4) (2026-05-12)


### Features

* add skeleton loading indicators and upload state management for file previews ([00cea0e](https://github.com/memori-ai/memori-react/commit/00cea0e4542528bbf308e9923b824f610cde51ae))


### Bug Fixes

* prevent sending messages while uploading files ([eff0a43](https://github.com/memori-ai/memori-react/commit/eff0a43ae0dc88413c3a4bd5522a4daa44832ea4))
* update active file count during document validation and processing ([97b3ae9](https://github.com/memori-ai/memori-react/commit/97b3ae9815c2059438dcb0b73f939c9157371a88))

## [8.38.3](https://github.com/memori-ai/memori-react/compare/v8.38.2...v8.38.3) (2026-05-11)


### Changes

* simplify document processing by removing truncation logic from file extraction ([a1ca256](https://github.com/memori-ai/memori-react/commit/a1ca256c828ad6144cb34d5ad82c75552113aa8f))

## [8.38.2](https://github.com/memori-ai/memori-react/compare/v8.38.1...v8.38.2) (2026-05-11)


### Features

* enhance message sanitization across components by implementing stripAllInternalTags function ([dff89cb](https://github.com/memori-ai/memori-react/commit/dff89cbe32a6cba521fee55ea99ebb43aa989b62))

## [8.38.1](https://github.com/memori-ai/memori-react/compare/v8.38.0...v8.38.1) (2026-05-11)

## [8.38.0](https://github.com/memori-ai/memori-react/compare/v8.37.0...v8.38.0) (2026-05-11)


### Features

* **ui:** implement text sanitization for ChatBubble and WhyThisAnswer components ([2cae536](https://github.com/memori-ai/memori-react/commit/2cae536da331fd528d383733b83405c664907b22))


### Changes

* show ai disclaimer under chat inputs ([399f9da](https://github.com/memori-ai/memori-react/commit/399f9dae9a6aae39b96d08c72c10d4c39a99e510))

## [8.37.0](https://github.com/memori-ai/memori-react/compare/v8.36.0...v8.37.0) (2026-05-08)


### Features

* implement partial asset upload handling and add corresponding translations ([a11c513](https://github.com/memori-ai/memori-react/commit/a11c513f8cc95ae84c441c5214c417d72f1c350e))

## [8.36.0](https://github.com/memori-ai/memori-react/compare/v8.35.2...v8.36.0) (2026-05-08)


### Features

* add anonymous retention notice to file preview and update translations ([d22e353](https://github.com/memori-ai/memori-react/commit/d22e353ceeb50bdf5d29a5fc51fe06d2a9645e61))
* enhance file upload and preview functionality with attachment handling ([85b37e4](https://github.com/memori-ai/memori-react/commit/85b37e4b55c37a8fd31ebeacc3483dab22d349c5))

## [8.35.2](https://github.com/memori-ai/memori-react/compare/v8.35.1...v8.35.2) (2026-05-05)


### Bug Fixes

* start button blocked conditions ([4ab53c6](https://github.com/memori-ai/memori-react/commit/4ab53c6539a8ad09262179c486273b748a9c7dbb))

## [8.35.1](https://github.com/memori-ai/memori-react/compare/v8.35.0...v8.35.1) (2026-04-29)


### Bug Fixes

* update login button visibility logic in MemoriWidget component ([f80da5c](https://github.com/memori-ai/memori-react/commit/f80da5ca22075ad299d54c4808f94c709e850369))

## [8.35.0](https://github.com/memori-ai/memori-react/compare/v8.34.0...v8.35.0) (2026-04-28)


### Features

* implement enhanced artifact detection and processing in ArtifactHandler component ([00d0b36](https://github.com/memori-ai/memori-react/commit/00d0b36803a5a8584de4397301a08e12c1413f82))


### Maintenance

* enhance artifact handling in Chat component with new test cases ([d64f5cb](https://github.com/memori-ai/memori-react/commit/d64f5cb2f65b30a0ce81cf1564cb67053e59f94f))
* update [@memori](https://github.com/memori).ai/memori-api-client to version 6.22.0 ([a425cec](https://github.com/memori-ai/memori-react/commit/a425cec379a9086ea12b1407f718c7de3a01d46f))

## [8.34.0](https://github.com/memori-ai/memori-react/compare/v8.33.0...v8.34.0) (2026-04-20)


### Features

* add support for custom trigger node in ChatConsumptionDropdown component ([0563208](https://github.com/memori-ai/memori-react/commit/0563208cc661e130f322429545e9df84a58ee581))

## [8.33.0](https://github.com/memori-ai/memori-react/compare/v8.32.0...v8.33.0) (2026-04-17)


### Features

* add tooltip styling and improve MicrophoneButton component functionality ([719b2b1](https://github.com/memori-ai/memori-react/commit/719b2b181e61c6eb0cc122222c6d9806995b969f))
* enhance Header component with detailed chat consumption metrics and improved styling ([75d2809](https://github.com/memori-ai/memori-react/commit/75d2809e996d9c5af1ac147bc8acf01c54b3db8f))


### Maintenance

* update dompurify to version 3.4.0 ([50f2f48](https://github.com/memori-ai/memori-react/commit/50f2f48f826b5be3f81e34718167ce73b3715b40))

## [8.32.0](https://github.com/memori-ai/memori-react/compare/v8.31.0...v8.32.0) (2026-04-07)


### Features

* add GasStation icon and update Header component for sustainability button ([434c61a](https://github.com/memori-ai/memori-react/commit/434c61a02eeb493261fe44d343b337a8727b83d1))
* update Header component to use localized strings for total chat consumption ([6173c7e](https://github.com/memori-ai/memori-react/commit/6173c7e880aeed5947fa74f0abfa0854231f8e99))

## [8.31.0](https://github.com/memori-ai/memori-react/compare/v8.30.1...v8.31.0) (2026-04-07)


### Features

* added total consumptin  as new popover button in the Header ([5d70a17](https://github.com/memori-ai/memori-react/commit/5d70a17f936f689de035ada54645a6d5dd02209e))
* implement custom markdown rendering in ArtifactDrawer ([4677132](https://github.com/memori-ai/memori-react/commit/46771327d99302e5a02aa3fb4f2a8bc208a27919))

## [8.30.1](https://github.com/memori-ai/memori-react/compare/v8.30.0...v8.30.1) (2026-04-02)


### Maintenance

* update deps following npm audit ([5f6c878](https://github.com/memori-ai/memori-react/commit/5f6c8787c8f986fbe4eff64dec766b31cad4dd5c))

## [8.30.0](https://github.com/memori-ai/memori-react/compare/v8.29.1...v8.30.0) (2026-03-27)


### Features

* add message consumption feature with UI updates and localization support ([293c58f](https://github.com/memori-ai/memori-react/commit/293c58fcc9d57391679c1959dd22d1cc456528ea))


### Bug Fixes

* disable message consumption display in Memori component and update hover styles in Chat.css ([4bd10ce](https://github.com/memori-ai/memori-react/commit/4bd10cea051a35be1d48803b145ef30fe30fbe1f))


### Changes

* adjust uploaded document limits in chat components ([be74c2f](https://github.com/memori-ai/memori-react/commit/be74c2f2f4352378a58861a203278a19ecc2a230))

## [8.29.1](https://github.com/memori-ai/memori-react/compare/v8.29.0...v8.29.1) (2026-03-27)


### Bug Fixes

* prevent xss in user messages ([ada915f](https://github.com/memori-ai/memori-react/commit/ada915f015651bd28a1490c65cb7b13c36081823))
* update tooltip content classes for consistent styling across components ([b5121e4](https://github.com/memori-ai/memori-react/commit/b5121e433a77ac8cd3f251da966b02eb027d8ca9))


### Changes

* remove unused tooltip content from snapshots ([51ea7ab](https://github.com/memori-ai/memori-react/commit/51ea7abb5d270f185e965681d99fdbb7ed6bb22a))

## [8.29.0](https://github.com/memori-ai/memori-react/compare/v8.28.0...v8.29.0) (2026-03-17)


### Features

* add avatar3dHidden prop to MemoriWidget ([359e88f](https://github.com/memori-ai/memori-react/commit/359e88fe48502b44b24ee9af03b6dad94198ac99))

## [8.28.0](https://github.com/memori-ai/memori-react/compare/v8.27.0...v8.28.0) (2026-03-17)


### Features

* implement spaced layout for header buttons in MemoriWidget ([f4604f0](https://github.com/memori-ai/memori-react/commit/f4604f0a3042fe6d62d651f44d969eaa04663d7c))

## [8.27.0](https://github.com/memori-ai/memori-react/compare/v8.26.0...v8.27.0) (2026-03-16)


### Features

* enhance MemoriWidget to support optional place data ([a486fda](https://github.com/memori-ai/memori-react/commit/a486fdab893da30020d317ace6d1981b637e115c))
* remove 'postPlaceChangedEvent' and send position through 'postTextEnteredEvent' ([7c63f45](https://github.com/memori-ai/memori-react/commit/7c63f45156766a3552d12855a242172b36d0cbf5))


### Maintenance

* update [@memori](https://github.com/memori).ai/memori-api-client ([760dcf7](https://github.com/memori-ai/memori-react/commit/760dcf722658ede6418332e45dfd66a55216dc88))

## [8.26.0](https://github.com/memori-ai/memori-react/compare/v8.25.0...v8.26.0) (2026-03-16)


### Features

* add drawerClassName prop to LoginDrawer and PositionDrawer ([8ec2646](https://github.com/memori-ai/memori-react/commit/8ec26467f82f90573dfc713b9001575fa6917930))
* update MemoriWidget to conditionally send dateUTC ([81f5c50](https://github.com/memori-ai/memori-react/commit/81f5c504022b8c186b5369921bc42b40b672349d))

## [8.25.0](https://github.com/memori-ai/memori-react/compare/v8.24.0...v8.25.0) (2026-03-16)


### Features

* update layout styles and button margins for WebsiteAssistant ([73bdf4d](https://github.com/memori-ai/memori-react/commit/73bdf4ddf08edfe8994c8631c100684073e8a578))

## [8.24.0](https://github.com/memori-ai/memori-react/compare/v8.23.0...v8.24.0) (2026-03-16)


### Features

* implement logic for avatar3dHidden prop in MemoriWidget ([609ed74](https://github.com/memori-ai/memori-react/commit/609ed74978c1197159754fcf9357431a96e38b57))

## [8.23.0](https://github.com/memori-ai/memori-react/compare/v8.22.0...v8.23.0) (2026-03-16)


### Features

* add avatar3dHidden prop to WebsiteAssistant layout ([8803b75](https://github.com/memori-ai/memori-react/commit/8803b751df3f34aff37af500a650b29ccb012218))


### Changes

* dont send date event every minute, but when opening session and sending TextEntered ([25f083e](https://github.com/memori-ai/memori-react/commit/25f083efadb8d07b311e371739711eabcdffdc1b))

## [8.22.0](https://github.com/memori-ai/memori-react/compare/v8.21.0...v8.22.0) (2026-03-02)


### Features

* add uiLang and spokenLang props to MemoriWidget ([f066cd6](https://github.com/memori-ai/memori-react/commit/f066cd6a930bbcd6201801c8d96e20c5be454646))

## [8.21.0](https://github.com/memori-ai/memori-react/compare/v8.20.0...v8.21.0) (2026-02-27)


### Features

* update PII detection rules to support localized labels ([1629c74](https://github.com/memori-ai/memori-react/commit/1629c7406d559a1b7e478270fba3aec08e5418ef))


### Bug Fixes

* restored old uiLang prop behavior ([c08f0ed](https://github.com/memori-ai/memori-react/commit/c08f0ed13e5c27314d2edb45198f110fb5529234))


### Changes

* relies on uiLang for both interface and chat language ([ef6ac43](https://github.com/memori-ai/memori-react/commit/ef6ac437151dbbfc16a5edcce671275b8f1ef038))

## [8.20.0](https://github.com/memori-ai/memori-react/compare/v8.19.3...v8.20.0) (2026-02-25)


### Features

* enhance PII detection with tests ([3edd59e](https://github.com/memori-ai/memori-react/commit/3edd59e93ed796a1562c2595c1e770904f32e187))
* implement PII detection configuration ([02be73c](https://github.com/memori-ai/memori-react/commit/02be73cc1f62247a331143c1cad60009dc7c24d4))


### Bug Fixes

* update file type display logic in FilePreview ([b7f2935](https://github.com/memori-ai/memori-react/commit/b7f293503bae947fa4a0e9d1e3c00848509b1a85))

## [8.19.3](https://github.com/memori-ai/memori-react/compare/v8.19.2...v8.19.3) (2026-02-20)


### Bug Fixes

* reference error on MAX_DOCUMENTS_PER_MESSAGE ([8f32d13](https://github.com/memori-ai/memori-react/commit/8f32d1391c9541bf36f59d7a40f497d597ad2287))

## [8.19.2](https://github.com/memori-ai/memori-react/compare/v8.19.1...v8.19.2) (2026-02-19)


### Changes

* remove disablePastedText prop ([177881b](https://github.com/memori-ai/memori-react/commit/177881bc13fc9901f7126bf4b4aee40cb1081334))

## [8.19.1](https://github.com/memori-ai/memori-react/compare/v8.19.0...v8.19.1) (2026-02-18)


### Features

* update paste handling to allow inline pastes ([8bc1f53](https://github.com/memori-ai/memori-react/commit/8bc1f53655062ad2b5a95f2680fac68f10fbebb1))

## [8.19.0](https://github.com/memori-ai/memori-react/compare/v8.18.2...v8.19.0) (2026-02-18)


### Features

* add disablePastedText prop to control pasted text ([b694915](https://github.com/memori-ai/memori-react/commit/b694915f8d4d2dd24d36183f36de749842ffeb78))
* add maxTextareaCharacters prop to limit chat input ([dbb4778](https://github.com/memori-ai/memori-react/commit/dbb47786e8cc9030040fdce42c6a10733225755c))

## [8.18.2](https://github.com/memori-ai/memori-react/compare/v8.18.1...v8.18.2) (2026-02-18)


### Changes

* streamline error handling ([a35b82b](https://github.com/memori-ai/memori-react/commit/a35b82bc4aa92036bb67bd7cbc453aa05f7d1965))

## [8.18.1](https://github.com/memori-ai/memori-react/compare/v8.18.0...v8.18.1) (2026-02-17)


### Changes

* remove unused CSS import ([d8823f5](https://github.com/memori-ai/memori-react/commit/d8823f511885428fde73326254b556adbd453b3c))

## [8.18.0](https://github.com/memori-ai/memori-react/compare/v8.17.3...v8.18.0) (2026-02-17)


### Features

* enhance paste handling with boundary checks ([1950778](https://github.com/memori-ai/memori-react/commit/19507788e15f0ebb8ea94ed884421a0ebda6ffe7))
* implement paste handling for text input ([36836f6](https://github.com/memori-ai/memori-react/commit/36836f652dc6af54f943b842667175ad95368c45))
* improve file preview interactions ([cd4bbb4](https://github.com/memori-ai/memori-react/commit/cd4bbb44722d2c1858e16e339b1e384505ddfdbf))
* localize pasted text label ([df8d637](https://github.com/memori-ai/memori-react/commit/df8d63768d1e10743dbb87ca301b0df737b39a31))
* **upload:** enhance error handling and user feedback ([7f71b30](https://github.com/memori-ai/memori-react/commit/7f71b303b7bc4df00a1a6a5a785d8536b44ce071))
* **upload:** smart upload — partial upload when over file or payload limits ([b70767e](https://github.com/memori-ai/memori-react/commit/b70767e98cb0cb30a4be0503d887267cbd210277))


### Bug Fixes

* update ChatBubble to conditionally truncate messages ([4930971](https://github.com/memori-ai/memori-react/commit/4930971a9c8253643f10837a32c24c5d1d3c2b69))
* update snapshot ([8c763aa](https://github.com/memori-ai/memori-react/commit/8c763aaac1a4fdb30adad24f96682ab7cc4ff3f0))

## [8.17.3](https://github.com/memori-ai/memori-react/compare/v8.17.2...v8.17.3) (2026-02-12)


### Bug Fixes

* ensure audio playback respects defaultEnableAudio ([a0c9ffb](https://github.com/memori-ai/memori-react/commit/a0c9ffb3ef9dde733355cd0f12461b470e92b575))


### Changes

* replace hasTouchscreen with isMobileOrTablet ([6652160](https://github.com/memori-ai/memori-react/commit/6652160d7c99b873fe05a222d22b9e4fd8775374))

## [8.17.2](https://github.com/memori-ai/memori-react/compare/v8.17.1...v8.17.2) (2026-02-01)

## [8.17.1](https://github.com/memori-ai/memori-react/compare/v8.17.0...v8.17.1) (2026-01-31)

## [8.17.0](https://github.com/memori-ai/memori-react/compare/v8.16.1...v8.17.0) (2026-01-31)


### Features

* add Website Assistant overlay on Memori website with improved z-index ([7cfb9e5](https://github.com/memori-ai/memori-react/commit/7cfb9e5071bb0279ceeaa99732eaabf2502215c6))

## [8.16.1](https://github.com/memori-ai/memori-react/compare/v8.16.0...v8.16.1) (2026-01-30)

## [8.16.0](https://github.com/memori-ai/memori-react/compare/v8.15.1...v8.16.0) (2026-01-30)


### Features

* add pulse integration ([07ebd60](https://github.com/memori-ai/memori-react/commit/07ebd601cee1ddb36330ba3f88e21cfcdb3ef17e))
* add support for additional programming languages in Snippet ([39e0906](https://github.com/memori-ai/memori-react/commit/39e0906365c6ee80bd53ae50d44a7a02a21e1ac6))
* enhance MediaItemWidget interaction and styling for image links ([67c3d27](https://github.com/memori-ai/memori-react/commit/67c3d279e7cbc662b4b42338da69aa7eb935f8aa))
* enhance MediaItemWidget with improved media handling ([e2d5032](https://github.com/memori-ai/memori-react/commit/e2d503210bfc5384ed7e39ccf7d22ac406eaee6d))
* enhance MediaItemWidget with improved media handling and preview capabilities ([a7011e4](https://github.com/memori-ai/memori-react/commit/a7011e4cd59c7f808c491a1fcae526d5a7e973a5))
* enhance snippet preview capabilities ([de3624f](https://github.com/memori-ai/memori-react/commit/de3624fa7610a07a1c89a2ebaaf0c67a8cca072f))
* improve media handling and user interaction in MediaWidget ([64f5a23](https://github.com/memori-ai/memori-react/commit/64f5a23f0036351d3cb0375ac354664407dee5f1))
* standardizing image source resolution ([cd57bf2](https://github.com/memori-ai/memori-react/commit/cd57bf2b16837358eb6eb4342ce966d6fe6cd357))


### Bug Fixes

* skip pulse for sb on gh pages ([b8496dd](https://github.com/memori-ai/memori-react/commit/b8496dd98b4aa810706afcaede9d17eab6a1f930))
* update version script to resolve package path dynamically ([4930253](https://github.com/memori-ai/memori-react/commit/4930253ff50c23b5daa7065b576929f715bffc4e))


### Changes

* remove AttachmentLinkModal and LinkItemWidget components ([4058548](https://github.com/memori-ai/memori-react/commit/405854859a8aa6e6e7ea46adc27c5b3ac1c684ec))
* remove completions-enabled tooltip from StartPanel and related snapshots ([032f984](https://github.com/memori-ai/memori-react/commit/032f98499ae2850a9fb48fc81b3ab08000d78066))

## [8.15.1](https://github.com/memori-ai/memori-react/compare/v8.15.0...v8.15.1) (2026-01-27)


### Bug Fixes

* website assistant layout not compatible with autostart ([7753f57](https://github.com/memori-ai/memori-react/commit/7753f57ea2480d25c551b15cfbe0008162e188fb))

## [8.15.0](https://github.com/memori-ai/memori-react/compare/v8.14.2...v8.15.0) (2026-01-23)


### Features

* allow Alt/Option+Enter to insert a newline ([7f20e8b](https://github.com/memori-ai/memori-react/commit/7f20e8b6199591a8d9bf66fc8506bb9779d14899))


### Bug Fixes

* change language formatting in MemoriWidget to lowercase ([28903d2](https://github.com/memori-ai/memori-react/commit/28903d2980747dced6669b09dd505c4bea0f2f9d))

## [8.14.2](https://github.com/memori-ai/memori-react/compare/v8.14.1...v8.14.2) (2026-01-23)


### Changes

* remove translations api ([8e4fc3a](https://github.com/memori-ai/memori-react/commit/8e4fc3a16abd37a586c02429b4ace5b71f1dba52))

## [8.14.1](https://github.com/memori-ai/memori-react/compare/v8.14.0...v8.14.1) (2026-01-19)


### Bug Fixes

* improve line counting in MediaItemWidget to support multiple newline conventions ([ebde6ba](https://github.com/memori-ai/memori-react/commit/ebde6bad2776f177192208d687c4b86d9d76b404))


### Changes

* optimize scroll behavior in Chat component to prevent unnecessary re-scrolling ([b285c79](https://github.com/memori-ai/memori-react/commit/b285c79eb6150c1155d898e6d105bb3a1633ff78))
* separate HTML links from media items in Chat component ([f4cb53f](https://github.com/memori-ai/memori-react/commit/f4cb53f336e52aca32fdfe38eb25702949838057))

## [8.14.0](https://github.com/memori-ai/memori-react/compare/v8.14.0-rc.0...v8.14.0) (2026-01-13)


### Features

* enhance ChatHistoryDrawer with date display and layout adjustments ([5d6acb1](https://github.com/memori-ai/memori-react/commit/5d6acb174519d91cf1188fc768f38f88e4d3ae65))
* refactor ShareButton for HTML-based export ([1a8bb55](https://github.com/memori-ai/memori-react/commit/1a8bb55fec9e6d7a36da486ec26f7160c484977d))

* fix: duplicate uploaded image when copy/paste from local files (dab3c3f8)
* refactor: remove expert description from drawer (fc3181de)
* fix: enableAudio prop in MemoriWidget (501d48ec)
* Merge pull request #89 from memori-ai/feat_export_chat_pdf (11814474)
* feat: add PDF export functionality for chat history with localization support (3e84e62f)
* refactor: update ChatHistoryDrawer to include minimum messages filter (7f93ee22)
* style: add closable actions to Drawer title and refine Select options layout (cee42155)
* style: refine layout and spacing in ChatHistoryDrawer (0c5f4d18)
* style: improve ChatHistoryDrawer layout and responsiveness (993a13da)
* style: enhance mobile responsiveness of ChatHistoryDrawer (995e9e2b)
* style: update chat artifact layout by adjusting flex properties and removing padding (c8f1be56)

## [8.13.5](https://github.com/memori-ai/memori-react/compare/v8.13.4...v8.13.5) (2025-12-24)


### Bug Fixes

* adjust image compression quality and add HEIC handling ([0b64fc2](https://github.com/memori-ai/memori-react/commit/0b64fc2c748a87f67cdddcd0586c93a2f5dd2b69))
* enable drag and drop functionality in Chat component based on showUpload state ([346da51](https://github.com/memori-ai/memori-react/commit/346da514896df335d39ee7f3e9fc50c9fab0b8ab))
* on mobile, allow Enter to create a new line instead of sending ([86be6be](https://github.com/memori-ai/memori-react/commit/86be6be7ad507884300a29d37daadb1e2bc1b0d6))

## [8.13.4](https://github.com/memori-ai/memori-react/compare/v8.13.3...v8.13.4) (2025-12-22)

## [8.13.3](https://github.com/memori-ai/memori-react/compare/v8.13.2...v8.13.3) (2025-12-22)

## [8.13.2](https://github.com/memori-ai/memori-react/compare/v8.13.0...v8.13.2) (2025-12-22)


### Bug Fixes

* change avatar parameter type from Blob to File in updateAvatar function ([1911c15](https://github.com/memori-ai/memori-react/commit/1911c15dce2b0513e8003b6e029f7f3f4780e240))
* change avatar parameter type from File to any in updateAvatar function ([e2b2f9b](https://github.com/memori-ai/memori-react/commit/e2b2f9b312fd335f3e1db011a3326f33cbbb0949))

## [8.13.0](https://github.com/memori-ai/memori-react/compare/v8.12.0...v8.13.0) (2025-12-19)


### Features

* add error message handling in ChatBubble for system errors ([380f83d](https://github.com/memori-ai/memori-react/commit/380f83d0521e67e4b67c6eb6d16671a70c087104))
* add image compression functionality to UploadImages ([f9497be](https://github.com/memori-ai/memori-react/commit/f9497be057181240fcb858a236ac0e746833a4c7))
* enhance UploadButton component with unified media upload limits ([cc9c564](https://github.com/memori-ai/memori-react/commit/cc9c56468afdfc62b3b944790273fda24b62f469))
* implement drag-and-drop file upload functionality in Chat component ([e7b3a21](https://github.com/memori-ai/memori-react/commit/e7b3a212bbeadc3ecb40a4dbeda39faf9cd22463))


### Bug Fixes

* reset padding bottom of chat content in ChatTextArea on collapse ([d1b969b](https://github.com/memori-ai/memori-react/commit/d1b969bebc309ac28a125ebf49bd297edbfef75b))
* update UploadButton title for improved clarity in file upload functionality ([24978ef](https://github.com/memori-ai/memori-react/commit/24978ef10ed0d5c34f63ab9d81140d74d89b26cd))


### Changes

* comment out unused scroll effect in Chat component ([dc3a6d6](https://github.com/memori-ai/memori-react/commit/dc3a6d64b81b89f48c4b3139d5f3fa499059b586))
* improve UploadButton functionality for multiple file uploads ([b9f4d80](https://github.com/memori-ai/memori-react/commit/b9f4d8029b6930214cab03984983c65c8df94d7e))
* remove UploadMenu component and associated styles, tests, and stories ([a6ab2de](https://github.com/memori-ai/memori-react/commit/a6ab2debe9fcef65d926de10778a7f9b30e4857f))
* removed UploadButton file upload shortcut ([41b32ec](https://github.com/memori-ai/memori-react/commit/41b32ec0720c2652bba8ac8a7e6c131c9c3e7014))

## [8.12.0](https://github.com/memori-ai/memori-react/compare/v8.11.0...v8.12.0) (2025-12-01)


### Features

* add document and image class to upload menu items ([78c8afa](https://github.com/memori-ai/memori-react/commit/78c8afa5f4b6e9289dbcb0a5b98b06b9eb9a7c78))
* add enter and leave animation for Artifact Drawer in mobile layout ([42531e0](https://github.com/memori-ai/memori-react/commit/42531e0c0b77976e44181ff32221d2790e107fe6))
* add input length and value validation for day, month, and year ([7d443c2](https://github.com/memori-ai/memori-react/commit/7d443c23f0c9b9877d845a27bc4a4fc6303064d7))
* add isTyping prop to Chat and ChatInputs components to avoid multiple user messages ([b2a1a59](https://github.com/memori-ai/memori-react/commit/b2a1a592fb1c8df292297bba5ca61874aa1a910c))
* add memoriID parameter to uploadAsset function for enhanced asset management ([60d55e4](https://github.com/memori-ai/memori-react/commit/60d55e4313e2dd9a0e66923ab4c73a7da4299cbe))
* add status message display in ChatBubble and update session handling in MemoriWidget ([c2af0f6](https://github.com/memori-ai/memori-react/commit/c2af0f634fd106804a45cdb89967eef245312627))
* add SVG artifact support to ArtifactDrawer and ArtifactPreview components ([d8af976](https://github.com/memori-ai/memori-react/commit/d8af976fc4274d3eb2dac010214202a3db02d4f0))
* add WithPrivateAgent story to showcase private agent configuration in Storybook ([9b191dd](https://github.com/memori-ai/memori-react/commit/9b191dddee454bd2d212c300073a078365050b77))
* enhance ArtifactPreview component with improved iframe scrolling ([8e2f9b7](https://github.com/memori-ai/memori-react/commit/8e2f9b713bff452b9217663c46af8ea11eceecb4))
* enhance AuthWidget with loading state and error handling for authentication ([fbb5882](https://github.com/memori-ai/memori-react/commit/fbb58829673a9f78fd04a98ec0e2c41466db0d7c))
* enhance button and input focus styles ([3ba82f6](https://github.com/memori-ai/memori-react/commit/3ba82f6f9ff6d5ef1777de754c9ac288e3e8dbe1))
* enhance login feedback by updating status message display and localizations ([5351527](https://github.com/memori-ai/memori-react/commit/53515270d53debaf4ebe513bbc96e3fcfbbe97ae))
* implement copy buttons for user messages in ChatBubble component with feedback ([1af6569](https://github.com/memori-ai/memori-react/commit/1af6569ebb7b197562f5f842ec19fd3f94007433))
* Implement localized placeholders for date inputs ([5fa4176](https://github.com/memori-ai/memori-react/commit/5fa417638d36feded39da37d7dae7725eca716dd))
* improve AuthWidget validation and error handling ([607fb5d](https://github.com/memori-ai/memori-react/commit/607fb5d685eeba054fafbe55ceb2df771e8463ec))
* integrate ArtifactProvider into Avatar, Header, and MemoriWidget stories ([1724b72](https://github.com/memori-ai/memori-react/commit/1724b72abc10ea772ed82f5fb14ec4485aa38642))
* refactor DateSelector for mobile/desktop inputs ([1199989](https://github.com/memori-ai/memori-react/commit/1199989ebc729f368a58abd0a6028d9bcc1b6727))
* update Tooltip alignment options and enhance z-index for better layering ([b1e8810](https://github.com/memori-ai/memori-react/commit/b1e8810721daf030f586eee0019ed47797455ba8))


### Bug Fixes

* chat history drawer z-index ([07619cf](https://github.com/memori-ai/memori-react/commit/07619cf6ba993eb6e793922aa63d255f5edcdcdd))
* enable showUpload in DefaultLayout story ([77efcfe](https://github.com/memori-ai/memori-react/commit/77efcfea06cabcf2de6440b703c67de615f2c18a))
* update button class in Header component to conditionally apply muted style ([bf35726](https://github.com/memori-ai/memori-react/commit/bf35726ecea7c5f2e1a8c2974fca18057be6bb83))
* update DefaultLayout story ([27623d2](https://github.com/memori-ai/memori-react/commit/27623d23f235d527c908f27bb2c24326c8df335b))
* update Header component snapshot to reflect muted button class change ([41c4758](https://github.com/memori-ai/memori-react/commit/41c475875510e9139e4cd502e21f013e9a6d7251))
* update media filtering in Chat component to avoid excluding all the .txt files ([2e22963](https://github.com/memori-ai/memori-react/commit/2e2296358f0c28af7771ecb2f7e561e2d68e7d4b))


### Maintenance

* update [@memori](https://github.com/memori).ai/memori-api-client to version 6.17.0 ([1a46821](https://github.com/memori-ai/memori-react/commit/1a4682100f951aa3e4b7a08cb176868ee513a042))
* update storybook layout prop ([1b096ab](https://github.com/memori-ai/memori-react/commit/1b096abf7c5b9394e7d5a928a70bee783019f32c))


### Changes

* add reloading session after user has logged in ([968fdfa](https://github.com/memori-ai/memori-react/commit/968fdfa93229a6fb0aba61df427b9ff3b8d5a6b7))
* increase position controls height in CSS ([b2fae15](https://github.com/memori-ai/memori-react/commit/b2fae15fe49c0edbe4c24e2cb6716b363f69744e))
* remove SignupForm component and its associated tests and snapshots ([3e1229d](https://github.com/memori-ai/memori-react/commit/3e1229d7af96ecc9fa72b38a5a13842336b7bd3a))
* simplify DateSelector component by replacing Listbox with native date input ([2520a44](https://github.com/memori-ai/memori-react/commit/2520a446166a1f1c862392d7780ebe8c48ec5670))
* simplify Memori component usage in layout stories ([c9e77c3](https://github.com/memori-ai/memori-react/commit/c9e77c3d007d2ca6a9b4f981be5aa34ec6c86bdb))
* update button classes in ArtifactActions for improved styling and functionality ([8c557f5](https://github.com/memori-ai/memori-react/commit/8c557f51bbf18658d09e0dc1a57b171eebbb0e2a))

## [8.11.0](https://github.com/memori-ai/memori-react/compare/v8.10.1...v8.11.0) (2025-11-13)


### Features

* add additional layout props for enhanced customization in DefaultLayout story ([be0a03f](https://github.com/memori-ai/memori-react/commit/be0a03fa66bdebdf65f5189df27efc88a61f33c8))
* add support for multiple image types in MediaItemWidget stories ([dccf8d1](https://github.com/memori-ai/memori-react/commit/dccf8d1d7556b5eff0d8248e662bac13f03d7b98))
* enhance image handling in MediaItemWidget with improved error handling and URL validation ([68ac439](https://github.com/memori-ai/memori-react/commit/68ac4392654ef2e92661475238f78beb06d9a4a1))


### Changes

* remove unused props from DefaultLayout story ([2d3586c](https://github.com/memori-ai/memori-react/commit/2d3586c4f64532ccf550eb06d834201e7d4f3ff5))
* update layout stories to use new Memori component structure and streamline props handling ([dcd098e](https://github.com/memori-ai/memori-react/commit/dcd098ec420d5bc54bd8b0fd5b0931948a6c5de4))
* update storybook layouts and remove unused story exports for improved organization ([deec85d](https://github.com/memori-ai/memori-react/commit/deec85d45e7917416288783ff70ee1936bf10715))

## [8.10.1](https://github.com/memori-ai/memori-react/compare/v8.10.0...v8.10.1) (2025-11-11)


### Changes

* simplify MediaItemWidget by removing unused state and optimizing image source handling ([87f931c](https://github.com/memori-ai/memori-react/commit/87f931c4f303bbeb72093d00caf61a8d5328ed77))
* streamline image source handling in stories and snapshots for consistency ([71d1108](https://github.com/memori-ai/memori-react/commit/71d1108b214f93c9f3b06e42e9950839d83eabde))

## [8.10.0](https://github.com/memori-ai/memori-react/compare/v8.9.2...v8.10.0) (2025-11-10)


### Features

*  chat languages sorted alphabetically ([8dc7c05](https://github.com/memori-ai/memori-react/commit/8dc7c0523be6cac778e5462dba3de9331e9a8b39))
* enhance image handling in MediaItemWidget with error handling and URL validation ([bfaab83](https://github.com/memori-ai/memori-react/commit/bfaab83f3edddef72e777e5eab5ecd0ebc0c91ae))


### Changes

* update popular language codes and improve language grouping logic ([d8a2374](https://github.com/memori-ai/memori-react/commit/d8a23740aa7d93f5daa1e5536543ef4b3fadae3d))

## [8.9.2](https://github.com/memori-ai/memori-react/compare/v8.9.1...v8.9.2) (2025-11-04)


### Bug Fixes

* ensure message is sent only when listening is active ([f2fc193](https://github.com/memori-ai/memori-react/commit/f2fc193a7ce5709e407098d65b03baaf8ea274bc))

## [8.9.1](https://github.com/memori-ai/memori-react/compare/v8.9.0...v8.9.1) (2025-11-03)


### Bug Fixes

* exclude plain text media items from chat message filtering ([02e6213](https://github.com/memori-ai/memori-react/commit/02e621358ce99e5271d5a347b4b9c7a38ec19923))

## [8.9.0](https://github.com/memori-ai/memori-react/compare/v8.8.5...v8.9.0) (2025-11-03)


### Features

* add support for multiple artifacts in chat messages ([47081e9](https://github.com/memori-ai/memori-react/commit/47081e9c2c6f20d6d8ab90b481347e7b356f6c32))
* enhance language selection by grouping popular and all languages in StartPanel ([98a8db8](https://github.com/memori-ai/memori-react/commit/98a8db8501967a16c007e3a1c65f3fa9f38287e4))
* enhance MemoriArtifactAPI with new global JavaScript methods for artifact management ([b94ebaa](https://github.com/memori-ai/memori-react/commit/b94ebaa123dd784be4507475d07d3a7421b9b811))
* introduce ArtifactAPIBridge for global access to artifact management functions ([baa0175](https://github.com/memori-ai/memori-react/commit/baa0175e347764873764e58276be6d7e6e4545fb))


### Changes

* adjust chat component CSS for full height and improved layout ([3296d08](https://github.com/memori-ai/memori-react/commit/3296d084e1f7f07449ebe37831559d95239a1d45))
* enhance chat components with responsive design and textarea expansion handling ([b3186c8](https://github.com/memori-ai/memori-react/commit/b3186c8c22c8815535761c3c08e888a7b24f6912))
* implement document attachment tag stripping in Snippet ([852edd2](https://github.com/memori-ai/memori-react/commit/852edd2078d1be6e88f245a95485b27518d4c4b9))
* improve media handling in ChatInputs component ([71944c5](https://github.com/memori-ai/memori-react/commit/71944c56cc4dac218adcb64a55946aa675bdd01c))
* remove console logs across various components for cleaner code ([df21f71](https://github.com/memori-ai/memori-react/commit/df21f718e87ab1527b7f985f1af9e0cec76deda1))
* remove unnecessary console log for unmatched animations in AvatarAnimator ([ecbea22](https://github.com/memori-ai/memori-react/commit/ecbea22a74aaacfa4de254ad166624c6cf06948d))
* streamline artifact handling and enhance API integration in MemoriWidget ([1c7dc48](https://github.com/memori-ai/memori-react/commit/1c7dc4874b082e20ce33821543c099ecf0ea9871))
* unify chat and media components with consistent scroll item class ([20e6203](https://github.com/memori-ai/memori-react/commit/20e6203c2bc3981314bdc4841969551a3fd093d8))
* update snapshot tests to include consistent scroll item class ([e54257a](https://github.com/memori-ai/memori-react/commit/e54257a354a8e4564725124288c55e7eeaea6da7))

## [Unreleased]

### Features

* **MemoriArtifactAPI**: Add global JavaScript API for programmatic artifact control
  * Expose `window.MemoriArtifactAPI` for external integrations
  * Add `createAndOpenArtifact()` for simple artifact creation
  * Add `createFromOutputElement()` to process existing DOM elements
  * Add `processAllArtifacts()` for batch processing of `<output>` tags
  * Add `getState()` to query current artifact system state
  * Support for WebSocket and Action Cable integrations
  * Full TypeScript type definitions exported
  * Non-invasive implementation using existing React Context
  * Automatic cleanup on component unmount

## [8.8.5](https://github.com/memori-ai/memori-react/compare/v8.8.4...v8.8.5) (2025-10-27)


### Changes

* remove unnecessary console logs ([49f9fb2](https://github.com/memori-ai/memori-react/commit/49f9fb2f515a3c970d1b6245dafd2a7358e93cea))
* streamline default prop handling in MemoriWidget for better integration configuration ([f50e0d0](https://github.com/memori-ai/memori-react/commit/f50e0d080ec6a98157b169c079cb54d1b0fd0c6d))
* update AvatarComponent for improved animation handling ([72e6b5c](https://github.com/memori-ai/memori-react/commit/72e6b5c40b66ea664e9d34d646fb4a6ffc415569))

## [8.8.4](https://github.com/memori-ai/memori-react/compare/v8.8.3...v8.8.4) (2025-10-24)


### Changes

* enhance MediaItemWidget and Snippet styles for improved layout and responsiveness ([7121bcc](https://github.com/memori-ai/memori-react/commit/7121bcc360169511b9986f823469da91ec072a4b))
* enhance Prism script loading and code highlighting in Snippet component ([8a87e4e](https://github.com/memori-ai/memori-react/commit/8a87e4e101090085c45ac9cbc85b6b2682c6d646))
* update MediaItemWidget CSS to increase minimum column width for better layout ([2df373d](https://github.com/memori-ai/memori-react/commit/2df373dab4bea6e1b4c4ce032e214026bf1a5331))

## [8.8.3](https://github.com/memori-ai/memori-react/compare/v8.8.2...v8.8.3) (2025-10-24)


### Features

* add settings button to Totem layout for enhanced user configuration ([31f4d1f](https://github.com/memori-ai/memori-react/commit/31f4d1fe2837fbf5ec433fa9307210e6fc7f8bfc))


### Changes

* add settings content check and improve fullscreen handling in Header component ([b87f3f4](https://github.com/memori-ai/memori-react/commit/b87f3f4468b07ac0d26cef6217edb4c31b898c59))
* clean up MemoriWidget and useTTS for improved audio handling and state management ([ad69071](https://github.com/memori-ai/memori-react/commit/ad690719c8c28d1401a0d5743e365b44bc03448f))
* implement centralized audio playback logic in MemoriWidget ([a31463b](https://github.com/memori-ai/memori-react/commit/a31463b928517c13a74184925ed7433d97ada5dc))
* optimize settings content check and enhance Header component structure ([320b16e](https://github.com/memori-ai/memori-react/commit/320b16e3d0c6af531d48c17c48c8b3ec3d881655))

## [8.8.2](https://github.com/memori-ai/memori-react/compare/v8.8.1...v8.8.2) (2025-10-23)


### Features

* add support for code snippets in MediaItemWidget with modal display ([3bd2c6b](https://github.com/memori-ai/memori-react/commit/3bd2c6b2c1fbf97fe9c146452b3d0cd76d7da880))


### Bug Fixes

* restore max-height property in MediaItemWidget CSS ([869cb41](https://github.com/memori-ai/memori-react/commit/869cb41465dcad9c693e6a5f544b7bcaa4dcfdc6))


### Changes

* enhance MemoriWidget audio handling and state management for mute functionality ([457ed1a](https://github.com/memori-ai/memori-react/commit/457ed1a7754c64a2b3f753cd4562761010badbfd))
* enhance useTTS with detailed logging for debugging ([1bc8b9f](https://github.com/memori-ai/memori-react/commit/1bc8b9ffa53ba6d59f206f0999bc9d8dc3c92dc4))
* improve viseme queue management and clean up audio handling in useTTS ([c07b14e](https://github.com/memori-ai/memori-react/commit/c07b14ecc1fab4fc72be77a609d08b5d4929395c))
* streamline fullscreen handling for MemoriWidget and improve portal management ([2edb6df](https://github.com/memori-ai/memori-react/commit/2edb6df9adae125cadd2b1327bc702ba0403ca48))

## [8.8.1](https://github.com/memori-ai/memori-react/compare/v8.8.0...v8.8.1) (2025-10-22)


### Changes

* adjust viseme preloading time and clean up audio handling in useTTS ([8bfd5fe](https://github.com/memori-ai/memori-react/commit/8bfd5fed4cee8dbad7ee68f3dbff43547de17430))

## [8.8.0](https://github.com/memori-ai/memori-react/compare/v8.7.9...v8.8.0) (2025-10-22)


### Features

* add 'TOTEM' layout option and refactor TTS chunk handling in useTTS ([9019764](https://github.com/memori-ai/memori-react/commit/901976416813643a7f195c4779ee4fefdbe9cb83))


### Bug Fixes

* improve fullscreen handling in Header component ([f92385d](https://github.com/memori-ai/memori-react/commit/f92385dd607c415fbff69441bc2d057ed5d9497d))
* remove <think> tag in ChatBubble before copying to clipboard ([cd11c30](https://github.com/memori-ai/memori-react/commit/cd11c30bed6779bfb47c9fb60df45223e5581332))


### Changes

* optimize audio handling in useTTS for Android compatibility and adjust viseme preloading time ([40caf7a](https://github.com/memori-ai/memori-react/commit/40caf7a8ec70f015c0754d84a8b09a8e05227eee))
* replaced error handling state for useTTS and useSTT with console error ([9db04c8](https://github.com/memori-ai/memori-react/commit/9db04c8b4c1b1b8b73cf6f9498a1016681f3a2fd))
* simplify useSTT hook by removing continious speech ([43af26b](https://github.com/memori-ai/memori-react/commit/43af26b40059f49ea4ac69e9415cc42c80351d89))
* update ChatInputs snapshots and enhance MicrophoneButton functionality with touch event handling ([5625773](https://github.com/memori-ai/memori-react/commit/562577304809eba8ce2b0cc6962771a4f3b26e3e))
* update Test story with new parameters and localization settings ([96714b0](https://github.com/memori-ai/memori-react/commit/96714b0684fcea57c73a48d965b5afbbf9f949d7))

## [8.7.9](https://github.com/memori-ai/memori-react/compare/v8.7.8...v8.7.9) (2025-10-16)


### Bug Fixes

* start panel scroll + expandable + hover bg ([21f0351](https://github.com/memori-ai/memori-react/commit/21f0351ffe4120499b81f898fa8921bd6e8013ce))
* update ChatBubble snapshot to reflect changes in output structure and parameter retrieval ([7697ecd](https://github.com/memori-ai/memori-react/commit/7697ecd0889101f12e0f5ef23b8851becb8217c2))


### Changes

* add LANG context var opening session ([cbcbb4e](https://github.com/memori-ai/memori-react/commit/cbcbb4e250fd615bed2cf53303c83f860bcbf33b))
* enhance date polling in MemoriWidget to respect tab visibility ([64e6a6f](https://github.com/memori-ai/memori-react/commit/64e6a6f531adc4bfe7f91d75b5f64e382fa5bf3e))

## [8.7.8](https://github.com/memori-ai/memori-react/compare/v8.7.7...v8.7.8) (2025-10-03)


### Bug Fixes

* correct user acceptance state variable in LoginDrawer ([675b642](https://github.com/memori-ai/memori-react/commit/675b6426986da8d2a82b4f6fdd4b8314c8a01392))

## [8.7.7](https://github.com/memori-ai/memori-react/compare/v8.7.6...v8.7.7) (2025-10-03)


### Bug Fixes

* initialize user birth date and acceptance states in LoginDrawer ([397fe1e](https://github.com/memori-ai/memori-react/commit/397fe1e73c4b88d21648ce1594f647f509336fd6))


### Changes

* update MemoriWidget to use pwl methods for user authentication and logout ([a27a302](https://github.com/memori-ai/memori-react/commit/a27a30232287e4c1c6c832d406e51879efe92725))

## [8.7.6](https://github.com/memori-ai/memori-react/compare/v8.7.5...v8.7.6) (2025-10-03)


### Changes

* update document upload limits to allow larger payloads ([115f52c](https://github.com/memori-ai/memori-react/commit/115f52cc583093e6013155a15c12522d331d4b20))

## [8.7.5](https://github.com/memori-ai/memori-react/compare/v8.7.4...v8.7.5) (2025-09-29)


### Bug Fixes

* close artifact when we are closing the HIDDEN CHAT ([207d40e](https://github.com/memori-ai/memori-react/commit/207d40e51c34ee16a6d77f0b49b4bb9216ec8ca1))
* exclude HIDDEN_CHAT layout to showFullHistory condition ([4e98c38](https://github.com/memori-ai/memori-react/commit/4e98c38d589bc6358c6bb194ffb822837c913fed))
* stripped out reasoning tag inside the detect artifact function ([4b1865c](https://github.com/memori-ai/memori-react/commit/4b1865c83b5416b078bfd8de708a0437d9d0bb6c))
* update snapshot to replace data attribute with id for toaster component ([5b757b4](https://github.com/memori-ai/memori-react/commit/5b757b49cd74b30b9c6eb31aee2ab0e8de04b67f))


### Changes

* clean up LoginDrawer by removing unused email help text ([ffb767e](https://github.com/memori-ai/memori-react/commit/ffb767e6a308a32a4f2adc93361beed9f6aa4886))
* optimize artifact detection and rendering in ArtifactHandler component ([aa92733](https://github.com/memori-ai/memori-react/commit/aa92733f9a8f62ead33a03552c1a9560ed0b0f43))
* update LoginDrawer to handle OTP login ([b2b5d9d](https://github.com/memori-ai/memori-react/commit/b2b5d9dd27e69efc31a3aadfcbd35137fbf1d335))

## [8.7.4](https://github.com/memori-ai/memori-react/compare/v8.7.3...v8.7.4) (2025-09-26)


### Bug Fixes

* update snapshot to replace id with data attribute for toaster component ([574585d](https://github.com/memori-ai/memori-react/commit/574585d0dce7d676de98414a3c00f7129f835375))


### Changes

* get the expired session chat logs and set it in the new session ([ce46369](https://github.com/memori-ai/memori-react/commit/ce46369b1c3a0c9a179ce5ceae24aefb42faf75e))

## [8.7.3](https://github.com/memori-ai/memori-react/compare/v8.7.2...v8.7.3) (2025-09-25)


### Bug Fixes

* simplify attribute mutation check in Memori component ([e9758b8](https://github.com/memori-ai/memori-react/commit/e9758b836b38e0212bcb66ef5225770573071e82))

## [8.7.2](https://github.com/memori-ai/memori-react/compare/v8.7.1...v8.7.2) (2025-09-25)


### Features

* add dynamic sessionId handling ([c80f0f5](https://github.com/memori-ai/memori-react/commit/c80f0f5a2ad497999218e6b401c8aeef1b9db02b))

## [8.7.1](https://github.com/memori-ai/memori-react/compare/v8.7.0...v8.7.1) (2025-09-22)


### Features

* add Dropdown component styles and remove unused import from Header ([43cfcd6](https://github.com/memori-ai/memori-react/commit/43cfcd6cf94616c3276af1a692ab5b874a232124))

## [8.7.0](https://github.com/memori-ai/memori-react/compare/v8.6.7...v8.7.0) (2025-09-22)


### Features

* enhance LoginDrawer with OTP functionality and user data handling ([88abe88](https://github.com/memori-ai/memori-react/commit/88abe883f7dde4cb596d2215940d38d2dfae0fd7))
* implement Dropdown component with styles and Logout icon ([68f09ec](https://github.com/memori-ai/memori-react/commit/68f09ec09c6cafabf56b29ca5bef597d7dca1249))
* implement user avatar upload functionality in Header component ([e936f14](https://github.com/memori-ai/memori-react/commit/e936f1434d8ccb9c333c46efd9ad24b0b2be020f))
* integrate artifact context into HiddenChat and adjust sidebar toggle styles ([8f27bec](https://github.com/memori-ai/memori-react/commit/8f27bec47128cb217c805c6833a6637ba4629c7e))
* reintegrated AccountForm component for user account management ([d3f3284](https://github.com/memori-ai/memori-react/commit/d3f3284856877d24a326e8702ede473ca7fbacb2))


### Bug Fixes

* chat not starting when enableAudio is false ([26f87bf](https://github.com/memori-ai/memori-react/commit/26f87bfa43de68c6cd06a34e203d2259724653b4))


### Changes

* update LoginDrawer styles and initial OTP form visibility ([b23629a](https://github.com/memori-ai/memori-react/commit/b23629a6e71ce2af292d6b356d9e7bce1eee24cf))

## [8.6.7](https://github.com/memori-ai/memori-react/compare/v8.6.6...v8.6.7) (2025-09-17)


### Features

* add user typing state management to MemoriWidget ([0a0b1da](https://github.com/memori-ai/memori-react/commit/0a0b1daab1cab1266d2d7eb997918f833273e4b4))


### Changes

* clean up audio references ([31a4cf5](https://github.com/memori-ai/memori-react/commit/31a4cf5437a4f05b7e1631e45568832515b44daf))

## [8.6.6](https://github.com/memori-ai/memori-react/compare/v8.6.5...v8.6.6) (2025-09-17)


### Bug Fixes

* whitelisted domain check to include own tenant ([2270987](https://github.com/memori-ai/memori-react/commit/2270987194cce04cf78de2af707568f6c521e4a7))
* whitelisted domain check to include own tenant ([fe2ba28](https://github.com/memori-ai/memori-react/commit/fe2ba280e20592854469918c66d0c5227a312d12))


### Changes

* added comments to the chunk TTS implementation ([c539602](https://github.com/memori-ai/memori-react/commit/c53960235ffc4560ada59fb619b572d8c0653146))
* improve text-to-speech chunking and playback logic ([f06dd91](https://github.com/memori-ai/memori-react/commit/f06dd917b157bc8032b197f051c1c7647273e507))

## [8.6.5](https://github.com/memori-ai/memori-react/compare/v8.6.4...v8.6.5) (2025-09-16)


### Bug Fixes

* enhance location handling in preview detection logic ([c53b1ff](https://github.com/memori-ai/memori-react/commit/c53b1ffc64a63f9a25b7d5567b940874e5147a2e))
* update preview detection logic to improve whitelist bypass handling ([a9c3457](https://github.com/memori-ai/memori-react/commit/a9c34572e75e006e1070f705c2e6681e074da72b))

## [8.6.4](https://github.com/memori-ai/memori-react/compare/v6.8.4...v8.6.4) (2025-09-16)

## [6.8.4](https://github.com/memori-ai/memori-react/compare/v8.6.3...v6.8.4) (2025-09-16)


### Features

* add preview context detection to whitelist domain check ([9fce89c](https://github.com/memori-ai/memori-react/commit/9fce89c7fd4691d0611b68949ad300fa2ca15d5b))

## [8.6.3](https://github.com/memori-ai/memori-react/compare/v8.6.2...v8.6.3) (2025-09-16)


### Features

* add preview context detection to whitelist domain check ([c288d33](https://github.com/memori-ai/memori-react/commit/c288d3364e075e455f7dd0461a5f71f11933bad7))

## [8.6.2](https://github.com/memori-ai/memori-react/compare/v8.6.1...v8.6.2) (2025-09-16)


### Features

* add artifact creation event dispatching in ArtifactHandler ([1fb558b](https://github.com/memori-ai/memori-react/commit/1fb558bdf530d2feabb33f29689c27223ed126a1))
* enhance audio processing with Safari compatibility and silence detection ([fab7b50](https://github.com/memori-ai/memori-react/commit/fab7b5035af09fa09173b11057ad98578161c5ac))
* improve silence detection and audio activity analysis in useSTT ([50260a9](https://github.com/memori-ai/memori-react/commit/50260a98f7457b0a86e4155932e9f9b007285f93))
* refine message rendering and translation handling with improved tag processing ([848d491](https://github.com/memori-ai/memori-react/commit/848d4916620a86e930bfc74c8a24cfd45560186c))


### Bug Fixes

* improve text handling to prevent empty or muted speech ([f1083bc](https://github.com/memori-ai/memori-react/commit/f1083bc0c3287fafa68bb869232a72fc1f0c77f2))


### Changes

* remove interaction timeout logic from MemoriWidget for cleaner state management ([31d477b](https://github.com/memori-ai/memori-react/commit/31d477bbd934db288333952c2c0c2a2c46ba5f08))
* simplify incident status checking logic in CompletionProviderStatus component ([44a70d9](https://github.com/memori-ai/memori-react/commit/44a70d9cdd9bc56d6db120b8882d79628dbb1102))

## [8.6.1](https://github.com/memori-ai/memori-react/compare/v8.6.0...v8.6.1) (2025-09-15)

## [8.6.0](https://github.com/memori-ai/memori-react/compare/v8.5.2...v8.6.0) (2025-09-15)


### Features

* implement markdown rendering and PDF export enhancements for Safari compatibility ([6bf1990](https://github.com/memori-ai/memori-react/commit/6bf19907083fb2b4a593ced9cb215412f052d846))


### Bug Fixes

* adjust artifact opening logic based on chat log panel state ([c76f35b](https://github.com/memori-ai/memori-react/commit/c76f35b983fa24cbf59f866c2a63a06c74bc305e))


### Changes

* update ArtifactActions and ArtifactDrawer for optional action handlers ([424807c](https://github.com/memori-ai/memori-react/commit/424807c07c9ef5a863ff73922036dc216b2beba6))

## [8.5.2](https://github.com/memori-ai/memori-react/compare/v8.5.1...v8.5.2) (2025-09-15)


### Bug Fixes

* lint ([ea3a110](https://github.com/memori-ai/memori-react/commit/ea3a110b6b6aff810fd83698048f4ae9e79f8b97))

## [8.5.1](https://github.com/memori-ai/memori-react/compare/v8.5.0...v8.5.1) (2025-09-14)

## [8.5.0](https://github.com/memori-ai/memori-react/compare/v8.4.2...v8.5.0) (2025-09-13)


### Features

* add preventBackdropClose prop to Drawer and adjust ArtifactDrawer styles ([89969f8](https://github.com/memori-ai/memori-react/commit/89969f8ef3679b5289a303dc55f3da99a45ecbd0))
* enhance ArtifactActions and ArtifactDrawer with mobile support ([541d979](https://github.com/memori-ai/memori-react/commit/541d979f4569c4b5cac8b00481d486dc41a3c72e))


### Changes

* update snapshots for layout components ([efa70f4](https://github.com/memori-ai/memori-react/commit/efa70f44d84905b164a344d18ba37a748cad797a))

## [8.4.2](https://github.com/memori-ai/memori-react/compare/v8.4.1...v8.4.2) (2025-09-12)


### Changes

* adjust chat layout styles for improved responsiveness and height calculations ([1e71c3b](https://github.com/memori-ai/memori-react/commit/1e71c3bc0e8aab5e448d28c9f9e1887c3a25769b))
* remove OTP-related functionality from LoginDrawer ([880f51d](https://github.com/memori-ai/memori-react/commit/880f51d1f989821c263738709625dd58daf719c3))

## [8.4.1](https://github.com/memori-ai/memori-react/compare/v8.4.0...v8.4.1) (2025-09-11)


### Features

* enhance OTP login form with username input, validation, and loading states ([833bcf3](https://github.com/memori-ai/memori-react/commit/833bcf35d873ebcfeb3ec8634425b5ec381a881e))
* implement OTP login functionality in LoginDrawer ([b378ed3](https://github.com/memori-ai/memori-react/commit/b378ed3c8c2821cbd1ae858cb406f8273967fd50))

## [8.4.0](https://github.com/memori-ai/memori-react/compare/v8.4.0-rc.9...v8.4.0) (2025-09-11)


### Maintenance

* fallback for translations ([997ad7a](https://github.com/memori-ai/memori-react/commit/997ad7ad0b39e7f55bf030ad8db1010661f4afb8))


### Changes

* enhance artifact copy functionality ([b78acb3](https://github.com/memori-ai/memori-react/commit/b78acb3a664e5be7c5ebb76995599096beedec3f))
* improve incident status checking logic in CompletionProviderStatus ([730c68f](https://github.com/memori-ai/memori-react/commit/730c68f58b33eff1536ffcdc3f5f3bd3714faf26))
* update ArtifactDrawer and ArtifactPreview for improved layout and functionality ([e20a1a1](https://github.com/memori-ai/memori-react/commit/e20a1a1e88c2dddc7e61fc61bef8da57b9cbbcad))
* update MediaItemWidget styles for improved layout and responsiveness ([9f3520d](https://github.com/memori-ai/memori-react/commit/9f3520dd13dd8b3d0f49a7b015a9f4407e3ce884))

## [8.4.0-rc.9](https://github.com/memori-ai/memori-react/compare/v8.4.0-rc.8...v8.4.0-rc.9) (2025-09-10)


### Changes

* improve responsiveness and styling of ArtifactActions ([9a960dc](https://github.com/memori-ai/memori-react/commit/9a960dc25ce1273b798a70090af200b714affa94))

## [8.4.0-rc.8](https://github.com/memori-ai/memori-react/compare/v8.4.0-rc.7...v8.4.0-rc.8) (2025-09-09)


### Changes

* enhance ArtifactActions and ArtifactDrawer and improved layout and responsiveness ([af3139c](https://github.com/memori-ai/memori-react/commit/af3139c45726c76af454056cf4773098bf6face9))
* update ArtifactDrawer styles and enhance title extraction logic in ArtifactHandler ([8d6c503](https://github.com/memori-ai/memori-react/commit/8d6c5031e44c15d3ba1e98ccf2bc5a8736ce1ce5))

## [8.4.0-rc.7](https://github.com/memori-ai/memori-react/compare/v8.4.0-rc.6...v8.4.0-rc.7) (2025-09-09)


### Changes

* update ArtifactHandler to use local state for currentArtifact ([8273c7d](https://github.com/memori-ai/memori-react/commit/8273c7dfb1ba2fcac039c68454b27eac0870f05e))

## [8.4.0-rc.6](https://github.com/memori-ai/memori-react/compare/v8.4.0-rc.5...v8.4.0-rc.6) (2025-09-09)


### Changes

* move artifact detection logic to ArtifactHandler and simplify Chat component ([596e9a1](https://github.com/memori-ai/memori-react/commit/596e9a11d6f741a5993d1d39c2e4eb968173487b))

## [8.4.0-rc.5](https://github.com/memori-ai/memori-react/compare/v8.4.0-rc.4...v8.4.0-rc.5) (2025-09-09)


### Features

* implement artifact auto-opening and enhance artifact handling in chat ([c7a3720](https://github.com/memori-ai/memori-react/commit/c7a372029b8b2d0864e5cc329bc66a6d180cc581))

## [8.4.0-rc.4](https://github.com/memori-ai/memori-react/compare/v8.4.0-rc.3...v8.4.0-rc.4) (2025-09-09)


### Features

* add isChatlogPanel prop to Chat and Artifact components ([1cae0b8](https://github.com/memori-ai/memori-react/commit/1cae0b82f39fb851c37acd98d027284e59256eb4))

## [8.4.0-rc.3](https://github.com/memori-ai/memori-react/compare/v8.4.0-rc.2...v8.4.0-rc.3) (2025-09-09)


### Bug Fixes

* linting ([bd671aa](https://github.com/memori-ai/memori-react/commit/bd671aa4a977c09a108e15263f31ba5011f4a247))


### Changes

* enhance artifact action icons with fullscreen styling ([0f53e8c](https://github.com/memori-ai/memori-react/commit/0f53e8c850ba75ffbd0ac959ecfe33a97c72515a))
* streamline localization keys for artifact actions and improve css animations ([46ac364](https://github.com/memori-ai/memori-react/commit/46ac364cb6237cb627804e71ee89bf6becd5ddcb))

## [8.4.0-rc.2](https://github.com/memori-ai/memori-react/compare/v8.4.0-rc.1...v8.4.0-rc.2) (2025-09-09)


### Changes

* update chat layout styles and improve component responsiveness ([51c3596](https://github.com/memori-ai/memori-react/commit/51c3596403eedfe842abd0fadd713420a1264f28))

## [8.4.0-rc.1](https://github.com/memori-ai/memori-react/compare/v8.4.0-rc.0...v8.4.0-rc.1) (2025-09-08)


### Features

* add multilingual support for artifact-related terms in localization files ([312b2b5](https://github.com/memori-ai/memori-react/commit/312b2b5ebaf80ef733c64104c676fac6a6cbb3db))
* add Storybook stories for ArtifactDrawer ([3465875](https://github.com/memori-ai/memori-react/commit/3465875f01cd803fbf80c3eef95cb5a4c4dca1b9))


### Changes

* remove unnecessary transitions and clean up CSS for Artifact components ([de9677a](https://github.com/memori-ai/memori-react/commit/de9677a20aef223d6cdc4a469f0d80b0fde5a9ff))
* remove unused CSS rules and animations from ArtifactDrawer for cleaner styling ([25ee0f3](https://github.com/memori-ai/memori-react/commit/25ee0f3ec0ca009efc1b0601e93ff0dbb8ffb769))
* replace ArtifactSystemProvider with ArtifactProvider for improved context management ([6c79d50](https://github.com/memori-ai/memori-react/commit/6c79d5006e07d23b61433f62103a11f6b057f45d))

## [8.4.0-rc.0](https://github.com/memori-ai/memori-react/compare/v8.3.0...v8.4.0-rc.0) (2025-09-05)


### Features

* enhance chat layout with artifact drawer and responsive design adjustments ([2c37bc5](https://github.com/memori-ai/memori-react/commit/2c37bc5cfb15ce56395157f98f3ff3466d97a5eb))
* integrate ArtifactSystemProvider for enhanced artifact management across layouts ([3201f45](https://github.com/memori-ai/memori-react/commit/3201f454b14a2880bb3f3e5cf72f6d7fa380d445))
* integrate MemoriArtifactSystem for enhanced artifact handling in chat ([d1f6cd9](https://github.com/memori-ai/memori-react/commit/d1f6cd91e503d9fad1fc1b86a4c3d3556c7000f7))
* update layouts and chat components ([6b4382e](https://github.com/memori-ai/memori-react/commit/6b4382eac91aeeeffdc2395ae9395849c9a18b82))


### Bug Fixes

* adjust min-height property in chat layout for better responsiveness ([065a8ee](https://github.com/memori-ai/memori-react/commit/065a8ee63ee32a2c040c5fc9a7d791a7d6dbfe28))


### Changes

* introduce context for improved artifact management ([42da76e](https://github.com/memori-ai/memori-react/commit/42da76e4d9ca57040efd31646d6b5669c52cb988))

## [8.3.0](https://github.com/memori-ai/memori-react/compare/v8.2.0...v8.3.0) (2025-09-03)


### Features

* implement WAV format conversion for Azure STT support in useSTT hook ([4b10032](https://github.com/memori-ai/memori-react/commit/4b10032998274ba738c66c69d532f7bc4544cfc0))

## [8.2.0](https://github.com/memori-ai/memori-react/compare/v8.1.0...v8.2.0) (2025-08-29)


### Features

* add ignoreClientAttributes param from layout to block attr/props ([8e5838d](https://github.com/memori-ai/memori-react/commit/8e5838d7ec1d9b36584e93eece8acac88bf9afc7))


### Bug Fixes

* chat history min msg filter no negative values ([4211f39](https://github.com/memori-ai/memori-react/commit/4211f3968805bdee43a5641b5b47b63f80aa53e8))

## [8.1.0](https://github.com/memori-ai/memori-react/compare/v8.1.0-rc.0...v8.1.0) (2025-08-28)


### Features

* add resume button translations for German, Spanish, and French locales ([f36d358](https://github.com/memori-ai/memori-react/commit/f36d358d9515b1c979a4979945c3931c832adda3))


### Maintenance

* added check to avoid translation if message is already translated + refactoring ([5a4b000](https://github.com/memori-ai/memori-react/commit/5a4b000e0cee808890481f86c5103546d4a31447))
* added story for chat history translation ([84fed16](https://github.com/memori-ai/memori-react/commit/84fed16fbba3b4e0d301bf70defcfffd5bb3c19a))
* added translations on chat history preview ([dfdc9b4](https://github.com/memori-ai/memori-react/commit/dfdc9b44a0c77824a3d4ebf652286bcfb4f266b2))
* avoid chatLog message translation if already translated from history ([c42f075](https://github.com/memori-ai/memori-react/commit/c42f075325324ab06fe372eb46b6acf1ae46051e))
* disabled card of active chat on chat history ([ccfe96a](https://github.com/memori-ai/memori-react/commit/ccfe96ae0ad1422298cdb86afe9a70999362178d))

## [8.1.0-rc.0](https://github.com/memori-ai/memori-react/compare/v8.0.2...v8.1.0-rc.0) (2025-08-27)


### Features

* add minimum messages filter to ChatHistoryDrawer ([2f0970f](https://github.com/memori-ai/memori-react/commit/2f0970f13b1ae8c7ce49046c3f813138b3f2e5f4))
* implement custom minimum messages filter in ChatHistoryDrawer with localization support ([54f3146](https://github.com/memori-ai/memori-react/commit/54f31468fb9f62355b550a3ac7efb5100e03b495))


### Bug Fixes

* adjust silence timeout handling in useSTT hook for accurate recording control ([7c831b0](https://github.com/memori-ai/memori-react/commit/7c831b091d59ea0802f7904f900f35ce6e98404b))


### Maintenance

* update yarn.lock ([4e7e96e](https://github.com/memori-ai/memori-react/commit/4e7e96e26029439cf14f8ec40e7c1e9d823c7f62))


### Changes

* integrate new STT hook for improved speech recognition functionality ([515aa5f](https://github.com/memori-ai/memori-react/commit/515aa5fad382ccbf00da3c06deb401b51a74fee0))
* remove logs for useSTT hook ([cc1b132](https://github.com/memori-ai/memori-react/commit/cc1b132fd999aa61cc406169d75a6d1ee5d051bb))
* remove unused speech SDK imports ([8121cdc](https://github.com/memori-ai/memori-react/commit/8121cdc68b12fc743567e032751f0adb2c5cc5bc))

## [8.0.2](https://github.com/memori-ai/memori-react/compare/v8.0.0-rc.12...v8.0.2) (2025-08-20)

## [8.0.0-rc.12](https://github.com/memori-ai/memori-react/compare/v8.0.0-rc.11...v8.0.0-rc.12) (2025-08-20)


### Bug Fixes

* remove unused state and enhance logging in HiddenChat layout ([5df5817](https://github.com/memori-ai/memori-react/commit/5df58171b5d9c6c01a65855729677a0dae2b598e))

## [8.0.0-rc.11](https://github.com/memori-ai/memori-react/compare/v8.0.0-rc.10...v8.0.0-rc.11) (2025-08-11)


### Bug Fixes

* resolve race condition in TTS audio playback and improve cleanup handling ([384d45e](https://github.com/memori-ai/memori-react/commit/384d45e29d970807fb4bb5d9f6b645ebe7dc4e53))

## [8.0.0-rc.10](https://github.com/memori-ai/memori-react/compare/v8.0.0-rc.9...v8.0.0-rc.10) (2025-08-11)


### Bug Fixes

* enhance text sanitization and update TTS layout options ([26ab442](https://github.com/memori-ai/memori-react/commit/26ab4427b79caaca5239e8a69932e7a58a5889da))

## [8.0.0-rc.9](https://github.com/memori-ai/memori-react/compare/v8.0.0-rc.8...v8.0.0-rc.9) (2025-08-11)


### Features

* add layout option to TTS configuration ([6fe466f](https://github.com/memori-ai/memori-react/commit/6fe466f128ac6cbf9687697a40be080353d77d13))

## [8.0.0-rc.8](https://github.com/memori-ai/memori-react/compare/v8.0.0-rc.7...v8.0.0-rc.8) (2025-08-11)


### Bug Fixes

* update audio handling defaults and improve alert z-index ([4b10151](https://github.com/memori-ai/memori-react/commit/4b10151bbfc45ce3d9db2d663cbe77de412e66ff))

## [8.0.0-rc.7](https://github.com/memori-ai/memori-react/compare/v8.0.0-rc.6...v8.0.0-rc.7) (2025-08-11)


### Bug Fixes

* improve URL formatting and error handling in speech key fetching ([95cc693](https://github.com/memori-ai/memori-react/commit/95cc693a2749bc525843c8ad8d3cd78c51be80b6))

## [8.0.0-rc.6](https://github.com/memori-ai/memori-react/compare/v8.0.0-rc.5...v8.0.0-rc.6) (2025-08-11)


### Bug Fixes

* enhance error handling TTS components ([85eef2f](https://github.com/memori-ai/memori-react/commit/85eef2fec9339625549ad9dabaf35176fff60831))

## [8.0.0-rc.5](https://github.com/memori-ai/memori-react/compare/v8.0.0-rc.4...v8.0.0-rc.5) (2025-08-11)


### Bug Fixes

* simplify audio handling by removing showSpeaker prop ([4d3ea86](https://github.com/memori-ai/memori-react/commit/4d3ea865a3c23a8f2381ac95e92cfa53353a0900))

## [8.0.0-rc.4](https://github.com/memori-ai/memori-react/compare/v8.0.0-rc.3...v8.0.0-rc.4) (2025-08-08)


### Bug Fixes

* prevent TTS on auto-start in HIDDEN_CHAT ([933857c](https://github.com/memori-ai/memori-react/commit/933857ca1ab8e7a4ab37c5ce1eb689aaf5a4862d))

## [8.0.0-rc.3](https://github.com/memori-ai/memori-react/compare/v8.0.0-rc.2...v8.0.0-rc.3) (2025-08-08)


### Features

* fixed viseme handling for TTS ([e284034](https://github.com/memori-ai/memori-react/commit/e284034990990cc48e559466dfb8183b19d6bbaa))

## [8.0.0-rc.2](https://github.com/memori-ai/memori-react/compare/v8.0.0-rc.1...v8.0.0-rc.2) (2025-08-08)


### Bug Fixes

* update TTS API URL handling in MemoriWidget and useTTS ([c257064](https://github.com/memori-ai/memori-react/commit/c2570641d56b787d233519c81fb59d19f1c70939))

## [8.0.0-rc.1](https://github.com/memori-ai/memori-react/compare/v8.0.0-rc.0...v8.0.0-rc.1) (2025-08-07)


### Maintenance

* remove unused dependencies ([c7d6852](https://github.com/memori-ai/memori-react/commit/c7d685265b78f3e7d3214fe59ab1cea9300cf65c))

## [8.0.0-rc.0](https://github.com/memori-ai/memori-react/compare/v7.34.2...v8.0.0-rc.0) (2025-08-07)


### Features

* add provider prop to Chat and ChatInputs components for TTS integration ([c362f9a](https://github.com/memori-ai/memori-react/commit/c362f9a759f087ef32f1965ad87483506ebf6c13))
* add text sanitization helper functions and useTTS hook for speech synthesis ([c6ab5cb](https://github.com/memori-ai/memori-react/commit/c6ab5cb23c2a7817d8065abf3be823e83e53f3ca))
* add TTS voice utility module with Azure and OpenAI voice configurations ([391efc6](https://github.com/memori-ai/memori-react/commit/391efc6d119996523eb856b63e2ec1c44e915929))


### Bug Fixes

* update fetch request in Memori to include tenant ID and set headers ([cbcad0a](https://github.com/memori-ai/memori-react/commit/cbcad0a5558c42e6d6d9e5e4cafe74d9edf36fd6))


### Maintenance

* update dependencies and add TTS module ([3e49360](https://github.com/memori-ai/memori-react/commit/3e49360dc7c8f48a594063cb925d22f40cea0582))


### Changes

* enhance viseme handling in useTTS and visemeContext for improved audio processing ([f6141c4](https://github.com/memori-ai/memori-react/commit/f6141c446f61314dd182eba47be34bcc8e169d44))
* replace speechKey state with provider state and update related API handling ([4fbdf5d](https://github.com/memori-ai/memori-react/commit/4fbdf5d146b958a3b34aa44a06f4ec3a171bfb5e))
* replaced old TTS logic useTTS hook and improve speech handling logic ([0b620d1](https://github.com/memori-ai/memori-react/commit/0b620d1b8356cab73f9bd8d05086ff0949692c60))
* simplify handleSpeak function and improve TTS integration ([a85f128](https://github.com/memori-ai/memori-react/commit/a85f128985ff72776b3fff0dd0a208bb747bb5b5))
* update speech key API to retrieve provider based on tenant ([84c2b97](https://github.com/memori-ai/memori-react/commit/84c2b97e89c1313096e7dcf6af11021179dc3829))

## [7.34.2](https://github.com/memori-ai/memori-react/compare/v7.34.1...v7.34.2) (2025-08-04)


### Bug Fixes

* constant import ([a75e6ea](https://github.com/memori-ai/memori-react/commit/a75e6ead875a17c65313cdbfbcb5d475d6a0a126))

## [7.34.1](https://github.com/memori-ai/memori-react/compare/v7.34.0...v7.34.1) (2025-08-04)


### Bug Fixes

* strip reasoning content from tts ([eaa5c02](https://github.com/memori-ai/memori-react/commit/eaa5c0279eaf081f81b1bce4ead3070ea5b23a61))

## [7.34.0](https://github.com/memori-ai/memori-react/compare/v7.33.4...v7.34.0) (2025-08-01)


### Features

* add multiple document upload functionality with validation and error handling ([8ada71b](https://github.com/memori-ai/memori-react/commit/8ada71b6b70176f22ade287da0c3f0b0b42d6813))
* add white listed domains filter from layout config ([3fe2522](https://github.com/memori-ai/memori-react/commit/3fe2522db8a0cfdb3ea2dea27e60178d2bf0866a))
* centralized error handling inside the UploadButton ([e5e06ca](https://github.com/memori-ai/memori-react/commit/e5e06ca244cc8e55a4bf0ba27f4f6f0027d086e7))
* implement server-side pagination for chat logs in ChatHistory component ([c3ad0ba](https://github.com/memori-ai/memori-react/commit/c3ad0baf08a5e00e613cb493b9a9a1c0364d7c63))


### Bug Fixes

* handle showChatWithNoHistory prop filter ([4003549](https://github.com/memori-ai/memori-react/commit/40035497490441cd0f661e59675b77db3fe2ab8d))


### Maintenance

* update [@memori](https://github.com/memori).ai/memori-api-client ([3267fc2](https://github.com/memori-ai/memori-react/commit/3267fc25bb4af2668cb621f7ab8ce520c289a7e1))
* update [@memori](https://github.com/memori).ai/memori-api-client--no-verify ([1600f2d](https://github.com/memori-ai/memori-react/commit/1600f2ddae7f4d2880c69ac1eecd3dc5e15134be))


### Changes

* comment out document and image count display logic in UploadButton ([8a32702](https://github.com/memori-ai/memori-react/commit/8a32702fef240cb9e6daa36928650c1a21de8c7b))
* remove existing images from document preview files in UploadDocuments component ([e7ce3fc](https://github.com/memori-ai/memori-react/commit/e7ce3fcc9ede323d6d7eb2febfffedc211594b8a))

## [7.33.4](https://github.com/memori-ai/memori-react/compare/v7.33.3...v7.33.4) (2025-07-29)


### Changes

* show multiple function cache results if present ([f00c104](https://github.com/memori-ai/memori-react/commit/f00c104030066a97b139511fdd758f30a3102fc8))

## [7.33.3](https://github.com/memori-ai/memori-react/compare/v7.33.2...v7.33.3) (2025-07-28)


### Changes

*  removed media handling inside the ChatBubble and kept it all inside Chat ([d916e53](https://github.com/memori-ai/memori-react/commit/d916e537a86ddd320e39bb0acf14a9b2582b15d2))

## [7.33.2](https://github.com/memori-ai/memori-react/compare/v7.33.1...v7.33.2) (2025-07-28)


### Bug Fixes

* update autoStart prop in Memori to allow undefined values ([096196d](https://github.com/memori-ai/memori-react/commit/096196d57b7158f1f084d45cf4042196dd4371c0))

## [7.33.1](https://github.com/memori-ai/memori-react/compare/v7.33.0...v7.33.1) (2025-07-28)


### Bug Fixes

* enhance autoStart logic in Memori to handle undefined cases and improve layout handling ([c0fa52f](https://github.com/memori-ai/memori-react/commit/c0fa52fea8dd7f3822a19747a4190134c459dc90))

## [7.33.0](https://github.com/memori-ai/memori-react/compare/v7.32.8...v7.33.0) (2025-07-25)


### Features

* add autoStart prop to MemoriWidget and update HiddenChatLayout logic ([6e95d46](https://github.com/memori-ai/memori-react/commit/6e95d46d659d9b09dc61d785b4848199d855b906))


### Bug Fixes

* remove <think> tags from message rendering in renderMsg function ([d8de4df](https://github.com/memori-ai/memori-react/commit/d8de4dfcb0db9f8e21d7d6d9ee2587e58d23363d))
* simplify autoStart logic in Memori and update HiddenChatLayout handling ([ff0ce3f](https://github.com/memori-ai/memori-react/commit/ff0ce3f42bbb0c03aee64a9efe675a98f73a5145))


### Changes

* show reasoning output based on config or prop ([1a0b683](https://github.com/memori-ai/memori-react/commit/1a0b683e5f6e312744488904dbdbedf6e8f0e4b4))
* update ChatBubble component to remove reasoning details and adjust message rendering ([2bb8800](https://github.com/memori-ai/memori-react/commit/2bb8800eda2745171702b0337bb2f9cc446f6e5a))

## [7.32.8](https://github.com/memori-ai/memori-react/compare/v7.32.7...v7.32.8) (2025-07-17)


### Features

* implement date range filtering for chat history ([2027a30](https://github.com/memori-ai/memori-react/commit/2027a3074d79f0e64782d02ceef6f2fba2cf2df4))
* sort chat history icon ([3c5eab1](https://github.com/memori-ai/memori-react/commit/3c5eab1eaafa4002f52a09b7969844d1156f62e1))


### Bug Fixes

* update privacy explanation based on authentication ([5c89e4e](https://github.com/memori-ai/memori-react/commit/5c89e4e132bb67748c120e09ec521766ad4c2ccb))
* update privacy policy link handling in StartPanel component ([c1ed644](https://github.com/memori-ai/memori-react/commit/c1ed644e4748e37a1cf6d07ce450f3278edc88cc))


### Maintenance

* add arrow icon, fix icon stories ([cfc58c8](https://github.com/memori-ai/memori-react/commit/cfc58c87a322c7faaf3b32033f4520d56bae4bd5))

## [7.32.7](https://github.com/memori-ai/memori-react/compare/v7.32.6...v7.32.7) (2025-07-15)


### Maintenance

* fix api client init, pass same instance down ([24a5113](https://github.com/memori-ai/memori-react/commit/24a5113f1607091cf9e3e7ad0dcb2e1e55af7318))

## [7.32.6](https://github.com/memori-ai/memori-react/compare/v7.32.5...v7.32.6) (2025-07-15)


### Bug Fixes

* enhance media rendering in ChatBubble to prevent duplicates and filter out non-media items ([9918d82](https://github.com/memori-ai/memori-react/commit/9918d828bff11b612b9a1f5e1be1a57bc07e7319))

## [7.32.5](https://github.com/memori-ai/memori-react/compare/v7.32.4...v7.32.5) (2025-07-11)


### Maintenance

* remove unused CSS import from MediaItemWidget ([a830dc9](https://github.com/memori-ai/memori-react/commit/a830dc9473ae53aff5a19dc0e45b56d644fa0239))

## [7.32.4](https://github.com/memori-ai/memori-react/compare/v7.32.3...v7.32.4) (2025-07-11)


### Features

* added attached media handling for resume chat ([5da312c](https://github.com/memori-ai/memori-react/commit/5da312c83ad9f05b1ea77c3999b627ed1f5b3ff6))


### Maintenance

* update error codes ([9368041](https://github.com/memori-ai/memori-react/commit/9368041e2fc3b684e16054c037cf37c3832057b3))

## [7.32.3](https://github.com/memori-ai/memori-react/compare/v7.32.2...v7.32.3) (2025-07-08)


### Bug Fixes

* alignment of the media items ([b17890d](https://github.com/memori-ai/memori-react/commit/b17890ddff229531a1e54f66c0a925814a0e1870))
* prevent duplicate snippet execution by checking dialog state before calling onClickStart ([0e550ee](https://github.com/memori-ai/memori-react/commit/0e550ee22bbe2016e3b83e6dd8399c7579c35b8a))


### Maintenance

* cleanup unused props ([f4ae85f](https://github.com/memori-ai/memori-react/commit/f4ae85f2175d3974e7c9de88f446971d822ca086))
* cleanup unused props ([53c421a](https://github.com/memori-ai/memori-react/commit/53c421aadf7d6a3d2f2561dea58e627b0a0b5970))


### Changes

* debug icon in chat bubble color, tests and stories ([54ba7d5](https://github.com/memori-ai/memori-react/commit/54ba7d5a4220a355a2c87688151c5631f2261730))

## [7.32.2](https://github.com/memori-ai/memori-react/compare/v7.32.1...v7.32.2) (2025-07-04)


### Bug Fixes

* totem layout sharing z-index ([2dab8a5](https://github.com/memori-ai/memori-react/commit/2dab8a522095d9044d1fe971da467a9d8750e82b))

## [7.32.1](https://github.com/memori-ai/memori-react/compare/v7.32.0...v7.32.1) (2025-07-04)


### Bug Fixes

* initial session inside chat with layout HIDDEN CHAT ([ba23ea1](https://github.com/memori-ai/memori-react/commit/ba23ea1d66bd4da337c69f07004af99eab93e1b7))


### Maintenance

* rename get tenant api ([eeeaa2b](https://github.com/memori-ai/memori-react/commit/eeeaa2b3f3cfefe7ba8fb3c881f37eaa0f7b8026))
* update api client ([9ab11a4](https://github.com/memori-ai/memori-react/commit/9ab11a4f04f2ac5442d8c7cf9ce0ccc03b88ee4f))

## [7.32.0](https://github.com/memori-ai/memori-react/compare/v7.31.1...v7.32.0) (2025-07-02)


### Features

* conditionally apply and save position based on memori.needsPosition flag ([cf73ae3](https://github.com/memori-ai/memori-react/commit/cf73ae362c878b9c4566b2a1329c582e155edee1))


### Bug Fixes

* translate typingText if useLoaderTextAsMsg with multilingual ([6833f59](https://github.com/memori-ai/memori-react/commit/6833f5967a47b877d9c003917b2084cb16715f1c))


### Maintenance

* cleanup replace backend url with proxy ([1c9ea7a](https://github.com/memori-ai/memori-react/commit/1c9ea7aea315c7e4c0ae891752f05378061ef211))

## [7.31.1](https://github.com/memori-ai/memori-react/compare/v7.31.0...v7.31.1) (2025-06-30)


### Maintenance

* **temp:** adopt cache proxy endpoint for backend ([00f5f42](https://github.com/memori-ai/memori-react/commit/00f5f42797f03a7eea0818be677cb18a3f69906b))

## [7.31.0](https://github.com/memori-ai/memori-react/compare/v7.30.6...v7.31.0) (2025-06-30)


### Features

* add support for rendering document attachments in messages with expandable details ([388b93f](https://github.com/memori-ai/memori-react/commit/388b93f871ba1a1a45ad050abd0aa597f30de216))


### Maintenance

* **temp:** adopt cache proxy endpoint for backend ([1c70b8b](https://github.com/memori-ai/memori-react/commit/1c70b8bfa5f13c80e80cf10e9a433bbd9f68ac97))

## [7.30.6](https://github.com/memori-ai/memori-react/compare/v7.30.5...v7.30.6) (2025-06-24)


### Features

* enhance avatar detection logic for custom avatars with dynamic morph target checks ([ad8d6b8](https://github.com/memori-ai/memori-react/commit/ad8d6b8a437dd04b668b8fdc26b673f2e73e9c7d))

## [7.30.5](https://github.com/memori-ai/memori-react/compare/v7.30.4...v7.30.5) (2025-06-18)


### Bug Fixes

* shared url parameters and baseURL ([5c8eb2d](https://github.com/memori-ai/memori-react/commit/5c8eb2dec938457ac5342d45b2f35f4c92630502))

## [7.30.4](https://github.com/memori-ai/memori-react/compare/v7.30.3...v7.30.4) (2025-06-18)


### Bug Fixes

* shared chat url with usernames as fallback or skip if none available ([549a95f](https://github.com/memori-ai/memori-react/commit/549a95fb54a6a73f86d704190979ebca023f227b))

## [7.30.3](https://github.com/memori-ai/memori-react/compare/v7.30.2...v7.30.3) (2025-06-18)


### Changes

* improve title calculation logic in ChatHistory component with significance scoring ([89a5c55](https://github.com/memori-ai/memori-react/commit/89a5c553663f566bd975a38fefb895fafc9602b4))

## [7.30.2](https://github.com/memori-ai/memori-react/compare/v7.30.1...v7.30.2) (2025-06-17)


### Features

* add download chat button and localization support in ChatHistoryDrawer ([2b5cb43](https://github.com/memori-ai/memori-react/commit/2b5cb43d55c75d1b021678f632af95d2301571ae))

## [7.30.1](https://github.com/memori-ai/memori-react/compare/v7.30.0...v7.30.1) (2025-06-17)


### Features

* add download chat button and localization support in ChatHistoryDrawer ([130524c](https://github.com/memori-ai/memori-react/commit/130524c6bb600cb51922cfae2336cfe27fa2b499))


### Changes

* enhance ChatHistoryDrawer with export functionality and new title handling ([5b1b5f4](https://github.com/memori-ai/memori-react/commit/5b1b5f4cd367afea75d1f14f320d9154d8fbaf7a))
* removed Export Chat Button form the Header component ([7ccd463](https://github.com/memori-ai/memori-react/commit/7ccd463ddebd0f3e9edb6104f8cf5bb35ce68e3e))
* removed unused .scss file for ChatHistory component and improved UX ([cc1910b](https://github.com/memori-ai/memori-react/commit/cc1910b4a09872d86fe410383192c726946c28f3))

## [7.30.0](https://github.com/memori-ai/memori-react/compare/v7.29.1...v7.30.0) (2025-06-17)


### Bug Fixes

* hidden chat opens session on click, delete session on nav away ([f95c804](https://github.com/memori-ai/memori-react/commit/f95c8041ba8f70dc6a34eca5473b58a5952f3fd4))

## [7.29.1](https://github.com/memori-ai/memori-react/compare/v7.29.0...v7.29.1) (2025-06-16)


### Bug Fixes

* locales and style for Chat History ([604a438](https://github.com/memori-ai/memori-react/commit/604a438474afd08777ec2fb50c76e6db6fbf0840))

## [7.29.0](https://github.com/memori-ai/memori-react/compare/v7.28.1...v7.29.0) (2025-06-16)


### Features

* add ChatHistoryDrawer component with API integration and styling ([3d3529f](https://github.com/memori-ai/memori-react/commit/3d3529fe811e729bf62dc1cb9968e71aaa3ebd4b))
* add ChatHistoryDrawer component with storybook stories and tests ([ff68960](https://github.com/memori-ai/memori-react/commit/ff689606ddfb59d6cd794f4d001062e9409cb3f7))
* add ChatRound icon component and enhance History icon with disabled state styling ([5c97dda](https://github.com/memori-ai/memori-react/commit/5c97ddaac594e55242e1a319538e50cbe91bcd5f))
* add isHistoryView prop to Chat component ([05f2730](https://github.com/memori-ai/memori-react/commit/05f2730a5bc901df5dbeedcc012427d48b36549b))
* add onClick prop to Card component and update styles for pointer cursor ([88cf6bb](https://github.com/memori-ai/memori-react/commit/88cf6bb4544b2f72c8f7b0fec8a916a5565c2c7f))
* add privacy explanation section to StartPanel with localized text and styling ([48e5b30](https://github.com/memori-ai/memori-react/commit/48e5b30c385460464d888d832c3596054769b04b))
* add showChatHistory prop to Memori component for chat history visibility ([9fd1f95](https://github.com/memori-ai/memori-react/commit/9fd1f9559369a55a49223ba2ba29a033a716a517))
* add WithChatHistory story to showcase chat history functionality ([335a3db](https://github.com/memori-ai/memori-react/commit/335a3dbe26680310b06062b8c1033612b587a766))
* enhance chat history search functionality and improve chat log display in ChatHistoryDrawer ([939bc5d](https://github.com/memori-ai/memori-react/commit/939bc5d9ef6e5c569992151136663d045e212fe5))
* enhance chat history search functionality and improve chat log display in ChatHistoryDrawer ([c871926](https://github.com/memori-ai/memori-react/commit/c871926e0020a526c72a0c04177cc970fc096251))
* enhance Header component with chat history button and tooltip integration ([f6cdfe1](https://github.com/memori-ai/memori-react/commit/f6cdfe14fbdf63e3bb82dff295121b791da3107b))
* implement chat history pagination and enhance chat log display in ChatHistoryDrawer ([6bfdcc1](https://github.com/memori-ai/memori-react/commit/6bfdcc18e331ae8c933c0446a7c074cfb252b730))
* implement resume chat functionality in ChatHistoryDrawer with updated UI elements ([200c456](https://github.com/memori-ai/memori-react/commit/200c45684cc5665217669ef0aeb5ac82faf451e5))
* improved UI of Chat History component ([210ef22](https://github.com/memori-ai/memori-react/commit/210ef223c67c7ec2f17f7847ab0952c4037c06af))
* integrate chat history functionality into Header and MemoriWidget components ([830a4c7](https://github.com/memori-ai/memori-react/commit/830a4c75e9b3f0a88ce5c2fa4ce8e2d1eb8322c2))
* integrate ChatHistoryDrawer styles and implement pagination for chat logs ([4975190](https://github.com/memori-ai/memori-react/commit/4975190ac6c24e4b6bcf237129474470961e3e9a))
* pass memori prop to MemoriWidget for enhanced functionality ([ff64219](https://github.com/memori-ai/memori-react/commit/ff64219ddbb7d59e50599ee35f067df183640fb0))
* reopening chat session with new flag 'continueFromChatLogID' ([26029ec](https://github.com/memori-ai/memori-react/commit/26029ec2a40ea3af7d024039250a4d8052264e64))
* update chat resume functionality in ChatHistoryDrawer and adjust initial state in MemoriWidget ([cbc78b6](https://github.com/memori-ai/memori-react/commit/cbc78b61f82ea9515eeb7b6523fcdf5535367bcb))


### Bug Fixes

* center align loading and no results messages in VenueWidget and removed kated props ([9f84fae](https://github.com/memori-ai/memori-react/commit/9f84faed5cca8aeb2ae5f9ecfdf9467883054a81))
* correct text formatting in chat resume messages and update button label in ChatHistoryDrawer ([564e40d](https://github.com/memori-ai/memori-react/commit/564e40dc6cd8f9d90dd57a804cc6068853f60285))
* spinner loading chat style ([addc05b](https://github.com/memori-ai/memori-react/commit/addc05b713f5ea42b3c5f0ac3bee21a403538750))
* update color variables and improve loading spinner in ChatHistoryDrawer ([86b5126](https://github.com/memori-ai/memori-react/commit/86b5126baddc43dff490a4a4dfd4ff06bd2a5d9f))


### Maintenance

* update [@memori](https://github.com/memori).ai/memori-api-client to version 6.0.3 in package.json and yarn.lock ([a6e80e4](https://github.com/memori-ai/memori-react/commit/a6e80e4ed12794c1b274a8154e9f398e35bde7a2))
* update dependencies in package.json and yarn.lock for improved stability and performance ([e6f3023](https://github.com/memori-ai/memori-react/commit/e6f30233eef242604d265159c595178b0cb0cc75))


### Changes

* comment out chat log reference retrieval in ChatHistory component ([e3f68fa](https://github.com/memori-ai/memori-react/commit/e3f68fa91c2fa22e5f248f282a77739503407fd3))
* fix session chat log retrieval in ChatHistory component ([8a55462](https://github.com/memori-ai/memori-react/commit/8a554626755f6921e1c8c3b4c69d2f7b639cffb6))
* simplify resumeSession parameters in ChatHistoryDrawer ([4e6de0a](https://github.com/memori-ai/memori-react/commit/4e6de0a65caf2b984af9ab7494a82d5512ffd2be))

## [7.28.1](https://github.com/memori-ai/memori-react/compare/v7.28.0...v7.28.1) (2025-06-13)


### Bug Fixes

* share chat link props ([0561153](https://github.com/memori-ai/memori-react/commit/05611536a1812ebf38f2dce5548a434d810ce8fc))

## [7.28.0](https://github.com/memori-ai/memori-react/compare/v7.27.1...v7.28.0) (2025-06-11)


### Features

* added unlogged images upload ([0697bfe](https://github.com/memori-ai/memori-react/commit/0697bfe61ad063f71eccde7270ffac47f91d8c3c))


### Bug Fixes

* autoStart default for hidden chat layout ([c0e2f8c](https://github.com/memori-ai/memori-react/commit/c0e2f8cbe333d93216637fa963de5842f3edb5fb))
* for Hidden Chat layout removed session init ([c81de97](https://github.com/memori-ai/memori-react/commit/c81de970be9a97320f411bc31e9d4189ff5f1484))


### Maintenance

* update [@memori](https://github.com/memori).ai/memori-api-client to version 6.5.5 ([f1388dd](https://github.com/memori-ai/memori-react/commit/f1388ddedc3f4a90c82d6f8421674834b1ac68bd))

## [7.27.1](https://github.com/memori-ai/memori-react/compare/v7.27.0...v7.27.1) (2025-06-11)


### Features

* add onClickStart prop to MemoriWidget and trigger on sidebar open in HiddenChat ([05df27d](https://github.com/memori-ai/memori-react/commit/05df27dcda4860495086ff7ee5e553691c1f0351))
* added new lines before and after the content of the <document_attachment /> ([ad5bf12](https://github.com/memori-ai/memori-react/commit/ad5bf12864e33c92fbf96d63212d5082e0371f22))


### Bug Fixes

* reasoning tag <think> regex ([f7f0c22](https://github.com/memori-ai/memori-react/commit/f7f0c2258429da5646c5faee3b0fcf55562a4228))

## [7.27.0](https://github.com/memori-ai/memori-react/compare/v7.26.2...v7.27.0) (2025-06-10)


### Features

* add reasoning tag <think> formatted display ([20d61c7](https://github.com/memori-ai/memori-react/commit/20d61c7c3bb08a85a7d93f9a56dbd7a1dc0a4459))
* share chat link in share button ([53d33f5](https://github.com/memori-ai/memori-react/commit/53d33f59e58db690e92780fabd76eadd829ae840))


### Bug Fixes

* remove double fullscreen buttons in hidden chat layout ([a60e811](https://github.com/memori-ai/memori-react/commit/a60e8118c3ea12f9858498f10f39848a6c3bc494))


### Maintenance

* prevent errors server side ([de5203e](https://github.com/memori-ai/memori-react/commit/de5203e8f1933ed27101ead3a8f0d71510e98d9f))

## [7.26.2](https://github.com/memori-ai/memori-react/compare/v7.26.1...v7.26.2) (2025-05-26)


### Features

* add autoStart prop to HiddenChat component ([f0381ec](https://github.com/memori-ai/memori-react/commit/f0381ec13d29886b58c3d95a90ef4b42e7b96972))


### Changes

* removed initChat function from HiddenChatLayout ([c52c492](https://github.com/memori-ai/memori-react/commit/c52c492cbd7eb017f83f1d9abcf71530478443d8))

## [7.26.1](https://github.com/memori-ai/memori-react/compare/v7.26.0...v7.26.1) (2025-05-23)


### Bug Fixes

* add RTL support to MediaWidget link items ([afea49c](https://github.com/memori-ai/memori-react/commit/afea49c06716e24d0a2c570283278544f0bc5142))
* aligned user media items to the right ([790031d](https://github.com/memori-ai/memori-react/commit/790031dec51455e5f8df5cb69face522ac54af22))
* enabled upload documents for unauthenticated users ([88c7cc8](https://github.com/memori-ai/memori-react/commit/88c7cc892c729269ed4a80b2da0f40cf5cb6ecc6))
* for MediaItemWidget with modal preview for document content ([f6e5d3b](https://github.com/memori-ai/memori-react/commit/f6e5d3b131f68b83741980a2e6ae78c920f0a721))
* prevent scrolling while rendering MathJax ([cec210a](https://github.com/memori-ai/memori-react/commit/cec210aad3d2d4f4bb98d1c954f5ddb064a15398))
* prevent user to upload multiple images and fix style button Cancel ([d084675](https://github.com/memori-ai/memori-react/commit/d0846758cda3346e10234f3d9acbbef8df70ce52))


### Changes

* improve XML formatting and readability in UploadButton component ([1842018](https://github.com/memori-ai/memori-react/commit/18420185387dce24f928918c5c3f6eed2d45ad16))

## [7.26.0](https://github.com/memori-ai/memori-react/compare/v7.25.1...v7.26.0) (2025-05-21)


### Features

* add function cache modal and debug button in ChatBubble component ([64d65d0](https://github.com/memori-ai/memori-react/commit/64d65d0bced4ac2e8b14ce6dc3732fae25ec7426))
* add multi-language support for upload functionality in locales ([a0dddc5](https://github.com/memori-ai/memori-react/commit/a0dddc5b7b0102fb70129d288bca8fa5b3d0cf9a))
* add new Document, Image, Preview, and Upload icons components ([0a93941](https://github.com/memori-ai/memori-react/commit/0a93941ca6364b88e6736701ab9923677a544e00))
* add showFunctionCache prop to Chat, ChatBubble, and MemoriWidget components ([6dc9107](https://github.com/memori-ai/memori-react/commit/6dc9107d2a68d90de3051de93e7fbd9891bcc7dc))
* add WithFunctionCache story to ChatBubble ([5b638a0](https://github.com/memori-ai/memori-react/commit/5b638a0bca964bc951d741b1787c9a4d2d5a325b))
* added images deselection functionality integrated with API ([f03cda6](https://github.com/memori-ai/memori-react/commit/f03cda6e17baf3d041688ab4e06f3a220b25d119))
* enhance FilePreview component to support image and document previews ([0d1dffc](https://github.com/memori-ai/memori-react/commit/0d1dffc315a3f74d69f5708f661322d55fa57910))
* enhance UploadButton with image count indicator and improved upload menu styling ([c141517](https://github.com/memori-ai/memori-react/commit/c141517823b725cb48a0c640d876f24573bcc694))
* implement fullscreen functionality for hidden chat layout and fixed reopening chat ([1158775](https://github.com/memori-ai/memori-react/commit/1158775fe8cc904dcf01c9350095f8fcf35cd2c6))
* implement image title input and preview modal in upload functionality ([a1358c1](https://github.com/memori-ai/memori-react/commit/a1358c144fed1f76370423ffe12812e4c9427892))
* integrate preview file management in Chat components ([6349fed](https://github.com/memori-ai/memori-react/commit/6349fedbad42c1977194e897280fbd6b0d58cb86))


### Bug Fixes

*  localization strings ([d98f091](https://github.com/memori-ai/memori-react/commit/d98f0913d4f7f324fde504c16ec342a1878b04ed))
*  preview medium file for documents and images ([7b28cd0](https://github.com/memori-ai/memori-react/commit/7b28cd0d8b0abe53c2d104444be65a7d5722fea1))
* add modal import ([8d9bd4a](https://github.com/memori-ai/memori-react/commit/8d9bd4acc4f7e4688a598e5d89038c4ab14cb3e7))
* ensure preview files are set before sending messages ([f03b834](https://github.com/memori-ai/memori-react/commit/f03b834952159540539c425f0abee99d22960302))
* lint ([6891c1f](https://github.com/memori-ai/memori-react/commit/6891c1f6d0eb83c7da97cf5c851ee02352aded4f))
* only one document can be uploaded per message ([4102f2f](https://github.com/memori-ai/memori-react/commit/4102f2f7c2c2b6ae2a0eaca0f252692b8c87b73a))
* update document upload button to correctly limit non-image file uploads ([210a258](https://github.com/memori-ai/memori-react/commit/210a258ba63f2b847aa9c563ab075ad1e0f2a62e))
* update engineURL to production and refactor boolean properties in story configurations ([14c2622](https://github.com/memori-ai/memori-react/commit/14c2622da8a7d0be91b4e027486ebff48d8e1f03))


### Changes

* improve UploadButton component structure and error handling ([d51e1fe](https://github.com/memori-ai/memori-react/commit/d51e1fe158a6b68029f9101b9f2e4ecc729a7b2d))
* update UploadButton component to support document and image uploads ([2809dfc](https://github.com/memori-ai/memori-react/commit/2809dfc7200dc50ecfd9d8946d5048e8f29261f5))

## [7.25.1](https://github.com/memori-ai/memori-react/compare/v7.25.0...v7.25.1) (2025-05-13)


### Bug Fixes

* show login if requiredLoginToken enabled ([174722d](https://github.com/memori-ai/memori-react/commit/174722d10e37b4b953290c8e8e8b8ee772e66adc))

## [7.25.0](https://github.com/memori-ai/memori-react/compare/v7.24.0...v7.25.0) (2025-05-07)


### Features

* support for login-required sessions ([631388a](https://github.com/memori-ai/memori-react/commit/631388afa101d4b41d29feff1e0880a4b924e32f))

## [7.24.0](https://github.com/memori-ai/memori-react/compare/v7.23.1...v7.24.0) (2025-04-28)


### Features

* add WithExpandable story to Chat component and update snapshots for expandable chat bubbles ([ec0e37f](https://github.com/memori-ai/memori-react/commit/ec0e37f1ddb18a7fb6e178a4e9908aefe1b7e30f))
* enhance Expandable component with character and word limit options ([31b7e07](https://github.com/memori-ai/memori-react/commit/31b7e07818b9e358931b693a43b705ba6cc4f608))
* enhance XLSX file parsing and formatting in UploadButton component ([419d866](https://github.com/memori-ai/memori-react/commit/419d8669f74fe6ea9bc6d345b0c213c6092c0cd1))
* integrate Expandable component in ChatBubble and WhyThisAnswer for improved text display ([0509d65](https://github.com/memori-ai/memori-react/commit/0509d6574eae7aeb94b3eb0fda4f1577fe1159b9))


### Bug Fixes

* update default provider from OpenAI to Anthropic in CompletionProviderStatus component ([7a1847c](https://github.com/memori-ai/memori-react/commit/7a1847c9cce921d6763146a72f19bebfe16680e0))


### Changes

* add loginToken in getMemoriState ([f12f67c](https://github.com/memori-ai/memori-react/commit/f12f67cf16ad8590d9636ccfd1d8346bd2a652d9))
* allow markdown as text upload ([546ba42](https://github.com/memori-ai/memori-react/commit/546ba424b63ecf533f1ed136504a2b752b9ab278))
* expandable fix overflow + add stories ([9332bb5](https://github.com/memori-ai/memori-react/commit/9332bb592973292542a933fef9d9396073cd7385))
* remove unnecessary concatenation in truncateMessage function ([7e1aacf](https://github.com/memori-ai/memori-react/commit/7e1aacf4956f0aa2959635af52a5c238edbf14da))
* truncate user messages ([a181614](https://github.com/memori-ai/memori-react/commit/a1816140c550a47c2c5dcc8476545aed5a2118b7))


### Maintenance

* expandable remove debug text, fix colors and css ([91175e1](https://github.com/memori-ai/memori-react/commit/91175e1206f0048c53b3b3795a18f634205bae95))
* switch state media to emittedMedia, with fallback ([f1d78ab](https://github.com/memori-ai/memori-react/commit/f1d78ab536244b4d689a87e095dbec6e010802b8))
* update api client ([46ed9d9](https://github.com/memori-ai/memori-react/commit/46ed9d90952dfe24562a48523cce28eb018731da))

## [7.23.1](https://github.com/memori-ai/memori-react/compare/v7.23.0...v7.23.1) (2025-04-08)


### Bug Fixes

* baseurl from tenant protocol parsing accepts local http ([d1d595a](https://github.com/memori-ai/memori-react/commit/d1d595a7572444584ecedfa5de072795dffaa0e2))
* drawer z-index ([e28ec3f](https://github.com/memori-ai/memori-react/commit/e28ec3f960c9d25d99c405f8d94fe4e26e3e5fd8))


### Maintenance

* add new error code from backend/assets ([e43e834](https://github.com/memori-ai/memori-react/commit/e43e834185719f5665ff82fdd4f269c1ebb514be))

## [7.23.0](https://github.com/memori-ai/memori-react/compare/v7.22.0...v7.23.0) (2025-03-25)


### Features

* add ConfirmDialog component with styling and stories ([fcd51da](https://github.com/memori-ai/memori-react/commit/fcd51dad2ebff94e2d262bde4c798db40c5d5d5e))
* add confirmDialogTitle and confirmDialogMessage props ([0869a65](https://github.com/memori-ai/memori-react/commit/0869a65af4687b6a0f9546322646f63bf2990644))
* add localized messages for completion provider outages and degraded performance ([e712b31](https://github.com/memori-ai/memori-react/commit/e712b31c15be9bd238eb5b136a10dbf94c094e8a))
* add new Alert and Info icons, update Warning icon for improved accessibility and styling ([5af4ee8](https://github.com/memori-ai/memori-react/commit/5af4ee80b1988c5dc347a7f2435b5cef30641416))
* enhance CompletionProviderStatus component, improved status handling and visual feedback ([a0da536](https://github.com/memori-ai/memori-react/commit/a0da5363799e359255f02a3521c1e27a00daeebb))
* refactored Drawer component with advanced features and improved UX ([729d188](https://github.com/memori-ai/memori-react/commit/729d188b1ddf9fdf97584309359813b8dd88f77a))
* show typing text after 30s ([4b53e75](https://github.com/memori-ai/memori-react/commit/4b53e756c782b73d9c5b67d24988c0bcf7e921f6))
* standardize confirm dialog translations across locales ([60f380d](https://github.com/memori-ai/memori-react/commit/60f380dca44dda46d6d30b993561234dcf84cd85))


### Bug Fixes

* correct CSS variable naming in Drawer component for consistent styling ([a5cf788](https://github.com/memori-ai/memori-react/commit/a5cf7881a2686fbeca4322f915349b65c510cafa))
* lint ([85e2466](https://github.com/memori-ai/memori-react/commit/85e2466229d46d9d0d50bc6ea4484b0cc649a821))
* remove deprecated API component names from CompletionProviderStatus ([68ff1ae](https://github.com/memori-ai/memori-react/commit/68ff1ae94a145e1d6e75520125a27295877af809))


### Changes

* enhance Drawer component with improved footer structure and content handling ([4b22245](https://github.com/memori-ai/memori-react/commit/4b22245c87c760c34c42a8696f21025102f47dbd))
* i18n and styles import ([c3ee4b3](https://github.com/memori-ai/memori-react/commit/c3ee4b333d66ef9c46acb3bb541dae02f6edff0e))
* improve ConfirmDialog and Drawer components with enhanced z-index management and state handling ([4b6554f](https://github.com/memori-ai/memori-react/commit/4b6554f58a3adca7d4aef68c4e544a4063d4570a))
* optimize Drawer stories and translations for confirmation dialog ([26b303c](https://github.com/memori-ai/memori-react/commit/26b303cb5fff849839131bbec97a61d521a82271))
* remove ConfirmDialog from Drawer component ([95a1036](https://github.com/memori-ai/memori-react/commit/95a10368ede07a57d36c18ed7dc8c22f960021e4))
* remove console logs and simplify Drawer component logic ([39f8a78](https://github.com/memori-ai/memori-react/commit/39f8a78678481e166b35f9d82979b7e2f97a0d49))
* simplify translation namespace in Drawer confirmation dialog ([981df76](https://github.com/memori-ai/memori-react/commit/981df769ff6f32311c9f4af386e3bb568f4cd706))


### Maintenance

* replace default typing sentences ([fe50410](https://github.com/memori-ai/memori-react/commit/fe504108f62d39bd0e69fdb0d603b18ffca5d4f5))
* typing text timeout timespans ([8e3e3cf](https://github.com/memori-ai/memori-react/commit/8e3e3cf6c7434c7c07a3beae046559676e64b541))

## [7.22.0](https://github.com/memori-ai/memori-react/compare/v7.21.1...v7.22.0) (2025-03-21)


### Features

* add privacy explanation section to StartPanel with tooltip and translations ([1f214b7](https://github.com/memori-ai/memori-react/commit/1f214b719e77e3c2d4df9de340806042b99e01d1))
* enhance UploadButton to support XLSX and CSV file uploads with improved error handling ([574a47c](https://github.com/memori-ai/memori-react/commit/574a47c273c1445ef8426cb7db8054279fff49fd))


### Maintenance

* align text privacy tooltip startpanel ([1f539eb](https://github.com/memori-ai/memori-react/commit/1f539ebd8e3f93bfb2c5aea9b935b180e7ce1070))


### Changes

* upload accpets json ([49a76fa](https://github.com/memori-ai/memori-react/commit/49a76faa19cc85c5b2b828bfb65f7cb2f2d81687))

## [7.21.1](https://github.com/memori-ai/memori-react/compare/v7.21.0...v7.21.1) (2025-03-20)


### Bug Fixes

* chat bubble headings color inherit ([4b342df](https://github.com/memori-ai/memori-react/commit/4b342df452a66422d7d6d8b5118895a907b98f1b))

## [7.21.0](https://github.com/memori-ai/memori-react/compare/v7.19.2...v7.21.0) (2025-03-17)


### Features

* added AnimationLoader for flexible avatar animation management ([d0837a1](https://github.com/memori-ai/memori-react/commit/d0837a1d2e94a6ae898a12ed86258fb844425919))
* added AnimationParser for advanced avatar animation parsing ([f66daf2](https://github.com/memori-ai/memori-react/commit/f66daf20f7d2de994a240b91f8b31188b2b73e5d))
* create AnimationRegistry for centralized avatar animation management ([0c735ef](https://github.com/memori-ai/memori-react/commit/0c735ef87e00bfd57efcdce20a99017e2992faa5))
* enhance WhyThisAnswer component with receiver details and context variables ([5251cb1](https://github.com/memori-ai/memori-react/commit/5251cb195f2cbe8da6a8867ed13abb2843a25dba))
* implement AnimationStateMachine for advanced avatar animation control ([1aefb00](https://github.com/memori-ai/memori-react/commit/1aefb00129bc6c5bce01308c71bca56f3a8ab285))
* implement AvatarAnimator as comprehensive animation management system ([3049ef7](https://github.com/memori-ai/memori-react/commit/3049ef77125a1b5986b00029f8a3366594e1984e))
* improve RPM avatar detection and animation merging logic ([1e86edb](https://github.com/memori-ai/memori-react/commit/1e86edb8c294d3a59e4223a3a654077fc3de5f95))


### Bug Fixes

* improve AvatarAnimator idle and animation transition logic ([ee797aa](https://github.com/memori-ai/memori-react/commit/ee797aa51a6fc0b452ef518d2afeccaa71fb7776))
* improve receiver display logic and ensure context variables are handled correctly ([6ce1227](https://github.com/memori-ai/memori-react/commit/6ce12273974eaeeb0618769e50e4726c24cc95e3))
* improve speech-to-text processing state management ([cfe9f4a](https://github.com/memori-ai/memori-react/commit/cfe9f4a18fc3dd43ba80b397d7c4965c37164b63))


### Changes

* adjust emotion amplification and remove debug logging in MorphTargetController ([4af0a70](https://github.com/memori-ai/memori-react/commit/4af0a70ba23bc4b4dfc204008ffb4c0bdee82692))
* enhance AvatarAnimator with advanced animation management ([3cda44c](https://github.com/memori-ai/memori-react/commit/3cda44c679390fd5fe71befc18af571358a81bcd))
* enhance AvatarAnimator with advanced emotion and sequence handling ([f1e8f63](https://github.com/memori-ai/memori-react/commit/f1e8f630c324cbf2e41583da15c10fdd14a795c0))
* enhance MorphTargetController with dynamic emotion processing ([2fd8c2e](https://github.com/memori-ai/memori-react/commit/2fd8c2e34acfed487ffe0c1bdcd14c8a50049d35))
* enhance speech processing with robust message handling ([1a1370f](https://github.com/memori-ai/memori-react/commit/1a1370f2c600223aa6911b27e72dc5a389939b1b))
* improve emotion mapping and processing in MorphTargetController ([4a49461](https://github.com/memori-ai/memori-react/commit/4a49461985217f382d355883f9d52f7d15f7414d))
* improve speech recognition ([c6d1a1c](https://github.com/memori-ai/memori-react/commit/c6d1a1ca39e42e8c6636aeb4d00772946a8463e6))
* optimize AvatarAnimator with advanced transition and sequence handling ([1f67479](https://github.com/memori-ai/memori-react/commit/1f674795dcb85f5a14d419426f324ac2f70e615d))
* simplify AvatarView component and remove unused animation-related props ([d84dbc0](https://github.com/memori-ai/memori-react/commit/d84dbc0e3c19a19c2bbcbfbab3d647998c658e34))
* simplify DynamicShadow component with AvatarAnimator integration ([71c0991](https://github.com/memori-ai/memori-react/commit/71c09917b11baa96a252ff75882be3785f266f30))
* streamline HalfBodyAvatar component with simplified morph target and chat handling ([8d68795](https://github.com/memori-ai/memori-react/commit/8d687959c52056a4e01f3aa74e025a7567424405))
* upload button accepts pdf, txt and json ([36d8c65](https://github.com/memori-ai/memori-react/commit/36d8c65d9a7ace9399527b93cc36089c28a709d8))
* why this answer i18n, ui and styles ([18292dc](https://github.com/memori-ai/memori-react/commit/18292dce56d9609ae56525a50f44503c762abeda))


### Maintenance

* generated by ai label in chat with fallback ([f28199b](https://github.com/memori-ai/memori-react/commit/f28199be65f9ea010ef6c9b3c6bc6eb5700fb669))
* update api client ([8ab1bfd](https://github.com/memori-ai/memori-react/commit/8ab1bfd9cee3d486155bb053226666621e0aa295))
* update Storybook stories with new avatar configurations and layouts ([749c57a](https://github.com/memori-ai/memori-react/commit/749c57a3cae69edadf032240a5d7b3fd36afe213))
* update Storybook stories with test scenarios for RPM avatar animations and layouts ([b61a063](https://github.com/memori-ai/memori-react/commit/b61a063f6607d1216fcd7e967e60149f888ba51f))

## [7.19.2](https://github.com/memori-ai/memori-react/compare/v7.19.1...v7.19.2) (2025-03-07)


### Bug Fixes

* handle position requirement before auto-starting memori ([1b1948d](https://github.com/memori-ai/memori-react/commit/1b1948ded9d773c0fb280623998f0f250f0f7015))


### Changes

* tenant types from backend, remove customizations from dashboard ([9aa6deb](https://github.com/memori-ai/memori-react/commit/9aa6deb8d9b46124154a516c49435ecce9cd90a5))

## [7.19.1](https://github.com/memori-ai/memori-react/compare/v7.19.0...v7.19.1) (2025-03-06)


### Bug Fixes

* prevent set instruct on pending sessions ([fcbc7c0](https://github.com/memori-ai/memori-react/commit/fcbc7c07a83c4cf7c563cca234db6e6f62558f89))

## [7.19.0](https://github.com/memori-ai/memori-react/compare/v7.18.0...v7.19.0) (2025-03-05)


### Features

* optimize Avatar Canvas rendering performance ([7147cb2](https://github.com/memori-ai/memori-react/commit/7147cb209a31814828b7bdb19a35aa83ce8ad09e))


### Bug Fixes

* make showShare and showSettings optional props with default values ([ca33292](https://github.com/memori-ai/memori-react/commit/ca33292f4cc9485b1e06ef2ff2664ec538680814))

## [7.18.0](https://github.com/memori-ai/memori-react/compare/v7.17.2...v7.18.0) (2025-02-26)


### Features

* enhance MathJax rendering and initialization in ChatBubble ([3fe76f5](https://github.com/memori-ai/memori-react/commit/3fe76f54d163ebe14b9c46ccf6f2cb80719b1de6))


### Bug Fixes

* add showSettings prop from integrationConfig ([d6fe636](https://github.com/memori-ai/memori-react/commit/d6fe6362f6f5e0ae8cf93501137fdee1e197c5c1))
* ja zh lang labels ([cb16897](https://github.com/memori-ai/memori-react/commit/cb16897dd53af1de86a8b429f66a0e56277f7123))
* revert ChatTextArea CSS for better responsiveness and styling ([69a3199](https://github.com/memori-ai/memori-react/commit/69a3199916d8a1493b5b57e435c240efd08b677e))


### Changes

* expand textarea more ([c1e09ce](https://github.com/memori-ai/memori-react/commit/c1e09ce439c9ce314e37102d727e5ccc201d53f1))
* use useLayoutEffect for MathJax rendering ([e75676d](https://github.com/memori-ai/memori-react/commit/e75676d2a73f1524ec5d2dd04f7ab91cb6e8d0b5))

## [7.17.2](https://github.com/memori-ai/memori-react/compare/v7.17.1...v7.17.2) (2025-02-25)


### Bug Fixes

* double backslashes for LaTeX parsing ([b81a2a8](https://github.com/memori-ai/memori-react/commit/b81a2a8e5d1dfcda27c9a7e405b4befd30ac63d3))
* improve fullscreen handling ([5d0f350](https://github.com/memori-ai/memori-react/commit/5d0f3500f9d00737b778a9f9de2ccffb7d5440b0))
* prevent start session loops on error ([13032a9](https://github.com/memori-ai/memori-react/commit/13032a9f2c05366ceeb21501ae75c17752f7797d))


### Changes

* improve markdown rendering and math formatting in ChatBubble ([df93671](https://github.com/memori-ai/memori-react/commit/df93671a953309db0b100c4ccbbf2752b1be5a64))


### Maintenance

* update api client ([6bacc0b](https://github.com/memori-ai/memori-react/commit/6bacc0bd11fb2c7db40d39bf19be6175cedf2770))

## [7.17.1](https://github.com/memori-ai/memori-react/compare/v7.17.0...v7.17.1) (2025-02-20)


### Bug Fixes

* ja zh lang labels ([07e9d05](https://github.com/memori-ai/memori-react/commit/07e9d05815d60b387eafbd1bd86b6b790fa3948a))

## [7.17.0](https://github.com/memori-ai/memori-react/compare/v7.16.2...v7.17.0) (2025-02-17)


### Features

* add customizable lighting component for avatar rendering ([e362cb4](https://github.com/memori-ai/memori-react/commit/e362cb4f626d4b3b1784c8b2a19497b4a63d1777))
* disable continuous speech when speaker is muted ([663fd94](https://github.com/memori-ai/memori-react/commit/663fd94ee782cbc79a0f10ec400e9736c082b866))
* enhance PDF text extraction with PDF.js fallback and dynamic file type support ([25964c7](https://github.com/memori-ai/memori-react/commit/25964c7730cf9ace1e10a41778f2e1faebd4de3f))


### Bug Fixes

* improve continuous speech and listening conditions ([ee74480](https://github.com/memori-ai/memori-react/commit/ee74480ed5d3dfdef433bf07711d4af22093e6c3))
* speak on autostart ([b0d9917](https://github.com/memori-ai/memori-react/commit/b0d9917d8a13b410d92dc7c3853e3b5bad5c0755))


### Maintenance

* remove ConvertAPI dependency and simplify file processing ([ff55006](https://github.com/memori-ai/memori-react/commit/ff5500668a631ae3bdb4b14893d6faf9022f0be5))


### Changes

* enhance Slider and PositionControls UI styling and responsiveness ([adc3ff7](https://github.com/memori-ai/memori-react/commit/adc3ff7a43098bd4e4efe1d4af7727dba048fb7c))
* enhance speech recognition and audio handling logic ([c616547](https://github.com/memori-ai/memori-react/commit/c616547c709e70d461fddb180bcbd08ae1446b6d))
* fine-tune avatar lighting parameters for improved visual quality ([7642549](https://github.com/memori-ai/memori-react/commit/7642549ef44275b209b20a62f3ee6492a8452db2))
* fine-tune viseme timing parameters for smoother lip movements ([1797582](https://github.com/memori-ai/memori-react/commit/17975824f7627e7c64b0b94f977dc3411c537980))
* improve ChatTextArea CSS for better responsiveness and styling ([ec70a5e](https://github.com/memori-ai/memori-react/commit/ec70a5e09a2a2a214ec4c53a5f8517675e700e01))
* improve speech recognition error handling and processing logic ([a33f7d8](https://github.com/memori-ai/memori-react/commit/a33f7d843d91fcef23edefb8265dcde81ee0ea5d))
* initial muteSpeaker value with autoStart + birth date fallbacks ([4a8e3a6](https://github.com/memori-ai/memori-react/commit/4a8e3a624e6d11a7ce8c7a51a20c7a4d3fe88108))
* optimize speech recognition and audio handling ([653d503](https://github.com/memori-ai/memori-react/commit/653d503b28ece5bbfac8bda6f0167d2eeb5cdc73))
* show typing while sending initial question with previous session ([6186353](https://github.com/memori-ai/memori-react/commit/618635369271f0fb7be46024bde064367c0a71bf))

## [7.16.2](https://github.com/memori-ai/memori-react/compare/v7.16.1...v7.16.2) (2025-02-10)


### Bug Fixes

* improve speech key fetching and audio enabling logic ([f6ea5e2](https://github.com/memori-ai/memori-react/commit/f6ea5e2f23e0316b70702661670a487572cda07c))


### Changes

* send initial question with previous session with empty history ([1a6ff68](https://github.com/memori-ai/memori-react/commit/1a6ff6838c19a2099da4bfe224150718d794fd6f))


### Maintenance

* remove AZURE_COGNITIVE_SERVICES_TTS_KEY as prop ([06ee821](https://github.com/memori-ai/memori-react/commit/06ee821d309532941121c949badeb6f9d3a6d297))
* update api client ([a97c44e](https://github.com/memori-ai/memori-react/commit/a97c44e4ac052135b2e515aa36c76424bdf729b5))

## [7.16.1](https://github.com/memori-ai/memori-react/compare/v7.16.0...v7.16.1) (2025-01-31)


### Bug Fixes

* opening session current tag check + history ([adc90f9](https://github.com/memori-ai/memori-react/commit/adc90f9a0c1e7414ec24a55a19d6504a0aec65a8))

## [7.16.0](https://github.com/memori-ai/memori-react/compare/v7.15.2...v7.16.0) (2025-01-31)


### Features

* add Alert component with multiple variants and customization options ([8ddc456](https://github.com/memori-ai/memori-react/commit/8ddc4565318b09729c0c30d7e54750bc639f56d1))
* add dynamic shadow rendering for avatar with emotion-based shadow properties ([78030e2](https://github.com/memori-ai/memori-react/commit/78030e2729b00c5bb09fb666e5cd746e8a2ed065))
* add maxLength attribute to textarea inputs in Chat and ChatTextArea components ([46c1d6e](https://github.com/memori-ai/memori-react/commit/46c1d6e60514f50178e9bf11ebda15061e5abfd3))
* improve file upload with robust error handling and validation ([1851d5e](https://github.com/memori-ai/memori-react/commit/1851d5ec8d96031c3c4401e1e6eb0066772d8983))

## [7.15.2](https://github.com/memori-ai/memori-react/compare/v7.15.1...v7.15.2) (2025-01-29)


### Bug Fixes

* better parsing initial context and question ([52a0bef](https://github.com/memori-ai/memori-react/commit/52a0bef4fc65ce17910f9f4b590359229f366a7b))

## [7.15.1](https://github.com/memori-ai/memori-react/compare/v7.15.0...v7.15.1) (2025-01-29)


### Bug Fixes

* better parsing initial context and question ([9972821](https://github.com/memori-ai/memori-react/commit/9972821fb1d64243cdb1094028ebfc0087e60b94))

## [7.15.0](https://github.com/memori-ai/memori-react/compare/v7.14.2...v7.15.0) (2025-01-29)


### Features

* enhance avatar animations and add new story example ([a02564d](https://github.com/memori-ai/memori-react/commit/a02564df11cc1c2b71d6475ac772c1185007041d))


### Bug Fixes

* improve avatar mesh detection for different avatar types ([442a6c5](https://github.com/memori-ai/memori-react/commit/442a6c52304d25f980c3c90e404e9a16856a605d))

## [7.14.2](https://github.com/memori-ai/memori-react/compare/v7.14.1...v7.14.2) (2025-01-22)


### Features

* **style:** updated opacity for website assistant layout ([ee89183](https://github.com/memori-ai/memori-react/commit/ee891834d7e4f4646c7c8e8f7773d66026f10303))


### Bug Fixes

* double translation of last message when reopening session ([4f356bc](https://github.com/memori-ai/memori-react/commit/4f356bc7ef17daacd31de250a2898d403076c682))

## [7.14.1](https://github.com/memori-ai/memori-react/compare/v7.14.0...v7.14.1) (2025-01-20)


### Bug Fixes

* update Avatar component props in TotemLayout to include chatProps ([04c9737](https://github.com/memori-ai/memori-react/commit/04c97374bbb3af9b7c824f153d040242f1db6ddc))

## [7.14.0](https://github.com/memori-ai/memori-react/compare/v7.13.4...v7.14.0) (2025-01-16)


### Features

* add AnimationSequenceTest story ([2be61d9](https://github.com/memori-ai/memori-react/commit/2be61d97fbdac1436bc11503a1201a1b1c35a7bd))
* added sequence animation handling system ([e2d6518](https://github.com/memori-ai/memori-react/commit/e2d65186a3a4d52d30b7d4cf9c47085adba4a56e))


### Changes

* moved AnimationController to controllers directory ([bef5e76](https://github.com/memori-ai/memori-react/commit/bef5e76aa8e503802ccf19b72d1277a145c0255a))
* rename AnimationSequenceTest to MoodChefAssistant and simplify args ([438dc8c](https://github.com/memori-ai/memori-react/commit/438dc8c5ba52a827068323bc4c338434cdd12dfe))
* replaced AvatarPositionController and MorphTargetController directory position ([12fd311](https://github.com/memori-ai/memori-react/commit/12fd311444c09f55a60f948db09829c1a06139b5))

## [7.13.4](https://github.com/memori-ai/memori-react/compare/v7.13.3...v7.13.4) (2025-01-15)


### Maintenance

* refactor showOnlyLastMessages and default props, prevents issues ([3e72aff](https://github.com/memori-ai/memori-react/commit/3e72aff6c701f2e4475562254b1e1dff9f524bbd))

## [7.13.3](https://github.com/memori-ai/memori-react/compare/v7.13.2...v7.13.3) (2025-01-15)


### Bug Fixes

* optional chaining ([0a8b20c](https://github.com/memori-ai/memori-react/commit/0a8b20cce61afd2fe60e73b705a139d749ea451b))
* showUpload fallback values ([ffc3c4e](https://github.com/memori-ai/memori-react/commit/ffc3c4eb46b16e67432e295809045bfb40286e91))


### Maintenance

* update api client ([6bd877e](https://github.com/memori-ai/memori-react/commit/6bd877eacb69acbd38b375f7ee7ceaa33b2abd83))

## [7.13.2](https://github.com/memori-ai/memori-react/compare/v7.13.1...v7.13.2) (2025-01-07)


### Maintenance

* unused chat props as optional ([6e90a9f](https://github.com/memori-ai/memori-react/commit/6e90a9fc9ea87725392532d9eebf4ed6118abf9a))


### Changes

* clean up audio handling ([bb08519](https://github.com/memori-ai/memori-react/commit/bb085199781331abb3b3a2c2aa9864b3cf0c8fe5))

## [7.13.1](https://github.com/memori-ai/memori-react/compare/v7.13.0...v7.13.1) (2025-01-03)


### Bug Fixes

* move css import in tsx to main css file ([29714ac](https://github.com/memori-ai/memori-react/commit/29714ac793a6b310bb269c61c6f38d80745dad18))


### Maintenance

* remove giver/instruct flows ([8dbef44](https://github.com/memori-ai/memori-react/commit/8dbef4462fad41fafa1c0425c8a4e3e4be39f558))

## [7.13.0](https://github.com/memori-ai/memori-react/compare/v7.12.2...v7.13.0) (2025-01-03)


### Features

* auto start prop, starts chat on load ([773feae](https://github.com/memori-ai/memori-react/commit/773feaeb5715c40ba61c27aba4dab3d44536cc94))
* **internal:** allow integration object as prop ([63b3f0f](https://github.com/memori-ai/memori-react/commit/63b3f0f3c005741ff062b101212d53a57a342df7))


### Bug Fixes

* scrollIntoView optional chaining ([7c0a290](https://github.com/memori-ai/memori-react/commit/7c0a290d6205808da413ba03f0380cc747ec3ffe))


### Changes

* new prop to apply css properties to :root ([055a189](https://github.com/memori-ai/memori-react/commit/055a189e8091e422477a0a16d21a95dfed074fd5))

## [7.12.2](https://github.com/memori-ai/memori-react/compare/v7.12.1...v7.12.2) (2024-12-24)


### Changes

* new scroll logic by last user msg ([bc469d3](https://github.com/memori-ai/memori-react/commit/bc469d30b3f00065e5d75d465c4984a8727bab7a))


### Maintenance

* rename memori/twin in agents ([179868d](https://github.com/memori-ai/memori-react/commit/179868d8a9171370edb5fe56b63be0efd2f7d152))

## [7.12.1](https://github.com/memori-ai/memori-react/compare/v7.12.0...v7.12.1) (2024-12-24)


### Bug Fixes

* improve condition for media handling in ChatBubble component ([89506e7](https://github.com/memori-ai/memori-react/commit/89506e738fee548537bc82cdb20472fc53162239))
* showUpload from integration bool checking and fallbacks ([c87f5d8](https://github.com/memori-ai/memori-react/commit/c87f5d84863048d4ef067fec38573996351ee515))

## [7.12.0](https://github.com/memori-ai/memori-react/compare/v7.11.4...v7.12.0) (2024-12-20)


### Features

* add new story for GiovannaProvaWithPreviousSession with session details ([cade750](https://github.com/memori-ai/memori-react/commit/cade750b199aa94d050d277b17e380fd470a064a))
* add new story variants for Giovanna and enhance MorphTargetController with detailed comments ([ee944c8](https://github.com/memori-ai/memori-react/commit/ee944c8d272c7d4877b23132ab99962950318303))
* added comments to separeted handling for GLB and RPM ([893ad9f](https://github.com/memori-ai/memori-react/commit/893ad9f938fa6e323325b1803f4be636910f5aaf))
* added sperated blend shape emotions handling for RPM and custom GLB ([511e716](https://github.com/memori-ai/memori-react/commit/511e716788aa76670568649dcce7c533e214a966))
* **ChatBubble:** integrate file upload and preview features ([7651640](https://github.com/memori-ai/memori-react/commit/7651640e984afb4775cf73762a21825cb7715bb6))
* **Chat:** enhance chat inputs with file upload functionality and media handling ([2bdd9bb](https://github.com/memori-ai/memori-react/commit/2bdd9bb1a1a729edf9dc9c5b40f14fb48b40ebaa))
* consolidate avatar animation constants into a single file with the emotions mapping constants ([98d6085](https://github.com/memori-ai/memori-react/commit/98d60859bb349aadff34fca079378bb72c9c02bc))
* enhance organization of avatar animation configuration ([312f3a2](https://github.com/memori-ai/memori-react/commit/312f3a21f0edc1b4d7e6eae557666aa336ff2e08))
* **FilePreview:** add FilePreview component with styles, stories, and tests ([0bb6262](https://github.com/memori-ai/memori-react/commit/0bb6262b99828695d5acbdeadb0851e66ddbd042))
* updated snapshots ([9a04d6d](https://github.com/memori-ai/memori-react/commit/9a04d6dd210e839534615b236701de3f80e6b5c6))
* **UploadButton:** add file upload component with styling and stories ([bd9d526](https://github.com/memori-ai/memori-react/commit/bd9d526473c9531bb5f3cbc159cef04aeeef6573))


### Bug Fixes

* **AgeVerificationModal:** update z-index for improved modal visibility ([39043c7](https://github.com/memori-ai/memori-react/commit/39043c779b30551bc66b79c8901b2228ad3a1956))
* boe avatar url ([7e32f25](https://github.com/memori-ai/memori-react/commit/7e32f254a2892396f9f881677e9a5dfe7611888a))
* for CompletionProviderStatus improved react renders and api calls ([911ee87](https://github.com/memori-ai/memori-react/commit/911ee8764eba8286549fd2131dc11804a3b3d61d))


### Changes

* remove ConvertAPI token and fetch token dynamically in UploadButton component ([568da4f](https://github.com/memori-ai/memori-react/commit/568da4fcfbd58f1e1fb8ddcf567f1de3275efefc))
* replaced old blenshapes name with updated ones ([3fffd62](https://github.com/memori-ai/memori-react/commit/3fffd62fe184057ad29031a75662681ad8946831))
* update comments for RPM and GLB emotion handling in AvatarComponent ([533bd93](https://github.com/memori-ai/memori-react/commit/533bd937ac4aaf25f912c28713d0ed6a7f8ea221))
* update import paths for avatar components ([1ee58c9](https://github.com/memori-ai/memori-react/commit/1ee58c944ebdd6dcc33d7a630327862ff6d7152e))
* **UploadButton:** remove convertapiToken prop and streamline token fetching logic ([1bbc761](https://github.com/memori-ai/memori-react/commit/1bbc76134dbe52449b8c49f8cfb51040e711c64f))


### Maintenance

* cleanup + add global prop for showUpload ([fa29eb6](https://github.com/memori-ai/memori-react/commit/fa29eb690bbc027213207c39aac8a27065327867))
* downgrade convertapi-js version and update dependencies in package.json and yarn.lock ([ce33a34](https://github.com/memori-ai/memori-react/commit/ce33a343ae4ab18c4ee6543b57703f2ce0167647))
* update configuration and add convertapi-js mock ([d961e72](https://github.com/memori-ai/memori-react/commit/d961e725b04cedf2580d063d4f55e79e65e6e6e9))
* update dependencies and package versions in package.json and yarn.lock ([fcc0220](https://github.com/memori-ai/memori-react/commit/fcc0220e200ba6eb4bca44d97e069fe3f542e3c1))

## [7.11.4](https://github.com/memori-ai/memori-react/compare/v7.11.3...v7.11.4) (2024-12-10)


### Bug Fixes

* links color in user chat bubbles ([813e557](https://github.com/memori-ai/memori-react/commit/813e5574bb32467f52f397a9ff3da1bfeb5b6b4c))

## [7.11.3](https://github.com/memori-ai/memori-react/compare/v7.11.2...v7.11.3) (2024-12-06)


### Bug Fixes

* errors opening session ([ba33f73](https://github.com/memori-ai/memori-react/commit/ba33f73c5733f9417fd5b6e17b4e2d5ab950d701))

## [7.11.2](https://github.com/memori-ai/memori-react/compare/v7.11.1...v7.11.2) (2024-12-06)


### Changes

* install mathjax only if useMathFormatting is enabled ([8648ed0](https://github.com/memori-ai/memori-react/commit/8648ed00627801b8904bc77bd41fc15448756bf1))

## [7.11.1](https://github.com/memori-ai/memori-react/compare/v7.11.0...v7.11.1) (2024-12-06)


### Bug Fixes

* markdown formatting lists and newlines ([ff42a33](https://github.com/memori-ai/memori-react/commit/ff42a33df9b45c32e503859c49147bc2b9c8ea39))
* resume session will create new session if expired ([a85ea67](https://github.com/memori-ai/memori-react/commit/a85ea6794a729c7a9fd01bf1c966e01abf877cd2))

## [7.11.0](https://github.com/memori-ai/memori-react/compare/v7.10.0...v7.11.0) (2024-12-05)


### Features

* math markdown parsing by flag (config or props) ([31c272f](https://github.com/memori-ai/memori-react/commit/31c272fc47825a2292e3a620df55c9a3c615c855))
* resume previous session with sessionID set ([8524d85](https://github.com/memori-ai/memori-react/commit/8524d85f41f5a4cc17f9c876d220f0e36c02dab0))


### Bug Fixes

* **AgeVerificationModal:** update z-index for improved modal visibility ([ddbe6e3](https://github.com/memori-ai/memori-react/commit/ddbe6e39812b0070df06c8d05d19fde3da900232))
* improved error handling for fetchSession and reopenSession functions ([b9b092a](https://github.com/memori-ai/memori-react/commit/b9b092aef1d427afd7d845ae0dc0d65c0ed95326))
* linting ChatBubble ([cf5fb09](https://github.com/memori-ai/memori-react/commit/cf5fb09200499880fb4fb8ec23468529e2b0d0c2))
* recover birthdate from localstorage or login ([fc7c54d](https://github.com/memori-ai/memori-react/commit/fc7c54d887c1184f31fcb258bd7a29cf00168324))
* **test:** reverted linting modifies on ChatBubble ([3e26519](https://github.com/memori-ai/memori-react/commit/3e26519d531934211f0201f1bec9530aae393a10))


### Changes

* chat layout width ([2aa5d23](https://github.com/memori-ai/memori-react/commit/2aa5d23d79896a9651973f7db940b55e4dc0a782))


### Maintenance

* fix typo in stories ([1b71ac9](https://github.com/memori-ai/memori-react/commit/1b71ac9666c9160b650b6f37801184af75de1aec))

## [7.10.0](https://github.com/memori-ai/memori-react/compare/v7.9.1...v7.10.0) (2024-11-26)


### Features

* markdown parsing for user messages too ([34f991d](https://github.com/memori-ai/memori-react/commit/34f991dceec9a04e501faab2f0947678a9d40ce3))


### Bug Fixes

* avoid issues with square brackets in text with markdown and math parsing ([a87569f](https://github.com/memori-ai/memori-react/commit/a87569f4be1f71217243b6d74dbfd20c8df64a71))


### Maintenance

* cleanup logs ([720ff84](https://github.com/memori-ai/memori-react/commit/720ff844cb6fce23b7990f02448dafe66e1de642))
* format storybook preview ([c77455b](https://github.com/memori-ai/memori-react/commit/c77455b39d78e7d835ee9d7cc6198f286ff11068))
* update deps ([bb3dbc6](https://github.com/memori-ai/memori-react/commit/bb3dbc63a41a5952b8daf6a30ca2a4d4241a937f))


### Changes

* removed unused or dangerous mathjax selectors ([0faf89f](https://github.com/memori-ai/memori-react/commit/0faf89f8d0a058a852ecfa2363e89908ea7e6473))
* update marked ([08bd938](https://github.com/memori-ai/memori-react/commit/08bd938d23bc214ddd0c8c12cc22f6099dcc7b23))

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