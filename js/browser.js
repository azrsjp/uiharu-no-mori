import * as Uiharu from './uiharu'

document.addEventListener('DOMContentLoaded', () => {
  let g = new Uiharu.Game(document.getElementById('game'))
  g.start()
})
