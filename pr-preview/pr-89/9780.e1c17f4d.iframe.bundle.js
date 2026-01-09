/*! For license information please see 9780.e1c17f4d.iframe.bundle.js.LICENSE.txt */
(self.webpackChunk_memori_ai_memori_react=self.webpackChunk_memori_ai_memori_react||[]).push([[9780],{"./node_modules/@headlessui/react/dist/components/keyboard.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{D:()=>o});var r,o=((r=o||{}).Space=" ",r.Enter="Enter",r.Escape="Escape",r.Backspace="Backspace",r.Delete="Delete",r.ArrowLeft="ArrowLeft",r.ArrowUp="ArrowUp",r.ArrowRight="ArrowRight",r.ArrowDown="ArrowDown",r.Home="Home",r.End="End",r.PageUp="PageUp",r.PageDown="PageDown",r.Tab="Tab",r)},"./node_modules/@headlessui/react/dist/hooks/use-disposables.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{L:()=>p});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_utils_disposables_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@headlessui/react/dist/utils/disposables.js");function p(){let[e]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(_utils_disposables_js__WEBPACK_IMPORTED_MODULE_1__.e);return(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>()=>e.dispose(),[e]),e}},"./node_modules/@headlessui/react/dist/hooks/use-event.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{_:()=>o});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-latest-value.js");let o=function(t){let e=(0,_use_latest_value_js__WEBPACK_IMPORTED_MODULE_1__.Y)(t);return react__WEBPACK_IMPORTED_MODULE_0__.useCallback((...r)=>e.current(...r),[e])}},"./node_modules/@headlessui/react/dist/hooks/use-id.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{B:()=>I});var u,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js"),_use_server_handoff_complete_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-server-handoff-complete.js");let l=0;function r(){return++l}let I=null!=(u=react__WEBPACK_IMPORTED_MODULE_0__.useId)?u:function(){let n=(0,_use_server_handoff_complete_js__WEBPACK_IMPORTED_MODULE_2__.g)(),[e,o]=react__WEBPACK_IMPORTED_MODULE_0__.useState(n?r:null);return(0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.s)(()=>{null===e&&o(r())},[e]),null!=e?""+e:void 0}},"./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{s:()=>s});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");let s=__webpack_require__("./node_modules/@headlessui/react/dist/utils/ssr.js").S?react__WEBPACK_IMPORTED_MODULE_0__.useEffect:react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect},"./node_modules/@headlessui/react/dist/hooks/use-latest-value.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Y:()=>s});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");function s(e){let r=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(e);return(0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.s)(()=>{r.current=e},[e]),r}},"./node_modules/@headlessui/react/dist/hooks/use-outside-click.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{j:()=>L});var react=__webpack_require__("./node_modules/react/index.js"),focus_management=__webpack_require__("./node_modules/@headlessui/react/dist/utils/focus-management.js"),use_latest_value=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-latest-value.js");function d(e,r,n){let o=(0,use_latest_value.Y)(r);(0,react.useEffect)(()=>{function t(u){o.current(u)}return document.addEventListener(e,t,n),()=>document.removeEventListener(e,t,n)},[e,n])}function L(E,m,c=!0){let i=(0,react.useRef)(!1);function f(e,o){if(!i.current||e.defaultPrevented)return;let l=function r(t){return"function"==typeof t?r(t()):Array.isArray(t)||t instanceof Set?t:[t]}(E),n=o(e);if(null!==n&&n.getRootNode().contains(n)){for(let r of l){if(null===r)continue;let t=r instanceof HTMLElement?r:r.current;if(null!=t&&t.contains(n))return}return!(0,focus_management.Bm)(n,focus_management.MZ.Loose)&&-1!==n.tabIndex&&e.preventDefault(),m(e,n)}}(0,react.useEffect)(()=>{requestAnimationFrame(()=>{i.current=c})},[c]);let u=(0,react.useRef)(null);d("mousedown",e=>{var o,l;i.current&&(u.current=(null==(l=null==(o=e.composedPath)?void 0:o.call(e))?void 0:l[0])||e.target)},!0),d("click",e=>{!u.current||(f(e,()=>u.current),u.current=null)},!0),d("blur",e=>f(e,()=>window.document.activeElement instanceof HTMLIFrameElement?window.document.activeElement:null),!0)}},"./node_modules/@headlessui/react/dist/hooks/use-owner.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{g:()=>n});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_utils_owner_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@headlessui/react/dist/utils/owner.js");function n(...e){return(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>(0,_utils_owner_js__WEBPACK_IMPORTED_MODULE_1__.T)(...e),[...e])}},"./node_modules/@headlessui/react/dist/hooks/use-resolve-button-type.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{c:()=>s});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");function i(t){var n;if(t.type)return t.type;let e=null!=(n=t.as)?n:"button";return"string"==typeof e&&"button"===e.toLowerCase()?"button":void 0}function s(t,e){let[n,u]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(()=>i(t));return(0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.s)(()=>{u(i(t))},[t.type,t.as]),(0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.s)(()=>{n||!e.current||e.current instanceof HTMLButtonElement&&!e.current.hasAttribute("type")&&u("button")},[n,e]),n}},"./node_modules/@headlessui/react/dist/hooks/use-server-handoff-complete.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{g:()=>a});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");let r={serverHandoffComplete:!1};function a(){let[e,f]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(r.serverHandoffComplete);return(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{!0!==e&&f(!0)},[e]),(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{!1===r.serverHandoffComplete&&(r.serverHandoffComplete=!0)},[]),e}},"./node_modules/@headlessui/react/dist/hooks/use-sync-refs.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{P:()=>y,a:()=>T});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_use_event_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-event.js");let u=Symbol();function T(t,n=!0){return Object.assign(t,{[u]:n})}function y(...t){let n=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(t);(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{n.current=t},[t]);let c=(0,_use_event_js__WEBPACK_IMPORTED_MODULE_1__._)(e=>{for(let o of n.current)null!=o&&("function"==typeof o?o(e):o.current=e)});return t.every(e=>null==e||(null==e?void 0:e[u]))?void 0:c}},"./node_modules/@headlessui/react/dist/hooks/use-tree-walker.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{i:()=>F});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js"),_utils_owner_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@headlessui/react/dist/utils/owner.js");function F({container:e,accept:t,walk:r,enabled:c=!0}){let o=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(t),l=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(r);(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{o.current=t,l.current=r},[t,r]),(0,_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_1__.s)(()=>{if(!e||!c)return;let n=(0,_utils_owner_js__WEBPACK_IMPORTED_MODULE_2__.T)(e);if(!n)return;let f=o.current,p=l.current,d=Object.assign(i=>f(i),{acceptNode:f}),u=n.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,d,!1);for(;u.nextNode();)p(u.currentNode)},[e,c,o,l])}},"./node_modules/@headlessui/react/dist/internal/open-closed.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{El:()=>C,O_:()=>s,Uw:()=>p});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");let o=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);o.displayName="OpenClosedContext";var e,p=((e=p||{})[e.Open=0]="Open",e[e.Closed=1]="Closed",e);function s(){return(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(o)}function C({value:t,children:n}){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(o.Provider,{value:t},n)}},"./node_modules/@headlessui/react/dist/utils/bugs.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";function r(n){let e=n.parentElement,l=null;for(;e&&!(e instanceof HTMLFieldSetElement);)e instanceof HTMLLegendElement&&(l=e),e=e.parentElement;let t=""===(null==e?void 0:e.getAttribute("disabled"));return(!t||!function i(n){if(!n)return!1;let e=n.previousElementSibling;for(;null!==e;){if(e instanceof HTMLLegendElement)return!1;e=e.previousElementSibling}return!0}(l))&&t}__webpack_require__.d(__webpack_exports__,{l:()=>r})},"./node_modules/@headlessui/react/dist/utils/calculate-active-index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{B:()=>a,X:()=>x});var e,a=((e=a||{})[e.First=0]="First",e[e.Previous=1]="Previous",e[e.Next=2]="Next",e[e.Last=3]="Last",e[e.Specific=4]="Specific",e[e.Nothing=5]="Nothing",e);function x(r,n){let t=n.resolveItems();if(t.length<=0)return null;let l=n.resolveActiveIndex(),s=null!=l?l:-1,d=(()=>{switch(r.focus){case 0:return t.findIndex(e=>!n.resolveDisabled(e));case 1:{let e=t.slice().reverse().findIndex((i,c,u)=>!(-1!==s&&u.length-c-1>=s)&&!n.resolveDisabled(i));return-1===e?e:t.length-1-e}case 2:return t.findIndex((e,i)=>!(i<=s)&&!n.resolveDisabled(e));case 3:{let e=t.slice().reverse().findIndex(i=>!n.resolveDisabled(i));return-1===e?e:t.length-1-e}case 4:return t.findIndex(e=>n.resolveId(e)===r.id);case 5:return null;default:!function f(r){throw new Error("Unexpected object: "+r)}(r)}})();return-1===d?l:d}},"./node_modules/@headlessui/react/dist/utils/disposables.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{e:()=>m});var _micro_task_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@headlessui/react/dist/utils/micro-task.js");function m(){let n=[],i=[],r={enqueue(e){i.push(e)},addEventListener:(e,t,a,o)=>(e.addEventListener(t,a,o),r.add(()=>e.removeEventListener(t,a,o))),requestAnimationFrame(...e){let t=requestAnimationFrame(...e);return r.add(()=>cancelAnimationFrame(t))},nextFrame:(...e)=>r.requestAnimationFrame(()=>r.requestAnimationFrame(...e)),setTimeout(...e){let t=setTimeout(...e);return r.add(()=>clearTimeout(t))},microTask(...e){let t={current:!0};return(0,_micro_task_js__WEBPACK_IMPORTED_MODULE_0__._)(()=>{t.current&&e[0]()}),r.add(()=>{t.current=!1})},add:e=>(n.push(e),()=>{let t=n.indexOf(e);if(t>=0){let[a]=n.splice(t,1);a()}}),dispose(){for(let e of n.splice(0))e()},async workQueue(){for(let e of i.splice(0))await e()}};return r}},"./node_modules/@headlessui/react/dist/utils/focus-management.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{BD:()=>T,Bm:()=>F,CU:()=>O,Fh:()=>I,MZ:()=>N,Me:()=>M,p9:()=>D,pW:()=>h,wl:()=>S});var _disposables_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@headlessui/react/dist/utils/disposables.js"),_match_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@headlessui/react/dist/utils/match.js"),_owner_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@headlessui/react/dist/utils/owner.js");let m=["[contentEditable=true]","[tabindex]","a[href]","area[href]","button:not([disabled])","iframe","input:not([disabled])","select:not([disabled])","textarea:not([disabled])"].map(e=>`${e}:not([tabindex='-1'])`).join(",");var r,o,n,T=((n=T||{})[n.First=1]="First",n[n.Previous=2]="Previous",n[n.Next=4]="Next",n[n.Last=8]="Last",n[n.WrapAround=16]="WrapAround",n[n.NoScroll=32]="NoScroll",n),M=((o=M||{})[o.Error=0]="Error",o[o.Overflow=1]="Overflow",o[o.Success=2]="Success",o[o.Underflow=3]="Underflow",o),b=((r=b||{})[r.Previous=-1]="Previous",r[r.Next=1]="Next",r);function d(e=document.body){return null==e?[]:Array.from(e.querySelectorAll(m))}var N=(r=>(r[r.Strict=0]="Strict",r[r.Loose=1]="Loose",r))(N||{});function F(e,t=0){var r;return e!==(null==(r=(0,_owner_js__WEBPACK_IMPORTED_MODULE_2__.T)(e))?void 0:r.body)&&(0,_match_js__WEBPACK_IMPORTED_MODULE_1__.Y)(t,{0:()=>e.matches(m),1(){let l=e;for(;null!==l;){if(l.matches(m))return!0;l=l.parentElement}return!1}})}function I(e){let t=(0,_owner_js__WEBPACK_IMPORTED_MODULE_2__.T)(e);(0,_disposables_js__WEBPACK_IMPORTED_MODULE_0__.e)().nextFrame(()=>{t&&!F(t.activeElement,0)&&h(e)})}function h(e){null==e||e.focus({preventScroll:!0})}let w=["textarea","input"].join(",");function S(e,t=r=>r){return e.slice().sort((r,l)=>{let o=t(r),s=t(l);if(null===o||null===s)return 0;let n=o.compareDocumentPosition(s);return n&Node.DOCUMENT_POSITION_FOLLOWING?-1:n&Node.DOCUMENT_POSITION_PRECEDING?1:0})}function D(e,t){return O(d(),t,!0,e)}function O(e,t,r=!0,l=null){let o=Array.isArray(e)?e.length>0?e[0].ownerDocument:document:e.ownerDocument,s=Array.isArray(e)?r?S(e):e:d(e);l=null!=l?l:o.activeElement;let u,n=(()=>{if(5&t)return 1;if(10&t)return-1;throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last")})(),E=(()=>{if(1&t)return 0;if(2&t)return Math.max(0,s.indexOf(l))-1;if(4&t)return Math.max(0,s.indexOf(l))+1;if(8&t)return s.length-1;throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last")})(),x=32&t?{preventScroll:!0}:{},f=0,i=s.length;do{if(f>=i||f+i<=0)return 0;let a=E+f;if(16&t)a=(a+i)%i;else{if(a<0)return 3;if(a>=i)return 1}u=s[a],null==u||u.focus(x),f+=n}while(u!==o.activeElement);return 6&t&&function H(e){var t,r;return null!=(r=null==(t=null==e?void 0:e.matches)?void 0:t.call(e,w))&&r}(u)&&u.select(),u.hasAttribute("tabindex")||u.setAttribute("tabindex","0"),2}},"./node_modules/@headlessui/react/dist/utils/match.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";function u(r,n,...a){if(r in n){let e=n[r];return"function"==typeof e?e(...a):e}let t=new Error(`Tried to handle "${r}" but there is no handler defined. Only defined handlers are: ${Object.keys(n).map(e=>`"${e}"`).join(", ")}.`);throw Error.captureStackTrace&&Error.captureStackTrace(t,u),t}__webpack_require__.d(__webpack_exports__,{Y:()=>u})},"./node_modules/@headlessui/react/dist/utils/micro-task.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";function t(e){"function"==typeof queueMicrotask?queueMicrotask(e):Promise.resolve().then(e).catch(o=>setTimeout(()=>{throw o}))}__webpack_require__.d(__webpack_exports__,{_:()=>t})},"./node_modules/@headlessui/react/dist/utils/owner.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{T:()=>e});var _ssr_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@headlessui/react/dist/utils/ssr.js");function e(r){return _ssr_js__WEBPACK_IMPORTED_MODULE_0__.S?null:r instanceof Node?r.ownerDocument:null!=r&&r.hasOwnProperty("current")&&r.current instanceof Node?r.current.ownerDocument:document}},"./node_modules/@headlessui/react/dist/utils/render.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{FX:()=>C,O5:()=>S,XX:()=>$,mK:()=>j,oE:()=>F});var e,a,react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_match_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@headlessui/react/dist/utils/match.js"),S=((a=S||{})[a.None=0]="None",a[a.RenderStrategy=1]="RenderStrategy",a[a.Static=2]="Static",a),j=((e=j||{})[e.Unmount=0]="Unmount",e[e.Hidden=1]="Hidden",e);function $({ourProps:r,theirProps:t,slot:e,defaultTag:a,features:o,visible:n=!0,name:l}){let s=T(t,r);if(n)return p(s,e,a,l);let u=null!=o?o:0;if(2&u){let{static:i=!1,...d}=s;if(i)return p(d,e,a,l)}if(1&u){let{unmount:i=!0,...d}=s;return(0,_match_js__WEBPACK_IMPORTED_MODULE_1__.Y)(i?0:1,{0:()=>null,1:()=>p({...d,hidden:!0,style:{display:"none"}},e,a,l)})}return p(s,e,a,l)}function p(r,t={},e,a){let{as:o=e,children:n,refName:l="ref",...s}=m(r,["unmount","static"]),u=void 0!==r.ref?{[l]:r.ref}:{},i="function"==typeof n?n(t):n;s.className&&"function"==typeof s.className&&(s.className=s.className(t));let d={};if(t){let f=!1,y=[];for(let[h,g]of Object.entries(t))"boolean"==typeof g&&(f=!0),!0===g&&y.push(h);f&&(d["data-headlessui-state"]=y.join(" "))}if(o===react__WEBPACK_IMPORTED_MODULE_0__.Fragment&&Object.keys(F(s)).length>0){if(!(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(i)||Array.isArray(i)&&i.length>1)throw new Error(['Passing props on "Fragment"!',"",`The current component <${a} /> is rendering a "Fragment".`,"However we need to passthrough the following props:",Object.keys(s).map(f=>`  - ${f}`).join("\n"),"","You can apply a few solutions:",['Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".',"Render a single element as the child so that we can forward the props onto that element."].map(f=>`  - ${f}`).join("\n")].join("\n"));return(0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(i,Object.assign({},T(i.props,F(m(s,["ref"]))),d,u,function w(...r){return{ref:r.every(t=>null==t)?void 0:t=>{for(let e of r)null!=e&&("function"==typeof e?e(t):e.current=t)}}}(i.ref,u.ref)))}return(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(o,Object.assign({},m(s,["ref"]),o!==react__WEBPACK_IMPORTED_MODULE_0__.Fragment&&u,o!==react__WEBPACK_IMPORTED_MODULE_0__.Fragment&&d),i)}function T(...r){if(0===r.length)return{};if(1===r.length)return r[0];let t={},e={};for(let o of r)for(let n in o)n.startsWith("on")&&"function"==typeof o[n]?(null!=e[n]||(e[n]=[]),e[n].push(o[n])):t[n]=o[n];if(t.disabled||t["aria-disabled"])return Object.assign(t,Object.fromEntries(Object.keys(e).map(o=>[o,void 0])));for(let o in e)Object.assign(t,{[o](n,...l){let s=e[o];for(let u of s){if((n instanceof Event||(null==n?void 0:n.nativeEvent)instanceof Event)&&n.defaultPrevented)return;u(n,...l)}}});return t}function C(r){var t;return Object.assign((0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(r),{displayName:null!=(t=r.displayName)?t:r.name})}function F(r){let t=Object.assign({},r);for(let e in t)void 0===t[e]&&delete t[e];return t}function m(r,t=[]){let e=Object.assign({},r);for(let a of t)a in e&&delete e[a];return e}},"./node_modules/@headlessui/react/dist/utils/ssr.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{S:()=>e});const e="undefined"==typeof window||"undefined"==typeof document},"./node_modules/classnames/index.js":(module,exports)=>{var __WEBPACK_AMD_DEFINE_RESULT__;!function(){"use strict";var hasOwn={}.hasOwnProperty;function classNames(){for(var classes="",i=0;i<arguments.length;i++){var arg=arguments[i];arg&&(classes=appendClass(classes,parseValue(arg)))}return classes}function parseValue(arg){if("string"==typeof arg||"number"==typeof arg)return arg;if("object"!=typeof arg)return"";if(Array.isArray(arg))return classNames.apply(null,arg);if(arg.toString!==Object.prototype.toString&&!arg.toString.toString().includes("[native code]"))return arg.toString();var classes="";for(var key in arg)hasOwn.call(arg,key)&&arg[key]&&(classes=appendClass(classes,key));return classes}function appendClass(value,newClass){return newClass?value?value+" "+newClass:value+newClass:value}module.exports?(classNames.default=classNames,module.exports=classNames):void 0===(__WEBPACK_AMD_DEFINE_RESULT__=function(){return classNames}.apply(exports,[]))||(module.exports=__WEBPACK_AMD_DEFINE_RESULT__)}()},"./node_modules/react-hot-toast/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{l$:()=>Oe,Ay:()=>Vt});var react=__webpack_require__("./node_modules/react/index.js");let e={data:""},t=t=>"object"==typeof window?((t?t.querySelector("#_goober"):window._goober)||Object.assign((t||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:t||e,l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,a=/\/\*[^]*?\*\/|  +/g,n=/\n+/g,o=(e,t)=>{let r="",l="",a="";for(let n in e){let c=e[n];"@"==n[0]?"i"==n[1]?r=n+" "+c+";":l+="f"==n[1]?o(c,n):n+"{"+o(c,"k"==n[1]?"":t)+"}":"object"==typeof c?l+=o(c,t?t.replace(/([^,])+/g,e=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):n):null!=c&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=o.p?o.p(n,c):n+":"+c+";")}return r+(t&&a?t+"{"+a+"}":a)+l},c={},s=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+s(e[r]);return t}return e},i=(e,t,r,i,p)=>{let u=s(e),d=c[u]||(c[u]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(u));if(!c[d]){let t=u!==e?e:(e=>{let t,r,o=[{}];for(;t=l.exec(e.replace(a,""));)t[4]?o.shift():t[3]?(r=t[3].replace(n," ").trim(),o.unshift(o[0][r]=o[0][r]||{})):o[0][t[1]]=t[2].replace(n," ").trim();return o[0]})(e);c[d]=o(p?{["@keyframes "+d]:t}:t,r?"":"."+d)}let f=r&&c.g?c.g:null;return r&&(c.g=c[d]),((e,t,r,l)=>{l?t.data=t.data.replace(l,e):-1===t.data.indexOf(e)&&(t.data=r?e+t.data:t.data+e)})(c[d],t,i,f),d};function u(e){let r=this||{},l=e.call?e(r.p):e;return i(l.unshift?l.raw?((e,t,r)=>e.reduce((e,l,a)=>{let n=t[a];if(n&&n.call){let e=n(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;n=t?"."+t:e&&"object"==typeof e?e.props?"":o(e,""):!1===e?"":e}return e+l+(null==n?"":n)},""))(l,[].slice.call(arguments,1),r.p):l.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):l,t(r.target),r.g,r.o,r.k)}u.bind({g:1});let d,f,g,h=u.bind({k:1});function j(e,t){let r=this||{};return function(){let l=arguments;function a(n,o){let c=Object.assign({},n),s=c.className||a.className;r.p=Object.assign({theme:f&&f()},c),r.o=/ *go\d+/.test(s),c.className=u.apply(r,l)+(s?" "+s:""),t&&(c.ref=o);let i=e;return e[0]&&(i=c.as||e,delete c.as),g&&i[0]&&g(c),d(i,c)}return t?t(a):a}}var dist_f=(e,t)=>(e=>"function"==typeof e)(e)?e(t):e,F=(()=>{let e=0;return()=>(++e).toString()})(),A=(()=>{let e;return()=>{if(void 0===e&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),U=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(o=>o.id===t.toast.id?{...o,...t.toast}:o)};case 2:let{toast:r}=t;return U(e,{type:e.toasts.find(o=>o.id===r.id)?1:0,toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(o=>o.id===s||void 0===s?{...o,dismissed:!0,visible:!1}:o)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(o=>o.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(o=>({...o,pauseDuration:o.pauseDuration+a}))}}},P=[],y={toasts:[],pausedAt:void 0},dist_u=e=>{y=U(y,e),P.forEach(t=>{t(y)})},q={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},x=e=>(t,r)=>{let s=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||F()}))(t,e,r);return dist_u({type:2,toast:s}),s.id},dist_c=(e,t)=>x("blank")(e,t);dist_c.error=x("error"),dist_c.success=x("success"),dist_c.loading=x("loading"),dist_c.custom=x("custom"),dist_c.dismiss=e=>{dist_u({type:3,toastId:e})},dist_c.remove=e=>dist_u({type:4,toastId:e}),dist_c.promise=(e,t,r)=>{let s=dist_c.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(a=>{let o=t.success?dist_f(t.success,a):void 0;return o?dist_c.success(o,{id:s,...r,...null==r?void 0:r.success}):dist_c.dismiss(s),a}).catch(a=>{let o=t.error?dist_f(t.error,a):void 0;o?dist_c.error(o,{id:s,...r,...null==r?void 0:r.error}):dist_c.dismiss(s)}),e};var K=(e,t)=>{dist_u({type:1,toast:{id:e,height:t}})},X=()=>{dist_u({type:5,time:Date.now()})},dist_b=new Map,O=e=>{let{toasts:t,pausedAt:r}=((e={})=>{let[t,r]=(0,react.useState)(y),s=(0,react.useRef)(y);(0,react.useEffect)(()=>(s.current!==y&&r(y),P.push(r),()=>{let o=P.indexOf(r);o>-1&&P.splice(o,1)}),[]);let a=t.toasts.map(o=>{var n,i,p;return{...e,...e[o.type],...o,removeDelay:o.removeDelay||(null==(n=e[o.type])?void 0:n.removeDelay)||(null==e?void 0:e.removeDelay),duration:o.duration||(null==(i=e[o.type])?void 0:i.duration)||(null==e?void 0:e.duration)||q[o.type],style:{...e.style,...null==(p=e[o.type])?void 0:p.style,...o.style}}});return{...t,toasts:a}})(e);(0,react.useEffect)(()=>{if(r)return;let o=Date.now(),n=t.map(i=>{if(i.duration===1/0)return;let p=(i.duration||0)+i.pauseDuration-(o-i.createdAt);if(!(p<0))return setTimeout(()=>dist_c.dismiss(i.id),p);i.visible&&dist_c.dismiss(i.id)});return()=>{n.forEach(i=>i&&clearTimeout(i))}},[t,r]);let s=(0,react.useCallback)(()=>{r&&dist_u({type:6,time:Date.now()})},[r]),a=(0,react.useCallback)((o,n)=>{let{reverseOrder:i=!1,gutter:p=8,defaultPosition:d}=n||{},h=t.filter(m=>(m.position||d)===(o.position||d)&&m.height),v=h.findIndex(m=>m.id===o.id),S=h.filter((m,E)=>E<v&&m.visible).length;return h.filter(m=>m.visible).slice(...i?[S+1]:[0,S]).reduce((m,E)=>m+(E.height||0)+p,0)},[t]);return(0,react.useEffect)(()=>{t.forEach(o=>{if(o.dismissed)((e,t=1e3)=>{if(dist_b.has(e))return;let r=setTimeout(()=>{dist_b.delete(e),dist_u({type:4,toastId:e})},t);dist_b.set(e,r)})(o.id,o.removeDelay);else{let n=dist_b.get(o.id);n&&(clearTimeout(n),dist_b.delete(o.id))}})},[t]),{toasts:t,handlers:{updateHeight:K,startPause:X,endPause:s,calculateOffset:a}}},oe=h`
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
}`,k=j("div")`
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
}`,_=j("div")`
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
`,fe=h`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Te=j("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${fe} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,M=({toast:e})=>{let{icon:t,type:r,iconTheme:s}=e;return void 0!==t?"string"==typeof t?react.createElement(Te,null,t):t:"blank"===r?null:react.createElement(le,null,react.createElement(V,{...s}),"loading"!==r&&react.createElement(ue,null,"error"===r?react.createElement(k,{...s}):react.createElement(_,{...s})))},ye=e=>`\n0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}\n100% {transform: translate3d(0,0,0) scale(1); opacity:1;}\n`,ge=e=>`\n0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}\n100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}\n`,be=j("div")`
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
`,C=react.memo(({toast:e,position:t,style:r,children:s})=>{let a=e.height?((e,t)=>{let s=e.includes("top")?1:-1,[a,o]=A()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[ye(s),ge(s)];return{animation:t?`${h(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${h(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},o=react.createElement(M,{toast:e}),n=react.createElement(Se,{...e.ariaProps},dist_f(e.message,e));return react.createElement(be,{className:e.className,style:{...a,...r,...e.style}},"function"==typeof s?s({icon:o,message:n}):react.createElement(react.Fragment,null,o,n))});!function m(e,t,r,l){o.p=t,d=e,f=r,g=l}(react.createElement);var ve=({id:e,className:t,style:r,onHeightUpdate:s,children:a})=>{let o=react.useCallback(n=>{if(n){let i=()=>{let p=n.getBoundingClientRect().height;s(e,p)};i(),new MutationObserver(i).observe(n,{subtree:!0,childList:!0,characterData:!0})}},[e,s]);return react.createElement("div",{ref:o,className:t,style:r},a)},De=u`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,Oe=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:s,children:a,containerStyle:o,containerClassName:n})=>{let{toasts:i,handlers:p}=O(r);return react.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...o},className:n,onMouseEnter:p.startPause,onMouseLeave:p.endPause},i.map(d=>{let h=d.position||t,S=((e,t)=>{let r=e.includes("top"),s=r?{top:0}:{bottom:0},a=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:A()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...s,...a}})(h,p.calculateOffset(d,{reverseOrder:e,gutter:s,defaultPosition:t}));return react.createElement(ve,{id:d.id,key:d.id,onHeightUpdate:p.updateHeight,className:d.visible?De:"",style:S},"custom"===d.type?dist_f(d.message,d):a?a(d):react.createElement(C,{toast:d,position:h}))}))},Vt=dist_c}}]);
//# sourceMappingURL=9780.e1c17f4d.iframe.bundle.js.map