import { Boat } from '../entities/Boat'
import { Target } from '../entities/Target'
import { OrderSystem } from './OrderSystem'

export type GameStatus = 'PLAYING' | 'WON' | 'PAUSED'

export class GameState {
  public boat: Boat
  public target: Target
  public orderSystem: OrderSystem
  public status: GameStatus = 'PLAYING'
  public score: number = 0
  public gameStartTime: number

  private canvasWidth: number
  private canvasHeight: number

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.gameStartTime = Date.now()

    this.boat = new Boat(canvasWidth / 2, canvasHeight - 80)
    this.target = new Target(canvasWidth / 2, 60, canvasWidth)
    this.orderSystem = new OrderSystem(this.boat)
  }

  public update(deltaTime: number): void {
    if (this.status !== 'PLAYING') {
      return
    }

    this.boat.update(deltaTime)
    this.target.update(deltaTime)

    this.keepBoatInBounds()
    this.checkCollisions()
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

    this.drawGameCanvas(ctx)
    this.target.render(ctx)
    this.boat.render(ctx)

    if (this.status === 'WON') {
      this.drawWinMessage(ctx)
    }
  }

  private drawGameCanvas(ctx: CanvasRenderingContext2D): void {
    // Create clean ocean background with subtle gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, this.canvasHeight)
    gradient.addColorStop(0, '#3B82F6')
    gradient.addColorStop(1, '#1E40AF')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)

    // Clean subtle border
    ctx.strokeStyle = '#1F2937'
    ctx.lineWidth = 1
    ctx.strokeRect(0, 0, this.canvasWidth, this.canvasHeight)
  }


  private keepBoatInBounds(): void {
    const margin = 10

    if (this.boat.position.x - this.boat.width / 2 < margin) {
      this.boat.position.x = margin + this.boat.width / 2
      this.boat.velocity.x = 0
    }

    if (this.boat.position.x + this.boat.width / 2 > this.canvasWidth - margin) {
      this.boat.position.x = this.canvasWidth - margin - this.boat.width / 2
      this.boat.velocity.x = 0
    }

    if (this.boat.position.y - this.boat.height / 2 < margin) {
      this.boat.position.y = margin + this.boat.height / 2
      this.boat.velocity.y = 0
    }

    if (this.boat.position.y + this.boat.height / 2 > this.canvasHeight - margin) {
      this.boat.position.y = this.canvasHeight - margin - this.boat.height / 2
      this.boat.velocity.y = 0
    }
  }

  private checkCollisions(): void {
    if (this.target.checkCollision(this.boat)) {
      this.status = 'WON'
      this.score = Math.max(0, 1000 - Math.floor((Date.now() - this.gameStartTime) / 100))
    }
  }

  private drawWinMessage(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)

    ctx.fillStyle = '#00FF00'
    ctx.font = 'bold 48px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('TARGET REACHED!', this.canvasWidth / 2, this.canvasHeight / 2 - 40)

    ctx.fillStyle = '#FFFFFF'
    ctx.font = '24px Arial'
    ctx.fillText(`Score: ${this.score}`, this.canvasWidth / 2, this.canvasHeight / 2 + 20)

    ctx.font = '18px Arial'
    ctx.fillText('Press R to restart', this.canvasWidth / 2, this.canvasHeight / 2 + 60)

    ctx.textAlign = 'left'
  }

  public reset(): void {
    this.status = 'PLAYING'
    this.score = 0
    this.gameStartTime = Date.now()

    this.boat = new Boat(this.canvasWidth / 2, this.canvasHeight - 80)
    this.target = new Target(this.canvasWidth / 2, 60, this.canvasWidth)
    this.orderSystem = new OrderSystem(this.boat)
  }

  public getGameTime(): number {
    return Date.now() - this.gameStartTime
  }

  public resize(newWidth: number, newHeight: number): void {
    const oldWidth = this.canvasWidth
    const oldHeight = this.canvasHeight

    this.canvasWidth = newWidth
    this.canvasHeight = newHeight

    // Scale boat position proportionally
    this.boat.position.x = (this.boat.position.x / oldWidth) * newWidth
    this.boat.position.y = (this.boat.position.y / oldHeight) * newHeight

    // Update target position and bounds
    this.target.position.x = (this.target.position.x / oldWidth) * newWidth
    this.target.position.y = (this.target.position.y / oldHeight) * newHeight
    this.target.setBounds(newWidth)
  }
}