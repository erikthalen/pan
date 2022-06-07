import { move, restore, zoom } from './pinch.js'
import events from './events.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = parseInt(getComputedStyle(canvas).width) * 2
canvas.height = parseInt(getComputedStyle(canvas).height) * 2

const image = new Image()
image.src = './eye.jpg'

image.onload = () => {
  const print = () => {
    ctx.drawImage(image, 300, 200)
  }

  events(canvas, {
    onMove: move,
    onZoom: zoom,
    onUpdate: print,
  })

  // pinch(canvas, print)

  print()

  document.querySelector('.button-1')?.addEventListener('click', () => {
    zoom(canvas, { zoom: 1.3 })
    print()
  })

  document.querySelector('.button-2')?.addEventListener('click', () => {
    restore(canvas)
    print()
  })
}
