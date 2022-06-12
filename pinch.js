export const clamp = (val, min, max) => {
  return Math.max(min, Math.min(max, val))
}

let scale = 1
const position = { x: 0, y: 0 }

export const move = ({ x, y, bounding = { x: Infinity, y: Infinity } }) => {
  position.x = position.x + x
  position.y = position.y + y

  return { position, scale }
}

export const zoom = ({ focal, zoom, max = 10000, min = 0.05 }) => {
  const atMax = scale === max || scale === min

  scale = clamp(scale * zoom, min, max)

  const at = {
    x: atMax ? position.x : focal.x,
    y: atMax ? position.y : focal.y,
  }

  position.x = at.x - (at.x - position.x) * zoom
  position.y = at.y - (at.y - position.y) * zoom

  return { position, scale }
}

export const restore = canvas => {
  const ctx = canvas.getContext('2d')
  clear(ctx)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}
