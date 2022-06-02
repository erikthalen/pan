export default (element, onupdate) => {
  element.addEventListener('pointerdown', e => {
    console.log(e)
  })

  element.addEventListener('pointermove', ({ offsetX, offsetY }) => {
    console.log('move', { offsetX, offsetY })

    onupdate({ offsetX, offsetY })
  })
}
