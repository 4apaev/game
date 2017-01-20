const { ATTEMPTS } = require('./config')

exports.score = (score, artist) => `
<label>Score: ${ Math.max(+score, 0) }, Artist: ${ artist }</label>
<button name=start>Start New Game?</button>`

exports.album = (attempt, hint, album={}) => {
  const img = hint ? `<img src=${ album.artworkUrl100 }>` : ''
  return `
<label>(${ attempt+1 }/${ ATTEMPTS }) Who Recorded <b>${ album.collectionName }?</b></label>${ img }
<div class=fx>
  <input name=answer type=text placeholder="guess the artist">
  <button name=skip>skip</button>
</div>
`;
}