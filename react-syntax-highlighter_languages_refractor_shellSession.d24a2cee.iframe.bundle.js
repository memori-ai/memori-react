"use strict";(self.webpackChunk_memori_ai_memori_react=self.webpackChunk_memori_ai_memori_react||[]).push([[7976],{"./node_modules/react-syntax-highlighter/node_modules/refractor/lang/shell-session.js":(module,__unused_webpack_exports,__webpack_require__)=>{var refractorBash=__webpack_require__("./node_modules/react-syntax-highlighter/node_modules/refractor/lang/bash.js");function shellSession(Prism){Prism.register(refractorBash),function(Prism){var strings=[/"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/.source,/'[^']*'/.source,/\$'(?:[^'\\]|\\[\s\S])*'/.source,/<<-?\s*(["']?)(\w+)\1\s[\s\S]*?[\r\n]\2/.source].join("|");Prism.languages["shell-session"]={command:{pattern:RegExp(/^/.source+"(?:"+/[^\s@:$#%*!/\\]+@[^\r\n@:$#%*!/\\]+(?::[^\0-\x1F$#%*?"<>:;|]+)?/.source+"|"+/[/~.][^\0-\x1F$#%*?"<>@:;|]*/.source+")?"+/[$#%](?=\s)/.source+/(?:[^\\\r\n \t'"<$]|[ \t](?:(?!#)|#.*$)|\\(?:[^\r]|\r\n?)|\$(?!')|<(?!<)|<<str>>)+/.source.replace(/<<str>>/g,(function(){return strings})),"m"),greedy:!0,inside:{info:{pattern:/^[^#$%]+/,alias:"punctuation",inside:{user:/^[^\s@:$#%*!/\\]+@[^\r\n@:$#%*!/\\]+/,punctuation:/:/,path:/[\s\S]+/}},bash:{pattern:/(^[$#%]\s*)\S[\s\S]*/,lookbehind:!0,alias:"language-bash",inside:Prism.languages.bash},"shell-symbol":{pattern:/^[$#%]/,alias:"important"}}},output:/.(?:.*(?:[\r\n]|.$))*/},Prism.languages["sh-session"]=Prism.languages.shellsession=Prism.languages["shell-session"]}(Prism)}module.exports=shellSession,shellSession.displayName="shellSession",shellSession.aliases=[]}}]);