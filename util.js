
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

