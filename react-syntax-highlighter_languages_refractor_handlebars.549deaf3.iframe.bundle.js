(window.webpackJsonp=window.webpackJsonp||[]).push([[97],{"./node_modules/refractor/lang/handlebars.js":function(module,exports,__webpack_require__){"use strict";var refractorMarkupTemplating=__webpack_require__("./node_modules/refractor/lang/markup-templating.js");function handlebars(Prism){Prism.register(refractorMarkupTemplating),function(Prism){Prism.languages.handlebars={comment:/\{\{![\s\S]*?\}\}/,delimiter:{pattern:/^\{\{\{?|\}\}\}?$/,alias:"punctuation"},string:/(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,number:/\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee][+-]?\d+)?/,boolean:/\b(?:false|true)\b/,block:{pattern:/^(\s*(?:~\s*)?)[#\/]\S+?(?=\s*(?:~\s*)?$|\s)/,lookbehind:!0,alias:"keyword"},brackets:{pattern:/\[[^\]]+\]/,inside:{punctuation:/\[|\]/,variable:/[\s\S]+/}},punctuation:/[!"#%&':()*+,.\/;<=>@\[\\\]^`{|}~]/,variable:/[^!"#%&'()*+,\/;<=>@\[\\\]^`{|}~\s]+/},Prism.hooks.add("before-tokenize",(function(env){Prism.languages["markup-templating"].buildPlaceholders(env,"handlebars",/\{\{\{[\s\S]+?\}\}\}|\{\{[\s\S]+?\}\}/g)})),Prism.hooks.add("after-tokenize",(function(env){Prism.languages["markup-templating"].tokenizePlaceholders(env,"handlebars")})),Prism.languages.hbs=Prism.languages.handlebars}(Prism)}module.exports=handlebars,handlebars.displayName="handlebars",handlebars.aliases=["hbs"]}}]);