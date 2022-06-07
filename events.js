export default (
  canvas,
  { onUpdate = () => {}, onMove = () => {}, onZoom = () => {} }
) => {
  canvas.style.touchAction = 'none'

  let drag = false
  let last = null

  const handlePointerdown = e => {
    drag = true
    last = { x: e.offsetX, y: e.offsetY }

    onUpdate()
  }

  const handlePointermove = ({ offsetX, offsetY }) => {
    if (!drag) return

    const newPos = { x: offsetX, y: offsetY }

    onMove(canvas, {
      x: (newPos.x - last.x) * window.devicePixelRatio,
      y: (newPos.y - last.y) * window.devicePixelRatio,
    })

    last = newPos

    onUpdate()
  }

  const handlePointerup = e => {
    drag = false

    onUpdate()
  }

  canvas.addEventListener('pointerdown', handlePointerdown)
  canvas.addEventListener('pointermove', handlePointermove)
  canvas.addEventListener('pointerup', handlePointerup)
  canvas.addEventListener('pointerleave', handlePointerup)
}
