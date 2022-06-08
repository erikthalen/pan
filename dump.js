// const setSize = () => {
//   canvas.width = parseInt(getComputedStyle(canvas).width) * 2
//   canvas.height = parseInt(getComputedStyle(canvas).height) * 2

//   config.size = {
//     width: canvas.width,
//     height: canvas.height,
//   }
// }

// setSize()

// window.addEventListener('resize', () => {
//   setSize()
//   update()
//   onresize()
// })

export const clamp = (val, min, max) => {
 return Math.max(min, Math.min(max, val))
}