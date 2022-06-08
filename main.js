import { move, restore, zoom } from './pinch.js'
import events from './events.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = parseInt(getComputedStyle(canvas).width) * 2
canvas.height = parseInt(getComputedStyle(canvas).height) * 2

const apple = document.getElementById('apple')
const eye = document.getElementById('eye')

const lines = [...Array(1000).keys()]

const print = () => {
  ctx.drawImage(eye, 450, 200)
  ctx.drawImage(apple, -1000, -1000)

  ctx.font = '18px sans-serif'

  lines.forEach(y => {
    ctx.beginPath()
    ctx.rect(300, y * 20 - 2, 40, 2)
    ctx.fillText(y, 260, y * 20 + 5)
    ctx.fill()
  })
}

events(canvas, {
  options: {
    dpi: 1,
    bounding: {
      x: 1000,
      y: 1000
    }
  },
  onTwoFingerMove: move,
  onTwoFingerPinch: zoom,
  onUpdate: print,
})

print()

document.querySelector('.button-1')?.addEventListener('click', () => {
  const z = zoom(canvas, { zoom: 0.3 })
  print()

  console.log(z)
})

document.querySelector('.button-3')?.addEventListener('click', () => {
  const z = zoom(canvas, { zoom: -0.3 })
  print()

  console.log(z)
})

document.querySelector('.button-2')?.addEventListener('click', () => {
  restore(canvas)
  print()
})
