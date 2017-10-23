!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.textMarker=t():e.textMarker=t()}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=2)}([function(e,t,n){"use strict";function r(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function o(e){return e.length?1===e.length?e[0]:e.reduce(function(e,t){return e+"|"+r(t)}):""}function i(e,t,n){var r=""+e;return n[r]instanceof Array==!1&&(n[r]=[]),n[r].push(t)}function a(e,t){return t[""+e]?t[""+e].reverse():[]}function u(e,t){switch(t.type){case"BLOCK_END":case"RANGE_END":e.pop();break;case"BLOCK_START":case"RANGE_START":e.push(t)}}function s(e,t,n){e.length>0&&e.forEach(function(e){n.push(e),u(t,e)})}function c(e){return"BLOCK_START"===e.type||"BLOCK_END"===e.type}function f(e){return"RANGE_START"===e.type||"RANGE_END"===e.type}function l(e){return"RANGE_END"===e.type||"BLOCK_END"===e.type}function d(e){return"RANGE_START"===e.type||"BLOCK_START"===e.type}function p(e,t){return e.name===t.name&&!!(d(e)&&l(t)||d(t)&&l(e))}function h(e){return Object.assign({},e,{_virtual:!0})}function y(e){var t=void 0;return c(e)&&d(e)&&(t="BLOCK_END"),c(e)&&l(e)&&(t="BLOCK_START"),f(e)&&d(e)&&(t="RANGE_END"),f(e)&&l(e)&&(t="RANGE_START"),Object.assign({},h(e),{type:t})}function v(e,t){var n=t.at(t.length-1);return!(n.name!==e.name||!d(n)||!l(e))}function g(e,t){for(var n=t.length-1;t.length>0;){var r=y(t.at(n));e.push(r),u(t,r),n-=1}}function b(e){return!!e.chars&&!!_.exec(e.chars)}function m(e){var t={},n=new x.default,r=void 0,o=[],c=void 0;return e.forEach(function(e,f){if(s(a(f,t),n,o),!l(e))return o.push(e),void u(n,e);if(v(e,n))return o.push(e),void u(n,e);if(n.contains(e.name)){if("TABLE_CELL"===e.name){for(c=n.length-1;!p(e,n.at(c));)r=y(n.at(c)),o.push(r),u(n,r),c-=1;return o.push(e),void u(n,e)}for(c=n.length-1;!p(e,n.at(c));){if("TABLE_CELL"===n.at(c).name&&d(n.at(c)))return;r=y(n.at(c)),i(f+1,h(n.at(c)),t),o.push(r),u(n,r),c-=1}o.push(e),u(n,e)}}),g(o,n),o}Object.defineProperty(t,"__esModule",{value:!0}),t.escapeStringForRegex=r,t.makeRegexOrPattern=o,t.setTokensForIndex=i,t.getTokensForIndex=a,t.updateStack=u,t.handleBufferedTokens=s,t.isBlock=c,t.isRange=f,t.isEndToken=l,t.isStartToken=d,t.isMatching=p,t.createVirtualToken=h,t.createMatch=y,t.closesPreviousToken=v,t.closeOpenTokens=g,t.isVisibleToken=b,t.normalize=m;var k=n(4),x=function(e){return e&&e.__esModule?e:{default:e}}(k),_=/\S/},function(e,t,n){"use strict";function r(e,t){for(var n=[],r=new RegExp(""+e,"gi"),o=r.exec(t);o;)n.push(o.index),o=r.exec(t);return n}Object.defineProperty(t,"__esModule",{value:!0}),t.default=r},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(3),i=r(o),a=n(11),u=r(a),s=n(12),c=r(s),f=n(13),l=r(f),d=n(14).version;t.default={parse:i.default,range:u.default,keyword:c.default,block:l.default,version:d}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n){var r=n.pattern,o=n.onMatch;if(e&&r&&o&&t)for(var i=void 0,a=r.exec(e);a;)i=o(a),t.push(i),a=r.exec(e)}function i(e){var t="",n=void 0;return e.forEach(function(e){n="LITERAL"===e.type?", "+e.chars:"",n=n.replace("\n","\\n").replace("\t","\\t"),t+=e.index+", "+e.type+", "+e.name+n+"\n"}),t}function a(e){console.log(i(e))}function u(e,t){try{var n=e;return t.forEach(function(e){n=e.apply(null,[n])}),n}catch(e){console.error("[Middleware] "+e.message)}return e}function s(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],r=u(e,n);if(!r&&e)return e;for(var i=t.length,a=new l.default;i--;)o(r,a,t[i]);var s=new p.default(r,a).scan(),f=(0,c.normalize)(s);return(0,y.default)(f)}Object.defineProperty(t,"__esModule",{value:!0}),t.findPatterns=o,t.tokensToString=i,t.printTokens=a,t.applyMiddleware=u,t.default=s;var c=n(0),f=n(5),l=r(f),d=n(6),p=r(d),h=n(9),y=r(h)},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e){return e.contains("TABLE")}function i(e){return e.contains("TABLE_CELL")}function a(e){return e.contains("TABLE_ROW")}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();t.isInTable=o,t.isInTableCell=i,t.isInTableRow=a;var s=function(){function e(){r(this,e),this.stack={all:[]}}return u(e,[{key:"at",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"all";return this.stack[t]&&this.stack[t][e]}},{key:"push",value:function(e){this.stack.all.push(e),this.stack[e.name]instanceof Array==!1&&(this.stack[e.name]=[]),this.stack[e.name].push(e)}},{key:"pop",value:function(){var e=this.stack.all.pop();return e&&this.stack[e.name].pop(),e}},{key:"contains",value:function(e){return!!(this.stack[e]&&this.stack[e].length>0)}},{key:"length",get:function(){return this.stack.all.length}},{key:"last",get:function(){var e=this.stack.all.length-1;return this.stack.all[e]}}]),e}();t.default=s},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){var n=e.priority||0,r=t.priority||0;return n<r?-1:n>r?1:0}function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return e<t?-1:e>t?1:0}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();t.sortByPriority=o,t.offsetSort=i;var u=function(){function e(){r(this,e),this.atOffset={},this.offsets=[]}return a(e,[{key:"on",value:function(e,t){var n=""+t;return this.atOffset[n]?this.atOffset[n][e].sort(o):[]}},{key:"getOffsets",value:function(){return[].concat(this.offsets.sort(i))}},{key:"push",value:function(e){var t=void 0,n=void 0;if(e instanceof Array==!1)this.hasIndexAtOffset(e.index)||this.offsets.push(e.index),n=this.getTokenIndex(e.index),n[e.handle].push(e);else for(t=e.length;t--;)this.hasIndexAtOffset(e[t].index)||this.offsets.push(e[t].index),n=this.getTokenIndex(e[t].index),n[e[t].handle].push(e[t])}},{key:"hasIndexAtOffset",value:function(e){var t="string"!=typeof e?""+e:e;return!!this.atOffset[t]}},{key:"getTokenIndex",value:function(e){var t=this.atOffset,n="string"!=typeof e?""+e:e;return t[n]||(this.atOffset[n]={before:[],at:[],after:[]}),this.atOffset[n]}}]),e}();t.default=u},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e){var t=0;switch(e.type){case"BLOCK_START":t=e.delimiters.open.length;break;case"BLOCK_END":t=e.delimiters.close.length;break;default:t=e.chars?e.chars.length:0}return t}function u(e,t,n){return e[0]?e[0].index:!!t[0]&&t[0].index}function s(e,t){return e.map(function(e){return Object.assign({},e,{line:t})})}Object.defineProperty(t,"__esModule",{value:!0});var c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();t.getTokenLength=a,t.getCharIndexFromTokens=u,t.appendLineData=s;var f=n(7),l=r(f),d=n(1),p=(r(d),n(8)),h=r(p),y=function(){function e(t,n){i(this,e),this.text=t,this.patternMatches=n}return c(e,[{key:"scan",value:function(){var e=[],t=void 0,n=this.patternMatches.getOffsets(),r=void 0,i=void 0,c=void 0,f=void 0,d=void 0,p=void 0,y=void 0,v=(0,h.default)(this.text);for(0!==n[0]&&n.unshift(0),n[n.length-1]!==this.text.length&&n.push(this.text.length),r=n.length+1;r--;){t=null,i=i||n.shift();var g=i,b=void 0;c=n.shift(),d=this.patternMatches.on("before",i),p=this.patternMatches.on("after",i),y=this.patternMatches.on("at",i),b=v(u(d,y,p)),y&&y.length&&(t=y[y.length-1],g+=a(t)),d&&d.length&&e.push.apply(e,o(s(d,b))),t&&e.push.apply(e,o(s([t],b))),g<this.text.length&&g<c&&(f=(0,l.default)(this.text.substring(g,c),g),e.push.apply(e,o(s([f],v(f.index))))),i=c}return e}}]),e}();t.default=y},function(e,t,n){"use strict";function r(e,t){return"string"!=typeof e?(console.error("LITERAL requires text index to be a string. Got",void 0===e?"undefined":o(e)),!1):"number"!=typeof t?(console.error("LITERAL requires start index to be a number. Got",void 0===t?"undefined":o(t)),!1):{type:"LITERAL",name:"TEXT",chars:e,index:t}}Object.defineProperty(t,"__esModule",{value:!0});var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.default=r},function(e,t,n){"use strict";function r(e){var t=(0,i.default)("\n",e),n=(t.length,0);return function(e){if(0===t.length)return 1;if(e<=t[n])return n+1;for(;e>t[n];)n+=1;return n+1}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=r;var o=n(1),i=function(e){return e&&e.__esModule?e:{default:e}}(o)},function(e,t,n){"use strict";function r(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i.default,n=new t;return e.forEach(function(e){switch(e.type){case"LITERAL":case"KEYWORD":n.addLeaf(e);break;case"RANGE_START":case"BLOCK_START":n.startBranch(e);break;case"RANGE_END":case"BLOCK_END":n.endBranch()}}),n.tree}Object.defineProperty(t,"__esModule",{value:!0}),t.default=r;var o=n(10),i=function(e){return e&&e.__esModule?e:{default:e}}(o)},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=function(){function e(){r(this,e),this.tree=this.currentNode={name:"root",children:[]},this.nodeStack=[]}return o(e,[{key:"tokenToLeaf",value:function(e){return!!e&&{name:e.name,text:e.chars}}},{key:"addLeaf",value:function(e){var t=this.tokenToLeaf(e);t&&this.currentNode.children.push(t)}},{key:"tokenToBranch",value:function(e){return!!e&&{name:e.name,children:[]}}},{key:"startBranch",value:function(e){var t=this.tokenToBranch(e);t&&(this.currentNode.children.push(t),this.currentNode=t,this.nodeStack.push(t))}},{key:"endBranch",value:function(){this.nodeStack.pop(),this.currentNode=this.nodeStack[this.nodeStack.length-1],this.currentNode||(this.currentNode=this.tree)}}]),e}();t.default=i},function(e,t,n){"use strict";function r(e,t){var n=void 0;return e instanceof RegExp&&(n=e),"string"==typeof e&&(n=new RegExp(""+e,"gi")),n?{pattern:n,onMatch:function(e){var n=e.index,r=e.index+e[0].length;return[{name:t,type:"RANGE_START",chars:null,index:n,pairedWith:r,delimiters:{open:null,close:null},priority:n+r,handle:"before"},{name:t,type:"RANGE_END",chars:null,index:r,pairedWith:n,delimiters:{open:null,close:null},priority:-1*(n+r),handle:"before"}]}}:(console.error("Cannot create a text range token without a string or regex. Cannot use:",void 0===e?"undefined":o(e)),!1)}Object.defineProperty(t,"__esModule",{value:!0});var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.default=r},function(e,t,n){"use strict";function r(e,t){var n=void 0;return e instanceof RegExp&&(n=e),"string"==typeof e&&(n=new RegExp("(^|\\s)("+(0,i.escapeStringForRegex)(e)+")(\\s|$)","gi")),e instanceof Array&&(n=new RegExp("(^|\\s)("+(0,i.makeRegexOrPattern)(e)+")(\\s|$)","gi")),n?{pattern:n,onMatch:function(e){var n=e.index;return{name:t,type:"KEYWORD",chars:e[2],index:n,handle:"at"}}}:(console.error("Cannot create a keyword token without a string or regex. Cannot use:",void 0===e?"undefined":o(e)),!1)}Object.defineProperty(t,"__esModule",{value:!0});var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.default=r;var i=n(0)},function(e,t,n){"use strict";function r(e){var t=e.open,n=e.close,r=void 0===n?t:n,o=(0,i.escapeStringForRegex)(t),a=(0,i.escapeStringForRegex)(r);return new RegExp("("+o+")+[\\s\\S]+?("+a+")+","gi")}function o(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"DEFAULT",n=void 0,o=void 0;return{pattern:e instanceof RegExp?e:r(e),onMatch:function(r){return n=r.index,o=r.index+r[0].length-r[2].length,[{name:t,type:"BLOCK_START",index:n,pairedWith:o,chars:r[1],handle:"at",delimiters:e},{name:t,index:o,pairedWith:n,type:"BLOCK_END",chars:r[2],handle:"at",delimiters:e}]}}}Object.defineProperty(t,"__esModule",{value:!0}),t.makeBlockRegex=r,t.default=o;var i=n(0)},function(e,t){e.exports={name:"text-marker",version:"0.9.0",description:"A lexical analyzer for parsing text",main:"dist/text_marker.js",repository:{type:"git",url:"https://github.com/Paul-Guerra/text-marker.git"},scripts:{postinstall:"npm run mkdirs",mkdirs:"mkdir -p tmp/",rmdirs:"rm -rf tmp/",start:"npm run build && npm run webpack:watch & babel src/ --out-dir tmp/ --watch",compile:"rm -rf tmp/* && babel src/ --out-dir tmp/",build:"npm run compile && webpack","webpack:watch":"webpack --watch","build:prod":"npm run compile && webpack --config ./webpack.prod.config.js",test:"jest","test:config":"jest --showConfig",lint:"eslint src/**/*.js"},author:"",license:"MIT",devDependencies:{"babel-cli":"^6.24.1","babel-preset-es2015":"^6.24.1",eslint:"^4.3.0","eslint-config-airbnb":"^15.1.0","eslint-loader":"^1.9.0","eslint-plugin-babel":"^4.1.2","eslint-plugin-import":"^2.7.0","eslint-plugin-react":"^7.1.0",jest:"^20.0.4","uglifyjs-webpack-plugin":"^0.4.6",webpack:"^3.4.1","webpack-merge":"^4.1.0"},dependencies:{}}}]).default});