import events from './events.js'

const updater = (canvas, pos) => {
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // save
  ctx.transform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2)

  // ctx.transform(1, 0, 0, 1, 1, 1)
  ctx.transform(1, 0, 0, 1, pos.x, pos.y)
  // ctx.rotate((5 * Math.PI) / 180)

  // restore
  ctx.transform(1, 0, 0, 1, -canvas.width / 2, -canvas.height / 2)

  return 'updater!'
}

export default (canvas, print) => {
  canvas.style.touchAction = 'none'

  events(canvas, (...args) => {
    updater(...args)
    print()
  })

  return {
    restore: () => {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
    },
  }
}
