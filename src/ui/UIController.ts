import type { OrderType } from '../entities/Boat'
import { OrderSystem } from '../systems/OrderSystem'
import { GameState } from '../systems/GameState'

export class UIController {
  private orderSystem: OrderSystem
  private gameState: GameState

  private progressBar: HTMLElement
  private progressLabel: HTMLElement
  private currentOrderDisplay: HTMLElement
  private gameStateDisplay: HTMLElement

  constructor(orderSystem: OrderSystem, gameState: GameState) {
    this.orderSystem = orderSystem
    this.gameState = gameState

    this.progressBar = document.getElementById('order-progress-fill')!
    this.progressLabel = document.getElementById('order-progress-label')!
    this.currentOrderDisplay = document.getElementById('current-order')!
    this.gameStateDisplay = document.getElementById('game-state')!

    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    const buttonMappings = [
      { id: 'no-speed', orderType: 'NO_SPEED' as OrderType },
      { id: 'half-speed', orderType: 'HALF_SPEED' as OrderType },
      { id: 'full-speed', orderType: 'FULL_SPEED' as OrderType },
      { id: 'half-left', orderType: 'HALF_LEFT' as OrderType },
      { id: 'full-left', orderType: 'FULL_LEFT' as OrderType },
      { id: 'half-right', orderType: 'HALF_RIGHT' as OrderType },
      { id: 'full-right', orderType: 'FULL_RIGHT' as OrderType }
    ]

    buttonMappings.forEach(({ id, orderType }) => {
      const button = document.getElementById(id)!
      button.addEventListener('click', () => {
        this.orderSystem.addOrder(orderType)
        this.highlightButton(button)
      })
    })

    document.addEventListener('keydown', (event) => {
      if (event.key.toLowerCase() === 'r' && this.gameState.status === 'WON') {
        this.gameState.reset()
        this.updateUI()
      }
    })
  }

  private highlightButton(button: HTMLElement): void {
    document.querySelectorAll('.order-btn').forEach(btn => {
      btn.classList.remove('active')
    })
    button.classList.add('active')

    setTimeout(() => {
      button.classList.remove('active')
    }, 200)
  }

  public updateUI(): void {
    this.updateProgressBar()
    this.updateCurrentOrder()
    this.updateGameState()
  }

  private updateProgressBar(): void {
    const progress = this.orderSystem.getOrderProgress()
    const isInPreparation = this.orderSystem.isInPreparation()

    this.progressBar.style.width = `${progress * 100}%`

    if (isInPreparation) {
      this.progressBar.style.background = 'linear-gradient(90deg, #F59E0B, #D97706)'
      this.progressLabel.textContent = 'Preparing Order...'
    } else {
      this.progressBar.style.background = 'linear-gradient(90deg, #3B82F6, #2563EB)'
      this.progressLabel.textContent = 'Order Progress'
    }
  }

  private updateCurrentOrder(): void {
    const currentOrder = this.orderSystem.getCurrentOrder()
    const isInPreparation = this.orderSystem.isInPreparation()

    if (currentOrder && isInPreparation) {
      this.currentOrderDisplay.textContent = `Preparing: ${this.formatOrderType(currentOrder)}`
    } else {
      this.currentOrderDisplay.textContent = 'Current Order: None'
    }
  }

  private updateGameState(): void {
    if (this.gameState.status === 'WON') {
      this.gameStateDisplay.textContent = `TARGET REACHED! Score: ${this.gameState.score}`
    } else {
      const time = Math.floor(this.gameState.getGameTime() / 1000)
      this.gameStateDisplay.textContent = `Navigate the boat to the target! Time: ${time}s`
    }
  }

  private formatOrderType(orderType: OrderType): string {
    switch (orderType) {
      case 'NO_SPEED': return 'No Speed'
      case 'HALF_SPEED': return 'Half Speed'
      case 'FULL_SPEED': return 'Full Speed'
      case 'HALF_LEFT': return '1/2 Left'
      case 'FULL_LEFT': return 'Full Left'
      case 'HALF_RIGHT': return '1/2 Right'
      case 'FULL_RIGHT': return 'Full Right'
      default: return 'Unknown'
    }
  }
}