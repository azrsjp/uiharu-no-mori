import {Config} from '../config'

class MovePath {
  static calcDuration(base, randFactor) {
    return base + Math.random() * randFactor
  }

  constructor(maxX, nowX, minDist, baseDuration){
    while (true) {
      this.distX = Math.floor(Math.random()*maxX)
      this.duration = MovePath.calcDuration(baseDuration, 1500)
      if(Math.abs(nowX - this.distX) >= minDist && Config.Character.Uiharu.Velocity * (this.duration/1000)*60 > this.distX){
        break
      }
    }

    this.duration = MovePath.calcDuration(baseDuration, 1500)
  }
}

export {MovePath}
