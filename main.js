import { move, restore, zoom } from './pinch.js'
import events from './events.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const setSize = () => {
  const { width, height } = getComputedStyle(canvas)
  canvas.width = parseInt(width) * window.devicePixelRatio
  canvas.height = parseInt(height) * window.devicePixelRatio
}

setSize()

window.addEventListener('resize', () => {
  setSize()
  print()
})

const apple = document.getElementById('apple')
const eye = document.getElementById('eye')

const lines = [...Array(1000).keys()]

const print = () => {
  ctx.drawImage(
    eye,
    (canvas.width / window.devicePixelRatio / 2) * 2.5,
    (canvas.height / window.devicePixelRatio / 2) * 1.5
  )
  ctx.drawImage(
    apple,
    canvas.width / window.devicePixelRatio / 2 - 1000,
    canvas.height / window.devicePixelRatio / 2 - 1000
  )

  ctx.font = '18px sans-serif'

  lines.forEach(y => {
    ctx.beginPath()
    ctx.rect(canvas.width / 2, y * 20 - 2, 40, 2)
    ctx.fillText(y, canvas.width / 2 - 40, y * 20 + 5)
    ctx.fill()
  })
}

events(canvas, {
  bounding: {
    x: 1000,
    y: 1000,
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
