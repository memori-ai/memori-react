"use strict";(self.webpackChunk_memori_ai_memori_react=self.webpackChunk_memori_ai_memori_react||[]).push([[1954,6716,9573],{"./node_modules/@headlessui/react/dist/components/description/description.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{V:()=>F,r:()=>k});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_hooks_use_id_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-id.js"),_utils_render_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@headlessui/react/dist/utils/render.js"),_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js"),_hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-sync-refs.js"),_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-event.js");let d=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);function u(){let r=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(d);if(null===r){let t=new Error("You used a <Description /> component, but it is not inside a relevant parent.");throw Error.captureStackTrace&&Error.captureStackTrace(t,u),t}return r}function k(){let[r,t]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);return[r.length>0?r.join(" "):void 0,(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>function(e){let i=(0,_hooks_use_event_js__WEBPACK_IMPORTED_MODULE_5__._)(n=>(t(o=>[...o,n]),()=>t(o=>{let c=o.slice(),p=c.indexOf(n);return-1!==p&&c.splice(p,1),c}))),s=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>({register:i,slot:e.slot,name:e.name,props:e.props}),[i,e.slot,e.name,e.props]);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(d.Provider,{value:s},e.children)},[t])]}let F=(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_2__.FX)(function(t,a){let e=u(),i=`headlessui-description-${(0,_hooks_use_id_js__WEBPACK_IMPORTED_MODULE_1__.B)()}`,s=(0,_hooks_use_sync_refs_js__WEBPACK_IMPORTED_MODULE_4__.P)(a);(0,_hooks_use_iso_morphic_effect_js__WEBPACK_IMPORTED_MODULE_3__.s)(()=>e.register(i),[i,e.register]);let n=t,o={ref:s,...e.props,id:i};return(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_2__.XX)({ourProps:o,theirProps:n,slot:e.slot||{},defaultTag:"p",name:e.name||"Description"})})},"./node_modules/@headlessui/react/dist/components/dialog/dialog.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{l:()=>gt});var react=__webpack_require__("./node_modules/react/index.js"),match=__webpack_require__("./node_modules/@headlessui/react/dist/utils/match.js"),render=__webpack_require__("./node_modules/@headlessui/react/dist/utils/render.js"),use_sync_refs=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-sync-refs.js"),keyboard=__webpack_require__("./node_modules/@headlessui/react/dist/components/keyboard.js"),bugs=__webpack_require__("./node_modules/@headlessui/react/dist/utils/bugs.js"),use_id=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-id.js"),use_server_handoff_complete=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-server-handoff-complete.js"),internal_hidden=__webpack_require__("./node_modules/@headlessui/react/dist/internal/hidden.js"),focus_management=__webpack_require__("./node_modules/@headlessui/react/dist/utils/focus-management.js"),use_event=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-event.js"),use_latest_value=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-latest-value.js");var use_tab_direction_s=(r=>(r[r.Forwards=0]="Forwards",r[r.Backwards=1]="Backwards",r))(use_tab_direction_s||{});function use_tab_direction_n(){let e=(0,react.useRef)(0);return function s(e,r,n){let o=(0,use_latest_value.Y)(r);(0,react.useEffect)(()=>{function t(i){o.current(i)}return window.addEventListener(e,t,n),()=>window.removeEventListener(e,t,n)},[e,n])}("keydown",o=>{"Tab"===o.key&&(e.current=o.shiftKey?1:0)},!0),e}var use_is_mounted=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-is-mounted.js"),use_owner=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-owner.js");function E(n,e,a,t){let i=(0,use_latest_value.Y)(a);(0,react.useEffect)(()=>{function r(o){i.current(o)}return(n=null!=n?n:window).addEventListener(e,r,t),()=>n.removeEventListener(e,r,t)},[n,e,t])}var micro_task=__webpack_require__("./node_modules/@headlessui/react/dist/utils/micro-task.js"),use_watch=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-watch.js");var v=(r=>(r[r.None=1]="None",r[r.InitialFocus=2]="InitialFocus",r[r.TabLock=4]="TabLock",r[r.FocusLock=8]="FocusLock",r[r.RestoreFocus=16]="RestoreFocus",r[r.All=30]="All",r))(v||{});let fe=Object.assign((0,render.FX)(function(u,e){let l=(0,react.useRef)(null),o=(0,use_sync_refs.P)(l,e),{initialFocus:a,containers:r,features:n=30,...c}=u;(0,use_server_handoff_complete.g)()||(n=1);let s=(0,use_owner.g)(l);!function V({ownerDocument:t},u){let e=(0,react.useRef)(null);E(null==t?void 0:t.defaultView,"focusout",o=>{!u||e.current||(e.current=o.target)},!0),(0,use_watch.F)(()=>{u||((null==t?void 0:t.activeElement)===(null==t?void 0:t.body)&&(0,focus_management.pW)(e.current),e.current=null)},[u]);let l=(0,react.useRef)(!1);(0,react.useEffect)(()=>(l.current=!1,()=>{l.current=!0,(0,micro_task._)(()=>{!l.current||((0,focus_management.pW)(e.current),e.current=null)})}),[])}({ownerDocument:s},Boolean(16&n));let j=function x({ownerDocument:t,container:u,initialFocus:e},l){let o=(0,react.useRef)(null),a=(0,use_is_mounted.a)();return(0,use_watch.F)(()=>{if(!l)return;let r=u.current;!r||(0,micro_task._)(()=>{if(!a.current)return;let n=null==t?void 0:t.activeElement;if(null!=e&&e.current){if((null==e?void 0:e.current)===n)return void(o.current=n)}else if(r.contains(n))return void(o.current=n);null!=e&&e.current?(0,focus_management.pW)(e.current):(0,focus_management.CU)(r,focus_management.BD.First)===focus_management.Me.Error&&console.warn("There are no focusable elements inside the <FocusTrap />"),o.current=null==t?void 0:t.activeElement})},[l]),o}({ownerDocument:s,container:l,initialFocus:a},Boolean(2&n));!function G({ownerDocument:t,container:u,containers:e,previousActiveElement:l},o){let a=(0,use_is_mounted.a)();E(null==t?void 0:t.defaultView,"focus",r=>{if(!o||!a.current)return;let n=new Set(null==e?void 0:e.current);n.add(u);let c=l.current;if(!c)return;let s=r.target;s&&s instanceof HTMLElement?function W(t,u){var e;for(let l of t)if(null!=(e=l.current)&&e.contains(u))return!0;return!1}(n,s)?(l.current=s,(0,focus_management.pW)(s)):(r.preventDefault(),r.stopPropagation(),(0,focus_management.pW)(c)):(0,focus_management.pW)(l.current)},!0)}({ownerDocument:s,container:l,containers:r,previousActiveElement:j},Boolean(8&n));let k=use_tab_direction_n(),p=(0,use_event._)(()=>{let T=l.current;!T||(0,match.Y)(k.current,{[use_tab_direction_s.Forwards]:()=>(0,focus_management.CU)(T,focus_management.BD.First),[use_tab_direction_s.Backwards]:()=>(0,focus_management.CU)(T,focus_management.BD.Last)})}),A={ref:o};return react.createElement(react.Fragment,null,Boolean(4&n)&&react.createElement(internal_hidden.j,{as:"button",type:"button",onFocus:p,features:internal_hidden.O.Focusable}),(0,render.XX)({ourProps:A,theirProps:c,defaultTag:"div",name:"FocusTrap"}),Boolean(4&n)&&react.createElement(internal_hidden.j,{as:"button",type:"button",onFocus:p,features:internal_hidden.O.Focusable}))}),{features:v});var owner=__webpack_require__("./node_modules/@headlessui/react/dist/utils/owner.js"),use_iso_morphic_effect=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js");let i=new Set,r=new Map;function u(t){t.setAttribute("aria-hidden","true"),t.inert=!0}function l(t){let n=r.get(t);!n||(null===n["aria-hidden"]?t.removeAttribute("aria-hidden"):t.setAttribute("aria-hidden",n["aria-hidden"]),t.inert=n.inert)}function M(t,n=!0){(0,use_iso_morphic_effect.s)(()=>{if(!n||!t.current)return;let o=t.current,a=(0,owner.T)(o);if(a){i.add(o);for(let e of r.keys())e.contains(o)&&(l(e),r.delete(e));return a.querySelectorAll("body > *").forEach(e=>{if(e instanceof HTMLElement){for(let f of i)if(e.contains(f))return;1===i.size&&(r.set(e,{"aria-hidden":e.getAttribute("aria-hidden"),inert:e.inert}),u(e))}}),()=>{if(i.delete(o),i.size>0)a.querySelectorAll("body > *").forEach(e=>{if(e instanceof HTMLElement&&!r.has(e)){for(let f of i)if(e.contains(f))return;r.set(e,{"aria-hidden":e.getAttribute("aria-hidden"),inert:e.inert}),u(e)}});else for(let e of r.keys())l(e),r.delete(e)}}},[n])}var react_dom=__webpack_require__("./node_modules/react-dom/index.js");let e=(0,react.createContext)(!1);function portal_force_root_l(){return(0,react.useContext)(e)}function portal_force_root_P(o){return react.createElement(e.Provider,{value:o.force},o.children)}var ssr=__webpack_require__("./node_modules/@headlessui/react/dist/utils/ssr.js");let _=react.Fragment,U=(0,render.FX)(function(u,o){let e=u,r=(0,react.useRef)(null),f=(0,use_sync_refs.P)((0,use_sync_refs.a)(a=>{r.current=a}),o),n=(0,use_owner.g)(r),t=function portal_x(i){let u=portal_force_root_l(),o=(0,react.useContext)(A),e=(0,use_owner.g)(i),[r,f]=(0,react.useState)(()=>{if(!u&&null!==o||ssr.S)return null;let n=null==e?void 0:e.getElementById("headlessui-portal-root");if(n)return n;if(null===e)return null;let t=e.createElement("div");return t.setAttribute("id","headlessui-portal-root"),e.body.appendChild(t)});return(0,react.useEffect)(()=>{null!==r&&(null!=e&&e.body.contains(r)||null==e||e.body.appendChild(r))},[r,e]),(0,react.useEffect)(()=>{u||null!==o&&f(o.current)},[o,f,u]),r}(r),[l]=(0,react.useState)(()=>{var a;return ssr.S?null:null!=(a=null==n?void 0:n.createElement("div"))?a:null}),b=(0,use_server_handoff_complete.g)(),p=(0,react.useRef)(!1);return(0,use_iso_morphic_effect.s)(()=>{if(p.current=!1,t&&l)return t.contains(l)||(l.setAttribute("data-headlessui-portal",""),t.appendChild(l)),()=>{p.current=!0,(0,micro_task._)(()=>{var a;!p.current||!t||!l||(t.removeChild(l),t.childNodes.length<=0&&(null==(a=t.parentElement)||a.removeChild(t)))})}},[t,l]),b&&t&&l?(0,react_dom.createPortal)((0,render.XX)({ourProps:{ref:f},theirProps:e,defaultTag:_,name:"Portal"}),l):null}),j=react.Fragment,A=(0,react.createContext)(null),F=(0,render.FX)(function(u,o){let{target:e,...r}=u,n={ref:(0,use_sync_refs.P)(o)};return react.createElement(A.Provider,{value:e},(0,render.XX)({ourProps:n,theirProps:r,defaultTag:j,name:"Popover.Group"}))}),portal_$=Object.assign(U,{Group:F});var description=__webpack_require__("./node_modules/@headlessui/react/dist/components/description/description.js"),open_closed=__webpack_require__("./node_modules/@headlessui/react/dist/internal/open-closed.js");let a=(0,react.createContext)(()=>{});a.displayName="StackContext";var stack_context_s=(e=>(e[e.Add=0]="Add",e[e.Remove=1]="Remove",e))(stack_context_s||{});function stack_context_M({children:i,onUpdate:r,type:e,element:n,enabled:u}){let l=function stack_context_x(){return(0,react.useContext)(a)}(),o=(0,use_event._)((...t)=>{null==r||r(...t),l(...t)});return(0,use_iso_morphic_effect.s)(()=>{let t=void 0===u||!0===u;return t&&o(0,e,n),()=>{t&&o(1,e,n)}},[o,e,n,u]),react.createElement(a.Provider,{value:o},i)}var use_outside_click=__webpack_require__("./node_modules/@headlessui/react/dist/hooks/use-outside-click.js"),disposables=__webpack_require__("./node_modules/@headlessui/react/dist/utils/disposables.js");var Re=(r=>(r[r.Open=0]="Open",r[r.Closed=1]="Closed",r))(Re||{}),be=(e=>(e[e.SetTitleId=0]="SetTitleId",e))(be||{});let Ae={0:(l,e)=>l.titleId===e.id?l:{...l,titleId:e.id}},dialog_M=(0,react.createContext)(null);function L(l){let e=(0,react.useContext)(dialog_M);if(null===e){let r=new Error(`<${l} /> is missing a parent <Dialog /> component.`);throw Error.captureStackTrace&&Error.captureStackTrace(r,L),r}return e}function Ee(l,e){(0,react.useEffect)(()=>{var p;if(!e||!l)return;let r=(0,disposables.e)();function t(n,d,m){let i=n.style.getPropertyValue(d);return Object.assign(n.style,{[d]:m}),r.add(()=>{Object.assign(n.style,{[d]:i})})}let o=l.documentElement,s=(null!=(p=l.defaultView)?p:window).innerWidth-o.clientWidth;if(t(o,"overflow","hidden"),s>0){t(o,"paddingRight",`${s-(o.clientWidth-o.offsetWidth)}px`)}if(function platform_o(){return/iPhone/gi.test(window.navigator.platform)||/Mac/gi.test(window.navigator.platform)&&window.navigator.maxTouchPoints>0}()){let n=window.pageYOffset;t(o,"position","fixed"),t(o,"marginTop",`-${n}px`),t(o,"width","100%"),r.add(()=>window.scrollTo(0,n))}return r.dispose},[l,e])}function ve(l,e){return(0,match.Y)(e.type,Ae,l,e)}dialog_M.displayName="DialogContext";let Ce=render.O5.RenderStrategy|render.O5.Static,Se=(0,render.FX)(function(e,r){let{open:t,onClose:o,initialFocus:a,__demoMode:s=!1,...p}=e,[n,d]=(0,react.useState)(0),m=(0,open_closed.O_)();void 0===t&&null!==m&&(t=(0,match.Y)(m,{[open_closed.Uw.Open]:!0,[open_closed.Uw.Closed]:!1}));let i=(0,react.useRef)(new Set),T=(0,react.useRef)(null),K=(0,use_sync_refs.P)(T,r),W=(0,react.useRef)(null),P=(0,use_owner.g)(T),B=e.hasOwnProperty("open")||null!==m,G=e.hasOwnProperty("onClose");if(!B&&!G)throw new Error("You have to provide an `open` and an `onClose` prop to the `Dialog` component.");if(!B)throw new Error("You provided an `onClose` prop to the `Dialog`, but forgot an `open` prop.");if(!G)throw new Error("You provided an `open` prop to the `Dialog`, but forgot an `onClose` prop.");if("boolean"!=typeof t)throw new Error(`You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${t}`);if("function"!=typeof o)throw new Error(`You provided an \`onClose\` prop to the \`Dialog\`, but the value is not a function. Received: ${o}`);let u=t?0:1,[y,q]=(0,react.useReducer)(ve,{titleId:null,descriptionId:null,panelRef:(0,react.createRef)()}),h=(0,use_event._)(()=>o(!1)),U=(0,use_event._)(f=>q({type:0,id:f})),_=!!(0,use_server_handoff_complete.g)()&&(!s&&0===u),w=n>1,z=null!==(0,react.useContext)(dialog_M),J=w?"parent":"leaf";M(T,!!w&&_),(0,use_outside_click.j)(()=>{var R,g;return[...Array.from(null!=(R=null==P?void 0:P.querySelectorAll("body > *, [data-headlessui-portal]"))?R:[]).filter(D=>!(!(D instanceof HTMLElement)||D.contains(W.current)||y.panelRef.current&&D.contains(y.panelRef.current))),null!=(g=y.panelRef.current)?g:T.current]},h,_&&!w),E(null==P?void 0:P.defaultView,"keydown",f=>{f.defaultPrevented||f.key===keyboard.D.Escape&&0===u&&(w||(f.preventDefault(),f.stopPropagation(),h()))}),Ee(P,0===u&&!z),(0,react.useEffect)(()=>{if(0!==u||!T.current)return;let f=new IntersectionObserver(R=>{for(let g of R)0===g.boundingClientRect.x&&0===g.boundingClientRect.y&&0===g.boundingClientRect.width&&0===g.boundingClientRect.height&&h()});return f.observe(T.current),()=>f.disconnect()},[u,T,h]);let[Q,X]=(0,description.r)(),Z=`headlessui-dialog-${(0,use_id.B)()}`,ee=(0,react.useMemo)(()=>[{dialogState:u,close:h,setTitleId:U},y],[u,y,h,U]),$=(0,react.useMemo)(()=>({open:0===u}),[u]),te={ref:K,id:Z,role:"dialog","aria-modal":0===u||void 0,"aria-labelledby":y.titleId,"aria-describedby":Q};return react.createElement(stack_context_M,{type:"Dialog",enabled:0===u,element:T,onUpdate:(0,use_event._)((f,R,g)=>{"Dialog"===R&&(0,match.Y)(f,{[stack_context_s.Add](){i.current.add(g),d(D=>D+1)},[stack_context_s.Remove](){i.current.add(g),d(D=>D-1)}})})},react.createElement(portal_force_root_P,{force:!0},react.createElement(portal_$,null,react.createElement(dialog_M.Provider,{value:ee},react.createElement(portal_$.Group,{target:T},react.createElement(portal_force_root_P,{force:!1},react.createElement(X,{slot:$,name:"Dialog.Description"},react.createElement(fe,{initialFocus:a,containers:i,features:_?(0,match.Y)(J,{parent:fe.features.RestoreFocus,leaf:fe.features.All&~fe.features.FocusLock}):fe.features.None},(0,render.XX)({ourProps:te,theirProps:p,slot:$,defaultTag:"div",features:Ce,visible:0===u,name:"Dialog"})))))))),react.createElement(internal_hidden.j,{features:internal_hidden.O.Hidden,ref:W}))}),we=(0,render.FX)(function(e,r){let[{dialogState:t,close:o}]=L("Dialog.Overlay"),a=(0,use_sync_refs.P)(r),s=`headlessui-dialog-overlay-${(0,use_id.B)()}`,p=(0,use_event._)(i=>{if(i.target===i.currentTarget){if((0,bugs.l)(i.currentTarget))return i.preventDefault();i.preventDefault(),i.stopPropagation(),o()}}),n=(0,react.useMemo)(()=>({open:0===t}),[t]);return(0,render.XX)({ourProps:{ref:a,id:s,"aria-hidden":!0,onClick:p},theirProps:e,slot:n,defaultTag:"div",name:"Dialog.Overlay"})}),ke=(0,render.FX)(function(e,r){let[{dialogState:t},o]=L("Dialog.Backdrop"),a=(0,use_sync_refs.P)(r),s=`headlessui-dialog-backdrop-${(0,use_id.B)()}`;(0,react.useEffect)(()=>{if(null===o.panelRef.current)throw new Error("A <Dialog.Backdrop /> component is being used, but a <Dialog.Panel /> component is missing.")},[o.panelRef]);let p=(0,react.useMemo)(()=>({open:0===t}),[t]);return react.createElement(portal_force_root_P,{force:!0},react.createElement(portal_$,null,(0,render.XX)({ourProps:{ref:a,id:s,"aria-hidden":!0},theirProps:e,slot:p,defaultTag:"div",name:"Dialog.Backdrop"})))}),_e=(0,render.FX)(function(e,r){let[{dialogState:t},o]=L("Dialog.Panel"),a=(0,use_sync_refs.P)(r,o.panelRef),s=`headlessui-dialog-panel-${(0,use_id.B)()}`,p=(0,react.useMemo)(()=>({open:0===t}),[t]),n=(0,use_event._)(i=>{i.stopPropagation()});return(0,render.XX)({ourProps:{ref:a,id:s,onClick:n},theirProps:e,slot:p,defaultTag:"div",name:"Dialog.Panel"})}),Ie=(0,render.FX)(function(e,r){let[{dialogState:t,setTitleId:o}]=L("Dialog.Title"),a=`headlessui-dialog-title-${(0,use_id.B)()}`,s=(0,use_sync_refs.P)(r);(0,react.useEffect)(()=>(o(a),()=>o(null)),[a,o]);let p=(0,react.useMemo)(()=>({open:0===t}),[t]);return(0,render.XX)({ourProps:{ref:s,id:a},theirProps:e,slot:p,defaultTag:"h2",name:"Dialog.Title"})}),gt=Object.assign(Se,{Backdrop:ke,Panel:_e,Overlay:we,Title:Ie,Description:description.V})},"./node_modules/@headlessui/react/dist/hooks/use-owner.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{g:()=>n});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_utils_owner_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@headlessui/react/dist/utils/owner.js");function n(...e){return(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>(0,_utils_owner_js__WEBPACK_IMPORTED_MODULE_1__.T)(...e),[...e])}},"./node_modules/react-hot-toast/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{l$:()=>Oe,Ay:()=>Vt});var react=__webpack_require__("./node_modules/react/index.js");let e={data:""},t=t=>"object"==typeof window?((t?t.querySelector("#_goober"):window._goober)||Object.assign((t||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:t||e,l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,a=/\/\*[^]*?\*\/|  +/g,n=/\n+/g,o=(e,t)=>{let r="",l="",a="";for(let n in e){let c=e[n];"@"==n[0]?"i"==n[1]?r=n+" "+c+";":l+="f"==n[1]?o(c,n):n+"{"+o(c,"k"==n[1]?"":t)+"}":"object"==typeof c?l+=o(c,t?t.replace(/([^,])+/g,e=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):n):null!=c&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=o.p?o.p(n,c):n+":"+c+";")}return r+(t&&a?t+"{"+a+"}":a)+l},c={},s=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+s(e[r]);return t}return e},i=(e,t,r,i,p)=>{let u=s(e),d=c[u]||(c[u]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(u));if(!c[d]){let t=u!==e?e:(e=>{let t,r,o=[{}];for(;t=l.exec(e.replace(a,""));)t[4]?o.shift():t[3]?(r=t[3].replace(n," ").trim(),o.unshift(o[0][r]=o[0][r]||{})):o[0][t[1]]=t[2].replace(n," ").trim();return o[0]})(e);c[d]=o(p?{["@keyframes "+d]:t}:t,r?"":"."+d)}let f=r&&c.g?c.g:null;return r&&(c.g=c[d]),((e,t,r,l)=>{l?t.data=t.data.replace(l,e):-1===t.data.indexOf(e)&&(t.data=r?e+t.data:t.data+e)})(c[d],t,i,f),d};function u(e){let r=this||{},l=e.call?e(r.p):e;return i(l.unshift?l.raw?((e,t,r)=>e.reduce((e,l,a)=>{let n=t[a];if(n&&n.call){let e=n(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;n=t?"."+t:e&&"object"==typeof e?e.props?"":o(e,""):!1===e?"":e}return e+l+(null==n?"":n)},""))(l,[].slice.call(arguments,1),r.p):l.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):l,t(r.target),r.g,r.o,r.k)}u.bind({g:1});let d,f,g,h=u.bind({k:1});function j(e,t){let r=this||{};return function(){let l=arguments;function a(n,o){let c=Object.assign({},n),s=c.className||a.className;r.p=Object.assign({theme:f&&f()},c),r.o=/ *go\d+/.test(s),c.className=u.apply(r,l)+(s?" "+s:""),t&&(c.ref=o);let i=e;return e[0]&&(i=c.as||e,delete c.as),g&&i[0]&&g(c),d(i,c)}return t?t(a):a}}var dist_f=(e,t)=>(e=>"function"==typeof e)(e)?e(t):e,F=(()=>{let e=0;return()=>(++e).toString()})(),A=(()=>{let e;return()=>{if(void 0===e&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),U=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(o=>o.id===t.toast.id?{...o,...t.toast}:o)};case 2:let{toast:r}=t;return U(e,{type:e.toasts.find(o=>o.id===r.id)?1:0,toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(o=>o.id===s||void 0===s?{...o,dismissed:!0,visible:!1}:o)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(o=>o.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(o=>({...o,pauseDuration:o.pauseDuration+a}))}}},P=[],y={toasts:[],pausedAt:void 0},dist_u=e=>{y=U(y,e),P.forEach(t=>{t(y)})},q={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},x=e=>(t,r)=>{let s=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||F()}))(t,e,r);return dist_u({type:2,toast:s}),s.id},dist_c=(e,t)=>x("blank")(e,t);dist_c.error=x("error"),dist_c.success=x("success"),dist_c.loading=x("loading"),dist_c.custom=x("custom"),dist_c.dismiss=e=>{dist_u({type:3,toastId:e})},dist_c.remove=e=>dist_u({type:4,toastId:e}),dist_c.promise=(e,t,r)=>{let s=dist_c.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(a=>{let o=t.success?dist_f(t.success,a):void 0;return o?dist_c.success(o,{id:s,...r,...null==r?void 0:r.success}):dist_c.dismiss(s),a}).catch(a=>{let o=t.error?dist_f(t.error,a):void 0;o?dist_c.error(o,{id:s,...r,...null==r?void 0:r.error}):dist_c.dismiss(s)}),e};var K=(e,t)=>{dist_u({type:1,toast:{id:e,height:t}})},X=()=>{dist_u({type:5,time:Date.now()})},dist_b=new Map,O=e=>{let{toasts:t,pausedAt:r}=((e={})=>{let[t,r]=(0,react.useState)(y),s=(0,react.useRef)(y);(0,react.useEffect)(()=>(s.current!==y&&r(y),P.push(r),()=>{let o=P.indexOf(r);o>-1&&P.splice(o,1)}),[]);let a=t.toasts.map(o=>{var n,i,p;return{...e,...e[o.type],...o,removeDelay:o.removeDelay||(null==(n=e[o.type])?void 0:n.removeDelay)||(null==e?void 0:e.removeDelay),duration:o.duration||(null==(i=e[o.type])?void 0:i.duration)||(null==e?void 0:e.duration)||q[o.type],style:{...e.style,...null==(p=e[o.type])?void 0:p.style,...o.style}}});return{...t,toasts:a}})(e);(0,react.useEffect)(()=>{if(r)return;let o=Date.now(),n=t.map(i=>{if(i.duration===1/0)return;let p=(i.duration||0)+i.pauseDuration-(o-i.createdAt);if(!(p<0))return setTimeout(()=>dist_c.dismiss(i.id),p);i.visible&&dist_c.dismiss(i.id)});return()=>{n.forEach(i=>i&&clearTimeout(i))}},[t,r]);let s=(0,react.useCallback)(()=>{r&&dist_u({type:6,time:Date.now()})},[r]),a=(0,react.useCallback)((o,n)=>{let{reverseOrder:i=!1,gutter:p=8,defaultPosition:d}=n||{},h=t.filter(m=>(m.position||d)===(o.position||d)&&m.height),v=h.findIndex(m=>m.id===o.id),S=h.filter((m,E)=>E<v&&m.visible).length;return h.filter(m=>m.visible).slice(...i?[S+1]:[0,S]).reduce((m,E)=>m+(E.height||0)+p,0)},[t]);return(0,react.useEffect)(()=>{t.forEach(o=>{if(o.dismissed)((e,t=1e3)=>{if(dist_b.has(e))return;let r=setTimeout(()=>{dist_b.delete(e),dist_u({type:4,toastId:e})},t);dist_b.set(e,r)})(o.id,o.removeDelay);else{let n=dist_b.get(o.id);n&&(clearTimeout(n),dist_b.delete(o.id))}})},[t]),{toasts:t,handlers:{updateHeight:K,startPause:X,endPause:s,calculateOffset:a}}},oe=h`
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
//# sourceMappingURL=6716.262faf67.iframe.bundle.js.map