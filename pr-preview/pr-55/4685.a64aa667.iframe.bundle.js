"use strict";(self.webpackChunk_memori_ai_memori_react=self.webpackChunk_memori_ai_memori_react||[]).push([[4685],{"./node_modules/@babel/runtime/helpers/esm/slicedToArray.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>_slicedToArray});var arrayWithHoles=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js");var unsupportedIterableToArray=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js"),nonIterableRest=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js");function _slicedToArray(arr,i){return(0,arrayWithHoles.Z)(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_x,_r,_arr=[],_n=!0,_d=!1;try{if(_x=(_i=_i.call(arr)).next,0===i){if(Object(_i)!==_i)return;_n=!1}else for(;!(_n=(_s=_x.call(_i)).done)&&(_arr.push(_s.value),_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{if(!_n&&null!=_i.return&&(_r=_i.return(),Object(_r)!==_r))return}finally{if(_d)throw _e}}return _arr}}(arr,i)||(0,unsupportedIterableToArray.Z)(arr,i)||(0,nonIterableRest.Z)()}},"./node_modules/@headlessui/react/dist/hooks/use-resolve-button-type.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{f:()=>s});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");function i(t){var n;if(t.type)return t.type;let e=null!=(n=t.as)?n:"button";return"string"==typeof e&&"button"===e.toLowerCase()?"button":void 0}function s(t,e){let[n,u]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)((()=>i(t)));return(0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.e)((()=>{u(i(t))}),[t.type,t.as]),(0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.e)((()=>{n||!e.current||e.current instanceof HTMLButtonElement&&!e.current.hasAttribute("type")&&u("button")}),[n,e]),n}},"./node_modules/@headlessui/react/dist/hooks/use-tree-walker.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{B:()=>F});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js"),_utils_owner_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@headlessui/react/dist/utils/owner.js");function F({container:e,accept:t,walk:r,enabled:c=!0}){let o=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(t),l=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(r);(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>{o.current=t,l.current=r}),[t,r]),(0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.e)((()=>{if(!e||!c)return;let n=(0,_utils_owner_js__WEBPACK_IMPORTED_MODULE_2__.r)(e);if(!n)return;let f=o.current,p=l.current,d=Object.assign((i=>f(i)),{acceptNode:f}),u=n.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,d,!1);for(;u.nextNode();)p(u.currentNode)}),[e,c,o,l])}},"./node_modules/@headlessui/react/dist/utils/calculate-active-index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{T:()=>a,d:()=>x});var e,a=((e=a||{})[e.First=0]="First",e[e.Previous=1]="Previous",e[e.Next=2]="Next",e[e.Last=3]="Last",e[e.Specific=4]="Specific",e[e.Nothing=5]="Nothing",e);function x(r,n){let t=n.resolveItems();if(t.length<=0)return null;let l=n.resolveActiveIndex(),s=null!=l?l:-1,d=(()=>{switch(r.focus){case 0:return t.findIndex((e=>!n.resolveDisabled(e)));case 1:{let e=t.slice().reverse().findIndex(((i,c,u)=>!(-1!==s&&u.length-c-1>=s)&&!n.resolveDisabled(i)));return-1===e?e:t.length-1-e}case 2:return t.findIndex(((e,i)=>!(i<=s)&&!n.resolveDisabled(e)));case 3:{let e=t.slice().reverse().findIndex((i=>!n.resolveDisabled(i)));return-1===e?e:t.length-1-e}case 4:return t.findIndex((e=>n.resolveId(e)===r.id));case 5:return null;default:!function f(r){throw new Error("Unexpected object: "+r)}(r)}})();return-1===d?l:d}},"./node_modules/react-hot-toast/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{x7:()=>Ie,ZP:()=>_t});var react=__webpack_require__("./node_modules/react/index.js");let e={data:""},t=t=>"object"==typeof window?((t?t.querySelector("#_goober"):window._goober)||Object.assign((t||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:t||e,l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,a=/\/\*[^]*?\*\/|  +/g,n=/\n+/g,o=(e,t)=>{let r="",l="",a="";for(let n in e){let c=e[n];"@"==n[0]?"i"==n[1]?r=n+" "+c+";":l+="f"==n[1]?o(c,n):n+"{"+o(c,"k"==n[1]?"":t)+"}":"object"==typeof c?l+=o(c,t?t.replace(/([^,])+/g,(e=>n.replace(/(^:.*)|([^,])+/g,(t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)))):n):null!=c&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=o.p?o.p(n,c):n+":"+c+";")}return r+(t&&a?t+"{"+a+"}":a)+l},c={},s=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+s(e[r]);return t}return e},i=(e,t,r,i,p)=>{let u=s(e),d=c[u]||(c[u]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(u));if(!c[d]){let t=u!==e?e:(e=>{let t,r,o=[{}];for(;t=l.exec(e.replace(a,""));)t[4]?o.shift():t[3]?(r=t[3].replace(n," ").trim(),o.unshift(o[0][r]=o[0][r]||{})):o[0][t[1]]=t[2].replace(n," ").trim();return o[0]})(e);c[d]=o(p?{["@keyframes "+d]:t}:t,r?"":"."+d)}let f=r&&c.g?c.g:null;return r&&(c.g=c[d]),((e,t,r,l)=>{l?t.data=t.data.replace(l,e):-1===t.data.indexOf(e)&&(t.data=r?e+t.data:t.data+e)})(c[d],t,i,f),d},p=(e,t,r)=>e.reduce(((e,l,a)=>{let n=t[a];if(n&&n.call){let e=n(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;n=t?"."+t:e&&"object"==typeof e?e.props?"":o(e,""):!1===e?"":e}return e+l+(null==n?"":n)}),"");function u(e){let r=this||{},l=e.call?e(r.p):e;return i(l.unshift?l.raw?p(l,[].slice.call(arguments,1),r.p):l.reduce(((e,t)=>Object.assign(e,t&&t.call?t(r.p):t)),{}):l,t(r.target),r.g,r.o,r.k)}u.bind({g:1});let d,f,g,h=u.bind({k:1});function j(e,t){let r=this||{};return function(){let l=arguments;function a(n,o){let c=Object.assign({},n),s=c.className||a.className;r.p=Object.assign({theme:f&&f()},c),r.o=/ *go\d+/.test(s),c.className=u.apply(r,l)+(s?" "+s:""),t&&(c.ref=o);let i=e;return e[0]&&(i=c.as||e,delete c.as),g&&i[0]&&g(c),d(i,c)}return t?t(a):a}}var T=(e,t)=>(e=>"function"==typeof e)(e)?e(t):e,U=(()=>{let e=0;return()=>(++e).toString()})(),dist_b=(()=>{let e;return()=>{if(void 0===e&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),S=new Map,$=e=>{if(S.has(e))return;let t=setTimeout((()=>{S.delete(e),dist_u({type:4,toastId:e})}),1e3);S.set(e,t)},v=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return t.toast.id&&(e=>{let t=S.get(e);t&&clearTimeout(t)})(t.toast.id),{...e,toasts:e.toasts.map((r=>r.id===t.toast.id?{...r,...t.toast}:r))};case 2:let{toast:o}=t;return e.toasts.find((r=>r.id===o.id))?v(e,{type:1,toast:o}):v(e,{type:0,toast:o});case 3:let{toastId:s}=t;return s?$(s):e.toasts.forEach((r=>{$(r.id)})),{...e,toasts:e.toasts.map((r=>r.id===s||void 0===s?{...r,visible:!1}:r))};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter((r=>r.id!==t.toastId))};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map((r=>({...r,pauseDuration:r.pauseDuration+a})))}}},A=[],P={toasts:[],pausedAt:void 0},dist_u=e=>{P=v(P,e),A.forEach((t=>{t(P)}))},Y={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},dist_h=e=>(t,o)=>{let s=((e,t="blank",o)=>({createdAt:Date.now(),visible:!0,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...o,id:(null==o?void 0:o.id)||U()}))(t,e,o);return dist_u({type:2,toast:s}),s.id},dist_n=(e,t)=>dist_h("blank")(e,t);dist_n.error=dist_h("error"),dist_n.success=dist_h("success"),dist_n.loading=dist_h("loading"),dist_n.custom=dist_h("custom"),dist_n.dismiss=e=>{dist_u({type:3,toastId:e})},dist_n.remove=e=>dist_u({type:4,toastId:e}),dist_n.promise=(e,t,o)=>{let s=dist_n.loading(t.loading,{...o,...null==o?void 0:o.loading});return e.then((a=>(dist_n.success(T(t.success,a),{id:s,...o,...null==o?void 0:o.success}),a))).catch((a=>{dist_n.error(T(t.error,a),{id:s,...o,...null==o?void 0:o.error})})),e};var Z=(e,t)=>{dist_u({type:1,toast:{id:e,height:t}})},ee=()=>{dist_u({type:5,time:Date.now()})},D=e=>{let{toasts:t,pausedAt:o}=((e={})=>{let[t,o]=(0,react.useState)(P);(0,react.useEffect)((()=>(A.push(o),()=>{let a=A.indexOf(o);a>-1&&A.splice(a,1)})),[t]);let s=t.toasts.map((a=>{var r,c;return{...e,...e[a.type],...a,duration:a.duration||(null==(r=e[a.type])?void 0:r.duration)||(null==e?void 0:e.duration)||Y[a.type],style:{...e.style,...null==(c=e[a.type])?void 0:c.style,...a.style}}}));return{...t,toasts:s}})(e);(0,react.useEffect)((()=>{if(o)return;let r=Date.now(),c=t.map((i=>{if(i.duration===1/0)return;let d=(i.duration||0)+i.pauseDuration-(r-i.createdAt);if(!(d<0))return setTimeout((()=>dist_n.dismiss(i.id)),d);i.visible&&dist_n.dismiss(i.id)}));return()=>{c.forEach((i=>i&&clearTimeout(i)))}}),[t,o]);let s=(0,react.useCallback)((()=>{o&&dist_u({type:6,time:Date.now()})}),[o]),a=(0,react.useCallback)(((r,c)=>{let{reverseOrder:i=!1,gutter:d=8,defaultPosition:p}=c||{},g=t.filter((m=>(m.position||p)===(r.position||p)&&m.height)),E=g.findIndex((m=>m.id===r.id)),x=g.filter(((m,R)=>R<E&&m.visible)).length;return g.filter((m=>m.visible)).slice(...i?[x+1]:[0,x]).reduce(((m,R)=>m+(R.height||0)+d),0)}),[t]);return{toasts:t,handlers:{updateHeight:Z,startPause:ee,endPause:s,calculateOffset:a}}},oe=h`
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
`,Ie=({reverseOrder:e,position:t="top-center",toastOptions:o,gutter:s,children:a,containerStyle:r,containerClassName:c})=>{let{toasts:i,handlers:d}=D(o);return react.createElement("div",{style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...r},className:c,onMouseEnter:d.startPause,onMouseLeave:d.endPause},i.map((p=>{let g=p.position||t,x=((e,t)=>{let o=e.includes("top"),s=o?{top:0}:{bottom:0},a=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:dist_b()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(o?1:-1)}px)`,...s,...a}})(g,d.calculateOffset(p,{reverseOrder:e,gutter:s,defaultPosition:t}));return react.createElement(Ee,{id:p.id,key:p.id,onHeightUpdate:d.updateHeight,className:p.visible?ve:"",style:x},"custom"===p.type?T(p.message,p):a?a(p):react.createElement(F,{toast:p,position:g}))})))},_t=dist_n},"./node_modules/react-i18next/dist/es/useTranslation.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$:()=>useTranslation});var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/slicedToArray.js"),_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/defineProperty.js"),react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/index.js"),_context__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react-i18next/dist/es/context.js"),_utils__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react-i18next/dist/es/utils.js");function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__.Z)(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}var usePrevious=function usePrevious(value,ignore){var ref=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)();return(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)((function(){ref.current=ignore?ref.current:value}),[value,ignore]),ref.current};function useTranslation(ns){var props=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i18nFromProps=props.i18n,_ref=(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(_context__WEBPACK_IMPORTED_MODULE_2__.OO)||{},i18nFromContext=_ref.i18n,defaultNSFromContext=_ref.defaultNS,i18n=i18nFromProps||i18nFromContext||(0,_context__WEBPACK_IMPORTED_MODULE_2__.nI)();if(i18n&&!i18n.reportNamespaces&&(i18n.reportNamespaces=new _context__WEBPACK_IMPORTED_MODULE_2__.zv),!i18n){(0,_utils__WEBPACK_IMPORTED_MODULE_3__.O4)("You will need to pass in an i18next instance by using initReactI18next");var notReadyT=function notReadyT(k){return Array.isArray(k)?k[k.length-1]:k},retNotReady=[notReadyT,{},!1];return retNotReady.t=notReadyT,retNotReady.i18n={},retNotReady.ready=!1,retNotReady}i18n.options.react&&void 0!==i18n.options.react.wait&&(0,_utils__WEBPACK_IMPORTED_MODULE_3__.O4)("It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour.");var i18nOptions=_objectSpread(_objectSpread(_objectSpread({},(0,_context__WEBPACK_IMPORTED_MODULE_2__.JP)()),i18n.options.react),props),useSuspense=i18nOptions.useSuspense,keyPrefix=i18nOptions.keyPrefix,namespaces=ns||defaultNSFromContext||i18n.options&&i18n.options.defaultNS;namespaces="string"==typeof namespaces?[namespaces]:namespaces||["translation"],i18n.reportNamespaces.addUsedNamespaces&&i18n.reportNamespaces.addUsedNamespaces(namespaces);var ready=(i18n.isInitialized||i18n.initializedStoreOnce)&&namespaces.every((function(n){return(0,_utils__WEBPACK_IMPORTED_MODULE_3__.F0)(n,i18n,i18nOptions)}));function getT(){return i18n.getFixedT(null,"fallback"===i18nOptions.nsMode?namespaces:namespaces[0],keyPrefix)}var _useState=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(getT),_useState2=(0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_4__.Z)(_useState,2),t=_useState2[0],setT=_useState2[1],joinedNS=namespaces.join(),previousJoinedNS=usePrevious(joinedNS),isMounted=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(!0);(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)((function(){var bindI18n=i18nOptions.bindI18n,bindI18nStore=i18nOptions.bindI18nStore;function boundReset(){isMounted.current&&setT(getT)}return isMounted.current=!0,ready||useSuspense||(0,_utils__WEBPACK_IMPORTED_MODULE_3__.DC)(i18n,namespaces,(function(){isMounted.current&&setT(getT)})),ready&&previousJoinedNS&&previousJoinedNS!==joinedNS&&isMounted.current&&setT(getT),bindI18n&&i18n&&i18n.on(bindI18n,boundReset),bindI18nStore&&i18n&&i18n.store.on(bindI18nStore,boundReset),function(){isMounted.current=!1,bindI18n&&i18n&&bindI18n.split(" ").forEach((function(e){return i18n.off(e,boundReset)})),bindI18nStore&&i18n&&bindI18nStore.split(" ").forEach((function(e){return i18n.store.off(e,boundReset)}))}}),[i18n,joinedNS]);var isInitial=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(!0);(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)((function(){isMounted.current&&!isInitial.current&&setT(getT),isInitial.current=!1}),[i18n,keyPrefix]);var ret=[t,i18n,ready];if(ret.t=t,ret.i18n=i18n,ret.ready=ready,ready)return ret;if(!ready&&!useSuspense)return ret;throw new Promise((function(resolve){(0,_utils__WEBPACK_IMPORTED_MODULE_3__.DC)(i18n,namespaces,(function(){resolve()}))}))}},"./node_modules/react-i18next/dist/es/utils.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function warn(){if(console&&console.warn){for(var _console,_len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++)args[_key]=arguments[_key];"string"==typeof args[0]&&(args[0]="react-i18next:: ".concat(args[0])),(_console=console).warn.apply(_console,args)}}__webpack_require__.d(__webpack_exports__,{DC:()=>loadNamespaces,F0:()=>hasLoadedNamespace,Gf:()=>getDisplayName,O4:()=>warnOnce});var alreadyWarned={};function warnOnce(){for(var _len2=arguments.length,args=new Array(_len2),_key2=0;_key2<_len2;_key2++)args[_key2]=arguments[_key2];"string"==typeof args[0]&&alreadyWarned[args[0]]||("string"==typeof args[0]&&(alreadyWarned[args[0]]=new Date),warn.apply(void 0,args))}function loadNamespaces(i18n,ns,cb){i18n.loadNamespaces(ns,(function(){if(i18n.isInitialized)cb();else{i18n.on("initialized",(function initialized(){setTimeout((function(){i18n.off("initialized",initialized)}),0),cb()}))}}))}function hasLoadedNamespace(ns,i18n){var options=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return i18n.languages&&i18n.languages.length?void 0!==i18n.options.ignoreJSONStructure?i18n.hasLoadedNamespace(ns,{precheck:function precheck(i18nInstance,loadNotPending){if(options.bindI18n&&options.bindI18n.indexOf("languageChanging")>-1&&i18nInstance.services.backendConnector.backend&&i18nInstance.isLanguageChangingTo&&!loadNotPending(i18nInstance.isLanguageChangingTo,ns))return!1}}):function oldI18nextHasLoadedNamespace(ns,i18n){var options=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},lng=i18n.languages[0],fallbackLng=!!i18n.options&&i18n.options.fallbackLng,lastLng=i18n.languages[i18n.languages.length-1];if("cimode"===lng.toLowerCase())return!0;var loadNotPending=function loadNotPending(l,n){var loadState=i18n.services.backendConnector.state["".concat(l,"|").concat(n)];return-1===loadState||2===loadState};return!(options.bindI18n&&options.bindI18n.indexOf("languageChanging")>-1&&i18n.services.backendConnector.backend&&i18n.isLanguageChangingTo&&!loadNotPending(i18n.isLanguageChangingTo,ns)||!i18n.hasResourceBundle(lng,ns)&&i18n.services.backendConnector.backend&&(!i18n.options.resources||i18n.options.partialBundledLanguages)&&(!loadNotPending(lng,ns)||fallbackLng&&!loadNotPending(lastLng,ns)))}(ns,i18n,options):(warnOnce("i18n.languages were undefined or empty",i18n.languages),!0)}function getDisplayName(Component){return Component.displayName||Component.name||("string"==typeof Component&&Component.length>0?Component:"Unknown")}}}]);
//# sourceMappingURL=4685.a64aa667.iframe.bundle.js.map