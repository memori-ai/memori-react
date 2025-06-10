"use strict";(self.webpackChunk_memori_ai_memori_react=self.webpackChunk_memori_ai_memori_react||[]).push([[9856],{"./src/components/LoginDrawer/LoginDrawer.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{ChangePassword:()=>ChangePassword,Default:()=>Default,LoggedIn:()=>LoggedIn,NeedsMissingData:()=>NeedsMissingData,Signup:()=>Signup,SignupWaitingForOtp:()=>SignupWaitingForOtp,__namedExportsOrder:()=>__namedExportsOrder,default:()=>LoginDrawer_stories});__webpack_require__("./node_modules/react/index.js");var I18nWrapper=__webpack_require__("./src/I18nWrapper.tsx"),LoginDrawer=__webpack_require__("./src/components/LoginDrawer/LoginDrawer.tsx"),data=__webpack_require__("./src/mocks/data.ts"),esm=__webpack_require__("./node_modules/@memori.ai/memori-api-client/esm/index.js"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),LoginDrawer_LoginDrawer=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[7].use[1]!./src/components/LoginDrawer/LoginDrawer.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(LoginDrawer_LoginDrawer.Z,options);LoginDrawer_LoginDrawer.Z&&LoginDrawer_LoginDrawer.Z.locals&&LoginDrawer_LoginDrawer.Z.locals;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const LoginDrawer_stories={title:"Widget/LoginDrawer",component:LoginDrawer.Z,argTypes:{open:{control:{type:"boolean"}}},parameters:{controls:{expanded:!0}}},Template=args=>(0,jsx_runtime.jsx)(I18nWrapper.Z,{children:(0,jsx_runtime.jsx)(LoginDrawer.Z,{...args,onClose:()=>{},onLogin:console.log,onLogout:()=>{},tenant:data.cm,apiClient:(0,esm.Z)()})});Template.displayName="Template";const Default=Template.bind({});Default.args={open:!0};const NeedsMissingData=Template.bind({});NeedsMissingData.args={open:!0,__TEST__needMissingData:!0};const Signup=Template.bind({});Signup.args={open:!0,__TEST__signup:!0};const SignupWaitingForOtp=Template.bind({});SignupWaitingForOtp.args={open:!0,__TEST__signup:!0,__TEST__waitingForOtp:!0};const ChangePassword=Template.bind({});ChangePassword.args={open:!0,__TEST__changePwd:!0};const LoggedIn=Template.bind({});LoggedIn.args={open:!0,user:data.EA,loginToken:"token"},Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"args => {\n  return <I18nWrapper>\n      <LoginDrawer {...args} onClose={() => {}} onLogin={console.log} onLogout={() => {}} tenant={tenant} apiClient={memoriApiClient()} />\n    </I18nWrapper>;\n}",...Default.parameters?.docs?.source}}},NeedsMissingData.parameters={...NeedsMissingData.parameters,docs:{...NeedsMissingData.parameters?.docs,source:{originalSource:"args => {\n  return <I18nWrapper>\n      <LoginDrawer {...args} onClose={() => {}} onLogin={console.log} onLogout={() => {}} tenant={tenant} apiClient={memoriApiClient()} />\n    </I18nWrapper>;\n}",...NeedsMissingData.parameters?.docs?.source}}},Signup.parameters={...Signup.parameters,docs:{...Signup.parameters?.docs,source:{originalSource:"args => {\n  return <I18nWrapper>\n      <LoginDrawer {...args} onClose={() => {}} onLogin={console.log} onLogout={() => {}} tenant={tenant} apiClient={memoriApiClient()} />\n    </I18nWrapper>;\n}",...Signup.parameters?.docs?.source}}},SignupWaitingForOtp.parameters={...SignupWaitingForOtp.parameters,docs:{...SignupWaitingForOtp.parameters?.docs,source:{originalSource:"args => {\n  return <I18nWrapper>\n      <LoginDrawer {...args} onClose={() => {}} onLogin={console.log} onLogout={() => {}} tenant={tenant} apiClient={memoriApiClient()} />\n    </I18nWrapper>;\n}",...SignupWaitingForOtp.parameters?.docs?.source}}},ChangePassword.parameters={...ChangePassword.parameters,docs:{...ChangePassword.parameters?.docs,source:{originalSource:"args => {\n  return <I18nWrapper>\n      <LoginDrawer {...args} onClose={() => {}} onLogin={console.log} onLogout={() => {}} tenant={tenant} apiClient={memoriApiClient()} />\n    </I18nWrapper>;\n}",...ChangePassword.parameters?.docs?.source}}},LoggedIn.parameters={...LoggedIn.parameters,docs:{...LoggedIn.parameters?.docs,source:{originalSource:"args => {\n  return <I18nWrapper>\n      <LoginDrawer {...args} onClose={() => {}} onLogin={console.log} onLogout={() => {}} tenant={tenant} apiClient={memoriApiClient()} />\n    </I18nWrapper>;\n}",...LoggedIn.parameters?.docs?.source}}};const __namedExportsOrder=["Default","NeedsMissingData","Signup","SignupWaitingForOtp","ChangePassword","LoggedIn"]},"./src/helpers/utils.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Av:()=>isSkinnedMesh,Cb:()=>stripHTML,DI:()=>useDebounceFn,LV:()=>stripMarkdown,NX:()=>safeParseJSON,SP:()=>pwdRegEx,WO:()=>installMathJax,bw:()=>cleanUrl,cm:()=>usernameRegEx,h:()=>stripEmojis,hs:()=>mailRegEx,kh:()=>stripOutputTags,lc:()=>correctMaterials,r:()=>escapeHTML,vw:()=>stripDuplicates,xZ:()=>hasTouchscreen});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),three__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/three/build/three.module.js");const hasTouchscreen=()=>{let hasTouchScreen=!1;if("undefined"==typeof window||"undefined"==typeof navigator)return hasTouchScreen;if("maxTouchPoints"in navigator)hasTouchScreen=navigator.maxTouchPoints>0;else if("msMaxTouchPoints"in navigator)hasTouchScreen=navigator.msMaxTouchPoints>0;else{const mQ=window&&"matchMedia"in window&&matchMedia("(pointer:coarse)");if(mQ&&"(pointer:coarse)"===mQ.media)hasTouchScreen=!!mQ.matches;else if("orientation"in window)hasTouchScreen=!0;else{var UA=navigator?.userAgent;hasTouchScreen=/\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA)||/\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)}}return hasTouchScreen},pwdRegEx=/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$_:;|,~+=\{\}\[\]%^&*-]).{8,}$/,mailRegEx=/^\w+([.-]?[+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,usernameRegEx=/^(?!.*\.\.)(?!.*\.$)[^\W][\w.+-]{2,32}$/;function useDebounceFn(fn,delay){const timeoutId=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(),originalFn=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);return(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>(originalFn.current=fn,()=>{originalFn.current=null})),[fn]),(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>()=>{clearTimeout(timeoutId.current)}),[]),(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)((()=>(...args)=>{clearTimeout(timeoutId.current),timeoutId.current=window.setTimeout((()=>{originalFn.current&&originalFn.current(...args)}),delay)}),[delay])}const stripDuplicates=text=>text.slice(0,text.length/2).trim().toLowerCase()===text.slice(text.length/2+1).trim().toLowerCase()?text.slice(0,text.length/2):text,stripEmojis=text=>text.replaceAll(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu,"").trim(),stripMarkdown=text=>text=(text=(text=(text=(text=(text=(text=(text=(text=(text=(text=(text=(text=(text=(text=(text=(text=(text=text.replaceAll(/```*?```/g,"")).replaceAll(/```[\s\S]*?```/g,"")).replaceAll(/`[^`]*`/g,"")).replaceAll(/!\[[^\]]*\]\([^)]*\)/g,"")).replaceAll(/\[([^\]]*)\]\([^)]*\)/g,"$1")).replaceAll(/^> /gm,"")).replaceAll(/^#+ /gm,"")).replaceAll(/[*_]/g,"")).replaceAll(/---/g,"")).replaceAll(/~~/g,"")).replaceAll(/^\s*[-*+] /gm,"")).replaceAll(/^\s*\d+\.\s+/gm,"")).replaceAll(/^\|.*\|$/gm,"")).replaceAll(/\$\$[\s\S]*?\$\$/g,"")).replaceAll(/\$[\s\S]*?\$/g,"")).replaceAll(/\\\([\s\S]*?\\\)/g,"")).replaceAll(/\\\[[\s\S]*?\\\]/g,"")).replaceAll(/\s+/g," ").trim(),stripOutputTags=text=>{const outputTagRegex=/<output.*?<\/output>/gs;if(!outputTagRegex.test(text))return text;const strippedText=text.replace(outputTagRegex,"");return stripOutputTags(strippedText)},stripHTML=text=>{const el=document.createElement("div");return el.innerHTML=text,el.textContent||""},escapeHTML=text=>{const el=document.createElement("textarea");return el.textContent=text,el.innerHTML};function cleanUrl(href){try{href=encodeURI(href).replace(/%25/g,"%")}catch(e){return null}return href}const mathJaxConfig={startup:{elements:[".memori-chat--bubble-content"]},options:{processHtmlClass:"memori-chat--bubble-content"},tex:{inlineMath:[["$","$"],["\\$","\\$"]],displayMath:[["$$","$$"]],processEscapes:!0},asciimath:{fixphi:!0,displaystyle:!0,decimalsign:"."},skipStartupTypeset:!0,chtml:{displayAlign:"left"},svg:{fontCache:"global"}},installMathJax=()=>{window.MathJax=mathJaxConfig,(()=>{const script=document.createElement("script");script.src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js",script.async=!0,script.id="mathjax-script",document.head.appendChild(script)})()};function correctMaterials(materials){Object.values(materials).forEach((material=>{material instanceof three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial&&(material.roughness=.8,material.metalness=.1,material.shadowSide=2,material.map&&(material.map.anisotropy=16))}))}function isSkinnedMesh(object){return!0===object.isSkinnedMesh}const safeParseJSON=(jsonString,fallbackString=!1)=>{try{return JSON.parse(jsonString)}catch(error){return fallbackString?jsonString:null}}},"./src/mocks/data.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A3:()=>expertReference,EA:()=>user,Eu:()=>historyWithMedia,Fr:()=>venue,Gs:()=>dialogState,I_:()=>historyWithAIGeneratedMessages,J6:()=>historyWithExpandable,JZ:()=>knownFact,M9:()=>sessionID,WM:()=>integration,cm:()=>tenant,jF:()=>memori,m8:()=>history});const sessionID="131165be-9d1a-42fb-a3ce-e8f86d40c88f",tenant={tenantID:"96caa4b4-31a4-48e5-8163-dec61869a2a7",name:"www.aisuru.com",description:"AIsuru",adminCount:3,creationTimestamp:"2023-05-31T14:32:48.885287Z",disableRegistration:!1,lastChangeTimestamp:"2023-05-31T14:32:48.885287Z",logoURL:"https://aisuru.com/images/aisuru/logo.png",maxAdmins:0,maxCompletions:0,maxCompletionsPerUser:0,maxFreeSessions:400,maxFreeSessionsPerUser:100,maxMemoriPerAdmin:0,maxMemoriPerUser:3,maxTotalMemori:0,maxUsers:0,memoriCount:0,nonFreeSessionCost:.02,paying:!0,theme:"aisuru",userCount:0},user={tenant:"localhost:3000",userID:"97c42d18-ffe4-47e1-a3c7-e42729f1e6a3",userName:"nzambello",eMail:"nicola@nzambello.dev",admin:!1,maxMemori:0,enableMemoriCreation:!0,enableBoardOfExperts:!0,maxFreeSessions:0,tnCAndPPAccepted:!0,tnCAndPPAcceptanceDate:"2021-03-01T00:00:00.000Z",pAndCUAccepted:!0,pAndCUAcceptanceDate:"2021-03-01T00:00:00.000Z",birthDate:"1900-03-01T00:00:00.000Z",age:28,avatarURL:"https://avatars.githubusercontent.com/u/21101435?v=4"},memori={memoriID:"25ced51c-3520-41af-8bbe-222d861b8e32",engineMemoriID:"66b4e161-2431-4b21-9b70-d8c27de730ca",name:"Memori",memoriConfigurationID:"MemoriCloud-it_IT",description:"Lorem ipsum.",voiceType:"male",isGiver:!0,isReceiver:!1,privacyType:"PUBLIC",needsPosition:!1,culture:"it-IT",categories:[],publishedInTheMetaverse:!0,exposed:!0,enableCompletions:!0,nsfw:!1,ageRestriction:14,contentQualityIndex:66.6,contentQualityIndexTimestamp:"2021-03-01T12:00:00.000Z",ownerUserName:"username",ownerTenantName:"aisuru.com",ownerUserID:"97c42d18-ffe4-47e1-a3c7-e42729f1e6a3",metaverseEnvironment:"synthwave",secretToken:"awanagana",giverPIN:"1234",giverTag:"🧑‍💻",avatarURL:"https://aisuru.com/images/aisuru/square_logo.png",coverURL:"https://aisuru.com/images/aisuru/og-image.png"},history=[{text:"Ciao, io sono test, c'è qualcosa che vorresti chiedermi?",timestamp:"2021-03-01T12:00:00.000Z"},{text:"Prova",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Mi dispiace, le mie risposte sono limitate. Devi farmi le domande giuste. C'è altro che vuoi sapere?",timestamp:"2021-03-01T12:00:00.000Z"},{text:"Come faccio a fare delle cose con questa cosa?",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Ecco qui come.",media:[{mediumID:"c6851968-5d4d-409a-ae75-f22ec077efcd",url:"https://memori.ai",mimeType:"text/html",title:"Link"}],timestamp:"2021-03-01T12:00:00.000Z",contextVars:{TEST:"test"}},{text:"Ah, grazie! Ciao!",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Arrivederci.",timestamp:"2021-03-01T12:00:00.000Z",contextVars:{TEST:"test"}}],historyWithMedia=[{text:"Ciao, io sono test, c'è qualcosa che vorresti chiedermi?",timestamp:"2021-03-01T12:00:00.000Z"},{text:"Prova",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Mi dispiace, le mie risposte sono limitate. Devi farmi le domande giuste. C'è altro che vuoi sapere?",timestamp:"2021-03-01T12:00:00.000Z"},{text:"Come faccio a fare delle cose con questa cosa?",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Ecco qui delle cose per te.",media:[{mediumID:"c6851968-5d4d-409a-ae75-f22ec077efcd",url:"https://memori.ai/en",mimeType:"text/html",title:"Link Memori Srl"},{mediumID:"c6851968-5d4d-409a-ae75-f22ec077efce",url:"https://rawmaterial.it/en",mimeType:"text/html",title:"Link RawMaterial"},{mediumID:"95226d7e-7bae-465e-8b80-995587bb5971",mimeType:"text/html",title:"Introducing Plone Remix | Vimeo",url:"https://vimeo.com/766468314"},{mediumID:"95226d7e-7bae-465e-8b80-995587bb5969",mimeType:"text/html",title:"A sustainable web: is it possible? - Nicola Zambello | YouTube",url:"https://www.youtube.com/watch?v=feH26j3rBz8"},...Array.from({length:3},((_,i)=>({mediumID:`95226d7e-7bae-465e-8b80-995587bb597${i}`,mimeType:"image/png",title:`Image ${i}`,url:`https://picsum.photos/${i%2?"200":"300"}/${i%3?"300":"200"}?random=${i}`})))],timestamp:"2021-03-01T12:00:00.000Z"},{text:"Ah, grazie! Ciao!",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Arrivederci.",timestamp:"2021-03-01T12:00:00.000Z"}],historyWithAIGeneratedMessages=[{text:"Ciao, io sono test, c'è qualcosa che vorresti chiedermi?",timestamp:"2021-03-01T12:00:00.000Z"},{text:"Prova",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Sa. Sa. Prova",timestamp:"2021-03-01T12:00:00.000Z"},{text:"Come faccio a fare delle cose con questa cosa?",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Ecco qui come.",media:[{mediumID:"c6851968-5d4d-409a-ae75-f22ec077efcd",url:"https://memori.ai",mimeType:"text/html",title:"Link"}],timestamp:"2021-03-01T12:00:00.000Z",generatedByAI:!0,contextVars:{TEST:"test"}},{text:"Ah, grazie! Ciao!",fromUser:!0,timestamp:"2021-03-01T12:00:00.000Z"},{text:"Arrivederci.",timestamp:"2021-03-01T12:00:00.000Z",contextVars:{TEST:"test"}}],dialogState={state:"R1",previousState:"I0",stateName:"WaitingForReceiverQuestion",confidence:1,knownTags:{"☠️":"test","😎":"Ciccio"},emission:"Ciao, io sono test, c'è qualcosa che vorresti chiedermi?",hints:["Va bene","No grazie"],media:[],acceptsTimeout:!0,acceptsAbort:!1,acceptsMedia:!1,acceptsDate:!1,acceptsPlace:!1,acceptsTag:!1,giverID:"c832e2dc-403c-4baf-a3b7-2374e100dbcf",contextVars:{}},integration={integrationID:"cb3c4776-7f0b-4f97-a773-c32a5d7a3bf1",memoriID:"25ced51c-3520-41af-8bbe-222d861b8e32",type:"LANDING_EXPERIENCE",state:"NEW",deviceEmails:[],customData:'{"textColor":"#2a2a2a","buttonBgColor":"#823ce1","buttonTextColor":"#ffffff","name":"Web","globalBackground":"https://assets.memori.ai/api/v2/asset/364e498c-11da-42d5-9e32-19e5d137d4b8.jpeg","blurBackground":true,"innerBgColor":"light","innerBgAlpha":0.8,"multilanguage":true,"avatar":"readyplayerme","avatarURL":"https://assets.memori.ai/api/v2/asset/b791f77c-1a94-4272-829e-eca82fcc62b7.glb#1669663599444"}',resources:[],publish:!0,creationTimestamp:"2022-06-11T14:13:45.685038Z",lastChangeTimestamp:"2022-06-11T14:13:45.685038Z"},knownFact={knownFactID:"b0b0b0b0-b0b0-b0b0-b0b0-b0b0b0b0b0b3",knownFactType:"ShortTerm",text:"I am a known fact. Quisque in ultrices lectus. Nulla at urna diam. Proin sodales lobortis libero eu facilisis.",creationTimestamp:"2023-12-01T13:40:25.235896Z",creationSessionID:"0ce713c0-c8f1-4aed-a2a6-40f81c06854f",lastChangeTimestamp:"2023-12-01T13:44:04.832072Z",lastChangeSessionID:"0ce713c0-c8f1-4aed-a2a6-40f81c06854f"},expertReference={expertID:"f016f204-c307-483b-8891-680a3c974c53",name:"TEST MEMORI",description:"lui è competente",default:!0,expertMemoriID:"dfc44f1c-1ba7-4e1e-a234-28aa8b6b3d32",expertBaseURL:"http://localhost:7778",creationTimestamp:"2023-12-01T13:40:25.235896Z",creationSessionID:"0ce713c0-c8f1-4aed-a2a6-40f81c06854f",lastChangeTimestamp:"2023-12-01T13:44:04.832072Z",lastChangeSessionID:"0ce713c0-c8f1-4aed-a2a6-40f81c06854f"},venue={latitude:44.66579,longitude:11.48823,placeName:"Altedo, Bologna, Italy",uncertainty:2},historyWithExpandable=[{text:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",timestamp:"2021-03-01T12:00:00.000Z",fromUser:!0}]},"./node_modules/react-hot-toast/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{x7:()=>Ie,ZP:()=>_t});var react=__webpack_require__("./node_modules/react/index.js");let e={data:""},t=t=>"object"==typeof window?((t?t.querySelector("#_goober"):window._goober)||Object.assign((t||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:t||e,l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,a=/\/\*[^]*?\*\/|  +/g,n=/\n+/g,o=(e,t)=>{let r="",l="",a="";for(let n in e){let c=e[n];"@"==n[0]?"i"==n[1]?r=n+" "+c+";":l+="f"==n[1]?o(c,n):n+"{"+o(c,"k"==n[1]?"":t)+"}":"object"==typeof c?l+=o(c,t?t.replace(/([^,])+/g,(e=>n.replace(/(^:.*)|([^,])+/g,(t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)))):n):null!=c&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=o.p?o.p(n,c):n+":"+c+";")}return r+(t&&a?t+"{"+a+"}":a)+l},c={},s=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+s(e[r]);return t}return e},i=(e,t,r,i,p)=>{let u=s(e),d=c[u]||(c[u]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(u));if(!c[d]){let t=u!==e?e:(e=>{let t,r,o=[{}];for(;t=l.exec(e.replace(a,""));)t[4]?o.shift():t[3]?(r=t[3].replace(n," ").trim(),o.unshift(o[0][r]=o[0][r]||{})):o[0][t[1]]=t[2].replace(n," ").trim();return o[0]})(e);c[d]=o(p?{["@keyframes "+d]:t}:t,r?"":"."+d)}let f=r&&c.g?c.g:null;return r&&(c.g=c[d]),((e,t,r,l)=>{l?t.data=t.data.replace(l,e):-1===t.data.indexOf(e)&&(t.data=r?e+t.data:t.data+e)})(c[d],t,i,f),d},p=(e,t,r)=>e.reduce(((e,l,a)=>{let n=t[a];if(n&&n.call){let e=n(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;n=t?"."+t:e&&"object"==typeof e?e.props?"":o(e,""):!1===e?"":e}return e+l+(null==n?"":n)}),"");function u(e){let r=this||{},l=e.call?e(r.p):e;return i(l.unshift?l.raw?p(l,[].slice.call(arguments,1),r.p):l.reduce(((e,t)=>Object.assign(e,t&&t.call?t(r.p):t)),{}):l,t(r.target),r.g,r.o,r.k)}u.bind({g:1});let d,f,g,h=u.bind({k:1});function j(e,t){let r=this||{};return function(){let l=arguments;function a(n,o){let c=Object.assign({},n),s=c.className||a.className;r.p=Object.assign({theme:f&&f()},c),r.o=/ *go\d+/.test(s),c.className=u.apply(r,l)+(s?" "+s:""),t&&(c.ref=o);let i=e;return e[0]&&(i=c.as||e,delete c.as),g&&i[0]&&g(c),d(i,c)}return t?t(a):a}}var T=(e,t)=>(e=>"function"==typeof e)(e)?e(t):e,U=(()=>{let e=0;return()=>(++e).toString()})(),dist_b=(()=>{let e;return()=>{if(void 0===e&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),S=new Map,$=e=>{if(S.has(e))return;let t=setTimeout((()=>{S.delete(e),dist_u({type:4,toastId:e})}),1e3);S.set(e,t)},v=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return t.toast.id&&(e=>{let t=S.get(e);t&&clearTimeout(t)})(t.toast.id),{...e,toasts:e.toasts.map((r=>r.id===t.toast.id?{...r,...t.toast}:r))};case 2:let{toast:o}=t;return e.toasts.find((r=>r.id===o.id))?v(e,{type:1,toast:o}):v(e,{type:0,toast:o});case 3:let{toastId:s}=t;return s?$(s):e.toasts.forEach((r=>{$(r.id)})),{...e,toasts:e.toasts.map((r=>r.id===s||void 0===s?{...r,visible:!1}:r))};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter((r=>r.id!==t.toastId))};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map((r=>({...r,pauseDuration:r.pauseDuration+a})))}}},A=[],P={toasts:[],pausedAt:void 0},dist_u=e=>{P=v(P,e),A.forEach((t=>{t(P)}))},Y={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},dist_h=e=>(t,o)=>{let s=((e,t="blank",o)=>({createdAt:Date.now(),visible:!0,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...o,id:(null==o?void 0:o.id)||U()}))(t,e,o);return dist_u({type:2,toast:s}),s.id},dist_n=(e,t)=>dist_h("blank")(e,t);dist_n.error=dist_h("error"),dist_n.success=dist_h("success"),dist_n.loading=dist_h("loading"),dist_n.custom=dist_h("custom"),dist_n.dismiss=e=>{dist_u({type:3,toastId:e})},dist_n.remove=e=>dist_u({type:4,toastId:e}),dist_n.promise=(e,t,o)=>{let s=dist_n.loading(t.loading,{...o,...null==o?void 0:o.loading});return e.then((a=>(dist_n.success(T(t.success,a),{id:s,...o,...null==o?void 0:o.success}),a))).catch((a=>{dist_n.error(T(t.error,a),{id:s,...o,...null==o?void 0:o.error})})),e};var Z=(e,t)=>{dist_u({type:1,toast:{id:e,height:t}})},ee=()=>{dist_u({type:5,time:Date.now()})},D=e=>{let{toasts:t,pausedAt:o}=((e={})=>{let[t,o]=(0,react.useState)(P);(0,react.useEffect)((()=>(A.push(o),()=>{let a=A.indexOf(o);a>-1&&A.splice(a,1)})),[t]);let s=t.toasts.map((a=>{var r,c;return{...e,...e[a.type],...a,duration:a.duration||(null==(r=e[a.type])?void 0:r.duration)||(null==e?void 0:e.duration)||Y[a.type],style:{...e.style,...null==(c=e[a.type])?void 0:c.style,...a.style}}}));return{...t,toasts:s}})(e);(0,react.useEffect)((()=>{if(o)return;let r=Date.now(),c=t.map((i=>{if(i.duration===1/0)return;let d=(i.duration||0)+i.pauseDuration-(r-i.createdAt);if(!(d<0))return setTimeout((()=>dist_n.dismiss(i.id)),d);i.visible&&dist_n.dismiss(i.id)}));return()=>{c.forEach((i=>i&&clearTimeout(i)))}}),[t,o]);let s=(0,react.useCallback)((()=>{o&&dist_u({type:6,time:Date.now()})}),[o]),a=(0,react.useCallback)(((r,c)=>{let{reverseOrder:i=!1,gutter:d=8,defaultPosition:p}=c||{},g=t.filter((m=>(m.position||p)===(r.position||p)&&m.height)),E=g.findIndex((m=>m.id===r.id)),x=g.filter(((m,R)=>R<E&&m.visible)).length;return g.filter((m=>m.visible)).slice(...i?[x+1]:[0,x]).reduce(((m,R)=>m+(R.height||0)+d),0)}),[t]);return{toasts:t,handlers:{updateHeight:Z,startPause:ee,endPause:s,calculateOffset:a}}},oe=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,re=h`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,se=h`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,_=j("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${oe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${re} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${se} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,ne=h`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,V=j("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${ne} 1s linear infinite;
`,pe=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,de=h`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,w=j("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${pe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${de} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,ue=j("div")`
  position: absolute;
`,le=j("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Te=h`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,fe=j("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Te} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,M=({toast:e})=>{let{icon:t,type:o,iconTheme:s}=e;return void 0!==t?"string"==typeof t?react.createElement(fe,null,t):t:"blank"===o?null:react.createElement(le,null,react.createElement(V,{...s}),"loading"!==o&&react.createElement(ue,null,"error"===o?react.createElement(_,{...s}):react.createElement(w,{...s})))},ye=e=>`\n0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}\n100% {transform: translate3d(0,0,0) scale(1); opacity:1;}\n`,ge=e=>`\n0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}\n100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}\n`,be=j("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Se=j("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,F=react.memo((({toast:e,position:t,style:o,children:s})=>{let a=e.height?((e,t)=>{let s=e.includes("top")?1:-1,[a,r]=dist_b()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[ye(s),ge(s)];return{animation:t?`${h(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${h(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},r=react.createElement(M,{toast:e}),c=react.createElement(Se,{...e.ariaProps},T(e.message,e));return react.createElement(be,{className:e.className,style:{...a,...o,...e.style}},"function"==typeof s?s({icon:r,message:c}):react.createElement(react.Fragment,null,r,c))}));!function m(e,t,r,l){o.p=t,d=e,f=r,g=l}(react.createElement);var Ee=({id:e,className:t,style:o,onHeightUpdate:s,children:a})=>{let r=react.useCallback((c=>{if(c){let i=()=>{let d=c.getBoundingClientRect().height;s(e,d)};i(),new MutationObserver(i).observe(c,{subtree:!0,childList:!0,characterData:!0})}}),[e,s]);return react.createElement("div",{ref:r,className:t,style:o},a)},ve=u`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,Ie=({reverseOrder:e,position:t="top-center",toastOptions:o,gutter:s,children:a,containerStyle:r,containerClassName:c})=>{let{toasts:i,handlers:d}=D(o);return react.createElement("div",{style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...r},className:c,onMouseEnter:d.startPause,onMouseLeave:d.endPause},i.map((p=>{let g=p.position||t,x=((e,t)=>{let o=e.includes("top"),s=o?{top:0}:{bottom:0},a=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:dist_b()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(o?1:-1)}px)`,...s,...a}})(g,d.calculateOffset(p,{reverseOrder:e,gutter:s,defaultPosition:t}));return react.createElement(Ee,{id:p.id,key:p.id,onHeightUpdate:d.updateHeight,className:p.visible?ve:"",style:x},"custom"===p.type?T(p.message,p):a?a(p):react.createElement(F,{toast:p,position:g}))})))},_t=dist_n}}]);
//# sourceMappingURL=components-LoginDrawer-LoginDrawer-stories.531016b8.iframe.bundle.js.map