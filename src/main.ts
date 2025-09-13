import './style.css'
import * as MainLoop from 'mainloop.js'

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
const ctx = canvas.getContext('2d')!

interface Rectangle {
  x: number
  y: number
  width: number
  height: number
  speed: number
}

const rectangle: Rectangle = {
  x: 350,
  y: 0,
  width: 100,
  height: 50,
  speed: 60
}

function update(delta: number) {
  rectangle.y += rectangle.speed * delta / 1000
  
  if (rectangle.y > canvas.height) {
    rectangle.y = -rectangle.height
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  ctx.fillStyle = '#4f46e5'
  ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height)
}

MainLoop.setUpdate(update).setDraw(draw).start()
