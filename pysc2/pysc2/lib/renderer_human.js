const { spawn } = require('child_process') //eslint-disable-line
const path = require('path') //eslint-disable-line
const http = require('http') //eslint-disable-line
const url = require('url') // eslint-disable-line
const s2clientprotocol = require('s2clientprotocol') //eslint-disable-line
const Enum = require('python-enum') //eslint-disable-line
const features = require(path.resolve(__dirname, './features.js'))
const colors = require(path.resolve(__dirname, './colors.js'))
const named_array = require(path.resolve(__dirname, './named_array.js'))
const point = require(path.resolve(__dirname, './point.js'))
const static_data = require(path.resolve(__dirname, './static_data.js'))
const stopwatch = require(path.resolve(__dirname, './stopwatch.js'))
const transform = require(path.resolve(__dirname, './transform.js'))
const pythonUtils = require(path.resolve(__dirname, './pythonUtils.js'))
const np = require(path.resolve(__dirname, './numpy.js'))
const gfile = require(path.resolve(__dirname, './gfile.js'))
const memoize = require(path.resolve(__dirname, './memoize.js'))
const remote_controller = require(path.resolve(__dirname, './remote_controller.js'))
const { getWsServer, initTypes } = require(path.resolve(__dirname, 'human_renderer', 'index.js'))
const portspicker = require(path.resolve(__dirname, './portspicker.js'))
const video_writter = require(path.resolve(__dirname, './video_writter.js'))

const sc_error = s2clientprotocol.error_pb
const sc_raw = s2clientprotocol.raw_pb
const sc_pb = s2clientprotocol.sc2api_pb
const spatial = s2clientprotocol.spatial_pb
const sc_ui = s2clientprotocol.ui_pb

const sw = stopwatch.sw

const { namedtuple } = pythonUtils

function clamp(n, smallest, largest) {
  return Math.max(smallest, Math.min(n, largest))
}

const MouseButtons = Enum.IntEnum('MouseButtons', {
  LEFT: 1,
  MIDDLE: 2,
  RIGHT: 3,
  WHEEL_UP: 4,
  WHEEL_DOWN: 5,
})

const SurfType = Enum.IntEnum('SurfType', {
  //Used to tell what a mouse click refers to.//
  CHROME: 1, //ie help, feature layer titles, etc
  SCREEN: 2,
  MINIMAP: 4,
  FEATURE: 8,
  RGB: 16,
})

const ActionCmd = Enum.IntEnum('ActionCmd', {
  STEP: 1,
  RESTART: 2,
  QUIT: 3,
})

class _Ability extends namedtuple("_Ability", ["ability_id", "name", "footprint_radius", "requires_point", "hotkey"]) {
  constructor(ability, static_data) { //eslint-disable-line
    super()
    const specific_data = static_data[ability.ability_id]
    let general_data
    if (specific_data.remaps_to_ability_id) {
      general_data = static_data[specific_data.remaps_to_ability_id]
    } else {
      general_data = specific_data
    }
    this.ability_id = general_data.ability_id
    this.name = (general_data.friendly_name || general_data.button_name || general_data.link_name)
    this.footprint_radius = general_data.footprint_radius
    this.requires_point = ability.requires_point
    this.hotkey = specific_data.hotkey
  }
}

class _Surface {
  //A surface to display on screen.//
  constructor(surf, surf_type, surf_rect, world_to_surf, world_to_obs, draw) {
    /*A surface to display on screen.

    Args:
      surf: The actual pygame.Surface (or subsurface).
      surf_type: A SurfType, used to tell how to treat clicks in that area.
      surf_rect: Rect of the surface relative to the window.
      world_to_surf: Convert a world point to a pixel on the surface.
      world_to_obs: Convert a world point to a pixel in the observation.
      draw: A function that draws onto the surface.
    */
    this.surf = surf
    this.surf_type = surf_type
    this.surf_rect = surf_rect
    this.world_to_surf = world_to_surf
    this.world_to_obs = world_to_obs
    this.draw = draw
  }

  draw_line(color, start_loc, end_loc, thickness = 1) {
    //
  }
}


class HumanRenderer {
  constructor() {
    this.chromeArgs = ['C:\\Program Files (x86)\\Google\\Chrome\\Application\\Chrome.exe', '-incognito', '--new-window', 'http://127.0.0.1:']
    this.browserFilePath = '/human_renderer/browser_client.html'
    this.gameJSPath = '/human_renderer/gamejs.js'
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
          const data = gfile.Open(path.resolve(__dirname, 'human_renderer', 'browser_client.html'), { encoding: 'utf8' })
          response.end(data, 'utf-8')
        } else if (reqPath === this.gameJSPath) {
          response.writeHead(200, { 'Content-Type': 'application/javascript' })
          const data = gfile.Open(path.resolve(__dirname, 'human_renderer', 'gamejs.js'), { encoding: 'utf8' })
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
  HumanRenderer,
}
