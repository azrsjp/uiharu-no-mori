import {Character} from './character'
import * as Eff from '../effect'
import * as Geo from '../geo'


class Saten extends Character {
  constructor(img, worldSize, onHitShowerCallback, onGameEndCallback) {
    super(img, worldSize)
    this.pos = {x: (worldSize.w-this.img.width)/2, y: 50}
    this.minDist = 60
    this.baseDuration = 1000
    this.moveTo = new Geo.MovePath(this.worldSize.w-this.size.w, this.pos.x, this.minDist, this.baseDuration)
    this.lastTime = new Date().getTime()
    this.fromT = this.lastTime
    this.fromX = this.pos.x

    this.state = false
    this.distT = new Date().getTime() + 1000

    this.showers = new Eff.Showers(onHitShowerCallback, onGameEndCallback)
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.pos.x, this.pos.y)
    this.showers.draw(ctx)
  }

  update() {
    this.move()
    this.shower()

    this.showers.update()
  }

  move() {
    const now = new Date().getTime()
    const progress = (now - this.fromT)/this.moveTo.duration

    this.pos.x = (this.moveTo.distX-this.fromX)*progress + this.fromX

    if(progress >= 1){
      this.moveTo = new Geo.MovePath(this.worldSize.w-this.size.w, this.pos.x, this.minDist, this.baseDuration)
      this.fromT = now
      this.fromX = this.pos.x
    }
  }

  shower() {
    const now = new Date().getTime()

    if(now >= this.distT){
      this.state = !this.state
      this.distT = (now + 100 + Math.random()*2000)
    }

    if(this.state){
      var orgPos = {x: this.pos.x+5, y: this.pos.y+this.size.h-10}
      this.showers.generate(orgPos, this.worldSize.h)
    }
  }
}

export {Saten}
