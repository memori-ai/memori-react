(window.webpackJsonp=window.webpackJsonp||[]).push([[72],{"./node_modules/react-syntax-highlighter/node_modules/refractor/lang/erb.js":function(module,exports,__webpack_require__){"use strict";var refractorRuby=__webpack_require__("./node_modules/react-syntax-highlighter/node_modules/refractor/lang/ruby.js"),refractorMarkupTemplating=__webpack_require__("./node_modules/react-syntax-highlighter/node_modules/refractor/lang/markup-templating.js");function erb(Prism){Prism.register(refractorRuby),Prism.register(refractorMarkupTemplating),function(Prism){Prism.languages.erb={delimiter:{pattern:/^(\s*)<%=?|%>(?=\s*$)/,lookbehind:!0,alias:"punctuation"},ruby:{pattern:/\s*\S[\s\S]*/,alias:"language-ruby",inside:Prism.languages.ruby}},Prism.hooks.add("before-tokenize",(function(env){Prism.languages["markup-templating"].buildPlaceholders(env,"erb",/<%=?(?:[^\r\n]|[\r\n](?!=begin)|[\r\n]=begin\s(?:[^\r\n]|[\r\n](?!=end))*[\r\n]=end)+?%>/g)})),Prism.hooks.add("after-tokenize",(function(env){Prism.languages["markup-templating"].tokenizePlaceholders(env,"erb")}))}(Prism)}module.exports=erb,erb.displayName="erb",erb.aliases=[]}}]);