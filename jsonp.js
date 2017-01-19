const { serialize } = require('./util');

module.exports = jsonp;
function jsonp(url, terms) {
    let res,
        uid = `cb_${ Math.random().toString(16).slice(2) }`,
        script = document.createElement('script');

    window[ uid ] = x => res = x;

    script.src = `${ url }?${ serialize(terms) }&callback=${ uid }`

    document.head.appendChild(script);

    return new Promise((done, fail) => {
      script.onload = done;
      script.onerror = fail;
    })
      .then(() => {
        delete window[ uid ];
        script.onload = script.onerror = null;
        document.head.removeChild(script);
        return res;
      });
  }
