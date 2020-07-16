const path = require('path') //eslint-disable-line
const { spawn } = require('child_process') //eslint-disable-line
const http = require('http') //eslint-disable-line
const url = require('url') //eslint-disable-line
const protobuf = require('protobufjs') //eslint-disable-line
const WebSocket = require('ws') //eslint-disable-line
const s2clientprotocol = require('s2clientprotocol') //eslint-disable-line
const Enum = require('python-enum') //eslint-disable-line
const portspicker = require(path.resolve(__dirname, '..', 'portspicker.js'))
const pythonUtils = require(path.resolve(__dirname, '..', 'pythonUtils.js'))
// const np = require(path.resolve(__dirname, '..', 'numpy.js'))
const gfile = require(path.resolve(__dirname, '..', 'gfile.js'))
const stopwatch = require(path.resolve(__dirname, '..', 'stopwatch.js'))
// const memoize = require(path.resolve(__dirname, '..', 'memoize.js'))
const remote_controller = require(path.resolve(__dirname, '..', './remote_controller.js'))
// const video_writter = require(path.resolve(__dirname, '..', './video_writer.js'))

// const sc_error = s2clientprotocol.error_pb
// const sc_raw = s2clientprotocol.raw_pb
const sc_pb = s2clientprotocol.sc2api_pb
// const spatial = s2clientprotocol.spatial_pb
// const sc_ui = s2clientprotocol.ui_pb
const  { getTypes } = require(path.resolve(__dirname, '..', 'renderer_human.js'))

const { withPython } = pythonUtils

const ActionCmd = Enum.IntEnum('ActionCmd', {
  STEP: 1,
  RESTART: 2,
  QUIT: 3,
})

const root = new protobuf.Root().loadSync('./human_renderer.proto')
const RequestStaticData = root.lookupType('human_renderer.RequestStaticData')

async function getWsServer({ port, host = '127.0.0.1', callback = () => {} }) {
  port = port || await (portspicker.pick_unused_ports(1))[0]
  const wss = new WebSocket.Server({ port, host })
  wss.on('connection', function connection(ws) {
    console.log('WebSocket server connection initialized.')
    ws.on('message', function incoming(message = '') {
      console.log('received: %s', message.slice(0, 30))
    })
    ws.on('message', callback)
  })
  return wss
}

class WsServer {
  constructor({ port, host = '127.0.0.1' }) {
    this.port = port
    this.host = host
    this._trigger = null
    this._que = []
    this._sw = stopwatch.sw
  }

  // _catchData(response) {
  //   if (!response) {
  //     throw new Error('Got an empty response from SC2.')
  //   }
  //   if (this._trigger) {
  //     this._trigger(response)
  //     this._trigger = null
  //     return
  //   }
  //   this._que.push(response)
  // }

  // async _read() {
  //   //Actually read the response and parse it, returning a Response.//
  //   let response = await withPython(this._sw('read_response'), async () => {
  //     if (this._que.length) {
  //       return this._que.shift()
  //     }
  //     return new Promise((resolve) => { this._trigger = resolve })
  //   })
  //   withPython(this._sw('parse_response'), () => {
  //     response = sc_pb.Response.deserializeBinary(response)
  //   })
  //   return response
  // }

  _processMessage(data) {
    if (!this.init) {
      throw new Error('Must call init first.')
    }
    let message
     withPython(this._sw('parse_message'), () => {
      message = sc_pb.Response.deserializeBinary(data)
    })
    if (message instanceof RequestGameInfo) {

    } else if (message instanceof RequestStaticData) {

    }
  }

  _write(request) {
    //Actually serialize and write the request.//
    let request_str
    withPython(this._sw('serialize_request'), () => {
      request_str = request.serializeBinary()
    })
    withPython(this._sw('write_request'), () => {
      try { //eslint-disable-line
        this._ws.send(request_str)
      } catch (err) {
        /* TODO: Handling of different error types
            raise ConnectionError("Connection already closed. SC2 probably crashed. "
              "Check the error log.")
            except websocket.WebSocketTimeoutException:
              raise ConnectionError("Websocket timed out.")
            except socket.error as e:
              raise ConnectionError("Socket error: %s" % e)
        */
        throw err
      }
    })
  }

  async init() {
    withPython(this._sw('WsInit'), async () => {
      this._wss = await getWsServer({
        port: this.port,
        host: this.host,
        callback: this._catchData.bind(this)
      })
      this._wss.addEventListener('data', () => {
        const msg = await t
      })
    })
  }
}

class GameLoop {
  constructor(wss) {
    this.wss = wss
  }

  save_replay(run_config, controller) {
    if (controller.status == remote_controller.Status.in_game || controller.status == remote_controller.Status.ended) {
      const prefix = path.basename(this._game_info.local_map_path).split('.')[0]
      const replay_path = run_config.save_replay(controller.save_replay(), 'local', prefix)
      console.log('Wrote replay to: ', replay_path)
    }
  }

  async init(run_config, controller) {
    this.run_config = run_config
    this.controller = controller
    this.game_info = await controller.game_info()
    this.static_data = await controller.data()
  }

  async run(run_config, controller, max_game_steps = 0, max_episodes = 0, game_steps_per_episode = 0, save_replay = false) {
    //Run loop that gets observations, renders them, and sends back actions.//
    /* eslint-disable no-await-in-loop */
    const is_replay = controller.status == remote_controller.Status.in_replay
    let total_game_steps = 0
    const start_time = performance.now()
    let num_episodes = 0
    let episode_steps

    try {
      while (true) {
        await this.init(controller.game_info(), controller.data())
        episode_steps = 0
        num_episodes += 1

        while (true) {
          total_game_steps += this._step_mul
          episode_steps += this._step_mul
          // const frame_start_time = performance.now()

          const obs = await controller.observe()
          this.render(obs)

          if (obs.getPlayerResult()) {
            break
          }

          const cmd = this.get_actions(run_config, controller)
          if (cmd == ActionCmd.STEP) {
            // do nothing
          } else if (cmd == ActionCmd.QUIT) {
            if (!is_replay && save_replay) {
              await this.save_replay(run_config, controller)
            }
            return
          } else if (cmd == ActionCmd.RESTART) {
            break
          } else {
            throw new Error(`Unexpected command: ${cmd}`)
          }

          await controller.step(this._step_mul)

          if (max_game_steps && total_game_steps >= max_game_steps) {
            if (!is_replay && save_replay) {
              await this.save_replay(run_config, controller)
            }
            return
          }
          if (game_steps_per_episode && episode_steps >= game_steps_per_episode) {
            break
          }
          // withPython(sw("sleep"), () => {
          //   elapsed_time = time.time() - frame_start_time
          //   time.sleep(max(0, 1 / this._fps - elapsed_time))
          // })
        }

        if (is_replay) {
          break
        }
        if (save_replay) {
          await this.save_replay(run_config, controller)
        }
        if (max_episodes && num_episodes >= max_episodes) {
          break
        }
        console.log('Restarting')
        await controller.restart()
      }
    } catch (err) {
      console.error(err)
    } finally {
      this.close()
      const elapsed_time = performance.now() - start_time
      console.log(`took ${Math.round(elapsed_time / 1000)} seconds for ${total_game_steps} steps: ${total_game_steps / elapsed_time} fps`)
    }
  }
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

class InitalizeServices {
  constructor() {
    ///Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
    this.chromeArgs = ['C:\\Program Files (x86)\\Google\\Chrome\\Application\\Chrome.exe', '-incognito', '--new-window', 'http://127.0.0.1:']
    if (process.platform === 'darwin') {
      this.chromeArgs[0] = '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome'
    }
    this.browserFilePath = '/renderer_human/browser_client.html'
    this.websocketServer = null
  }

  async setUp() {
    const [p1, p2] = await portspicker.pick_unused_ports(2)
    this.wsPort = p1
    this.httpPort = p2
    this.websocketServer = new WsServer({ port: this.wsPort })
    await this.websocketServer.init()
    await this.startLocalHostServer()
    await this.gameLoop = new GameLoop(this.websocketServer)
    await this.gameLoop.init()
    // launch browser with websocket server port embedded as a url param
    const fullUrl = this.chromeArgs.pop() + this.httpPort + this.browserFilePath + '?port=' + this.wsPort
    this.fullUrl = fullUrl
    this.chromeArgs.push(fullUrl)
    this.launchChrome()
    return true
  }

  startLocalHostServer() {
    this.httpServer = http.createServer((request, response) => {
      const reqPath = url.parse(request.url, true).pathname;

      if (request.method === 'GET') {
        if (reqPath === this.browserFilePath) {
          response.writeHead(200, { 'Content-Type': 'text/html' })
          const data = gfile.Open(path.resolve(__dirname, 'browser_client.html'), { encoding: 'utf8' })
          response.end(data, 'utf-8')
        } else if (reqPath === '/renderer_human/bundle.js') {
          response.writeHead(200, { 'Content-Type': 'application/javascript' })
          const data = gfile.Open(path.resolve(__dirname, 'bundle.js'), { encoding: 'utf8' })
          response.end(data, 'utf-8')
        } else if (reqPath === '/renderer_human/gamejs-2.0.3-pre-min.js') {
          response.writeHead(200, { 'Content-Type': 'application/javascript' })
          const data = gfile.Open(path.resolve(__dirname, 'gamejs-2.0.3-pre-min.js'), { encoding: 'utf8' })
          response.end(data, 'utf-8')
        } else if (reqPath === '/renderer_human/s2clientprotocol.min.js') {
          response.writeHead(200, { 'Content-Type': 'application/javascript' })
          const data = gfile.Open(path.resolve(__dirname, 's2clientprotocol.min.js'), { encoding: 'utf8' })
          response.end(data, 'utf-8')
        } else if (reqPath === '/renderer_human/bundle_json.json') {
          response.writeHead(200, { 'Content-Type': 'application/json' })
          const data = gfile.Open(path.resolve(__dirname, 'bundle_json.json'), { encoding: 'utf8' })
          response.end(data, 'utf-8')
        } else {
          response.end('404')
        }
      }
    })
    this.httpServer.listen(this.httpPort, () => {
      console.log('server listening at port ', this.httpPort, 'at:\n', this.fullUrl)
    })
  }

  launchChrome() {
    this._proc = spawn(this.chromeArgs[0], this.chromeArgs)
  }
}

module.exports = {
  getWsServer,
  InitalizeServices
}
