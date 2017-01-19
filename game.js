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