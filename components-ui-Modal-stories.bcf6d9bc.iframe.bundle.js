/*! For license information please see components-ui-Modal-stories.bcf6d9bc.iframe.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunk_memori_ai_memori_react=self.webpackChunk_memori_ai_memori_react||[]).push([[353],{"./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}__webpack_require__.d(__webpack_exports__,{Z:()=>_arrayLikeToArray})},"./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}__webpack_require__.d(__webpack_exports__,{Z:()=>_arrayWithHoles})},"./node_modules/@babel/runtime/helpers/esm/classCallCheck.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}__webpack_require__.d(__webpack_exports__,{Z:()=>_classCallCheck})},"./node_modules/@babel/runtime/helpers/esm/createClass.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>_createClass});var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js");function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,(0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__.Z)(descriptor.key),descriptor)}}function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}},"./node_modules/@babel/runtime/helpers/esm/defineProperty.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>_defineProperty});var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js");function _defineProperty(obj,key,value){return(key=(0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__.Z)(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}},"./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}__webpack_require__.d(__webpack_exports__,{Z:()=>_nonIterableRest})},"./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>_toPropertyKey});var esm_typeof=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/typeof.js");function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!==(0,esm_typeof.Z)(input)||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!==(0,esm_typeof.Z)(res))return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"===(0,esm_typeof.Z)(key)?key:String(key)}},"./node_modules/@babel/runtime/helpers/esm/typeof.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function _typeof(obj){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}__webpack_require__.d(__webpack_exports__,{Z:()=>_typeof})},"./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>_unsupportedIterableToArray});var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");function _unsupportedIterableToArray(o,minLen){if(o){if("string"==typeof o)return(0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__.Z)(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);return"Object"===n&&o.constructor&&(n=o.constructor.name),"Map"===n||"Set"===n?Array.from(o):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?(0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__.Z)(o,minLen):void 0}}},"./src/components/ui/Modal.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,Loading:()=>Loading,NonClosable:()=>NonClosable,Open:()=>Open,WithALotOfContent:()=>WithALotOfContent,WithFooter:()=>WithFooter,WithTitle:()=>WithTitle,WithTitleAndDescription:()=>WithTitleAndDescription,__namedExportsOrder:()=>__namedExportsOrder,default:()=>Modal_stories});var react=__webpack_require__("./node_modules/react/index.js"),Modal=__webpack_require__("./src/components/ui/Modal.tsx"),Button=__webpack_require__("./src/components/ui/Button.tsx"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),ui_Modal=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[7].use[1]!./src/components/ui/Modal.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(ui_Modal.Z,options);ui_Modal.Z&&ui_Modal.Z.locals&&ui_Modal.Z.locals;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const Modal_stories={title:"UI/Modal",component:Modal.Z,argTypes:{title:{control:{type:"text"}},description:{control:{type:"text"}},loading:{control:{type:"boolean"}},open:{control:{type:"boolean"}},className:{control:{type:"text"}}},parameters:{controls:{expanded:!0}}},content=(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)("p",{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit."}),(0,jsx_runtime.jsx)("h3",{children:"Suspendisse a sodales nulla, sed semper nisi."}),(0,jsx_runtime.jsx)("p",{children:"Proin tincidunt enim in felis aliquet, a ultricies purus bibendum."}),(0,jsx_runtime.jsxs)("ul",{children:[(0,jsx_runtime.jsx)("li",{children:"Quisque in ultrices lectus."}),(0,jsx_runtime.jsx)("li",{children:"Quisque in ultrices lectus."}),(0,jsx_runtime.jsx)("li",{children:"Quisque in ultrices lectus."})]}),(0,jsx_runtime.jsx)("p",{children:"Nulla at urna diam."})]}),footer=(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(Button.Z,{primary:!0,children:"OK"}),(0,jsx_runtime.jsx)(Button.Z,{children:"Cancel"})]}),footerNonClosableModal=(0,jsx_runtime.jsx)(Button.Z,{primary:!0,children:"OK"}),Template=args=>{const[isOpen,setIsOpen]=react.useState(!!args.open||!1);return(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(Button.Z,{onClick:()=>setIsOpen(!0),children:"Click me"}),(0,jsx_runtime.jsx)(Modal.Z,{...args,open:isOpen,onClose:args.closable?()=>setIsOpen(!1):()=>{},footer:args.footer,children:content})]})},Default=Template.bind({});Default.args={open:!1,closable:!0};const Open=Template.bind({});Open.args={open:!0,closable:!0};const WithTitle=Template.bind({});WithTitle.args={open:!0,closable:!0,title:"Modal Title"};const WithTitleAndDescription=Template.bind({});WithTitleAndDescription.args={open:!0,closable:!0,title:"Modal Title",description:"Modal Description"};const Loading=Template.bind({});Loading.args={open:!0,closable:!0,title:"Modal Title",description:"Modal Description",loading:!0};const WithFooter=Template.bind({});WithFooter.args={open:!0,closable:!0,title:"Modal Title",description:"Modal Description",footer};const NonClosable=Template.bind({});NonClosable.args={open:!0,title:"Modal Title",description:"Modal Description",footer:footerNonClosableModal,closable:!1};const WithALotOfContent=(args=>{const[isOpen,setIsOpen]=react.useState(!!args.open||!1);return(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(Button.Z,{onClick:()=>setIsOpen(!0),children:"Click me"}),(0,jsx_runtime.jsxs)(Modal.Z,{...args,open:isOpen,onClose:args.closable?()=>setIsOpen(!1):()=>{},footer:args.footer,children:[content,content,content,content,content]})]})}).bind({});WithALotOfContent.args={open:!0,closable:!0,title:"Modal Title",description:"Modal Description",footer},Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"args => {\n  const [isOpen, setIsOpen] = React.useState(!!args.open || false);\n  return <>\n      <Button onClick={() => setIsOpen(true)}>Click me</Button>\n      <Modal {...args} open={isOpen} onClose={args.closable ? () => setIsOpen(false) : () => {}} footer={args.footer}>\n        {content}\n      </Modal>\n    </>;\n}",...Default.parameters?.docs?.source}}},Open.parameters={...Open.parameters,docs:{...Open.parameters?.docs,source:{originalSource:"args => {\n  const [isOpen, setIsOpen] = React.useState(!!args.open || false);\n  return <>\n      <Button onClick={() => setIsOpen(true)}>Click me</Button>\n      <Modal {...args} open={isOpen} onClose={args.closable ? () => setIsOpen(false) : () => {}} footer={args.footer}>\n        {content}\n      </Modal>\n    </>;\n}",...Open.parameters?.docs?.source}}},WithTitle.parameters={...WithTitle.parameters,docs:{...WithTitle.parameters?.docs,source:{originalSource:"args => {\n  const [isOpen, setIsOpen] = React.useState(!!args.open || false);\n  return <>\n      <Button onClick={() => setIsOpen(true)}>Click me</Button>\n      <Modal {...args} open={isOpen} onClose={args.closable ? () => setIsOpen(false) : () => {}} footer={args.footer}>\n        {content}\n      </Modal>\n    </>;\n}",...WithTitle.parameters?.docs?.source}}},WithTitleAndDescription.parameters={...WithTitleAndDescription.parameters,docs:{...WithTitleAndDescription.parameters?.docs,source:{originalSource:"args => {\n  const [isOpen, setIsOpen] = React.useState(!!args.open || false);\n  return <>\n      <Button onClick={() => setIsOpen(true)}>Click me</Button>\n      <Modal {...args} open={isOpen} onClose={args.closable ? () => setIsOpen(false) : () => {}} footer={args.footer}>\n        {content}\n      </Modal>\n    </>;\n}",...WithTitleAndDescription.parameters?.docs?.source}}},Loading.parameters={...Loading.parameters,docs:{...Loading.parameters?.docs,source:{originalSource:"args => {\n  const [isOpen, setIsOpen] = React.useState(!!args.open || false);\n  return <>\n      <Button onClick={() => setIsOpen(true)}>Click me</Button>\n      <Modal {...args} open={isOpen} onClose={args.closable ? () => setIsOpen(false) : () => {}} footer={args.footer}>\n        {content}\n      </Modal>\n    </>;\n}",...Loading.parameters?.docs?.source}}},WithFooter.parameters={...WithFooter.parameters,docs:{...WithFooter.parameters?.docs,source:{originalSource:"args => {\n  const [isOpen, setIsOpen] = React.useState(!!args.open || false);\n  return <>\n      <Button onClick={() => setIsOpen(true)}>Click me</Button>\n      <Modal {...args} open={isOpen} onClose={args.closable ? () => setIsOpen(false) : () => {}} footer={args.footer}>\n        {content}\n      </Modal>\n    </>;\n}",...WithFooter.parameters?.docs?.source}}},NonClosable.parameters={...NonClosable.parameters,docs:{...NonClosable.parameters?.docs,source:{originalSource:"args => {\n  const [isOpen, setIsOpen] = React.useState(!!args.open || false);\n  return <>\n      <Button onClick={() => setIsOpen(true)}>Click me</Button>\n      <Modal {...args} open={isOpen} onClose={args.closable ? () => setIsOpen(false) : () => {}} footer={args.footer}>\n        {content}\n      </Modal>\n    </>;\n}",...NonClosable.parameters?.docs?.source}}},WithALotOfContent.parameters={...WithALotOfContent.parameters,docs:{...WithALotOfContent.parameters?.docs,source:{originalSource:"args => {\n  const [isOpen, setIsOpen] = React.useState(!!args.open || false);\n  return <>\n      <Button onClick={() => setIsOpen(true)}>Click me</Button>\n      <Modal {...args} open={isOpen} onClose={args.closable ? () => setIsOpen(false) : () => {}} footer={args.footer}>\n        {content}\n        {content}\n        {content}\n        {content}\n        {content}\n      </Modal>\n    </>;\n}",...WithALotOfContent.parameters?.docs?.source}}};const __namedExportsOrder=["Default","Open","WithTitle","WithTitleAndDescription","Loading","WithFooter","NonClosable","WithALotOfContent"]},"./src/components/icons/Close.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const Close=({className,title})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("svg",{...title?{}:{"aria-hidden":"true"},xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1024 1024",focusable:"false",role:"img",className,"aria-label":title,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path",{d:"M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"})});Close.displayName="Close";const __WEBPACK_DEFAULT_EXPORT__=Close;try{Close.displayName="Close",Close.__docgenInfo={description:"",displayName:"Close",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/icons/Close.tsx#Close"]={docgenInfo:Close.__docgenInfo,name:"Close",path:"src/components/icons/Close.tsx#Close"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/icons/Loading.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");const Loading=({className,title,loading=!0})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg",{...title?{}:{"aria-hidden":"true"},xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1024 1024",focusable:"false",role:"img",className:classnames__WEBPACK_IMPORTED_MODULE_1___default()(className,{"memori-loading-icon":loading}),"aria-label":title,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path",{d:"M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"})});Loading.displayName="Loading";const __WEBPACK_DEFAULT_EXPORT__=Loading;try{Loading.displayName="Loading",Loading.__docgenInfo={description:"",displayName:"Loading",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}},loading:{defaultValue:{value:"true"},description:"",name:"loading",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/icons/Loading.tsx#Loading"]={docgenInfo:Loading.__docgenInfo,name:"Loading",path:"src/components/icons/Loading.tsx#Loading"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/ui/Button.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_icons_Loading__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/components/icons/Loading.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react/jsx-runtime.js");const Button=({primary=!1,outlined=!1,ghost=!1,padded=!0,shape="rounded",danger=!1,loading=!1,disabled=!1,block=!1,icon,className,title,id,htmlType,onClick,onMouseDown,onMouseUp,onMouseLeave,onTouchStart,onTouchEnd,children})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("button",{id,type:htmlType,onClick,onMouseDown,onMouseUp,onMouseLeave,onTouchStart,onTouchEnd,title,disabled:loading||disabled,className:classnames__WEBPACK_IMPORTED_MODULE_1___default()("memori-button",{"memori-button--primary":primary,"memori-button--outlined":outlined,"memori-button--ghost":ghost,"memori-button--square":"square"===shape,"memori-button--rounded":"rounded"===shape,"memori-button--circle":"circle"===shape,"memori-button--padded":padded,"memori-button--block":block,"memori-button--with-icon":(icon||loading)&&children,"memori-button--icon-only":(icon||loading)&&!children,"memori-button--danger":danger,"memori-button--loading":loading},className),children:[icon&&!loading&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span",{className:"memori-button--icon",children:icon}),loading&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span",{className:"memori-button--icon loading-icon",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_icons_Loading__WEBPACK_IMPORTED_MODULE_2__.default,{loading:!0})}),children]});Button.displayName="Button";const __WEBPACK_DEFAULT_EXPORT__=Button;try{Button.displayName="Button",Button.__docgenInfo={description:"",displayName:"Button",props:{primary:{defaultValue:{value:"false"},description:"",name:"primary",required:!1,type:{name:"boolean"}},outlined:{defaultValue:{value:"false"},description:"",name:"outlined",required:!1,type:{name:"boolean"}},ghost:{defaultValue:{value:"false"},description:"",name:"ghost",required:!1,type:{name:"boolean"}},padded:{defaultValue:{value:"true"},description:"",name:"padded",required:!1,type:{name:"boolean"}},block:{defaultValue:{value:"false"},description:"",name:"block",required:!1,type:{name:"boolean"}},icon:{defaultValue:null,description:"",name:"icon",required:!1,type:{name:"ReactNode"}},shape:{defaultValue:{value:"rounded"},description:"",name:"shape",required:!1,type:{name:"enum",value:[{value:'"square"'},{value:'"rounded"'},{value:'"circle"'}]}},danger:{defaultValue:{value:"false"},description:"",name:"danger",required:!1,type:{name:"boolean"}},loading:{defaultValue:{value:"false"},description:"",name:"loading",required:!1,type:{name:"boolean"}},disabled:{defaultValue:{value:"false"},description:"",name:"disabled",required:!1,type:{name:"boolean"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}},id:{defaultValue:null,description:"",name:"id",required:!1,type:{name:"string"}},htmlType:{defaultValue:null,description:"",name:"htmlType",required:!1,type:{name:"enum",value:[{value:'"button"'},{value:'"submit"'},{value:'"reset"'}]}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"((event: MouseEvent<HTMLButtonElement, MouseEvent>) => void)"}},onMouseDown:{defaultValue:null,description:"",name:"onMouseDown",required:!1,type:{name:"((event: MouseEvent<HTMLButtonElement, MouseEvent>) => void)"}},onMouseUp:{defaultValue:null,description:"",name:"onMouseUp",required:!1,type:{name:"((event: MouseEvent<HTMLButtonElement, MouseEvent>) => void)"}},onMouseLeave:{defaultValue:null,description:"",name:"onMouseLeave",required:!1,type:{name:"((event: MouseEvent<HTMLButtonElement, MouseEvent>) => void)"}},onTouchStart:{defaultValue:null,description:"",name:"onTouchStart",required:!1,type:{name:"((event: TouchEvent<HTMLButtonElement> | MouseEvent<Element, MouseEvent>) => void)"}},onTouchEnd:{defaultValue:null,description:"",name:"onTouchEnd",required:!1,type:{name:"((event: TouchEvent<HTMLButtonElement> | MouseEvent<Element, MouseEvent>) => void)"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/ui/Button.tsx#Button"]={docgenInfo:Button.__docgenInfo,name:"Button",path:"src/components/ui/Button.tsx#Button"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/ui/Modal.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_headlessui_react__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./node_modules/@headlessui/react/dist/components/transitions/transition.js"),_headlessui_react__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./node_modules/@headlessui/react/dist/components/dialog/dialog.js"),_Spin__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/components/ui/Spin.tsx"),_Button__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/components/ui/Button.tsx"),_icons_Close__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/components/icons/Close.tsx"),react_i18next__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/react-i18next/dist/es/useTranslation.js"),classnames__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_4__),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/react/jsx-runtime.js");const Modal=({open=!1,onClose,className,title,description,children,footer,loading=!1,closable=!0,width="100%",widthMd="100%"})=>{const{t}=(0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.$)();return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_headlessui_react__WEBPACK_IMPORTED_MODULE_7__.u,{appear:!0,show:open,as:react__WEBPACK_IMPORTED_MODULE_0__.Fragment,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_8__.V,{open,onClose,className:classnames__WEBPACK_IMPORTED_MODULE_4___default()("memori-modal",className),children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_headlessui_react__WEBPACK_IMPORTED_MODULE_7__.u.Child,{as:react__WEBPACK_IMPORTED_MODULE_0__.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"ease-in duration-200",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div",{className:"memori-modal--backdrop"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div",{className:"memori-modal--container",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div",{className:"memori-modal--container-scrollable",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_headlessui_react__WEBPACK_IMPORTED_MODULE_7__.u.Child,{as:react__WEBPACK_IMPORTED_MODULE_0__.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0 scale-95",enterTo:"opacity-100 scale-100",leave:"ease-in duration-200",leaveFrom:"opacity-100 scale-100",leaveTo:"opacity-0 scale-95",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_8__.V.Panel,{className:"memori-modal--panel",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("style",{dangerouslySetInnerHTML:{__html:`\n                    .memori-modal--panel {\n                      --memori-modal--width: ${width};\n                      --memori-modal--width-md: ${widthMd};\n                    }\n                  `}}),closable&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div",{className:"memori-modal--close",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_2__.Z,{ghost:!0,padded:!0,shape:"circle",icon:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_icons_Close__WEBPACK_IMPORTED_MODULE_3__.default,{}),title:t("close")||"Close",onClick:()=>onClose(!1)})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_Spin__WEBPACK_IMPORTED_MODULE_1__.Z,{spinning:loading,children:[title&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_headlessui_react__WEBPACK_IMPORTED_MODULE_8__.V.Title,{className:"memori-modal--title",children:title}),description&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_headlessui_react__WEBPACK_IMPORTED_MODULE_8__.V.Description,{className:"memori-modal--description",children:description}),children,footer&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div",{className:"memori-modal--footer",children:footer})]})]})})})})]})})};Modal.displayName="Modal";const __WEBPACK_DEFAULT_EXPORT__=Modal;try{Modal.displayName="Modal",Modal.__docgenInfo={description:"",displayName:"Modal",props:{open:{defaultValue:{value:"false"},description:"",name:"open",required:!1,type:{name:"boolean"}},onClose:{defaultValue:null,description:"",name:"onClose",required:!0,type:{name:"(value: boolean) => void"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"Element | ReactNode"}},description:{defaultValue:null,description:"",name:"description",required:!1,type:{name:"Element | ReactNode"}},footer:{defaultValue:null,description:"",name:"footer",required:!1,type:{name:"Element | ReactNode"}},loading:{defaultValue:{value:"false"},description:"",name:"loading",required:!1,type:{name:"boolean"}},closable:{defaultValue:{value:"true"},description:"",name:"closable",required:!1,type:{name:"boolean"}},width:{defaultValue:{value:"100%"},description:"",name:"width",required:!1,type:{name:"string"}},widthMd:{defaultValue:{value:"100%"},description:"",name:"widthMd",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/ui/Modal.tsx#Modal"]={docgenInfo:Modal.__docgenInfo,name:"Modal",path:"src/components/ui/Modal.tsx#Modal"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/ui/Spin.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_icons_Loading__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/components/icons/Loading.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react/jsx-runtime.js");const Spin=({spinning=!1,primary=!1,className,children})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div",{className:classnames__WEBPACK_IMPORTED_MODULE_1___default()("memori-spin",className,{"memori-spin--spinning":spinning,"memori-spin--primary":primary}),children:[children,(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div",{className:"memori-spin--spinner",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_icons_Loading__WEBPACK_IMPORTED_MODULE_2__.default,{loading:!0})})]});Spin.displayName="Spin";const __WEBPACK_DEFAULT_EXPORT__=Spin;try{Spin.displayName="Spin",Spin.__docgenInfo={description:"",displayName:"Spin",props:{spinning:{defaultValue:{value:"false"},description:"",name:"spinning",required:!1,type:{name:"boolean"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},primary:{defaultValue:{value:"false"},description:"",name:"primary",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/ui/Spin.tsx#Spin"]={docgenInfo:Spin.__docgenInfo,name:"Spin",path:"src/components/ui/Spin.tsx#Spin"})}catch(__react_docgen_typescript_loader_error){}},"./node_modules/react-i18next/dist/es/context.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{OO:()=>I18nContext,zv:()=>ReportNamespaces,JP:()=>getDefaults,nI:()=>getI18n});var classCallCheck=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/classCallCheck.js"),createClass=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/createClass.js"),react=(__webpack_require__("./node_modules/@babel/runtime/helpers/esm/defineProperty.js"),__webpack_require__("./node_modules/react/index.js")),matchHtmlEntity=/&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g,htmlEntities={"&amp;":"&","&#38;":"&","&lt;":"<","&#60;":"<","&gt;":">","&#62;":">","&apos;":"'","&#39;":"'","&quot;":'"',"&#34;":'"',"&nbsp;":" ","&#160;":" ","&copy;":"©","&#169;":"©","&reg;":"®","&#174;":"®","&hellip;":"…","&#8230;":"…","&#x2F;":"/","&#47;":"/"},unescapeHtmlEntity=function unescapeHtmlEntity(m){return htmlEntities[m]};var i18nInstance,defaultOptions={bindI18n:"languageChanged",bindI18nStore:"",transEmptyNodeValue:"",transSupportBasicHtmlNodes:!0,transWrapTextNodes:"",transKeepBasicHtmlNodesFor:["br","strong","i","p"],useSuspense:!0,unescape:function unescape(text){return text.replace(matchHtmlEntity,unescapeHtmlEntity)}},I18nContext=(0,react.createContext)();function getDefaults(){return defaultOptions}var ReportNamespaces=function(){function ReportNamespaces(){(0,classCallCheck.Z)(this,ReportNamespaces),this.usedNamespaces={}}return(0,createClass.Z)(ReportNamespaces,[{key:"addUsedNamespaces",value:function addUsedNamespaces(namespaces){var _this=this;namespaces.forEach((function(ns){_this.usedNamespaces[ns]||(_this.usedNamespaces[ns]=!0)}))}},{key:"getUsedNamespaces",value:function getUsedNamespaces(){return Object.keys(this.usedNamespaces)}}]),ReportNamespaces}();function getI18n(){return i18nInstance}},"./node_modules/react/cjs/react-jsx-runtime.production.min.js":(__unused_webpack_module,exports,__webpack_require__)=>{var f=__webpack_require__("./node_modules/react/index.js"),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};function q(c,a,g){var b,d={},e=null,h=null;for(b in void 0!==g&&(e=""+g),void 0!==a.key&&(e=""+a.key),void 0!==a.ref&&(h=a.ref),a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}exports.Fragment=l,exports.jsx=q,exports.jsxs=q},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.min.js")}}]);