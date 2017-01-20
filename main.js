const Game = require('./src/game')

document.addEventListener('DOMContentLoaded', function init() {
  window.game = new Game(document.getElementById('game'))
  document.removeEventListener('DOMContentLoaded', init)
})


