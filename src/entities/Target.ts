import type { Position } from './Boat'

export class Target {
  public position: Position
  public readonly radius: number = 25
  private velocity: number = 30
  private direction: number = 1
  private canvasWidth: number

  constructor(x: number, y: number, canvasWidth: number) {
    this.position = { x, y }
    this.canvasWidth = canvasWidth
  }

  public update(deltaTime: number): void {
    this.position.x += this.velocity * this.direction * deltaTime / 1000

    if (this.position.x + this.radius >= this.canvasWidth) {
      this.direction = -1
      this.position.x = this.canvasWidth - this.radius
    } else if (this.position.x - this.radius <= 0) {
      this.direction = 1
      this.position.x = this.radius
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = '#FFB6C1'
    ctx.fill()
    ctx.strokeStyle = '#FF69B4'
    ctx.lineWidth = 3
    ctx.stroke()
  }

  public checkCollision(other: { position: Position; width: number; height: number }): boolean {
    const distanceX = this.position.x - other.position.x
    const distanceY = this.position.y - other.position.y
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

    const minDistance = this.radius + Math.max(other.width, other.height) / 2
    return distance < minDistance
  }

  public setBounds(newCanvasWidth: number): void {
    this.canvasWidth = newCanvasWidth
  }
}