export default (element, onupdate = () => {}) => {
  let drag = false
  let last = null

  const handlePointerdown = e => {
    console.log(e)
    drag = true
    last = { x: e.offsetX, y: e.offsetY }
  }

  const handlePointermove = ({ offsetX, offsetY }) => {
    if (!drag) return

    const newPos = { x: offsetX, y: offsetY }

    onupdate(canvas, {
      x: (newPos.x - last.x) * window.devicePixelRatio,
      y: (newPos.y - last.y) * window.devicePixelRatio,
    })

    last = newPos
  }

  const handlePointerup = e => {
    drag = false
  }

  element.addEventListener('pointerdown', handlePointerdown)
  element.addEventListener('pointermove', handlePointermove)
  element.addEventListener('pointerup', handlePointerup)
  element.addEventListener('pointerleave', handlePointerup)
}
