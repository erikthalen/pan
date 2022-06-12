function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}

export default (
  canvas,
  {
    dpi = window.devicePixelRatio,
    bounding = null,

    onUpdate = () => {},
    onTwoFingerMove = () => {},
    onTwoFingerPinch = () => {},
  }
) => {
  const ctx = canvas.getContext('2d')

  canvas.style.touchAction = 'none'
  canvas.style.userSelect = 'none'
  canvas.style.webkitUserSelect = 'none'

  let fingers = {}
  let lastDistance = null

  const handlePointerdown = e => {
    e.preventDefault()

    fingers[e.pointerId] = {
      id: e.pointerId,
      x: e.offsetX,
      y: e.offsetY,
      deltaX: 0,
      deltaY: 0,
    }

    console.log('PointerDown', e)
    canvas.addEventListener('pointerleave', handlePointerup, { once: true })
  }

  const handlePointermove = e => {
    e.preventDefault()

    if (!fingers[e.pointerId]) return
    if (Object.keys(fingers).length !== 2) return

    fingers[e.pointerId] = {
      id: e.pointerId,
      x: e.offsetX,
      y: e.offsetY,
      deltaX: e.offsetX - fingers[e.pointerId].x,
      deltaY: e.offsetY - fingers[e.pointerId].y,
    }
    const { pos } = onTwoFingerMove(canvas, {
      x: fingers[e.pointerId].deltaX * dpi,
      y: fingers[e.pointerId].deltaY * dpi,
    })

    const fingersArray = Object.values(fingers)

    const distance = Math.sqrt(
      Math.pow(fingersArray[1].x - fingersArray[0].x, 2) +
        Math.pow(fingersArray[1].y - fingersArray[0].y, 2)
    )

    const { scale } = onTwoFingerPinch(canvas, {
      focal: { x: e.offsetX * dpi, y: e.offsetY * dpi },
      zoom: !lastDistance ? 1 : 1 + (distance - lastDistance) / 200,
    })

    ctx.setTransform(scale, 0, 0, scale, pos.x, pos.y)

    lastDistance = distance

    onUpdate()
  }

  const handlePointerup = e => {
    e.preventDefault()

    delete fingers[e.pointerId]
    lastDistance = null
  }

  if (isTouchDevice()) {
    canvas.addEventListener('pointerdown', handlePointerdown)
    canvas.addEventListener('pointermove', handlePointermove)
    canvas.addEventListener('pointerup', handlePointerup)
    canvas.addEventListener('pointercancel', handlePointerup)
  } else {
    const ctx = canvas.getContext('2d')

    canvas.addEventListener('wheel', e => {
      e.preventDefault()

      if (e.ctrlKey) {
        const { scale, pos } = onTwoFingerPinch(canvas, {
          focal: { x: e.offsetX * dpi, y: e.offsetY * dpi },
          zoom: 1 - e.deltaY / 100,
        })

        ctx.setTransform(scale, 0, 0, scale, pos.x, pos.y)
      } else {
        const { scale, pos } = onTwoFingerMove(canvas, {
          x: -e.deltaX,
          y: -e.deltaY,
        })

        ctx.setTransform(scale, 0, 0, scale, pos.x, pos.y)
      }

      onUpdate()
    })
  }

  window.addEventListener('resize', () => {
    onTwoFingerMove(canvas, { x: 0, y: 0 })
    onUpdate()
  })
}
