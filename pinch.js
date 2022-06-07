const _base =
  doWhatYouGottaDo =>
  (canvas, ...args) => {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width * 2, canvas.height * 2)

    ctx.transform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2)

    doWhatYouGottaDo(ctx, ...args)

    ctx.transform(1, 0, 0, 1, -canvas.width / 2, -canvas.height / 2)
  }

export const move = _base((ctx, { x, y }) => {
  const { a, d } = ctx.getTransform()
  ctx.translate(x / a, y / d)
})

let ax = 1

export const zoom = _base((ctx, { zoom, scale = 1, max = 100, min = 0.1 }) => {
  if (isNaN(zoom)) return

  const { a, b, c, d, e, f } = ctx.getTransform()

  ax = Math.max(min, Math.min(max, a + zoom / scale))

  ctx.setTransform(1, b, c, 1, e, f)
  ctx.scale(ax, ax)
})

export const restore = canvas => {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ax = 1
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}
