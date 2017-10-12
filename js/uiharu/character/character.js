class Character {
  constructor(img, worldSize) {
    this.img = img
    this.worldSize = worldSize
    this.size = {w: this.img.width, h: this.img.height}
  }
}

export {Character}
