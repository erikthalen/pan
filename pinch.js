import events from './events.js'

const updater = canvas => () => {
  const ctx = canvas.getContext('2d')
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // save
  ctx.transform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2)

  ctx.transform(1.3, 0, 0, 1.3, 0, 0)
  ctx.rotate((5 * Math.PI) / 180)

  // restore
  ctx.transform(1, 0, 0, 1, -canvas.width / 2, -canvas.height / 2)
}

export default (canvas, { onresize = () => {}, onupdate = () => {} }) => {
  canvas.style.touchAction = 'none'

  events(canvas)

  const ctx = canvas.getContext('2d')

  const update = updater(ctx, config)

  return {
    update,
    restore: () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
    },
  }
}
