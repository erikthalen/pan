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

const clear = () => {
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.restore()
}

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
  ;[...Array(1000).keys()].forEach(y => {
    ctx.beginPath()
    ctx.rect(canvas.width / 2, y * 20 - 2, 40, 2)
    ctx.fillText(y, canvas.width / 2 - 40, y * 20 + 5)
    ctx.fill()
  })
}

events(canvas)

canvas.addEventListener('pan', ({ detail: { scale, position } }) => {
  clear()
  ctx.setTransform(scale, 0, 0, scale, position.x, position.y)
  print()
})

print()
