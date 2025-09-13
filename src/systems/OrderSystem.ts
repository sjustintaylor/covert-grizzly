import { Boat } from '../entities/Boat'
import type { OrderType } from '../entities/Boat'

export interface Command {
  execute(): void
  getType(): OrderType
  getDuration(): number
}

export class MoveCommand implements Command {
  private boat: Boat
  private orderType: OrderType
  private duration: number

  constructor(boat: Boat, orderType: OrderType, duration: number = 3000) {
    this.boat = boat
    this.orderType = orderType
    this.duration = duration
  }

  execute(): void {
    this.boat.addOrder(this.orderType, this.duration)
  }

  getType(): OrderType {
    return this.orderType
  }

  getDuration(): number {
    return this.duration
  }
}

export class OrderSystem {
  private boat: Boat
  private commandQueue: Command[] = []
  private isProcessing: boolean = false

  constructor(boat: Boat) {
    this.boat = boat
  }

  public addCommand(command: Command): void {
    this.commandQueue.push(command)
    this.processNextCommand()
  }

  public addOrder(orderType: OrderType, duration: number = 3000): void {
    const command = new MoveCommand(this.boat, orderType, duration)
    this.addCommand(command)
  }

  private processNextCommand(): void {
    if (this.isProcessing || this.commandQueue.length === 0) {
      return
    }

    this.isProcessing = true
    const command = this.commandQueue.shift()!
    command.execute()
    this.isProcessing = false

    if (this.commandQueue.length > 0) {
      setTimeout(() => this.processNextCommand(), 100)
    }
  }

  public getQueuedOrders(): OrderType[] {
    return this.commandQueue.map(cmd => cmd.getType())
  }

  public clearQueue(): void {
    this.commandQueue = []
  }

  public getCurrentOrder(): OrderType | null {
    return this.boat.getCurrentOrderType()
  }

  public getOrderProgress(): number {
    return this.boat.getOrderProgress()
  }
}