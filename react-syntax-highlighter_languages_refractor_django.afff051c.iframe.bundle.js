(window.webpackJsonp=window.webpackJsonp||[]).push([[62],{"./node_modules/react-syntax-highlighter/node_modules/refractor/lang/django.js":function(module,exports,__webpack_require__){"use strict";var refractorMarkupTemplating=__webpack_require__("./node_modules/react-syntax-highlighter/node_modules/refractor/lang/markup-templating.js");function django(Prism){Prism.register(refractorMarkupTemplating),function(Prism){Prism.languages.django={comment:/^\{#[\s\S]*?#\}$/,tag:{pattern:/(^\{%[+-]?\s*)\w+/,lookbehind:!0,alias:"keyword"},delimiter:{pattern:/^\{[{%][+-]?|[+-]?[}%]\}$/,alias:"punctuation"},string:{pattern:/("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,greedy:!0},filter:{pattern:/(\|)\w+/,lookbehind:!0,alias:"function"},test:{pattern:/(\bis\s+(?:not\s+)?)(?!not\b)\w+/,lookbehind:!0,alias:"function"},function:/\b[a-z_]\w+(?=\s*\()/i,keyword:/\b(?:and|as|by|else|for|if|import|in|is|loop|not|or|recursive|with|without)\b/,operator:/[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,number:/\b\d+(?:\.\d+)?\b/,boolean:/[Ff]alse|[Nn]one|[Tt]rue/,variable:/\b\w+\b/,punctuation:/[{}[\](),.:;]/};var pattern=/\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}|\{#[\s\S]*?#\}/g,markupTemplating=Prism.languages["markup-templating"];Prism.hooks.add("before-tokenize",(function(env){markupTemplating.buildPlaceholders(env,"django",pattern)})),Prism.hooks.add("after-tokenize",(function(env){markupTemplating.tokenizePlaceholders(env,"django")})),Prism.languages.jinja2=Prism.languages.django,Prism.hooks.add("before-tokenize",(function(env){markupTemplating.buildPlaceholders(env,"jinja2",pattern)})),Prism.hooks.add("after-tokenize",(function(env){markupTemplating.tokenizePlaceholders(env,"jinja2")}))}(Prism)}module.exports=django,django.displayName="django",django.aliases=["jinja2"]}}]);