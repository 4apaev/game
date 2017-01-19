(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Game = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

module.exports = {
  URL       : 'https://itunes.apple.com/search',
  ATTEMPTS  : 3,
  ARTISTS   : [ "Cure", "Vampire Weekend", "Florence + The Machine", "Tom Tom Club", "Dead Kennedys", "NOFX", "Nirvana", "Pantera", "Primus", "The Clash" ]
}
},{}],2:[function(require,module,exports){
const { normalize } = require('./util')
const { ATTEMPTS } = require('./config')
const getAlbums = require('./getAlbums')


module.exports = class Game {

  constructor(el) {
    this.el = el
    this.el.addEventListener('click', e => {
      if (e.target.matches('button')) {
        this.start()
        return Game.stop(e)
      }
    })

    this.el.addEventListener('change', e => {
      this.guess(e.target.value)
      return Game.stop(e)
    })
  }

  start() {
    return getAlbums().then(({ albums, artist }) => {
      this.artist = artist
      this.albums = albums.entries()
    }).then(() => this.next())
  }

  next() {
      let { done, value } = this.albums.next()
      return done ? this.end(0) : this.render(...value)
    }

  guess(answer) {
    if (answer && normalize(answer)===this.artist) {
        this.el.innerHTML = `<button>start new game</button>`
        return this.end(1)
      } else {
        return this.next()
      }
  }

  end(ok) {
    delete this.artist
    delete this.albums
    this.el.innerHTML = `<h3>You ${ ok ? 'Win' : 'Lose' }!</h3><button name="start">start new game</button>`
    return this
  }

  render(attempt, { name, art }) {
      let html = [ `<label>who recorded <b>${ name }</b>?</label>` ]
      this.isLast(attempt) && html.push(`<img src=${ art }>`)
      html.push(`<input id="answer" type="text">`)
      this.el.innerHTML = html.join('')
      return this
    }

  isLast(attempt) {
      return attempt+1===ATTEMPTS
    }

  static stop(e) {
    e.preventDefault()
    e.stopPropagation()
    return false;
  }
}
},{"./config":1,"./getAlbums":3,"./util":5}],3:[function(require,module,exports){
const jsonp = require('./jsonp')
const { rename, sample, shuffle, normalize } = require('./util')
const { ATTEMPTS, ARTISTS, URL } = require('./config')

module.exports = getAlbums;

function getAlbums(artist=sample(ARTISTS)) {
    artist = normalize(artist);
    return jsonp(URL, { entity: 'album', term: artist })
              .then(({ results=[] }={}) => {
                const albums = shuffle(results).slice(0, ATTEMPTS).map(rename)
                return { artist, albums }
              })
  }


},{"./config":1,"./jsonp":4,"./util":5}],4:[function(require,module,exports){
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

},{"./util":5}],5:[function(require,module,exports){

module.exports = { rename, normalize, sample, shuffle, serialize }

function rename(album) {
    return { name: album.collectionName, art: album.artworkUrl100 }
  }

function normalize(x) {
    return String(x).toLowerCase().trim()
  }

function sample(arr) {
    return arr[ 0|Math.random()*arr.length ]
  }

function shuffle(arr) {
    return arr.sort((a, b) => Math.random() > .5 ? 1 : -1)
  }

function serialize(o) {
      return Object.keys(o).map(k => [ k, o[ k ] ].map(encodeURIComponent).join('=')).join('&')
    }
// function insert(el, html) {
//     return el.insertAdjacentHTML('beforeEnd', html);
//   }


},{}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5ucG0tcGFja2FnZXMvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb25maWcuanMiLCJnYW1lLmpzIiwiZ2V0QWxidW1zLmpzIiwianNvbnAuanMiLCJ1dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbm1vZHVsZS5leHBvcnRzID0ge1xuICBVUkwgICAgICAgOiAnaHR0cHM6Ly9pdHVuZXMuYXBwbGUuY29tL3NlYXJjaCcsXG4gIEFUVEVNUFRTICA6IDMsXG4gIEFSVElTVFMgICA6IFsgXCJDdXJlXCIsIFwiVmFtcGlyZSBXZWVrZW5kXCIsIFwiRmxvcmVuY2UgKyBUaGUgTWFjaGluZVwiLCBcIlRvbSBUb20gQ2x1YlwiLCBcIkRlYWQgS2VubmVkeXNcIiwgXCJOT0ZYXCIsIFwiTmlydmFuYVwiLCBcIlBhbnRlcmFcIiwgXCJQcmltdXNcIiwgXCJUaGUgQ2xhc2hcIiBdXG59IiwiY29uc3QgeyBub3JtYWxpemUgfSA9IHJlcXVpcmUoJy4vdXRpbCcpXG5jb25zdCB7IEFUVEVNUFRTIH0gPSByZXF1aXJlKCcuL2NvbmZpZycpXG5jb25zdCBnZXRBbGJ1bXMgPSByZXF1aXJlKCcuL2dldEFsYnVtcycpXG5cblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBHYW1lIHtcblxuICBjb25zdHJ1Y3RvcihlbCkge1xuICAgIHRoaXMuZWwgPSBlbFxuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCdidXR0b24nKSkge1xuICAgICAgICB0aGlzLnN0YXJ0KClcbiAgICAgICAgcmV0dXJuIEdhbWUuc3RvcChlKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGUgPT4ge1xuICAgICAgdGhpcy5ndWVzcyhlLnRhcmdldC52YWx1ZSlcbiAgICAgIHJldHVybiBHYW1lLnN0b3AoZSlcbiAgICB9KVxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgcmV0dXJuIGdldEFsYnVtcygpLnRoZW4oKHsgYWxidW1zLCBhcnRpc3QgfSkgPT4ge1xuICAgICAgdGhpcy5hcnRpc3QgPSBhcnRpc3RcbiAgICAgIHRoaXMuYWxidW1zID0gYWxidW1zLmVudHJpZXMoKVxuICAgIH0pLnRoZW4oKCkgPT4gdGhpcy5uZXh0KCkpXG4gIH1cblxuICBuZXh0KCkge1xuICAgICAgbGV0IHsgZG9uZSwgdmFsdWUgfSA9IHRoaXMuYWxidW1zLm5leHQoKVxuICAgICAgcmV0dXJuIGRvbmUgPyB0aGlzLmVuZCgwKSA6IHRoaXMucmVuZGVyKC4uLnZhbHVlKVxuICAgIH1cblxuICBndWVzcyhhbnN3ZXIpIHtcbiAgICBpZiAoYW5zd2VyICYmIG5vcm1hbGl6ZShhbnN3ZXIpPT09dGhpcy5hcnRpc3QpIHtcbiAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSBgPGJ1dHRvbj5zdGFydCBuZXcgZ2FtZTwvYnV0dG9uPmBcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5kKDEpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KClcbiAgICAgIH1cbiAgfVxuXG4gIGVuZChvaykge1xuICAgIGRlbGV0ZSB0aGlzLmFydGlzdFxuICAgIGRlbGV0ZSB0aGlzLmFsYnVtc1xuICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gYDxoMz5Zb3UgJHsgb2sgPyAnV2luJyA6ICdMb3NlJyB9ITwvaDM+PGJ1dHRvbiBuYW1lPVwic3RhcnRcIj5zdGFydCBuZXcgZ2FtZTwvYnV0dG9uPmBcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgcmVuZGVyKGF0dGVtcHQsIHsgbmFtZSwgYXJ0IH0pIHtcbiAgICAgIGxldCBodG1sID0gWyBgPGxhYmVsPndobyByZWNvcmRlZCA8Yj4keyBuYW1lIH08L2I+PzwvbGFiZWw+YCBdXG4gICAgICB0aGlzLmlzTGFzdChhdHRlbXB0KSAmJiBodG1sLnB1c2goYDxpbWcgc3JjPSR7IGFydCB9PmApXG4gICAgICBodG1sLnB1c2goYDxpbnB1dCBpZD1cImFuc3dlclwiIHR5cGU9XCJ0ZXh0XCI+YClcbiAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gaHRtbC5qb2luKCcnKVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgaXNMYXN0KGF0dGVtcHQpIHtcbiAgICAgIHJldHVybiBhdHRlbXB0KzE9PT1BVFRFTVBUU1xuICAgIH1cblxuICBzdGF0aWMgc3RvcChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufSIsImNvbnN0IGpzb25wID0gcmVxdWlyZSgnLi9qc29ucCcpXG5jb25zdCB7IHJlbmFtZSwgc2FtcGxlLCBzaHVmZmxlLCBub3JtYWxpemUgfSA9IHJlcXVpcmUoJy4vdXRpbCcpXG5jb25zdCB7IEFUVEVNUFRTLCBBUlRJU1RTLCBVUkwgfSA9IHJlcXVpcmUoJy4vY29uZmlnJylcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRBbGJ1bXM7XG5cbmZ1bmN0aW9uIGdldEFsYnVtcyhhcnRpc3Q9c2FtcGxlKEFSVElTVFMpKSB7XG4gICAgYXJ0aXN0ID0gbm9ybWFsaXplKGFydGlzdCk7XG4gICAgcmV0dXJuIGpzb25wKFVSTCwgeyBlbnRpdHk6ICdhbGJ1bScsIHRlcm06IGFydGlzdCB9KVxuICAgICAgICAgICAgICAudGhlbigoeyByZXN1bHRzPVtdIH09e30pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhbGJ1bXMgPSBzaHVmZmxlKHJlc3VsdHMpLnNsaWNlKDAsIEFUVEVNUFRTKS5tYXAocmVuYW1lKVxuICAgICAgICAgICAgICAgIHJldHVybiB7IGFydGlzdCwgYWxidW1zIH1cbiAgICAgICAgICAgICAgfSlcbiAgfVxuXG4iLCJjb25zdCB7IHNlcmlhbGl6ZSB9ID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ganNvbnA7XG5mdW5jdGlvbiBqc29ucCh1cmwsIHRlcm1zKSB7XG4gICAgbGV0IHJlcyxcbiAgICAgICAgdWlkID0gYGNiXyR7IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMTYpLnNsaWNlKDIpIH1gLFxuICAgICAgICBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblxuICAgIHdpbmRvd1sgdWlkIF0gPSB4ID0+IHJlcyA9IHg7XG5cbiAgICBzY3JpcHQuc3JjID0gYCR7IHVybCB9PyR7IHNlcmlhbGl6ZSh0ZXJtcykgfSZjYWxsYmFjaz0keyB1aWQgfWBcblxuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgoZG9uZSwgZmFpbCkgPT4ge1xuICAgICAgc2NyaXB0Lm9ubG9hZCA9IGRvbmU7XG4gICAgICBzY3JpcHQub25lcnJvciA9IGZhaWw7XG4gICAgfSlcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgZGVsZXRlIHdpbmRvd1sgdWlkIF07XG4gICAgICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25lcnJvciA9IG51bGw7XG4gICAgICAgIGRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH0pO1xuICB9XG4iLCJcbm1vZHVsZS5leHBvcnRzID0geyByZW5hbWUsIG5vcm1hbGl6ZSwgc2FtcGxlLCBzaHVmZmxlLCBzZXJpYWxpemUgfVxuXG5mdW5jdGlvbiByZW5hbWUoYWxidW0pIHtcbiAgICByZXR1cm4geyBuYW1lOiBhbGJ1bS5jb2xsZWN0aW9uTmFtZSwgYXJ0OiBhbGJ1bS5hcnR3b3JrVXJsMTAwIH1cbiAgfVxuXG5mdW5jdGlvbiBub3JtYWxpemUoeCkge1xuICAgIHJldHVybiBTdHJpbmcoeCkudG9Mb3dlckNhc2UoKS50cmltKClcbiAgfVxuXG5mdW5jdGlvbiBzYW1wbGUoYXJyKSB7XG4gICAgcmV0dXJuIGFyclsgMHxNYXRoLnJhbmRvbSgpKmFyci5sZW5ndGggXVxuICB9XG5cbmZ1bmN0aW9uIHNodWZmbGUoYXJyKSB7XG4gICAgcmV0dXJuIGFyci5zb3J0KChhLCBiKSA9PiBNYXRoLnJhbmRvbSgpID4gLjUgPyAxIDogLTEpXG4gIH1cblxuZnVuY3Rpb24gc2VyaWFsaXplKG8pIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvKS5tYXAoayA9PiBbIGssIG9bIGsgXSBdLm1hcChlbmNvZGVVUklDb21wb25lbnQpLmpvaW4oJz0nKSkuam9pbignJicpXG4gICAgfVxuLy8gZnVuY3Rpb24gaW5zZXJ0KGVsLCBodG1sKSB7XG4vLyAgICAgcmV0dXJuIGVsLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlRW5kJywgaHRtbCk7XG4vLyAgIH1cblxuIl19
