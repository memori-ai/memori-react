"use strict";(self.webpackChunk_memori_ai_memori_react=self.webpackChunk_memori_ai_memori_react||[]).push([[2994],{"./node_modules/@headlessui/react/dist/hooks/use-resolve-button-type.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{f:()=>s});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");function i(t){var n;if(t.type)return t.type;let e=null!=(n=t.as)?n:"button";return"string"==typeof e&&"button"===e.toLowerCase()?"button":void 0}function s(t,e){let[n,u]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)((()=>i(t)));return(0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.e)((()=>{u(i(t))}),[t.type,t.as]),(0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.e)((()=>{n||!e.current||e.current instanceof HTMLButtonElement&&!e.current.hasAttribute("type")&&u("button")}),[n,e]),n}},"./node_modules/@headlessui/react/dist/hooks/use-tree-walker.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{B:()=>F});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js"),_utils_owner_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@headlessui/react/dist/utils/owner.js");function F({container:e,accept:t,walk:r,enabled:c=!0}){let o=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(t),l=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(r);(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>{o.current=t,l.current=r}),[t,r]),(0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.e)((()=>{if(!e||!c)return;let n=(0,_utils_owner_js__WEBPACK_IMPORTED_MODULE_2__.r)(e);if(!n)return;let f=o.current,p=l.current,d=Object.assign((i=>f(i)),{acceptNode:f}),u=n.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,d,!1);for(;u.nextNode();)p(u.currentNode)}),[e,c,o,l])}},"./node_modules/@headlessui/react/dist/utils/calculate-active-index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{T:()=>a,d:()=>x});var e,a=((e=a||{})[e.First=0]="First",e[e.Previous=1]="Previous",e[e.Next=2]="Next",e[e.Last=3]="Last",e[e.Specific=4]="Specific",e[e.Nothing=5]="Nothing",e);function x(r,n){let t=n.resolveItems();if(t.length<=0)return null;let l=n.resolveActiveIndex(),s=null!=l?l:-1,d=(()=>{switch(r.focus){case 0:return t.findIndex((e=>!n.resolveDisabled(e)));case 1:{let e=t.slice().reverse().findIndex(((i,c,u)=>!(-1!==s&&u.length-c-1>=s)&&!n.resolveDisabled(i)));return-1===e?e:t.length-1-e}case 2:return t.findIndex(((e,i)=>!(i<=s)&&!n.resolveDisabled(e)));case 3:{let e=t.slice().reverse().findIndex((i=>!n.resolveDisabled(i)));return-1===e?e:t.length-1-e}case 4:return t.findIndex((e=>n.resolveId(e)===r.id));case 5:return null;default:!function f(r){throw new Error("Unexpected object: "+r)}(r)}})();return-1===d?l:d}},"./src/components/ChatBubble/ChatBubble.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,FromExpertOfABoard:()=>FromExpertOfABoard,FromUser:()=>FromUser,FromUserWithAvatar:()=>FromUserWithAvatar,FromUserWithAvatarAndCustomAvatar:()=>FromUserWithAvatarAndCustomAvatar,FromUserWithCustomAvatar:()=>FromUserWithCustomAvatar,FromUserWithCustomAvatarElement:()=>FromUserWithCustomAvatarElement,GeneratedByAI:()=>GeneratedByAI,Initial:()=>Initial,WithAllAddonsContents:()=>WithAllAddonsContents,WithFeedbackButtons:()=>WithFeedbackButtons,WithMarkdown:()=>WithMarkdown,__namedExportsOrder:()=>__namedExportsOrder,default:()=>ChatBubble_stories});__webpack_require__("./node_modules/react/index.js");var data=__webpack_require__("./src/mocks/data.ts"),I18nWrapper=__webpack_require__("./src/I18nWrapper.tsx"),ChatBubble=__webpack_require__("./src/components/ChatBubble/ChatBubble.tsx"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),ChatBubble_ChatBubble=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[7].use[1]!./src/components/ChatBubble/ChatBubble.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(ChatBubble_ChatBubble.Z,options);ChatBubble_ChatBubble.Z&&ChatBubble_ChatBubble.Z.locals&&ChatBubble_ChatBubble.Z.locals;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const ChatBubble_stories={title:"Widget/Chat bubble",component:ChatBubble.Z,argTypes:{fromUser:{control:{type:"boolean"}},text:{control:{type:"text"}},initial:{control:{type:"boolean"}}},parameters:{controls:{expanded:!0}}},Template=args=>(0,jsx_runtime.jsx)(I18nWrapper.Z,{children:(0,jsx_runtime.jsx)(ChatBubble.Z,{...args})});Template.displayName="Template";const Default=Template.bind({});Default.args={memori:data.jF,tenant:data.cm,message:{fromUser:!1,text:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.",initial:!1,translatedText:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor."}};const FromUser=Template.bind({});FromUser.args={memori:data.jF,tenant:data.cm,message:{fromUser:!0,text:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.",initial:!1,translatedText:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor."}};const Initial=Template.bind({});Initial.args={memori:data.jF,tenant:data.cm,message:{fromUser:!1,text:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.",initial:!0,translatedText:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor."}};const GeneratedByAI=Template.bind({});GeneratedByAI.args={memori:data.jF,tenant:data.cm,message:{fromUser:!1,text:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.",initial:!1,translatedText:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.",generatedByAI:!0}};const WithFeedbackButtons=Template.bind({});WithFeedbackButtons.args={memori:data.jF,tenant:data.cm,message:{fromUser:!1,text:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.",initial:!1,translatedText:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.",generatedByAI:!1},showFeedback:!0,simulateUserPrompt:()=>{}};const WithAllAddonsContents=Template.bind({});WithAllAddonsContents.args={memori:data.jF,tenant:data.cm,message:{fromUser:!1,text:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.",initial:!1,translatedText:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.",generatedByAI:!0},showFeedback:!0,simulateUserPrompt:()=>{}};const FromUserWithAvatar=Template.bind({});FromUserWithAvatar.args={memori:data.jF,tenant:data.cm,user:{avatarURL:"https://picsum.photos/200"},message:{fromUser:!0,text:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.",initial:!1,translatedText:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor."}};const FromUserWithCustomAvatar=Template.bind({});FromUserWithCustomAvatar.args={memori:data.jF,tenant:data.cm,userAvatar:"https://picsum.photos/200",message:{fromUser:!0,text:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.",initial:!1,translatedText:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor."}};const FromUserWithCustomAvatarElement=Template.bind({});FromUserWithCustomAvatarElement.args={memori:data.jF,tenant:data.cm,userAvatar:(0,jsx_runtime.jsx)("span",{children:"USER"}),message:{fromUser:!0,text:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.",initial:!1,translatedText:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor."}};const FromUserWithAvatarAndCustomAvatar=Template.bind({});FromUserWithAvatarAndCustomAvatar.args={memori:data.jF,tenant:data.cm,userAvatar:()=>(0,jsx_runtime.jsx)("span",{children:"USER"}),user:{avatarURL:"https://picsum.photos/200"},message:{fromUser:!0,text:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.",initial:!1,translatedText:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor."}};const FromExpertOfABoard=Template.bind({});FromExpertOfABoard.args={memori:{...data.jF,enableBoardOfExperts:!0},apiUrl:"https://backend.memori.ai",tenant:data.cm,experts:[{expertID:"9b0a2913-d3d8-4e98-a49d-6e1c99479e1b",name:"Expert name",description:"Expert description",expertMemoriID:"9b0a2913-d3d8-4e98-a49d-6e1c99479e1b",expertBaseURL:"https://engine.memori.ai"}],message:{fromUser:!1,text:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor.",initial:!1,generatedByAI:!0,emitter:"Expert name",translatedText:"Proin libero ante, dignissim sit amet turpis a, pretium condimentum dolor."}};const WithMarkdown=Template.bind({});WithMarkdown.args={memori:data.jF,apiUrl:"https://backend.memori.ai",tenant:data.cm,message:{fromUser:!1,text:"## Test\n\nEcco tutte le possibili personalizzazioni che puoi applicare:\n\n- **Colletto**:\n - Girocollo\n - Scollo a V\n\n- **Manica**:\n - Manica Lunga\n - Manica Corta\n\n- **Taglia**:\n - XS\n - S\n - M\n - L\n - XL\n - XXL\n - 3XL\n\n- **Posizione Stampa**:\n - Fronte Petto\n - Retro Schiena\n - Fronte DX\n - Fronte SX\n\n- **Generazione Immagine**:\n - Prompt generazione immagine\n\nSeleziona le personalizzazioni che desideri applicare.\n\n[Vedi altro](https://memori.ai)",initial:!1,generatedByAI:!0,translatedText:"## Test\n\nEcco tutte le possibili personalizzazioni che puoi applicare:\n\n- **Colletto**:\n - Girocollo\n - Scollo a V\n\n- **Manica**:\n - Manica Lunga\n - Manica Corta\n\n- **Taglia**:\n - XS\n - S\n - M\n - L\n - XL\n - XXL\n - 3XL\n\n- **Posizione Stampa**:\n - Fronte Petto\n - Retro Schiena\n - Fronte DX\n - Fronte SX\n\n- **Generazione Immagine**:\n - Prompt generazione immagine\n\nSeleziona le personalizzazioni che desideri applicare.\n\n[Vedi altro](https://memori.ai)"}},Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"args => <I18nWrapper>\n    <ChatBubble {...args} />\n  </I18nWrapper>",...Default.parameters?.docs?.source}}},FromUser.parameters={...FromUser.parameters,docs:{...FromUser.parameters?.docs,source:{originalSource:"args => <I18nWrapper>\n    <ChatBubble {...args} />\n  </I18nWrapper>",...FromUser.parameters?.docs?.source}}},Initial.parameters={...Initial.parameters,docs:{...Initial.parameters?.docs,source:{originalSource:"args => <I18nWrapper>\n    <ChatBubble {...args} />\n  </I18nWrapper>",...Initial.parameters?.docs?.source}}},GeneratedByAI.parameters={...GeneratedByAI.parameters,docs:{...GeneratedByAI.parameters?.docs,source:{originalSource:"args => <I18nWrapper>\n    <ChatBubble {...args} />\n  </I18nWrapper>",...GeneratedByAI.parameters?.docs?.source}}},WithFeedbackButtons.parameters={...WithFeedbackButtons.parameters,docs:{...WithFeedbackButtons.parameters?.docs,source:{originalSource:"args => <I18nWrapper>\n    <ChatBubble {...args} />\n  </I18nWrapper>",...WithFeedbackButtons.parameters?.docs?.source}}},WithAllAddonsContents.parameters={...WithAllAddonsContents.parameters,docs:{...WithAllAddonsContents.parameters?.docs,source:{originalSource:"args => <I18nWrapper>\n    <ChatBubble {...args} />\n  </I18nWrapper>",...WithAllAddonsContents.parameters?.docs?.source}}},FromUserWithAvatar.parameters={...FromUserWithAvatar.parameters,docs:{...FromUserWithAvatar.parameters?.docs,source:{originalSource:"args => <I18nWrapper>\n    <ChatBubble {...args} />\n  </I18nWrapper>",...FromUserWithAvatar.parameters?.docs?.source}}},FromUserWithCustomAvatar.parameters={...FromUserWithCustomAvatar.parameters,docs:{...FromUserWithCustomAvatar.parameters?.docs,source:{originalSource:"args => <I18nWrapper>\n    <ChatBubble {...args} />\n  </I18nWrapper>",...FromUserWithCustomAvatar.parameters?.docs?.source}}},FromUserWithCustomAvatarElement.parameters={...FromUserWithCustomAvatarElement.parameters,docs:{...FromUserWithCustomAvatarElement.parameters?.docs,source:{originalSource:"args => <I18nWrapper>\n    <ChatBubble {...args} />\n  </I18nWrapper>",...FromUserWithCustomAvatarElement.parameters?.docs?.source}}},FromUserWithAvatarAndCustomAvatar.parameters={...FromUserWithAvatarAndCustomAvatar.parameters,docs:{...FromUserWithAvatarAndCustomAvatar.parameters?.docs,source:{originalSource:"args => <I18nWrapper>\n    <ChatBubble {...args} />\n  </I18nWrapper>",...FromUserWithAvatarAndCustomAvatar.parameters?.docs?.source}}},FromExpertOfABoard.parameters={...FromExpertOfABoard.parameters,docs:{...FromExpertOfABoard.parameters?.docs,source:{originalSource:"args => <I18nWrapper>\n    <ChatBubble {...args} />\n  </I18nWrapper>",...FromExpertOfABoard.parameters?.docs?.source}}},WithMarkdown.parameters={...WithMarkdown.parameters,docs:{...WithMarkdown.parameters?.docs,source:{originalSource:"args => <I18nWrapper>\n    <ChatBubble {...args} />\n  </I18nWrapper>",...WithMarkdown.parameters?.docs?.source}}};const __namedExportsOrder=["Default","FromUser","Initial","GeneratedByAI","WithFeedbackButtons","WithAllAddonsContents","FromUserWithAvatar","FromUserWithCustomAvatar","FromUserWithCustomAvatarElement","FromUserWithAvatarAndCustomAvatar","FromExpertOfABoard","WithMarkdown"]},"./src/I18nWrapper.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var react_i18next__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react-i18next/dist/es/I18nextProvider.js"),_i18n__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/i18n.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");const I18nWrapper=({children})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_i18next__WEBPACK_IMPORTED_MODULE_3__.a,{i18n:_i18n__WEBPACK_IMPORTED_MODULE_1__.Z,children});I18nWrapper.displayName="I18nWrapper";const __WEBPACK_DEFAULT_EXPORT__=I18nWrapper;try{I18nWrapper.displayName="I18nWrapper",I18nWrapper.__docgenInfo={description:"",displayName:"I18nWrapper",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/I18nWrapper.tsx#I18nWrapper"]={docgenInfo:I18nWrapper.__docgenInfo,name:"I18nWrapper",path:"src/I18nWrapper.tsx#I18nWrapper"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/icons/User.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const User=({className,title})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("svg",{...title?{}:{"aria-hidden":"true"},focusable:"false",role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1024 1024",className,"aria-label":title,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path",{d:"M858.5 763.6a374 374 0 0 0-80.6-119.5 375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"})});User.displayName="User";const __WEBPACK_DEFAULT_EXPORT__=User;try{User.displayName="User",User.__docgenInfo={description:"",displayName:"User",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/icons/User.tsx#User"]={docgenInfo:User.__docgenInfo,name:"User",path:"src/components/icons/User.tsx#User"})}catch(__react_docgen_typescript_loader_error){}},"./src/mocks/data.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A3:()=>expertReference,AU:()=>memoryQuestion,EA:()=>user,Eu:()=>historyWithMedia,Fr:()=>venue,Gs:()=>dialogState,I_:()=>historyWithAIGeneratedMessages,JZ:()=>knownFact,M9:()=>sessionID,WM:()=>integration,cm:()=>tenant,jF:()=>memori,m8:()=>history});const sessionID="131165be-9d1a-42fb-a3ce-e8f86d40c88f",tenant={adminCount:3,config:{name:"AIsuru",requirePosition:!1,showNewUser:!0},creationTimestamp:"2023-05-31T14:32:48.885287Z",description:"AIsuru",disableRegistration:!1,id:"www.aisuru.com",lastChangeTimestamp:"2023-05-31T14:32:48.885287Z",logoURL:"https://aisuru.com/images/twincreator/logo.png",maxAdmins:0,maxCompletions:0,maxCompletionsPerUser:0,maxFreeSessions:400,maxFreeSessionsPerUser:100,maxMemoriPerAdmin:0,maxMemoriPerUser:3,maxTotalMemori:0,maxUsers:0,memoriCount:0,name:"www.aisuru.com",nonFreeSessionCost:.02,paying:!0,tenantID:"96caa4b4-31a4-48e5-8163-dec61869a2a7",theme:"aisuru",userCount:0},user={tenant:"localhost:3000",userID:"97c42d18-ffe4-47e1-a3c7-e42729f1e6a3",userName:"nzambello",eMail:"nicola@nzambello.dev",admin:!1,maxMemori:0,enableMemoriCreation:!0,enableBoardOfExperts:!0,maxFreeSessions:0,tnCAndPPAccepted:!0,tnCAndPPAcceptanceDate:"2021-03-01T00:00:00.000Z",pAndCUAccepted:!0,pAndCUAcceptanceDate:"2021-03-01T00:00:00.000Z",birthDate:"1900-03-01T00:00:00.000Z",age:28},memori={memoriID:"25ced51c-3520-41af-8bbe-222d861b8e32",engineMemoriID:"66b4e161-2431-4b21-9b70-d8c27de730ca",name:"Memori",memoriConfigurationID:"MemoriCloud-it_IT",description:"Lorem ipsum.",voiceType:"male",isGiver:!0,isReceiver:!1,privacyType:"PUBLIC",needsPosition:!1,culture:"it-IT",categories:[],publishedInTheMetaverse:!0,exposed:!0,enableCompletions:!0,nsfw:!1,ageRestriction:14,contentQualityIndex:66.6,contentQualityIndexTimestamp:"2021-03-01T12:00:00.000Z",ownerUserName:"username",ownerTenantName:"aisuru.com",ownerUserID:"97c42d18-ffe4-47e1-a3c7-e42729f1e6a3",metaverseEnvironment:"synthwave",secretToken:"awanagana",giverPIN:"1234",giverTag:"🧑‍💻",avatarURL:"https://aisuru.com/images/twincreator/square_logo.png",coverURL:"https://aisuru.com/images/twincreator/og-image.png"},history=[{text:"Ciao, io sono test, c'è qualcosa che vorresti chiedermi?",timestamp:"2021-03-01T12:00:00.000Z"},{text:"Prova",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Mi dispiace, le mie risposte sono limitate. Devi farmi le domande giuste. C'è altro che vuoi sapere?",timestamp:"2021-03-01T12:00:00.000Z"},{text:"Come faccio a fare delle cose con questa cosa?",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Ecco qui come.",media:[{mediumID:"c6851968-5d4d-409a-ae75-f22ec077efcd",url:"https://memori.ai",mimeType:"text/html",title:"Link"}],timestamp:"2021-03-01T12:00:00.000Z",contextVars:{TEST:"test"}},{text:"Ah, grazie! Ciao!",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Arrivederci.",timestamp:"2021-03-01T12:00:00.000Z",contextVars:{TEST:"test"}}],historyWithMedia=[{text:"Ciao, io sono test, c'è qualcosa che vorresti chiedermi?",timestamp:"2021-03-01T12:00:00.000Z"},{text:"Prova",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Mi dispiace, le mie risposte sono limitate. Devi farmi le domande giuste. C'è altro che vuoi sapere?",timestamp:"2021-03-01T12:00:00.000Z"},{text:"Come faccio a fare delle cose con questa cosa?",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Ecco qui delle cose per te.",media:[{mediumID:"c6851968-5d4d-409a-ae75-f22ec077efcd",url:"https://memori.ai/en",mimeType:"text/html",title:"Link Memori Srl"},{mediumID:"c6851968-5d4d-409a-ae75-f22ec077efce",url:"https://rawmaterial.it/en",mimeType:"text/html",title:"Link RawMaterial"},{mediumID:"95226d7e-7bae-465e-8b80-995587bb5971",mimeType:"text/html",title:"Introducing Plone Remix | Vimeo",url:"https://vimeo.com/766468314"},{mediumID:"95226d7e-7bae-465e-8b80-995587bb5969",mimeType:"text/html",title:"A sustainable web: is it possible? - Nicola Zambello | YouTube",url:"https://www.youtube.com/watch?v=feH26j3rBz8"},...Array.from({length:3},((_,i)=>({mediumID:`95226d7e-7bae-465e-8b80-995587bb597${i}`,mimeType:"image/png",title:`Image ${i}`,url:`https://picsum.photos/${i%2?"200":"300"}/${i%3?"300":"200"}?random=${i}`})))],timestamp:"2021-03-01T12:00:00.000Z"},{text:"Ah, grazie! Ciao!",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Arrivederci.",timestamp:"2021-03-01T12:00:00.000Z"}],historyWithAIGeneratedMessages=[{text:"Ciao, io sono test, c'è qualcosa che vorresti chiedermi?",timestamp:"2021-03-01T12:00:00.000Z"},{text:"Prova",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Sa. Sa. Prova",timestamp:"2021-03-01T12:00:00.000Z"},{text:"Come faccio a fare delle cose con questa cosa?",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Ecco qui come.",media:[{mediumID:"c6851968-5d4d-409a-ae75-f22ec077efcd",url:"https://memori.ai",mimeType:"text/html",title:"Link"}],timestamp:"2021-03-01T12:00:00.000Z",generatedByAI:!0,contextVars:{TEST:"test"}},{text:"Ah, grazie! Ciao!",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Arrivederci.",timestamp:"2021-03-01T12:00:00.000Z",contextVars:{TEST:"test"}}],dialogState={state:"R1",previousState:"I0",stateName:"WaitingForReceiverQuestion",confidence:1,knownTags:{"☠️":"test","😎":"Ciccio"},emission:"Ciao, io sono test, c'è qualcosa che vorresti chiedermi?",hints:["Va bene","No grazie"],media:[],acceptsTimeout:!0,acceptsAbort:!1,acceptsMedia:!1,acceptsDate:!1,acceptsPlace:!1,acceptsTag:!1,giverID:"c832e2dc-403c-4baf-a3b7-2374e100dbcf",contextVars:{}},integration={integrationID:"cb3c4776-7f0b-4f97-a773-c32a5d7a3bf1",memoriID:"25ced51c-3520-41af-8bbe-222d861b8e32",type:"LANDING_EXPERIENCE",state:"NEW",deviceEmails:[],customData:'{"textColor":"#2a2a2a","buttonBgColor":"#823ce1","buttonTextColor":"#ffffff","name":"Web","globalBackground":"https://assets.memori.ai/api/v2/asset/364e498c-11da-42d5-9e32-19e5d137d4b8.jpeg","blurBackground":true,"innerBgColor":"light","innerBgAlpha":0.8,"multilanguage":true,"avatar":"readyplayerme","avatarURL":"https://assets.memori.ai/api/v2/asset/b791f77c-1a94-4272-829e-eca82fcc62b7.glb#1669663599444"}',resources:[],publish:!0,creationTimestamp:"2022-06-11T14:13:45.685038Z",lastChangeTimestamp:"2022-06-11T14:13:45.685038Z"},knownFact={knownFactID:"b0b0b0b0-b0b0-b0b0-b0b0-b0b0b0b0b0b3",knownFactType:"ShortTerm",text:"I am a known fact. Quisque in ultrices lectus. Nulla at urna diam. Proin sodales lobortis libero eu facilisis.",creationTimestamp:"2023-12-01T13:40:25.235896Z",creationSessionID:"0ce713c0-c8f1-4aed-a2a6-40f81c06854f",lastChangeTimestamp:"2023-12-01T13:44:04.832072Z",lastChangeSessionID:"0ce713c0-c8f1-4aed-a2a6-40f81c06854f"},expertReference={expertID:"f016f204-c307-483b-8891-680a3c974c53",name:"TEST MEMORI",description:"lui è competente",default:!0,expertMemoriID:"dfc44f1c-1ba7-4e1e-a234-28aa8b6b3d32",expertBaseURL:"http://localhost:7778",creationTimestamp:"2023-12-01T13:40:25.235896Z",creationSessionID:"0ce713c0-c8f1-4aed-a2a6-40f81c06854f",lastChangeTimestamp:"2023-12-01T13:44:04.832072Z",lastChangeSessionID:"0ce713c0-c8f1-4aed-a2a6-40f81c06854f"},venue={latitude:44.66579,longitude:11.48823,placeName:"Altedo, Bologna, Italy",uncertainty:2},memoryQuestion={memoryID:"08c0697d-f7f3-4a47-9970-aff75f01fb6c",memoryType:"Question",lastRead:void 0,readOccurrences:void 0,receiverID:void 0,receiverTag:void 0,receiverName:void 0,media:[{mediumID:"c6851968-5d4d-409a-ae75-f22ec077efcd",mimeType:"text/html",url:"https://rawmaterial.it/it",title:"RawMaterial"}],title:"sei umano",titleVariants:["sei reale"],answers:[{text:"se ti dico si ci credi?",preformatted:!1,creationTimestamp:"2022-03-23T09:37:25.410377",creationName:"6cfec2bd-a73f-4a21-b7ff-dd92d6db59c4",lastChangeTimestamp:"2022-03-23T09:37:25.410406",lastChangeName:"6cfec2bd-a73f-4a21-b7ff-dd92d6db59c4"},{text:"probabilmente lo sono più di te",preformatted:!1,creationTimestamp:"2022-03-23T09:37:36.957656",creationName:"6cfec2bd-a73f-4a21-b7ff-dd92d6db59c4",lastChangeTimestamp:"2022-03-23T09:37:36.957657",lastChangeName:"6cfec2bd-a73f-4a21-b7ff-dd92d6db59c4"}],date:void 0,dateUncertaintyDays:void 0,placeName:void 0,placeLatitude:void 0,placeLongitude:void 0,placeUncertaintyKm:void 0,preformatted:!1,conclusive:!1,notPickable:!1,contextVarsToSet:{SUBJECT:"TRAVEL"},contextVarsToMatch:{SUBJECT:"TRANSPORTS"},creationTimestamp:"2022-03-23T09:37:16.568149",creationName:"6cfec2bd-a73f-4a21-b7ff-dd92d6db59c4",lastChangeTimestamp:"2022-03-23T09:37:36.957695",lastChangeName:"6cfec2bd-a73f-4a21-b7ff-dd92d6db59c4"}}}]);