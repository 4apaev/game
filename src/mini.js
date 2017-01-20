((root, ATTEMPTS, MAXSCORE, STEP, URL, ARTISTS, sample, shuffle, renderScore, renderAlbum) => {
  class Game {
    constructor(el) {
        this.el = el
        this.el.addEventListener('change', e => e.target.matches('input[name=answer]') && this.guess(e.target.value))
        this.el.addEventListener('click', e => {
          if (e.target.matches('button[name=start]')) this.start()
          else if (e.target.matches('button[name=skip]')) this.next()
        })
      }
    start() {
        this.el.classList.toggle('spin', 1)
        this.score = STEP+MAXSCORE
        return jsonp(this.artist = sample(ARTISTS))
                  .then(albums => this.next(this.albums = albums.slice(0, ATTEMPTS).entries()))
                  .then(() => this.el.classList.toggle('spin'))
      }
    guess(answer) {
        return answer && String(answer).toLowerCase().trim()===this.artist ? this.render() : this.next();
      }
    next() {
        this.score-=STEP
        const { done, value } = this.albums.next();
        return done ? this.render() : this.render(...value);
      }
    render(attempt, album) {
        this.el.innerHTML = album ? renderAlbum(attempt+1===ATTEMPTS, album) : renderScore(this.score)
        return this
      }
  }
  function jsonp(artist) {
    let albums, s = document.createElement('script');
    root.cb = x => albums = x.results;
    s.src = URL + artist
    document.head.appendChild(s);
    return new Promise(done => s.onload = done).then(() => shuffle(albums))
  }
  document.addEventListener('DOMContentLoaded', e => root.game = new Game(document.getElementById('game')))
})(this, 3, 5, 'https://itunes.apple.com/search?callback=cb&term=', ['cure', 'vampire weekend', 'dead kennedys', 'nofx', 'nirvana', 'pantera', 'primus', 'clash'],
    arr => arr[ 0|Math.random()*arr.length ],
    arr => arr.sort((a, b) => Math.random() > .5 ? 1 : -1),
    score => `<button>You Score Is: ${ Math.max(+score, 0) }.\nStart New Game?</button>`,
    (hint, album) => `<label>who recorded <b>${ album.collectionName }</b>?</label>${ hint ? `<img src=${ album.artworkUrl100 }>` : ''}<input name=answer type=text placeholder="guess the artist"><button name=skip>skip</button>`)