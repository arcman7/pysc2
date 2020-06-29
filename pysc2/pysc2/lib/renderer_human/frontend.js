const path = require('path') //eslint-disable-line
const renderer_human = require(path.resolve(__dirname, '..', 'renderer_human.js'))
// const prototypes = renderer_human.getTypes()
// const render = new renderer_human.RendererHuman()
// const surface = new renderer_human._Surface()
module.exports = {
  renderer_human,
}
