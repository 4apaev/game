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

