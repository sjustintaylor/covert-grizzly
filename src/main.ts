import './style.css'
import * as MainLoop from 'mainloop.js'
import { GameState } from './systems/GameState'
import { UIController } from './ui/UIController'

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
const ctx = canvas.getContext('2d')!

let gameState: GameState
let uiController: UIController

function resizeCanvas() {
  const container = document.querySelector('#canvas-container')!
  const containerRect = container.getBoundingClientRect()

  const newWidth = containerRect.width - 40 // Account for padding and border
  const newHeight = containerRect.height - 40

  // Set canvas size to match the container
  canvas.width = newWidth
  canvas.height = newHeight

  // Set the actual display size via CSS (should already be handled by CSS)
  canvas.style.width = '100%'
  canvas.style.height = '100%'

  // Update game state if it exists
  if (gameState) {
    gameState.resize(newWidth, newHeight)
  }
}

// Initial resize
resizeCanvas()

// Handle window resize
window.addEventListener('resize', resizeCanvas)

gameState = new GameState(canvas.width, canvas.height)
uiController = new UIController(gameState.orderSystem, gameState)

function update(delta: number) {
  gameState.update(delta)
  uiController.updateUI()
}

function draw() {
  gameState.render(ctx)
}

MainLoop.setUpdate(update).setDraw(draw).start()
