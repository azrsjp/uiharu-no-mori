import {default as Mousetrap} from 'mousetrap'

import {Config} from './config'
import {InputData} from './input-data'
import * as Res from './resource'
import * as UI from './ui'
import * as Chr from './character'


class Game {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.inputPool = 0

    this.keyHandlerPre = (e) => {
      // ...
    }

    this.keyHandlerPost = (e) => {
      e.preventDefault()
      return false
    }

    this.keyHandler = {
      noop: (e) => {
        this.keyHandlerPre(e)
        return this.keyHandlerPost(e)
      }, // noop

      horizontal: (e) => {
        this.keyHandlerPre(e)
        const mask = e.keyCode == 37 ? InputData.left : InputData.right

        switch (e.type) {
          case 'keydown': {
            this.inputPool |= 1 << mask
            break
          }
          case 'keyup': {
            this.inputPool ^= 1 << mask
            break
          }
        }

        return this.keyHandlerPost(e)
      }, // horizontal

      space: (e) => {
        this.keyHandlerPre(e)

        if (this.isGameOver){
          this.start()
        }

        return this.keyHandlerPost(e)
      }, // space
    } // keyHandler
  }

  start() {
    this.init(() => {
      Mousetrap.bind('up', this.keyHandler.noop.bind(this))
      Mousetrap.bind('down', this.keyHandler.noop.bind(this))

      Mousetrap.bind('left', this.keyHandler.horizontal.bind(this), 'keydown')
      Mousetrap.bind('left', this.keyHandler.horizontal.bind(this), 'keyup')
      Mousetrap.bind('right', this.keyHandler.horizontal.bind(this), 'keydown')
      Mousetrap.bind('right', this.keyHandler.horizontal.bind(this), 'keyup')

      Mousetrap.bind('space', this.keyHandler.space.bind(this))

      this.loops()
    })
  }

  init(onInitialized) {
    this.score = 0
    this.isGameOver = false
    this.statusViewer = new UI.StatusViewer({w: this.width, h: this.height}, this.score)

    // Load Resources
    this.res = new Res.Factory(function() {
      const hitCallback = (showerPos) => {
        const uiharuPos = this.uiharu.pos
        const uiharuSize = this.uiharu.size

        if(showerPos.x <= uiharuPos.x+uiharuSize.w && uiharuPos.x <= showerPos.x && uiharuPos.y <= showerPos.y && showerPos.y <= uiharuPos.y+10){
          if(!this.isGameOver){
            this.score++
          }
          return true
        }

        return false
      }

      const worldSize = {w: this.width, h: this.height}
      this.uiharu = new Chr.Uiharu(this.res.get(['character', 'uiharu', 'uiharu']), worldSize)
      this.saten = new Chr.Saten(this.res.get(['character', 'saten', 'saten']), worldSize, hitCallback, () => { this.isGameOver = true })
      this.background = new UI.Background(this.res.get('bg', Res.FetchPolicy.filter))

      onInitialized()
    }.bind(this))
  }

  loops() {
    this.draw()
    this.update()

    if(this.isGameOver) {
      this.endGame()
      return
    }

    requestAnimationFrame(() => { this.loops() })
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.background.draw(this.ctx)
    this.uiharu.draw(this.ctx)
    this.saten.draw(this.ctx)
    this.statusViewer.draw(this.ctx)
  }

  update() {
    this.background.update(this.score)
    this.uiharu.update(this.inputPool)
    this.saten.update()
    this.statusViewer.setScore(this.score)
    this.statusViewer.update()
  }

  endGame() {
    this.statusViewer.displayGameOver()
    this.draw()
    this.genTweetButton()
  }

  genTweetButton() {
    let url = new URL('http://twitter.com/share')
    url.searchParams.append('url', location.href.toString())
    url.searchParams.append('text', `初春の森で遊んだ結果、 ${this.score} 本の草木が生い茂りました！`)
    url.searchParams.append('hashtags', ['初春の森', '初春可愛い'].join(','))

    let button = document.getElementById('tweetButton')
    button.href = url
    button.style.display = 'block'
  }
}

export {Game}
