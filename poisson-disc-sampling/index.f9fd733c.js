var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},n={},o=e.parcelRequire400c;null==o&&((o=function(e){if(e in t)return t[e].exports;if(e in n){var o=n[e];delete n[e];var r={id:e,exports:{}};return t[e]=r,o.call(r.exports,r,r.exports),r.exports}var i=new Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(e,t){n[e]=t},e.parcelRequire400c=o);var r=o("6yEsn");const i=e=>{const t=performance.now(),n=r=>{e(r-t),o=requestAnimationFrame(n)};let o=requestAnimationFrame(n);return()=>cancelAnimationFrame(o)},l=(e,t,n,o)=>{const[r,i]=o;return r[e+t*i]=n,o},a=(e,t,n)=>{const[o,r]=n;return o[e+t*r]};function c(e,t){return Math.floor(Math.random()*(t-e)+e)}function h(e,t,n,o,i,l,c,h){if(e[0]>=0&&e[0]<t[0]&&e[1]>=0&&e[1]<t[1]){const t=Math.floor(e[0]/n),f=Math.floor(e[1]/n),u=Math.max(0,t-2),v=Math.min(t+2,c-1),m=Math.max(0,f-2),g=Math.min(f+2,h-1);for(let t=u;t<=v;t++)for(let n=m;n<=g;n++){const c=a(t,n,l)-1;if(-1!==c&&(s=e,d=i[c],r.vec2.sqrDist(s,d)<=o*o))return!1}return!0}var s,d;return!1}function*s(e,t,n,o=30){const i=e/Math.sqrt(2),a=Math.ceil(t[0]/i),s=Math.ceil(t[1]/i),d=(f=a,u=s,[new Int32Array(f*u),f,u]);var f,u;const v=[],m=[];m.push(n);let g=r.vec2.create(),w=r.vec2.create();for(;m.length>0;){const n=c(0,m.length),f=m[n];let u=!1;g=r.vec2.create(),w=r.vec2.create();for(let n=0;n<o;n++){g=r.vec2.random(g);const n=c(e,2*e);if(w=r.vec2.add(w,f,r.vec2.multiply(g,g,r.vec2.fromValues(n,n))),h(w,t,i,e,v,d,a,s)){v.push(w),m.push(w),l(Math.floor(w[0]/i),Math.floor(w[1]/i),v.length,d),u=!0,yield w;break}yield null}u||m.splice(n,1)}}function d(e,t,n){e.lineWidth=0,e.fillStyle="#a85a54",e.beginPath(),e.arc(t[0],t[1],n,0,2*Math.PI),e.closePath(),e.fill(),e.fillStyle="#FFFFFF",e.beginPath(),e.arc(t[0],t[1],.1*n,0,2*Math.PI),e.closePath(),e.fill()}(()=>{const e=document.getElementById("app")||document.createElement("canvas");e.width=e.clientWidth,e.height=e.clientHeight;const t=e.getContext("2d")||new CanvasRenderingContext2D,{width:n,height:o}=e,l=r.vec2.fromValues(2,2);let a=r.vec2.fromValues(n,o),c=r.vec2.fromValues(a[0]/2,a[1]/2);let h=s(10,a,c,30);window.onresize=()=>{e.width=e.clientWidth,e.height=e.clientHeight,a=r.vec2.set(a,e.width,e.height),c=r.vec2.divide(c,a,l),h=s(10,a,c,30),t.clearRect(0,0,e.width,e.height),v(),v=i(u)},document.addEventListener("click",(n=>{a=r.vec2.set(a,e.width,e.height),c=r.vec2.set(c,n.x,n.y),h=s(10,a,c,30),t.clearRect(0,0,e.width,e.height),v(),v=i(u)}));let f=0;const u=()=>{const e=Date.now();f++;do{const{done:e,value:n}=h.next();if(!e&&n&&d(t,n,5),e)return console.log({frameCount:f})}while(Date.now()-e<14.285714285714286)};let v=i(u)})();
//# sourceMappingURL=index.f9fd733c.js.map
