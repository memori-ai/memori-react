"use strict";(self.webpackChunk_memori_ai_memori_react=self.webpackChunk_memori_ai_memori_react||[]).push([[9696],{"./src/components/ChatBubble/ChatBubble.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>ChatBubble_ChatBubble});var react=__webpack_require__("./node_modules/react/index.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),transition=__webpack_require__("./node_modules/@headlessui/react/dist/components/transitions/transition.js"),media=__webpack_require__("./src/helpers/media.ts"),User=__webpack_require__("./src/components/icons/User.tsx"),AI=__webpack_require__("./src/components/icons/AI.tsx"),Translation=__webpack_require__("./src/components/icons/Translation.tsx"),Tooltip=__webpack_require__("./src/components/ui/Tooltip.tsx"),FeedbackButtons=__webpack_require__("./src/components/FeedbackButtons/FeedbackButtons.tsx"),useTranslation=__webpack_require__("./node_modules/react-i18next/dist/es/useTranslation.js"),marked_esm=__webpack_require__("./node_modules/marked/lib/marked.esm.js"),purify=__webpack_require__("./node_modules/dompurify/dist/purify.js"),purify_default=__webpack_require__.n(purify),Button=__webpack_require__("./src/components/ui/Button.tsx"),QuestionHelp=__webpack_require__("./src/components/icons/QuestionHelp.tsx"),Copy=__webpack_require__("./src/components/icons/Copy.tsx"),Code=__webpack_require__("./src/components/icons/Code.tsx"),WhyThisAnswer=__webpack_require__("./src/components/WhyThisAnswer/WhyThisAnswer.tsx"),utils=__webpack_require__("./src/helpers/utils.ts"),src=__webpack_require__("./node_modules/marked-linkify-it/src/index.js"),marked_katex_extension_src=__webpack_require__("./node_modules/marked-katex-extension/src/index.js");const getTableCell=(text,cell,type,align)=>{if(!cell.rowspan)return"";return`${`<${type}`+(cell.colspan>1?` colspan=${cell.colspan}`:"")+(cell.rowspan>1?` rowspan=${cell.rowspan}`:"")+(align?` align=${align}`:"")+">"+text}</${type}>\n`},splitCells=(tableRow,count,prevRow=[])=>{const cells=[...tableRow.matchAll(/(?:[^|\\]|\\.?)+(?:\|+|$)/g)].map((x=>x[0]));cells[0]?.trim()||cells.shift(),cells[cells.length-1]?.trim()||cells.pop();let i,j,trimmedCell,prevCell,prevCols,numCols=0;for(i=0;i<cells.length;i++){if(trimmedCell=cells[i].split(/\|+$/)[0],cells[i]={rowspan:1,colspan:Math.max(cells[i].length-trimmedCell.length,1),text:trimmedCell.trim().replace(/\\\|/g,"|")},"^"===trimmedCell.slice(-1)&&prevRow.length)for(prevCols=0,j=0;j<prevRow.length;j++){if(prevCell=prevRow[j],prevCols===numCols&&prevCell.colspan===cells[i].colspan){cells[i].rowSpanTarget=prevCell.rowSpanTarget??prevCell,cells[i].rowSpanTarget.text+=` ${cells[i].text.slice(0,-1)}`,cells[i].rowSpanTarget.rowspan+=1,cells[i].rowspan=0;break}if(prevCols+=prevCell.colspan,prevCols>numCols)break}numCols+=cells[i].colspan}if(numCols>count)cells.splice(count);else for(;numCols<count;)cells.push({colspan:1,text:""}),numCols+=1;return cells};var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");marked_esm.TU.use({async:!1,gfm:!0,pedantic:!0,renderer:{link(href,title,text){const cleanHref=(0,utils.bw)(href);if(null===cleanHref)return text;let out='<a href="'+(href=cleanHref)+'"';return title&&(out+=' title="'+title+'"'),out+=' target="_blank" rel="noopener noreferrer">'+text+"</a>",out}}}),marked_esm.TU.use((0,src.Z)()),marked_esm.TU.use((0,marked_katex_extension_src.Z)({throwOnError:!1,output:"htmlAndMathml"})),marked_esm.TU.use(function markedExtendedTables(){return{extensions:[{name:"spanTable",level:"block",start:src=>src.match(/^\n *([^\n ].*\|.*)\n/)?.index,tokenizer(src,tokens){const cap=new RegExp("^ *([^\\n ].*\\|.*\\n(?: *[^\\s].*\\n)*?) {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n| {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)| {0,3}#{1,6} | {0,3}>| {4}[^\\n]| {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n| {0,3}(?:[*+-]|1[.)]) |<\\/?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?: +|\\n|\\/?>)|<(?:script|pre|style|textarea|!--)).*(?:\\n|$))*)\\n*|$)").exec(src);if(cap){const item={type:"spanTable",header:cap[1].replace(/\n$/,"").split("\n"),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),rows:cap[3]?cap[3].replace(/\n$/,"").split("\n"):[]};item.header[0]=splitCells(item.header[0]);const colCount=item.header[0].reduce(((length,header)=>length+header.colspan),0);if(colCount===item.align.length){let i,j,k,row;item.raw=cap[0];let l=item.align.length;for(i=0;i<l;i++)/^ *-+: *$/.test(item.align[i])?item.align[i]="right":/^ *:-+: *$/.test(item.align[i])?item.align[i]="center":/^ *:-+ *$/.test(item.align[i])?item.align[i]="left":item.align[i]=null;for(l=item.header.length,i=1;i<l;i++)item.header[i]=splitCells(item.header[i],colCount,item.header[i-1]);for(l=item.rows.length,i=0;i<l;i++)item.rows[i]=splitCells(item.rows[i],colCount,item.rows[i-1]);for(l=item.header.length,j=0;j<l;j++)for(row=item.header[j],k=0;k<row.length;k++)row[k].tokens=[],this.lexer.inline(row[k].text,row[k].tokens);for(l=item.rows.length,j=0;j<l;j++)for(row=item.rows[j],k=0;k<row.length;k++)row[k].tokens=[],this.lexer.inline(row[k].text,row[k].tokens);return item}}},renderer(token){let i,j,row,cell,col,text,output='<div class="memori--responsive-table-wrapper"><table class="memori--table memori--table--compact">';for(output+="<thead>",i=0;i<token.header.length;i++){row=token.header[i];let col=0;for(output+="<tr>",j=0;j<row.length;j++)cell=row[j],text=this.parser.parseInline(cell.tokens),output+=getTableCell(text,cell,"th",token.align[col]),col+=cell.colspan;output+="</tr>"}if(output+="</thead>",token.rows.length){for(output+="<tbody>",i=0;i<token.rows.length;i++){for(row=token.rows[i],col=0,output+="<tr>",j=0;j<row.length;j++)cell=row[j],text=this.parser.parseInline(cell.tokens),output+=getTableCell(text,cell,"td",token.align[col]),col+=cell.colspan;output+="</tr>"}output+="</tbody>"}return output+="</table></div>",output}}]}}());const ChatBubble=({message,memori,tenant,baseUrl,apiUrl,sessionID,showFeedback,showWhyThisAnswer=!0,showCopyButton=!0,showTranslationOriginal=!1,simulateUserPrompt,showAIicon=!0,isFirst=!1,user,userAvatar,experts})=>{const{t,i18n}=(0,useTranslation.$)(),lang=i18n.language||"en",[showingWhyThisAnswer,setShowingWhyThisAnswer]=(0,react.useState)(!1),text=message.translatedText||message.text,renderedText=message.fromUser?text:(text=>{try{return(text=>{let result="",isEscaped=!1;for(let i=0;i<text.length;i++)"["!==text[i]||isEscaped?"]"!==text[i]||isEscaped?result+=text[i]:result+="\\]":result+="\\[",isEscaped="\\"===text[i]&&!isEscaped;return result})(purify_default().sanitize(marked_esm.TU.parse(text.trim().replaceAll(/\[([^\]]+)\]\(([^\)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>').replaceAll(/```markdown([^```]+)```/g,"$1").replaceAll("($","( $").replaceAll(":$",": $").replaceAll("\frac","\\frac").replaceAll("\beta","\\beta").replaceAll("cdot","\\cdot")).trim().replace(/\n/g,"<br>"),{ADD_ATTR:["target"]})).replace(/(<br>)+/g,"<br>").replace(/<p><\/p>/g,"<br>").replace(/<p><br><\/p>/g,"<br>")}catch(e){return console.error(e),text}})(text),plainText=message.fromUser?text:(0,utils.Cb)((0,utils.kh)(renderedText));return(0,react.useLayoutEffect)((()=>{"undefined"==typeof window||message.fromUser||"MathJax"in window&&window.MathJax.typesetPromise&&window.MathJax.typesetPromise([".memori-chat--bubble-content"])}),[message.text,message.fromUser]),(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(message.initial||isFirst)&&(0,jsx_runtime.jsx)("div",{className:"memori-chat--bubble-initial"}),(0,jsx_runtime.jsxs)(transition.u,{show:!0,appear:!0,as:"div",className:classnames_default()("memori-chat--bubble-container",{"memori-chat--bubble-from-user":!!message.fromUser,"memori-chat--with-addon":message.generatedByAI&&showAIicon||showFeedback&&simulateUserPrompt}),children:[!message.fromUser&&(0,jsx_runtime.jsx)(transition.u.Child,{as:"picture",className:"memori-chat--bubble-avatar",enter:"transition ease-in-out duration-300",enterFrom:"opacity-0 scale-075 "+(message.fromUser?"translate-x-15":"translate-x--15"),enterTo:"opacity-1 scale-1 translate-x-0",leave:"transition ease-in-out duration-300",leaveFrom:"opacity-1 scale-1 translate-x-0",leaveTo:"opacity-0 scale-075 "+(message.fromUser?"translate-x-15":"translate-x--15"),title:message.emitter?.length&&memori.enableBoardOfExperts?message.emitter:memori.name,children:(0,jsx_runtime.jsx)("img",{className:"memori-chat--bubble-avatar-img",alt:message.emitter?.length&&memori.enableBoardOfExperts?message.emitter:memori.name,src:message.emitter?.length&&memori.enableBoardOfExperts&&experts?.find((e=>e.name===message.emitter))?`${apiUrl}/api/v1/memoriai/memori/avatar/${experts.find((e=>e.name===message.emitter))?.expertMemoriID}`:memori.avatarURL&&memori.avatarURL.length>0?(0,media.v)({type:"avatar",tenantID:tenant?.id,resourceURI:memori.avatarURL,baseURL:baseUrl,apiURL:apiUrl}):(0,media.v)({tenantID:tenant?.id,type:"avatar",baseURL:baseUrl||"https://www.aisuru.com",apiURL:apiUrl}),onError:e=>{e.currentTarget.src=memori.avatarURL&&memori.avatarURL.length>0?(0,media.v)({type:"avatar",tenantID:tenant?.id,resourceURI:memori.avatarURL,baseURL:baseUrl}):(0,media.v)({tenantID:tenant?.id,type:"avatar",baseURL:baseUrl}),e.currentTarget.onerror=null}})}),(0,jsx_runtime.jsxs)(transition.u.Child,{as:"div",className:classnames_default()("memori-chat--bubble",{"memori-chat--user-bubble":!!message.fromUser,"memori-chat--with-addon":!message.fromUser&&showCopyButton||message.generatedByAI&&showAIicon||showFeedback&&simulateUserPrompt,"memori-chat--ai-generated":message.generatedByAI&&showAIicon,"memori-chat--with-feedback":showFeedback}),enter:"transition ease-in-out duration-300",enterFrom:"opacity-0 scale-09 translate-x-"+(message.fromUser?"30":"-30"),enterTo:"opacity-1 scale-1 translate-x-0",leave:"transition ease-in-out duration-300",leaveFrom:"opacity-1 scale-1 translate-x-0",leaveTo:"opacity-0 scale-09  translate-x-"+(message.fromUser?"30":"-30"),children:[(0,jsx_runtime.jsx)("div",{dir:"auto",className:"memori-chat--bubble-content",dangerouslySetInnerHTML:{__html:renderedText}}),(!message.fromUser&&showCopyButton||message.generatedByAI&&showAIicon||showFeedback&&simulateUserPrompt)&&(0,jsx_runtime.jsxs)("div",{className:"memori-chat--bubble-addon",children:[!message.fromUser&&showCopyButton&&(0,jsx_runtime.jsx)(Button.Z,{ghost:!0,shape:"circle",title:t("copy")||"Copy",className:"memori-chat--bubble-action-icon",icon:(0,jsx_runtime.jsx)(Copy.default,{"aria-label":t("copy")||"Copy"}),onClick:()=>navigator.clipboard.writeText(plainText)}),!message.fromUser&&showCopyButton&&plainText!==message.text&&(0,jsx_runtime.jsx)(Button.Z,{ghost:!0,shape:"circle",title:t("copyRawCode")||"Copy raw code",className:"memori-chat--bubble-action-icon",icon:(0,jsx_runtime.jsx)(Code.default,{"aria-label":t("copyRawCode")||"Copy raw code"}),onClick:()=>navigator.clipboard.writeText(message.text)}),showFeedback&&!!simulateUserPrompt&&(0,jsx_runtime.jsx)(FeedbackButtons.Z,{memori,className:"memori-chat--bubble-feedback",dropdown:!0,onNegativeClick:msg=>{msg&&simulateUserPrompt(msg)}}),message.generatedByAI&&showAIicon&&(0,jsx_runtime.jsx)(Tooltip.Z,{align:"left",content:t("generatedByAI"),className:"memori-chat--bubble-action-icon memori-chat--bubble-action-icon--ai",children:(0,jsx_runtime.jsx)("span",{children:(0,jsx_runtime.jsx)(AI.default,{title:t("generatedByAI")||void 0})})}),showTranslationOriginal&&message.translatedText&&message.translatedText!==message.text&&(0,jsx_runtime.jsx)(Tooltip.Z,{align:"left",content:`${"it"===lang?"Testo originale":"Original text"}: ${message.text}`,className:"memori-chat--bubble-action-icon memori-chat--bubble-action-icon--ai",children:(0,jsx_runtime.jsx)("span",{children:(0,jsx_runtime.jsx)(Translation.default,{"aria-label":"it"===lang?"Testo originale":"Original text"})})}),!message.fromUser&&message.questionAnswered&&apiUrl&&showWhyThisAnswer&&(0,jsx_runtime.jsx)(Button.Z,{ghost:!0,shape:"circle",title:t("whyThisAnswer")||void 0,className:"memori-chat--bubble-action-icon",onClick:()=>setShowingWhyThisAnswer(!0),disabled:showingWhyThisAnswer,icon:(0,jsx_runtime.jsx)(QuestionHelp.default,{title:t("whyThisAnswer")||void 0})})]})]}),message.fromUser&&(0,jsx_runtime.jsx)(jsx_runtime.Fragment,{children:userAvatar&&"string"==typeof userAvatar||!userAvatar&&user?.avatarURL?.length?(0,jsx_runtime.jsx)(transition.u.Child,{as:"picture",className:"memori-chat--bubble-avatar",enter:"transition ease-in-out duration-300",enterFrom:"opacity-0 scale-075 "+(message.fromUser?"translate-x-15":"translate-x--15"),enterTo:"opacity-1 scale-1 translate-x-0",leave:"transition ease-in-out duration-300",leaveFrom:"opacity-1 scale-1 translate-x-0",leaveTo:"opacity-0 scale-075 "+(message.fromUser?"translate-x-15":"translate-x--15"),children:(0,jsx_runtime.jsx)("img",{className:"memori-chat--bubble-avatar-img",alt:user?.userName??"User",src:userAvatar??user?.avatarURL})}):userAvatar?(0,jsx_runtime.jsx)(transition.u.Child,{as:"div",className:"memori-chat--bubble-avatar",enter:"transition ease-in-out duration-300",enterFrom:"opacity-0 scale-075 "+(message.fromUser?"translate-x-15":"translate-x--15"),enterTo:"opacity-1 scale-1 translate-x-0",leave:"transition ease-in-out duration-300",leaveFrom:"opacity-1 scale-1 translate-x-0",leaveTo:"opacity-0 scale-075 "+(message.fromUser?"translate-x-15":"translate-x--15"),children:userAvatar}):(0,jsx_runtime.jsx)(transition.u.Child,{as:"div",className:"memori-chat--bubble-avatar",enter:"transition ease-in-out duration-300",enterFrom:"opacity-0 scale-075 "+(message.fromUser?"translate-x-15":"translate-x--15"),enterTo:"opacity-1 scale-1 translate-x-0",leave:"transition ease-in-out duration-300",leaveFrom:"opacity-1 scale-1 translate-x-0",leaveTo:"opacity-0 scale-075 "+(message.fromUser?"translate-x-15":"translate-x--15"),children:(0,jsx_runtime.jsx)(User.default,{})})})]}),showingWhyThisAnswer&&apiUrl&&(0,jsx_runtime.jsx)(WhyThisAnswer.Z,{visible:showingWhyThisAnswer,message,closeDrawer:()=>setShowingWhyThisAnswer(!1),apiURL:apiUrl,sessionID})]})},ChatBubble_ChatBubble=ChatBubble;try{ChatBubble.displayName="ChatBubble",ChatBubble.__docgenInfo={description:"",displayName:"ChatBubble",props:{message:{defaultValue:null,description:"",name:"message",required:!0,type:{name:"Message"}},memori:{defaultValue:null,description:"",name:"memori",required:!0,type:{name:"Memori"}},sessionID:{defaultValue:null,description:"",name:"sessionID",required:!0,type:{name:"string"}},tenant:{defaultValue:null,description:"",name:"tenant",required:!1,type:{name:"Tenant"}},baseUrl:{defaultValue:null,description:"",name:"baseUrl",required:!1,type:{name:"string"}},apiUrl:{defaultValue:null,description:"",name:"apiUrl",required:!1,type:{name:"string"}},showFeedback:{defaultValue:null,description:"",name:"showFeedback",required:!1,type:{name:"boolean"}},showWhyThisAnswer:{defaultValue:{value:"true"},description:"",name:"showWhyThisAnswer",required:!1,type:{name:"boolean"}},showCopyButton:{defaultValue:{value:"true"},description:"",name:"showCopyButton",required:!1,type:{name:"boolean"}},showTranslationOriginal:{defaultValue:{value:"false"},description:"",name:"showTranslationOriginal",required:!1,type:{name:"boolean"}},simulateUserPrompt:{defaultValue:null,description:"",name:"simulateUserPrompt",required:!1,type:{name:"((msg: string) => void)"}},showAIicon:{defaultValue:{value:"true"},description:"",name:"showAIicon",required:!1,type:{name:"boolean"}},isFirst:{defaultValue:{value:"false"},description:"",name:"isFirst",required:!1,type:{name:"boolean"}},userAvatar:{defaultValue:null,description:"",name:"userAvatar",required:!1,type:{name:"string | Element"}},user:{defaultValue:null,description:"",name:"user",required:!1,type:{name:"User"}},experts:{defaultValue:null,description:"",name:"experts",required:!1,type:{name:"ExpertReference[]"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/ChatBubble/ChatBubble.tsx#ChatBubble"]={docgenInfo:ChatBubble.__docgenInfo,name:"ChatBubble",path:"src/components/ChatBubble/ChatBubble.tsx#ChatBubble"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/FeedbackButtons/FeedbackButtons.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_headlessui_react__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/@headlessui/react/dist/components/menu/menu.js"),_headlessui_react__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/@headlessui/react/dist/components/transitions/transition.js"),_ui_Tooltip__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/components/ui/Tooltip.tsx"),_ui_Button__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/components/ui/Button.tsx"),_icons_Feedback__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/components/icons/Feedback.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/react/jsx-runtime.js");const feedbackMsgs={"it-IT":"Non è quello che ti ho chiesto","fr-FR":"Ce n'est pas ce que je t'ai demandé","en-GB":"It's not what I asked"},feedbackMsgsHelpers={"it-IT":"La risposta non era corretta","fr-FR":"La réponse n'était pas correcte","en-GB":"The answer was not correct"},dislikeMsgs={"it-IT":"Non mi è piaciuta la risposta","fr-FR":"Je n'ai pas aimé la réponse","en-GB":"I didn't like the answer"},FeedbackButtons=({memori,className,onNegativeClick,toggle=!1,dropdown=!1})=>{const[clicked,setClicked]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(),culture="it-IT"===memori.culture?"it-IT":"fr-FR"===memori.culture?"fr-FR":"en-GB",feedbackMsg=feedbackMsgs[culture],feedbackMsgHelper=feedbackMsgsHelpers[culture],dislikeMsg=dislikeMsgs[culture];return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div",{className:"memori-chat--feedback"+(className?` ${className}`:""),children:dropdown?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_5__.v,{as:"div",className:"memori-chat--feedback-menu",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_headlessui_react__WEBPACK_IMPORTED_MODULE_5__.v.Button,{as:react__WEBPACK_IMPORTED_MODULE_0__.Fragment,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui_Button__WEBPACK_IMPORTED_MODULE_2__.Z,{ghost:!0,shape:"circle",title:"Feedback",className:"memori-chat--feedback-menu-button",disabled:!!clicked,icon:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_icons_Feedback__WEBPACK_IMPORTED_MODULE_3__.default,{className:clicked?"memori-chat--feedback-clicked":void 0})})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_headlessui_react__WEBPACK_IMPORTED_MODULE_6__.u,{as:react__WEBPACK_IMPORTED_MODULE_0__.Fragment,enter:"transition ease-out duration-200",enterFrom:"transform opacity-0 scale-95",enterTo:"transform opacity-100 scale-100",leave:"transition ease-in duration-75",leaveFrom:"transform opacity-100 scale-100",leaveTo:"transform opacity-0 scale-95",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_headlessui_react__WEBPACK_IMPORTED_MODULE_5__.v.Items,{className:"memori-chat--feedback-menu-items",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div",{className:"memori-chat--feedback-menu-items-container",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_headlessui_react__WEBPACK_IMPORTED_MODULE_5__.v.Item,{children:({active})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button",{className:"memori-chat--feedback-menu-item"+(active?" memori-chat--feedback-menu-item-active":""),onClick:()=>{setClicked("up"===clicked&&toggle?void 0:"up")},children:dislikeMsg})},"ok"),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_headlessui_react__WEBPACK_IMPORTED_MODULE_5__.v.Item,{children:({active})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button",{className:"memori-chat--feedback-menu-item"+(active?" memori-chat--feedback-menu-item-active":""),onClick:()=>{setClicked("down"===clicked&&toggle?void 0:"down"),onNegativeClick(feedbackMsg)},children:feedbackMsgHelper})},"no")]})})})]}):(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui_Tooltip__WEBPACK_IMPORTED_MODULE_1__.Z,{align:"left",content:"Feedback",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui_Button__WEBPACK_IMPORTED_MODULE_2__.Z,{title:"Feedback",onClick:()=>{setClicked("down"===clicked&&toggle?void 0:"down"),onNegativeClick(feedbackMsg)},ghost:!0,shape:"circle",icon:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_icons_Feedback__WEBPACK_IMPORTED_MODULE_3__.default,{className:clicked?"memori-chat--feedback-clicked":void 0})})})})};FeedbackButtons.displayName="FeedbackButtons";const __WEBPACK_DEFAULT_EXPORT__=FeedbackButtons;try{FeedbackButtons.displayName="FeedbackButtons",FeedbackButtons.__docgenInfo={description:"",displayName:"FeedbackButtons",props:{memori:{defaultValue:null,description:"",name:"memori",required:!0,type:{name:"Memori"}},onNegativeClick:{defaultValue:null,description:"",name:"onNegativeClick",required:!0,type:{name:"(msg?: string | undefined) => void"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},toggle:{defaultValue:{value:"false"},description:"",name:"toggle",required:!1,type:{name:"boolean"}},dropdown:{defaultValue:{value:"false"},description:"",name:"dropdown",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/FeedbackButtons/FeedbackButtons.tsx#FeedbackButtons"]={docgenInfo:FeedbackButtons.__docgenInfo,name:"FeedbackButtons",path:"src/components/FeedbackButtons/FeedbackButtons.tsx#FeedbackButtons"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/icons/AI.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const AI=({className,title})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("svg",{...title?{}:{"aria-hidden":"true"},focusable:"false",role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",className,"aria-label":title,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("g",{fill:"currentColor",fillRule:"evenodd",clipRule:"evenodd",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path",{fillRule:"evenodd",d:"M0 4a4 4 0 014-4h16a4 4 0 014 4v16a4 4 0 01-4 4H4a4 4 0 01-4-4zm4-2.4A2.4 2.4 0 001.6 4v16A2.4 2.4 0 004 22.4h16a2.4 2.4 0 002.4-2.4V4A2.4 2.4 0 0020 1.6z",clipRule:"evenodd"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path",{fillRule:"evenodd",d:"M9.715 8.442a.798.798 0 00-1.43 0l-3.2 6.4a.799.799 0 101.431.716l.579-1.158h3.811l.578 1.158a.8.8 0 001.431-.716zm.391 4.358L9 10.589 7.894 12.8z",clipRule:"evenodd"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path",{fillRule:"evenodd",d:"M17 8c.552 0 1 .358 1 .8v6.4c0 .442-.448.8-1 .8s-1-.358-1-.8V8.8c0-.442.448-.8 1-.8z",clipRule:"evenodd"})]})});AI.displayName="AI";const __WEBPACK_DEFAULT_EXPORT__=AI;try{AI.displayName="AI",AI.__docgenInfo={description:"",displayName:"AI",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/icons/AI.tsx#AI"]={docgenInfo:AI.__docgenInfo,name:"AI",path:"src/components/icons/AI.tsx#AI"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/icons/Code.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const Code=({className,title})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("svg",{...title?{}:{"aria-hidden":"true"},xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",focusable:"false",role:"img",className,"aria-label":title,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path",{d:"M10 9.5 8 12l2 2.5"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path",{d:"m14 9.5 2 2.5-2 2.5"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"})]});Code.displayName="Code";const __WEBPACK_DEFAULT_EXPORT__=Code;try{Code.displayName="Code",Code.__docgenInfo={description:"",displayName:"Code",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/icons/Code.tsx#Code"]={docgenInfo:Code.__docgenInfo,name:"Code",path:"src/components/icons/Code.tsx#Code"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/icons/Feedback.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const Feedback=({className,title})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("svg",{...title?{}:{"aria-hidden":"true"},focusable:"false",role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",className,"aria-label":title,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path",{fill:"none",d:"M0 0h24v24H0V0z"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path",{d:"M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17l-.59.59-.58.58V4h16v12zm-9-4h2v2h-2zm0-6h2v4h-2z"})]});Feedback.displayName="Feedback";const __WEBPACK_DEFAULT_EXPORT__=Feedback;try{Feedback.displayName="Feedback",Feedback.__docgenInfo={description:"",displayName:"Feedback",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/icons/Feedback.tsx#Feedback"]={docgenInfo:Feedback.__docgenInfo,name:"Feedback",path:"src/components/icons/Feedback.tsx#Feedback"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/icons/QuestionHelp.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const QuestionHelp=({className,title})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",...title?{}:{"aria-hidden":"true"},focusable:"false",role:"img",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"1.5",viewBox:"0 0 24 24",className,"aria-label":title,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("circle",{cx:"12",cy:"12",r:"10"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path",{d:"M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path",{d:"M12 17L12.01 17"})]});QuestionHelp.displayName="QuestionHelp";const __WEBPACK_DEFAULT_EXPORT__=QuestionHelp;try{QuestionHelp.displayName="QuestionHelp",QuestionHelp.__docgenInfo={description:"",displayName:"QuestionHelp",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/icons/QuestionHelp.tsx#QuestionHelp"]={docgenInfo:QuestionHelp.__docgenInfo,name:"QuestionHelp",path:"src/components/icons/QuestionHelp.tsx#QuestionHelp"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/icons/Translation.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const Translation=({className,title})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("svg",{...title?{}:{"aria-hidden":"true"},focusable:"false",role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1024 1024",className,"aria-label":title,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path",{d:"M140 188h584v164h76V144c0-17.7-14.3-32-32-32H96c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h544v-76H140V188z"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path",{d:"M414.3 256h-60.6c-3.4 0-6.4 2.2-7.6 5.4L219 629.4c-.3.8-.4 1.7-.4 2.6 0 4.4 3.6 8 8 8h55.1c3.4 0 6.4-2.2 7.6-5.4L322 540h196.2L422 261.4c-1.3-3.2-4.3-5.4-7.7-5.4zm12.4 228h-85.5L384 360.2 426.7 484zM936 528H800v-93c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v93H592c-13.3 0-24 10.7-24 24v176c0 13.3 10.7 24 24 24h136v152c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V752h136c13.3 0 24-10.7 24-24V552c0-13.3-10.7-24-24-24zM728 680h-88v-80h88v80zm160 0h-88v-80h88v80z"})]});Translation.displayName="Translation";const __WEBPACK_DEFAULT_EXPORT__=Translation;try{Translation.displayName="Translation",Translation.__docgenInfo={description:"",displayName:"Translation",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/icons/Translation.tsx#Translation"]={docgenInfo:Translation.__docgenInfo,name:"Translation",path:"src/components/icons/Translation.tsx#Translation"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/icons/User.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const User=({className,title})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("svg",{...title?{}:{"aria-hidden":"true"},focusable:"false",role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1024 1024",className,"aria-label":title,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path",{d:"M858.5 763.6a374 374 0 0 0-80.6-119.5 375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"})});User.displayName="User";const __WEBPACK_DEFAULT_EXPORT__=User;try{User.displayName="User",User.__docgenInfo={description:"",displayName:"User",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/icons/User.tsx#User"]={docgenInfo:User.__docgenInfo,name:"User",path:"src/components/icons/User.tsx#User"})}catch(__react_docgen_typescript_loader_error){}}}]);