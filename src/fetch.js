'use strict';

const { jsonp, sample, shuffle, normalize } = require('./util')
const { ARTISTS, ATTEMPTS, URL } = require('./config')

function fetchArtists(term, limit=100) {
    return jsonp(URL, { term, limit })
              .then(({ results }) => {
                  results.forEach(x => {
                      let name = x.artistName.toLowerCase()
                      ARTISTS.indexOf(name) === -1 && ARTISTS.push(name)
                  })
                  return ARTISTS
              })
  }

function fetchAlbums(artist=sample(ARTISTS)) {
    artist = normalize(artist);
    return jsonp(URL, {
        term: artist,
        // limit: ATTEMPTS
      })
      .then(({ results }) => ({
        artist,
        albums: shuffle(results).slice(0, ATTEMPTS)
      }))
  }

// fetchArtists('rock')
//   .then(() => shuffle(ARTISTS));

exports.albums = fetchAlbums;
exports.artists = fetchArtists;