import {default as numeral} from 'numeral'
import {Config} from '../config'


class Background {
  constructor(imgs) {
    this.img = imgs.get('01')
    this.imgs = imgs
  }

  draw(ctx) {
    ctx.drawImage(this.img, 0, 0)
  }

  update(score) {
    for (const [i, s] of Config.scoreThres.entries()) {
      if (score >= s) {
        this.img = this.imgs.get(numeral(this.imgs.size - i).format('00'))
        break
      }
    }
  }
}

export {Background}
