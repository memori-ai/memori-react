"use strict";(self.webpackChunk_memori_ai_memori_react=self.webpackChunk_memori_ai_memori_react||[]).push([[3061],{"./src/components/Chat/Chat.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{AcceptsFeedback:()=>AcceptsFeedback,Default:()=>Default,MemoriTyping:()=>MemoriTyping,OnX2aState:()=>OnX2aState,OnX3State:()=>OnX3State,WithAIGeneratedMessages:()=>WithAIGeneratedMessages,WithContext:()=>WithContext,WithCustomUserAvatar:()=>WithCustomUserAvatar,WithCustomUserAvatarAsElement:()=>WithCustomUserAvatarAsElement,WithDates:()=>WithDates,WithDatesAndContext:()=>WithDatesAndContext,WithHints:()=>WithHints,WithMedia:()=>WithMedia,WithUser:()=>WithUser,__namedExportsOrder:()=>__namedExportsOrder,default:()=>Chat_stories});var react=__webpack_require__("./node_modules/react/index.js"),data=__webpack_require__("./src/mocks/data.ts"),I18nWrapper=__webpack_require__("./src/I18nWrapper.tsx"),Chat=__webpack_require__("./src/components/Chat/Chat.tsx"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),Chat_Chat=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[7].use[1]!./src/components/Chat/Chat.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(Chat_Chat.Z,options);Chat_Chat.Z&&Chat_Chat.Z.locals&&Chat_Chat.Z.locals;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const Chat_stories={title:"Widget/Chat",component:Chat.Z,argTypes:{},parameters:{controls:{expanded:!0}}},dialogState={...data.Gs,hints:[]},Template=args=>{const[userMessage,setUserMessage]=(0,react.useState)(args.userMessage);return(0,jsx_runtime.jsx)(I18nWrapper.Z,{children:(0,jsx_runtime.jsx)(Chat.Z,{...args,userMessage,onChangeUserMessage:setUserMessage})})};Template.displayName="Template";const Default=Template.bind({});Default.args={memori:data.jF,tenant:data.cm,sessionID:data.M9,history:data.m8,dialogState,layout:"DEFAULT",simulateUserPrompt:()=>{},sendMessage:msg=>console.log(msg),stopListening:()=>{},resetTranscript:()=>{},setAttachmentsMenuOpen:()=>{},setSendOnEnter:()=>{}};const MemoriTyping=Template.bind({});MemoriTyping.args={memori:data.jF,tenant:data.cm,sessionID:data.M9,history:data.m8,dialogState,layout:"DEFAULT",simulateUserPrompt:()=>{},memoriTyping:!0,sendMessage:msg=>console.log(msg),stopListening:()=>{},resetTranscript:()=>{},setAttachmentsMenuOpen:()=>{},setSendOnEnter:()=>{}};const WithHints=Template.bind({});WithHints.args={memori:data.jF,tenant:data.cm,sessionID:data.M9,history:data.m8,dialogState:data.Gs,layout:"DEFAULT",simulateUserPrompt:()=>{},sendMessage:msg=>console.log(msg),stopListening:()=>{},resetTranscript:()=>{},setAttachmentsMenuOpen:()=>{},setSendOnEnter:()=>{}};const WithMedia=Template.bind({});WithMedia.args={memori:data.jF,tenant:data.cm,sessionID:data.M9,history:data.Eu,dialogState,layout:"DEFAULT",simulateUserPrompt:()=>{},sendMessage:msg=>console.log(msg),stopListening:()=>{},resetTranscript:()=>{},setAttachmentsMenuOpen:()=>{},setSendOnEnter:()=>{}};const WithDates=Template.bind({});WithDates.args={memori:data.jF,tenant:data.cm,sessionID:data.M9,history:data.m8,dialogState,layout:"DEFAULT",simulateUserPrompt:()=>{},sendMessage:msg=>console.log(msg),stopListening:()=>{},resetTranscript:()=>{},setAttachmentsMenuOpen:()=>{},setSendOnEnter:()=>{},showDates:!0};const WithContext=Template.bind({});WithContext.args={memori:data.jF,tenant:data.cm,sessionID:data.M9,history:data.m8,dialogState,layout:"DEFAULT",simulateUserPrompt:()=>{},sendMessage:msg=>console.log(msg),stopListening:()=>{},resetTranscript:()=>{},setAttachmentsMenuOpen:()=>{},setSendOnEnter:()=>{},showContextPerLine:!0};const WithDatesAndContext=Template.bind({});WithDatesAndContext.args={memori:data.jF,tenant:data.cm,sessionID:data.M9,history:data.m8,dialogState,layout:"DEFAULT",simulateUserPrompt:()=>{},sendMessage:msg=>console.log(msg),stopListening:()=>{},resetTranscript:()=>{},setAttachmentsMenuOpen:()=>{},setSendOnEnter:()=>{},showDates:!0,showContextPerLine:!0};const OnX3State=Template.bind({});OnX3State.args={memori:data.jF,tenant:data.cm,sessionID:data.M9,history:data.m8,dialogState:{...dialogState,state:"X3"},layout:"DEFAULT",simulateUserPrompt:()=>{},sendMessage:msg=>console.log(msg),stopListening:()=>{},resetTranscript:()=>{},setAttachmentsMenuOpen:()=>{},setSendOnEnter:()=>{}};const OnX2aState=Template.bind({});OnX2aState.args={memori:data.jF,tenant:data.cm,sessionID:data.M9,history:data.m8,dialogState:{...dialogState,state:"X2a"},layout:"DEFAULT",simulateUserPrompt:()=>{},sendMessage:msg=>console.log(msg),stopListening:()=>{},resetTranscript:()=>{},setAttachmentsMenuOpen:()=>{},setSendOnEnter:()=>{}};const AcceptsFeedback=Template.bind({});AcceptsFeedback.args={memori:data.jF,tenant:data.cm,sessionID:data.M9,history:data.m8,dialogState:{...dialogState,acceptsFeedback:!0},layout:"DEFAULT",simulateUserPrompt:()=>{},sendMessage:msg=>console.log(msg),stopListening:()=>{},resetTranscript:()=>{},setAttachmentsMenuOpen:()=>{},setSendOnEnter:()=>{}};const WithAIGeneratedMessages=Template.bind({});WithAIGeneratedMessages.args={memori:data.jF,tenant:data.cm,sessionID:data.M9,history:data.I_,dialogState,layout:"DEFAULT",simulateUserPrompt:()=>{},sendMessage:msg=>console.log(msg),stopListening:()=>{},resetTranscript:()=>{},setAttachmentsMenuOpen:()=>{},setSendOnEnter:()=>{}};const WithUser=Template.bind({});WithUser.args={user:{avatarURL:"https://picsum.photos/200"},memori:data.jF,tenant:data.cm,sessionID:data.M9,history:data.m8,dialogState,layout:"DEFAULT",simulateUserPrompt:()=>{},sendMessage:msg=>console.log(msg),stopListening:()=>{},resetTranscript:()=>{},setAttachmentsMenuOpen:()=>{},setSendOnEnter:()=>{}};const WithCustomUserAvatar=Template.bind({});WithCustomUserAvatar.args={userAvatar:"https://picsum.photos/200",memori:data.jF,tenant:data.cm,sessionID:data.M9,history:data.m8,dialogState,layout:"DEFAULT",simulateUserPrompt:()=>{},sendMessage:msg=>console.log(msg),stopListening:()=>{},resetTranscript:()=>{},setAttachmentsMenuOpen:()=>{},setSendOnEnter:()=>{}};const WithCustomUserAvatarAsElement=Template.bind({});WithCustomUserAvatarAsElement.args={userAvatar:(0,jsx_runtime.jsx)("span",{children:"USER"}),memori:data.jF,tenant:data.cm,sessionID:data.M9,history:data.m8,dialogState,layout:"DEFAULT",simulateUserPrompt:()=>{},sendMessage:msg=>console.log(msg),stopListening:()=>{},resetTranscript:()=>{},setAttachmentsMenuOpen:()=>{},setSendOnEnter:()=>{}},Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"args => {\n  const [userMessage, setUserMessage] = useState(args.userMessage);\n  return <I18nWrapper>\n      <Chat {...args} userMessage={userMessage} onChangeUserMessage={setUserMessage} />\n    </I18nWrapper>;\n}",...Default.parameters?.docs?.source}}},MemoriTyping.parameters={...MemoriTyping.parameters,docs:{...MemoriTyping.parameters?.docs,source:{originalSource:"args => {\n  const [userMessage, setUserMessage] = useState(args.userMessage);\n  return <I18nWrapper>\n      <Chat {...args} userMessage={userMessage} onChangeUserMessage={setUserMessage} />\n    </I18nWrapper>;\n}",...MemoriTyping.parameters?.docs?.source}}},WithHints.parameters={...WithHints.parameters,docs:{...WithHints.parameters?.docs,source:{originalSource:"args => {\n  const [userMessage, setUserMessage] = useState(args.userMessage);\n  return <I18nWrapper>\n      <Chat {...args} userMessage={userMessage} onChangeUserMessage={setUserMessage} />\n    </I18nWrapper>;\n}",...WithHints.parameters?.docs?.source}}},WithMedia.parameters={...WithMedia.parameters,docs:{...WithMedia.parameters?.docs,source:{originalSource:"args => {\n  const [userMessage, setUserMessage] = useState(args.userMessage);\n  return <I18nWrapper>\n      <Chat {...args} userMessage={userMessage} onChangeUserMessage={setUserMessage} />\n    </I18nWrapper>;\n}",...WithMedia.parameters?.docs?.source}}},WithDates.parameters={...WithDates.parameters,docs:{...WithDates.parameters?.docs,source:{originalSource:"args => {\n  const [userMessage, setUserMessage] = useState(args.userMessage);\n  return <I18nWrapper>\n      <Chat {...args} userMessage={userMessage} onChangeUserMessage={setUserMessage} />\n    </I18nWrapper>;\n}",...WithDates.parameters?.docs?.source}}},WithContext.parameters={...WithContext.parameters,docs:{...WithContext.parameters?.docs,source:{originalSource:"args => {\n  const [userMessage, setUserMessage] = useState(args.userMessage);\n  return <I18nWrapper>\n      <Chat {...args} userMessage={userMessage} onChangeUserMessage={setUserMessage} />\n    </I18nWrapper>;\n}",...WithContext.parameters?.docs?.source}}},WithDatesAndContext.parameters={...WithDatesAndContext.parameters,docs:{...WithDatesAndContext.parameters?.docs,source:{originalSource:"args => {\n  const [userMessage, setUserMessage] = useState(args.userMessage);\n  return <I18nWrapper>\n      <Chat {...args} userMessage={userMessage} onChangeUserMessage={setUserMessage} />\n    </I18nWrapper>;\n}",...WithDatesAndContext.parameters?.docs?.source}}},OnX3State.parameters={...OnX3State.parameters,docs:{...OnX3State.parameters?.docs,source:{originalSource:"args => {\n  const [userMessage, setUserMessage] = useState(args.userMessage);\n  return <I18nWrapper>\n      <Chat {...args} userMessage={userMessage} onChangeUserMessage={setUserMessage} />\n    </I18nWrapper>;\n}",...OnX3State.parameters?.docs?.source}}},OnX2aState.parameters={...OnX2aState.parameters,docs:{...OnX2aState.parameters?.docs,source:{originalSource:"args => {\n  const [userMessage, setUserMessage] = useState(args.userMessage);\n  return <I18nWrapper>\n      <Chat {...args} userMessage={userMessage} onChangeUserMessage={setUserMessage} />\n    </I18nWrapper>;\n}",...OnX2aState.parameters?.docs?.source}}},AcceptsFeedback.parameters={...AcceptsFeedback.parameters,docs:{...AcceptsFeedback.parameters?.docs,source:{originalSource:"args => {\n  const [userMessage, setUserMessage] = useState(args.userMessage);\n  return <I18nWrapper>\n      <Chat {...args} userMessage={userMessage} onChangeUserMessage={setUserMessage} />\n    </I18nWrapper>;\n}",...AcceptsFeedback.parameters?.docs?.source}}},WithAIGeneratedMessages.parameters={...WithAIGeneratedMessages.parameters,docs:{...WithAIGeneratedMessages.parameters?.docs,source:{originalSource:"args => {\n  const [userMessage, setUserMessage] = useState(args.userMessage);\n  return <I18nWrapper>\n      <Chat {...args} userMessage={userMessage} onChangeUserMessage={setUserMessage} />\n    </I18nWrapper>;\n}",...WithAIGeneratedMessages.parameters?.docs?.source}}},WithUser.parameters={...WithUser.parameters,docs:{...WithUser.parameters?.docs,source:{originalSource:"args => {\n  const [userMessage, setUserMessage] = useState(args.userMessage);\n  return <I18nWrapper>\n      <Chat {...args} userMessage={userMessage} onChangeUserMessage={setUserMessage} />\n    </I18nWrapper>;\n}",...WithUser.parameters?.docs?.source}}},WithCustomUserAvatar.parameters={...WithCustomUserAvatar.parameters,docs:{...WithCustomUserAvatar.parameters?.docs,source:{originalSource:"args => {\n  const [userMessage, setUserMessage] = useState(args.userMessage);\n  return <I18nWrapper>\n      <Chat {...args} userMessage={userMessage} onChangeUserMessage={setUserMessage} />\n    </I18nWrapper>;\n}",...WithCustomUserAvatar.parameters?.docs?.source}}},WithCustomUserAvatarAsElement.parameters={...WithCustomUserAvatarAsElement.parameters,docs:{...WithCustomUserAvatarAsElement.parameters?.docs,source:{originalSource:"args => {\n  const [userMessage, setUserMessage] = useState(args.userMessage);\n  return <I18nWrapper>\n      <Chat {...args} userMessage={userMessage} onChangeUserMessage={setUserMessage} />\n    </I18nWrapper>;\n}",...WithCustomUserAvatarAsElement.parameters?.docs?.source}}};const __namedExportsOrder=["Default","MemoriTyping","WithHints","WithMedia","WithDates","WithContext","WithDatesAndContext","OnX3State","OnX2aState","AcceptsFeedback","WithAIGeneratedMessages","WithUser","WithCustomUserAvatar","WithCustomUserAvatarAsElement"]},"./src/components/icons/FullscreenExit.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const FullscreenExit=({className,title})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("svg",{...title?{}:{"aria-hidden":"true"},xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1024 1024",focusable:"false",role:"img",className,"aria-label":title,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path",{d:"M391 240.9c-.8-6.6-8.9-9.4-13.6-4.7l-43.7 43.7L200 146.3a8.03 8.03 0 0 0-11.3 0l-42.4 42.3a8.03 8.03 0 0 0 0 11.3L280 333.6l-43.9 43.9a8.01 8.01 0 0 0 4.7 13.6L401 410c5.1.6 9.5-3.7 8.9-8.9L391 240.9zm10.1 373.2L240.8 633c-6.6.8-9.4 8.9-4.7 13.6l43.9 43.9L146.3 824a8.03 8.03 0 0 0 0 11.3l42.4 42.3c3.1 3.1 8.2 3.1 11.3 0L333.7 744l43.7 43.7A8.01 8.01 0 0 0 391 783l18.9-160.1c.6-5.1-3.7-9.4-8.8-8.8zm221.8-204.2L783.2 391c6.6-.8 9.4-8.9 4.7-13.6L744 333.6 877.7 200c3.1-3.1 3.1-8.2 0-11.3l-42.4-42.3a8.03 8.03 0 0 0-11.3 0L690.3 279.9l-43.7-43.7a8.01 8.01 0 0 0-13.6 4.7L614.1 401c-.6 5.2 3.7 9.5 8.8 8.9zM744 690.4l43.9-43.9a8.01 8.01 0 0 0-4.7-13.6L623 614c-5.1-.6-9.5 3.7-8.9 8.9L633 783.1c.8 6.6 8.9 9.4 13.6 4.7l43.7-43.7L824 877.7c3.1 3.1 8.2 3.1 11.3 0l42.4-42.3c3.1-3.1 3.1-8.2 0-11.3L744 690.4z"})});FullscreenExit.displayName="FullscreenExit";const __WEBPACK_DEFAULT_EXPORT__=FullscreenExit;try{FullscreenExit.displayName="FullscreenExit",FullscreenExit.__docgenInfo={description:"",displayName:"FullscreenExit",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/icons/FullscreenExit.tsx#FullscreenExit"]={docgenInfo:FullscreenExit.__docgenInfo,name:"FullscreenExit",path:"src/components/icons/FullscreenExit.tsx#FullscreenExit"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/ui/Tooltip.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");const Tooltip=({content,className,align="right",disabled=!1,visible=!1,children})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div",{className:classnames__WEBPACK_IMPORTED_MODULE_1___default()("memori-tooltip",`memori-tooltip--align-${align}`,className,{"memori-tooltip--disabled":disabled,"memori-tooltip--visible":visible}),children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div",{className:"memori-tooltip--content",children:content}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div",{className:"memori-tooltip--trigger",children})]});Tooltip.displayName="Tooltip";const __WEBPACK_DEFAULT_EXPORT__=Tooltip;try{Tooltip.displayName="Tooltip",Tooltip.__docgenInfo={description:"",displayName:"Tooltip",props:{content:{defaultValue:null,description:"",name:"content",required:!0,type:{name:"Element | ReactNode"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},align:{defaultValue:{value:"right"},description:"",name:"align",required:!1,type:{name:"enum",value:[{value:'"left"'},{value:'"right"'},{value:'"topLeft"'},{value:'"topRight"'}]}},disabled:{defaultValue:{value:"false"},description:"",name:"disabled",required:!1,type:{name:"boolean"}},visible:{defaultValue:{value:"false"},description:"",name:"visible",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/ui/Tooltip.tsx#Tooltip"]={docgenInfo:Tooltip.__docgenInfo,name:"Tooltip",path:"src/components/ui/Tooltip.tsx#Tooltip"})}catch(__react_docgen_typescript_loader_error){}},"./src/mocks/data.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A3:()=>expertReference,AU:()=>memoryQuestion,EA:()=>user,Eu:()=>historyWithMedia,Fr:()=>venue,Gs:()=>dialogState,I_:()=>historyWithAIGeneratedMessages,JZ:()=>knownFact,M9:()=>sessionID,WM:()=>integration,cm:()=>tenant,jF:()=>memori,m8:()=>history});const sessionID="131165be-9d1a-42fb-a3ce-e8f86d40c88f",tenant={adminCount:3,config:{name:"AIsuru",requirePosition:!1,showNewUser:!0},creationTimestamp:"2023-05-31T14:32:48.885287Z",description:"AIsuru",disableRegistration:!1,id:"www.aisuru.com",lastChangeTimestamp:"2023-05-31T14:32:48.885287Z",logoURL:"https://aisuru.com/images/aisuru/logo.png",maxAdmins:0,maxCompletions:0,maxCompletionsPerUser:0,maxFreeSessions:400,maxFreeSessionsPerUser:100,maxMemoriPerAdmin:0,maxMemoriPerUser:3,maxTotalMemori:0,maxUsers:0,memoriCount:0,name:"www.aisuru.com",nonFreeSessionCost:.02,paying:!0,tenantID:"96caa4b4-31a4-48e5-8163-dec61869a2a7",theme:"aisuru",userCount:0},user={tenant:"localhost:3000",userID:"97c42d18-ffe4-47e1-a3c7-e42729f1e6a3",userName:"nzambello",eMail:"nicola@nzambello.dev",admin:!1,maxMemori:0,enableMemoriCreation:!0,enableBoardOfExperts:!0,maxFreeSessions:0,tnCAndPPAccepted:!0,tnCAndPPAcceptanceDate:"2021-03-01T00:00:00.000Z",pAndCUAccepted:!0,pAndCUAcceptanceDate:"2021-03-01T00:00:00.000Z",birthDate:"1900-03-01T00:00:00.000Z",age:28,avatarURL:"https://avatars.githubusercontent.com/u/21101435?v=4"},memori={memoriID:"25ced51c-3520-41af-8bbe-222d861b8e32",engineMemoriID:"66b4e161-2431-4b21-9b70-d8c27de730ca",name:"Memori",memoriConfigurationID:"MemoriCloud-it_IT",description:"Lorem ipsum.",voiceType:"male",isGiver:!0,isReceiver:!1,privacyType:"PUBLIC",needsPosition:!1,culture:"it-IT",categories:[],publishedInTheMetaverse:!0,exposed:!0,enableCompletions:!0,nsfw:!1,ageRestriction:14,contentQualityIndex:66.6,contentQualityIndexTimestamp:"2021-03-01T12:00:00.000Z",ownerUserName:"username",ownerTenantName:"aisuru.com",ownerUserID:"97c42d18-ffe4-47e1-a3c7-e42729f1e6a3",metaverseEnvironment:"synthwave",secretToken:"awanagana",giverPIN:"1234",giverTag:"🧑‍💻",avatarURL:"https://aisuru.com/images/aisuru/square_logo.png",coverURL:"https://aisuru.com/images/aisuru/og-image.png"},history=[{text:"Ciao, io sono test, c'è qualcosa che vorresti chiedermi?",timestamp:"2021-03-01T12:00:00.000Z"},{text:"Prova",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Mi dispiace, le mie risposte sono limitate. Devi farmi le domande giuste. C'è altro che vuoi sapere?",timestamp:"2021-03-01T12:00:00.000Z"},{text:"Come faccio a fare delle cose con questa cosa?",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Ecco qui come.",media:[{mediumID:"c6851968-5d4d-409a-ae75-f22ec077efcd",url:"https://memori.ai",mimeType:"text/html",title:"Link"}],timestamp:"2021-03-01T12:00:00.000Z",contextVars:{TEST:"test"}},{text:"Ah, grazie! Ciao!",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Arrivederci.",timestamp:"2021-03-01T12:00:00.000Z",contextVars:{TEST:"test"}}],historyWithMedia=[{text:"Ciao, io sono test, c'è qualcosa che vorresti chiedermi?",timestamp:"2021-03-01T12:00:00.000Z"},{text:"Prova",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Mi dispiace, le mie risposte sono limitate. Devi farmi le domande giuste. C'è altro che vuoi sapere?",timestamp:"2021-03-01T12:00:00.000Z"},{text:"Come faccio a fare delle cose con questa cosa?",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Ecco qui delle cose per te.",media:[{mediumID:"c6851968-5d4d-409a-ae75-f22ec077efcd",url:"https://memori.ai/en",mimeType:"text/html",title:"Link Memori Srl"},{mediumID:"c6851968-5d4d-409a-ae75-f22ec077efce",url:"https://rawmaterial.it/en",mimeType:"text/html",title:"Link RawMaterial"},{mediumID:"95226d7e-7bae-465e-8b80-995587bb5971",mimeType:"text/html",title:"Introducing Plone Remix | Vimeo",url:"https://vimeo.com/766468314"},{mediumID:"95226d7e-7bae-465e-8b80-995587bb5969",mimeType:"text/html",title:"A sustainable web: is it possible? - Nicola Zambello | YouTube",url:"https://www.youtube.com/watch?v=feH26j3rBz8"},...Array.from({length:3},((_,i)=>({mediumID:`95226d7e-7bae-465e-8b80-995587bb597${i}`,mimeType:"image/png",title:`Image ${i}`,url:`https://picsum.photos/${i%2?"200":"300"}/${i%3?"300":"200"}?random=${i}`})))],timestamp:"2021-03-01T12:00:00.000Z"},{text:"Ah, grazie! Ciao!",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Arrivederci.",timestamp:"2021-03-01T12:00:00.000Z"}],historyWithAIGeneratedMessages=[{text:"Ciao, io sono test, c'è qualcosa che vorresti chiedermi?",timestamp:"2021-03-01T12:00:00.000Z"},{text:"Prova",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Sa. Sa. Prova",timestamp:"2021-03-01T12:00:00.000Z"},{text:"Come faccio a fare delle cose con questa cosa?",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Ecco qui come.",media:[{mediumID:"c6851968-5d4d-409a-ae75-f22ec077efcd",url:"https://memori.ai",mimeType:"text/html",title:"Link"}],timestamp:"2021-03-01T12:00:00.000Z",generatedByAI:!0,contextVars:{TEST:"test"}},{text:"Ah, grazie! Ciao!",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Arrivederci.",timestamp:"2021-03-01T12:00:00.000Z",contextVars:{TEST:"test"}}],dialogState={state:"R1",previousState:"I0",stateName:"WaitingForReceiverQuestion",confidence:1,knownTags:{"☠️":"test","😎":"Ciccio"},emission:"Ciao, io sono test, c'è qualcosa che vorresti chiedermi?",hints:["Va bene","No grazie"],media:[],acceptsTimeout:!0,acceptsAbort:!1,acceptsMedia:!1,acceptsDate:!1,acceptsPlace:!1,acceptsTag:!1,giverID:"c832e2dc-403c-4baf-a3b7-2374e100dbcf",contextVars:{}},integration={integrationID:"cb3c4776-7f0b-4f97-a773-c32a5d7a3bf1",memoriID:"25ced51c-3520-41af-8bbe-222d861b8e32",type:"LANDING_EXPERIENCE",state:"NEW",deviceEmails:[],customData:'{"textColor":"#2a2a2a","buttonBgColor":"#823ce1","buttonTextColor":"#ffffff","name":"Web","globalBackground":"https://assets.memori.ai/api/v2/asset/364e498c-11da-42d5-9e32-19e5d137d4b8.jpeg","blurBackground":true,"innerBgColor":"light","innerBgAlpha":0.8,"multilanguage":true,"avatar":"readyplayerme","avatarURL":"https://assets.memori.ai/api/v2/asset/b791f77c-1a94-4272-829e-eca82fcc62b7.glb#1669663599444"}',resources:[],publish:!0,creationTimestamp:"2022-06-11T14:13:45.685038Z",lastChangeTimestamp:"2022-06-11T14:13:45.685038Z"},knownFact={knownFactID:"b0b0b0b0-b0b0-b0b0-b0b0-b0b0b0b0b0b3",knownFactType:"ShortTerm",text:"I am a known fact. Quisque in ultrices lectus. Nulla at urna diam. Proin sodales lobortis libero eu facilisis.",creationTimestamp:"2023-12-01T13:40:25.235896Z",creationSessionID:"0ce713c0-c8f1-4aed-a2a6-40f81c06854f",lastChangeTimestamp:"2023-12-01T13:44:04.832072Z",lastChangeSessionID:"0ce713c0-c8f1-4aed-a2a6-40f81c06854f"},expertReference={expertID:"f016f204-c307-483b-8891-680a3c974c53",name:"TEST MEMORI",description:"lui è competente",default:!0,expertMemoriID:"dfc44f1c-1ba7-4e1e-a234-28aa8b6b3d32",expertBaseURL:"http://localhost:7778",creationTimestamp:"2023-12-01T13:40:25.235896Z",creationSessionID:"0ce713c0-c8f1-4aed-a2a6-40f81c06854f",lastChangeTimestamp:"2023-12-01T13:44:04.832072Z",lastChangeSessionID:"0ce713c0-c8f1-4aed-a2a6-40f81c06854f"},venue={latitude:44.66579,longitude:11.48823,placeName:"Altedo, Bologna, Italy",uncertainty:2},memoryQuestion={memoryID:"08c0697d-f7f3-4a47-9970-aff75f01fb6c",memoryType:"Question",lastRead:void 0,readOccurrences:void 0,receiverID:void 0,receiverTag:void 0,receiverName:void 0,media:[{mediumID:"c6851968-5d4d-409a-ae75-f22ec077efcd",mimeType:"text/html",url:"https://rawmaterial.it/it",title:"RawMaterial"}],title:"sei umano",titleVariants:["sei reale"],answers:[{text:"se ti dico si ci credi?",preformatted:!1,creationTimestamp:"2022-03-23T09:37:25.410377",creationName:"6cfec2bd-a73f-4a21-b7ff-dd92d6db59c4",lastChangeTimestamp:"2022-03-23T09:37:25.410406",lastChangeName:"6cfec2bd-a73f-4a21-b7ff-dd92d6db59c4"},{text:"probabilmente lo sono più di te",preformatted:!1,creationTimestamp:"2022-03-23T09:37:36.957656",creationName:"6cfec2bd-a73f-4a21-b7ff-dd92d6db59c4",lastChangeTimestamp:"2022-03-23T09:37:36.957657",lastChangeName:"6cfec2bd-a73f-4a21-b7ff-dd92d6db59c4"}],date:void 0,dateUncertaintyDays:void 0,placeName:void 0,placeLatitude:void 0,placeLongitude:void 0,placeUncertaintyKm:void 0,preformatted:!1,conclusive:!1,notPickable:!1,contextVarsToSet:{SUBJECT:"TRAVEL"},contextVarsToMatch:{SUBJECT:"TRANSPORTS"},creationTimestamp:"2022-03-23T09:37:16.568149",creationName:"6cfec2bd-a73f-4a21-b7ff-dd92d6db59c4",lastChangeTimestamp:"2022-03-23T09:37:36.957695",lastChangeName:"6cfec2bd-a73f-4a21-b7ff-dd92d6db59c4"}}}]);