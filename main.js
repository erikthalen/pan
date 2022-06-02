import pinch from './pinch.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const print = () => {
  ctx.beginPath()
  ctx.rect(400, 300, 550, 400)
  ctx.fillStyle = 'dodgerblue'
  ctx.fill()
}

const pincher = pinch(canvas, {
  onresize: print,
})

pincher.update()
print()

document.querySelector('.button-1')?.addEventListener('click', () => {
  pincher.update()
  print()
})

document.querySelector('.button-2')?.addEventListener('click', () => {
  pincher.restore()
  print()
})
