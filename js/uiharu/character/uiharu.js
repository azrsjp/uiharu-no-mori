import {Character} from './character'
import {Config} from '../config'
import {InputData} from '../input-data'


class Uiharu extends Character {
  constructor(img, worldSize) {
    super(img, worldSize)
    this.pos = {x: (this.worldSize.w-this.img.width)/2, y: this.worldSize.h-(this.img.height+15)}
    this.currVel = 0
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.pos.x, this.pos.y)
  }

  update(inputPool) {
    this.move(inputPool)
  }

  move(inputPool) {
    const xOfs = -(Config.Character.Uiharu.Velocity * (inputPool & (1 << InputData.left))) + Config.Character.Uiharu.Velocity * ((inputPool & (1 << InputData.right)) >> InputData.right)
    this.pos.x += xOfs

    if (xOfs > 0) {
      if (this.pos.x >= this.worldSize.w - this.size.w){
        this.pos.x = this.worldSize.w - this.size.w
      }
    } else if (xOfs < 0) {
      if (this.pos.x <= 0) {
        this.pos.x = 0
      }
    }
  }
}

export {Uiharu}
