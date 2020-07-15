const path = require('path') //eslint-disable-line
const { spawn } = require('child_process') //eslint-disable-line
const http = require('http') //eslint-disable-line
const url = require('url') //eslint-disable-line
const protobuf = require('protobufjs') //eslint-disable-line
const WebSocket = require('ws') //eslint-disable-line
const s2clientprotocol = require('s2clientprotocol') //eslint-disable-line
const portspicker = require(path.resolve(__dirname, '..', 'portspicker.js'))
const pythonUtils = require(path.resolve(__dirname, '..', 'pythonUtils.js'))
const np = require(path.resolve(__dirname, '..', 'numpy.js'))
const gfile = require(path.resolve(__dirname, '..', 'gfile.js'))
const memoize = require(path.resolve(__dirname, '..', 'memoize.js'))
const remote_controller = require(path.resolve(__dirname, '..', './remote_controller.js'))
const video_writter = require(path.resolve(__dirname, '..', './video_writer.js'))

const sc_error = s2clientprotocol.error_pb
const sc_raw = s2clientprotocol.raw_pb
const sc_pb = s2clientprotocol.sc2api_pb
const spatial = s2clientprotocol.spatial_pb
const sc_ui = s2clientprotocol.ui_pb


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
    this.websocketServer = await getWsServer({ port: this.wsPort })
    await this.startLocalHostServer()
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

  // async run(run_config, controller, max_game_steps = 0, max_episodes = 0, game_steps_per_episode = 0, save_replay=false) {
  //   //Run loop that gets observations, renders them, and sends back actions.//
  //   const is_replay = controller.status == remote_controller.Status.in_replay
  //   let total_game_steps = 0
  //   const start_time = performance.now()
  //   let num_episodes = 0
  //   let should_continue = true
  //   let episode_steps
  //   async function run_loop(run_config, controller, max_game_steps = 0, max_episodes = 0, game_steps_per_episode = 0, save_replay=false) {
  //     total_game_steps += this._step_mul
  //     episode_steps += this._step_mul
  //     // const frame_start_time = performance.now()

  //     const obs = await controller.observe()
  //     this.render(obs)

  //     if (obs.getPlayerResult()) {
  //       should_continue = false
  //     }

  //     const cmd = this.get_actions(run_config, controller)
  //     if (cmd == ActionCmd.STEP) {
  //       // do nothing
  //     } else if (cmd == ActionCmd.QUIT) {
  //       if (!is_replay && save_replay) {
  //         await this.save_replay(run_config, controller)
  //       }
  //       should_continue = false
  //       return
  //     } else if (cmd == ActionCmd.RESTART) {
  //       return
  //     } else {
  //       throw new Error(`Unexpected command: ${cmd}`)
  //     }

  //     await controller.step(this._step_mul)

  //     if (max_game_steps && total_game_steps >= max_game_steps) {
  //       if (!is_replay && save_replay) {
  //         await this.save_replay(run_config, controller)
  //       }
  //       should_continue = false
  //       return
  //     }
  //     if (game_steps_per_episode && episode_steps >= game_steps_per_episode) {
  //       // should_continue = false
  //       return
  //     }
  //     // withPython(sw("sleep"), () => {
  //     //   elapsed_time = time.time() - frame_start_time
  //     //   time.sleep(max(0, 1 / this._fps - elapsed_time))
  //     // })
  //   }

  //   try {
  //     while (should_continue) {
  //       await this.init(controller.game_info(), controller.data())
  //       episode_steps = 0
  //       num_episodes += 1
  //       while (should_continue) {
  //         await run_loop()
  //       }
  //       if (is_replay) {
  //         should_continue = false
  //       }
  //       if (save_replay) {
  //         await this.save_replay(run_config, controller)
  //       }
  //       if (max_episodes && num_episodes >=  max_episodes) {
  //         should_continue = false
  //       }
  //       console.log('Restarting')
  //       await controller.restart()
  //     }
  //   } catch (err) {
  //     console.error(err)
  //   } finally {
  //     this.close()
  //     const elapsed_time = performance.now() - start_time
  //     console.log(`took ${Math.round(elapsed_time / 1000)} seconds for ${total_game_steps} steps: ${total_game_steps / elapsed_time} fps`)
  //   }
  // }
}

module.exports = {
  getWsServer,
  InitalizeServices
}
