(window.webpackJsonp=window.webpackJsonp||[]).push([[79],{"./node_modules/refractor/lang/flow.js":function(module,exports,__webpack_require__){"use strict";function flow(Prism){!function(Prism){Prism.languages.flow=Prism.languages.extend("javascript",{}),Prism.languages.insertBefore("flow","keyword",{type:[{pattern:/\b(?:[Bb]oolean|Function|[Nn]umber|[Ss]tring|any|mixed|null|void)\b/,alias:"tag"}]}),Prism.languages.flow["function-variable"].pattern=/(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=\s*(?:function\b|(?:\([^()]*\)(?:\s*:\s*\w+)?|(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/i,delete Prism.languages.flow.parameter,Prism.languages.insertBefore("flow","operator",{"flow-punctuation":{pattern:/\{\||\|\}/,alias:"punctuation"}}),Array.isArray(Prism.languages.flow.keyword)||(Prism.languages.flow.keyword=[Prism.languages.flow.keyword]),Prism.languages.flow.keyword.unshift({pattern:/(^|[^$]\b)(?:Class|declare|opaque|type)\b(?!\$)/,lookbehind:!0},{pattern:/(^|[^$]\B)\$(?:Diff|Enum|Exact|Keys|ObjMap|PropertyType|Record|Shape|Subtype|Supertype|await)\b(?!\$)/,lookbehind:!0})}(Prism)}module.exports=flow,flow.displayName="flow",flow.aliases=[]}}]);