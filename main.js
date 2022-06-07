import { move, restore, zoom } from './pinch.js'
import events from './events.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = parseInt(getComputedStyle(canvas).width) * 2
canvas.height = parseInt(getComputedStyle(canvas).height) * 2

const image = new Image()
image.src = './eye.jpg'

const lines = [...Array(51).keys()]

image.onload = () => {
  const print = () => {
    ctx.drawImage(image, 350, 200)

    lines.forEach(y => {
      ctx.beginPath()
      ctx.rect(300, y * 20 - 2, 40, 2)
      ctx.fill()
    })
  }

  events(canvas, {
    options: {
      dpi: 1,
    },
    onMove: move,
    onPinch: zoom,
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
}
