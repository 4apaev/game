'use strict';

function sample(arr) {
  return arr[ 0|Math.random()*arr.length ];
}
function shuffle(arr) {
  return arr.sort((a, b) => Math.random() > .5 ? 1 : -1);
}
function serialize(obj) {
  return Object.keys(obj).map(k => [ k, obj[ k ] ].map(encodeURIComponent).join('=')).join('&');
}
function normalize(str) {
  return String(str).toLowerCase().trim();
}
function guid(prefix) {
  return prefix + Math.random().toString(16).slice(2);
}
function jsonp(url, terms) {
  let tmp, uid = guid('cb'), script = document.createElement('script');

  window[ uid ] = x => tmp = x;

  script.src = `${ url }?${ serialize(terms) }&callback=${ uid }`;
  document.head.appendChild(script);

  return new Promise((done, fail) => {
    script.onload = done;
    script.onerror = fail;
  })
    .then(() => {
      delete window[ uid ];
      script.onload = script.onerror = null;
      document.head.removeChild(script);
      return tmp;
    });
}

module.exports = { sample, shuffle, serialize, normalize, guid, jsonp }