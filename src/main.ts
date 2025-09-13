import './style.css'
import * as MainLoop from 'mainloop.js'
import { GameState } from './systems/GameState'
import { UIController } from './ui/UIController'

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
const ctx = canvas.getContext('2d')!

const gameState = new GameState(canvas.width, canvas.height)
const uiController = new UIController(gameState.orderSystem, gameState)

function update(delta: number) {
  gameState.update(delta)
  uiController.updateUI()
}

function draw() {
  gameState.render(ctx)
}

MainLoop.setUpdate(update).setDraw(draw).start()
