(window.webpackJsonp=window.webpackJsonp||[]).push([[132],{"./node_modules/react-syntax-highlighter/node_modules/refractor/lang/keyman.js":function(module,exports,__webpack_require__){"use strict";function keyman(Prism){Prism.languages.keyman={comment:{pattern:/\bc .*/i,greedy:!0},string:{pattern:/"[^"\r\n]*"|'[^'\r\n]*'/,greedy:!0},"virtual-key":{pattern:/\[\s*(?:(?:ALT|CAPS|CTRL|LALT|LCTRL|NCAPS|RALT|RCTRL|SHIFT)\s+)*(?:[TKU]_[\w?]+|[A-E]\d\d?|"[^"\r\n]*"|'[^'\r\n]*')\s*\]/i,greedy:!0,alias:"function"},"header-keyword":{pattern:/&\w+/,alias:"bold"},"header-statement":{pattern:/\b(?:bitmap|bitmaps|caps always off|caps on only|copyright|hotkey|language|layout|message|name|shift frees caps|version)\b/i,alias:"bold"},"rule-keyword":{pattern:/\b(?:any|baselayout|beep|call|context|deadkey|dk|if|index|layer|notany|nul|outs|platform|reset|return|save|set|store|use)\b/i,alias:"keyword"},"structural-keyword":{pattern:/\b(?:ansi|begin|group|match|nomatch|unicode|using keys)\b/i,alias:"keyword"},"compile-target":{pattern:/\$(?:keyman|keymanonly|keymanweb|kmfl|weaver):/i,alias:"property"},number:/\b(?:U\+[\dA-F]+|d\d+|x[\da-f]+|\d+)\b/i,operator:/[+>\\$]|\.\./,punctuation:/[()=,]/}}module.exports=keyman,keyman.displayName="keyman",keyman.aliases=[]}}]);