const path = require('path') //eslint-disable-line
const backend = require(path.resolve(__dirname, 'renderer_human', 'backend.js'))

const services = new backend.InitalizeServices()
services.setUp()
