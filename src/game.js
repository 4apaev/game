'use strict';

const { ATTEMPTS, MAXSCORE, STEP } = require('./config')
const { normalize } = require('./util')
const templates = require('./templates')
const Fetch = require('./fetch')

module.exports = class Game {
  constructor(el) {
    this.el = el
    this.el.addEventListener('change', e => {
      e.target.matches('input[name=answer]') && this.guess(e.target.value)
    })

    this.el.addEventListener('click', e => {
      if (e.target.matches('button[name=start]'))
        return this.start()
      else if (e.target.matches('button[name=skip]'))
        return this.next()
    })
  }

  start() {
    this.el.classList.add('spin');
    return Fetch.albums().then(({ albums, artist }) => {
      this.artist = artist
      this.albums = albums.entries()
      this.score = STEP+MAXSCORE
      return this.next()
    })
      .then(() => this.el.classList.remove('spin'));
  }

  next() {
    this.score -=STEP;
    const { done, value } = this.albums.next();
    return done
      ? this.render()
      : this.render(...value);
  }

  guess(answer) {
    return answer && normalize(answer)===this.artist
      ? this.render()
      : this.next();
  }

  render(attempt, album) {
    this.el.innerHTML = album
      ? templates.album(attempt, this.isLast(attempt), album)
      : templates.score(this.score, this.artist);
    return this
  }

  isLast(attempt) {
    return attempt+1===ATTEMPTS
  }
}