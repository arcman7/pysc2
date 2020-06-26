const path = require('path') //eslint-disable-line
const protobuf = require('protobufjs') //eslint-disable-line
const WebSocket = require('ws') //eslint-disable-line
const portspicker = require(path.resolve(__dirname, '..', 'portspicker.js'))

async function getWsServer({ port, host = '127.0.0.1', callback = () => {} }) {
  port = port || await (portspicker.pick_unused_ports(1))[0]
  const wss = new WebSocket.Server({ port, host })
  wss.on('connection', function connection(ws) {
    console.log('WebSocket server connection initialized.')
    ws.on('message', function incoming(message) {
      console.log('received: %s', message)
    })
    ws.on('message', callback)
  })
  return wss
}

function initTypes() {
  let resolve
  let reject
  const prom = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  let requestTypes
  let responseTypes
  let dataTypes
  protobuf.load('human_renderer.proto', (err, root) => {
    if (err) {
      reject(err)
    }
    // Data types
    const Point = root.lookupType('human_renderer.Point')
    const Rectangle = root.lookupType('human_renderer.Rectangle')
    dataTypes = [Point, Rectangle]
    // Request types
    const DrawLineRequest = root.lookupType('human_renderer.DrawLineRequest')
    const DrawArcRequest = root.lookupType('human_renderer.DrawArcRequest')
    const DrawCircleRequest = root.lookupType('human_renderer.DrawCircleRequest')
    const BlitArrayRequest = root.lookupType('human_renderer.BlitArrayRequest')
    const WriteScreenRequest = root.lookupType('human_renderer.WriteScreenRequest')
    const WriteWorldRequest = root.lookupType('human_renderer.WriteWorldRequest')
    requestTypes = [
      DrawLineRequest, DrawArcRequest,
      DrawCircleRequest, BlitArrayRequest,
      WriteScreenRequest, WriteWorldRequest
    ]
    // Response types
    const DrawLineResponse = root.lookupType('human_renderer.DrawLineResponse')
    const DrawArcResponse = root.lookupType('human_renderer.DrawArcResponse')
    const DrawCircleResponse = root.lookupType('human_renderer.DrawCircleResponse')
    const BlitArrayResponse = root.lookupType('human_renderer.BlitArrayResponse')
    const WriteScreenResponse = root.lookupType('human_renderer.WriteScreenReponse')
    const WriteWorldResponse = root.lookupType('human_renderer.WriteWorldResponse')
    responseTypes = [
      DrawLineResponse, DrawArcResponse,
      DrawCircleResponse, BlitArrayResponse,
      WriteScreenResponse, WriteWorldResponse
    ]
    resolve({ dataTypes, requestTypes, responseTypes })
  })
  return prom
}

/*
  try {
    var decodedMessage = AwesomeMessage.decode(buffer);
  } catch (e) {
      if (e instanceof protobuf.util.ProtocolError) {
        // e.instance holds the so far decoded message with missing required fields
      } else {
        // wire format is invalid
      }
  }
*/

module.exports = {
  getWsServer,
  initTypes,
}
