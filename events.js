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
    options = {
      dpi: window.devicePixelRatio,
      bounding: null,
    },
    onUpdate = () => {},
    onTwoFingerMove = () => {},
    onTwoFingerPinch = () => {},
  }
) => {
  canvas.style.touchAction = 'none'
  canvas.style.userSelect = 'none'
  canvas.style.webkitUserSelect = 'none'

  let fingers = []
  let lastDistance = null

  const handlePointerdown = e => {
    e.preventDefault()

    fingers.push({
      id: e.pointerId,
      x: e.offsetX,
      y: e.offsetY,
      deltaX: 0,
      deltaY: 0,
    })

    console.log('PointerDown', e)
    canvas.addEventListener('pointerleave', handlePointerup, { once: true })
  }

  const handlePointermove = e => {
    e.preventDefault()

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
      onTwoFingerMove(canvas, {
        x: newFinger.deltaX * options.dpi,
        y: newFinger.deltaY * options.dpi,
      })

      const distance = Math.sqrt(
        Math.pow(fingers[1].x - fingers[0].x, 2) +
          Math.pow(fingers[1].y - fingers[0].y, 2)
      )

      if (lastDistance) {
        onTwoFingerPinch(canvas, { zoom: distance - lastDistance, scale: 100 })
      }

      lastDistance = distance
    }

    fingers = fingers.map(finger =>
      finger.id === currentFinger.id ? newFinger : finger
    )

    onUpdate()
  }

  const handlePointerup = e => {
    e.preventDefault()

    fingers = fingers.filter(({ id }) => id !== e.pointerId)
    lastDistance = null
    console.log('PointerUp', e)
  }

  if (isTouchDevice()) {
    canvas.addEventListener('pointerdown', handlePointerdown)
    canvas.addEventListener('pointermove', handlePointermove)
    canvas.addEventListener('pointerup', handlePointerup)
    canvas.addEventListener('pointercancel', e => {
      console.log('CANCEL')
      handlePointerup(e)
    })
  } else {
    let focal = { x: canvas.width / 2, y: canvas.height / 2 }

    canvas.addEventListener('mousemove', e => {
      focal = { x: e.offsetX, y: e.offsetY }
    })
    canvas.addEventListener('wheel', e => {
      console.log(focal)
      e.preventDefault()

      if (e.ctrlKey) {
        onTwoFingerPinch(canvas, { focal, zoom: -e.deltaY * 0.03 })
      } else {
        onTwoFingerMove(canvas, {
          x: -e.deltaX * 2,
          y: -e.deltaY * 2,
          bounding: options.bounding,
        })
      }

      onUpdate()
    })
  }
}
