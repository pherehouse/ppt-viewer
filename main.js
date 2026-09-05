var Rt=Object.create;var wt=Object.defineProperty;var Lt=Object.getOwnPropertyDescriptor;var Nt=Object.getOwnPropertyNames;var Ut=Object.getPrototypeOf,jt=Object.prototype.hasOwnProperty;var Mt=(y,D)=>()=>(D||y((D={exports:{}}).exports,D),D.exports),$t=(y,D)=>{for(var l in D)wt(y,l,{get:D[l],enumerable:!0})},Pt=(y,D,l,i)=>{if(D&&typeof D=="object"||typeof D=="function")for(let r of Nt(D))!jt.call(y,r)&&r!==l&&wt(y,r,{get:()=>D[r],enumerable:!(i=Lt(D,r))||i.enumerable});return y};var Wt=(y,D,l)=>(l=y!=null?Rt(Ut(y)):{},Pt(D||!y||!y.__esModule?wt(l,"default",{value:y,enumerable:!0}):l,y)),Zt=y=>Pt(wt({},"__esModule",{value:!0}),y);var Tt=Mt((It,xt)=>{(function(y){typeof It=="object"&&typeof xt!="undefined"?xt.exports=y():typeof define=="function"&&define.amd?define([],y):(typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:this).JSZip=y()})(function(){return function y(D,l,i){function r(f,p){if(!l[f]){if(!D[f]){var d=typeof require=="function"&&require;if(!p&&d)return d(f,!0);if(e)return e(f,!0);var g=new Error("Cannot find module '"+f+"'");throw g.code="MODULE_NOT_FOUND",g}var n=l[f]={exports:{}};D[f][0].call(n.exports,function(h){var a=D[f][1][h];return r(a||h)},n,n.exports,y,D,l,i)}return l[f].exports}for(var e=typeof require=="function"&&require,o=0;o<i.length;o++)r(i[o]);return r}({1:[function(y,D,l){"use strict";var i=y("./utils"),r=y("./support"),e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";l.encode=function(o){for(var f,p,d,g,n,h,a,u=[],c=0,_=o.length,w=_,E=i.getTypeOf(o)!=="string";c<o.length;)w=_-c,d=E?(f=o[c++],p=c<_?o[c++]:0,c<_?o[c++]:0):(f=o.charCodeAt(c++),p=c<_?o.charCodeAt(c++):0,c<_?o.charCodeAt(c++):0),g=f>>2,n=(3&f)<<4|p>>4,h=1<w?(15&p)<<2|d>>6:64,a=2<w?63&d:64,u.push(e.charAt(g)+e.charAt(n)+e.charAt(h)+e.charAt(a));return u.join("")},l.decode=function(o){var f,p,d,g,n,h,a=0,u=0,c="data:";if(o.substr(0,c.length)===c)throw new Error("Invalid base64 input, it looks like a data url.");var _,w=3*(o=o.replace(/[^A-Za-z0-9+/=]/g,"")).length/4;if(o.charAt(o.length-1)===e.charAt(64)&&w--,o.charAt(o.length-2)===e.charAt(64)&&w--,w%1!=0)throw new Error("Invalid base64 input, bad content length.");for(_=r.uint8array?new Uint8Array(0|w):new Array(0|w);a<o.length;)f=e.indexOf(o.charAt(a++))<<2|(g=e.indexOf(o.charAt(a++)))>>4,p=(15&g)<<4|(n=e.indexOf(o.charAt(a++)))>>2,d=(3&n)<<6|(h=e.indexOf(o.charAt(a++))),_[u++]=f,n!==64&&(_[u++]=p),h!==64&&(_[u++]=d);return _}},{"./support":30,"./utils":32}],2:[function(y,D,l){"use strict";var i=y("./external"),r=y("./stream/DataWorker"),e=y("./stream/Crc32Probe"),o=y("./stream/DataLengthProbe");function f(p,d,g,n,h){this.compressedSize=p,this.uncompressedSize=d,this.crc32=g,this.compression=n,this.compressedContent=h}f.prototype={getContentWorker:function(){var p=new r(i.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new o("data_length")),d=this;return p.on("end",function(){if(this.streamInfo.data_length!==d.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),p},getCompressedWorker:function(){return new r(i.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},f.createWorkerFrom=function(p,d,g){return p.pipe(new e).pipe(new o("uncompressedSize")).pipe(d.compressWorker(g)).pipe(new o("compressedSize")).withStreamInfo("compression",d)},D.exports=f},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(y,D,l){"use strict";var i=y("./stream/GenericWorker");l.STORE={magic:"\0\0",compressWorker:function(){return new i("STORE compression")},uncompressWorker:function(){return new i("STORE decompression")}},l.DEFLATE=y("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(y,D,l){"use strict";var i=y("./utils"),r=function(){for(var e,o=[],f=0;f<256;f++){e=f;for(var p=0;p<8;p++)e=1&e?3988292384^e>>>1:e>>>1;o[f]=e}return o}();D.exports=function(e,o){return e!==void 0&&e.length?i.getTypeOf(e)!=="string"?function(f,p,d,g){var n=r,h=g+d;f^=-1;for(var a=g;a<h;a++)f=f>>>8^n[255&(f^p[a])];return-1^f}(0|o,e,e.length,0):function(f,p,d,g){var n=r,h=g+d;f^=-1;for(var a=g;a<h;a++)f=f>>>8^n[255&(f^p.charCodeAt(a))];return-1^f}(0|o,e,e.length,0):0}},{"./utils":32}],5:[function(y,D,l){"use strict";l.base64=!1,l.binary=!1,l.dir=!1,l.createFolders=!0,l.date=null,l.compression=null,l.compressionOptions=null,l.comment=null,l.unixPermissions=null,l.dosPermissions=null},{}],6:[function(y,D,l){"use strict";var i=null;i=typeof Promise!="undefined"?Promise:y("lie"),D.exports={Promise:i}},{lie:37}],7:[function(y,D,l){"use strict";var i=typeof Uint8Array!="undefined"&&typeof Uint16Array!="undefined"&&typeof Uint32Array!="undefined",r=y("pako"),e=y("./utils"),o=y("./stream/GenericWorker"),f=i?"uint8array":"array";function p(d,g){o.call(this,"FlateWorker/"+d),this._pako=null,this._pakoAction=d,this._pakoOptions=g,this.meta={}}l.magic="\b\0",e.inherits(p,o),p.prototype.processChunk=function(d){this.meta=d.meta,this._pako===null&&this._createPako(),this._pako.push(e.transformTo(f,d.data),!1)},p.prototype.flush=function(){o.prototype.flush.call(this),this._pako===null&&this._createPako(),this._pako.push([],!0)},p.prototype.cleanUp=function(){o.prototype.cleanUp.call(this),this._pako=null},p.prototype._createPako=function(){this._pako=new r[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var d=this;this._pako.onData=function(g){d.push({data:g,meta:d.meta})}},l.compressWorker=function(d){return new p("Deflate",d)},l.uncompressWorker=function(){return new p("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(y,D,l){"use strict";function i(n,h){var a,u="";for(a=0;a<h;a++)u+=String.fromCharCode(255&n),n>>>=8;return u}function r(n,h,a,u,c,_){var w,E,k=n.file,T=n.compression,A=_!==f.utf8encode,B=e.transformTo("string",_(k.name)),S=e.transformTo("string",f.utf8encode(k.name)),L=k.comment,X=e.transformTo("string",_(L)),v=e.transformTo("string",f.utf8encode(L)),F=S.length!==k.name.length,s=v.length!==L.length,O="",Y="",j="",J=k.dir,M=k.date,K={crc32:0,compressedSize:0,uncompressedSize:0};h&&!a||(K.crc32=n.crc32,K.compressedSize=n.compressedSize,K.uncompressedSize=n.uncompressedSize);var P=0;h&&(P|=8),A||!F&&!s||(P|=2048);var z=0,q=0;J&&(z|=16),c==="UNIX"?(q=798,z|=function(Z,it){var ot=Z;return Z||(ot=it?16893:33204),(65535&ot)<<16}(k.unixPermissions,J)):(q=20,z|=function(Z){return 63&(Z||0)}(k.dosPermissions)),w=M.getUTCHours(),w<<=6,w|=M.getUTCMinutes(),w<<=5,w|=M.getUTCSeconds()/2,E=M.getUTCFullYear()-1980,E<<=4,E|=M.getUTCMonth()+1,E<<=5,E|=M.getUTCDate(),F&&(Y=i(1,1)+i(p(B),4)+S,O+="up"+i(Y.length,2)+Y),s&&(j=i(1,1)+i(p(X),4)+v,O+="uc"+i(j.length,2)+j);var H="";return H+=`
\0`,H+=i(P,2),H+=T.magic,H+=i(w,2),H+=i(E,2),H+=i(K.crc32,4),H+=i(K.compressedSize,4),H+=i(K.uncompressedSize,4),H+=i(B.length,2),H+=i(O.length,2),{fileRecord:d.LOCAL_FILE_HEADER+H+B+O,dirRecord:d.CENTRAL_FILE_HEADER+i(q,2)+H+i(X.length,2)+"\0\0\0\0"+i(z,4)+i(u,4)+B+O+X}}var e=y("../utils"),o=y("../stream/GenericWorker"),f=y("../utf8"),p=y("../crc32"),d=y("../signature");function g(n,h,a,u){o.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=h,this.zipPlatform=a,this.encodeFileName=u,this.streamFiles=n,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}e.inherits(g,o),g.prototype.push=function(n){var h=n.meta.percent||0,a=this.entriesCount,u=this._sources.length;this.accumulate?this.contentBuffer.push(n):(this.bytesWritten+=n.data.length,o.prototype.push.call(this,{data:n.data,meta:{currentFile:this.currentFile,percent:a?(h+100*(a-u-1))/a:100}}))},g.prototype.openedSource=function(n){this.currentSourceOffset=this.bytesWritten,this.currentFile=n.file.name;var h=this.streamFiles&&!n.file.dir;if(h){var a=r(n,h,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:a.fileRecord,meta:{percent:0}})}else this.accumulate=!0},g.prototype.closedSource=function(n){this.accumulate=!1;var h=this.streamFiles&&!n.file.dir,a=r(n,h,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(a.dirRecord),h)this.push({data:function(u){return d.DATA_DESCRIPTOR+i(u.crc32,4)+i(u.compressedSize,4)+i(u.uncompressedSize,4)}(n),meta:{percent:100}});else for(this.push({data:a.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},g.prototype.flush=function(){for(var n=this.bytesWritten,h=0;h<this.dirRecords.length;h++)this.push({data:this.dirRecords[h],meta:{percent:100}});var a=this.bytesWritten-n,u=function(c,_,w,E,k){var T=e.transformTo("string",k(E));return d.CENTRAL_DIRECTORY_END+"\0\0\0\0"+i(c,2)+i(c,2)+i(_,4)+i(w,4)+i(T.length,2)+T}(this.dirRecords.length,a,n,this.zipComment,this.encodeFileName);this.push({data:u,meta:{percent:100}})},g.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},g.prototype.registerPrevious=function(n){this._sources.push(n);var h=this;return n.on("data",function(a){h.processChunk(a)}),n.on("end",function(){h.closedSource(h.previous.streamInfo),h._sources.length?h.prepareNextSource():h.end()}),n.on("error",function(a){h.error(a)}),this},g.prototype.resume=function(){return!!o.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},g.prototype.error=function(n){var h=this._sources;if(!o.prototype.error.call(this,n))return!1;for(var a=0;a<h.length;a++)try{h[a].error(n)}catch(u){}return!0},g.prototype.lock=function(){o.prototype.lock.call(this);for(var n=this._sources,h=0;h<n.length;h++)n[h].lock()},D.exports=g},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(y,D,l){"use strict";var i=y("../compressions"),r=y("./ZipFileWorker");l.generateWorker=function(e,o,f){var p=new r(o.streamFiles,f,o.platform,o.encodeFileName),d=0;try{e.forEach(function(g,n){d++;var h=function(_,w){var E=_||w,k=i[E];if(!k)throw new Error(E+" is not a valid compression method !");return k}(n.options.compression,o.compression),a=n.options.compressionOptions||o.compressionOptions||{},u=n.dir,c=n.date;n._compressWorker(h,a).withStreamInfo("file",{name:g,dir:u,date:c,comment:n.comment||"",unixPermissions:n.unixPermissions,dosPermissions:n.dosPermissions}).pipe(p)}),p.entriesCount=d}catch(g){p.error(g)}return p}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(y,D,l){"use strict";function i(){if(!(this instanceof i))return new i;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var r=new i;for(var e in this)typeof this[e]!="function"&&(r[e]=this[e]);return r}}(i.prototype=y("./object")).loadAsync=y("./load"),i.support=y("./support"),i.defaults=y("./defaults"),i.version="3.10.1",i.loadAsync=function(r,e){return new i().loadAsync(r,e)},i.external=y("./external"),D.exports=i},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(y,D,l){"use strict";var i=y("./utils"),r=y("./external"),e=y("./utf8"),o=y("./zipEntries"),f=y("./stream/Crc32Probe"),p=y("./nodejsUtils");function d(g){return new r.Promise(function(n,h){var a=g.decompressed.getContentWorker().pipe(new f);a.on("error",function(u){h(u)}).on("end",function(){a.streamInfo.crc32!==g.decompressed.crc32?h(new Error("Corrupted zip : CRC32 mismatch")):n()}).resume()})}D.exports=function(g,n){var h=this;return n=i.extend(n||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:e.utf8decode}),p.isNode&&p.isStream(g)?r.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):i.prepareContent("the loaded zip file",g,!0,n.optimizedBinaryString,n.base64).then(function(a){var u=new o(n);return u.load(a),u}).then(function(a){var u=[r.Promise.resolve(a)],c=a.files;if(n.checkCRC32)for(var _=0;_<c.length;_++)u.push(d(c[_]));return r.Promise.all(u)}).then(function(a){for(var u=a.shift(),c=u.files,_=0;_<c.length;_++){var w=c[_],E=w.fileNameStr,k=i.resolve(w.fileNameStr);h.file(k,w.decompressed,{binary:!0,optimizedBinaryString:!0,date:w.date,dir:w.dir,comment:w.fileCommentStr.length?w.fileCommentStr:null,unixPermissions:w.unixPermissions,dosPermissions:w.dosPermissions,createFolders:n.createFolders}),w.dir||(h.file(k).unsafeOriginalName=E)}return u.zipComment.length&&(h.comment=u.zipComment),h})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(y,D,l){"use strict";var i=y("../utils"),r=y("../stream/GenericWorker");function e(o,f){r.call(this,"Nodejs stream input adapter for "+o),this._upstreamEnded=!1,this._bindStream(f)}i.inherits(e,r),e.prototype._bindStream=function(o){var f=this;(this._stream=o).pause(),o.on("data",function(p){f.push({data:p,meta:{percent:0}})}).on("error",function(p){f.isPaused?this.generatedError=p:f.error(p)}).on("end",function(){f.isPaused?f._upstreamEnded=!0:f.end()})},e.prototype.pause=function(){return!!r.prototype.pause.call(this)&&(this._stream.pause(),!0)},e.prototype.resume=function(){return!!r.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},D.exports=e},{"../stream/GenericWorker":28,"../utils":32}],13:[function(y,D,l){"use strict";var i=y("readable-stream").Readable;function r(e,o,f){i.call(this,o),this._helper=e;var p=this;e.on("data",function(d,g){p.push(d)||p._helper.pause(),f&&f(g)}).on("error",function(d){p.emit("error",d)}).on("end",function(){p.push(null)})}y("../utils").inherits(r,i),r.prototype._read=function(){this._helper.resume()},D.exports=r},{"../utils":32,"readable-stream":16}],14:[function(y,D,l){"use strict";D.exports={isNode:typeof Buffer!="undefined",newBufferFrom:function(i,r){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(i,r);if(typeof i=="number")throw new Error('The "data" argument must not be a number');return new Buffer(i,r)},allocBuffer:function(i){if(Buffer.alloc)return Buffer.alloc(i);var r=new Buffer(i);return r.fill(0),r},isBuffer:function(i){return Buffer.isBuffer(i)},isStream:function(i){return i&&typeof i.on=="function"&&typeof i.pause=="function"&&typeof i.resume=="function"}}},{}],15:[function(y,D,l){"use strict";function i(k,T,A){var B,S=e.getTypeOf(T),L=e.extend(A||{},p);L.date=L.date||new Date,L.compression!==null&&(L.compression=L.compression.toUpperCase()),typeof L.unixPermissions=="string"&&(L.unixPermissions=parseInt(L.unixPermissions,8)),L.unixPermissions&&16384&L.unixPermissions&&(L.dir=!0),L.dosPermissions&&16&L.dosPermissions&&(L.dir=!0),L.dir&&(k=c(k)),L.createFolders&&(B=u(k))&&_.call(this,B,!0);var X=S==="string"&&L.binary===!1&&L.base64===!1;A&&A.binary!==void 0||(L.binary=!X),(T instanceof d&&T.uncompressedSize===0||L.dir||!T||T.length===0)&&(L.base64=!1,L.binary=!0,T="",L.compression="STORE",S="string");var v=null;v=T instanceof d||T instanceof o?T:h.isNode&&h.isStream(T)?new a(k,T):e.prepareContent(k,T,L.binary,L.optimizedBinaryString,L.base64);var F=new g(k,v,L);this.files[k]=F}var r=y("./utf8"),e=y("./utils"),o=y("./stream/GenericWorker"),f=y("./stream/StreamHelper"),p=y("./defaults"),d=y("./compressedObject"),g=y("./zipObject"),n=y("./generate"),h=y("./nodejsUtils"),a=y("./nodejs/NodejsStreamInputAdapter"),u=function(k){k.slice(-1)==="/"&&(k=k.substring(0,k.length-1));var T=k.lastIndexOf("/");return 0<T?k.substring(0,T):""},c=function(k){return k.slice(-1)!=="/"&&(k+="/"),k},_=function(k,T){return T=T!==void 0?T:p.createFolders,k=c(k),this.files[k]||i.call(this,k,null,{dir:!0,createFolders:T}),this.files[k]};function w(k){return Object.prototype.toString.call(k)==="[object RegExp]"}var E={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(k){var T,A,B;for(T in this.files)B=this.files[T],(A=T.slice(this.root.length,T.length))&&T.slice(0,this.root.length)===this.root&&k(A,B)},filter:function(k){var T=[];return this.forEach(function(A,B){k(A,B)&&T.push(B)}),T},file:function(k,T,A){if(arguments.length!==1)return k=this.root+k,i.call(this,k,T,A),this;if(w(k)){var B=k;return this.filter(function(L,X){return!X.dir&&B.test(L)})}var S=this.files[this.root+k];return S&&!S.dir?S:null},folder:function(k){if(!k)return this;if(w(k))return this.filter(function(S,L){return L.dir&&k.test(S)});var T=this.root+k,A=_.call(this,T),B=this.clone();return B.root=A.name,B},remove:function(k){k=this.root+k;var T=this.files[k];if(T||(k.slice(-1)!=="/"&&(k+="/"),T=this.files[k]),T&&!T.dir)delete this.files[k];else for(var A=this.filter(function(S,L){return L.name.slice(0,k.length)===k}),B=0;B<A.length;B++)delete this.files[A[B].name];return this},generate:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(k){var T,A={};try{if((A=e.extend(k||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:r.utf8encode})).type=A.type.toLowerCase(),A.compression=A.compression.toUpperCase(),A.type==="binarystring"&&(A.type="string"),!A.type)throw new Error("No output type specified.");e.checkSupport(A.type),A.platform!=="darwin"&&A.platform!=="freebsd"&&A.platform!=="linux"&&A.platform!=="sunos"||(A.platform="UNIX"),A.platform==="win32"&&(A.platform="DOS");var B=A.comment||this.comment||"";T=n.generateWorker(this,A,B)}catch(S){(T=new o("error")).error(S)}return new f(T,A.type||"string",A.mimeType)},generateAsync:function(k,T){return this.generateInternalStream(k).accumulate(T)},generateNodeStream:function(k,T){return(k=k||{}).type||(k.type="nodebuffer"),this.generateInternalStream(k).toNodejsStream(T)}};D.exports=E},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(y,D,l){"use strict";D.exports=y("stream")},{stream:void 0}],17:[function(y,D,l){"use strict";var i=y("./DataReader");function r(e){i.call(this,e);for(var o=0;o<this.data.length;o++)e[o]=255&e[o]}y("../utils").inherits(r,i),r.prototype.byteAt=function(e){return this.data[this.zero+e]},r.prototype.lastIndexOfSignature=function(e){for(var o=e.charCodeAt(0),f=e.charCodeAt(1),p=e.charCodeAt(2),d=e.charCodeAt(3),g=this.length-4;0<=g;--g)if(this.data[g]===o&&this.data[g+1]===f&&this.data[g+2]===p&&this.data[g+3]===d)return g-this.zero;return-1},r.prototype.readAndCheckSignature=function(e){var o=e.charCodeAt(0),f=e.charCodeAt(1),p=e.charCodeAt(2),d=e.charCodeAt(3),g=this.readData(4);return o===g[0]&&f===g[1]&&p===g[2]&&d===g[3]},r.prototype.readData=function(e){if(this.checkOffset(e),e===0)return[];var o=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,o},D.exports=r},{"../utils":32,"./DataReader":18}],18:[function(y,D,l){"use strict";var i=y("../utils");function r(e){this.data=e,this.length=e.length,this.index=0,this.zero=0}r.prototype={checkOffset:function(e){this.checkIndex(this.index+e)},checkIndex:function(e){if(this.length<this.zero+e||e<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+e+"). Corrupted zip ?")},setIndex:function(e){this.checkIndex(e),this.index=e},skip:function(e){this.setIndex(this.index+e)},byteAt:function(){},readInt:function(e){var o,f=0;for(this.checkOffset(e),o=this.index+e-1;o>=this.index;o--)f=(f<<8)+this.byteAt(o);return this.index+=e,f},readString:function(e){return i.transformTo("string",this.readData(e))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var e=this.readInt(4);return new Date(Date.UTC(1980+(e>>25&127),(e>>21&15)-1,e>>16&31,e>>11&31,e>>5&63,(31&e)<<1))}},D.exports=r},{"../utils":32}],19:[function(y,D,l){"use strict";var i=y("./Uint8ArrayReader");function r(e){i.call(this,e)}y("../utils").inherits(r,i),r.prototype.readData=function(e){this.checkOffset(e);var o=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,o},D.exports=r},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(y,D,l){"use strict";var i=y("./DataReader");function r(e){i.call(this,e)}y("../utils").inherits(r,i),r.prototype.byteAt=function(e){return this.data.charCodeAt(this.zero+e)},r.prototype.lastIndexOfSignature=function(e){return this.data.lastIndexOf(e)-this.zero},r.prototype.readAndCheckSignature=function(e){return e===this.readData(4)},r.prototype.readData=function(e){this.checkOffset(e);var o=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,o},D.exports=r},{"../utils":32,"./DataReader":18}],21:[function(y,D,l){"use strict";var i=y("./ArrayReader");function r(e){i.call(this,e)}y("../utils").inherits(r,i),r.prototype.readData=function(e){if(this.checkOffset(e),e===0)return new Uint8Array(0);var o=this.data.subarray(this.zero+this.index,this.zero+this.index+e);return this.index+=e,o},D.exports=r},{"../utils":32,"./ArrayReader":17}],22:[function(y,D,l){"use strict";var i=y("../utils"),r=y("../support"),e=y("./ArrayReader"),o=y("./StringReader"),f=y("./NodeBufferReader"),p=y("./Uint8ArrayReader");D.exports=function(d){var g=i.getTypeOf(d);return i.checkSupport(g),g!=="string"||r.uint8array?g==="nodebuffer"?new f(d):r.uint8array?new p(i.transformTo("uint8array",d)):new e(i.transformTo("array",d)):new o(d)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(y,D,l){"use strict";l.LOCAL_FILE_HEADER="PK",l.CENTRAL_FILE_HEADER="PK",l.CENTRAL_DIRECTORY_END="PK",l.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK\x07",l.ZIP64_CENTRAL_DIRECTORY_END="PK",l.DATA_DESCRIPTOR="PK\x07\b"},{}],24:[function(y,D,l){"use strict";var i=y("./GenericWorker"),r=y("../utils");function e(o){i.call(this,"ConvertWorker to "+o),this.destType=o}r.inherits(e,i),e.prototype.processChunk=function(o){this.push({data:r.transformTo(this.destType,o.data),meta:o.meta})},D.exports=e},{"../utils":32,"./GenericWorker":28}],25:[function(y,D,l){"use strict";var i=y("./GenericWorker"),r=y("../crc32");function e(){i.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}y("../utils").inherits(e,i),e.prototype.processChunk=function(o){this.streamInfo.crc32=r(o.data,this.streamInfo.crc32||0),this.push(o)},D.exports=e},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(y,D,l){"use strict";var i=y("../utils"),r=y("./GenericWorker");function e(o){r.call(this,"DataLengthProbe for "+o),this.propName=o,this.withStreamInfo(o,0)}i.inherits(e,r),e.prototype.processChunk=function(o){if(o){var f=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=f+o.data.length}r.prototype.processChunk.call(this,o)},D.exports=e},{"../utils":32,"./GenericWorker":28}],27:[function(y,D,l){"use strict";var i=y("../utils"),r=y("./GenericWorker");function e(o){r.call(this,"DataWorker");var f=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,o.then(function(p){f.dataIsReady=!0,f.data=p,f.max=p&&p.length||0,f.type=i.getTypeOf(p),f.isPaused||f._tickAndRepeat()},function(p){f.error(p)})}i.inherits(e,r),e.prototype.cleanUp=function(){r.prototype.cleanUp.call(this),this.data=null},e.prototype.resume=function(){return!!r.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,i.delay(this._tickAndRepeat,[],this)),!0)},e.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(i.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},e.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var o=null,f=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":o=this.data.substring(this.index,f);break;case"uint8array":o=this.data.subarray(this.index,f);break;case"array":case"nodebuffer":o=this.data.slice(this.index,f)}return this.index=f,this.push({data:o,meta:{percent:this.max?this.index/this.max*100:0}})},D.exports=e},{"../utils":32,"./GenericWorker":28}],28:[function(y,D,l){"use strict";function i(r){this.name=r||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}i.prototype={push:function(r){this.emit("data",r)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(r){this.emit("error",r)}return!0},error:function(r){return!this.isFinished&&(this.isPaused?this.generatedError=r:(this.isFinished=!0,this.emit("error",r),this.previous&&this.previous.error(r),this.cleanUp()),!0)},on:function(r,e){return this._listeners[r].push(e),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(r,e){if(this._listeners[r])for(var o=0;o<this._listeners[r].length;o++)this._listeners[r][o].call(this,e)},pipe:function(r){return r.registerPrevious(this)},registerPrevious:function(r){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=r.streamInfo,this.mergeStreamInfo(),this.previous=r;var e=this;return r.on("data",function(o){e.processChunk(o)}),r.on("end",function(){e.end()}),r.on("error",function(o){e.error(o)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var r=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),r=!0),this.previous&&this.previous.resume(),!r},flush:function(){},processChunk:function(r){this.push(r)},withStreamInfo:function(r,e){return this.extraStreamInfo[r]=e,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var r in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,r)&&(this.streamInfo[r]=this.extraStreamInfo[r])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var r="Worker "+this.name;return this.previous?this.previous+" -> "+r:r}},D.exports=i},{}],29:[function(y,D,l){"use strict";var i=y("../utils"),r=y("./ConvertWorker"),e=y("./GenericWorker"),o=y("../base64"),f=y("../support"),p=y("../external"),d=null;if(f.nodestream)try{d=y("../nodejs/NodejsStreamOutputAdapter")}catch(h){}function g(h,a){return new p.Promise(function(u,c){var _=[],w=h._internalType,E=h._outputType,k=h._mimeType;h.on("data",function(T,A){_.push(T),a&&a(A)}).on("error",function(T){_=[],c(T)}).on("end",function(){try{var T=function(A,B,S){switch(A){case"blob":return i.newBlob(i.transformTo("arraybuffer",B),S);case"base64":return o.encode(B);default:return i.transformTo(A,B)}}(E,function(A,B){var S,L=0,X=null,v=0;for(S=0;S<B.length;S++)v+=B[S].length;switch(A){case"string":return B.join("");case"array":return Array.prototype.concat.apply([],B);case"uint8array":for(X=new Uint8Array(v),S=0;S<B.length;S++)X.set(B[S],L),L+=B[S].length;return X;case"nodebuffer":return Buffer.concat(B);default:throw new Error("concat : unsupported type '"+A+"'")}}(w,_),k);u(T)}catch(A){c(A)}_=[]}).resume()})}function n(h,a,u){var c=a;switch(a){case"blob":case"arraybuffer":c="uint8array";break;case"base64":c="string"}try{this._internalType=c,this._outputType=a,this._mimeType=u,i.checkSupport(c),this._worker=h.pipe(new r(c)),h.lock()}catch(_){this._worker=new e("error"),this._worker.error(_)}}n.prototype={accumulate:function(h){return g(this,h)},on:function(h,a){var u=this;return h==="data"?this._worker.on(h,function(c){a.call(u,c.data,c.meta)}):this._worker.on(h,function(){i.delay(a,arguments,u)}),this},resume:function(){return i.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(h){if(i.checkSupport("nodestream"),this._outputType!=="nodebuffer")throw new Error(this._outputType+" is not supported by this method");return new d(this,{objectMode:this._outputType!=="nodebuffer"},h)}},D.exports=n},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(y,D,l){"use strict";if(l.base64=!0,l.array=!0,l.string=!0,l.arraybuffer=typeof ArrayBuffer!="undefined"&&typeof Uint8Array!="undefined",l.nodebuffer=typeof Buffer!="undefined",l.uint8array=typeof Uint8Array!="undefined",typeof ArrayBuffer=="undefined")l.blob=!1;else{var i=new ArrayBuffer(0);try{l.blob=new Blob([i],{type:"application/zip"}).size===0}catch(e){try{var r=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);r.append(i),l.blob=r.getBlob("application/zip").size===0}catch(o){l.blob=!1}}}try{l.nodestream=!!y("readable-stream").Readable}catch(e){l.nodestream=!1}},{"readable-stream":16}],31:[function(y,D,l){"use strict";for(var i=y("./utils"),r=y("./support"),e=y("./nodejsUtils"),o=y("./stream/GenericWorker"),f=new Array(256),p=0;p<256;p++)f[p]=252<=p?6:248<=p?5:240<=p?4:224<=p?3:192<=p?2:1;f[254]=f[254]=1;function d(){o.call(this,"utf-8 decode"),this.leftOver=null}function g(){o.call(this,"utf-8 encode")}l.utf8encode=function(n){return r.nodebuffer?e.newBufferFrom(n,"utf-8"):function(h){var a,u,c,_,w,E=h.length,k=0;for(_=0;_<E;_++)(64512&(u=h.charCodeAt(_)))==55296&&_+1<E&&(64512&(c=h.charCodeAt(_+1)))==56320&&(u=65536+(u-55296<<10)+(c-56320),_++),k+=u<128?1:u<2048?2:u<65536?3:4;for(a=r.uint8array?new Uint8Array(k):new Array(k),_=w=0;w<k;_++)(64512&(u=h.charCodeAt(_)))==55296&&_+1<E&&(64512&(c=h.charCodeAt(_+1)))==56320&&(u=65536+(u-55296<<10)+(c-56320),_++),u<128?a[w++]=u:(u<2048?a[w++]=192|u>>>6:(u<65536?a[w++]=224|u>>>12:(a[w++]=240|u>>>18,a[w++]=128|u>>>12&63),a[w++]=128|u>>>6&63),a[w++]=128|63&u);return a}(n)},l.utf8decode=function(n){return r.nodebuffer?i.transformTo("nodebuffer",n).toString("utf-8"):function(h){var a,u,c,_,w=h.length,E=new Array(2*w);for(a=u=0;a<w;)if((c=h[a++])<128)E[u++]=c;else if(4<(_=f[c]))E[u++]=65533,a+=_-1;else{for(c&=_===2?31:_===3?15:7;1<_&&a<w;)c=c<<6|63&h[a++],_--;1<_?E[u++]=65533:c<65536?E[u++]=c:(c-=65536,E[u++]=55296|c>>10&1023,E[u++]=56320|1023&c)}return E.length!==u&&(E.subarray?E=E.subarray(0,u):E.length=u),i.applyFromCharCode(E)}(n=i.transformTo(r.uint8array?"uint8array":"array",n))},i.inherits(d,o),d.prototype.processChunk=function(n){var h=i.transformTo(r.uint8array?"uint8array":"array",n.data);if(this.leftOver&&this.leftOver.length){if(r.uint8array){var a=h;(h=new Uint8Array(a.length+this.leftOver.length)).set(this.leftOver,0),h.set(a,this.leftOver.length)}else h=this.leftOver.concat(h);this.leftOver=null}var u=function(_,w){var E;for((w=w||_.length)>_.length&&(w=_.length),E=w-1;0<=E&&(192&_[E])==128;)E--;return E<0||E===0?w:E+f[_[E]]>w?E:w}(h),c=h;u!==h.length&&(r.uint8array?(c=h.subarray(0,u),this.leftOver=h.subarray(u,h.length)):(c=h.slice(0,u),this.leftOver=h.slice(u,h.length))),this.push({data:l.utf8decode(c),meta:n.meta})},d.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:l.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},l.Utf8DecodeWorker=d,i.inherits(g,o),g.prototype.processChunk=function(n){this.push({data:l.utf8encode(n.data),meta:n.meta})},l.Utf8EncodeWorker=g},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(y,D,l){"use strict";var i=y("./support"),r=y("./base64"),e=y("./nodejsUtils"),o=y("./external");function f(a){return a}function p(a,u){for(var c=0;c<a.length;++c)u[c]=255&a.charCodeAt(c);return u}y("setimmediate"),l.newBlob=function(a,u){l.checkSupport("blob");try{return new Blob([a],{type:u})}catch(_){try{var c=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return c.append(a),c.getBlob(u)}catch(w){throw new Error("Bug : can't construct the Blob.")}}};var d={stringifyByChunk:function(a,u,c){var _=[],w=0,E=a.length;if(E<=c)return String.fromCharCode.apply(null,a);for(;w<E;)u==="array"||u==="nodebuffer"?_.push(String.fromCharCode.apply(null,a.slice(w,Math.min(w+c,E)))):_.push(String.fromCharCode.apply(null,a.subarray(w,Math.min(w+c,E)))),w+=c;return _.join("")},stringifyByChar:function(a){for(var u="",c=0;c<a.length;c++)u+=String.fromCharCode(a[c]);return u},applyCanBeUsed:{uint8array:function(){try{return i.uint8array&&String.fromCharCode.apply(null,new Uint8Array(1)).length===1}catch(a){return!1}}(),nodebuffer:function(){try{return i.nodebuffer&&String.fromCharCode.apply(null,e.allocBuffer(1)).length===1}catch(a){return!1}}()}};function g(a){var u=65536,c=l.getTypeOf(a),_=!0;if(c==="uint8array"?_=d.applyCanBeUsed.uint8array:c==="nodebuffer"&&(_=d.applyCanBeUsed.nodebuffer),_)for(;1<u;)try{return d.stringifyByChunk(a,c,u)}catch(w){u=Math.floor(u/2)}return d.stringifyByChar(a)}function n(a,u){for(var c=0;c<a.length;c++)u[c]=a[c];return u}l.applyFromCharCode=g;var h={};h.string={string:f,array:function(a){return p(a,new Array(a.length))},arraybuffer:function(a){return h.string.uint8array(a).buffer},uint8array:function(a){return p(a,new Uint8Array(a.length))},nodebuffer:function(a){return p(a,e.allocBuffer(a.length))}},h.array={string:g,array:f,arraybuffer:function(a){return new Uint8Array(a).buffer},uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return e.newBufferFrom(a)}},h.arraybuffer={string:function(a){return g(new Uint8Array(a))},array:function(a){return n(new Uint8Array(a),new Array(a.byteLength))},arraybuffer:f,uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return e.newBufferFrom(new Uint8Array(a))}},h.uint8array={string:g,array:function(a){return n(a,new Array(a.length))},arraybuffer:function(a){return a.buffer},uint8array:f,nodebuffer:function(a){return e.newBufferFrom(a)}},h.nodebuffer={string:g,array:function(a){return n(a,new Array(a.length))},arraybuffer:function(a){return h.nodebuffer.uint8array(a).buffer},uint8array:function(a){return n(a,new Uint8Array(a.length))},nodebuffer:f},l.transformTo=function(a,u){if(u=u||"",!a)return u;l.checkSupport(a);var c=l.getTypeOf(u);return h[c][a](u)},l.resolve=function(a){for(var u=a.split("/"),c=[],_=0;_<u.length;_++){var w=u[_];w==="."||w===""&&_!==0&&_!==u.length-1||(w===".."?c.pop():c.push(w))}return c.join("/")},l.getTypeOf=function(a){return typeof a=="string"?"string":Object.prototype.toString.call(a)==="[object Array]"?"array":i.nodebuffer&&e.isBuffer(a)?"nodebuffer":i.uint8array&&a instanceof Uint8Array?"uint8array":i.arraybuffer&&a instanceof ArrayBuffer?"arraybuffer":void 0},l.checkSupport=function(a){if(!i[a.toLowerCase()])throw new Error(a+" is not supported by this platform")},l.MAX_VALUE_16BITS=65535,l.MAX_VALUE_32BITS=-1,l.pretty=function(a){var u,c,_="";for(c=0;c<(a||"").length;c++)_+="\\x"+((u=a.charCodeAt(c))<16?"0":"")+u.toString(16).toUpperCase();return _},l.delay=function(a,u,c){setImmediate(function(){a.apply(c||null,u||[])})},l.inherits=function(a,u){function c(){}c.prototype=u.prototype,a.prototype=new c},l.extend=function(){var a,u,c={};for(a=0;a<arguments.length;a++)for(u in arguments[a])Object.prototype.hasOwnProperty.call(arguments[a],u)&&c[u]===void 0&&(c[u]=arguments[a][u]);return c},l.prepareContent=function(a,u,c,_,w){return o.Promise.resolve(u).then(function(E){return i.blob&&(E instanceof Blob||["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(E))!==-1)&&typeof FileReader!="undefined"?new o.Promise(function(k,T){var A=new FileReader;A.onload=function(B){k(B.target.result)},A.onerror=function(B){T(B.target.error)},A.readAsArrayBuffer(E)}):E}).then(function(E){var k=l.getTypeOf(E);return k?(k==="arraybuffer"?E=l.transformTo("uint8array",E):k==="string"&&(w?E=r.decode(E):c&&_!==!0&&(E=function(T){return p(T,i.uint8array?new Uint8Array(T.length):new Array(T.length))}(E))),E):o.Promise.reject(new Error("Can't read the data of '"+a+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(y,D,l){"use strict";var i=y("./reader/readerFor"),r=y("./utils"),e=y("./signature"),o=y("./zipEntry"),f=y("./support");function p(d){this.files=[],this.loadOptions=d}p.prototype={checkSignature:function(d){if(!this.reader.readAndCheckSignature(d)){this.reader.index-=4;var g=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+r.pretty(g)+", expected "+r.pretty(d)+")")}},isSignature:function(d,g){var n=this.reader.index;this.reader.setIndex(d);var h=this.reader.readString(4)===g;return this.reader.setIndex(n),h},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var d=this.reader.readData(this.zipCommentLength),g=f.uint8array?"uint8array":"array",n=r.transformTo(g,d);this.zipComment=this.loadOptions.decodeFileName(n)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var d,g,n,h=this.zip64EndOfCentralSize-44;0<h;)d=this.reader.readInt(2),g=this.reader.readInt(4),n=this.reader.readData(g),this.zip64ExtensibleData[d]={id:d,length:g,value:n}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var d,g;for(d=0;d<this.files.length;d++)g=this.files[d],this.reader.setIndex(g.localHeaderOffset),this.checkSignature(e.LOCAL_FILE_HEADER),g.readLocalPart(this.reader),g.handleUTF8(),g.processAttributes()},readCentralDir:function(){var d;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(e.CENTRAL_FILE_HEADER);)(d=new o({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(d);if(this.centralDirRecords!==this.files.length&&this.centralDirRecords!==0&&this.files.length===0)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var d=this.reader.lastIndexOfSignature(e.CENTRAL_DIRECTORY_END);if(d<0)throw this.isSignature(0,e.LOCAL_FILE_HEADER)?new Error("Corrupted zip: can't find end of central directory"):new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");this.reader.setIndex(d);var g=d;if(this.checkSignature(e.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===r.MAX_VALUE_16BITS||this.diskWithCentralDirStart===r.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===r.MAX_VALUE_16BITS||this.centralDirRecords===r.MAX_VALUE_16BITS||this.centralDirSize===r.MAX_VALUE_32BITS||this.centralDirOffset===r.MAX_VALUE_32BITS){if(this.zip64=!0,(d=this.reader.lastIndexOfSignature(e.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(d),this.checkSignature(e.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,e.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(e.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(e.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var n=this.centralDirOffset+this.centralDirSize;this.zip64&&(n+=20,n+=12+this.zip64EndOfCentralSize);var h=g-n;if(0<h)this.isSignature(g,e.CENTRAL_FILE_HEADER)||(this.reader.zero=h);else if(h<0)throw new Error("Corrupted zip: missing "+Math.abs(h)+" bytes.")},prepareReader:function(d){this.reader=i(d)},load:function(d){this.prepareReader(d),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},D.exports=p},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(y,D,l){"use strict";var i=y("./reader/readerFor"),r=y("./utils"),e=y("./compressedObject"),o=y("./crc32"),f=y("./utf8"),p=y("./compressions"),d=y("./support");function g(n,h){this.options=n,this.loadOptions=h}g.prototype={isEncrypted:function(){return(1&this.bitFlag)==1},useUTF8:function(){return(2048&this.bitFlag)==2048},readLocalPart:function(n){var h,a;if(n.skip(22),this.fileNameLength=n.readInt(2),a=n.readInt(2),this.fileName=n.readData(this.fileNameLength),n.skip(a),this.compressedSize===-1||this.uncompressedSize===-1)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if((h=function(u){for(var c in p)if(Object.prototype.hasOwnProperty.call(p,c)&&p[c].magic===u)return p[c];return null}(this.compressionMethod))===null)throw new Error("Corrupted zip : compression "+r.pretty(this.compressionMethod)+" unknown (inner file : "+r.transformTo("string",this.fileName)+")");this.decompressed=new e(this.compressedSize,this.uncompressedSize,this.crc32,h,n.readData(this.compressedSize))},readCentralPart:function(n){this.versionMadeBy=n.readInt(2),n.skip(2),this.bitFlag=n.readInt(2),this.compressionMethod=n.readString(2),this.date=n.readDate(),this.crc32=n.readInt(4),this.compressedSize=n.readInt(4),this.uncompressedSize=n.readInt(4);var h=n.readInt(2);if(this.extraFieldsLength=n.readInt(2),this.fileCommentLength=n.readInt(2),this.diskNumberStart=n.readInt(2),this.internalFileAttributes=n.readInt(2),this.externalFileAttributes=n.readInt(4),this.localHeaderOffset=n.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");n.skip(h),this.readExtraFields(n),this.parseZIP64ExtraField(n),this.fileComment=n.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var n=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),n==0&&(this.dosPermissions=63&this.externalFileAttributes),n==3&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||this.fileNameStr.slice(-1)!=="/"||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var n=i(this.extraFields[1].value);this.uncompressedSize===r.MAX_VALUE_32BITS&&(this.uncompressedSize=n.readInt(8)),this.compressedSize===r.MAX_VALUE_32BITS&&(this.compressedSize=n.readInt(8)),this.localHeaderOffset===r.MAX_VALUE_32BITS&&(this.localHeaderOffset=n.readInt(8)),this.diskNumberStart===r.MAX_VALUE_32BITS&&(this.diskNumberStart=n.readInt(4))}},readExtraFields:function(n){var h,a,u,c=n.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});n.index+4<c;)h=n.readInt(2),a=n.readInt(2),u=n.readData(a),this.extraFields[h]={id:h,length:a,value:u};n.setIndex(c)},handleUTF8:function(){var n=d.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=f.utf8decode(this.fileName),this.fileCommentStr=f.utf8decode(this.fileComment);else{var h=this.findExtraFieldUnicodePath();if(h!==null)this.fileNameStr=h;else{var a=r.transformTo(n,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(a)}var u=this.findExtraFieldUnicodeComment();if(u!==null)this.fileCommentStr=u;else{var c=r.transformTo(n,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(c)}}},findExtraFieldUnicodePath:function(){var n=this.extraFields[28789];if(n){var h=i(n.value);return h.readInt(1)!==1||o(this.fileName)!==h.readInt(4)?null:f.utf8decode(h.readData(n.length-5))}return null},findExtraFieldUnicodeComment:function(){var n=this.extraFields[25461];if(n){var h=i(n.value);return h.readInt(1)!==1||o(this.fileComment)!==h.readInt(4)?null:f.utf8decode(h.readData(n.length-5))}return null}},D.exports=g},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(y,D,l){"use strict";function i(h,a,u){this.name=h,this.dir=u.dir,this.date=u.date,this.comment=u.comment,this.unixPermissions=u.unixPermissions,this.dosPermissions=u.dosPermissions,this._data=a,this._dataBinary=u.binary,this.options={compression:u.compression,compressionOptions:u.compressionOptions}}var r=y("./stream/StreamHelper"),e=y("./stream/DataWorker"),o=y("./utf8"),f=y("./compressedObject"),p=y("./stream/GenericWorker");i.prototype={internalStream:function(h){var a=null,u="string";try{if(!h)throw new Error("No output type specified.");var c=(u=h.toLowerCase())==="string"||u==="text";u!=="binarystring"&&u!=="text"||(u="string"),a=this._decompressWorker();var _=!this._dataBinary;_&&!c&&(a=a.pipe(new o.Utf8EncodeWorker)),!_&&c&&(a=a.pipe(new o.Utf8DecodeWorker))}catch(w){(a=new p("error")).error(w)}return new r(a,u,"")},async:function(h,a){return this.internalStream(h).accumulate(a)},nodeStream:function(h,a){return this.internalStream(h||"nodebuffer").toNodejsStream(a)},_compressWorker:function(h,a){if(this._data instanceof f&&this._data.compression.magic===h.magic)return this._data.getCompressedWorker();var u=this._decompressWorker();return this._dataBinary||(u=u.pipe(new o.Utf8EncodeWorker)),f.createWorkerFrom(u,h,a)},_decompressWorker:function(){return this._data instanceof f?this._data.getContentWorker():this._data instanceof p?this._data:new e(this._data)}};for(var d=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],g=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},n=0;n<d.length;n++)i.prototype[d[n]]=g;D.exports=i},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(y,D,l){(function(i){"use strict";var r,e,o=i.MutationObserver||i.WebKitMutationObserver;if(o){var f=0,p=new o(h),d=i.document.createTextNode("");p.observe(d,{characterData:!0}),r=function(){d.data=f=++f%2}}else if(i.setImmediate||i.MessageChannel===void 0)r="document"in i&&"onreadystatechange"in i.document.createElement("script")?function(){var a=i.document.createElement("script");a.onreadystatechange=function(){h(),a.onreadystatechange=null,a.parentNode.removeChild(a),a=null},i.document.documentElement.appendChild(a)}:function(){setTimeout(h,0)};else{var g=new i.MessageChannel;g.port1.onmessage=h,r=function(){g.port2.postMessage(0)}}var n=[];function h(){var a,u;e=!0;for(var c=n.length;c;){for(u=n,n=[],a=-1;++a<c;)u[a]();c=n.length}e=!1}D.exports=function(a){n.push(a)!==1||e||r()}}).call(this,typeof global!="undefined"?global:typeof self!="undefined"?self:typeof window!="undefined"?window:{})},{}],37:[function(y,D,l){"use strict";var i=y("immediate");function r(){}var e={},o=["REJECTED"],f=["FULFILLED"],p=["PENDING"];function d(c){if(typeof c!="function")throw new TypeError("resolver must be a function");this.state=p,this.queue=[],this.outcome=void 0,c!==r&&a(this,c)}function g(c,_,w){this.promise=c,typeof _=="function"&&(this.onFulfilled=_,this.callFulfilled=this.otherCallFulfilled),typeof w=="function"&&(this.onRejected=w,this.callRejected=this.otherCallRejected)}function n(c,_,w){i(function(){var E;try{E=_(w)}catch(k){return e.reject(c,k)}E===c?e.reject(c,new TypeError("Cannot resolve promise with itself")):e.resolve(c,E)})}function h(c){var _=c&&c.then;if(c&&(typeof c=="object"||typeof c=="function")&&typeof _=="function")return function(){_.apply(c,arguments)}}function a(c,_){var w=!1;function E(A){w||(w=!0,e.reject(c,A))}function k(A){w||(w=!0,e.resolve(c,A))}var T=u(function(){_(k,E)});T.status==="error"&&E(T.value)}function u(c,_){var w={};try{w.value=c(_),w.status="success"}catch(E){w.status="error",w.value=E}return w}(D.exports=d).prototype.finally=function(c){if(typeof c!="function")return this;var _=this.constructor;return this.then(function(w){return _.resolve(c()).then(function(){return w})},function(w){return _.resolve(c()).then(function(){throw w})})},d.prototype.catch=function(c){return this.then(null,c)},d.prototype.then=function(c,_){if(typeof c!="function"&&this.state===f||typeof _!="function"&&this.state===o)return this;var w=new this.constructor(r);return this.state!==p?n(w,this.state===f?c:_,this.outcome):this.queue.push(new g(w,c,_)),w},g.prototype.callFulfilled=function(c){e.resolve(this.promise,c)},g.prototype.otherCallFulfilled=function(c){n(this.promise,this.onFulfilled,c)},g.prototype.callRejected=function(c){e.reject(this.promise,c)},g.prototype.otherCallRejected=function(c){n(this.promise,this.onRejected,c)},e.resolve=function(c,_){var w=u(h,_);if(w.status==="error")return e.reject(c,w.value);var E=w.value;if(E)a(c,E);else{c.state=f,c.outcome=_;for(var k=-1,T=c.queue.length;++k<T;)c.queue[k].callFulfilled(_)}return c},e.reject=function(c,_){c.state=o,c.outcome=_;for(var w=-1,E=c.queue.length;++w<E;)c.queue[w].callRejected(_);return c},d.resolve=function(c){return c instanceof this?c:e.resolve(new this(r),c)},d.reject=function(c){var _=new this(r);return e.reject(_,c)},d.all=function(c){var _=this;if(Object.prototype.toString.call(c)!=="[object Array]")return this.reject(new TypeError("must be an array"));var w=c.length,E=!1;if(!w)return this.resolve([]);for(var k=new Array(w),T=0,A=-1,B=new this(r);++A<w;)S(c[A],A);return B;function S(L,X){_.resolve(L).then(function(v){k[X]=v,++T!==w||E||(E=!0,e.resolve(B,k))},function(v){E||(E=!0,e.reject(B,v))})}},d.race=function(c){var _=this;if(Object.prototype.toString.call(c)!=="[object Array]")return this.reject(new TypeError("must be an array"));var w=c.length,E=!1;if(!w)return this.resolve([]);for(var k=-1,T=new this(r);++k<w;)A=c[k],_.resolve(A).then(function(B){E||(E=!0,e.resolve(T,B))},function(B){E||(E=!0,e.reject(T,B))});var A;return T}},{immediate:36}],38:[function(y,D,l){"use strict";var i={};(0,y("./lib/utils/common").assign)(i,y("./lib/deflate"),y("./lib/inflate"),y("./lib/zlib/constants")),D.exports=i},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(y,D,l){"use strict";var i=y("./zlib/deflate"),r=y("./utils/common"),e=y("./utils/strings"),o=y("./zlib/messages"),f=y("./zlib/zstream"),p=Object.prototype.toString,d=0,g=-1,n=0,h=8;function a(c){if(!(this instanceof a))return new a(c);this.options=r.assign({level:g,method:h,chunkSize:16384,windowBits:15,memLevel:8,strategy:n,to:""},c||{});var _=this.options;_.raw&&0<_.windowBits?_.windowBits=-_.windowBits:_.gzip&&0<_.windowBits&&_.windowBits<16&&(_.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new f,this.strm.avail_out=0;var w=i.deflateInit2(this.strm,_.level,_.method,_.windowBits,_.memLevel,_.strategy);if(w!==d)throw new Error(o[w]);if(_.header&&i.deflateSetHeader(this.strm,_.header),_.dictionary){var E;if(E=typeof _.dictionary=="string"?e.string2buf(_.dictionary):p.call(_.dictionary)==="[object ArrayBuffer]"?new Uint8Array(_.dictionary):_.dictionary,(w=i.deflateSetDictionary(this.strm,E))!==d)throw new Error(o[w]);this._dict_set=!0}}function u(c,_){var w=new a(_);if(w.push(c,!0),w.err)throw w.msg||o[w.err];return w.result}a.prototype.push=function(c,_){var w,E,k=this.strm,T=this.options.chunkSize;if(this.ended)return!1;E=_===~~_?_:_===!0?4:0,typeof c=="string"?k.input=e.string2buf(c):p.call(c)==="[object ArrayBuffer]"?k.input=new Uint8Array(c):k.input=c,k.next_in=0,k.avail_in=k.input.length;do{if(k.avail_out===0&&(k.output=new r.Buf8(T),k.next_out=0,k.avail_out=T),(w=i.deflate(k,E))!==1&&w!==d)return this.onEnd(w),!(this.ended=!0);k.avail_out!==0&&(k.avail_in!==0||E!==4&&E!==2)||(this.options.to==="string"?this.onData(e.buf2binstring(r.shrinkBuf(k.output,k.next_out))):this.onData(r.shrinkBuf(k.output,k.next_out)))}while((0<k.avail_in||k.avail_out===0)&&w!==1);return E===4?(w=i.deflateEnd(this.strm),this.onEnd(w),this.ended=!0,w===d):E!==2||(this.onEnd(d),!(k.avail_out=0))},a.prototype.onData=function(c){this.chunks.push(c)},a.prototype.onEnd=function(c){c===d&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=r.flattenChunks(this.chunks)),this.chunks=[],this.err=c,this.msg=this.strm.msg},l.Deflate=a,l.deflate=u,l.deflateRaw=function(c,_){return(_=_||{}).raw=!0,u(c,_)},l.gzip=function(c,_){return(_=_||{}).gzip=!0,u(c,_)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(y,D,l){"use strict";var i=y("./zlib/inflate"),r=y("./utils/common"),e=y("./utils/strings"),o=y("./zlib/constants"),f=y("./zlib/messages"),p=y("./zlib/zstream"),d=y("./zlib/gzheader"),g=Object.prototype.toString;function n(a){if(!(this instanceof n))return new n(a);this.options=r.assign({chunkSize:16384,windowBits:0,to:""},a||{});var u=this.options;u.raw&&0<=u.windowBits&&u.windowBits<16&&(u.windowBits=-u.windowBits,u.windowBits===0&&(u.windowBits=-15)),!(0<=u.windowBits&&u.windowBits<16)||a&&a.windowBits||(u.windowBits+=32),15<u.windowBits&&u.windowBits<48&&!(15&u.windowBits)&&(u.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new p,this.strm.avail_out=0;var c=i.inflateInit2(this.strm,u.windowBits);if(c!==o.Z_OK)throw new Error(f[c]);this.header=new d,i.inflateGetHeader(this.strm,this.header)}function h(a,u){var c=new n(u);if(c.push(a,!0),c.err)throw c.msg||f[c.err];return c.result}n.prototype.push=function(a,u){var c,_,w,E,k,T,A=this.strm,B=this.options.chunkSize,S=this.options.dictionary,L=!1;if(this.ended)return!1;_=u===~~u?u:u===!0?o.Z_FINISH:o.Z_NO_FLUSH,typeof a=="string"?A.input=e.binstring2buf(a):g.call(a)==="[object ArrayBuffer]"?A.input=new Uint8Array(a):A.input=a,A.next_in=0,A.avail_in=A.input.length;do{if(A.avail_out===0&&(A.output=new r.Buf8(B),A.next_out=0,A.avail_out=B),(c=i.inflate(A,o.Z_NO_FLUSH))===o.Z_NEED_DICT&&S&&(T=typeof S=="string"?e.string2buf(S):g.call(S)==="[object ArrayBuffer]"?new Uint8Array(S):S,c=i.inflateSetDictionary(this.strm,T)),c===o.Z_BUF_ERROR&&L===!0&&(c=o.Z_OK,L=!1),c!==o.Z_STREAM_END&&c!==o.Z_OK)return this.onEnd(c),!(this.ended=!0);A.next_out&&(A.avail_out!==0&&c!==o.Z_STREAM_END&&(A.avail_in!==0||_!==o.Z_FINISH&&_!==o.Z_SYNC_FLUSH)||(this.options.to==="string"?(w=e.utf8border(A.output,A.next_out),E=A.next_out-w,k=e.buf2string(A.output,w),A.next_out=E,A.avail_out=B-E,E&&r.arraySet(A.output,A.output,w,E,0),this.onData(k)):this.onData(r.shrinkBuf(A.output,A.next_out)))),A.avail_in===0&&A.avail_out===0&&(L=!0)}while((0<A.avail_in||A.avail_out===0)&&c!==o.Z_STREAM_END);return c===o.Z_STREAM_END&&(_=o.Z_FINISH),_===o.Z_FINISH?(c=i.inflateEnd(this.strm),this.onEnd(c),this.ended=!0,c===o.Z_OK):_!==o.Z_SYNC_FLUSH||(this.onEnd(o.Z_OK),!(A.avail_out=0))},n.prototype.onData=function(a){this.chunks.push(a)},n.prototype.onEnd=function(a){a===o.Z_OK&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=r.flattenChunks(this.chunks)),this.chunks=[],this.err=a,this.msg=this.strm.msg},l.Inflate=n,l.inflate=h,l.inflateRaw=function(a,u){return(u=u||{}).raw=!0,h(a,u)},l.ungzip=h},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(y,D,l){"use strict";var i=typeof Uint8Array!="undefined"&&typeof Uint16Array!="undefined"&&typeof Int32Array!="undefined";l.assign=function(o){for(var f=Array.prototype.slice.call(arguments,1);f.length;){var p=f.shift();if(p){if(typeof p!="object")throw new TypeError(p+"must be non-object");for(var d in p)p.hasOwnProperty(d)&&(o[d]=p[d])}}return o},l.shrinkBuf=function(o,f){return o.length===f?o:o.subarray?o.subarray(0,f):(o.length=f,o)};var r={arraySet:function(o,f,p,d,g){if(f.subarray&&o.subarray)o.set(f.subarray(p,p+d),g);else for(var n=0;n<d;n++)o[g+n]=f[p+n]},flattenChunks:function(o){var f,p,d,g,n,h;for(f=d=0,p=o.length;f<p;f++)d+=o[f].length;for(h=new Uint8Array(d),f=g=0,p=o.length;f<p;f++)n=o[f],h.set(n,g),g+=n.length;return h}},e={arraySet:function(o,f,p,d,g){for(var n=0;n<d;n++)o[g+n]=f[p+n]},flattenChunks:function(o){return[].concat.apply([],o)}};l.setTyped=function(o){o?(l.Buf8=Uint8Array,l.Buf16=Uint16Array,l.Buf32=Int32Array,l.assign(l,r)):(l.Buf8=Array,l.Buf16=Array,l.Buf32=Array,l.assign(l,e))},l.setTyped(i)},{}],42:[function(y,D,l){"use strict";var i=y("./common"),r=!0,e=!0;try{String.fromCharCode.apply(null,[0])}catch(d){r=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(d){e=!1}for(var o=new i.Buf8(256),f=0;f<256;f++)o[f]=252<=f?6:248<=f?5:240<=f?4:224<=f?3:192<=f?2:1;function p(d,g){if(g<65537&&(d.subarray&&e||!d.subarray&&r))return String.fromCharCode.apply(null,i.shrinkBuf(d,g));for(var n="",h=0;h<g;h++)n+=String.fromCharCode(d[h]);return n}o[254]=o[254]=1,l.string2buf=function(d){var g,n,h,a,u,c=d.length,_=0;for(a=0;a<c;a++)(64512&(n=d.charCodeAt(a)))==55296&&a+1<c&&(64512&(h=d.charCodeAt(a+1)))==56320&&(n=65536+(n-55296<<10)+(h-56320),a++),_+=n<128?1:n<2048?2:n<65536?3:4;for(g=new i.Buf8(_),a=u=0;u<_;a++)(64512&(n=d.charCodeAt(a)))==55296&&a+1<c&&(64512&(h=d.charCodeAt(a+1)))==56320&&(n=65536+(n-55296<<10)+(h-56320),a++),n<128?g[u++]=n:(n<2048?g[u++]=192|n>>>6:(n<65536?g[u++]=224|n>>>12:(g[u++]=240|n>>>18,g[u++]=128|n>>>12&63),g[u++]=128|n>>>6&63),g[u++]=128|63&n);return g},l.buf2binstring=function(d){return p(d,d.length)},l.binstring2buf=function(d){for(var g=new i.Buf8(d.length),n=0,h=g.length;n<h;n++)g[n]=d.charCodeAt(n);return g},l.buf2string=function(d,g){var n,h,a,u,c=g||d.length,_=new Array(2*c);for(n=h=0;n<c;)if((a=d[n++])<128)_[h++]=a;else if(4<(u=o[a]))_[h++]=65533,n+=u-1;else{for(a&=u===2?31:u===3?15:7;1<u&&n<c;)a=a<<6|63&d[n++],u--;1<u?_[h++]=65533:a<65536?_[h++]=a:(a-=65536,_[h++]=55296|a>>10&1023,_[h++]=56320|1023&a)}return p(_,h)},l.utf8border=function(d,g){var n;for((g=g||d.length)>d.length&&(g=d.length),n=g-1;0<=n&&(192&d[n])==128;)n--;return n<0||n===0?g:n+o[d[n]]>g?n:g}},{"./common":41}],43:[function(y,D,l){"use strict";D.exports=function(i,r,e,o){for(var f=65535&i|0,p=i>>>16&65535|0,d=0;e!==0;){for(e-=d=2e3<e?2e3:e;p=p+(f=f+r[o++]|0)|0,--d;);f%=65521,p%=65521}return f|p<<16|0}},{}],44:[function(y,D,l){"use strict";D.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(y,D,l){"use strict";var i=function(){for(var r,e=[],o=0;o<256;o++){r=o;for(var f=0;f<8;f++)r=1&r?3988292384^r>>>1:r>>>1;e[o]=r}return e}();D.exports=function(r,e,o,f){var p=i,d=f+o;r^=-1;for(var g=f;g<d;g++)r=r>>>8^p[255&(r^e[g])];return-1^r}},{}],46:[function(y,D,l){"use strict";var i,r=y("../utils/common"),e=y("./trees"),o=y("./adler32"),f=y("./crc32"),p=y("./messages"),d=0,g=4,n=0,h=-2,a=-1,u=4,c=2,_=8,w=9,E=286,k=30,T=19,A=2*E+1,B=15,S=3,L=258,X=L+S+1,v=42,F=113,s=1,O=2,Y=3,j=4;function J(t,R){return t.msg=p[R],R}function M(t){return(t<<1)-(4<t?9:0)}function K(t){for(var R=t.length;0<=--R;)t[R]=0}function P(t){var R=t.state,I=R.pending;I>t.avail_out&&(I=t.avail_out),I!==0&&(r.arraySet(t.output,R.pending_buf,R.pending_out,I,t.next_out),t.next_out+=I,R.pending_out+=I,t.total_out+=I,t.avail_out-=I,R.pending-=I,R.pending===0&&(R.pending_out=0))}function z(t,R){e._tr_flush_block(t,0<=t.block_start?t.block_start:-1,t.strstart-t.block_start,R),t.block_start=t.strstart,P(t.strm)}function q(t,R){t.pending_buf[t.pending++]=R}function H(t,R){t.pending_buf[t.pending++]=R>>>8&255,t.pending_buf[t.pending++]=255&R}function Z(t,R){var I,b,m=t.max_chain_length,x=t.strstart,N=t.prev_length,U=t.nice_match,C=t.strstart>t.w_size-X?t.strstart-(t.w_size-X):0,$=t.window,G=t.w_mask,W=t.prev,V=t.strstart+L,rt=$[x+N-1],tt=$[x+N];t.prev_length>=t.good_match&&(m>>=2),U>t.lookahead&&(U=t.lookahead);do if($[(I=R)+N]===tt&&$[I+N-1]===rt&&$[I]===$[x]&&$[++I]===$[x+1]){x+=2,I++;do;while($[++x]===$[++I]&&$[++x]===$[++I]&&$[++x]===$[++I]&&$[++x]===$[++I]&&$[++x]===$[++I]&&$[++x]===$[++I]&&$[++x]===$[++I]&&$[++x]===$[++I]&&x<V);if(b=L-(V-x),x=V-L,N<b){if(t.match_start=R,U<=(N=b))break;rt=$[x+N-1],tt=$[x+N]}}while((R=W[R&G])>C&&--m!=0);return N<=t.lookahead?N:t.lookahead}function it(t){var R,I,b,m,x,N,U,C,$,G,W=t.w_size;do{if(m=t.window_size-t.lookahead-t.strstart,t.strstart>=W+(W-X)){for(r.arraySet(t.window,t.window,W,W,0),t.match_start-=W,t.strstart-=W,t.block_start-=W,R=I=t.hash_size;b=t.head[--R],t.head[R]=W<=b?b-W:0,--I;);for(R=I=W;b=t.prev[--R],t.prev[R]=W<=b?b-W:0,--I;);m+=W}if(t.strm.avail_in===0)break;if(N=t.strm,U=t.window,C=t.strstart+t.lookahead,$=m,G=void 0,G=N.avail_in,$<G&&(G=$),I=G===0?0:(N.avail_in-=G,r.arraySet(U,N.input,N.next_in,G,C),N.state.wrap===1?N.adler=o(N.adler,U,G,C):N.state.wrap===2&&(N.adler=f(N.adler,U,G,C)),N.next_in+=G,N.total_in+=G,G),t.lookahead+=I,t.lookahead+t.insert>=S)for(x=t.strstart-t.insert,t.ins_h=t.window[x],t.ins_h=(t.ins_h<<t.hash_shift^t.window[x+1])&t.hash_mask;t.insert&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[x+S-1])&t.hash_mask,t.prev[x&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=x,x++,t.insert--,!(t.lookahead+t.insert<S)););}while(t.lookahead<X&&t.strm.avail_in!==0)}function ot(t,R){for(var I,b;;){if(t.lookahead<X){if(it(t),t.lookahead<X&&R===d)return s;if(t.lookahead===0)break}if(I=0,t.lookahead>=S&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+S-1])&t.hash_mask,I=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),I!==0&&t.strstart-I<=t.w_size-X&&(t.match_length=Z(t,I)),t.match_length>=S)if(b=e._tr_tally(t,t.strstart-t.match_start,t.match_length-S),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=S){for(t.match_length--;t.strstart++,t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+S-1])&t.hash_mask,I=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart,--t.match_length!=0;);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+1])&t.hash_mask;else b=e._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(b&&(z(t,!1),t.strm.avail_out===0))return s}return t.insert=t.strstart<S-1?t.strstart:S-1,R===g?(z(t,!0),t.strm.avail_out===0?Y:j):t.last_lit&&(z(t,!1),t.strm.avail_out===0)?s:O}function Q(t,R){for(var I,b,m;;){if(t.lookahead<X){if(it(t),t.lookahead<X&&R===d)return s;if(t.lookahead===0)break}if(I=0,t.lookahead>=S&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+S-1])&t.hash_mask,I=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=S-1,I!==0&&t.prev_length<t.max_lazy_match&&t.strstart-I<=t.w_size-X&&(t.match_length=Z(t,I),t.match_length<=5&&(t.strategy===1||t.match_length===S&&4096<t.strstart-t.match_start)&&(t.match_length=S-1)),t.prev_length>=S&&t.match_length<=t.prev_length){for(m=t.strstart+t.lookahead-S,b=e._tr_tally(t,t.strstart-1-t.prev_match,t.prev_length-S),t.lookahead-=t.prev_length-1,t.prev_length-=2;++t.strstart<=m&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+S-1])&t.hash_mask,I=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),--t.prev_length!=0;);if(t.match_available=0,t.match_length=S-1,t.strstart++,b&&(z(t,!1),t.strm.avail_out===0))return s}else if(t.match_available){if((b=e._tr_tally(t,0,t.window[t.strstart-1]))&&z(t,!1),t.strstart++,t.lookahead--,t.strm.avail_out===0)return s}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(b=e._tr_tally(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<S-1?t.strstart:S-1,R===g?(z(t,!0),t.strm.avail_out===0?Y:j):t.last_lit&&(z(t,!1),t.strm.avail_out===0)?s:O}function et(t,R,I,b,m){this.good_length=t,this.max_lazy=R,this.nice_length=I,this.max_chain=b,this.func=m}function at(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=_,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new r.Buf16(2*A),this.dyn_dtree=new r.Buf16(2*(2*k+1)),this.bl_tree=new r.Buf16(2*(2*T+1)),K(this.dyn_ltree),K(this.dyn_dtree),K(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new r.Buf16(B+1),this.heap=new r.Buf16(2*E+1),K(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new r.Buf16(2*E+1),K(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function nt(t){var R;return t&&t.state?(t.total_in=t.total_out=0,t.data_type=c,(R=t.state).pending=0,R.pending_out=0,R.wrap<0&&(R.wrap=-R.wrap),R.status=R.wrap?v:F,t.adler=R.wrap===2?0:1,R.last_flush=d,e._tr_init(R),n):J(t,h)}function ut(t){var R=nt(t);return R===n&&function(I){I.window_size=2*I.w_size,K(I.head),I.max_lazy_match=i[I.level].max_lazy,I.good_match=i[I.level].good_length,I.nice_match=i[I.level].nice_length,I.max_chain_length=i[I.level].max_chain,I.strstart=0,I.block_start=0,I.lookahead=0,I.insert=0,I.match_length=I.prev_length=S-1,I.match_available=0,I.ins_h=0}(t.state),R}function ct(t,R,I,b,m,x){if(!t)return h;var N=1;if(R===a&&(R=6),b<0?(N=0,b=-b):15<b&&(N=2,b-=16),m<1||w<m||I!==_||b<8||15<b||R<0||9<R||x<0||u<x)return J(t,h);b===8&&(b=9);var U=new at;return(t.state=U).strm=t,U.wrap=N,U.gzhead=null,U.w_bits=b,U.w_size=1<<U.w_bits,U.w_mask=U.w_size-1,U.hash_bits=m+7,U.hash_size=1<<U.hash_bits,U.hash_mask=U.hash_size-1,U.hash_shift=~~((U.hash_bits+S-1)/S),U.window=new r.Buf8(2*U.w_size),U.head=new r.Buf16(U.hash_size),U.prev=new r.Buf16(U.w_size),U.lit_bufsize=1<<m+6,U.pending_buf_size=4*U.lit_bufsize,U.pending_buf=new r.Buf8(U.pending_buf_size),U.d_buf=1*U.lit_bufsize,U.l_buf=3*U.lit_bufsize,U.level=R,U.strategy=x,U.method=I,ut(t)}i=[new et(0,0,0,0,function(t,R){var I=65535;for(I>t.pending_buf_size-5&&(I=t.pending_buf_size-5);;){if(t.lookahead<=1){if(it(t),t.lookahead===0&&R===d)return s;if(t.lookahead===0)break}t.strstart+=t.lookahead,t.lookahead=0;var b=t.block_start+I;if((t.strstart===0||t.strstart>=b)&&(t.lookahead=t.strstart-b,t.strstart=b,z(t,!1),t.strm.avail_out===0)||t.strstart-t.block_start>=t.w_size-X&&(z(t,!1),t.strm.avail_out===0))return s}return t.insert=0,R===g?(z(t,!0),t.strm.avail_out===0?Y:j):(t.strstart>t.block_start&&(z(t,!1),t.strm.avail_out),s)}),new et(4,4,8,4,ot),new et(4,5,16,8,ot),new et(4,6,32,32,ot),new et(4,4,16,16,Q),new et(8,16,32,32,Q),new et(8,16,128,128,Q),new et(8,32,128,256,Q),new et(32,128,258,1024,Q),new et(32,258,258,4096,Q)],l.deflateInit=function(t,R){return ct(t,R,_,15,8,0)},l.deflateInit2=ct,l.deflateReset=ut,l.deflateResetKeep=nt,l.deflateSetHeader=function(t,R){return t&&t.state?t.state.wrap!==2?h:(t.state.gzhead=R,n):h},l.deflate=function(t,R){var I,b,m,x;if(!t||!t.state||5<R||R<0)return t?J(t,h):h;if(b=t.state,!t.output||!t.input&&t.avail_in!==0||b.status===666&&R!==g)return J(t,t.avail_out===0?-5:h);if(b.strm=t,I=b.last_flush,b.last_flush=R,b.status===v)if(b.wrap===2)t.adler=0,q(b,31),q(b,139),q(b,8),b.gzhead?(q(b,(b.gzhead.text?1:0)+(b.gzhead.hcrc?2:0)+(b.gzhead.extra?4:0)+(b.gzhead.name?8:0)+(b.gzhead.comment?16:0)),q(b,255&b.gzhead.time),q(b,b.gzhead.time>>8&255),q(b,b.gzhead.time>>16&255),q(b,b.gzhead.time>>24&255),q(b,b.level===9?2:2<=b.strategy||b.level<2?4:0),q(b,255&b.gzhead.os),b.gzhead.extra&&b.gzhead.extra.length&&(q(b,255&b.gzhead.extra.length),q(b,b.gzhead.extra.length>>8&255)),b.gzhead.hcrc&&(t.adler=f(t.adler,b.pending_buf,b.pending,0)),b.gzindex=0,b.status=69):(q(b,0),q(b,0),q(b,0),q(b,0),q(b,0),q(b,b.level===9?2:2<=b.strategy||b.level<2?4:0),q(b,3),b.status=F);else{var N=_+(b.w_bits-8<<4)<<8;N|=(2<=b.strategy||b.level<2?0:b.level<6?1:b.level===6?2:3)<<6,b.strstart!==0&&(N|=32),N+=31-N%31,b.status=F,H(b,N),b.strstart!==0&&(H(b,t.adler>>>16),H(b,65535&t.adler)),t.adler=1}if(b.status===69)if(b.gzhead.extra){for(m=b.pending;b.gzindex<(65535&b.gzhead.extra.length)&&(b.pending!==b.pending_buf_size||(b.gzhead.hcrc&&b.pending>m&&(t.adler=f(t.adler,b.pending_buf,b.pending-m,m)),P(t),m=b.pending,b.pending!==b.pending_buf_size));)q(b,255&b.gzhead.extra[b.gzindex]),b.gzindex++;b.gzhead.hcrc&&b.pending>m&&(t.adler=f(t.adler,b.pending_buf,b.pending-m,m)),b.gzindex===b.gzhead.extra.length&&(b.gzindex=0,b.status=73)}else b.status=73;if(b.status===73)if(b.gzhead.name){m=b.pending;do{if(b.pending===b.pending_buf_size&&(b.gzhead.hcrc&&b.pending>m&&(t.adler=f(t.adler,b.pending_buf,b.pending-m,m)),P(t),m=b.pending,b.pending===b.pending_buf_size)){x=1;break}x=b.gzindex<b.gzhead.name.length?255&b.gzhead.name.charCodeAt(b.gzindex++):0,q(b,x)}while(x!==0);b.gzhead.hcrc&&b.pending>m&&(t.adler=f(t.adler,b.pending_buf,b.pending-m,m)),x===0&&(b.gzindex=0,b.status=91)}else b.status=91;if(b.status===91)if(b.gzhead.comment){m=b.pending;do{if(b.pending===b.pending_buf_size&&(b.gzhead.hcrc&&b.pending>m&&(t.adler=f(t.adler,b.pending_buf,b.pending-m,m)),P(t),m=b.pending,b.pending===b.pending_buf_size)){x=1;break}x=b.gzindex<b.gzhead.comment.length?255&b.gzhead.comment.charCodeAt(b.gzindex++):0,q(b,x)}while(x!==0);b.gzhead.hcrc&&b.pending>m&&(t.adler=f(t.adler,b.pending_buf,b.pending-m,m)),x===0&&(b.status=103)}else b.status=103;if(b.status===103&&(b.gzhead.hcrc?(b.pending+2>b.pending_buf_size&&P(t),b.pending+2<=b.pending_buf_size&&(q(b,255&t.adler),q(b,t.adler>>8&255),t.adler=0,b.status=F)):b.status=F),b.pending!==0){if(P(t),t.avail_out===0)return b.last_flush=-1,n}else if(t.avail_in===0&&M(R)<=M(I)&&R!==g)return J(t,-5);if(b.status===666&&t.avail_in!==0)return J(t,-5);if(t.avail_in!==0||b.lookahead!==0||R!==d&&b.status!==666){var U=b.strategy===2?function(C,$){for(var G;;){if(C.lookahead===0&&(it(C),C.lookahead===0)){if($===d)return s;break}if(C.match_length=0,G=e._tr_tally(C,0,C.window[C.strstart]),C.lookahead--,C.strstart++,G&&(z(C,!1),C.strm.avail_out===0))return s}return C.insert=0,$===g?(z(C,!0),C.strm.avail_out===0?Y:j):C.last_lit&&(z(C,!1),C.strm.avail_out===0)?s:O}(b,R):b.strategy===3?function(C,$){for(var G,W,V,rt,tt=C.window;;){if(C.lookahead<=L){if(it(C),C.lookahead<=L&&$===d)return s;if(C.lookahead===0)break}if(C.match_length=0,C.lookahead>=S&&0<C.strstart&&(W=tt[V=C.strstart-1])===tt[++V]&&W===tt[++V]&&W===tt[++V]){rt=C.strstart+L;do;while(W===tt[++V]&&W===tt[++V]&&W===tt[++V]&&W===tt[++V]&&W===tt[++V]&&W===tt[++V]&&W===tt[++V]&&W===tt[++V]&&V<rt);C.match_length=L-(rt-V),C.match_length>C.lookahead&&(C.match_length=C.lookahead)}if(C.match_length>=S?(G=e._tr_tally(C,1,C.match_length-S),C.lookahead-=C.match_length,C.strstart+=C.match_length,C.match_length=0):(G=e._tr_tally(C,0,C.window[C.strstart]),C.lookahead--,C.strstart++),G&&(z(C,!1),C.strm.avail_out===0))return s}return C.insert=0,$===g?(z(C,!0),C.strm.avail_out===0?Y:j):C.last_lit&&(z(C,!1),C.strm.avail_out===0)?s:O}(b,R):i[b.level].func(b,R);if(U!==Y&&U!==j||(b.status=666),U===s||U===Y)return t.avail_out===0&&(b.last_flush=-1),n;if(U===O&&(R===1?e._tr_align(b):R!==5&&(e._tr_stored_block(b,0,0,!1),R===3&&(K(b.head),b.lookahead===0&&(b.strstart=0,b.block_start=0,b.insert=0))),P(t),t.avail_out===0))return b.last_flush=-1,n}return R!==g?n:b.wrap<=0?1:(b.wrap===2?(q(b,255&t.adler),q(b,t.adler>>8&255),q(b,t.adler>>16&255),q(b,t.adler>>24&255),q(b,255&t.total_in),q(b,t.total_in>>8&255),q(b,t.total_in>>16&255),q(b,t.total_in>>24&255)):(H(b,t.adler>>>16),H(b,65535&t.adler)),P(t),0<b.wrap&&(b.wrap=-b.wrap),b.pending!==0?n:1)},l.deflateEnd=function(t){var R;return t&&t.state?(R=t.state.status)!==v&&R!==69&&R!==73&&R!==91&&R!==103&&R!==F&&R!==666?J(t,h):(t.state=null,R===F?J(t,-3):n):h},l.deflateSetDictionary=function(t,R){var I,b,m,x,N,U,C,$,G=R.length;if(!t||!t.state||(x=(I=t.state).wrap)===2||x===1&&I.status!==v||I.lookahead)return h;for(x===1&&(t.adler=o(t.adler,R,G,0)),I.wrap=0,G>=I.w_size&&(x===0&&(K(I.head),I.strstart=0,I.block_start=0,I.insert=0),$=new r.Buf8(I.w_size),r.arraySet($,R,G-I.w_size,I.w_size,0),R=$,G=I.w_size),N=t.avail_in,U=t.next_in,C=t.input,t.avail_in=G,t.next_in=0,t.input=R,it(I);I.lookahead>=S;){for(b=I.strstart,m=I.lookahead-(S-1);I.ins_h=(I.ins_h<<I.hash_shift^I.window[b+S-1])&I.hash_mask,I.prev[b&I.w_mask]=I.head[I.ins_h],I.head[I.ins_h]=b,b++,--m;);I.strstart=b,I.lookahead=S-1,it(I)}return I.strstart+=I.lookahead,I.block_start=I.strstart,I.insert=I.lookahead,I.lookahead=0,I.match_length=I.prev_length=S-1,I.match_available=0,t.next_in=U,t.input=C,t.avail_in=N,I.wrap=x,n},l.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(y,D,l){"use strict";D.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(y,D,l){"use strict";D.exports=function(i,r){var e,o,f,p,d,g,n,h,a,u,c,_,w,E,k,T,A,B,S,L,X,v,F,s,O;e=i.state,o=i.next_in,s=i.input,f=o+(i.avail_in-5),p=i.next_out,O=i.output,d=p-(r-i.avail_out),g=p+(i.avail_out-257),n=e.dmax,h=e.wsize,a=e.whave,u=e.wnext,c=e.window,_=e.hold,w=e.bits,E=e.lencode,k=e.distcode,T=(1<<e.lenbits)-1,A=(1<<e.distbits)-1;t:do{w<15&&(_+=s[o++]<<w,w+=8,_+=s[o++]<<w,w+=8),B=E[_&T];e:for(;;){if(_>>>=S=B>>>24,w-=S,(S=B>>>16&255)===0)O[p++]=65535&B;else{if(!(16&S)){if(!(64&S)){B=E[(65535&B)+(_&(1<<S)-1)];continue e}if(32&S){e.mode=12;break t}i.msg="invalid literal/length code",e.mode=30;break t}L=65535&B,(S&=15)&&(w<S&&(_+=s[o++]<<w,w+=8),L+=_&(1<<S)-1,_>>>=S,w-=S),w<15&&(_+=s[o++]<<w,w+=8,_+=s[o++]<<w,w+=8),B=k[_&A];r:for(;;){if(_>>>=S=B>>>24,w-=S,!(16&(S=B>>>16&255))){if(!(64&S)){B=k[(65535&B)+(_&(1<<S)-1)];continue r}i.msg="invalid distance code",e.mode=30;break t}if(X=65535&B,w<(S&=15)&&(_+=s[o++]<<w,(w+=8)<S&&(_+=s[o++]<<w,w+=8)),n<(X+=_&(1<<S)-1)){i.msg="invalid distance too far back",e.mode=30;break t}if(_>>>=S,w-=S,(S=p-d)<X){if(a<(S=X-S)&&e.sane){i.msg="invalid distance too far back",e.mode=30;break t}if(F=c,(v=0)===u){if(v+=h-S,S<L){for(L-=S;O[p++]=c[v++],--S;);v=p-X,F=O}}else if(u<S){if(v+=h+u-S,(S-=u)<L){for(L-=S;O[p++]=c[v++],--S;);if(v=0,u<L){for(L-=S=u;O[p++]=c[v++],--S;);v=p-X,F=O}}}else if(v+=u-S,S<L){for(L-=S;O[p++]=c[v++],--S;);v=p-X,F=O}for(;2<L;)O[p++]=F[v++],O[p++]=F[v++],O[p++]=F[v++],L-=3;L&&(O[p++]=F[v++],1<L&&(O[p++]=F[v++]))}else{for(v=p-X;O[p++]=O[v++],O[p++]=O[v++],O[p++]=O[v++],2<(L-=3););L&&(O[p++]=O[v++],1<L&&(O[p++]=O[v++]))}break}}break}}while(o<f&&p<g);o-=L=w>>3,_&=(1<<(w-=L<<3))-1,i.next_in=o,i.next_out=p,i.avail_in=o<f?f-o+5:5-(o-f),i.avail_out=p<g?g-p+257:257-(p-g),e.hold=_,e.bits=w}},{}],49:[function(y,D,l){"use strict";var i=y("../utils/common"),r=y("./adler32"),e=y("./crc32"),o=y("./inffast"),f=y("./inftrees"),p=1,d=2,g=0,n=-2,h=1,a=852,u=592;function c(v){return(v>>>24&255)+(v>>>8&65280)+((65280&v)<<8)+((255&v)<<24)}function _(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new i.Buf16(320),this.work=new i.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function w(v){var F;return v&&v.state?(F=v.state,v.total_in=v.total_out=F.total=0,v.msg="",F.wrap&&(v.adler=1&F.wrap),F.mode=h,F.last=0,F.havedict=0,F.dmax=32768,F.head=null,F.hold=0,F.bits=0,F.lencode=F.lendyn=new i.Buf32(a),F.distcode=F.distdyn=new i.Buf32(u),F.sane=1,F.back=-1,g):n}function E(v){var F;return v&&v.state?((F=v.state).wsize=0,F.whave=0,F.wnext=0,w(v)):n}function k(v,F){var s,O;return v&&v.state?(O=v.state,F<0?(s=0,F=-F):(s=1+(F>>4),F<48&&(F&=15)),F&&(F<8||15<F)?n:(O.window!==null&&O.wbits!==F&&(O.window=null),O.wrap=s,O.wbits=F,E(v))):n}function T(v,F){var s,O;return v?(O=new _,(v.state=O).window=null,(s=k(v,F))!==g&&(v.state=null),s):n}var A,B,S=!0;function L(v){if(S){var F;for(A=new i.Buf32(512),B=new i.Buf32(32),F=0;F<144;)v.lens[F++]=8;for(;F<256;)v.lens[F++]=9;for(;F<280;)v.lens[F++]=7;for(;F<288;)v.lens[F++]=8;for(f(p,v.lens,0,288,A,0,v.work,{bits:9}),F=0;F<32;)v.lens[F++]=5;f(d,v.lens,0,32,B,0,v.work,{bits:5}),S=!1}v.lencode=A,v.lenbits=9,v.distcode=B,v.distbits=5}function X(v,F,s,O){var Y,j=v.state;return j.window===null&&(j.wsize=1<<j.wbits,j.wnext=0,j.whave=0,j.window=new i.Buf8(j.wsize)),O>=j.wsize?(i.arraySet(j.window,F,s-j.wsize,j.wsize,0),j.wnext=0,j.whave=j.wsize):(O<(Y=j.wsize-j.wnext)&&(Y=O),i.arraySet(j.window,F,s-O,Y,j.wnext),(O-=Y)?(i.arraySet(j.window,F,s-O,O,0),j.wnext=O,j.whave=j.wsize):(j.wnext+=Y,j.wnext===j.wsize&&(j.wnext=0),j.whave<j.wsize&&(j.whave+=Y))),0}l.inflateReset=E,l.inflateReset2=k,l.inflateResetKeep=w,l.inflateInit=function(v){return T(v,15)},l.inflateInit2=T,l.inflate=function(v,F){var s,O,Y,j,J,M,K,P,z,q,H,Z,it,ot,Q,et,at,nt,ut,ct,t,R,I,b,m=0,x=new i.Buf8(4),N=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!v||!v.state||!v.output||!v.input&&v.avail_in!==0)return n;(s=v.state).mode===12&&(s.mode=13),J=v.next_out,Y=v.output,K=v.avail_out,j=v.next_in,O=v.input,M=v.avail_in,P=s.hold,z=s.bits,q=M,H=K,R=g;t:for(;;)switch(s.mode){case h:if(s.wrap===0){s.mode=13;break}for(;z<16;){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}if(2&s.wrap&&P===35615){x[s.check=0]=255&P,x[1]=P>>>8&255,s.check=e(s.check,x,2,0),z=P=0,s.mode=2;break}if(s.flags=0,s.head&&(s.head.done=!1),!(1&s.wrap)||(((255&P)<<8)+(P>>8))%31){v.msg="incorrect header check",s.mode=30;break}if((15&P)!=8){v.msg="unknown compression method",s.mode=30;break}if(z-=4,t=8+(15&(P>>>=4)),s.wbits===0)s.wbits=t;else if(t>s.wbits){v.msg="invalid window size",s.mode=30;break}s.dmax=1<<t,v.adler=s.check=1,s.mode=512&P?10:12,z=P=0;break;case 2:for(;z<16;){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}if(s.flags=P,(255&s.flags)!=8){v.msg="unknown compression method",s.mode=30;break}if(57344&s.flags){v.msg="unknown header flags set",s.mode=30;break}s.head&&(s.head.text=P>>8&1),512&s.flags&&(x[0]=255&P,x[1]=P>>>8&255,s.check=e(s.check,x,2,0)),z=P=0,s.mode=3;case 3:for(;z<32;){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}s.head&&(s.head.time=P),512&s.flags&&(x[0]=255&P,x[1]=P>>>8&255,x[2]=P>>>16&255,x[3]=P>>>24&255,s.check=e(s.check,x,4,0)),z=P=0,s.mode=4;case 4:for(;z<16;){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}s.head&&(s.head.xflags=255&P,s.head.os=P>>8),512&s.flags&&(x[0]=255&P,x[1]=P>>>8&255,s.check=e(s.check,x,2,0)),z=P=0,s.mode=5;case 5:if(1024&s.flags){for(;z<16;){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}s.length=P,s.head&&(s.head.extra_len=P),512&s.flags&&(x[0]=255&P,x[1]=P>>>8&255,s.check=e(s.check,x,2,0)),z=P=0}else s.head&&(s.head.extra=null);s.mode=6;case 6:if(1024&s.flags&&(M<(Z=s.length)&&(Z=M),Z&&(s.head&&(t=s.head.extra_len-s.length,s.head.extra||(s.head.extra=new Array(s.head.extra_len)),i.arraySet(s.head.extra,O,j,Z,t)),512&s.flags&&(s.check=e(s.check,O,Z,j)),M-=Z,j+=Z,s.length-=Z),s.length))break t;s.length=0,s.mode=7;case 7:if(2048&s.flags){if(M===0)break t;for(Z=0;t=O[j+Z++],s.head&&t&&s.length<65536&&(s.head.name+=String.fromCharCode(t)),t&&Z<M;);if(512&s.flags&&(s.check=e(s.check,O,Z,j)),M-=Z,j+=Z,t)break t}else s.head&&(s.head.name=null);s.length=0,s.mode=8;case 8:if(4096&s.flags){if(M===0)break t;for(Z=0;t=O[j+Z++],s.head&&t&&s.length<65536&&(s.head.comment+=String.fromCharCode(t)),t&&Z<M;);if(512&s.flags&&(s.check=e(s.check,O,Z,j)),M-=Z,j+=Z,t)break t}else s.head&&(s.head.comment=null);s.mode=9;case 9:if(512&s.flags){for(;z<16;){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}if(P!==(65535&s.check)){v.msg="header crc mismatch",s.mode=30;break}z=P=0}s.head&&(s.head.hcrc=s.flags>>9&1,s.head.done=!0),v.adler=s.check=0,s.mode=12;break;case 10:for(;z<32;){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}v.adler=s.check=c(P),z=P=0,s.mode=11;case 11:if(s.havedict===0)return v.next_out=J,v.avail_out=K,v.next_in=j,v.avail_in=M,s.hold=P,s.bits=z,2;v.adler=s.check=1,s.mode=12;case 12:if(F===5||F===6)break t;case 13:if(s.last){P>>>=7&z,z-=7&z,s.mode=27;break}for(;z<3;){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}switch(s.last=1&P,z-=1,3&(P>>>=1)){case 0:s.mode=14;break;case 1:if(L(s),s.mode=20,F!==6)break;P>>>=2,z-=2;break t;case 2:s.mode=17;break;case 3:v.msg="invalid block type",s.mode=30}P>>>=2,z-=2;break;case 14:for(P>>>=7&z,z-=7&z;z<32;){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}if((65535&P)!=(P>>>16^65535)){v.msg="invalid stored block lengths",s.mode=30;break}if(s.length=65535&P,z=P=0,s.mode=15,F===6)break t;case 15:s.mode=16;case 16:if(Z=s.length){if(M<Z&&(Z=M),K<Z&&(Z=K),Z===0)break t;i.arraySet(Y,O,j,Z,J),M-=Z,j+=Z,K-=Z,J+=Z,s.length-=Z;break}s.mode=12;break;case 17:for(;z<14;){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}if(s.nlen=257+(31&P),P>>>=5,z-=5,s.ndist=1+(31&P),P>>>=5,z-=5,s.ncode=4+(15&P),P>>>=4,z-=4,286<s.nlen||30<s.ndist){v.msg="too many length or distance symbols",s.mode=30;break}s.have=0,s.mode=18;case 18:for(;s.have<s.ncode;){for(;z<3;){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}s.lens[N[s.have++]]=7&P,P>>>=3,z-=3}for(;s.have<19;)s.lens[N[s.have++]]=0;if(s.lencode=s.lendyn,s.lenbits=7,I={bits:s.lenbits},R=f(0,s.lens,0,19,s.lencode,0,s.work,I),s.lenbits=I.bits,R){v.msg="invalid code lengths set",s.mode=30;break}s.have=0,s.mode=19;case 19:for(;s.have<s.nlen+s.ndist;){for(;et=(m=s.lencode[P&(1<<s.lenbits)-1])>>>16&255,at=65535&m,!((Q=m>>>24)<=z);){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}if(at<16)P>>>=Q,z-=Q,s.lens[s.have++]=at;else{if(at===16){for(b=Q+2;z<b;){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}if(P>>>=Q,z-=Q,s.have===0){v.msg="invalid bit length repeat",s.mode=30;break}t=s.lens[s.have-1],Z=3+(3&P),P>>>=2,z-=2}else if(at===17){for(b=Q+3;z<b;){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}z-=Q,t=0,Z=3+(7&(P>>>=Q)),P>>>=3,z-=3}else{for(b=Q+7;z<b;){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}z-=Q,t=0,Z=11+(127&(P>>>=Q)),P>>>=7,z-=7}if(s.have+Z>s.nlen+s.ndist){v.msg="invalid bit length repeat",s.mode=30;break}for(;Z--;)s.lens[s.have++]=t}}if(s.mode===30)break;if(s.lens[256]===0){v.msg="invalid code -- missing end-of-block",s.mode=30;break}if(s.lenbits=9,I={bits:s.lenbits},R=f(p,s.lens,0,s.nlen,s.lencode,0,s.work,I),s.lenbits=I.bits,R){v.msg="invalid literal/lengths set",s.mode=30;break}if(s.distbits=6,s.distcode=s.distdyn,I={bits:s.distbits},R=f(d,s.lens,s.nlen,s.ndist,s.distcode,0,s.work,I),s.distbits=I.bits,R){v.msg="invalid distances set",s.mode=30;break}if(s.mode=20,F===6)break t;case 20:s.mode=21;case 21:if(6<=M&&258<=K){v.next_out=J,v.avail_out=K,v.next_in=j,v.avail_in=M,s.hold=P,s.bits=z,o(v,H),J=v.next_out,Y=v.output,K=v.avail_out,j=v.next_in,O=v.input,M=v.avail_in,P=s.hold,z=s.bits,s.mode===12&&(s.back=-1);break}for(s.back=0;et=(m=s.lencode[P&(1<<s.lenbits)-1])>>>16&255,at=65535&m,!((Q=m>>>24)<=z);){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}if(et&&!(240&et)){for(nt=Q,ut=et,ct=at;et=(m=s.lencode[ct+((P&(1<<nt+ut)-1)>>nt)])>>>16&255,at=65535&m,!(nt+(Q=m>>>24)<=z);){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}P>>>=nt,z-=nt,s.back+=nt}if(P>>>=Q,z-=Q,s.back+=Q,s.length=at,et===0){s.mode=26;break}if(32&et){s.back=-1,s.mode=12;break}if(64&et){v.msg="invalid literal/length code",s.mode=30;break}s.extra=15&et,s.mode=22;case 22:if(s.extra){for(b=s.extra;z<b;){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}s.length+=P&(1<<s.extra)-1,P>>>=s.extra,z-=s.extra,s.back+=s.extra}s.was=s.length,s.mode=23;case 23:for(;et=(m=s.distcode[P&(1<<s.distbits)-1])>>>16&255,at=65535&m,!((Q=m>>>24)<=z);){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}if(!(240&et)){for(nt=Q,ut=et,ct=at;et=(m=s.distcode[ct+((P&(1<<nt+ut)-1)>>nt)])>>>16&255,at=65535&m,!(nt+(Q=m>>>24)<=z);){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}P>>>=nt,z-=nt,s.back+=nt}if(P>>>=Q,z-=Q,s.back+=Q,64&et){v.msg="invalid distance code",s.mode=30;break}s.offset=at,s.extra=15&et,s.mode=24;case 24:if(s.extra){for(b=s.extra;z<b;){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}s.offset+=P&(1<<s.extra)-1,P>>>=s.extra,z-=s.extra,s.back+=s.extra}if(s.offset>s.dmax){v.msg="invalid distance too far back",s.mode=30;break}s.mode=25;case 25:if(K===0)break t;if(Z=H-K,s.offset>Z){if((Z=s.offset-Z)>s.whave&&s.sane){v.msg="invalid distance too far back",s.mode=30;break}it=Z>s.wnext?(Z-=s.wnext,s.wsize-Z):s.wnext-Z,Z>s.length&&(Z=s.length),ot=s.window}else ot=Y,it=J-s.offset,Z=s.length;for(K<Z&&(Z=K),K-=Z,s.length-=Z;Y[J++]=ot[it++],--Z;);s.length===0&&(s.mode=21);break;case 26:if(K===0)break t;Y[J++]=s.length,K--,s.mode=21;break;case 27:if(s.wrap){for(;z<32;){if(M===0)break t;M--,P|=O[j++]<<z,z+=8}if(H-=K,v.total_out+=H,s.total+=H,H&&(v.adler=s.check=s.flags?e(s.check,Y,H,J-H):r(s.check,Y,H,J-H)),H=K,(s.flags?P:c(P))!==s.check){v.msg="incorrect data check",s.mode=30;break}z=P=0}s.mode=28;case 28:if(s.wrap&&s.flags){for(;z<32;){if(M===0)break t;M--,P+=O[j++]<<z,z+=8}if(P!==(4294967295&s.total)){v.msg="incorrect length check",s.mode=30;break}z=P=0}s.mode=29;case 29:R=1;break t;case 30:R=-3;break t;case 31:return-4;case 32:default:return n}return v.next_out=J,v.avail_out=K,v.next_in=j,v.avail_in=M,s.hold=P,s.bits=z,(s.wsize||H!==v.avail_out&&s.mode<30&&(s.mode<27||F!==4))&&X(v,v.output,v.next_out,H-v.avail_out)?(s.mode=31,-4):(q-=v.avail_in,H-=v.avail_out,v.total_in+=q,v.total_out+=H,s.total+=H,s.wrap&&H&&(v.adler=s.check=s.flags?e(s.check,Y,H,v.next_out-H):r(s.check,Y,H,v.next_out-H)),v.data_type=s.bits+(s.last?64:0)+(s.mode===12?128:0)+(s.mode===20||s.mode===15?256:0),(q==0&&H===0||F===4)&&R===g&&(R=-5),R)},l.inflateEnd=function(v){if(!v||!v.state)return n;var F=v.state;return F.window&&(F.window=null),v.state=null,g},l.inflateGetHeader=function(v,F){var s;return v&&v.state&&2&(s=v.state).wrap?((s.head=F).done=!1,g):n},l.inflateSetDictionary=function(v,F){var s,O=F.length;return v&&v.state?(s=v.state).wrap!==0&&s.mode!==11?n:s.mode===11&&r(1,F,O,0)!==s.check?-3:X(v,F,O,O)?(s.mode=31,-4):(s.havedict=1,g):n},l.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(y,D,l){"use strict";var i=y("../utils/common"),r=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],e=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],o=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],f=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];D.exports=function(p,d,g,n,h,a,u,c){var _,w,E,k,T,A,B,S,L,X=c.bits,v=0,F=0,s=0,O=0,Y=0,j=0,J=0,M=0,K=0,P=0,z=null,q=0,H=new i.Buf16(16),Z=new i.Buf16(16),it=null,ot=0;for(v=0;v<=15;v++)H[v]=0;for(F=0;F<n;F++)H[d[g+F]]++;for(Y=X,O=15;1<=O&&H[O]===0;O--);if(O<Y&&(Y=O),O===0)return h[a++]=20971520,h[a++]=20971520,c.bits=1,0;for(s=1;s<O&&H[s]===0;s++);for(Y<s&&(Y=s),v=M=1;v<=15;v++)if(M<<=1,(M-=H[v])<0)return-1;if(0<M&&(p===0||O!==1))return-1;for(Z[1]=0,v=1;v<15;v++)Z[v+1]=Z[v]+H[v];for(F=0;F<n;F++)d[g+F]!==0&&(u[Z[d[g+F]]++]=F);if(A=p===0?(z=it=u,19):p===1?(z=r,q-=257,it=e,ot-=257,256):(z=o,it=f,-1),v=s,T=a,J=F=P=0,E=-1,k=(K=1<<(j=Y))-1,p===1&&852<K||p===2&&592<K)return 1;for(;;){for(B=v-J,L=u[F]<A?(S=0,u[F]):u[F]>A?(S=it[ot+u[F]],z[q+u[F]]):(S=96,0),_=1<<v-J,s=w=1<<j;h[T+(P>>J)+(w-=_)]=B<<24|S<<16|L|0,w!==0;);for(_=1<<v-1;P&_;)_>>=1;if(_!==0?(P&=_-1,P+=_):P=0,F++,--H[v]==0){if(v===O)break;v=d[g+u[F]]}if(Y<v&&(P&k)!==E){for(J===0&&(J=Y),T+=s,M=1<<(j=v-J);j+J<O&&!((M-=H[j+J])<=0);)j++,M<<=1;if(K+=1<<j,p===1&&852<K||p===2&&592<K)return 1;h[E=P&k]=Y<<24|j<<16|T-a|0}}return P!==0&&(h[T+P]=v-J<<24|64<<16|0),c.bits=Y,0}},{"../utils/common":41}],51:[function(y,D,l){"use strict";D.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(y,D,l){"use strict";var i=y("../utils/common"),r=0,e=1;function o(m){for(var x=m.length;0<=--x;)m[x]=0}var f=0,p=29,d=256,g=d+1+p,n=30,h=19,a=2*g+1,u=15,c=16,_=7,w=256,E=16,k=17,T=18,A=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],B=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],S=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],L=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],X=new Array(2*(g+2));o(X);var v=new Array(2*n);o(v);var F=new Array(512);o(F);var s=new Array(256);o(s);var O=new Array(p);o(O);var Y,j,J,M=new Array(n);function K(m,x,N,U,C){this.static_tree=m,this.extra_bits=x,this.extra_base=N,this.elems=U,this.max_length=C,this.has_stree=m&&m.length}function P(m,x){this.dyn_tree=m,this.max_code=0,this.stat_desc=x}function z(m){return m<256?F[m]:F[256+(m>>>7)]}function q(m,x){m.pending_buf[m.pending++]=255&x,m.pending_buf[m.pending++]=x>>>8&255}function H(m,x,N){m.bi_valid>c-N?(m.bi_buf|=x<<m.bi_valid&65535,q(m,m.bi_buf),m.bi_buf=x>>c-m.bi_valid,m.bi_valid+=N-c):(m.bi_buf|=x<<m.bi_valid&65535,m.bi_valid+=N)}function Z(m,x,N){H(m,N[2*x],N[2*x+1])}function it(m,x){for(var N=0;N|=1&m,m>>>=1,N<<=1,0<--x;);return N>>>1}function ot(m,x,N){var U,C,$=new Array(u+1),G=0;for(U=1;U<=u;U++)$[U]=G=G+N[U-1]<<1;for(C=0;C<=x;C++){var W=m[2*C+1];W!==0&&(m[2*C]=it($[W]++,W))}}function Q(m){var x;for(x=0;x<g;x++)m.dyn_ltree[2*x]=0;for(x=0;x<n;x++)m.dyn_dtree[2*x]=0;for(x=0;x<h;x++)m.bl_tree[2*x]=0;m.dyn_ltree[2*w]=1,m.opt_len=m.static_len=0,m.last_lit=m.matches=0}function et(m){8<m.bi_valid?q(m,m.bi_buf):0<m.bi_valid&&(m.pending_buf[m.pending++]=m.bi_buf),m.bi_buf=0,m.bi_valid=0}function at(m,x,N,U){var C=2*x,$=2*N;return m[C]<m[$]||m[C]===m[$]&&U[x]<=U[N]}function nt(m,x,N){for(var U=m.heap[N],C=N<<1;C<=m.heap_len&&(C<m.heap_len&&at(x,m.heap[C+1],m.heap[C],m.depth)&&C++,!at(x,U,m.heap[C],m.depth));)m.heap[N]=m.heap[C],N=C,C<<=1;m.heap[N]=U}function ut(m,x,N){var U,C,$,G,W=0;if(m.last_lit!==0)for(;U=m.pending_buf[m.d_buf+2*W]<<8|m.pending_buf[m.d_buf+2*W+1],C=m.pending_buf[m.l_buf+W],W++,U===0?Z(m,C,x):(Z(m,($=s[C])+d+1,x),(G=A[$])!==0&&H(m,C-=O[$],G),Z(m,$=z(--U),N),(G=B[$])!==0&&H(m,U-=M[$],G)),W<m.last_lit;);Z(m,w,x)}function ct(m,x){var N,U,C,$=x.dyn_tree,G=x.stat_desc.static_tree,W=x.stat_desc.has_stree,V=x.stat_desc.elems,rt=-1;for(m.heap_len=0,m.heap_max=a,N=0;N<V;N++)$[2*N]!==0?(m.heap[++m.heap_len]=rt=N,m.depth[N]=0):$[2*N+1]=0;for(;m.heap_len<2;)$[2*(C=m.heap[++m.heap_len]=rt<2?++rt:0)]=1,m.depth[C]=0,m.opt_len--,W&&(m.static_len-=G[2*C+1]);for(x.max_code=rt,N=m.heap_len>>1;1<=N;N--)nt(m,$,N);for(C=V;N=m.heap[1],m.heap[1]=m.heap[m.heap_len--],nt(m,$,1),U=m.heap[1],m.heap[--m.heap_max]=N,m.heap[--m.heap_max]=U,$[2*C]=$[2*N]+$[2*U],m.depth[C]=(m.depth[N]>=m.depth[U]?m.depth[N]:m.depth[U])+1,$[2*N+1]=$[2*U+1]=C,m.heap[1]=C++,nt(m,$,1),2<=m.heap_len;);m.heap[--m.heap_max]=m.heap[1],function(tt,lt){var pt,ft,mt,st,vt,Et,dt=lt.dyn_tree,At=lt.max_code,Bt=lt.stat_desc.static_tree,Dt=lt.stat_desc.has_stree,Ot=lt.stat_desc.extra_bits,zt=lt.stat_desc.extra_base,gt=lt.stat_desc.max_length,yt=0;for(st=0;st<=u;st++)tt.bl_count[st]=0;for(dt[2*tt.heap[tt.heap_max]+1]=0,pt=tt.heap_max+1;pt<a;pt++)gt<(st=dt[2*dt[2*(ft=tt.heap[pt])+1]+1]+1)&&(st=gt,yt++),dt[2*ft+1]=st,At<ft||(tt.bl_count[st]++,vt=0,zt<=ft&&(vt=Ot[ft-zt]),Et=dt[2*ft],tt.opt_len+=Et*(st+vt),Dt&&(tt.static_len+=Et*(Bt[2*ft+1]+vt)));if(yt!==0){do{for(st=gt-1;tt.bl_count[st]===0;)st--;tt.bl_count[st]--,tt.bl_count[st+1]+=2,tt.bl_count[gt]--,yt-=2}while(0<yt);for(st=gt;st!==0;st--)for(ft=tt.bl_count[st];ft!==0;)At<(mt=tt.heap[--pt])||(dt[2*mt+1]!==st&&(tt.opt_len+=(st-dt[2*mt+1])*dt[2*mt],dt[2*mt+1]=st),ft--)}}(m,x),ot($,rt,m.bl_count)}function t(m,x,N){var U,C,$=-1,G=x[1],W=0,V=7,rt=4;for(G===0&&(V=138,rt=3),x[2*(N+1)+1]=65535,U=0;U<=N;U++)C=G,G=x[2*(U+1)+1],++W<V&&C===G||(W<rt?m.bl_tree[2*C]+=W:C!==0?(C!==$&&m.bl_tree[2*C]++,m.bl_tree[2*E]++):W<=10?m.bl_tree[2*k]++:m.bl_tree[2*T]++,$=C,rt=(W=0)===G?(V=138,3):C===G?(V=6,3):(V=7,4))}function R(m,x,N){var U,C,$=-1,G=x[1],W=0,V=7,rt=4;for(G===0&&(V=138,rt=3),U=0;U<=N;U++)if(C=G,G=x[2*(U+1)+1],!(++W<V&&C===G)){if(W<rt)for(;Z(m,C,m.bl_tree),--W!=0;);else C!==0?(C!==$&&(Z(m,C,m.bl_tree),W--),Z(m,E,m.bl_tree),H(m,W-3,2)):W<=10?(Z(m,k,m.bl_tree),H(m,W-3,3)):(Z(m,T,m.bl_tree),H(m,W-11,7));$=C,rt=(W=0)===G?(V=138,3):C===G?(V=6,3):(V=7,4)}}o(M);var I=!1;function b(m,x,N,U){H(m,(f<<1)+(U?1:0),3),function(C,$,G,W){et(C),W&&(q(C,G),q(C,~G)),i.arraySet(C.pending_buf,C.window,$,G,C.pending),C.pending+=G}(m,x,N,!0)}l._tr_init=function(m){I||(function(){var x,N,U,C,$,G=new Array(u+1);for(C=U=0;C<p-1;C++)for(O[C]=U,x=0;x<1<<A[C];x++)s[U++]=C;for(s[U-1]=C,C=$=0;C<16;C++)for(M[C]=$,x=0;x<1<<B[C];x++)F[$++]=C;for($>>=7;C<n;C++)for(M[C]=$<<7,x=0;x<1<<B[C]-7;x++)F[256+$++]=C;for(N=0;N<=u;N++)G[N]=0;for(x=0;x<=143;)X[2*x+1]=8,x++,G[8]++;for(;x<=255;)X[2*x+1]=9,x++,G[9]++;for(;x<=279;)X[2*x+1]=7,x++,G[7]++;for(;x<=287;)X[2*x+1]=8,x++,G[8]++;for(ot(X,g+1,G),x=0;x<n;x++)v[2*x+1]=5,v[2*x]=it(x,5);Y=new K(X,A,d+1,g,u),j=new K(v,B,0,n,u),J=new K(new Array(0),S,0,h,_)}(),I=!0),m.l_desc=new P(m.dyn_ltree,Y),m.d_desc=new P(m.dyn_dtree,j),m.bl_desc=new P(m.bl_tree,J),m.bi_buf=0,m.bi_valid=0,Q(m)},l._tr_stored_block=b,l._tr_flush_block=function(m,x,N,U){var C,$,G=0;0<m.level?(m.strm.data_type===2&&(m.strm.data_type=function(W){var V,rt=4093624447;for(V=0;V<=31;V++,rt>>>=1)if(1&rt&&W.dyn_ltree[2*V]!==0)return r;if(W.dyn_ltree[18]!==0||W.dyn_ltree[20]!==0||W.dyn_ltree[26]!==0)return e;for(V=32;V<d;V++)if(W.dyn_ltree[2*V]!==0)return e;return r}(m)),ct(m,m.l_desc),ct(m,m.d_desc),G=function(W){var V;for(t(W,W.dyn_ltree,W.l_desc.max_code),t(W,W.dyn_dtree,W.d_desc.max_code),ct(W,W.bl_desc),V=h-1;3<=V&&W.bl_tree[2*L[V]+1]===0;V--);return W.opt_len+=3*(V+1)+5+5+4,V}(m),C=m.opt_len+3+7>>>3,($=m.static_len+3+7>>>3)<=C&&(C=$)):C=$=N+5,N+4<=C&&x!==-1?b(m,x,N,U):m.strategy===4||$===C?(H(m,2+(U?1:0),3),ut(m,X,v)):(H(m,4+(U?1:0),3),function(W,V,rt,tt){var lt;for(H(W,V-257,5),H(W,rt-1,5),H(W,tt-4,4),lt=0;lt<tt;lt++)H(W,W.bl_tree[2*L[lt]+1],3);R(W,W.dyn_ltree,V-1),R(W,W.dyn_dtree,rt-1)}(m,m.l_desc.max_code+1,m.d_desc.max_code+1,G+1),ut(m,m.dyn_ltree,m.dyn_dtree)),Q(m),U&&et(m)},l._tr_tally=function(m,x,N){return m.pending_buf[m.d_buf+2*m.last_lit]=x>>>8&255,m.pending_buf[m.d_buf+2*m.last_lit+1]=255&x,m.pending_buf[m.l_buf+m.last_lit]=255&N,m.last_lit++,x===0?m.dyn_ltree[2*N]++:(m.matches++,x--,m.dyn_ltree[2*(s[N]+d+1)]++,m.dyn_dtree[2*z(x)]++),m.last_lit===m.lit_bufsize-1},l._tr_align=function(m){H(m,2,3),Z(m,w,X),function(x){x.bi_valid===16?(q(x,x.bi_buf),x.bi_buf=0,x.bi_valid=0):8<=x.bi_valid&&(x.pending_buf[x.pending++]=255&x.bi_buf,x.bi_buf>>=8,x.bi_valid-=8)}(m)}},{"../utils/common":41}],53:[function(y,D,l){"use strict";D.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(y,D,l){(function(i){(function(r,e){"use strict";if(!r.setImmediate){var o,f,p,d,g=1,n={},h=!1,a=r.document,u=Object.getPrototypeOf&&Object.getPrototypeOf(r);u=u&&u.setTimeout?u:r,o={}.toString.call(r.process)==="[object process]"?function(E){process.nextTick(function(){_(E)})}:function(){if(r.postMessage&&!r.importScripts){var E=!0,k=r.onmessage;return r.onmessage=function(){E=!1},r.postMessage("","*"),r.onmessage=k,E}}()?(d="setImmediate$"+Math.random()+"$",r.addEventListener?r.addEventListener("message",w,!1):r.attachEvent("onmessage",w),function(E){r.postMessage(d+E,"*")}):r.MessageChannel?((p=new MessageChannel).port1.onmessage=function(E){_(E.data)},function(E){p.port2.postMessage(E)}):a&&"onreadystatechange"in a.createElement("script")?(f=a.documentElement,function(E){var k=a.createElement("script");k.onreadystatechange=function(){_(E),k.onreadystatechange=null,f.removeChild(k),k=null},f.appendChild(k)}):function(E){setTimeout(_,0,E)},u.setImmediate=function(E){typeof E!="function"&&(E=new Function(""+E));for(var k=new Array(arguments.length-1),T=0;T<k.length;T++)k[T]=arguments[T+1];var A={callback:E,args:k};return n[g]=A,o(g),g++},u.clearImmediate=c}function c(E){delete n[E]}function _(E){if(h)setTimeout(_,0,E);else{var k=n[E];if(k){h=!0;try{(function(T){var A=T.callback,B=T.args;switch(B.length){case 0:A();break;case 1:A(B[0]);break;case 2:A(B[0],B[1]);break;case 3:A(B[0],B[1],B[2]);break;default:A.apply(e,B)}})(k)}finally{c(E),h=!1}}}}function w(E){E.source===r&&typeof E.data=="string"&&E.data.indexOf(d)===0&&_(+E.data.slice(d.length))}})(typeof self=="undefined"?i===void 0?this:i:self)}).call(this,typeof global!="undefined"?global:typeof self!="undefined"?self:typeof window!="undefined"?window:{})},{}]},{},[10])(10)})});var Xt={};$t(Xt,{default:()=>kt});module.exports=Zt(Xt);var ht=require("obsidian"),Ft=Wt(Tt()),St="ppt-view";var Ht=12192e3,Gt=6858e3,_t=960,bt=540,kt=class extends ht.Plugin{async onload(){this.registerView(St,D=>new Ct(D)),this.registerExtensions(["pptx","ppt"],St)}onunload(){}},Ct=class extends ht.FileView{constructor(l){super(l);this.slides=[];this.currentSlide=0;this.zip=null;this.mediaCache=new Map;this.relationships=new Map;this.slideWidth=Ht;this.slideHeight=Gt;this.resizeObserver=null;this.container=this.contentEl.createDiv({cls:"ppt-viewer-container"})}getViewType(){return St}getDisplayText(){var l;return((l=this.file)==null?void 0:l.basename)||"PPT Viewer"}getIcon(){return"presentation"}async onLoadFile(l){this.container.empty(),this.slides=[],this.currentSlide=0,this.mediaCache.clear(),this.relationships.clear();try{let i=await this.app.vault.readBinary(l);await this.parsePPTX(i),this.renderUI()}catch(i){this.renderError(i)}}async onUnloadFile(){this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.container.empty(),this.slides=[],this.zip=null,this.mediaCache.clear()}async parsePPTX(l){this.zip=await Ft.default.loadAsync(l),console.log("[PPT Viewer] ZIP contents:"),this.zip.forEach(o=>{(o.includes("media")||o.includes("rels")||o.includes("slide"))&&console.log(`  ${o}`)});let i=await this.getFileContent("ppt/presentation.xml");if(!i)throw new Error("Invalid PPTX file: missing presentation.xml");this.parseSlideDimensions(i);let r=await this.getFileContent("ppt/_rels/presentation.xml.rels"),e=this.getSlideFilesFromPresentation(i,r||"");for(let o of e){let f=await this.getFileContent(`ppt/${o}`);if(!f)continue;let d=`ppt/slides/_rels/${o.split("/").pop()}.rels`,g=await this.getFileContent(d);g||(g=await this.getFileContent(`ppt/${o.replace(/([^/]+)$/,"_rels/$1.rels")}`)),g&&this.parseRelationships(o,g);let n=await this.parseSlide(f,o);this.slides.push(n)}if(this.slides.length===0)throw new Error("No slides found in the presentation.")}parseXml(l){return new DOMParser().parseFromString(l,"application/xml")}getElements(l,i){return l.getElementsByTagNameNS("*",i)}getDrawingElements(l,i){let e=l.getElementsByTagNameNS("http://schemas.openxmlformats.org/drawingml/2006/main",i);return e.length===0?l.getElementsByTagNameNS("*",i):e}parseSlideDimensions(l){let i=this.parseXml(l),r=this.getElements(i,"sldSz")[0];if(r){let e=r.getAttribute("cx"),o=r.getAttribute("cy");e&&(this.slideWidth=parseInt(e)),o&&(this.slideHeight=parseInt(o))}}getSlideFilesFromPresentation(l,i){var g;let r=[],e=new Map,o=this.parseXml(i),f=this.getElements(o,"Relationship");for(let n=0;n<f.length;n++){let h=f[n],a=h.getAttribute("Id"),u=h.getAttribute("Target");a&&u&&e.set(a,u)}let p=this.parseXml(l),d=this.getElements(p,"sldId");for(let n=0;n<d.length;n++){let h=d[n].getAttribute("r:id");if(h){let a=e.get(h);a&&r.push(a.replace(/^\//,""))}}if(r.length===0){let n=/^ppt\/slides\/slide(\d+)\.xml$/,h=[];return(g=this.zip)==null||g.forEach(a=>{let u=a.match(n);u&&h.push({name:a.replace("ppt/",""),num:parseInt(u[1])})}),h.sort((a,u)=>a.num-u.num),h.map(a=>a.name)}return r}parseRelationships(l,i){let r=new Map,e=this.parseXml(i),o=this.getElements(e,"Relationship");for(let f=0;f<o.length;f++){let p=o[f],d=p.getAttribute("Id"),g=p.getAttribute("Target");d&&g&&r.set(d,g)}this.relationships.set(l,r),console.log(`[PPT Viewer] Parsed ${r.size} relationships for ${l}`)}async parseSlide(l,i){let r=[],e,o=this.parseXml(l),f=this.getElements(o,"bg")[0];if(f){let d=this.getElements(f,"bgPr")[0];if(d){let g=this.getElements(d,"solidFill")[0];if(g){let n=this.getElements(g,"srgbClr")[0];if(n){let h=n.getAttribute("val");h&&(e=`#${h}`)}}if(!e){let n=this.getElements(d,"blipFill")[0];if(n){let h=this.getElements(n,"blip")[0];if(h){let a=h.getAttribute("r:embed")||h.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships","embed");if(a){let u=this.relationships.get(i);if(u){let c=u.get(a);if(c){let _=this.resolveMediaPath(i,c),w=await this.getImageAsBase64(_);w&&(e=w)}}}}}}if(!e){let n=this.getElements(d,"gradFill")[0];if(n){let h=this.getElements(n,"gs");if(h.length>=2){let a=[];for(let u=0;u<h.length;u++){let c=this.getElements(h[u],"srgbClr")[0];if(c){let _=c.getAttribute("val");_&&a.push(`#${_}`)}}a.length>=2&&(e=`linear-gradient(180deg, ${a.join(", ")})`)}}}}if(!e){let g=this.getElements(f,"bgRef")[0];if(g){let n=this.getElements(g,"srgbClr")[0];if(n){let h=n.getAttribute("val");h&&(e=`#${h}`)}}}if(!e){let g=this.getElements(f,"bgFillStyleRef")[0];if(g){let n=this.getElements(g,"srgbClr")[0];if(n){let h=n.getAttribute("val");h&&h!=="000000"&&(e=`#${h}`)}}}}console.log(`[PPT Viewer] Slide ${i}: bg element exists=${!!f}, background resolved=${!!e}`),e||(e=await this.getLayoutOrMasterBackground(i)),e||(e=await this.getThemeBackground(i));let p=this.getElements(o,"spTree")[0];if(!p)return{elements:r,background:e};for(let d=0;d<p.children.length;d++){let g=p.children[d],n=g.localName;if(n==="sp"){let h=this.parseShapeElement(g);h&&r.push(h)}else if(n==="pic"){let h=await this.parsePictureElement(g,i);h&&r.push(h)}else if(n==="graphicFrame"){let h=await this.parseGraphicFrame(g,i);h&&r.push(h)}else if(n==="grpSp"){let h=await this.parseGroupShape(g,i);r.push(...h)}}return{elements:r,background:e}}hasPlaceholder(l){let i=this.getElements(l,"nvSpPr")[0];if(!i)return!1;let r=this.getElements(i,"nvPr")[0];if(!r)return!1;for(let e=0;e<r.children.length;e++)if(r.children[e].localName==="ph")return!0;return!1}async loadRelsFor(l){if(this.relationships.has(l))return;let i=l.split("/").pop(),e=`ppt/${l.substring(0,l.lastIndexOf("/"))}/_rels/${i}.rels`,o=await this.getFileContent(e);o?this.parseRelationships(l,o):this.relationships.set(l,new Map)}async parseShapeTreeFor(l,i,r){let e=[];for(let o=0;o<i.children.length;o++){let f=i.children[o],p=f.localName;if(p==="sp"){if(r&&this.hasPlaceholder(f))continue;let d=this.parseShapeElement(f);d&&e.push(d)}else if(p==="pic"){let d=await this.parsePictureElement(f,l);d&&e.push(d)}else if(p==="graphicFrame"){let d=await this.parseGraphicFrame(f,l);d&&e.push(d)}else if(p==="grpSp"){let d=await this.parseGroupShape(f,l);e.push(...d)}}return e}async getLayoutShapes(l){let i=this.relationships.get(l);if(!i)return[];let r;for(let[g,n]of i)if(n.includes("slideLayout")){r=this.resolvePathFrom(`ppt/${l}`,n);break}if(!r)return[];let e=r.startsWith("ppt/")?r.substring(4):r;await this.loadRelsFor(e);let o=await this.getFileContent(r);if(!o)return[];let f=this.parseXml(o),p=this.getElements(f,"spTree")[0];if(!p)return[];let d=await this.parseShapeTreeFor(e,p,!0);return console.log("[PPT Viewer] Layout shapes:",e,d.length),d}async getMasterShapes(l){let i=this.relationships.get(l);if(!i)return[];let r;for(let[a,u]of i)if(u.includes("slideLayout")){r=this.resolvePathFrom(`ppt/${l}`,u);break}if(!r)return[];let e=r.startsWith("ppt/")?r.substring(4):r;await this.loadRelsFor(e);let o=this.relationships.get(e);if(!o)return[];let f;for(let[a,u]of o)if(u.includes("slideMaster")){f=this.resolvePathFrom(r,u);break}if(!f)return[];let p=f.startsWith("ppt/")?f.substring(4):f;await this.loadRelsFor(p);let d=await this.getFileContent(f);if(!d)return[];let g=this.parseXml(d),n=this.getElements(g,"spTree")[0];if(!n)return[];let h=await this.parseShapeTreeFor(p,n,!0);return console.log("[PPT Viewer] Master shapes:",p,h.length),h}async parseGraphicFrame(l,i,r){let e=this.parseGraphicFramePosition(l,r);if(!e)return null;let o=this.getElements(l,"tbl")[0];return o?this.parseTableElement(o,e):null}parseGraphicFramePosition(l,i){let r=this.getElements(l,"xfrm")[0];if(!r)return null;let e=this.getElements(r,"off")[0],o=this.getElements(r,"ext")[0];if(!e||!o)return null;let f=parseInt(e.getAttribute("x")||"0")/this.slideWidth*_t,p=parseInt(e.getAttribute("y")||"0")/this.slideHeight*bt,d=parseInt(o.getAttribute("cx")||"0")/this.slideWidth*_t,g=parseInt(o.getAttribute("cy")||"0")/this.slideHeight*bt,n={x:f,y:p,width:d,height:g};return i?this.applyPositionTransform(n,i):n}parseTableElement(l,i){let r=this.getElements(l,"tblGrid")[0],e=r?this.getElements(r,"gridCol"):null,o=this.getElements(l,"tr"),f='<table class="ppt-table">';for(let p=0;p<o.length;p++){f+="<tr>";let d=this.getElements(o[p],"tc");for(let g=0;g<d.length;g++){let n=d[g],h=this.getElements(n,"txBody")[0],a="";h&&(a=this.parseParagraphsFromElement(h).map(B=>B.runs.map(S=>S.text).join("")).join("<br>"));let u=this.getElements(n,"tcPr")[0],c="";if(u){let A=this.getElements(u,"solidFill")[0];if(A){let B=this.getElements(A,"srgbClr")[0];if(B){let S=B.getAttribute("val");S&&(c=`background-color: #${S};`)}}}let _=n.getAttribute("gridSpan"),w=n.getAttribute("rowSpan"),E=n.getAttribute("hMerge"),k=n.getAttribute("vMerge");if(E==="1"||k==="1")continue;let T="";_&&parseInt(_)>1&&(T+=` colspan="${_}"`),w&&parseInt(w)>1&&(T+=` rowspan="${w}"`),c&&(T+=` style="${c}"`),f+=`<td${T}>${a}</td>`}f+="</tr>"}return f+="</table>",{type:"shape",...i,content:f,fillColor:void 0}}parseShapeElement(l,i){let r=this.parsePositionFromElement(l,i);if(!r)return null;let S=this.getElements(l,"txBody")[0],e=S?this.parseParagraphsFromElement(S):[],o,f=!1,p=this.getElements(l,"spPr")[0];if(p){let g=this.getElements(p,"solidFill")[0];if(g){let n=this.getElements(g,"srgbClr")[0];if(n){let h=n.getAttribute("val");h&&(o=`#${h}`)}if(!o){let h=this.getElements(g,"schemeClr")[0];if(h){let a=h.getAttribute("lastClr");a&&(o=`#${a}`)}}f=!0}if(!f){let n=this.getElements(p,"gradFill")[0];if(n){f=!0;let h=this.getElements(n,"gs");if(h.length>0){let a=this.getElements(h[0],"srgbClr")[0];if(a){let u=a.getAttribute("val");u&&(o=`#${u}`)}}}}if(!f){let n=this.getElements(p,"pattFill")[0];if(n){f=!0;let h=this.getElements(n,"fgClr")[0];if(h){let a=this.getElements(h,"srgbClr")[0];if(a){let u=a.getAttribute("val");u&&(o=`#${u}`)}}}}if(f||this.getElements(p,"blipFill")[0]&&(f=!0),!f){let n=this.getDrawingElements(p,"ln")[0];n&&this.getElements(n,"solidFill")[0]&&(f=!0)}}let d=e.some(g=>g.runs.some(n=>n.text.trim().length>0)),m=!1;if(d){let X=S?this.getDrawingElements(S,"bodyPr")[0]:null,Y=e.map(j=>j.runs.map(J=>J.text).join("")).join("").trim();m=(X&&X.getAttribute("wrap")==="none")||(e.length<=1&&Y.length>0&&Y.length<=18)}return!d&&!o&&!f?null:{type:d?"text":"shape",...r,content:e.map(g=>g.runs.map(n=>n.text).join("")).join(`
`),paragraphs:e,fillColor:o,noWrap:m}}async parsePictureElement(l,i,r){let e=this.parsePositionFromElement(l,r);if(!e)return null;let o=this.getElements(l,"blipFill")[0];if(!o)return null;let f=this.getElements(o,"blip")[0];if(!f)return null;let p=f.getAttribute("r:embed")||f.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships","embed");if(!p)return null;let d=this.relationships.get(i);if(console.log(`[PPT Viewer] Looking for image rId=${p}, relMap has ${(d==null?void 0:d.size)||0} entries`),d&&(console.log("[PPT Viewer] Available rIds:",Array.from(d.keys())),console.log(`[PPT Viewer] Target for ${p}:`,d.get(p))),!d)return null;let g=d.get(p);if(!g)return null;let n=this.resolveMediaPath(i,g);console.log(`[PPT Viewer] Resolved image path: ${n}`);let h=await this.getImageAsBase64(n);return h?{type:"image",...e,content:h}:null}async parseGroupShape(l,i,r){let e=this.composeGroupTransforms(r,this.getGroupTransform(l)),o=[];for(let f=0;f<l.children.length;f++){let p=l.children[f],d=p.localName;if(d==="sp"){let g=this.parseShapeElement(p,e);g&&o.push(g)}else if(d==="pic"){let g=await this.parsePictureElement(p,i,e);g&&o.push(g)}else if(d==="graphicFrame"){let g=await this.parseGraphicFrame(p,i,e);g&&o.push(g)}else if(d==="grpSp"){let g=await this.parseGroupShape(p,i,e);o.push(...g)}}return o}getGroupTransform(l){let i=this.getElements(l,"grpSpPr")[0];if(!i)return null;let r=this.getElements(i,"xfrm")[0];if(!r)return null;let e=this.getElements(r,"off")[0],o=this.getElements(r,"ext")[0],f=this.getElements(r,"chOff")[0],p=this.getElements(r,"chExt")[0];if(!e||!o||!f||!p)return null;let d=parseInt(e.getAttribute("x")||"0")/this.slideWidth*_t,g=parseInt(e.getAttribute("y")||"0")/this.slideHeight*bt,n=parseInt(o.getAttribute("cx")||"0")/this.slideWidth*_t,h=parseInt(o.getAttribute("cy")||"0")/this.slideHeight*bt,a=parseInt(f.getAttribute("x")||"0")/this.slideWidth*_t,u=parseInt(f.getAttribute("y")||"0")/this.slideHeight*bt,c=parseInt(p.getAttribute("cx")||"0")/this.slideWidth*_t,_=parseInt(p.getAttribute("cy")||"0")/this.slideHeight*bt;if(!c||!_)return null;return{x:d,y:g,chX:a,chY:u,sx:n/c,sy:h/_}}composeGroupTransforms(l,i){return!l?i:!i?l:{x:l.x+(i.x-l.chX)*l.sx,y:l.y+(i.y-l.chY)*l.sy,chX:i.chX,chY:i.chY,sx:i.sx*l.sx,sy:i.sy*l.sy}}applyPositionTransform(l,i){return{x:i.x+(l.x-i.chX)*i.sx,y:i.y+(l.y-i.chY)*i.sy,width:l.width*i.sx,height:l.height*i.sy}}parsePositionFromElement(l,i){let r=this.getElements(l,"spPr")[0];if(!r)return null;let e=this.getElements(r,"xfrm")[0];if(!e)return null;let o=this.getElements(e,"off")[0],f=this.getElements(e,"ext")[0];if(!o||!f)return null;let p=parseInt(o.getAttribute("x")||"0")/this.slideWidth*_t,d=parseInt(o.getAttribute("y")||"0")/this.slideHeight*bt,g=parseInt(f.getAttribute("cx")||"0")/this.slideWidth*_t,n=parseInt(f.getAttribute("cy")||"0")/this.slideHeight*bt,h={x:p,y:d,width:g,height:n};return i?this.applyPositionTransform(h,i):h}parseParagraphsFromElement(l){let i=[],r=this.getDrawingElements(l,"p");for(let e=0;e<r.length;e++){let o=r[e],f={runs:[]},p=this.getDrawingElements(o,"pPr")[0];if(p){let n=p.getAttribute("algn");n&&(f.alignment=n)}let d=this.getDrawingElements(o,"r");for(let n=0;n<d.length;n++){let h=d[n],a={text:""},u=this.getDrawingElements(h,"t")[0];u&&(a.text=u.textContent||"");let c=this.getDrawingElements(h,"rPr")[0];if(c){c.getAttribute("b")==="1"&&(a.bold=!0),c.getAttribute("i")==="1"&&(a.italic=!0);let _=c.getAttribute("sz");_&&(a.fontSize=parseInt(_)/100);let w=this.getElements(c,"solidFill")[0];if(w){let E=this.getElements(w,"srgbClr")[0];if(E){let k=E.getAttribute("val");k&&(a.color=`#${k}`)}}}a.text&&f.runs.push(a)}let g=this.getDrawingElements(o,"fld");for(let n=0;n<g.length;n++){let h=this.getDrawingElements(g[n],"t")[0];h&&h.textContent&&f.runs.push({text:h.textContent})}i.push(f)}return i}scaleSlide(){let l=this.container.querySelector(".ppt-slide-wrapper"),i=this.container.querySelector("#ppt-slide-display");if(!l||!i)return;let r=l.getBoundingClientRect(),e=r.width-48,o=r.height-48;if(e<=0||o<=0)return;let f=Math.min(e/_t,o/bt);i.style.transform=`scale(${f})`,i.style.transformOrigin="center center"}resolveMediaPath(l,i){return i=i.replace(/\\/g,"/"),i.startsWith("/")?i.substring(1):this.resolvePathFrom(`ppt/${l}`,i)}resolvePathFrom(l,i){if(i=i.replace(/\\/g,"/"),i.startsWith("/"))return i.substring(1);if(!i.startsWith("."))return l.substring(0,l.lastIndexOf("/")+1)+i;let e=l.substring(0,l.lastIndexOf("/")+1).split("/").filter(p=>p.length>0),o=i.split("/"),f=[...e];for(let p of o)p===".."?f.pop():p!=="."&&p.length>0&&f.push(p);return f.join("/")}async getThemeBackground(l){let i=this.relationships.get(l);if(!i)return;let r;for(let[E,k]of i)if(k.includes("slideLayout")){r=this.resolvePathFrom(`ppt/${l}`,k);break}if(!r)return;let e=r.replace(/([^/]+)$/,"_rels/$1.rels"),o=await this.getFileContent(e);if(!o)return;let f=this.parseXml(o),p=this.getElements(f,"Relationship"),d;for(let E=0;E<p.length;E++){let k=p[E].getAttribute("Target");if(k&&k.includes("slideMaster")){d=this.resolvePathFrom(r,k);break}}if(!d)return;let g=d.replace(/([^/]+)$/,"_rels/$1.rels"),n=await this.getFileContent(g);if(!n)return;let h=this.parseXml(n),a=this.getElements(h,"Relationship"),u;for(let E=0;E<a.length;E++){let k=a[E].getAttribute("Target"),T=a[E].getAttribute("Type");if(T&&T.includes("theme")){u=this.resolvePathFrom(d,k||"");break}}if(!u)return;let c=await this.getFileContent(u);if(!c)return;let _=this.parseXml(c),w=this.getElements(_,"fmtScheme")[0];if(w){let E=this.getElements(w,"bgFillStyleLst")[0];if(E){let k=E.children;if(k.length>0){let T=k[k.length-1],A=this.getElements(T,"srgbClr")[0];if(A){let S=A.getAttribute("val");if(S)return`#${S}`}let B=this.getElements(T,"gs");if(B.length>=2){let S=[];for(let L=0;L<B.length;L++){let X=this.getElements(B[L],"srgbClr")[0];if(X){let v=X.getAttribute("val");v&&S.push(`#${v}`)}}if(S.length>=2)return`linear-gradient(180deg, ${S.join(", ")})`}}}}}async getLayoutOrMasterBackground(l){let i=this.relationships.get(l);if(!i){console.log(`[PPT Viewer] getLayoutOrMasterBackground: no relMap for ${l}`);return}let r;for(let[g,n]of i)if(n.includes("slideLayout")){r=this.resolvePathFrom(`ppt/${l}`,n);break}if(console.log(`[PPT Viewer] getLayoutOrMasterBackground: layoutPath=${r}`),!r)return;let e=await this.getFileContent(r);if(!e){console.log(`[PPT Viewer] getLayoutOrMasterBackground: could not read layout XML at ${r}`);return}let o=this.parseXml(e),f=this.getElements(o,"bg")[0];if(console.log(`[PPT Viewer] getLayoutOrMasterBackground: layout bg element exists=${!!f}`),f){let g=this.getElements(f,"bgPr")[0];if(g){let h=this.getElements(g,"solidFill")[0];if(h){let c=this.getElements(h,"srgbClr")[0];if(c){let _=c.getAttribute("val");if(_)return`#${_}`}}let a=this.getElements(g,"blipFill")[0];if(a){let c=this.getElements(a,"blip")[0];if(c){let _=c.getAttribute("r:embed")||c.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships","embed");if(console.log(`[PPT Viewer] getLayoutOrMasterBackground: layout blipFill rId=${_}`),_){let w=r.replace(/([^/]+)$/,"_rels/$1.rels");console.log(`[PPT Viewer] getLayoutOrMasterBackground: layoutRelsPath=${w}`);let E=await this.getFileContent(w);if(E){let k=this.parseXml(E),T=this.getElements(k,"Relationship");for(let A=0;A<T.length;A++)if(T[A].getAttribute("Id")===_){let B=T[A].getAttribute("Target");if(B){let S=this.resolvePathFrom(r,B);console.log(`[PPT Viewer] getLayoutOrMasterBackground: resolved layout image path=${S} (from target=${B})`);let L=await this.getImageAsBase64(S);if(L)return L}}}}}}let u=this.getElements(g,"gradFill")[0];if(u){let c=this.getElements(u,"gs");if(c.length>=2){let _=[];for(let w=0;w<c.length;w++){let E=this.getElements(c[w],"srgbClr")[0];if(E){let k=E.getAttribute("val");k&&_.push(`#${k}`)}}if(_.length>=2)return`linear-gradient(180deg, ${_.join(", ")})`}}}f.querySelector;let n=this.getElements(f,"bgRef")[0];if(n){let h=this.getElements(n,"srgbClr")[0];if(h){let a=h.getAttribute("val");if(a)return`#${a}`}}}let p=r.replace(/([^/]+)$/,"_rels/$1.rels"),d=await this.getFileContent(p);if(d){let g=this.parseXml(d),n=this.getElements(g,"Relationship");for(let h=0;h<n.length;h++){let a=n[h].getAttribute("Target");if(a&&a.includes("slideMaster")){let u=this.resolvePathFrom(r,a);console.log(`[PPT Viewer] getLayoutOrMasterBackground: masterPath=${u}`);let c=await this.getFileContent(u);if(c){let _=this.parseXml(c),w=this.getElements(_,"bg")[0];if(console.log(`[PPT Viewer] getLayoutOrMasterBackground: master bg element exists=${!!w}`),w){let E=this.getElements(w,"bgPr")[0];if(E){let T=this.getElements(E,"solidFill")[0];if(T){let S=this.getElements(T,"srgbClr")[0];if(S){let L=S.getAttribute("val");if(L)return`#${L}`}}let A=this.getElements(E,"blipFill")[0];if(A){let S=this.getElements(A,"blip")[0];if(S){let L=S.getAttribute("r:embed")||S.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships","embed");if(L){let X=u.replace(/([^/]+)$/,"_rels/$1.rels"),v=await this.getFileContent(X);if(v){let F=this.parseXml(v),s=this.getElements(F,"Relationship");for(let O=0;O<s.length;O++)if(s[O].getAttribute("Id")===L){let Y=s[O].getAttribute("Target");if(Y){let j=this.resolvePathFrom(u,Y);console.log(`[PPT Viewer] getLayoutOrMasterBackground: resolved master image path=${j} (from target=${Y})`);let J=await this.getImageAsBase64(j);if(J)return J}}}}}}let B=this.getElements(E,"gradFill")[0];if(B){let S=this.getElements(B,"gs");if(S.length>=2){let L=[];for(let X=0;X<S.length;X++){let v=this.getElements(S[X],"srgbClr")[0];if(v){let F=v.getAttribute("val");F&&L.push(`#${F}`)}}if(L.length>=2)return`linear-gradient(180deg, ${L.join(", ")})`}}}let k=this.getElements(w,"bgRef")[0];if(k){let T=this.getElements(k,"srgbClr")[0];if(T){let A=T.getAttribute("val");if(A)return`#${A}`}}}}}}}}getZipFile(l){if(!this.zip)return null;let i=this.zip.file(l);if(i)return i;let r=l.toLowerCase(),e=null;return this.zip.forEach((o,f)=>{!e&&o.toLowerCase()===r&&(e=f)}),e}async getImageAsBase64(l){var e,o;if(this.mediaCache.has(l))return this.mediaCache.get(l)||null;if(!this.zip)return null;let i=l.replace(/\\/g,"/").replace(/^\//,""),r=this.getZipFile(i);if(!r&&i!==l&&(r=this.getZipFile(l)),!r){let f=i.split("/").pop();f&&(r=this.getZipFile(`ppt/media/${f}`))}if(!r){let f=(e=i.split("/").pop())==null?void 0:e.toLowerCase();f&&this.zip&&this.zip.forEach((p,d)=>{!r&&p.toLowerCase().endsWith("/"+f)&&(r=d)})}if(!r)return console.log(`[PPT Viewer] Image not found in ZIP: ${l} (normalized: ${i})`),null;try{let f=await r.async("base64"),p=((o=l.split(".").pop())==null?void 0:o.toLowerCase())||"png",n=`data:${{png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",svg:"image/svg+xml",emf:"image/x-emf",wmf:"image/x-wmf",tiff:"image/tiff",tif:"image/tiff",bmp:"image/bmp"}[p]||"image/png"};base64,${f}`;return this.mediaCache.set(l,n),n}catch(f){return null}}async getFileContent(l){if(!this.zip)return null;let i=this.getZipFile(l);if(!i)return null;try{return await i.async("string")}catch(r){return null}}renderUI(){this.container.empty(),this.container.addClass("ppt-viewer-root");let l=this.container.createDiv({cls:"ppt-layout"}),i=l.createDiv({cls:"ppt-sidebar"});this.renderThumbnails(i);let r=l.createDiv({cls:"ppt-sidebar-toggle"});r.innerHTML="\u25C0",r.addEventListener("click",()=>{let u=l.hasClass("ppt-sidebar-collapsed");l.toggleClass("ppt-sidebar-collapsed",!u),r.innerHTML=u?"\u25C0":"\u25B6",setTimeout(()=>this.scaleSlide(),350)});let e=l.createDiv({cls:"ppt-main"}),o=e.createDiv({cls:"ppt-slide-wrapper"});o.createDiv({cls:"ppt-slide-container"}).setAttribute("id","ppt-slide-display"),this.resizeObserver=new ResizeObserver(()=>{this.scaleSlide()}),this.resizeObserver.observe(o);let p=e.createDiv({cls:"ppt-navigation"}),d=p.createEl("button",{text:"\u25C0 Previous",cls:"ppt-nav-btn"}),g=p.createSpan({cls:"ppt-slide-counter"}),n=p.createEl("button",{text:"Next \u25B6",cls:"ppt-nav-btn"});p.createEl("button",{text:"Open External \u2197",cls:"ppt-nav-btn ppt-open-external-btn"}).addEventListener("click",()=>this.openWithDefaultApp()),p.createEl("button",{text:"Convert PDF \u{1F4C4}",cls:"ppt-nav-btn ppt-convert-pdf-btn"}).addEventListener("click",()=>this.convertToPDF()),d.addEventListener("click",()=>this.goToSlide(this.currentSlide-1)),n.addEventListener("click",()=>this.goToSlide(this.currentSlide+1)),this.containerEl.tabIndex=0,this.containerEl.addEventListener("keydown",u=>{u.key==="ArrowLeft"||u.key==="ArrowUp"?(u.preventDefault(),this.goToSlide(this.currentSlide-1)):(u.key==="ArrowRight"||u.key==="ArrowDown"||u.key===" ")&&(u.preventDefault(),this.goToSlide(this.currentSlide+1))}),this.renderSlide(),this.updateCounter(g)}renderThumbnails(l){l.createDiv({cls:"ppt-sidebar-title"}).setText("Slides");let r=l.createDiv({cls:"ppt-thumb-list"});this.slides.forEach((e,o)=>{let f=r.createDiv({cls:`ppt-thumb ${o===this.currentSlide?"ppt-thumb-active":""}`});f.createSpan({cls:"ppt-thumb-number"}).setText(`${o+1}`),f.addEventListener("click",()=>this.goToSlide(o))})}renderSlide(){let l=this.container.querySelector("#ppt-slide-display");if(!l)return;l.empty();let i=this.slides[this.currentSlide];if(!i)return;i.background?i.background.startsWith("data:")?(l.style.backgroundImage=`url(${i.background})`,l.style.backgroundSize="cover",l.style.backgroundPosition="center",l.style.backgroundColor=""):i.background.startsWith("linear-gradient")?(l.style.background=i.background,l.style.backgroundImage=""):(l.style.backgroundColor=i.background,l.style.backgroundImage=""):(l.style.backgroundColor="",l.style.backgroundImage="",l.style.background="");for(let o of i.elements)this.renderElement(l,o);this.container.querySelectorAll(".ppt-thumb").forEach((o,f)=>{o.toggleClass("ppt-thumb-active",f===this.currentSlide)});let e=this.container.querySelector(".ppt-thumb-active");e&&e.scrollIntoView({block:"nearest",behavior:"smooth"})}renderElement(l,i){let r=l.createDiv({cls:`ppt-element ppt-element-${i.type}`});i.noWrap&&r.addClass("ppt-text-nowrap");switch(r.style.left=`${i.x}px`,r.style.top=`${i.y}px`,r.style.width=`${i.width}px`,i.type!=="text"&&(r.style.height=`${i.height}px`),i.fillColor&&(r.style.backgroundColor=i.fillColor),i.type){case"text":this.renderTextElement(r,i);break;case"image":this.renderImageElement(r,i);break;case"shape":i.content&&i.content.startsWith("<table")?r.innerHTML=i.content:i.fillColor&&(r.style.borderRadius="2px");break}}renderTextElement(l,i){if(i.paragraphs)for(let r of i.paragraphs){let e=l.createEl("p",{cls:"ppt-paragraph"});if(r.alignment){let o={l:"left",ctr:"center",r:"right",just:"justify"};e.style.textAlign=o[r.alignment]||"left"}for(let o of r.runs){let f=e.createEl("span");f.textContent=o.text,o.bold&&(f.style.fontWeight="bold"),o.italic&&(f.style.fontStyle="italic"),o.fontSize&&(f.style.fontSize=`${o.fontSize*.95}pt`),o.color&&(f.style.color=o.color)}}}renderImageElement(l,i){let r=l.createEl("img",{cls:"ppt-image"});r.src=i.content,r.style.width="100%",r.style.height="100%",r.style.objectFit="contain"}goToSlide(l){if(l<0||l>=this.slides.length)return;this.currentSlide=l,this.renderSlide();let i=this.container.querySelector(".ppt-slide-counter");i&&this.updateCounter(i)}updateCounter(l){l.setText(`Slide ${this.currentSlide+1} of ${this.slides.length}`)}openWithDefaultApp(){var i;if(!this.file)return;let l=this.app.vault.adapter;if(l.open)l.open(this.file.path);else try{let{exec:r}=require("child_process"),o=`${l.basePath||((i=l.getBasePath)==null?void 0:i.call(l))}/${this.file.path}`;process.platform==="darwin"?r(`open "${o}"`):process.platform==="win32"?r(`start "" "${o}"`):r(`xdg-open "${o}"`)}catch(r){new ht.Notice("Unable to open file with default application")}}async convertToPDF(){var d;if(!this.file)return;let l=this.app.vault.adapter,i=l.basePath||((d=l.getBasePath)==null?void 0:d.call(l));if(!i){new ht.Notice("Cannot determine vault path");return}let r=`${i}/${this.file.path}`,e=r.substring(0,r.lastIndexOf("/")),o=r.replace(/\.(pptx?|ppt)$/i,".pdf"),f=this.file.basename+".pdf",p=this.container.createDiv({cls:"ppt-convert-status"});p.setText("Converting to PDF... Please wait."),p.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#333;color:#fff;padding:16px 32px;border-radius:8px;z-index:9999;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.3);";try{let{exec:g}=require("child_process"),{promisify:n}=require("util"),h=n(g),{existsSync:a,writeFileSync:u,unlinkSync:c}=require("fs"),_=require("path"),w=require("os"),E=!1,k=_.join(w.tmpdir(),`ppt_convert_${Date.now()}.zip`),T=require("fs").readFileSync(r);if(require("fs").writeFileSync(k,T),!E){let A=["/Applications/LibreOffice.app/Contents/MacOS/soffice","/usr/local/bin/soffice","/opt/homebrew/bin/soffice"],B="";for(let S of A)if(a(S)){B=S;break}if(B)try{let S=_.dirname(o);await h(`"${B}" --headless --convert-to pdf --outdir "${S}" "${k}"`,{timeout:12e4});let L=_.join(S,_.basename(k,".zip")+".pdf");a(L)&&(require("fs").renameSync(L,o),E=!0)}catch(S){console.log("LibreOffice conversion failed, trying fallback:",S.message)}}if(!E)try{let A=_.join(w.tmpdir(),"ppt_to_pdf.py");u(A,`
import subprocess
import sys
import os

# Ensure required packages
def install_if_missing(import_name, pip_name=None):
    try:
        __import__(import_name)
    except ImportError:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', pip_name or import_name, '-q'])

install_if_missing('pptx', 'python-pptx')
install_if_missing('PIL', 'Pillow')
install_if_missing('reportlab')

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from reportlab.lib.pagesizes import landscape, A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from PIL import Image
import io
import tempfile
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register CJK fonts from macOS system
import platform
cjk_font_registered = False
cjk_font_name = 'Helvetica'
cjk_font_bold_name = 'Helvetica-Bold'

if platform.system() == 'Darwin':
    font_paths = [
        ('/System/Library/Fonts/PingFang.ttc', 'PingFang SC'),
        ('/System/Library/Fonts/STHeiti Medium.ttc', 'STHeiti'),
        ('/Library/Fonts/Arial Unicode.ttf', 'ArialUnicode'),
        ('/System/Library/Fonts/Hiragino Sans GB.ttc', 'HiraginoSansGB'),
    ]
    for font_path, font_name in font_paths:
        if os.path.exists(font_path):
            try:
                pdfmetrics.registerFont(TTFont(font_name, font_path, subfontIndex=0))
                cjk_font_name = font_name
                cjk_font_bold_name = font_name
                cjk_font_registered = True
                break
            except Exception:
                continue

if not cjk_font_registered:
    try:
        from reportlab.pdfbase.cidfonts import UnicodeCIDFont
        pdfmetrics.registerFont(UnicodeCIDFont('STSong-Light'))
        cjk_font_name = 'STSong-Light'
        cjk_font_bold_name = 'STSong-Light'
        cjk_font_registered = True
    except Exception:
        pass

input_file = sys.argv[1]
output_file = sys.argv[2]

prs = Presentation(input_file)
slide_width = prs.slide_width
slide_height = prs.slide_height

# Convert EMU to points (1 inch = 914400 EMU = 72 points)
page_width = slide_width / 914400 * 72
page_height = slide_height / 914400 * 72

c = canvas.Canvas(output_file, pagesize=(page_width, page_height))

for slide_num, slide in enumerate(prs.slides):
    if slide_num > 0:
        c.showPage()

    # Draw background
    try:
        if slide.background and slide.background.fill:
            fill = slide.background.fill
            if fill.type is not None:
                if hasattr(fill, 'fore_color') and fill.fore_color and fill.fore_color.type is not None:
                    color = fill.fore_color.rgb
                    if color:
                        hex_color = str(color)
                        r = int(hex_color[0:2], 16) / 255
                        g = int(hex_color[2:4], 16) / 255
                        b = int(hex_color[4:6], 16) / 255
                        c.setFillColorRGB(r, g, b)
                        c.rect(0, 0, page_width, page_height, fill=1, stroke=0)
    except Exception:
        pass

    for shape in slide.shapes:
        # Convert position from EMU to points
        left = shape.left / 914400 * 72 if shape.left else 0
        top = shape.top / 914400 * 72 if shape.top else 0
        width = shape.width / 914400 * 72 if shape.width else 0
        height = shape.height / 914400 * 72 if shape.height else 0

        # Flip Y coordinate (PDF origin is bottom-left)
        y = page_height - top - height

        if shape.has_text_frame:
            tf = shape.text_frame
            text_y = page_height - top
            for para in tf.paragraphs:
                text = para.text
                if not text.strip():
                    text_y -= 14
                    continue

                # Get font properties
                font_size = 12
                font_bold = False
                if para.runs:
                    run = para.runs[0]
                    if run.font.size:
                        font_size = run.font.size.pt
                    font_bold = run.font.bold

                try:
                    c.setFont(cjk_font_bold_name if font_bold else cjk_font_name, min(font_size, 48))
                except Exception:
                    c.setFont("Helvetica-Bold" if font_bold else "Helvetica", min(font_size, 48))

                # Set color
                try:
                    if para.runs and para.runs[0].font.color and para.runs[0].font.color.rgb:
                        hex_color = str(para.runs[0].font.color.rgb)
                        r_c = int(hex_color[0:2], 16) / 255
                        g_c = int(hex_color[2:4], 16) / 255
                        b_c = int(hex_color[4:6], 16) / 255
                        c.setFillColorRGB(r_c, g_c, b_c)
                    else:
                        c.setFillColorRGB(0, 0, 0)
                except Exception:
                    c.setFillColorRGB(0, 0, 0)

                text_y -= font_size * 1.2
                try:
                    c.drawString(left + 2, text_y, text)
                except Exception:
                    pass

        elif shape.shape_type == 13:  # Picture
            try:
                image_stream = io.BytesIO(shape.image.blob)
                img = Image.open(image_stream)

                # Save to temp file for reportlab
                tmp_img = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
                if img.mode in ('RGBA', 'P'):
                    img = img.convert('RGB')
                img.save(tmp_img.name)
                tmp_img.close()

                c.drawImage(tmp_img.name, left, y, width, height, preserveAspectRatio=True)
                os.unlink(tmp_img.name)
            except Exception:
                pass

c.save()
print("SUCCESS")
`);let S=await h(`python3 "${A}" "${k}" "${o}"`,{timeout:12e4});try{c(A)}catch(L){}try{c(k)}catch(L){}S.stdout&&S.stdout.includes("SUCCESS")&&a(o)?E=!0:console.log("[PPT Viewer] Python PDF conversion output:",S.stdout,S.stderr)}catch(A){console.log("[PPT Viewer] Python PDF conversion failed:",A.message,A.stderr||"")}try{c(k)}catch(A){}if(p.remove(),!E){new ht.Notice("PDF conversion failed. Install LibreOffice: brew install --cask libreoffice");return}new ht.Notice(`Converted successfully: ${f}`),setTimeout(()=>{var B,S;let A=this.file.path.replace(/\.(pptx?|ppt)$/i,".pdf");(S=(B=this.app.vault.adapter)==null?void 0:B.reconcileInternalFile)==null||S.call(B,A)},1e3)}catch(g){p.remove(),new ht.Notice(`Conversion failed: ${g.message||"Unknown error"}`),console.log("[PPT Viewer] PDF conversion error:",g)}}renderError(l){this.container.empty();let i=this.container.createDiv({cls:"ppt-error"});i.createEl("h3",{text:"Error loading presentation"}),i.createEl("p",{text:l.message}),i.createEl("p",{text:"This file may be corrupted or use an unsupported format.",cls:"ppt-error-hint"}),new ht.Notice(`PPT Viewer: ${l.message}`)}};
// Accurate cached preview layer
const pptViewerOriginalOnLoadFile=Ct.prototype.onLoadFile;
Ct.prototype.onLoadFile=async function(l){this.container.empty(),this.slides=[],this.currentSlide=0,this.mediaCache.clear(),this.relationships.clear();try{let i=await this.renderAccuratePreview(l);if(i){this.renderAccuratePreviewUI(i);return}}catch(i){console.log("[PPT Viewer] Accurate preview unavailable, falling back to HTML renderer:",i&&i.message?i.message:i)}return pptViewerOriginalOnLoadFile.call(this,l)};
Ct.prototype.getVaultBasePath=function(){var i,r;let l=this.app&&this.app.vault&&this.app.vault.adapter;return(l==null?void 0:l.basePath)||((r=(i=l)==null?void 0:i.getBasePath)==null?void 0:r.call(i))||null};
Ct.prototype.getSourceFilePath=function(l){let i=this.getVaultBasePath();if(!i)throw new Error("Cannot determine vault path");let r=require("path");return r.join(i,l.path)};
Ct.prototype.getPreviewCachePath=function(l){let i=require("fs"),r=require("path"),e=require("os"),o=require("crypto"),f=i.statSync(l),p=o.createHash("sha1").update(JSON.stringify({path:l,size:f.size,mtimeMs:f.mtimeMs})).digest("hex").slice(0,24),d=r.join(e.tmpdir(),"obsidian-ppt-viewer-cache",p),g=r.basename(l,r.extname(l))+".pdf";return{dir:d,pdfPath:r.join(d,g)}};
Ct.prototype.getLibreOfficeCandidates=function(){return["/Applications/LibreOffice.app/Contents/MacOS/soffice","/usr/local/bin/soffice","/opt/homebrew/bin/soffice","soffice","libreoffice"]};
Ct.prototype.renderAccuratePreview=async function(l){if(typeof require!="function")return null;let i=require("fs"),r=require("path"),{execFile:e}=require("child_process"),{promisify:o}=require("util"),f=o(e),p=this.getSourceFilePath(l),d=this.getPreviewCachePath(p);if(i.existsSync(d.pdfPath))return d.pdfPath;i.mkdirSync(d.dir,{recursive:!0});let g=null,n=this.getLibreOfficeCandidates();for(let h of n)try{await f(h,["--headless","--convert-to","pdf","--outdir",d.dir,p],{timeout:12e4});if(i.existsSync(d.pdfPath))return d.pdfPath;let a=i.readdirSync(d.dir).filter(u=>u.toLowerCase().endsWith(".pdf"));if(a.length>0){let u=r.join(d.dir,a[0]);u!==d.pdfPath&&i.renameSync(u,d.pdfPath);return d.pdfPath}}catch(a){g=a}throw g||new Error("LibreOffice conversion failed")};
Ct.prototype.renderAccuratePreviewUI=function(l){let i=require("url"),r=this.container.empty(),e=this.container.createDiv({cls:"ppt-viewer-root ppt-accurate-root"}),o=e.createDiv({cls:"ppt-accurate-toolbar"});o.createSpan({cls:"ppt-accurate-status"}).setText("Accurate preview");o.createEl("button",{text:"HTML Fallback",cls:"ppt-nav-btn"}).addEventListener("click",()=>{this.file&&pptViewerOriginalOnLoadFile.call(this,this.file)}),o.createEl("button",{text:"Open External \u2197",cls:"ppt-nav-btn"}).addEventListener("click",()=>this.openWithDefaultApp()),o.createEl("button",{text:"Convert PDF \u{1F4C4}",cls:"ppt-nav-btn"}).addEventListener("click",()=>this.convertToPDF());let f=e.createEl("iframe",{cls:"ppt-accurate-frame"});f.src=i.pathToFileURL(l).href,f.setAttribute("title","PowerPoint preview"),f.setAttribute("sandbox","allow-same-origin allow-scripts allow-forms")};
// End accurate cached preview layer
// Accurate preview image-page layer
Ct.prototype.getPdftoppmCandidates=function(){return["/opt/homebrew/bin/pdftoppm","/usr/local/bin/pdftoppm","pdftoppm"]};
Ct.prototype.renderPdfPreviewPages=async function(l){let i=require("fs"),r=require("path"),{execFile:e}=require("child_process"),{promisify:o}=require("util"),f=o(e),p=r.dirname(l),d=r.join(p,"pages"),g=r.join(d,"slide");i.mkdirSync(d,{recursive:!0});let n=i.existsSync(d)?i.readdirSync(d).filter(h=>/^slide-\d+\.png$/i.test(h)).sort((h,a)=>h.localeCompare(a,void 0,{numeric:!0})).map(h=>r.join(d,h)):[];if(n.length>0)return n;let h=null;for(let a of this.getPdftoppmCandidates())try{await f(a,["-png","-r","150",l,g],{timeout:12e4});n=i.readdirSync(d).filter(u=>/^slide-\d+\.png$/i.test(u)).sort((u,c)=>u.localeCompare(c,void 0,{numeric:!0})).map(u=>r.join(d,u));if(n.length>0)return n}catch(u){h=u}throw h||new Error("pdftoppm failed")};
Ct.prototype.renderAccuratePreviewUI=function(l){let i=require("url"),r=this.container.empty(),e=this.container.createDiv({cls:"ppt-viewer-root ppt-accurate-root"}),o=e.createDiv({cls:"ppt-accurate-toolbar"});o.createSpan({cls:"ppt-accurate-status"}).setText("Accurate preview");o.createEl("button",{text:"HTML Fallback",cls:"ppt-nav-btn"}).addEventListener("click",()=>{this.file&&pptViewerOriginalOnLoadFile.call(this,this.file)}),o.createEl("button",{text:"Open External \u2197",cls:"ppt-nav-btn"}).addEventListener("click",()=>this.openWithDefaultApp()),o.createEl("button",{text:"Convert PDF \u{1F4C4}",cls:"ppt-nav-btn"}).addEventListener("click",()=>this.convertToPDF());let f=e.createDiv({cls:"ppt-accurate-pages"});f.setText("Rendering preview...");this.renderPdfPreviewPages(l).then(p=>{f.empty();for(let d of p){let g=f.createEl("img",{cls:"ppt-accurate-page-img"});g.src="data:image/png;base64,"+require("fs").readFileSync(d).toString("base64"),g.setAttribute("loading","lazy")}}).catch(p=>{console.log("[PPT Viewer] PDF image preview failed, using PDF embed fallback:",p&&p.message?p.message:p),f.empty(),f.createEl("p",{text:"PDF preview could not be rendered as images. Try Open External, or use HTML Fallback.",cls:"ppt-accurate-hint"});let d=f.createEl("embed",{cls:"ppt-accurate-frame"});d.setAttribute("type","application/pdf"),d.setAttribute("src",i.pathToFileURL(l).href)})};
// End accurate preview image-page layer
// Accurate preview fast-first-page layer
Ct.prototype.getCachedPdfPreviewPages=function(l){let i=require("fs"),r=require("path"),e=r.join(r.dirname(l),"pages");return i.existsSync(e)?i.readdirSync(e).filter(o=>/^slide-\d+\.png$/i.test(o)).sort((o,f)=>o.localeCompare(f,void 0,{numeric:!0})).map(o=>r.join(e,o)):[]};
Ct.prototype.appendAccuratePreviewPage=function(l,i,r){let e=l.createEl("img",{cls:"ppt-accurate-page-img"});e.src="data:image/png;base64,"+require("fs").readFileSync(i).toString("base64"),e.setAttribute("loading","lazy"),e.setAttribute("data-preview-path",i),r&&e.setAttribute("data-preview-page",r)};
Ct.prototype.runPdftoppm=function(l,i){let{execFile:r}=require("child_process"),{promisify:e}=require("util"),o=e(r),f=null,p=this.getPdftoppmCandidates();return p.reduce((d,g)=>d.catch(()=>o(g,i,{timeout:12e4}).catch(n=>{f=n;throw n})),Promise.reject()).catch(()=>{throw f||new Error("pdftoppm failed")})};
Ct.prototype.renderFirstPdfPreviewPage=async function(l){let i=require("fs"),r=require("path"),e=this.getCachedPdfPreviewPages(l);if(e.length>0)return e[0];let o=r.join(r.dirname(l),"pages"),f=r.join(o,"slide-1");i.mkdirSync(o,{recursive:!0});await this.runPdftoppm(l,["-png","-f","1","-l","1","-singlefile","-r","120",l,f]);let p=f+".png";if(i.existsSync(p))return p;throw new Error("first page render failed")};
Ct.prototype.renderPdfPreviewPages=async function(l){let i=require("fs"),r=require("path"),e=r.join(r.dirname(l),"pages"),o=r.join(e,"slide");i.mkdirSync(e,{recursive:!0});await this.runPdftoppm(l,["-png","-r","120",l,o]);let f=this.getCachedPdfPreviewPages(l);if(f.length>0)return f;throw new Error("pdftoppm produced no pages")};
Ct.prototype.renderRemainingPdfPreviewPages=async function(l){let i=this.getCachedPdfPreviewPages(l);return i.length>1?i:await this.renderPdfPreviewPages(l)};
Ct.prototype.renderAccuratePreviewUI=function(l){let i=this.container.empty(),r=this.container.createDiv({cls:"ppt-viewer-root ppt-accurate-root"}),e=r.createDiv({cls:"ppt-accurate-toolbar"}),o=e.createSpan({cls:"ppt-accurate-status"});o.setText("Accurate preview");e.createEl("button",{text:"HTML Fallback",cls:"ppt-nav-btn"}).addEventListener("click",()=>{this.file&&pptViewerOriginalOnLoadFile.call(this,this.file)}),e.createEl("button",{text:"Open External \u2197",cls:"ppt-nav-btn"}).addEventListener("click",()=>this.openWithDefaultApp()),e.createEl("button",{text:"Convert PDF \u{1F4C4}",cls:"ppt-nav-btn"}).addEventListener("click",()=>this.convertToPDF());let f=r.createDiv({cls:"ppt-accurate-pages"});f.setText("Rendering first page...");this.renderFirstPdfPreviewPage(l).then(p=>{f.empty(),this.appendAccuratePreviewPage(f,p,"1"),o.setText("Accurate preview - rendering remaining pages"),this.renderRemainingPdfPreviewPages(l).then(d=>{let g=new Set(Array.from(f.querySelectorAll("img")).map(n=>n.getAttribute("data-preview-path")));for(let n of d)g.has(n)||(this.appendAccuratePreviewPage(f,n),g.add(n));o.setText("Accurate preview")}).catch(d=>{console.log("[PPT Viewer] Remaining page render failed:",d&&d.message?d.message:d),o.setText("Accurate preview - first page ready")})}).catch(p=>{console.log("[PPT Viewer] Fast image preview failed, using HTML renderer:",p&&p.message?p.message:p),this.file&&pptViewerOriginalOnLoadFile.call(this,this.file)})};
// End accurate preview fast-first-page layer
// Accurate preview navigation and page-dedupe fix layer
Ct.prototype.getPdfPreviewPageNumber=function(l){let i=require("path").basename(l).match(/^slide-(\d+)\.png$/i);return i?parseInt(i[1],10):null};
Ct.prototype.getCachedPdfPreviewPages=function(l){let i=require("fs"),r=require("path"),e=r.join(r.dirname(l),"pages");if(!i.existsSync(e))return[];let o=new Map;for(let p of i.readdirSync(e)){if(!/^slide-\d+\.png$/i.test(p))continue;let d=p.match(/^slide-(\d+)\.png$/i),g=parseInt(d[1],10),n=r.join(e,p),h=o.get(g);(!h||d[1].length>((r.basename(h).match(/^slide-(\d+)\.png$/i)||["",""])[1].length))&&o.set(g,n)}return Array.from(o.entries()).sort((p,d)=>p[0]-d[0]).map(p=>p[1])};
Ct.prototype.renderFirstPdfPreviewPage=async function(l){let i=require("fs"),r=require("path"),e=r.join(r.dirname(l),"pages"),o=r.join(e,"slide-01.png"),f=this.getCachedPdfPreviewPages(l).find(p=>this.getPdfPreviewPageNumber(p)===1);if(f){if(f!==o&&!i.existsSync(o))try{i.copyFileSync(f,o),f=o}catch(p){}return i.existsSync(o)?o:f}i.mkdirSync(e,{recursive:!0});await this.runPdftoppm(l,["-png","-f","1","-l","1","-singlefile","-r","120",l,r.join(e,"slide-01")]);if(i.existsSync(o))return o;throw new Error("first page render failed")};
Ct.prototype.appendAccuratePreviewPage=function(l,i,r){let e=this.getPdfPreviewPageNumber(i),o=l.createEl("img",{cls:"ppt-accurate-page-img"});o.src="data:image/png;base64,"+require("fs").readFileSync(i).toString("base64"),o.setAttribute("loading","lazy"),o.setAttribute("data-preview-path",i),o.setAttribute("data-preview-page",String(r||e||""))};
Ct.prototype.renderAccuratePreviewUI=function(l){let i=this.container.empty(),r=this.container.createDiv({cls:"ppt-viewer-root ppt-accurate-root"}),e=r.createDiv({cls:"ppt-accurate-toolbar"}),o=e.createSpan({cls:"ppt-accurate-status"});o.setText("Accurate preview");e.createEl("button",{text:"HTML Fallback",cls:"ppt-nav-btn"}).addEventListener("click",()=>{this.file&&pptViewerOriginalOnLoadFile.call(this,this.file)}),e.createEl("button",{text:"Open External \u2197",cls:"ppt-nav-btn"}).addEventListener("click",()=>this.openWithDefaultApp()),e.createEl("button",{text:"Convert PDF \u{1F4C4}",cls:"ppt-nav-btn"}).addEventListener("click",()=>this.convertToPDF());let f=r.createDiv({cls:"ppt-accurate-pages"});f.setText("Rendering first page...");this.renderFirstPdfPreviewPage(l).then(p=>{f.empty(),this.appendAccuratePreviewPage(f,p,"1"),o.setText("Accurate preview - rendering remaining pages"),this.renderRemainingPdfPreviewPages(l).then(d=>{let g=new Set(Array.from(f.querySelectorAll("img")).map(n=>n.getAttribute("data-preview-page")).filter(Boolean));for(let n of d){let h=String(this.getPdfPreviewPageNumber(n)||"");g.has(h)||(this.appendAccuratePreviewPage(f,n,h),h&&g.add(h))}o.setText("Accurate preview")}).catch(d=>{console.log("[PPT Viewer] Remaining page render failed:",d&&d.message?d.message:d),o.setText("Accurate preview - first page ready")})}).catch(p=>{console.log("[PPT Viewer] Fast image preview failed, using HTML renderer:",p&&p.message?p.message:p),this.file&&pptViewerOriginalOnLoadFile.call(this,this.file)})};
const pptViewerOriginalRenderUI=Ct.prototype.renderUI;
Ct.prototype.renderAccurateFromCurrentFile=async function(){if(!this.file)return;this.container.empty();let l=this.container.createDiv({cls:"ppt-viewer-root ppt-accurate-root"});l.createDiv({cls:"ppt-accurate-loading"}).setText("Rendering accurate preview...");try{let i=await this.renderAccuratePreview(this.file);if(!i)throw new Error("accurate preview returned no PDF");this.renderAccuratePreviewUI(i)}catch(i){console.log("[PPT Viewer] Accurate preview unavailable from HTML mode:",i&&i.message?i.message:i),new ht.Notice("Accurate preview unavailable; staying in HTML fallback"),pptViewerOriginalRenderUI.call(this),this.addAccuratePreviewButton&&this.addAccuratePreviewButton()}};
Ct.prototype.addAccuratePreviewButton=function(){let l=this.container.querySelector(".ppt-navigation");if(!l||l.querySelector(".ppt-accurate-preview-btn"))return;let i=l.querySelector(".ppt-open-external-btn"),r=l.createEl("button",{text:"Accurate Preview",cls:"ppt-nav-btn ppt-accurate-preview-btn"});r.addEventListener("click",()=>this.renderAccurateFromCurrentFile()),i?l.insertBefore(r,i):l.appendChild(r)};
Ct.prototype.renderUI=function(){pptViewerOriginalRenderUI.call(this),this.addAccuratePreviewButton()};
// End accurate preview navigation and page-dedupe fix layer
// Preview chrome controls layer
Ct.prototype.getPreviewFullscreenTarget=function(){return this.container.querySelector(".ppt-accurate-root")||this.container.querySelector(".ppt-layout")||this.container};
Ct.prototype.getFullscreenSlideIndex=function(l){let i=l&&l.querySelector(".ppt-accurate-pages");if(!i)return Math.max(0,this.currentSlide||0);let r=Array.from(i.querySelectorAll(".ppt-accurate-page-img"));if(!r.length)return 0;let e=i.scrollTop,o=0,f=Infinity;for(let p=0;p<r.length;p++){let d=Math.abs(r[p].offsetTop-e);d<f&&(f=d,o=p)}return o};
Ct.prototype.goToFullscreenSlide=function(l){let i=this.getPreviewFullscreenTarget(),r=i&&i.querySelector(".ppt-accurate-pages"),e=r?Array.from(r.querySelectorAll(".ppt-accurate-page-img")):[];if(r&&e.length){let o=Math.max(0,Math.min(l,e.length-1));this.fullscreenSlideIndex=o,r.scrollTo({top:e[o].offsetTop,behavior:"smooth"});return}if(this.slides&&this.slides.length){let o=Math.max(0,Math.min(l,this.slides.length-1));this.goToSlide(o),this.fullscreenSlideIndex=o}};
Ct.prototype.handleFullscreenKeydown=function(l){if(!document.fullscreenElement||!this.getPreviewFullscreenTarget().contains(document.fullscreenElement)&&document.fullscreenElement!==this.getPreviewFullscreenTarget())return;let i=["ArrowRight","ArrowDown","PageDown"," ","Enter"],r=["ArrowLeft","ArrowUp","PageUp","Backspace"];if(!i.includes(l.key)&&!r.includes(l.key))return;l.preventDefault(),l.stopPropagation&&l.stopPropagation();let e=typeof this.fullscreenSlideIndex=="number"?this.fullscreenSlideIndex:this.getFullscreenSlideIndex(this.getPreviewFullscreenTarget());this.goToFullscreenSlide(e+(i.includes(l.key)?1:-1))};
Ct.prototype.bindPreviewFullscreenKeys=function(){this.pptFullscreenKeyHandler||(this.pptFullscreenKeyHandler=l=>this.handleFullscreenKeydown(l),document.addEventListener("keydown",this.pptFullscreenKeyHandler,!0))};
Ct.prototype.togglePreviewFullscreen=function(){let l=this.getPreviewFullscreenTarget();if(!l||!l.requestFullscreen)return;if(document.fullscreenElement){document.exitFullscreen&&document.exitFullscreen();return}this.fullscreenSlideIndex=this.getFullscreenSlideIndex(l),this.bindPreviewFullscreenKeys(),l.requestFullscreen().then(()=>{this.goToFullscreenSlide(this.fullscreenSlideIndex||0)}).catch(i=>{console.log("[PPT Viewer] Fullscreen failed:",i&&i.message?i.message:i)})};
Ct.prototype.syncPreviewViewport=function(l){requestAnimationFrame(()=>{let i=l&&l.querySelector(".ppt-accurate-pages");i&&i.scrollTop<80&&(i.scrollTop=0),this.scaleSlide&&this.scaleSlide()})};
Ct.prototype.togglePreviewToolbar=function(l){let i=this.getPreviewFullscreenTarget(),r=i&&i.querySelector(".ppt-toolbar-restore-btn"),e=i&&i.querySelector(".ppt-accurate-toolbar, .ppt-navigation");if(!i)return;let o=typeof l=="boolean"?l:!i.hasClass("ppt-toolbar-collapsed");i.toggleClass("ppt-toolbar-collapsed",o),r&&(r.style.display=o?"flex":"none"),e&&e.setAttribute("aria-hidden",o?"true":"false"),this.syncPreviewViewport(i)};
Ct.prototype.addPreviewChromeControls=function(l,i){if(!l||!i)return;l.addClass("ppt-preview-chrome-root");if(!i.querySelector(".ppt-collapse-toolbar-btn")){let r=i.createEl("button",{text:"Hide Toolbar",cls:"ppt-nav-btn ppt-collapse-toolbar-btn"});r.addEventListener("click",()=>this.togglePreviewToolbar(!0))}if(!i.querySelector(".ppt-fullscreen-btn")){let r=i.createEl("button",{text:"Fullscreen",cls:"ppt-nav-btn ppt-fullscreen-btn"});r.addEventListener("click",()=>this.togglePreviewFullscreen())}if(!l.querySelector(".ppt-toolbar-restore-btn")){let r=l.createEl("button",{text:"^",cls:"ppt-toolbar-restore-btn"});r.setAttribute("title","Show toolbar"),r.setAttribute("aria-label","Show toolbar"),r.style.display="none",r.addEventListener("click",()=>this.togglePreviewToolbar(!1))}};
Ct.prototype.renderAccuratePreviewUI=function(l){let i=this.container.empty(),r=this.container.createDiv({cls:"ppt-viewer-root ppt-accurate-root"}),e=r.createDiv({cls:"ppt-accurate-toolbar"}),o=e.createSpan({cls:"ppt-accurate-status"});o.setText("Accurate preview"),this.addPreviewChromeControls(r,e),e.createEl("button",{text:"HTML Fallback",cls:"ppt-nav-btn"}).addEventListener("click",()=>{this.file&&pptViewerOriginalOnLoadFile.call(this,this.file)}),e.createEl("button",{text:"Open External \u2197",cls:"ppt-nav-btn"}).addEventListener("click",()=>this.openWithDefaultApp()),e.createEl("button",{text:"Convert PDF \u{1F4C4}",cls:"ppt-nav-btn"}).addEventListener("click",()=>this.convertToPDF());let f=r.createDiv({cls:"ppt-accurate-pages"});f.setText("Rendering first page...");this.renderFirstPdfPreviewPage(l).then(p=>{f.empty(),this.appendAccuratePreviewPage(f,p,"1"),o.setText("Accurate preview - rendering remaining pages"),this.renderRemainingPdfPreviewPages(l).then(d=>{let g=new Set(Array.from(f.querySelectorAll("img")).map(n=>n.getAttribute("data-preview-page")).filter(Boolean));for(let n of d){let h=String(this.getPdfPreviewPageNumber(n)||"");g.has(h)||(this.appendAccuratePreviewPage(f,n,h),h&&g.add(h))}o.setText("Accurate preview")}).catch(d=>{console.log("[PPT Viewer] Remaining page render failed:",d&&d.message?d.message:d),o.setText("Accurate preview - first page ready")})}).catch(p=>{console.log("[PPT Viewer] Fast image preview failed, using HTML renderer:",p&&p.message?p.message:p),this.file&&pptViewerOriginalOnLoadFile.call(this,this.file)})};
Ct.prototype.appendAccuratePreviewPage=function(l,i,r){let e=this.getPdfPreviewPageNumber(i),o=l.createEl("img",{cls:"ppt-accurate-page-img"});o.src="data:image/png;base64,"+require("fs").readFileSync(i).toString("base64"),o.setAttribute("loading","eager"),o.setAttribute("decoding","async"),o.setAttribute("data-preview-path",i),o.setAttribute("data-preview-page",String(r||e||""))};
Ct.prototype.addAccuratePreviewButton=function(){let l=this.container.querySelector(".ppt-navigation"),i=this.container.querySelector(".ppt-layout");if(!l)return;i&&this.addPreviewChromeControls(i,l);if(l.querySelector(".ppt-accurate-preview-btn"))return;let r=l.querySelector(".ppt-open-external-btn"),e=l.createEl("button",{text:"Accurate Preview",cls:"ppt-nav-btn ppt-accurate-preview-btn"});e.addEventListener("click",()=>this.renderAccurateFromCurrentFile()),r?l.insertBefore(e,r):l.appendChild(e)};
// End preview chrome controls layer
/*! Bundled license information:

jszip/dist/jszip.min.js:
  (*!
  
  JSZip v3.10.1 - A JavaScript class for generating and reading zip files
  <http://stuartk.com/jszip>
  
  (c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
  Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.
  
  JSZip uses the library pako released under the MIT license :
  https://github.com/nodeca/pako/blob/main/LICENSE
  *)
*/

// New PPT Reviewer 1.1.0: review-focused reliability and performance layer.
// This layer intentionally sits after the bundled viewer so it can be maintained
// independently without altering the original ppt-viewer plugin.
St="ppt-viewer-view";
const newPptReviewerOriginalOnLoadFile=Ct.prototype.onLoadFile;
const newPptReviewerOriginalOnUnloadFile=Ct.prototype.onUnloadFile;
const newPptReviewerOriginalRenderAccurateFromCurrentFile=Ct.prototype.renderAccurateFromCurrentFile;
const newPptReviewerOriginalRenderAccuratePreviewUI=Ct.prototype.renderAccuratePreviewUI;

Ct.prototype.onUnloadFile=async function(){
  if(this.pptFullscreenKeyHandler){
    document.removeEventListener("keydown",this.pptFullscreenKeyHandler,!0);
    this.pptFullscreenKeyHandler=null;
  }
  return newPptReviewerOriginalOnUnloadFile.call(this);
};

Ct.prototype.appendAccuratePreviewPage=function(container,filePath,pageNumber){
  const fs=require("fs"),{pathToFileURL}=require("url");
  const detectedPage=this.getPdfPreviewPageNumber(filePath);
  const page=String(pageNumber||detectedPage||"");
  const image=container.createEl("img",{cls:"ppt-accurate-page-img"});
  image.src=pathToFileURL(filePath).href;
  image.alt=page?`Slide ${page}`:"PowerPoint slide";
  image.setAttribute("loading","lazy");
  image.setAttribute("decoding","async");
  image.setAttribute("data-preview-path",filePath);
  image.setAttribute("data-preview-page",page);
  image.addEventListener("error",()=>{
    if(image.dataset.pptReviewerFallbackApplied)return;
    image.dataset.pptReviewerFallbackApplied="true";
    try{image.src="data:image/png;base64,"+fs.readFileSync(filePath).toString("base64");}
    catch(error){
      image.addClass("ppt-reviewer-page-error");
      image.alt="Slide preview failed to load";
      console.warn("[New PPT Reviewer] Unable to load preview page:",error);
    }
  });
  return image;
};

Ct.prototype.renderAccurateFromCurrentFile=async function(){
  if(this.pptReviewerRendering){
    new ht.Notice("Preview is already rendering…");
    return;
  }
  this.pptReviewerRendering=true;
  try{return await newPptReviewerOriginalRenderAccurateFromCurrentFile.call(this);}
  finally{this.pptReviewerRendering=false;}
};

Ct.prototype.clearCurrentPreviewCache=function(){
  if(!this.file)return;
  try{
    const fs=require("fs"),sourcePath=this.getSourceFilePath(this.file),cache=this.getPreviewCachePath(sourcePath);
    fs.rmSync(cache.dir,{recursive:true,force:true});
  }catch(error){console.warn("[New PPT Reviewer] Could not clear preview cache:",error);}
};

Ct.prototype.renderAccuratePreviewUI=function(pdfPath){
  newPptReviewerOriginalRenderAccuratePreviewUI.call(this,pdfPath);
  const toolbar=this.container.querySelector(".ppt-accurate-toolbar");
  const status=toolbar&&toolbar.querySelector(".ppt-accurate-status");
  if(status)status.setAttribute("aria-live","polite");
  if(toolbar&&!toolbar.querySelector(".ppt-reviewer-refresh-btn")){
    const refresh=toolbar.createEl("button",{text:"Refresh Preview",cls:"ppt-nav-btn ppt-reviewer-refresh-btn"});
    refresh.setAttribute("title","Clear generated preview files and render again");
    refresh.addEventListener("click",()=>{
      this.clearCurrentPreviewCache();
      this.renderAccurateFromCurrentFile();
    });
  }
};

Ct.prototype.onLoadFile=async function(file){
  if(String(file.extension||"").toLowerCase()!=="ppt")return newPptReviewerOriginalOnLoadFile.call(this,file);
  this.file=file;
  this.container.empty();
  const loading=this.container.createDiv({cls:"ppt-viewer-root ppt-accurate-root"});
  loading.createDiv({cls:"ppt-accurate-loading",text:"Converting legacy .ppt for preview…"});
  try{
    const pdfPath=await this.renderAccuratePreview(file);
    if(!pdfPath)throw new Error("No PDF preview was created");
    this.renderAccuratePreviewUI(pdfPath);
  }catch(error){
    console.warn("[New PPT Reviewer] Legacy PPT conversion failed:",error);
    this.renderError(error);
  }
};

// New PPT Reviewer 1.2.0: polished review surface and fidelity-first loading.
const newPptReviewerLegacyHtmlLoader=pptViewerOriginalOnLoadFile;

Ct.prototype.renderReviewerLoading=function(file){
  this.container.empty();
  const root=this.container.createDiv({cls:"ppt-reviewer-root ppt-reviewer-loading-root"});
  const panel=root.createDiv({cls:"ppt-reviewer-loading-panel"});
  panel.createDiv({cls:"ppt-reviewer-loading-mark",text:"P"});
  const copy=panel.createDiv();
  copy.createDiv({cls:"ppt-reviewer-loading-title",text:"正在生成高保真预览"});
  copy.createDiv({cls:"ppt-reviewer-loading-copy",text:`${file.basename} · 首次打开会稍等片刻`});
};

Ct.prototype.onLoadFile=async function(file){
  const extension=String(file.extension||"").toLowerCase();
  this.file=file;
  if(extension==="ppt"){
    this.renderReviewerLoading(file);
    try{
      const pdfPath=await this.renderAccuratePreview(file);
      if(!pdfPath)throw new Error("No PDF preview was created");
      this.renderAccuratePreviewUI(pdfPath);
    }catch(error){
      console.warn("[New PPT Reviewer] Legacy PPT conversion failed:",error);
      this.renderError(error);
    }
    return;
  }
  this.renderReviewerLoading(file);
  this.slides=[];
  this.currentSlide=0;
  this.mediaCache.clear();
  this.relationships.clear();
  try{
    const pdfPath=await this.renderAccuratePreview(file);
    if(pdfPath){
      this.renderAccuratePreviewUI(pdfPath);
      return;
    }
  }catch(error){
    console.warn("[New PPT Reviewer] Accurate preview unavailable, using HTML fallback:",error);
  }
  return newPptReviewerLegacyHtmlLoader.call(this,file);
};

Ct.prototype.getReviewerCurrentPage=function(pages){
  const images=Array.from(pages.querySelectorAll(".ppt-accurate-page-img"));
  if(!images.length)return 0;
  const target=pages.scrollTop+Math.max(36,pages.clientHeight*.22);
  let closest=0,distance=Infinity;
  images.forEach((image,index)=>{
    const delta=Math.abs(image.offsetTop-target);
    if(delta<distance){distance=delta;closest=index;}
  });
  return closest+1;
};

Ct.prototype.renderAccuratePreviewUI=function(pdfPath){
  this.container.empty();
  const root=this.container.createDiv({cls:"ppt-reviewer-root ppt-accurate-root ppt-preview-chrome-root"});
  const header=root.createDiv({cls:"ppt-reviewer-header"});
  const identity=header.createDiv({cls:"ppt-reviewer-identity"});
  identity.createDiv({cls:"ppt-reviewer-mark",text:"P"});
  const titleBlock=identity.createDiv({cls:"ppt-reviewer-title-block"});
  titleBlock.createDiv({cls:"ppt-reviewer-eyebrow",text:"PPT REVIEWER"});
  titleBlock.createDiv({cls:"ppt-reviewer-title",text:(this.file&&this.file.basename)||"PowerPoint"});
  const actions=header.createDiv({cls:"ppt-reviewer-actions"});
  const createAction=(text,className,onClick,title)=>{
    const button=actions.createEl("button",{text,cls:`ppt-reviewer-btn ${className||""}`});
    if(title)button.setAttribute("title",title);
    button.addEventListener("click",onClick);
    return button;
  };
  createAction("HTML 模式","ppt-reviewer-btn-quiet",()=>{this.file&&newPptReviewerLegacyHtmlLoader.call(this,this.file);},"在高保真模式不可用时使用");
  createAction("刷新","ppt-reviewer-btn-quiet",()=>{this.clearCurrentPreviewCache();this.renderAccurateFromCurrentFile();},"重新生成预览");
  createAction("全屏","ppt-reviewer-btn-quiet",()=>this.togglePreviewFullscreen(),"全屏审阅");
  createAction("外部打开 ↗","ppt-reviewer-btn-primary",()=>this.openWithDefaultApp(),"使用默认 PowerPoint 应用打开");

  const context=root.createDiv({cls:"ppt-reviewer-context"});
  const status=context.createDiv({cls:"ppt-reviewer-status",text:"高保真渲染 · 正在加载第 1 页"});
  status.setAttribute("aria-live","polite");
  const counter=context.createDiv({cls:"ppt-reviewer-counter",text:"1 / —"});
  const pages=root.createDiv({cls:"ppt-accurate-pages ppt-reviewer-pages"});
  pages.setText("正在准备第一页…");

  const syncCounter=()=>{
    const total=pages.querySelectorAll(".ppt-accurate-page-img").length;
    const current=this.getReviewerCurrentPage(pages);
    if(total&&current){counter.setText(`${current} / ${total}`);status.setText(`高保真渲染 · 第 ${current} 页，共 ${total} 页`);}
  };
  let scrollFrame=0;
  pages.addEventListener("scroll",()=>{
    if(scrollFrame)return;
    scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;syncCounter();});
  });

  this.renderFirstPdfPreviewPage(pdfPath).then(firstPage=>{
    pages.empty();
    this.appendAccuratePreviewPage(pages,firstPage,"1");
    counter.setText("1 / —");
    status.setText("高保真渲染 · 正在加载其余页面");
    this.renderRemainingPdfPreviewPages(pdfPath).then(allPages=>{
      const rendered=new Set(Array.from(pages.querySelectorAll("img")).map(image=>image.getAttribute("data-preview-page")).filter(Boolean));
      for(const pagePath of allPages){
        const page=String(this.getPdfPreviewPageNumber(pagePath)||"");
        if(!rendered.has(page)){
          this.appendAccuratePreviewPage(pages,pagePath,page);
          if(page)rendered.add(page);
        }
      }
      syncCounter();
    }).catch(error=>{
      console.warn("[New PPT Reviewer] Remaining page render failed:",error);
      status.setText("高保真渲染 · 已加载当前页面");
    });
  }).catch(error=>{
    console.warn("[New PPT Reviewer] First page render failed:",error);
    pages.empty();
    pages.createDiv({cls:"ppt-reviewer-fallback",text:"无法生成图片预览。你可以使用 HTML 模式或外部打开。"});
    status.setText("高保真渲染不可用");
    counter.setText("—");
  });
};

// New PPT Reviewer 1.3.0: native PowerPoint first, LibreOffice second.
Ct.prototype.getLibreOfficeCandidates=function(){
  const path=require("path");
  if(process.platform==="win32"){
    return [
      path.join(process.env.ProgramFiles||"C:\\Program Files","LibreOffice","program","soffice.exe"),
      path.join(process.env["ProgramFiles(x86)"]||"C:\\Program Files (x86)","LibreOffice","program","soffice.exe"),
      "soffice.exe","libreoffice.exe"
    ];
  }
  return ["/Applications/LibreOffice.app/Contents/MacOS/soffice","/usr/local/bin/soffice","/opt/homebrew/bin/soffice","soffice","libreoffice"];
};

Ct.prototype.convertWithMicrosoftPowerPoint=async function(sourcePath,pdfPath){
  const fs=require("fs"),{execFile}=require("child_process"),{promisify}=require("util"),run=promisify(execFile);
  if(process.platform==="darwin"){
    if(!fs.existsSync("/Applications/Microsoft PowerPoint.app"))throw new Error("Microsoft PowerPoint is not installed");
    const script=`on run argv
set sourceFile to POSIX file (item 1 of argv)
set outputFile to POSIX file (item 2 of argv)
with timeout of 40 seconds
  tell application "Microsoft PowerPoint"
    set presentationFile to open sourceFile
    save presentationFile in outputFile as save as PDF
    close presentationFile saving no
  end tell
end timeout
end run`;
    await run("osascript",["-e",script,sourcePath,pdfPath],{timeout:45e3});
  }else if(process.platform==="win32"){
    const quote=value=>"'"+String(value).replace(/'/g,"''")+"'";
    const command=`$ErrorActionPreference='Stop'; $app=$null; $presentation=$null; try { $app=New-Object -ComObject PowerPoint.Application; $presentation=$app.Presentations.Open(${quote(sourcePath)}, $false, $true, $false); $presentation.ExportAsFixedFormat(${quote(pdfPath)}, 2); } finally { if($presentation){$presentation.Close()} if($app){$app.Quit(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($app)} }`;
    await run("powershell.exe",["-NoProfile","-NonInteractive","-ExecutionPolicy","Bypass","-Command",command],{timeout:60e3,windowsHide:true});
  }else{
    throw new Error("Microsoft PowerPoint automation is unavailable on this platform");
  }
  if(!fs.existsSync(pdfPath))throw new Error("Microsoft PowerPoint did not create a PDF preview");
  return pdfPath;
};

Ct.prototype.convertWithLibreOffice=async function(sourcePath,cache){
  const fs=require("fs"),path=require("path"),{execFile}=require("child_process"),{promisify}=require("util"),run=promisify(execFile);
  let lastError=null;
  for(const binary of this.getLibreOfficeCandidates()){
    try{
      await run(binary,["--headless","--convert-to","pdf","--outdir",cache.dir,sourcePath],{timeout:120e3,windowsHide:true});
      if(fs.existsSync(cache.pdfPath))return cache.pdfPath;
      const created=fs.readdirSync(cache.dir).find(name=>name.toLowerCase().endsWith(".pdf"));
      if(created){
        const generated=path.join(cache.dir,created);
        if(generated!==cache.pdfPath)fs.renameSync(generated,cache.pdfPath);
        return cache.pdfPath;
      }
    }catch(error){lastError=error;}
  }
  throw lastError||new Error("LibreOffice conversion failed");
};

Ct.prototype.renderAccuratePreview=async function(file){
  if(typeof require!=="function")return null;
  const fs=require("fs");
  const sourcePath=this.getSourceFilePath(file),cache=this.getPreviewCachePath(sourcePath);
  if(fs.existsSync(cache.pdfPath)){
    this.pptReviewerRenderEngine="缓存预览";
    return cache.pdfPath;
  }
  fs.mkdirSync(cache.dir,{recursive:true});
  const errors=[];
  try{
    const result=await this.convertWithMicrosoftPowerPoint(sourcePath,cache.pdfPath);
    this.pptReviewerRenderEngine="Microsoft PowerPoint";
    return result;
  }catch(error){
    errors.push(error);
    console.info("[New PPT Reviewer] Microsoft PowerPoint unavailable, trying LibreOffice:",error&&error.message?error.message:error);
  }
  try{
    const result=await this.convertWithLibreOffice(sourcePath,cache);
    this.pptReviewerRenderEngine="LibreOffice";
    return result;
  }catch(error){
    errors.push(error);
  }
  throw new Error(`Could not create an accurate preview. ${errors.map(error=>error&&error.message).filter(Boolean).join(" | ")}`);
};

Ct.prototype.getPdftoppmCandidates=function(){
  if(process.platform==="win32")return ["pdftoppm.exe","pdftoppm"];
  return ["/opt/homebrew/bin/pdftoppm","/usr/local/bin/pdftoppm","pdftoppm"];
};

Ct.prototype.renderAccuratePreviewUI=function(pdfPath){
  this.container.empty();
  const root=this.container.createDiv({cls:"ppt-reviewer-root ppt-accurate-root ppt-preview-chrome-root"});
  const header=root.createDiv({cls:"ppt-reviewer-header"});
  const identity=header.createDiv({cls:"ppt-reviewer-identity"});
  identity.createDiv({cls:"ppt-reviewer-mark",text:"P"});
  const titleBlock=identity.createDiv({cls:"ppt-reviewer-title-block"});
  titleBlock.createDiv({cls:"ppt-reviewer-eyebrow",text:"PPT REVIEWER"});
  titleBlock.createDiv({cls:"ppt-reviewer-title",text:(this.file&&this.file.basename)||"PowerPoint"});
  const actions=header.createDiv({cls:"ppt-reviewer-actions"});
  const createAction=(text,className,onClick,title)=>{const button=actions.createEl("button",{text,cls:`ppt-reviewer-btn ${className||""}`});if(title)button.setAttribute("title",title);button.addEventListener("click",onClick);return button;};
  createAction("HTML 模式","ppt-reviewer-btn-quiet",()=>{this.file&&newPptReviewerLegacyHtmlLoader.call(this,this.file);},"在高保真模式不可用时使用");
  createAction("刷新","ppt-reviewer-btn-quiet",()=>{this.clearCurrentPreviewCache();this.renderAccurateFromCurrentFile();},"重新生成预览");
  createAction("全屏","ppt-reviewer-btn-quiet",()=>this.togglePreviewFullscreen(),"全屏审阅");
  createAction("外部打开 ↗","ppt-reviewer-btn-primary",()=>this.openWithDefaultApp(),"使用默认 PowerPoint 应用打开");
  const context=root.createDiv({cls:"ppt-reviewer-context"});
  const status=context.createDiv({cls:"ppt-reviewer-status",text:`${this.pptReviewerRenderEngine||"高保真"} · 正在加载第 1 页`});
  status.setAttribute("aria-live","polite");
  const counter=context.createDiv({cls:"ppt-reviewer-counter",text:"1 / —"});
  const pages=root.createDiv({cls:"ppt-accurate-pages ppt-reviewer-pages"});
  pages.setText("正在准备第一页…");
  const syncCounter=()=>{const total=pages.querySelectorAll(".ppt-accurate-page-img").length,current=this.getReviewerCurrentPage(pages);if(total&&current){counter.setText(`${current} / ${total}`);status.setText(`${this.pptReviewerRenderEngine||"高保真"} · 第 ${current} 页，共 ${total} 页`);}};
  let scrollFrame=0;
  pages.addEventListener("scroll",()=>{if(scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;syncCounter();});});
  this.renderFirstPdfPreviewPage(pdfPath).then(firstPage=>{
    pages.empty();this.appendAccuratePreviewPage(pages,firstPage,"1");counter.setText("1 / —");status.setText(`${this.pptReviewerRenderEngine||"高保真"} · 正在加载其余页面`);
    this.renderRemainingPdfPreviewPages(pdfPath).then(allPages=>{
      const rendered=new Set(Array.from(pages.querySelectorAll("img")).map(image=>image.getAttribute("data-preview-page")).filter(Boolean));
      for(const pagePath of allPages){const page=String(this.getPdfPreviewPageNumber(pagePath)||"");if(!rendered.has(page)){this.appendAccuratePreviewPage(pages,pagePath,page);if(page)rendered.add(page);}}
      syncCounter();
    }).catch(error=>{console.warn("[New PPT Reviewer] Remaining page render failed:",error);syncCounter();});
  }).catch(error=>{
    console.info("[New PPT Reviewer] Image renderer unavailable, using embedded PDF:",error&&error.message?error.message:error);
    pages.empty();
    const frame=pages.createEl("embed",{cls:"ppt-reviewer-pdf-frame"});
    frame.setAttribute("type","application/pdf");
    frame.setAttribute("src",require("url").pathToFileURL(pdfPath).href);
    status.setText(`${this.pptReviewerRenderEngine||"高保真"} · 内嵌 PDF 预览`);
    counter.setText("PDF");
  });
};

// New PPT Reviewer 1.4.0: native-fidelity cache and true presentation fullscreen.
const PPT_REVIEWER_CACHE_REVISION="powerpoint-native-v2";
const PPT_REVIEWER_PREVIEW_DPI=180;
const newPptReviewerV14GetPreviewCachePath=Ct.prototype.getPreviewCachePath;
const newPptReviewerV14RenderAccuratePreviewUI=Ct.prototype.renderAccuratePreviewUI;
const newPptReviewerV14OnUnloadFile=Ct.prototype.onUnloadFile;

Ct.prototype.getPreviewCachePath=function(sourcePath){
  const path=require("path"),base=newPptReviewerV14GetPreviewCachePath.call(this,sourcePath);
  const dir=`${base.dir}-${PPT_REVIEWER_CACHE_REVISION}`;
  return {dir,pdfPath:path.join(dir,path.basename(base.pdfPath)),metadataPath:path.join(dir,"renderer.json")};
};

Ct.prototype.canUseMicrosoftPowerPoint=function(){
  if(process.platform==="darwin")return require("fs").existsSync("/Applications/Microsoft PowerPoint.app");
  return process.platform==="win32";
};

Ct.prototype.readReviewerCacheMetadata=function(cache){
  const fs=require("fs");
  try{return JSON.parse(fs.readFileSync(cache.metadataPath,"utf8"));}
  catch(error){return null;}
};

Ct.prototype.writeReviewerCacheMetadata=function(cache,engine){
  require("fs").writeFileSync(cache.metadataPath,JSON.stringify({revision:PPT_REVIEWER_CACHE_REVISION,engine,createdAt:new Date().toISOString()},null,2));
};

Ct.prototype.convertWithMicrosoftPowerPoint=async function(sourcePath,pdfPath){
  const fs=require("fs"),{execFile}=require("child_process"),{promisify}=require("util"),run=promisify(execFile);
  if(process.platform==="darwin"){
    if(!fs.existsSync("/Applications/Microsoft PowerPoint.app"))throw new Error("Microsoft PowerPoint is not installed");
    const script=`on run argv
set sourceFile to POSIX file (item 1 of argv)
set outputFile to POSIX file (item 2 of argv)
with timeout of 90 seconds
  tell application "Microsoft PowerPoint"
    open sourceFile
    set presentationFile to active presentation
    save presentationFile in outputFile as save as PDF
    close presentationFile saving no
  end tell
end timeout
end run`;
    await run("osascript",["-e",script,sourcePath,pdfPath],{timeout:95e3});
  }else if(process.platform==="win32"){
    const quote=value=>"'"+String(value).replace(/'/g,"''")+"'";
    const command=`$ErrorActionPreference='Stop'; $app=$null; $presentation=$null; try { $app=New-Object -ComObject PowerPoint.Application; $presentation=$app.Presentations.Open(${quote(sourcePath)}, $false, $true, $false); $presentation.ExportAsFixedFormat(${quote(pdfPath)}, 2); } finally { if($presentation){$presentation.Close()} if($app){$app.Quit(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($app)} }`;
    await run("powershell.exe",["-NoProfile","-NonInteractive","-ExecutionPolicy","Bypass","-Command",command],{timeout:60e3,windowsHide:true});
  }else{
    throw new Error("Microsoft PowerPoint automation is unavailable on this platform");
  }
  if(!fs.existsSync(pdfPath)||fs.statSync(pdfPath).size<1024)throw new Error("Microsoft PowerPoint did not create a valid PDF preview");
  return pdfPath;
};

Ct.prototype.renderAccuratePreview=async function(file){
  if(typeof require!=="function")return null;
  const fs=require("fs"),sourcePath=this.getSourceFilePath(file),cache=this.getPreviewCachePath(sourcePath);
  if(fs.existsSync(cache.pdfPath)){
    const metadata=this.readReviewerCacheMetadata(cache);
    const nativeRequired=this.canUseMicrosoftPowerPoint();
    if(!nativeRequired||(metadata&&metadata.revision===PPT_REVIEWER_CACHE_REVISION&&metadata.engine==="Microsoft PowerPoint")){
      this.pptReviewerRenderEngine=(metadata&&metadata.engine)||"缓存预览";
      return cache.pdfPath;
    }
    fs.rmSync(cache.dir,{recursive:true,force:true});
  }
  fs.mkdirSync(cache.dir,{recursive:true});
  const errors=[];
  try{
    const result=await this.convertWithMicrosoftPowerPoint(sourcePath,cache.pdfPath);
    this.pptReviewerRenderEngine="Microsoft PowerPoint";
    this.writeReviewerCacheMetadata(cache,this.pptReviewerRenderEngine);
    return result;
  }catch(error){
    errors.push(error);
    console.info("[New PPT Reviewer] Microsoft PowerPoint unavailable, trying LibreOffice:",error&&error.message?error.message:error);
  }
  try{
    const result=await this.convertWithLibreOffice(sourcePath,cache);
    this.pptReviewerRenderEngine="LibreOffice";
    this.writeReviewerCacheMetadata(cache,this.pptReviewerRenderEngine);
    return result;
  }catch(error){errors.push(error);}
  throw new Error(`Could not create an accurate preview. ${errors.map(error=>error&&error.message).filter(Boolean).join(" | ")}`);
};

Ct.prototype.prepareReviewerPageCache=function(pdfPath){
  const fs=require("fs"),path=require("path"),dir=path.join(path.dirname(pdfPath),"pages"),marker=path.join(dir,".render-dpi");
  fs.mkdirSync(dir,{recursive:true});
  let current="";
  try{current=fs.readFileSync(marker,"utf8").trim();}catch(error){}
  if(current!==String(PPT_REVIEWER_PREVIEW_DPI)){
    for(const name of fs.readdirSync(dir))if(/^slide-\d+\.png$/i.test(name))fs.rmSync(path.join(dir,name),{force:true});
    fs.writeFileSync(marker,String(PPT_REVIEWER_PREVIEW_DPI));
  }
  return dir;
};

Ct.prototype.renderFirstPdfPreviewPage=async function(pdfPath){
  const fs=require("fs"),path=require("path"),dir=this.prepareReviewerPageCache(pdfPath),output=path.join(dir,"slide-01.png");
  const cached=this.getCachedPdfPreviewPages(pdfPath).find(page=>this.getPdfPreviewPageNumber(page)===1);
  if(cached)return cached;
  await this.runPdftoppm(pdfPath,["-png","-f","1","-l","1","-singlefile","-r",String(PPT_REVIEWER_PREVIEW_DPI),pdfPath,path.join(dir,"slide-01")]);
  if(fs.existsSync(output))return output;
  throw new Error("first page render failed");
};

Ct.prototype.renderPdfPreviewPages=async function(pdfPath){
  const path=require("path"),dir=this.prepareReviewerPageCache(pdfPath),prefix=path.join(dir,"slide");
  await this.runPdftoppm(pdfPath,["-png","-r",String(PPT_REVIEWER_PREVIEW_DPI),pdfPath,prefix]);
  const pages=this.getCachedPdfPreviewPages(pdfPath);
  if(pages.length)return pages;
  throw new Error("pdftoppm produced no pages");
};

Ct.prototype.setReviewerFullscreenChrome=function(root,collapsed){
  if(!root)return;
  root.toggleClass("ppt-reviewer-chrome-collapsed",collapsed);
  const button=root.querySelector(".ppt-reviewer-fullscreen-toggle");
  if(button){
    button.setAttribute("aria-expanded",collapsed?"false":"true");
    button.setAttribute("aria-label",collapsed?"展开全屏工具栏":"折叠全屏工具栏");
    button.setAttribute("title",collapsed?"展开工具栏":"折叠工具栏");
  }
  this.syncPreviewViewport&&this.syncPreviewViewport(root);
};

Ct.prototype.ensureReviewerFullscreenToggle=function(root){
  if(!root)return null;
  let button=root.querySelector(".ppt-reviewer-fullscreen-toggle");
  if(button)return button;
  button=root.createEl("button",{cls:"ppt-reviewer-fullscreen-toggle"});
  button.setAttribute("type","button");
  button.createSpan({cls:"ppt-reviewer-fullscreen-grip"});
  button.addEventListener("click",()=>this.setReviewerFullscreenChrome(root,!root.hasClass("ppt-reviewer-chrome-collapsed")));
  this.setReviewerFullscreenChrome(root,false);
  return button;
};

Ct.prototype.bindReviewerFullscreenLifecycle=function(){
  if(this.pptReviewerFullscreenChangeHandler)return;
  this.pptReviewerFullscreenChangeHandler=()=>{
    if(document.fullscreenElement)return;
    this.setReviewerFullscreenChrome(this.getPreviewFullscreenTarget(),false);
  };
  document.addEventListener("fullscreenchange",this.pptReviewerFullscreenChangeHandler);
};

Ct.prototype.togglePreviewFullscreen=function(){
  const root=this.getPreviewFullscreenTarget();
  if(!root||!root.requestFullscreen)return;
  if(document.fullscreenElement){
    if(document.fullscreenElement===root||root.contains(document.fullscreenElement))document.exitFullscreen&&document.exitFullscreen();
    return;
  }
  this.fullscreenSlideIndex=this.getFullscreenSlideIndex(root);
  this.ensureReviewerFullscreenToggle(root);
  this.bindPreviewFullscreenKeys();
  this.bindReviewerFullscreenLifecycle();
  this.setReviewerFullscreenChrome(root,true);
  root.requestFullscreen().then(()=>this.goToFullscreenSlide(this.fullscreenSlideIndex||0)).catch(error=>{
    this.setReviewerFullscreenChrome(root,false);
    console.warn("[New PPT Reviewer] Fullscreen failed:",error&&error.message?error.message:error);
  });
};

Ct.prototype.renderAccuratePreviewUI=function(pdfPath){
  newPptReviewerV14RenderAccuratePreviewUI.call(this,pdfPath);
  this.ensureReviewerFullscreenToggle(this.getPreviewFullscreenTarget());
};

Ct.prototype.onUnloadFile=async function(){
  if(this.pptReviewerFullscreenChangeHandler){
    document.removeEventListener("fullscreenchange",this.pptReviewerFullscreenChangeHandler);
    this.pptReviewerFullscreenChangeHandler=null;
  }
  return newPptReviewerV14OnUnloadFile.call(this);
};

// New PPT Reviewer 1.5.0: one-time native authorization and render escape routes.
const PPT_REVIEWER_SETTINGS_DEFAULTS={settingsVersion:1,powerPointAuthorization:"unknown"};
const newPptReviewerV15RenderAccuratePreviewUI=Ct.prototype.renderAccuratePreviewUI;

kt.prototype.persistReviewerSettings=async function(patch){
  this.pptReviewerSettings=Object.assign({},PPT_REVIEWER_SETTINGS_DEFAULTS,this.pptReviewerSettings||{},patch||{});
  await this.saveData(this.pptReviewerSettings);
  return this.pptReviewerSettings;
};

kt.prototype.requestPowerPointAuthorization=async function(options={}){
  const force=options.force===true,quiet=options.quiet===true;
  if(process.platform!=="darwin")return true;
  const fs=require("fs");
  if(!fs.existsSync("/Applications/Microsoft PowerPoint.app")){
    await this.persistReviewerSettings({powerPointAuthorization:"unavailable"});
    return false;
  }
  const state=(this.pptReviewerSettings&&this.pptReviewerSettings.powerPointAuthorization)||"unknown";
  if(state==="granted"&&!force)return true;
  if((state==="denied"||state==="unavailable")&&!force)return false;
  if(this.pptReviewerAuthorizationPromise)return this.pptReviewerAuthorizationPromise;
  this.pptReviewerAuthorizationPromise=(async()=>{
    try{
      const{execFile}=require("child_process"),{promisify}=require("util"),run=promisify(execFile);
      await run("osascript",["-e",'tell application "Microsoft PowerPoint" to get version'],{timeout:45e3});
      await this.persistReviewerSettings({powerPointAuthorization:"granted"});
      if(!quiet)new ht.Notice("PowerPoint 高保真渲染已授权");
      return true;
    }catch(error){
      await this.persistReviewerSettings({powerPointAuthorization:"denied"});
      if(!quiet)new ht.Notice("未获得 PowerPoint 授权，将使用兼容预览");
      console.info("[New PPT Reviewer] PowerPoint authorization was not granted:",error&&error.message?error.message:error);
      return false;
    }finally{this.pptReviewerAuthorizationPromise=null;}
  })();
  return this.pptReviewerAuthorizationPromise;
};

kt.prototype.onload=async function(){
  let stored={};
  try{stored=await this.loadData()||{};}catch(error){console.warn("[New PPT Reviewer] Could not load settings:",error);}
  this.pptReviewerSettings=Object.assign({},PPT_REVIEWER_SETTINGS_DEFAULTS,stored);
  this.registerView(St,leaf=>{const view=new Ct(leaf);view.pptReviewerPlugin=this;return view;});
  this.registerExtensions(["pptx","ppt"],St);
  if(process.platform==="darwin"&&this.pptReviewerSettings.powerPointAuthorization==="unknown"){
    const authorize=()=>this.requestPowerPointAuthorization({quiet:true});
    if(this.app.workspace&&this.app.workspace.onLayoutReady)this.app.workspace.onLayoutReady(authorize);
    else setTimeout(authorize,500);
  }
};

Ct.prototype.ensurePowerPointAuthorization=async function(force=false){
  if(process.platform!=="darwin")return this.canUseMicrosoftPowerPoint();
  if(!this.pptReviewerPlugin)return false;
  return this.pptReviewerPlugin.requestPowerPointAuthorization({force,quiet:!force});
};

Ct.prototype.isPowerPointPermissionError=function(error){
  const message=String(error&&((error.stderr&&error.stderr.toString())||error.message)||error||"");
  return /-1743|not authorized to send apple events|not permitted|automation permission|拒绝|不允许/i.test(message);
};

Ct.prototype.handlePowerPointAuthorizationFailure=function(error){
  if(process.platform!=="darwin"||!this.pptReviewerPlugin||!this.isPowerPointPermissionError(error))return;
  this.pptReviewerPlugin.persistReviewerSettings({powerPointAuthorization:"denied"}).catch(()=>{});
};

Ct.prototype.convertWithMicrosoftPowerPoint=async function(sourcePath,pdfPath){
  const fs=require("fs"),path=require("path"),os=require("os"),crypto=require("crypto"),{execFile}=require("child_process"),{promisify}=require("util"),run=promisify(execFile);
  if(process.platform==="darwin"){
    if(!fs.existsSync("/Applications/Microsoft PowerPoint.app"))throw new Error("Microsoft PowerPoint is not installed");
    const stageDir=path.join(os.tmpdir(),"obsidian-ppt-reviewer-powerpoint"),fingerprint=crypto.createHash("sha1").update(`${sourcePath}:${process.pid}:${Date.now()}:${crypto.randomBytes(6).toString("hex")}`).digest("hex").slice(0,16),extension=path.extname(sourcePath)||".pptx";
    const stagedSource=path.join(stageDir,`source-${fingerprint}${extension}`),stagedPdf=path.join(stageDir,`preview-${fingerprint}.pdf`);
    fs.mkdirSync(stageDir,{recursive:true});
    fs.copyFileSync(sourcePath,stagedSource);
    fs.rmSync(stagedPdf,{force:true});
    const script=`on run argv
set sourceFile to POSIX file (item 1 of argv)
set outputFile to POSIX file (item 2 of argv)
with timeout of 90 seconds
  tell application "Microsoft PowerPoint"
    open sourceFile
    set presentationFile to active presentation
    save presentationFile in outputFile as save as PDF
    close presentationFile saving no
  end tell
end timeout
end run`;
    try{
      await run("osascript",["-e",script,stagedSource,stagedPdf],{timeout:95e3});
      if(!fs.existsSync(stagedPdf)||fs.statSync(stagedPdf).size<1024)throw new Error("Microsoft PowerPoint did not create a valid PDF preview");
      fs.mkdirSync(path.dirname(pdfPath),{recursive:true});
      fs.copyFileSync(stagedPdf,pdfPath);
    }finally{
      fs.rmSync(stagedSource,{force:true});
      fs.rmSync(stagedPdf,{force:true});
    }
  }else if(process.platform==="win32"){
    const quote=value=>"'"+String(value).replace(/'/g,"''")+"'";
    const command=`$ErrorActionPreference='Stop'; $app=$null; $presentation=$null; try { $app=New-Object -ComObject PowerPoint.Application; $presentation=$app.Presentations.Open(${quote(sourcePath)}, $false, $true, $false); $presentation.ExportAsFixedFormat(${quote(pdfPath)}, 2); } finally { if($presentation){$presentation.Close()} if($app){$app.Quit(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($app)} }`;
    await run("powershell.exe",["-NoProfile","-NonInteractive","-ExecutionPolicy","Bypass","-Command",command],{timeout:60e3,windowsHide:true});
  }else{throw new Error("Microsoft PowerPoint automation is unavailable on this platform");}
  if(!fs.existsSync(pdfPath)||fs.statSync(pdfPath).size<1024)throw new Error("Microsoft PowerPoint did not create a valid PDF preview");
  return pdfPath;
};

Ct.prototype.renderAccuratePreview=async function(file){
  if(typeof require!=="function")return null;
  const fs=require("fs"),sourcePath=this.getSourceFilePath(file),cache=this.getPreviewCachePath(sourcePath);
  let metadata=fs.existsSync(cache.pdfPath)?this.readReviewerCacheMetadata(cache):null;
  if(fs.existsSync(cache.pdfPath)&&metadata&&metadata.revision===PPT_REVIEWER_CACHE_REVISION&&metadata.engine==="Microsoft PowerPoint"){
    this.pptReviewerRenderEngine=metadata.engine;
    return cache.pdfPath;
  }
  const usePowerPoint=await this.ensurePowerPointAuthorization(false);
  if(fs.existsSync(cache.pdfPath)&&!usePowerPoint){
    this.pptReviewerRenderEngine=(metadata&&metadata.engine)||"缓存预览";
    return cache.pdfPath;
  }
  if(fs.existsSync(cache.pdfPath))fs.rmSync(cache.dir,{recursive:true,force:true});
  fs.mkdirSync(cache.dir,{recursive:true});
  const errors=[];
  if(usePowerPoint){
    try{
      const result=await this.convertWithMicrosoftPowerPoint(sourcePath,cache.pdfPath);
      this.pptReviewerRenderEngine="Microsoft PowerPoint";
      this.writeReviewerCacheMetadata(cache,this.pptReviewerRenderEngine);
      return result;
    }catch(error){
      errors.push(error);
      this.handlePowerPointAuthorizationFailure(error);
      console.info("[New PPT Reviewer] Microsoft PowerPoint unavailable, trying LibreOffice:",error&&error.message?error.message:error);
    }
  }
  try{
    const result=await this.convertWithLibreOffice(sourcePath,cache);
    this.pptReviewerRenderEngine="LibreOffice";
    this.writeReviewerCacheMetadata(cache,this.pptReviewerRenderEngine);
    return result;
  }catch(error){errors.push(error);}
  throw new Error(`Could not create an accurate preview. ${errors.map(error=>error&&error.message).filter(Boolean).join(" | ")}`);
};

Ct.prototype.selectReviewerHtmlMode=function(file){
  this.pptReviewerRequestId=(this.pptReviewerRequestId||0)+1;
  this.file=file;
  return newPptReviewerLegacyHtmlLoader.call(this,file);
};

Ct.prototype.renderReviewerExternalHandoff=function(file){
  this.container.empty();
  const root=this.container.createDiv({cls:"ppt-reviewer-root ppt-reviewer-handoff-root"});
  const panel=root.createDiv({cls:"ppt-reviewer-handoff-panel"});
  panel.createDiv({cls:"ppt-reviewer-loading-title",text:"已使用外部应用打开"});
  panel.createDiv({cls:"ppt-reviewer-loading-copy",text:file.basename});
  const actions=panel.createDiv({cls:"ppt-reviewer-handoff-actions"});
  const html=actions.createEl("button",{text:"HTML 模式",cls:"ppt-reviewer-btn"});
  html.addEventListener("click",()=>this.selectReviewerHtmlMode(file));
  const resume=actions.createEl("button",{text:"返回高保真预览",cls:"ppt-reviewer-btn ppt-reviewer-btn-primary"});
  resume.addEventListener("click",()=>this.onLoadFile(file));
};

Ct.prototype.selectReviewerExternalMode=function(file){
  this.pptReviewerRequestId=(this.pptReviewerRequestId||0)+1;
  this.openWithDefaultApp();
  this.renderReviewerExternalHandoff(file);
};

Ct.prototype.renderReviewerLoading=function(file){
  this.container.empty();
  const root=this.container.createDiv({cls:"ppt-reviewer-root ppt-reviewer-loading-root"});
  const header=root.createDiv({cls:"ppt-reviewer-header ppt-reviewer-loading-header"});
  const identity=header.createDiv({cls:"ppt-reviewer-identity"});
  identity.createDiv({cls:"ppt-reviewer-mark",text:"P"});
  const titleBlock=identity.createDiv({cls:"ppt-reviewer-title-block"});
  titleBlock.createDiv({cls:"ppt-reviewer-eyebrow",text:"PPT REVIEWER"});
  titleBlock.createDiv({cls:"ppt-reviewer-title",text:file.basename});
  const actions=header.createDiv({cls:"ppt-reviewer-actions"});
  const html=actions.createEl("button",{text:"HTML 模式",cls:"ppt-reviewer-btn ppt-reviewer-btn-quiet"});
  html.addEventListener("click",()=>this.selectReviewerHtmlMode(file));
  const external=actions.createEl("button",{text:"外部打开 ↗",cls:"ppt-reviewer-btn ppt-reviewer-btn-primary"});
  external.addEventListener("click",()=>this.selectReviewerExternalMode(file));
  const stage=root.createDiv({cls:"ppt-reviewer-loading-stage"});
  const panel=stage.createDiv({cls:"ppt-reviewer-loading-panel"});
  panel.createDiv({cls:"ppt-reviewer-loading-mark",text:"P"});
  const copy=panel.createDiv();
  copy.createDiv({cls:"ppt-reviewer-loading-title",text:"正在生成高保真预览"});
  const detail=copy.createDiv({cls:"ppt-reviewer-loading-copy",text:`${file.basename} · 可随时切换 HTML 或外部打开`});
  detail.setAttribute("aria-live","polite");
};

Ct.prototype.onLoadFile=async function(file){
  const requestId=(this.pptReviewerRequestId||0)+1;
  this.pptReviewerRequestId=requestId;
  const isActive=()=>this.pptReviewerRequestId===requestId;
  const extension=String(file.extension||"").toLowerCase();
  this.file=file;
  this.renderReviewerLoading(file);
  if(extension!=="ppt"){
    this.slides=[];this.currentSlide=0;this.mediaCache.clear();this.relationships.clear();
  }
  try{
    const pdfPath=await this.renderAccuratePreview(file);
    if(!isActive())return;
    if(!pdfPath)throw new Error("No PDF preview was created");
    this.renderAccuratePreviewUI(pdfPath);
  }catch(error){
    if(!isActive())return;
    if(extension==="ppt"){
      console.warn("[New PPT Reviewer] Legacy PPT conversion failed:",error);
      this.renderError(error);
      return;
    }
    console.warn("[New PPT Reviewer] Accurate preview unavailable, using HTML fallback:",error);
    return newPptReviewerLegacyHtmlLoader.call(this,file);
  }
};

Ct.prototype.renderAccuratePreviewUI=function(pdfPath){
  newPptReviewerV15RenderAccuratePreviewUI.call(this,pdfPath);
  if(process.platform!=="darwin"||!this.pptReviewerPlugin)return;
  const state=(this.pptReviewerPlugin.pptReviewerSettings&&this.pptReviewerPlugin.pptReviewerSettings.powerPointAuthorization)||"unknown";
  if(state==="granted")return;
  const actions=this.container.querySelector(".ppt-reviewer-actions");
  if(!actions||actions.querySelector(".ppt-reviewer-authorize-btn"))return;
  const button=actions.createEl("button",{text:"启用 PowerPoint",cls:"ppt-reviewer-btn ppt-reviewer-authorize-btn"});
  button.addEventListener("click",async()=>{
    button.disabled=true;
    const granted=await this.ensurePowerPointAuthorization(true);
    button.disabled=false;
    if(granted&&this.file){this.clearCurrentPreviewCache();this.onLoadFile(this.file);}
  });
};

// New PPT Reviewer 1.6.0: resilient HTML mode, localized UI, and reliable external opening.
const newPptReviewerV16RenderAccuratePreview=Ct.prototype.renderAccuratePreview;
const newPptReviewerV16RenderAccuratePreviewUI=Ct.prototype.renderAccuratePreviewUI;
const newPptReviewerV16RenderUI=Ct.prototype.renderUI;
const newPptReviewerV16AppendAccuratePreviewPage=Ct.prototype.appendAccuratePreviewPage;
const newPptReviewerV16RenderReviewerLoading=Ct.prototype.renderReviewerLoading;

Ct.prototype.getReviewerRenderEngineLabel=function(engine){
  const labels={
    "Microsoft PowerPoint":"原生高保真",
    "LibreOffice":"兼容高保真",
    "Accurate preview":"高保真预览",
    "缓存预览":"缓存预览",
    "高保真":"高保真预览"
  };
  return labels[engine]||engine||"高保真预览";
};

Ct.prototype.getSlideFilesFromPresentation=function(presentationXml,relationshipsXml){
  const path=require("path"),relationshipMap=new Map();
  const relationships=this.parseXml(relationshipsXml||"");
  for(const relationship of this.getElements(relationships,"Relationship")){
    const id=relationship.getAttribute("Id"),target=relationship.getAttribute("Target"),type=relationship.getAttribute("Type")||"";
    if(id&&target&&(!type||/\/slide$/i.test(type)))relationshipMap.set(id,target);
  }
  const normalizeTarget=target=>{
    let value=String(target||"").replace(/\\/g,"/").split(/[?#]/,1)[0];
    try{value=decodeURIComponent(value);}catch(error){}
    if(value.startsWith("/"))value=value.replace(/^\/+/,"");
    if(value.startsWith("ppt/"))value=value.slice(4);
    else value=path.posix.normalize(path.posix.join("ppt",value)).replace(/^ppt\//,"");
    while(value.startsWith("../"))value=value.slice(3);
    return value;
  };
  const presentation=this.parseXml(presentationXml||""),slideFiles=[];
  for(const slideId of this.getElements(presentation,"sldId")){
    const relationshipId=slideId.getAttributeNS&&slideId.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships","id")||slideId.getAttribute("r:id");
    const target=relationshipMap.get(relationshipId);
    if(target)slideFiles.push(normalizeTarget(target));
  }
  if(slideFiles.length)return Array.from(new Set(slideFiles));
  const discovered=[];
  if(this.zip&&this.zip.forEach)this.zip.forEach(name=>{
    const match=String(name).match(/^ppt\/slides\/slide(\d+)\.xml$/i);
    if(match)discovered.push({name:String(name).replace(/^ppt\//,""),number:Number(match[1])});
  });
  return discovered.sort((left,right)=>left.number-right.number).map(item=>item.name);
};

Ct.prototype.renderAccuratePreview=function(file){
  let key="";
  try{key=this.getSourceFilePath(file);}catch(error){key=file&&file.path||"";}
  if(this.pptReviewerAccurateJob&&this.pptReviewerAccurateJob.key===key)return this.pptReviewerAccurateJob.promise;
  const promise=Promise.resolve().then(()=>newPptReviewerV16RenderAccuratePreview.call(this,file));
  this.pptReviewerAccurateJob={key,promise};
  promise.finally(()=>{if(this.pptReviewerAccurateJob&&this.pptReviewerAccurateJob.promise===promise)this.pptReviewerAccurateJob=null;}).catch(()=>{});
  return promise;
};

Ct.prototype.renderReviewerHtmlLoading=function(file){
  this.container.empty();
  const root=this.container.createDiv({cls:"ppt-reviewer-root ppt-reviewer-loading-root"});
  const header=root.createDiv({cls:"ppt-reviewer-header ppt-reviewer-loading-header"});
  const identity=header.createDiv({cls:"ppt-reviewer-identity"});
  identity.createDiv({cls:"ppt-reviewer-mark",text:"P"});
  const titleBlock=identity.createDiv({cls:"ppt-reviewer-title-block"});
  titleBlock.createDiv({cls:"ppt-reviewer-eyebrow",text:"PPT 审阅"});
  titleBlock.createDiv({cls:"ppt-reviewer-title",text:file.basename});
  const actions=header.createDiv({cls:"ppt-reviewer-actions"});
  const accurate=actions.createEl("button",{text:"高保真预览",cls:"ppt-reviewer-btn ppt-reviewer-btn-quiet"});
  accurate.addEventListener("click",()=>this.onLoadFile(file));
  const external=actions.createEl("button",{text:"外部打开 ↗",cls:"ppt-reviewer-btn ppt-reviewer-btn-primary"});
  external.addEventListener("click",()=>this.selectReviewerExternalMode(file));
  const stage=root.createDiv({cls:"ppt-reviewer-loading-stage"});
  const panel=stage.createDiv({cls:"ppt-reviewer-loading-panel"});
  panel.createDiv({cls:"ppt-reviewer-loading-mark",text:"P"});
  const copy=panel.createDiv();
  copy.createDiv({cls:"ppt-reviewer-loading-title",text:"正在生成 HTML 预览"});
  const detail=copy.createDiv({cls:"ppt-reviewer-loading-copy",text:`${file.basename} · 正在解析页面内容`});
  detail.setAttribute("aria-live","polite");
};

Ct.prototype.renderReviewerLoading=function(file){
  newPptReviewerV16RenderReviewerLoading.call(this,file);
  this.setReviewerText(this.container.querySelector(".ppt-reviewer-eyebrow"),"PPT 审阅");
};

Ct.prototype.renderReviewerHtmlFallback=async function(file,error,requestId){
  console.warn("[New PPT Reviewer] HTML preview unavailable, returning to accurate preview:",error&&error.message?error.message:error);
  try{
    const pdfPath=await this.renderAccuratePreview(file);
    if(this.pptReviewerRequestId!==requestId)return;
    if(!pdfPath)throw new Error("No PDF preview was created");
    this.pptReviewerRenderEngine="高保真预览";
    this.renderAccuratePreviewUI(pdfPath);
    new ht.Notice("该文件无法使用 HTML 模式，已自动切换到高保真预览");
  }catch(accurateError){
    if(this.pptReviewerRequestId!==requestId)return;
    this.renderReviewerLocalizedError(accurateError,file,"HTML 预览暂不可用");
  }
};

Ct.prototype.selectReviewerHtmlMode=async function(file){
  const requestId=(this.pptReviewerRequestId||0)+1;
  this.pptReviewerRequestId=requestId;
  this.file=file;
  this.renderReviewerHtmlLoading(file);
  if(String(file.extension||"").toLowerCase()!=="pptx")return this.renderReviewerHtmlFallback(file,new Error("HTML mode only supports PPTX"),requestId);
  this.slides=[];this.currentSlide=0;this.mediaCache.clear();this.relationships.clear();
  try{
    const binary=await this.app.vault.readBinary(file);
    await this.parsePPTX(binary);
    if(this.pptReviewerRequestId!==requestId)return;
    if(!this.slides.length)throw new Error("No slides found in the presentation");
    this.renderUI();
  }catch(error){
    return this.renderReviewerHtmlFallback(file,error,requestId);
  }
};

Ct.prototype.setReviewerText=function(element,text){
  if(!element)return;
  if(typeof element.setText==="function")element.setText(text);
  else element.textContent=text;
};

Ct.prototype.localizeReviewerLegacyUI=function(){
  this.setReviewerText(this.container.querySelector(".ppt-sidebar-title"),"幻灯片");
  const mappings=new Map([
    ["◀ Previous","◀ 上一页"],["Next ▶","下一页 ▶"],["Open External ↗","外部打开 ↗"],
    ["Convert PDF 📄","导出 PDF"],["Accurate Preview","高保真预览"],["Hide Toolbar","收起工具栏"],
    ["Fullscreen","全屏"]
  ]);
  for(const button of this.container.querySelectorAll("button")){
    const current=String(button.textContent||button.innerText||"").trim();
    if(mappings.has(current))this.setReviewerText(button,mappings.get(current));
  }
  const restore=this.container.querySelector(".ppt-toolbar-restore-btn");
  if(restore){restore.setAttribute("title","展开工具栏");restore.setAttribute("aria-label","展开工具栏");}
  this.updateCounter(this.container.querySelector(".ppt-slide-counter"));
};

Ct.prototype.renderUI=function(){
  newPptReviewerV16RenderUI.call(this);
  this.localizeReviewerLegacyUI();
};

Ct.prototype.renderAccurateFromCurrentFile=async function(){
  if(!this.file)return;
  if(this.pptReviewerRendering){new ht.Notice("预览正在生成，请稍候");return;}
  this.pptReviewerRendering=true;
  try{return await this.onLoadFile(this.file);}
  finally{this.pptReviewerRendering=false;}
};

Ct.prototype.updateCounter=function(counter){
  if(counter)this.setReviewerText(counter,`第 ${this.currentSlide+1} 页，共 ${this.slides.length} 页`);
};

Ct.prototype.appendAccuratePreviewPage=function(container,filePath,pageNumber){
  const image=newPptReviewerV16AppendAccuratePreviewPage.call(this,container,filePath,pageNumber);
  const page=String(pageNumber||this.getPdfPreviewPageNumber(filePath)||"");
  if(image)image.alt=page?`第 ${page} 页`:"PPT 页面";
  return image;
};

Ct.prototype.renderAccuratePreviewUI=function(pdfPath){
  this.pptReviewerRenderEngine=this.getReviewerRenderEngineLabel(this.pptReviewerRenderEngine);
  newPptReviewerV16RenderAccuratePreviewUI.call(this,pdfPath);
  this.setReviewerText(this.container.querySelector(".ppt-reviewer-eyebrow"),"PPT 审阅");
  const actions=this.container.querySelector(".ppt-reviewer-actions");
  if(!actions)return;
  for(const button of actions.querySelectorAll("button")){
    const text=String(button.textContent||button.innerText||"").trim();
    if(text==="HTML 模式")button.addEventListener("click",event=>{
      if(event){event.preventDefault();event.stopImmediatePropagation();}
      if(this.file)this.selectReviewerHtmlMode(this.file);
    },true);
    if(text==="外部打开 ↗")button.addEventListener("click",event=>{
      if(event){event.preventDefault();event.stopImmediatePropagation();}
      if(this.file)this.selectReviewerExternalMode(this.file);
    },true);
  }
};

Ct.prototype.openWithDefaultApp=async function(file=this.file){
  if(!file)return false;
  const fs=require("fs"),{execFile}=require("child_process"),{promisify}=require("util"),run=promisify(execFile);
  let sourcePath;
  try{sourcePath=this.getSourceFilePath(file);}catch(error){new ht.Notice("无法定位 PPT 文件");return false;}
  if(!fs.existsSync(sourcePath)){new ht.Notice("PPT 文件不存在或已被移动");return false;}
  const errors=[];
  try{
    const electron=require("electron"),shell=electron&&electron.shell;
    if(shell&&typeof shell.openPath==="function"){
      const message=await shell.openPath(sourcePath);
      if(!message)return true;
      errors.push(new Error(message));
    }
  }catch(error){errors.push(error);}
  try{
    if(process.platform==="darwin")await run("open",[sourcePath],{timeout:15e3});
    else if(process.platform==="win32"){
      const quoted="'"+sourcePath.replace(/'/g,"''")+"'";
      await run("powershell.exe",["-NoProfile","-NonInteractive","-ExecutionPolicy","Bypass","-Command",`Start-Process -LiteralPath ${quoted}`],{timeout:15e3,windowsHide:true});
    }else await run("xdg-open",[sourcePath],{timeout:15e3});
    return true;
  }catch(error){errors.push(error);}
  console.warn("[New PPT Reviewer] Unable to open presentation externally:",errors.map(item=>item&&item.message).filter(Boolean).join(" | "));
  try{
    const electron=require("electron"),shell=electron&&electron.shell;
    if(shell&&typeof shell.showItemInFolder==="function")shell.showItemInFolder(sourcePath);
  }catch(error){}
  new ht.Notice("未能启动外部应用，已尝试在文件夹中定位该文件");
  return false;
};

Ct.prototype.convertToPDF=async function(){
  if(!this.file)return;
  const fs=require("fs"),path=require("path");
  let sourcePath;
  try{sourcePath=this.getSourceFilePath(this.file);}catch(error){new ht.Notice("无法定位 PPT 文件");return;}
  const outputPath=sourcePath.replace(/\.(pptx?|ppt)$/i,".pdf");
  const outputName=path.basename(outputPath);
  const status=this.container.createDiv({cls:"ppt-convert-status"});
  status.setText("正在导出 PDF…");
  try{
    const previewPdf=await this.renderAccuratePreview(this.file);
    if(!previewPdf||!fs.existsSync(previewPdf))throw new Error("PDF preview was not created");
    if(path.resolve(previewPdf)!==path.resolve(outputPath))fs.copyFileSync(previewPdf,outputPath);
    const adapter=this.app&&this.app.vault&&this.app.vault.adapter;
    const relativePath=this.file.path.replace(/\.(pptx?|ppt)$/i,".pdf");
    if(adapter&&typeof adapter.reconcileInternalFile==="function")await adapter.reconcileInternalFile(relativePath);
    new ht.Notice(`已导出：${outputName}`);
  }catch(error){
    console.warn("[New PPT Reviewer] PDF export failed:",error&&error.message?error.message:error);
    new ht.Notice("PDF 导出失败，请稍后重试");
  }finally{if(status&&typeof status.remove==="function")status.remove();}
};

Ct.prototype.renderReviewerExternalOpening=function(file){
  this.container.empty();
  const root=this.container.createDiv({cls:"ppt-reviewer-root ppt-reviewer-handoff-root"});
  const panel=root.createDiv({cls:"ppt-reviewer-handoff-panel"});
  panel.createDiv({cls:"ppt-reviewer-loading-title",text:"正在打开外部应用"});
  const detail=panel.createDiv({cls:"ppt-reviewer-loading-copy",text:file.basename});
  detail.setAttribute("aria-live","polite");
};

Ct.prototype.renderReviewerExternalFailure=function(file){
  this.container.empty();
  const root=this.container.createDiv({cls:"ppt-reviewer-root ppt-reviewer-handoff-root"});
  const panel=root.createDiv({cls:"ppt-reviewer-handoff-panel"});
  panel.createDiv({cls:"ppt-reviewer-loading-title",text:"外部应用未能打开"});
  panel.createDiv({cls:"ppt-reviewer-loading-copy",text:"可以重试，或返回插件内预览。"});
  const actions=panel.createDiv({cls:"ppt-reviewer-handoff-actions"});
  const retry=actions.createEl("button",{text:"重试",cls:"ppt-reviewer-btn"});
  retry.addEventListener("click",()=>this.selectReviewerExternalMode(file));
  const resume=actions.createEl("button",{text:"返回预览",cls:"ppt-reviewer-btn ppt-reviewer-btn-primary"});
  resume.addEventListener("click",()=>this.onLoadFile(file));
};

Ct.prototype.selectReviewerExternalMode=async function(file){
  const requestId=(this.pptReviewerRequestId||0)+1;
  this.pptReviewerRequestId=requestId;
  this.file=file;
  this.renderReviewerExternalOpening(file);
  const opened=await this.openWithDefaultApp(file);
  if(this.pptReviewerRequestId!==requestId)return;
  if(opened)this.renderReviewerExternalHandoff(file);
  else this.renderReviewerExternalFailure(file);
};

Ct.prototype.renderReviewerLocalizedError=function(error,file=this.file,title="暂时无法打开此演示文稿"){
  this.container.empty();
  const root=this.container.createDiv({cls:"ppt-reviewer-root ppt-reviewer-handoff-root"});
  const panel=root.createDiv({cls:"ppt-reviewer-handoff-panel ppt-reviewer-error-panel"});
  panel.createDiv({cls:"ppt-reviewer-loading-title",text:title});
  panel.createDiv({cls:"ppt-reviewer-loading-copy",text:"你可以重新生成高保真预览，或使用外部应用打开。"});
  const actions=panel.createDiv({cls:"ppt-reviewer-handoff-actions"});
  if(file){
    const retry=actions.createEl("button",{text:"重新预览",cls:"ppt-reviewer-btn"});
    retry.addEventListener("click",()=>this.onLoadFile(file));
    const external=actions.createEl("button",{text:"外部打开 ↗",cls:"ppt-reviewer-btn ppt-reviewer-btn-primary"});
    external.addEventListener("click",()=>this.selectReviewerExternalMode(file));
  }
  console.warn("[New PPT Reviewer] Preview error:",error&&error.message?error.message:error);
};

Ct.prototype.renderError=function(error){
  this.renderReviewerLocalizedError(error,this.file);
};

// New PPT Reviewer 1.7.0: open the generated PDF directly with Obsidian PDF.js.
// Pages are rendered only when visible; image conversion remains the last-resort fallback.
const newPptReviewerV17ImagePreviewUI=Ct.prototype.renderAccuratePreviewUI;
const newPptReviewerV17OnLoadFile=Ct.prototype.onLoadFile;
const newPptReviewerV17OnUnloadFile=Ct.prototype.onUnloadFile;
const newPptReviewerV17SelectHtmlMode=Ct.prototype.selectReviewerHtmlMode;

Ct.prototype.disposeReviewerPdfPreview=function(){
  const session=this.pptReviewerPdfSession;
  if(!session)return;
  this.pptReviewerPdfSession=null;
  if(session.intersectionObserver)session.intersectionObserver.disconnect();
  if(session.resizeObserver)session.resizeObserver.disconnect();
  if(session.resizeTimer)clearTimeout(session.resizeTimer);
  if(session.rerenderAfterCurrent)session.rerenderAfterCurrent.clear();
  for(const task of session.pdfRenderTasks.values())try{task.cancel();}catch(error){}
  session.pdfRenderTasks.clear();
  session.renderPromises.clear();
  try{const result=session.document&&session.document.destroy();if(result&&result.catch)result.catch(()=>{});}catch(error){}
  try{const result=session.loadingTask&&session.loadingTask.destroy();if(result&&result.catch)result.catch(()=>{});}catch(error){}
};

Ct.prototype.onLoadFile=async function(file){
  this.disposeReviewerPdfPreview();
  return newPptReviewerV17OnLoadFile.call(this,file);
};

Ct.prototype.selectReviewerHtmlMode=function(file){
  this.disposeReviewerPdfPreview();
  return newPptReviewerV17SelectHtmlMode.call(this,file);
};

Ct.prototype.onUnloadFile=async function(){
  this.disposeReviewerPdfPreview();
  return newPptReviewerV17OnUnloadFile.call(this);
};

Ct.prototype.getReviewerPageElements=function(root){
  if(!root)return[];
  return Array.from(root.querySelectorAll(".ppt-reviewer-pdf-page, .ppt-accurate-page-img"));
};

Ct.prototype.getReviewerCurrentPage=function(pages){
  const elements=this.getReviewerPageElements(pages);
  if(!elements.length)return 0;
  const target=pages.scrollTop+Math.max(36,pages.clientHeight*.34);
  let closest=0,distance=Infinity;
  elements.forEach((element,index)=>{
    const delta=Math.abs(element.offsetTop-target);
    if(delta<distance){distance=delta;closest=index;}
  });
  return closest+1;
};

Ct.prototype.getFullscreenSlideIndex=function(root){
  const pages=root&&root.querySelector(".ppt-reviewer-pages, .ppt-accurate-pages");
  if(!pages)return Math.max(0,this.currentSlide||0);
  const elements=this.getReviewerPageElements(pages);
  if(!elements.length)return 0;
  const current=this.getReviewerCurrentPage(pages);
  return Math.max(0,current-1);
};

Ct.prototype.goToFullscreenSlide=function(index){
  const root=this.getPreviewFullscreenTarget(),pages=root&&root.querySelector(".ppt-reviewer-pages, .ppt-accurate-pages");
  const elements=this.getReviewerPageElements(pages);
  if(pages&&elements.length){
    const next=Math.max(0,Math.min(index,elements.length-1));
    this.fullscreenSlideIndex=next;
    pages.scrollTo({top:elements[next].offsetTop,behavior:"smooth"});
    const session=this.pptReviewerPdfSession;
    if(session){
      this.renderReviewerPdfPage(session,next+1).catch(()=>{});
      this.renderReviewerPdfPage(session,next+2).catch(()=>{});
    }
    return;
  }
  if(this.slides&&this.slides.length){
    const next=Math.max(0,Math.min(index,this.slides.length-1));
    this.goToSlide(next);this.fullscreenSlideIndex=next;
  }
};

Ct.prototype.renderReviewerPdfPreviewUI=function(pdfPath){
  this.disposeReviewerPdfPreview();
  this.pptReviewerRenderEngine=this.getReviewerRenderEngineLabel(this.pptReviewerRenderEngine);
  this.container.empty();
  const root=this.container.createDiv({cls:"ppt-reviewer-root ppt-accurate-root ppt-preview-chrome-root ppt-reviewer-direct-pdf-root"});
  const header=root.createDiv({cls:"ppt-reviewer-header"});
  const identity=header.createDiv({cls:"ppt-reviewer-identity"});
  identity.createDiv({cls:"ppt-reviewer-mark",text:"P"});
  const titleBlock=identity.createDiv({cls:"ppt-reviewer-title-block"});
  titleBlock.createDiv({cls:"ppt-reviewer-eyebrow",text:"PPT 审阅"});
  titleBlock.createDiv({cls:"ppt-reviewer-title",text:(this.file&&this.file.basename)||"演示文稿"});
  const actions=header.createDiv({cls:"ppt-reviewer-actions"});
  const createAction=(text,className,onClick,title)=>{
    const button=actions.createEl("button",{text,cls:`ppt-reviewer-btn ${className||""}`});
    if(title)button.setAttribute("title",title);
    button.addEventListener("click",onClick);
    return button;
  };
  createAction("HTML 模式","ppt-reviewer-btn-quiet",()=>{if(this.file)this.selectReviewerHtmlMode(this.file);},"切换到 HTML 兼容模式");
  createAction("刷新","ppt-reviewer-btn-quiet",()=>{this.clearCurrentPreviewCache();this.renderAccurateFromCurrentFile();},"重新生成预览");
  createAction("全屏","ppt-reviewer-btn-quiet",()=>this.togglePreviewFullscreen(),"全屏审阅");
  createAction("外部打开 ↗","ppt-reviewer-btn-primary",()=>{if(this.file)this.selectReviewerExternalMode(this.file);},"使用默认演示应用打开");
  if(process.platform==="darwin"&&this.pptReviewerPlugin){
    const state=(this.pptReviewerPlugin.pptReviewerSettings&&this.pptReviewerPlugin.pptReviewerSettings.powerPointAuthorization)||"unknown";
    if(state!=="granted"){
      const authorize=createAction("启用 PowerPoint","ppt-reviewer-authorize-btn",async()=>{
        authorize.disabled=true;
        const granted=await this.ensurePowerPointAuthorization(true);
        authorize.disabled=false;
        if(granted&&this.file){this.clearCurrentPreviewCache();this.onLoadFile(this.file);}
      },"启用 PowerPoint 原生高保真转换");
    }
  }
  const context=root.createDiv({cls:"ppt-reviewer-context"});
  const status=context.createDiv({cls:"ppt-reviewer-status",text:`${this.pptReviewerRenderEngine||"高保真预览"} · 正在打开`});
  status.setAttribute("aria-live","polite");
  const counter=context.createDiv({cls:"ppt-reviewer-counter",text:"— / —"});
  const pages=root.createDiv({cls:"ppt-accurate-pages ppt-reviewer-pages ppt-reviewer-pdf-pages"});
  const loading=pages.createDiv({cls:"ppt-reviewer-pdf-document-loading"});
  loading.createDiv({cls:"ppt-reviewer-loading-title",text:"正在打开高保真预览"});
  loading.createDiv({cls:"ppt-reviewer-loading-copy",text:"页面会在浏览时按需加载"});
  const session={
    token:`${Date.now()}-${Math.random()}`,
    pdfPath,root,pages,status,counter,
    document:null,loadingTask:null,intersectionObserver:null,resizeObserver:null,resizeTimer:null,
    wrappers:new Map(),renderPromises:new Map(),pdfRenderTasks:new Map(),renderedPixelWidths:new Map(),seedPages:new Map(),
    pageCount:0,startedAt:Date.now()
  };
  this.pptReviewerPdfSession=session;
  this.ensureReviewerFullscreenToggle(root);
  this.initializeReviewerPdfPreview(session).catch(error=>{
    if(this.pptReviewerPdfSession!==session)return;
    console.warn("[New PPT Reviewer] Direct PDF preview unavailable, using image fallback:",error&&error.message?error.message:error);
    this.disposeReviewerPdfPreview();
    newPptReviewerV17ImagePreviewUI.call(this,pdfPath);
  });
  return root;
};

Ct.prototype.createReviewerPdfPage=function(session,pageNumber,ratio){
  const wrapper=session.pages.createDiv({cls:"ppt-reviewer-pdf-page"});
  wrapper.dataset.page=String(pageNumber);
  wrapper.style.aspectRatio=ratio;
  wrapper.setAttribute("role","img");
  wrapper.setAttribute("aria-label",`第 ${pageNumber} 页`);
  const canvas=wrapper.createEl("canvas",{cls:"ppt-reviewer-pdf-canvas"});
  canvas.setAttribute("aria-hidden","true");
  const loading=wrapper.createDiv({cls:"ppt-reviewer-pdf-page-loading",text:`第 ${pageNumber} 页`});
  loading.setAttribute("aria-hidden","true");
  session.wrappers.set(pageNumber,wrapper);
  return wrapper;
};

Ct.prototype.initializeReviewerPdfPreview=async function(session){
  if(typeof ht.loadPdfJs!=="function")throw new Error("Obsidian PDF.js is unavailable");
  const fs=require("fs"),pdfjs=await ht.loadPdfJs();
  if(this.pptReviewerPdfSession!==session)return;
  if(!pdfjs||typeof pdfjs.getDocument!=="function")throw new Error("Obsidian PDF.js could not be loaded");
  if(pdfjs.GlobalWorkerOptions&&!pdfjs.GlobalWorkerOptions.workerSrc)pdfjs.GlobalWorkerOptions.workerSrc="app://obsidian.md/pdfjs/pdf.worker.min.js";
  const data=new Uint8Array(fs.readFileSync(session.pdfPath));
  const loadingTask=pdfjs.getDocument({data});
  session.loadingTask=loadingTask;
  const document=await loadingTask.promise;
  if(this.pptReviewerPdfSession!==session){try{await document.destroy();}catch(error){}return;}
  session.document=document;
  session.pageCount=document.numPages;
  if(!session.pageCount)throw new Error("The PDF contains no pages");
  const firstPage=await document.getPage(1),firstViewport=firstPage.getViewport({scale:1}),ratio=`${firstViewport.width} / ${firstViewport.height}`;
  session.seedPages.set(1,firstPage);
  session.pages.empty();
  for(let pageNumber=1;pageNumber<=session.pageCount;pageNumber++)this.createReviewerPdfPage(session,pageNumber,ratio);
  session.counter.setText(`1 / ${session.pageCount}`);
  await new Promise(resolve=>requestAnimationFrame(resolve));
  await this.renderReviewerPdfPage(session,1);
  if(this.pptReviewerPdfSession!==session)return;
  this.pptReviewerPdfFirstPaintMs=Date.now()-session.startedAt;
  session.status.setText(`${this.pptReviewerRenderEngine||"高保真预览"} · 第 1 页，共 ${session.pageCount} 页`);
  session.pages.addEventListener("scroll",()=>{
    if(session.scrollFrame)return;
    session.scrollFrame=requestAnimationFrame(()=>{session.scrollFrame=0;this.syncReviewerPdfPreview(session);});
  },{passive:true});
  if(typeof IntersectionObserver!=="undefined"){
    session.intersectionObserver=new IntersectionObserver(entries=>{
      for(const entry of entries)if(entry.isIntersecting){
        const pageNumber=Number(entry.target.dataset.page||0);
        if(pageNumber)this.renderReviewerPdfPage(session,pageNumber).catch(()=>{});
      }
    },{root:session.pages,rootMargin:"85% 0px 85% 0px",threshold:.01});
    for(const wrapper of session.wrappers.values())session.intersectionObserver.observe(wrapper);
  }
  if(typeof ResizeObserver!=="undefined"){
    session.lastResizeWidth=session.pages.clientWidth||0;
    session.resizeObserver=new ResizeObserver(()=>{
      const width=session.pages.clientWidth||0,previous=session.lastResizeWidth||0;
      session.lastResizeWidth=width;
      if(previous&&width&&Math.abs(width-previous)<2)return;
      if(session.resizeTimer)clearTimeout(session.resizeTimer);
      session.resizeTimer=setTimeout(()=>this.refreshReviewerPdfResolution(session),100);
    });
    session.resizeObserver.observe(session.pages);
  }
  this.renderReviewerPdfPage(session,2).catch(()=>{});
};

Ct.prototype.getReviewerPdfTargetWidth=function(session,wrapper,viewport){
  const wrapperWidth=wrapper.getBoundingClientRect&&wrapper.getBoundingClientRect().width||wrapper.clientWidth||0;
  const pageWidth=session.pages.clientWidth?Math.max(1,session.pages.clientWidth-32):viewport.width;
  return Math.max(1,Math.min(wrapperWidth||pageWidth,1440));
};

Ct.prototype.renderReviewerPdfPage=async function(session,pageNumber,force=false){
  if(!session||this.pptReviewerPdfSession!==session||!session.document||pageNumber<1||pageNumber>session.pageCount)return;
  if(session.renderPromises.has(pageNumber)){
    if(force&&session.rerenderAfterCurrent)session.rerenderAfterCurrent.add(pageNumber);
    return session.renderPromises.get(pageNumber);
  }
  const promise=(async()=>{
    const wrapper=session.wrappers.get(pageNumber);
    if(!wrapper)return;
    const page=session.seedPages.get(pageNumber)||await session.document.getPage(pageNumber);
    session.seedPages.delete(pageNumber);
    if(this.pptReviewerPdfSession!==session)return;
    const baseViewport=page.getViewport({scale:1}),cssWidth=this.getReviewerPdfTargetWidth(session,wrapper,baseViewport);
    wrapper.style.aspectRatio=`${baseViewport.width} / ${baseViewport.height}`;
    const deviceScale=Math.min((typeof window!=="undefined"&&window.devicePixelRatio)||1,2);
    const desiredPixelWidth=Math.min(2880,Math.max(1,Math.round(cssWidth*deviceScale)));
    const previousWidth=session.renderedPixelWidths.get(pageNumber)||0;
    if(!force&&previousWidth&&Math.abs(previousWidth-desiredPixelWidth)/desiredPixelWidth<.14)return;
    const viewport=page.getViewport({scale:desiredPixelWidth/baseViewport.width}),canvas=wrapper.querySelector("canvas");
    if(!canvas)throw new Error("PDF page canvas is missing");
    const context=canvas.getContext("2d",{alpha:false});
    if(!context)throw new Error("Canvas 2D context is unavailable");
    canvas.width=Math.max(1,Math.ceil(viewport.width));
    canvas.height=Math.max(1,Math.ceil(viewport.height));
    canvas.style.width="100%";
    canvas.style.height="100%";
    context.fillStyle="#ffffff";context.fillRect(0,0,canvas.width,canvas.height);
    const renderTask=page.render({canvasContext:context,viewport});
    session.pdfRenderTasks.set(pageNumber,renderTask);
    try{await renderTask.promise;}
    finally{if(session.pdfRenderTasks.get(pageNumber)===renderTask)session.pdfRenderTasks.delete(pageNumber);}
    if(this.pptReviewerPdfSession!==session)return;
    session.renderedPixelWidths.set(pageNumber,desiredPixelWidth);
    wrapper.addClass("ppt-reviewer-pdf-page-ready");
    const loading=wrapper.querySelector(".ppt-reviewer-pdf-page-loading");
    if(loading)loading.remove();
  })();
  session.renderPromises.set(pageNumber,promise);
  try{return await promise;}
  catch(error){
    const wrapper=session.wrappers.get(pageNumber),loading=wrapper&&wrapper.querySelector(".ppt-reviewer-pdf-page-loading");
    if(loading)loading.setText("页面加载失败");
    throw error;
  }finally{
    if(session.renderPromises.get(pageNumber)===promise)session.renderPromises.delete(pageNumber);
    if(session.rerenderAfterCurrent&&session.rerenderAfterCurrent.delete(pageNumber)&&this.pptReviewerPdfSession===session){
      setTimeout(()=>this.renderReviewerPdfPage(session,pageNumber,true).catch(()=>{}),0);
    }
  }
};

Ct.prototype.syncReviewerPdfPreview=function(session){
  if(this.pptReviewerPdfSession!==session)return;
  const current=this.getReviewerCurrentPage(session.pages)||1;
  this.fullscreenSlideIndex=current-1;
  session.counter.setText(`${current} / ${session.pageCount}`);
  session.status.setText(`${this.pptReviewerRenderEngine||"高保真预览"} · 第 ${current} 页，共 ${session.pageCount} 页`);
  for(const pageNumber of [current-1,current,current+1])this.renderReviewerPdfPage(session,pageNumber).catch(()=>{});
};

Ct.prototype.refreshReviewerPdfResolution=function(session){
  if(this.pptReviewerPdfSession!==session)return;
  const current=this.getReviewerCurrentPage(session.pages)||1;
  for(const pageNumber of [current-1,current,current+1])this.renderReviewerPdfPage(session,pageNumber,true).catch(()=>{});
};

Ct.prototype.renderAccuratePreviewUI=function(pdfPath){
  return this.renderReviewerPdfPreviewUI(pdfPath);
};

// New PPT Reviewer 1.8.0: final, quiet review interface.
// HTML rendering remains available internally for old data, but is no longer part of the user flow.
Ct.prototype.createReviewerSvgIcon=function(parent,name){
  const icons={
    deck:[
      ["rect",{x:"3",y:"4",width:"18",height:"14",rx:"2"}],
      ["path",{d:"M7 8h10M7 12h6M9 21l3-3 3 3"}]
    ],
    fullscreen:[
      ["path",{d:"M8 3H4a1 1 0 0 0-1 1v4M16 3h4a1 1 0 0 1 1 1v4M8 21H4a1 1 0 0 1-1-1v-4M16 21h4a1 1 0 0 0 1-1v-4"}]
    ],
    external:[
      ["path",{d:"M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"}]
    ]
  };
  const doc=parent&&parent.ownerDocument||typeof document!=="undefined"&&document;
  const make=tag=>doc&&doc.createElementNS?doc.createElementNS("http://www.w3.org/2000/svg",tag):parent.createEl(tag);
  const svg=make("svg");
  svg.setAttribute("viewBox","0 0 24 24");
  svg.setAttribute("fill","none");
  svg.setAttribute("stroke","currentColor");
  svg.setAttribute("stroke-width","1.8");
  svg.setAttribute("stroke-linecap","round");
  svg.setAttribute("stroke-linejoin","round");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("class","ppt-reviewer-svg-icon");
  for(const [tag,attributes] of icons[name]||icons.deck){
    const element=make(tag);
    for(const [key,value] of Object.entries(attributes))element.setAttribute(key,value);
    if(svg.appendChild)svg.appendChild(element);
  }
  if(parent.appendChild)parent.appendChild(svg);
  return svg;
};

Ct.prototype.createReviewerAction=function(parent,options){
  const button=parent.createEl("button",{cls:`ppt-reviewer-final-action${options.primary?" is-primary":""}${options.iconOnly?" is-icon-only":""}`});
  button.setAttribute("type","button");
  button.setAttribute("aria-label",options.label);
  button.setAttribute("title",options.label);
  if(options.icon)this.createReviewerSvgIcon(button,options.icon);
  if(!options.iconOnly)button.createEl("span",{text:options.label});
  button.addEventListener("click",options.onClick);
  return button;
};

Ct.prototype.createReviewerFinalHeader=function(root,file,options={}){
  const header=root.createDiv({cls:"ppt-reviewer-final-header"});
  const identity=header.createDiv({cls:"ppt-reviewer-final-identity"});
  const mark=identity.createDiv({cls:"ppt-reviewer-final-mark"});
  this.createReviewerSvgIcon(mark,"deck");
  const titleBlock=identity.createDiv({cls:"ppt-reviewer-final-title-block"});
  titleBlock.createDiv({cls:"ppt-reviewer-final-title",text:file&&file.basename||"演示文稿"});
  const meta=titleBlock.createDiv({cls:"ppt-reviewer-final-meta"});
  meta.createEl("span",{cls:"ppt-reviewer-final-status-dot"});
  const status=meta.createEl("span",{text:options.status||"高保真预览"});
  status.setAttribute("aria-live","polite");
  const actions=header.createDiv({cls:"ppt-reviewer-final-actions"});
  if(options.refresh)this.createReviewerAction(actions,{label:"刷新",onClick:()=>{this.clearCurrentPreviewCache();this.renderAccurateFromCurrentFile();}});
  if(options.fullscreen)this.createReviewerAction(actions,{label:"全屏",icon:"fullscreen",iconOnly:true,onClick:()=>this.togglePreviewFullscreen()});
  if(options.external!==false)this.createReviewerAction(actions,{label:"外部打开",icon:"external",primary:true,onClick:()=>{if(file)this.selectReviewerExternalMode(file);}});
  return{header,status,actions};
};

Ct.prototype.updateReviewerFinalNavigation=function(session,current){
  if(!session)return;
  const page=Math.max(1,Math.min(current||1,session.pageCount||1));
  if(session.counter)session.counter.setText(session.pageCount?`${page} / ${session.pageCount}`:"— / —");
  if(session.previousButton)session.previousButton.disabled=!session.pageCount||page<=1;
  if(session.nextButton)session.nextButton.disabled=!session.pageCount||page>=session.pageCount;
};

Ct.prototype.goToReviewerPdfPage=function(session,pageNumber){
  if(!session||this.pptReviewerPdfSession!==session||!session.pageCount)return;
  const next=Math.max(1,Math.min(pageNumber,session.pageCount)),wrapper=session.wrappers.get(next);
  if(!wrapper)return;
  session.pages.scrollTo({top:wrapper.offsetTop,behavior:"smooth"});
  this.fullscreenSlideIndex=next-1;
  this.updateReviewerFinalNavigation(session,next);
  this.renderReviewerPdfPage(session,next).catch(()=>{});
  this.renderReviewerPdfPage(session,next+1).catch(()=>{});
};

Ct.prototype.renderReviewerPdfPreviewUI=function(pdfPath){
  this.disposeReviewerPdfPreview();
  this.pptReviewerRenderEngine=this.getReviewerRenderEngineLabel(this.pptReviewerRenderEngine);
  this.container.empty();
  const root=this.container.createDiv({cls:"ppt-reviewer-root ppt-accurate-root ppt-preview-chrome-root ppt-reviewer-direct-pdf-root ppt-reviewer-final-root"});
  const chrome=this.createReviewerFinalHeader(root,this.file,{status:`${this.pptReviewerRenderEngine||"高保真预览"} · 正在打开`,refresh:true,fullscreen:true,external:true});
  const pages=root.createDiv({cls:"ppt-accurate-pages ppt-reviewer-pages ppt-reviewer-pdf-pages ppt-reviewer-final-pages"});
  const loading=pages.createDiv({cls:"ppt-reviewer-pdf-document-loading"});
  const loadingMark=loading.createDiv({cls:"ppt-reviewer-final-loading-mark"});
  this.createReviewerSvgIcon(loadingMark,"deck");
  loading.createDiv({cls:"ppt-reviewer-loading-title",text:"正在打开高保真预览"});
  loading.createDiv({cls:"ppt-reviewer-loading-copy",text:"页面将自动显示"});
  const dock=root.createDiv({cls:"ppt-reviewer-page-dock"});
  const previousButton=dock.createEl("button",{cls:"ppt-reviewer-page-step",text:"‹"});
  previousButton.setAttribute("type","button");previousButton.setAttribute("aria-label","上一页");previousButton.setAttribute("title","上一页");previousButton.disabled=true;
  const counter=dock.createEl("span",{cls:"ppt-reviewer-page-count",text:"— / —"});
  const nextButton=dock.createEl("button",{cls:"ppt-reviewer-page-step",text:"›"});
  nextButton.setAttribute("type","button");nextButton.setAttribute("aria-label","下一页");nextButton.setAttribute("title","下一页");nextButton.disabled=true;
  const session={
    token:`${Date.now()}-${Math.random()}`,pdfPath,root,pages,status:chrome.status,counter,previousButton,nextButton,
    document:null,loadingTask:null,intersectionObserver:null,resizeObserver:null,resizeTimer:null,
    wrappers:new Map(),renderPromises:new Map(),pdfRenderTasks:new Map(),renderedPixelWidths:new Map(),seedPages:new Map(),rerenderAfterCurrent:new Set(),
    pageCount:0,startedAt:Date.now()
  };
  previousButton.addEventListener("click",()=>this.goToReviewerPdfPage(session,(this.getReviewerCurrentPage(session.pages)||1)-1));
  nextButton.addEventListener("click",()=>this.goToReviewerPdfPage(session,(this.getReviewerCurrentPage(session.pages)||1)+1));
  this.pptReviewerPdfSession=session;
  this.ensureReviewerFullscreenToggle(root);
  this.initializeReviewerPdfPreview(session).catch(error=>{
    if(this.pptReviewerPdfSession!==session)return;
    console.warn("[New PPT Reviewer] Direct PDF preview unavailable, using image fallback:",error&&error.message?error.message:error);
    this.disposeReviewerPdfPreview();
    newPptReviewerV17ImagePreviewUI.call(this,pdfPath);
    this.finalizeReviewerImageFallback();
  });
  return root;
};

const newPptReviewerV18InitializePdfPreview=Ct.prototype.initializeReviewerPdfPreview;
Ct.prototype.initializeReviewerPdfPreview=async function(session){
  await newPptReviewerV18InitializePdfPreview.call(this,session);
  if(this.pptReviewerPdfSession!==session)return;
  this.updateReviewerFinalNavigation(session,1);
  session.status.setText(`${this.pptReviewerRenderEngine||"高保真预览"} · 已就绪`);
};

const newPptReviewerV18SyncPdfPreview=Ct.prototype.syncReviewerPdfPreview;
Ct.prototype.syncReviewerPdfPreview=function(session){
  newPptReviewerV18SyncPdfPreview.call(this,session);
  if(this.pptReviewerPdfSession!==session)return;
  const current=this.getReviewerCurrentPage(session.pages)||1;
  this.updateReviewerFinalNavigation(session,current);
  session.status.setText(`${this.pptReviewerRenderEngine||"高保真预览"} · 已就绪`);
};

Ct.prototype.finalizeReviewerImageFallback=function(){
  const root=this.container.querySelector(".ppt-reviewer-root");
  if(root)root.addClass("ppt-reviewer-final-root");
  for(const button of this.container.querySelectorAll("button")){
    if(/HTML/i.test(String(button.textContent||button.innerText||"")))button.remove();
  }
};

Ct.prototype.renderReviewerLoading=function(file){
  this.container.empty();
  const root=this.container.createDiv({cls:"ppt-reviewer-root ppt-reviewer-loading-root ppt-reviewer-final-root"});
  const chrome=this.createReviewerFinalHeader(root,file,{status:"正在准备高保真预览",external:true});
  const stage=root.createDiv({cls:"ppt-reviewer-final-loading-stage"});
  const preview=stage.createDiv({cls:"ppt-reviewer-final-loading-slide"});
  const mark=preview.createDiv({cls:"ppt-reviewer-final-loading-mark"});
  this.createReviewerSvgIcon(mark,"deck");
  preview.createDiv({cls:"ppt-reviewer-loading-title",text:"正在准备演示文稿"});
  preview.createDiv({cls:"ppt-reviewer-loading-copy",text:"转换完成后会自动打开，无需操作"});
  chrome.status.setAttribute("aria-live","polite");
};

Ct.prototype.renderReviewerFinalState=function(file,options){
  this.container.empty();
  const root=this.container.createDiv({cls:`ppt-reviewer-root ppt-reviewer-handoff-root ppt-reviewer-final-root${options.error?" is-error":""}`});
  this.createReviewerFinalHeader(root,file,{status:options.status||"高保真预览",external:false});
  const stage=root.createDiv({cls:"ppt-reviewer-final-state-stage"});
  const panel=stage.createDiv({cls:"ppt-reviewer-final-state"});
  const mark=panel.createDiv({cls:"ppt-reviewer-final-state-mark"});
  this.createReviewerSvgIcon(mark,"deck");
  panel.createDiv({cls:"ppt-reviewer-loading-title",text:options.title});
  panel.createDiv({cls:"ppt-reviewer-loading-copy",text:options.copy});
  const actions=panel.createDiv({cls:"ppt-reviewer-handoff-actions"});
  for(const action of options.actions||[])this.createReviewerAction(actions,action);
  return root;
};

Ct.prototype.renderReviewerExternalOpening=function(file){
  this.renderReviewerFinalState(file,{status:"正在打开外部应用",title:"正在打开",copy:file.basename,actions:[]});
};

Ct.prototype.renderReviewerExternalHandoff=function(file){
  this.renderReviewerFinalState(file,{status:"已交给外部应用",title:"已在外部应用中打开",copy:file.basename,actions:[{label:"返回预览",primary:true,onClick:()=>this.onLoadFile(file)}]});
};

Ct.prototype.renderReviewerExternalFailure=function(file){
  this.renderReviewerFinalState(file,{error:true,status:"外部打开失败",title:"未能打开外部应用",copy:"可以重试，或继续在这里预览。",actions:[
    {label:"重试",onClick:()=>this.selectReviewerExternalMode(file)},
    {label:"返回预览",primary:true,onClick:()=>this.onLoadFile(file)}
  ]});
};

Ct.prototype.renderReviewerLocalizedError=function(error,file=this.file,title="暂时无法打开此演示文稿"){
  const actions=[];
  if(file){
    actions.push({label:"重新预览",onClick:()=>this.onLoadFile(file)});
    actions.push({label:"外部打开",icon:"external",primary:true,onClick:()=>this.selectReviewerExternalMode(file)});
  }
  this.renderReviewerFinalState(file,{error:true,status:"预览暂不可用",title,copy:"请重试，或使用系统中的演示应用打开。",actions});
  console.warn("[New PPT Reviewer] Preview error:",error&&error.message?error.message:error);
};

Ct.prototype.renderError=function(error){this.renderReviewerLocalizedError(error,this.file);};

Ct.prototype.selectReviewerExternalMode=async function(file){
  if(!file)return;
  const keepPreview=!!this.container.querySelector(".ppt-reviewer-direct-pdf-root");
  const requestId=keepPreview?this.pptReviewerRequestId:(this.pptReviewerRequestId||0)+1;
  if(!keepPreview){this.pptReviewerRequestId=requestId;this.file=file;this.renderReviewerExternalOpening(file);}
  const opened=await this.openWithDefaultApp(file);
  if(!keepPreview&&this.pptReviewerRequestId!==requestId)return;
  if(keepPreview){new ht.Notice(opened?"已在外部应用中打开":"外部应用未能打开");return;}
  if(opened)this.renderReviewerExternalHandoff(file);
  else this.renderReviewerExternalFailure(file);
};

Ct.prototype.onLoadFile=async function(file){
  this.disposeReviewerPdfPreview();
  const requestId=(this.pptReviewerRequestId||0)+1;
  this.pptReviewerRequestId=requestId;
  const isActive=()=>this.pptReviewerRequestId===requestId;
  this.file=file;
  this.renderReviewerLoading(file);
  this.slides=[];this.currentSlide=0;this.mediaCache.clear();this.relationships.clear();
  try{
    const pdfPath=await this.renderAccuratePreview(file);
    if(!isActive())return;
    if(!pdfPath)throw new Error("No PDF preview was created");
    this.renderReviewerPdfPreviewUI(pdfPath);
  }catch(error){
    if(!isActive())return;
    this.renderReviewerLocalizedError(error,file);
  }
};

// PPT Viewer 1.8.2: Windows-safe distribution and conversion pipeline.
const pptViewerV182ConvertWithMicrosoftPowerPoint=Ct.prototype.convertWithMicrosoftPowerPoint;
const pptViewerV182ConvertWithLibreOffice=Ct.prototype.convertWithLibreOffice;

Ct.prototype.getLibreOfficeCandidates=function(){
  const path=require("path"),env=process.env||{};
  if(process.platform!=="win32")return [
    "/Applications/LibreOffice.app/Contents/MacOS/soffice",
    "/usr/local/bin/soffice","/opt/homebrew/bin/soffice","soffice","libreoffice"
  ];
  const candidates=[];
  for(const base of [env.ProgramW6432,env.ProgramFiles,env["ProgramFiles(x86)"]]){
    if(base)candidates.push(path.join(base,"LibreOffice","program","soffice.exe"));
  }
  if(env.LOCALAPPDATA)candidates.push(path.join(env.LOCALAPPDATA,"Programs","LibreOffice","program","soffice.exe"));
  if(env.USERPROFILE)candidates.push(path.join(env.USERPROFILE,"scoop","apps","libreoffice","current","program","soffice.exe"));
  candidates.push("soffice.exe","libreoffice.exe");
  return Array.from(new Set(candidates));
};

Ct.prototype.getReviewerPowerShellCandidates=function(){
  const path=require("path"),root=(process.env&&process.env.SystemRoot)||"C:\\Windows";
  return Array.from(new Set([
    path.join(root,"System32","WindowsPowerShell","v1.0","powershell.exe"),
    "powershell.exe","pwsh.exe"
  ]));
};

Ct.prototype.buildReviewerWindowsPowerPointCommand=function(sourcePath,pdfPath){
  const quote=value=>"'"+String(value).replace(/'/g,"''")+"'";
  return `$ErrorActionPreference='Stop'; Set-StrictMode -Version 2; $app=$null; $presentation=$null; try { $app=New-Object -ComObject PowerPoint.Application; $presentation=$app.Presentations.Open(${quote(sourcePath)}, $true, $false, $false); $presentation.ExportAsFixedFormat(${quote(pdfPath)}, 2); } finally { if($presentation){ try{$presentation.Close()}catch{}; try{[void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($presentation)}catch{} } if($app){ try{$app.Quit()}catch{}; try{[void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($app)}catch{} } [GC]::Collect(); [GC]::WaitForPendingFinalizers(); }`;
};

Ct.prototype.convertWithMicrosoftPowerPoint=async function(sourcePath,pdfPath){
  if(process.platform!=="win32")return pptViewerV182ConvertWithMicrosoftPowerPoint.call(this,sourcePath,pdfPath);
  const fs=require("fs"),path=require("path"),os=require("os"),crypto=require("crypto"),{execFile}=require("child_process"),{promisify}=require("util"),run=promisify(execFile);
  const fingerprint=crypto.createHash("sha1").update(`${sourcePath}:${process.pid}:${Date.now()}:${crypto.randomBytes(6).toString("hex")}`).digest("hex").slice(0,16);
  const stageDir=path.join(os.tmpdir(),`obsidian-ppt-reviewer-win-${fingerprint}`),extension=path.extname(sourcePath)||".pptx";
  const stagedSource=path.join(stageDir,`source${extension}`),stagedPdf=path.join(stageDir,"preview.pdf");
  fs.mkdirSync(stageDir,{recursive:true});
  fs.copyFileSync(sourcePath,stagedSource);
  let lastError=null;
  try{
    const command=this.buildReviewerWindowsPowerPointCommand(stagedSource,stagedPdf);
    for(const powerShell of this.getReviewerPowerShellCandidates()){
      try{
        await run(powerShell,["-NoLogo","-NoProfile","-NonInteractive","-ExecutionPolicy","Bypass","-Command",command],{timeout:120e3,windowsHide:true});
        lastError=null;
        break;
      }catch(error){
        lastError=error;
        if(error&&error.code!=="ENOENT")break;
      }
    }
    if(lastError)throw lastError;
    if(!fs.existsSync(stagedPdf)||fs.statSync(stagedPdf).size<1024)throw new Error("PowerPoint did not create a valid PDF preview");
    fs.mkdirSync(path.dirname(pdfPath),{recursive:true});
    fs.copyFileSync(stagedPdf,pdfPath);
    return pdfPath;
  }finally{fs.rmSync(stageDir,{recursive:true,force:true});}
};

Ct.prototype.convertWithLibreOffice=async function(sourcePath,cache){
  if(process.platform!=="win32")return pptViewerV182ConvertWithLibreOffice.call(this,sourcePath,cache);
  const fs=require("fs"),path=require("path"),os=require("os"),crypto=require("crypto"),{pathToFileURL}=require("url"),{execFile}=require("child_process"),{promisify}=require("util"),run=promisify(execFile);
  const fingerprint=crypto.createHash("sha1").update(`${sourcePath}:${process.pid}:${Date.now()}`).digest("hex").slice(0,16);
  const stageDir=path.join(os.tmpdir(),`obsidian-ppt-reviewer-lo-${fingerprint}`),profileDir=path.join(stageDir,"profile"),extension=path.extname(sourcePath)||".pptx";
  const stagedSource=path.join(stageDir,`source${extension}`),stagedPdf=path.join(stageDir,"source.pdf");
  fs.mkdirSync(profileDir,{recursive:true});
  fs.copyFileSync(sourcePath,stagedSource);
  let lastError=null;
  try{
    for(const binary of this.getLibreOfficeCandidates()){
      if(path.isAbsolute(binary)&&!fs.existsSync(binary))continue;
      try{
        await run(binary,[`-env:UserInstallation=${pathToFileURL(profileDir).href}`,"--headless","--nologo","--nodefault","--nofirststartwizard","--convert-to","pdf","--outdir",stageDir,stagedSource],{timeout:120e3,windowsHide:true});
        if(fs.existsSync(stagedPdf)&&fs.statSync(stagedPdf).size>=1024){lastError=null;break;}
        lastError=new Error("LibreOffice did not create a valid PDF preview");
      }catch(error){lastError=error;}
    }
    if(lastError||!fs.existsSync(stagedPdf))throw lastError||new Error("LibreOffice is unavailable");
    fs.mkdirSync(cache.dir,{recursive:true});
    fs.copyFileSync(stagedPdf,cache.pdfPath);
    return cache.pdfPath;
  }finally{fs.rmSync(stageDir,{recursive:true,force:true});}
};

Ct.prototype.renderReviewerWindowsCompatibilityFallback=async function(file,requestId,originalError){
  if(process.platform!=="win32"||String(file&&file.extension||"").toLowerCase()!=="pptx")return false;
  try{
    const binary=await this.app.vault.readBinary(file);
    if(this.pptReviewerRequestId!==requestId)return true;
    this.slides=[];this.currentSlide=0;this.mediaCache.clear();this.relationships.clear();
    await this.parsePPTX(binary);
    if(this.pptReviewerRequestId!==requestId)return true;
    if(!this.slides.length)throw new Error("No slides found in the presentation");
    this.pptReviewerRenderEngine="兼容预览";
    this.renderUI();
    this.finalizeReviewerImageFallback();
    new ht.Notice("已自动使用兼容预览");
    console.info("[PPT Viewer] Windows native conversion unavailable; compatibility preview opened:",originalError&&originalError.message?originalError.message:originalError);
    return true;
  }catch(error){
    console.warn("[PPT Viewer] Windows compatibility preview failed:",error&&error.message?error.message:error);
    return false;
  }
};

Ct.prototype.onLoadFile=async function(file){
  this.disposeReviewerPdfPreview();
  const requestId=(this.pptReviewerRequestId||0)+1;
  this.pptReviewerRequestId=requestId;
  const isActive=()=>this.pptReviewerRequestId===requestId;
  this.file=file;
  this.renderReviewerLoading(file);
  this.slides=[];this.currentSlide=0;this.mediaCache.clear();this.relationships.clear();
  try{
    const pdfPath=await this.renderAccuratePreview(file);
    if(!isActive())return;
    if(!pdfPath)throw new Error("No PDF preview was created");
    this.renderReviewerPdfPreviewUI(pdfPath);
  }catch(error){
    if(!isActive())return;
    if(await this.renderReviewerWindowsCompatibilityFallback(file,requestId,error))return;
    if(isActive())this.renderReviewerLocalizedError(error,file);
  }
};
