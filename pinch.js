import { clamp } from './dump.js'

const clear = ctx => {
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.restore()
}

const _base =
  doWhatYouGottaDo =>
  (canvas, ...args) => {
    const ctx = canvas.getContext('2d')
    clear(ctx)

    // begin
    ctx.transform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2)

    const res = doWhatYouGottaDo(ctx, ...args)

    ctx.transform(1, 0, 0, 1, -canvas.width / 2, -canvas.height / 2)

    return res
  }

export const move = _base((ctx, { x, y, bounding }) => {
  const { a, d, e, f } = ctx.getTransform()
  const n = {
    x: x / a,
    y: y / d,
  }

  console.log(e, f)

  if (bounding) {
    if (e + n.x < bounding.x && e + n.x > -bounding.x) {
      ctx.translate(n.x, 0)
    }
    if (f + n.y < bounding.y && f + n.y > -bounding.y) {
      ctx.translate(0, n.y)
    }
  } else {
    ctx.translate(n.x, n.y)
  }

  return n
})

let ax = 1

export const zoom = _base((ctx, { zoom, scale = 1, max = 200, min = 0.1 }) => {
  if (isNaN(zoom)) return

  const { a, b, c, d, e, f } = ctx.getTransform()

  const n = ax + (zoom / scale) * (ax / 2)

  ax = clamp(Math.round(n * 100) / 100, min, max)

  ctx.setTransform(1, b, c, 1, e, f)
  ctx.scale(ax, ax)

  return ax
})

export const restore = canvas => {
  const ctx = canvas.getContext('2d')
  clear(ctx)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ax = 1
}
