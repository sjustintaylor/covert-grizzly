export interface Position {
  x: number
  y: number
}

export type OrderType =
  | 'NO_SPEED'
  | 'HALF_SPEED'
  | 'FULL_SPEED'
  | 'HALF_LEFT'
  | 'FULL_LEFT'
  | 'HALF_RIGHT'
  | 'FULL_RIGHT'

export interface Order {
  type: OrderType
  duration: number
  startTime: number
}

export class Boat {
  public position: Position
  public velocity: Position
  public readonly width: number = 60
  public readonly height: number = 30
  public currentOrder: Order | null = null
  public orderQueue: Order[] = []

  private readonly maxSpeed: number = 100

  constructor(x: number, y: number) {
    this.position = { x, y }
    this.velocity = { x: 0, y: 0 }
  }

  public addOrder(orderType: OrderType, duration: number = 3000): void {
    const order: Order = {
      type: orderType,
      duration,
      startTime: Date.now()
    }
    this.orderQueue.push(order)
  }

  public update(deltaTime: number): void {
    this.processOrders()
    this.updateMovement(deltaTime)
  }

  private processOrders(): void {
    if (!this.currentOrder && this.orderQueue.length > 0) {
      this.currentOrder = this.orderQueue.shift()!
      this.currentOrder.startTime = Date.now()
    }

    if (this.currentOrder) {
      const elapsed = Date.now() - this.currentOrder.startTime
      if (elapsed >= this.currentOrder.duration) {
        this.currentOrder = null
      }
    }
  }

  private updateMovement(deltaTime: number): void {
    if (!this.currentOrder) {
      this.velocity.x *= 0.95
      this.velocity.y *= 0.95
      this.position.x += this.velocity.x * deltaTime / 1000
      this.position.y += this.velocity.y * deltaTime / 1000
      return
    }

    const speedMultiplier = this.getSpeedMultiplier()
    const turnMultiplier = this.getTurnMultiplier()

    switch (this.currentOrder.type) {
      case 'NO_SPEED':
        this.velocity.x *= 0.9
        this.velocity.y *= 0.9
        break
      case 'HALF_SPEED':
        this.velocity.y = -this.maxSpeed * speedMultiplier * 0.5
        break
      case 'FULL_SPEED':
        this.velocity.y = -this.maxSpeed * speedMultiplier
        break
      case 'HALF_LEFT':
        this.velocity.x = -this.maxSpeed * turnMultiplier * 0.5
        break
      case 'FULL_LEFT':
        this.velocity.x = -this.maxSpeed * turnMultiplier
        break
      case 'HALF_RIGHT':
        this.velocity.x = this.maxSpeed * turnMultiplier * 0.5
        break
      case 'FULL_RIGHT':
        this.velocity.x = this.maxSpeed * turnMultiplier
        break
    }

    this.position.x += this.velocity.x * deltaTime / 1000
    this.position.y += this.velocity.y * deltaTime / 1000
  }

  private getSpeedMultiplier(): number {
    return 1.0
  }

  private getTurnMultiplier(): number {
    return 1.0
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#FF69B4'
    ctx.fillRect(
      this.position.x - this.width / 2,
      this.position.y - this.height / 2,
      this.width,
      this.height
    )

    ctx.fillStyle = '#FF1493'
    ctx.fillRect(
      this.position.x - this.width / 2 + 5,
      this.position.y - this.height / 2 + 5,
      this.width - 10,
      this.height - 10
    )
  }

  public getOrderProgress(): number {
    if (!this.currentOrder) return 0
    const elapsed = Date.now() - this.currentOrder.startTime
    return Math.min(elapsed / this.currentOrder.duration, 1)
  }

  public getCurrentOrderType(): OrderType | null {
    return this.currentOrder?.type || null
  }
}