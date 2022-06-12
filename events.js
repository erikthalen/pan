import { move, zoom } from './pinch.js'

function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}

export default (
  canvas,
  { dpi = window.devicePixelRatio, bounding = null } = {}
) => {
  canvas.style.touchAction = 'none'
  canvas.style.userSelect = 'none'
  canvas.style.webkitUserSelect = 'none'

  let fingers = {}
  let lastDistance = null

  const dispatch = detail => {
    canvas.dispatchEvent(
      new CustomEvent('pan', {
        detail,
        bubbles: true,
        cancelable: true,
        composed: false,
      })
    )
  }

  const handlePointerdown = e => {
    e.preventDefault()

    fingers[e.pointerId] = {
      x: e.offsetX,
      y: e.offsetY,
      deltaX: 0,
      deltaY: 0,
    }

    canvas.addEventListener('pointerleave', handlePointerup, { once: true })
  }

  const handlePointermove = e => {
    e.preventDefault()

    if (!fingers[e.pointerId]) return
    if (Object.keys(fingers).length !== 2) return

    fingers[e.pointerId] = {
      x: e.offsetX,
      y: e.offsetY,
      deltaX: e.offsetX - fingers[e.pointerId].x,
      deltaY: e.offsetY - fingers[e.pointerId].y,
    }

    const fingersArray = Object.values(fingers)

    const distance = Math.sqrt(
      Math.pow(fingersArray[1].x - fingersArray[0].x, 2) +
        Math.pow(fingersArray[1].y - fingersArray[0].y, 2)
    )

    const { position } = move({
      x: fingers[e.pointerId].deltaX * dpi * 0.7,
      y: fingers[e.pointerId].deltaY * dpi * 0.7,
    })

    const { scale } = zoom({
      focal: { x: e.offsetX * dpi, y: e.offsetY * dpi },
      zoom: !lastDistance ? 1 : 1 + (distance - lastDistance) / 200,
    })

    lastDistance = distance

    dispatch({ scale, position })
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
    canvas.addEventListener('wheel', e => {
      e.preventDefault()

      if (e.ctrlKey) {
        dispatch(
          zoom({
            focal: { x: e.offsetX * dpi, y: e.offsetY * dpi },
            zoom: 1 - e.deltaY / 100,
          })
        )
      } else {
        dispatch(move({ x: -e.deltaX, y: -e.deltaY }))
      }
    })
  }
}
