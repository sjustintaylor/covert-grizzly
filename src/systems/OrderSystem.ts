import { Boat } from '../entities/Boat'
import type { OrderType } from '../entities/Boat'

export interface Command {
  execute(): void
  getType(): OrderType
  getDuration(): number
  getPreparationDuration(): number
}

export class MoveCommand implements Command {
  private boat: Boat
  private orderType: OrderType
  private duration: number
  private preparationDuration: number

  constructor(boat: Boat, orderType: OrderType, duration: number = 3000, preparationDuration: number = 2000) {
    this.boat = boat
    this.orderType = orderType
    this.duration = duration
    this.preparationDuration = preparationDuration
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

  getPreparationDuration(): number {
    return this.preparationDuration
  }
}

export type OrderSystemState = 'IDLE' | 'PREPARING' | 'EXECUTING'

export class OrderSystem {
  private boat: Boat
  private commandQueue: Command[] = []
  private currentCommand: Command | null = null
  private state: OrderSystemState = 'IDLE'
  private preparationStartTime: number = 0

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
    if (this.state === 'PREPARING') {
      this.updatePreparation()
    } else if (this.state === 'EXECUTING') {
      this.updateExecution()
    }
  }

  private processNextCommand(): void {
    if (this.state !== 'IDLE' || this.commandQueue.length === 0) {
      return
    }

    this.currentCommand = this.commandQueue.shift()!
    this.state = 'PREPARING'
    this.preparationStartTime = Date.now()
  }

  private updatePreparation(): void {
    if (!this.currentCommand) return

    const elapsed = Date.now() - this.preparationStartTime
    if (elapsed >= this.currentCommand.getPreparationDuration()) {
      this.state = 'EXECUTING'
      this.currentCommand.execute()
    }
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
    if (this.state === 'PREPARING' && this.currentCommand) {
      return this.currentCommand.getType()
    }
    return this.boat.getCurrentOrderType()
  }

  public getOrderProgress(): number {
    if (this.state === 'PREPARING' && this.currentCommand) {
      const elapsed = Date.now() - this.preparationStartTime
      return Math.min(elapsed / this.currentCommand.getPreparationDuration(), 1)
    }
    return this.boat.getOrderProgress()
  }

  public getSystemState(): OrderSystemState {
    return this.state
  }

  public isInPreparation(): boolean {
    return this.state === 'PREPARING'
  }
}