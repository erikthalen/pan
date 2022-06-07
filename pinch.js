const _base =
  doWhatYouGottaDo =>
  (canvas, ...args) => {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.transform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2)

    doWhatYouGottaDo(ctx, ...args)
    // ctx.rotate((5 * Math.PI) / 180)

    ctx.transform(1, 0, 0, 1, -canvas.width / 2, -canvas.height / 2)
  }

export const move = _base((ctx, { x, y }) => {
  const { a, d } = ctx.getTransform()
  ctx.translate(x / a, y / d)
})

export const zoom = _base((ctx, { zoom }) => {
  ctx.scale(zoom, zoom)
})

export const restore = canvas => {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}
