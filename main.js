import pinch from './pinch.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = parseInt(getComputedStyle(canvas).width) * 2
canvas.height = parseInt(getComputedStyle(canvas).height) * 2

const print = () => {
  ctx.beginPath()
  ctx.rect(400, 300, 550, 400)
  ctx.fillStyle = 'dodgerblue'
  ctx.fill()
}

pinch(canvas, print)

print()

document.querySelector('.button-1')?.addEventListener('click', () => {
  print()
})

document.querySelector('.button-2')?.addEventListener('click', () => {
  print()
})
