import { clamp } from './dump.js'

const clear = ctx => {
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.restore()
}

let scale = 1
const pos = { x: 0, y: 0 }

const _base =
  doWhatYouGottaDo =>
  (canvas, ...args) => {
    const ctx = canvas.getContext('2d')
    clear(ctx)

    const res = doWhatYouGottaDo(ctx, ...args)

    return res
  }

export const move = _base(
  (ctx, { x, y, bounding = { x: Infinity, y: Infinity } }) => {
    pos.x = pos.x + x
    pos.y = pos.y + y

    return { scale, pos }
  }
)

export const zoom = _base(
  (ctx, { focal, zoom, factor = 1, max = 10, min = 0.05 }) => {
    const atMax = scale === max || scale === min

    const at = {
      x: atMax ? pos.x : focal.x,
      y: atMax ? pos.y : focal.y,
    }

    scale = clamp(scale * zoom, min, max)

    pos.x = at.x - (at.x - pos.x) * zoom
    pos.y = at.y - (at.y - pos.y) * zoom

    return { pos, scale }
  }
)

export const restore = canvas => {
  const ctx = canvas.getContext('2d')
  clear(ctx)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}
