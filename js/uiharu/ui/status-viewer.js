
class StatusViewer {
  constructor(size, score) {
    this.screenSize = size
    this.score = score
    this.isDisplayGameOver = false
  }

  setScore(score) {
    this.score = score
  }

  displayGameOver() {
    this.isDisplayGameOver = true
  }

  draw(ctx) {
    this.drawStatus(ctx)

    if(this.isDisplayGameOver) {
      this.drawGameOver(ctx)
    }
  }

  drawStatus(ctx) {
    ctx.font = "18pt Arial"
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillStyle = '#333'
    ctx.fillText("Score: " + this.score, 20, 20)
  }

  drawGameOver(ctx) {
    ctx.font = "24pt Arial"
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText("GameOver", this.screenSize.w * 0.5, this.screenSize.h * 0.5)
    ctx.font = "16pt Arial"
    ctx.fillStyle = '#666'
    ctx.fillText("Spaceを押してもう一度", this.screenSize.w * 0.5, this.screenSize.h * 0.5+30)
  }

  update() {
  }
}

export {StatusViewer}
