export default (
  canvas,
  {
    options = {
      dpi: window.devicePixelRatio,
    },
    onUpdate = () => {},
    onMove = () => {},
    onPinch = () => {},
  }
) => {
  canvas.style.touchAction = 'none'
  // canvas.style.userSelect = 'none'

  let fingers = []
  let lastDistance = null

  const handlePointerdown = e => {
    fingers.push({
      id: e.pointerId,
      x: e.offsetX,
      y: e.offsetY,
      deltaX: 0,
      deltaY: 0,
    })

    console.log('PointerDown', e)

    onUpdate()
  }

  const handlePointermove = e => {
    const currentFinger = fingers.find(({ id }) => id === e.pointerId)

    if (!currentFinger) return

    const newFinger = {
      id: currentFinger.id,
      x: e.offsetX,
      y: e.offsetY,
      deltaX: e.offsetX - currentFinger.x,
      deltaY: e.offsetY - currentFinger.y,
    }

    if (fingers.length === 2) {
      onMove(canvas, {
        x: newFinger.deltaX * options.dpi,
        y: newFinger.deltaY * options.dpi,
      })

      const distance = Math.sqrt(
        Math.pow(fingers[1].x - fingers[0].x, 2) +
          Math.pow(fingers[1].y - fingers[0].y, 2)
      )

      if (lastDistance) {
        onPinch(canvas, { zoom: distance - lastDistance, scale: 100 })
      }

      lastDistance = distance
    }

    fingers = fingers.map(finger =>
      finger.id === currentFinger.id ? newFinger : finger
    )

    onUpdate()
  }

  const handlePointerup = e => {
    fingers = fingers.filter(({ id }) => id !== e.pointerId)
    lastDistance = null
  }

  canvas.addEventListener('pointerdown', handlePointerdown)
  canvas.addEventListener('pointermove', handlePointermove)
  // canvas.addEventListener('pointerup', handlePointerup)
  canvas.addEventListener('pointerleave', handlePointerup)
  canvas.addEventListener('pointercancel', e => {
    console.log('CANCEL')
    handlePointerup(e)
  })
}
