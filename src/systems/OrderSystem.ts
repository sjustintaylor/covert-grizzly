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

export type OrderSystemState = 'IDLE' | 'EXECUTING'

export class OrderSystem {
  private boat: Boat
  private commandQueue: Command[] = []
  private currentCommand: Command | null = null
  private state: OrderSystemState = 'IDLE'

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

  public update(): void {
    if (this.state === 'EXECUTING') {
      this.updateExecution()
    }
  }

  private processNextCommand(): void {
    if (this.state !== 'IDLE' || this.commandQueue.length === 0) {
      return
    }

    this.currentCommand = this.commandQueue.shift()!
    this.state = 'EXECUTING'
    this.currentCommand.execute()
  }

  private updateExecution(): void {
    if (!this.boat.getCurrentOrderType()) {
      this.state = 'IDLE'
      this.currentCommand = null
      this.processNextCommand()
    }
  }

  public getQueuedOrders(): OrderType[] {
    return this.commandQueue.map(cmd => cmd.getType())
  }

  public clearQueue(): void {
    this.commandQueue = []
    this.state = 'IDLE'
    this.currentCommand = null
  }

  public getCurrentOrder(): OrderType | null {
    return this.boat.getCurrentOrderType()
  }

  public getOrderProgress(): number {
    return this.boat.getOrderProgress()
  }

  public getSystemState(): OrderSystemState {
    return this.state
  }
}