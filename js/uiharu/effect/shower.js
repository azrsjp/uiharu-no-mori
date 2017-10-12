import {Config} from '../config'

class Shower {
  constructor(orgPos, aliveHeight, onHitShowerCallback, onGameEndCallback) {
    this.pos = orgPos
    this.onHitShowerCallback = onHitShowerCallback
    this.onGameEndCallback = onGameEndCallback

    this.aliveHeight = aliveHeight
    this.status = 1
    this.radius = 2
  }

  kill() {
    this.status = 0
  }

  draw(ctx) {
    if(!this.status){
      return
    }

    ctx.fillStyle = "#0061FF"
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2, false)
    ctx.fill()
  }

  update() {
    this.pos.y += Config.Effect.Shower.Velocity

    if (this.onHitShowerCallback(this.pos)){
      this.kill()
    }

    if (this.pos.y >= this.aliveHeight){
      this.kill()
      this.onGameEndCallback()
    }
  }
}

class Showers {
  constructor(onHitShowerCallback, onGameEndCallback) {
    this.onHitShowerCallback = onHitShowerCallback
    this.onGameEndCallback = onGameEndCallback
    this.showers = []
  }

  generate(orgPos, aliveHeight) {
    this.showers.push(new Shower(orgPos, aliveHeight, this.onHitShowerCallback, this.onGameEndCallback))
  }

  draw(ctx) {
    for (const s of this.showers) {
      s.draw(ctx)
    }
  }

  update() {
    this.showers = this.showers.filter((e) => {
        return !!e.status
    })

    for (const s of this.showers) {
      s.update()
    }
  }
}

export {Shower, Showers}
