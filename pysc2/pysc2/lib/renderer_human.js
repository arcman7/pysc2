const path = require('path') //eslint-disable-line
const s2clientprotocol = require('s2clientprotocol') //eslint-disable-line
const Enum = require('python-enum') //eslint-disable-line
const protobuf = require('protobufjs') //eslint-disable-line
const deque = require('collections/deque') //eslint-disable-line
const pythonUtils = require('./pythonUtils.js') //eslint-disable-line
const point = require('./point.js') //eslint-disable-line
const actions = require('./actions.js') //eslint-disable-line
const features = require('./features.js') //eslint-disable-line
const colors = require('./colors.js') //eslint-disable-line
const named_array = require('./named_array.js') //eslint-disable-line
const static_data = require('./static_data.js') //eslint-disable-line
const stopwatch = require('./stopwatch.js') //eslint-disable-line
const transform = require('./transform.js') //eslint-disable-line
const np = require('./numpy.js') //eslint-disable-line

const sc_error = s2clientprotocol.error_pb
const sc_raw = s2clientprotocol.raw_pb
const sc_pb = s2clientprotocol.sc2api_pb
const spatial = s2clientprotocol.spatial_pb
const sc_ui = s2clientprotocol.ui_pb
const sw = stopwatch.sw

const { assert, DefaultDict, namedtuple, ValueError, withPython } = pythonUtils

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
      surf: The actual gamejs.Surface (or subsurface).
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
    window.gamejs.draw.line(
      this.surf, color,
      this.world_to_surf.fwd_pt(start_loc).round(),
      this.world_to_surf.fwd_pt(end_loc).round(),
      Math.max(1, thickness)
    )
  }

  draw_arc(color, world_loc, world_radius, start_angle, stop_angle, thickness = 1) {
    //Draw an arc using world coordinates, radius, start and stop angles.//
    const center = this.world_to_surf.fwd_pt(world_loc).round()
    const radius = Math.max(1, Math.floor(this.world_to_surf.fwd_dist(world_radius)))
    const rect = window.gamejs.Rect(center - radius, (radius * 2, radius * 2))
    window.gamejs.draw.arc(
      this.surf, color, rect, start_angle, stop_angle,
      thickness < radius ? thickness : 0
    )
  }

  draw_circle(color, world_loc, world_radius, thickness = 0) {
    //Draw a circle using world coordinates and radius.//
    if (world_radius > 0) {
      const center = this.world_to_surf.fwd_pt(world_loc).round()
      const radius = Math.max(1, Math.floor(this.world_to_surf.fwd_dist(world_radius)))
      window.gamejs.draw.circle(
        this.surf, color, center, radius,
        thickness < radius ? thickness : 0
      )
    }
  }

  draw_rect(color, world_rect, thickness = 0) {
    //Draw a rectangle using world coordinates.//
    const tl = this.world_to_surf.fwd_pt(world_rect.tl).round()
    const br = this.world_to_surf.fwd_pt(world_rect.br).round()
    const rect = window.gamejs.Rect(tl, br.sub(tl))
    window.gamejs.draw.rect(this.surf, color, rect, thickness)
  }

  blit_np_array(array) {
    //Fill this surface using the contents of a numpy array.//
    let raw_surface
    withPython(sw('make_surface'), () => {
      raw_surface = window.gamejs.surfarray.make_surface(array.transpose([1, 0, 2]))
    })
    withPython(sw('draw'), () => {
      window.gamejs.transform.scale(raw_surface, this.surf.get_size(), this.surf)
    })
  }

  write_screen(font, color, screen_pos, text, align = 'left', valign = 'top') {
    //Write to the screen in font.size relative coordinates.//
    const pos = new point.Point(...screen_pos) * new point.Point(0.75, 1) * font.get_linesize()
    const text_surf = font.render(text.toString ? text.toString() : String(text), true, color)
    const rect = text_surf.get_rect()
    if (pos.x >= 0) {
      rect[align] = pos.x
    } else {
      rect[align] = this.surf.get_width() + pos.x
    }
    if (pos.y >= 0) {
      rect[valign] = pos.y
    } else {
      rect[valign] = this.surf.get_height() + pos.y
    }
    this.surf.blit(text_surf, rect)
  }

  write_world(font, color, world_loc, text) {
    const text_surf = font.render(text, true, color)
    const rect = text_surf.get_rect()
    rect.center = this.world_to_surf.fwd_pt(world_loc)
    this.surf.blit(text_surf, rect)
  }
}

class MousePos extends namedtuple('MousePos', ['world_pos', 'surf']) {
  //Holds the mouse position in world coordinates and the surf it came from.//
  get surf_pos() {
    return this.surf.world_to_surf.fwd_pt(this.world_pos)
  }

  get obs_pos() {
    return this.surf.world_to_obs.fwd_pt(this.world_pos)
  }

  action_spatial(action) {
    //Given an Action, return the right spatial action.//
    if (this.surf.surf_type & SurfType.FEATURE) {
      return action.action_feature_layer
    }
    if (this.surf.surf_type & SurfType.RGB) {
      return action.action_render
    }
    assert(this.surf.surf_type & (SurfType.RGB | SurfType.FEATURE), 'this.surf.surf_type & (SurfType.RGB | SurfType.FEATURE)')
  }
}

class PastAction extends namedtuple('PastAction', ['ability', 'color', 'pos', 'time', 'deadline']) {
  // Holds a past action for drawing over time.//
}

function _get_desktop_size() {
  //Get the browser screen size.//
  /*
  https://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
  */
  /*eslint-disable*/

  const win = window
  const doc = document
  const docElem = doc.documentElement
  const body = doc.getElementsByTagName('body')[0]
  const x = win.innerWidth || docElem.clientWidth || body.clientWidth
  const y = win.innerHeight|| docElem.clientHeight|| body.clientHeight
  return new point.Point(x, y)
}


function circle_mask(shape, pt, radius) {
  let rows = new Array(shape.y)
  let yInd = 0
  for (let y = -pt.y; y < (shape.y - pt.y); y++) {
    const row = new Array(shape.x)
    let xInd = 0
    for (let x = -pt.x; x < (shape.x - pt.x); x++) {
      row[xInd] = (x**2 + y**2) <= (radius **2)
      xInd ++
    }
    rows[yInd] = row
    yInd ++
  }
  return rows
}

class RendererHuman {
  //Render starcraft obs with gamejs such that it's playable by humans.//

  static get camera_actions() {
    const camera_actions = {}
    camera_actions[window.gamejs.event.K_LEFT] = new point.Point(-3, 0)
    camera_actions[window.gamejs.event.K_RIGHT] = new point.Point(3, 0)
    camera_actions[window.gamejs.event.K_UP] = new point.Point(0, 3)
    camera_actions[window.gamejs.event.K_DOWN] = new point.Point(0, -3)
    return camera_actions
  }

  get camera_actions() { //eslint-disable-line
    return RendererHuman.camera_actions
  }

  static get cmd_group_keys() {
    const cmd_group_keys = {}
    cmd_group_keys[window.gamejs.event.K_0] = 0
    cmd_group_keys[window.gamejs.event.K_1] = 1
    cmd_group_keys[window.gamejs.event.K_2] = 2
    cmd_group_keys[window.gamejs.event.K_3] = 3
    cmd_group_keys[window.gamejs.event.K_4] = 4
    cmd_group_keys[window.gamejs.event.K_5] = 5
    cmd_group_keys[window.gamejs.event.K_6] = 6
    cmd_group_keys[window.gamejs.event.K_7] = 7
    cmd_group_keys[window.gamejs.event.K_8] = 8
    cmd_group_keys[window.gamejs.event.K_9] = 9
    return cmd_group_keys
  }

  get cmd_group_keys() { //eslint-disable-line
    return RendererHuman.cmd_group_keys
  }

  static get upgrade_colors() {
    return [
      colors.black,  // unused...
      colors.white.mul(0.6),
      colors.white.mul(0.8),
      colors.white,
    ]
  }

  get upgrade_colors() {
    return RendererHuman.upgrade_colors
  }

  constructor(fps = 22.4, step_mul = 1, render_sync = false, render_feature_grid = true, video = null) {
    /*Create a renderer for use by humans.

    Make sure to call `init` with the game info, or just use `run`.

    Args:
      fps: How fast should the game be run.
      step_mul: How many game steps to take per observation.
      render_sync: Whether to wait for the obs to render before continuing.
      render_feature_grid: When RGB and feature layers are available, whether
          to render the grid of feature layers.
      video: A filename to write the video to. Implicitly enables render_sync.
    */
    this._fps = fps
    this._step_mul = step_mul
    this._render_sync = render_sync || Boolean(video)
    this._raw_actions = false
    this._render_player_relative = false
    this._render_rgb = null
    this._render_feature_grid = render_feature_grid
    this._window = null
    this._window_scale = 0.75
    this._obs_queue = deque(undefined, 100)
    // probably won't need these in javascript
    this._render_thread = null //threading.Thread(target=this.render_thread, name="Renderer")
    // this._render_thread.start()
    this._game_times = deque(undefined, 100)  // Avg FPS over 100 frames.
    this._render_times = deque(undefined, 100)
    this._last_time = performance.now()
    this._last_game_loop = 0
    this._name_lengths = {}
    this._video_writer = video ? new video_writer.VideoWriter(video, fps) : null
  }

  close() {
    if (this._obs_queue.length) {
      //this._obs_queue.push(null) //??
      this._obs_queue = null
      this._render_thread = null
    }
    if (this._video_writer) {
      this._video_writer.close()
      this._video_writer = null
    }
  }

  async init(game_info, static_data) {
    /*Take the game info and the static data needed to set up the game.

    This must be called before render or get_actions for each game or restart.

    Args:
      game_info: A `sc_pb.ResponseGameInfo` object for this game.
      static_data: A `StaticData` object for this game.

    Raises:
      ValueError: if there is nothing to render.
    
    */
    this._game_info = game_info
    this._static_data = static_data
    assert(game_info.hasStartRaw(), 'game_info.hasStartRaw()')

    this._map_size = point.Point.build(game_info.getStartRaw().getMapSize())
    this._playable = new point.Rect(
      point.Point.build(game_info.getStartRaw().getPlayableArea().getP0()),
      point.Point.build(game_info.getStartRaw().getPlayableArea().getP1())
    )

    if (game_info.getOptions().hasFeatureLayer()) {
      const fl_opts = game_info.getOptions().getFeatureLayer()
      this._feature_screen_px = point.Point.build(fl_opts.getResolution())
      this._feature_minimap_px = point.Point.build(fl_opts.getMinimap_resolution())
      this._feature_camera_width_world_units = fl_opts.getWidth()
      this._render_rgb = false
      if (!fl_opts.getCropToPlayableArea()) {
        this._playable = new point.Rect(this._map_size)
      }
    } else {
      this._feature_screen_px = null
      this._feature_minimap_px = null
    }
    if (game_info.getOptions().hasRender()) {
      const render_opts = game_info.getOptions().getRender()
    }

    if (!this._feature_screen_px && !this._rgb_screen_px) {
      throw new ValueError('Nothing to render.')
    }

    try {
      await this.init_window()
      this._initialized = true
    } catch (err) {
      this._initialized = false
      console.error(''.lpad(60, '-'))
      console.error('Failed to initialize gamejs: ', e)
      console.error('Continuing without gamejs.')
      console.error('If you\'re using ssh and have an X server, try ssh -X.')
      console.error(''.lpad(60, '-'))
    }

    this._obs = new sc_pb.ResponseObservation()
    this._queued_action = null
    this._queued_hotkey = ''
    this._select_start = null
    this._alerts = {}
    this._past_actions = []
    this._help = false
    this._last_zoom_time = 0
  }

  async init_window() {
    //Initialize the gamejs window and lay out the surfaces//

    let resolve
    const prom = new Promise((res) => {
      resolve = res
    })
    gamejs.ready(resolve)
    await prom

    let main_screen_px
    if (this._render_rgb && this._rgb_screen_px) {
      main_screen_px = this._rgb_screen_px
    }
    else {
      main_screen_px = this._feature_screen_px
    }

    let window_size_ratio = main_screen_px
    let num_feature_layers = 0
    if (this._render_feature_grid) {
      // Want a roughly square grid of feature layers, each being roughly square.
      if (this._game_info.options.raw) {
        num_feature_layers += 5
      }
      if (this._feature_screen_px) {
        num_feature_layers += features.SCREEN_FEATURES.length
        num_feature_layers += features.MINIMAP_FEATURES.length
      }
      if (num_feature_layers > 0) {
        const feature_cols = Math.ceil(Math.sqrt(num_feature_layers))
        const feature_rows = Math.ceil(num_feature_layers / feature_cols)
        const features_layout = new point.Point(
          feature_cols, feature_rows * 1.05 // Make room for titles.
        )

        // Scale features_layout to main_screen_px height so we know its width.
        const features_aspect_ratio = (features_layout * main_screen_px.y /
                                 features_layout.y)
        window_size_ratio += point.Point(features_aspect_ratio.x, 0)
      }
    }
    const window_size_px = window_size_ratio.scale_max_size(
      _get_desktop_size().mul(this._window_scale)
    ).ceil()

    // Create the actual window surface. This should only be blitted to from one
    // of the sub-surfaces defined below.
    this._window = gamejs.display.set_mode(window_size_px, 0, 32)
    gamejs.display.set_caption('Starcraft Viewer')

    // The sub-surfaces that the various draw functions will draw to.
    this._surfaces = []
    function add_surface(surf_type, surf_loc, world_to_surf, world_to_obs, draw_fn) {
      //Add a surface. Drawn in order and intersect in reverse order.//
      const sub_surf = this._window.subsurface(
        gamejs.Rect(surf_loc.tl, surf_loc.size)
      )
      this._surfaces.append(new _Surface(
          sub_surf, surf_type, surf_loc, world_to_surf, world_to_obs, draw_fn
        )
      )
    }

    this._scale = window_size_px.y // 32
    this._font_small = gamejs.font.Font(null, Math.floor(this._scale * 0.5))
    this._font_large = gamejs.font.Font(null, this._scale)

    function check_eq(a, b) {
      //Used to run unit tests on the transforms.//
      assert(a.sub(b).len() < 0.0001, `${a} != ${b}`)
    }

    // World has origin at bl, world_tl has origin at tl.
    this._world_to_world_tl = new transform.Linear(
      new point.Point(1, -1), new point.Point(0, this._map_size.y)
    )

    check_eq(
      this._world_to_world_tl.fwd_pt(new point.Point(0, 0)),
      new point.Point(0, this._map_size.y)
    )
    check_eq(
      this._world_to_world_tl.fwd_pt(new point.Point(5, 10)),
      new point.Point(5, this._map_size.y - 10)
    )

    // Move the point to be relative to the camera. This gets updated per frame.
    this._world_tl_to_world_camera_rel = new transform.Linear({
      offset: this._map_size.div(4).mul(-1)
    })

    check_eq(
      this._world_tl_to_world_camera_rel.fwd_pt(this._map_size.div(4)),
      new point.Point(0, 0)
    )
    check_eq(
      this._world_tl_to_world_camera_rel.fwd_pt(
        this._map_size.div(4).add(new point.Point(5, 10))
      ),
      new point.Point(5, 10)
    )

    if (this._feature_screen_px) {
      // Feature layer locations in continuous space.
      let feature_world_per_pixel = this._feature_screen_px
        .div(this._feature_camera_width_world_units)
      let world_camera_rel_to_feature_screen = new transform.Linear(
        feature_world_per_pixel, this._feature_screen_px.div(2)
      )

      check_eq(world_camera_rel_to_feature_screen.fwd_pt(
        new point.Point(0, 0)),
        this._feature_screen_px.div(2)
      )
      check_eq(
        world_camera_rel_to_feature_screen.fwd_pt(
          (new point.Point(-0.5, -0.5)).mul(this._feature_camera_width_world_units)
        ),
        new point.Point(0, 0)
      )

      this._world_to_feature_screen = new transform.Chain(
        this._world_to_world_tl,
        this._world_tl_to_world_camera_rel,
        world_camera_rel_to_feature_screen
      )
      this._world_to_feature_screen_px = new transform.Chain(
        this._world_to_feature_screen,
        new transform.PixelToCoord()
      )

      const world_tl_to_feature_minimap = new transform.Linear(
        this._feature_minimap_px.div(this._playable.diagonal.max_dim())
      )
      world_tl_to_feature_minimap.offset = world_tl_to_feature_minimap.fwd_pt(
        this._world_to_world_tl.fwd_pt(this._playable.bl).mul(-1)
      )

      this._world_to_feature_minimap = new transform.Chain(
        this._world_to_world_tl,
        world_tl_to_feature_minimap
      )
      this._world_to_feature_minimap_px = new transform.Chain(
        this._world_to_feature_minimap,
        new transform.PixelToCoord()
      )

      // These are confusing since this._playable is in world coords which is
      // (bl <= tr), but stored in a Rect that is (tl <= br).
      check_eq(this._world_to_feature_minimap.fwd_pt(
        this._playable.bl),
        new point.Point(0, 0)
      )
      check_eq(
        this._world_to_feature_minimap.fwd_pt(this._playable.tr),
        this._playable.diagonal.scale_max_size(this._feature_minimap_px)
      )
    }

    if (this._rgb_screen_px) {
      // RGB pixel locations in continuous space.

      // TODO(tewalds): Use a real 3d projection instead of orthogonal.
      let rgb_world_per_pixel = this._rgb_screen_px.div(24)
      let world_camera_rel_to_rgb_screen = new transform.Linear(
        rgb_world_per_pixel, 
        this._rgb_screen_px.div(2)
      )

      check_eq(
        world_camera_rel_to_rgb_screen.fwd_pt(
          new point.Point(0, 0)
        ),
        this._rgb_screen_px.div(2)
      )
      check_eq(
        world_camera_rel_to_rgb_screen.fwd_pt(
          new point.Point(-0.5, -0.5).mul(24)
        ),
        new point.Point(0, 0)
      )

      this._world_to_rgb_screen = new transform.Chain(
        this._world_to_world_tl,
        this._world_tl_to_world_camera_rel,
        world_camera_rel_to_rgb_screen
      )
      this._world_to_rgb_screen_px = new transform.Chain(
        this._world_to_rgb_screen,
        new transform.PixelToCoord()
      )

      const world_tl_to_rgb_minimap = new transform.Linear(
        this._rgb_minimap_px.div(this._map_size.max_dim())
      )

      check_eq(world_tl_to_rgb_minimap.fwd_pt(
        new point.Point(0, 0)),
        new point.Point(0, 0)
      )
      check_eq(
        world_tl_to_rgb_minimap.fwd_pt(this._map_size),
        this._map_size.scale_max_size(this._rgb_minimap_px)
      )

      this._world_to_rgb_minimap = new transform.Chain(
        this._world_to_world_tl,
        world_tl_to_rgb_minimap
      )
      this._world_to_rgb_minimap_px = new transform.Chain(
        this._world_to_rgb_minimap,
        new transform.PixelToCoord()
      )
    }
    // Renderable space for the screen.
    let screen_size_px = main_screen_px.scale_max_size(window_size_px)
    let minimap_size_px = this._playable.diagonal.scale_max_size(screen_size_px.div(4))
    let minimap_offset = new point.Point(0, (screen_size_px.y - minimap_size_px.y))

    if (this._render_rgb) {
      rgb_screen_to_main_screen = new transform.Linear(
        screen_size_px / this._rgb_screen_px
      )
      add_surface(
        SurfType.RGB | SurfType.SCREEN,
        new point.Rect(point.origin, screen_size_px),
        new transform.Chain(  // surf
            this._world_to_rgb_screen,
            rgb_screen_to_main_screen),
        this._world_to_rgb_screen_px,
        this.draw_screen
      )
      rgb_minimap_to_main_minimap = new transform.Linear(
        minimap_size_px.div(this._rgb_minimap_px)
      )
      add_surface(
        SurfType.RGB | SurfType.MINIMAP,
        new point.Rect(minimap_offset,
                   minimap_offset + minimap_size_px),
        new transform.Chain(  // surf
            this._world_to_rgb_minimap,
            rgb_minimap_to_main_minimap),
        this._world_to_rgb_minimap_px,
        this.draw_mini_map
      )
    } else {  // Feature layer main screen
      const feature_screen_to_main_screen = new transform.Linear(
        screen_size_px.div(this._feature_screen_px)
      )
      add_surface(
        SurfType.FEATURE | SurfType.SCREEN,
        new point.Rect(point.origin, screen_size_px),
        new transform.Chain(  // surf
          this._world_to_feature_screen,
          feature_screen_to_main_screen
        ),
        this._world_to_feature_screen_px,
        this.draw_screen
      )
      const feature_minimap_to_main_minimap = new transform.Linear(
        minimap_size_px.max_dim() / this._feature_minimap_px.max_dim()
      )
      add_surface(
        SurfType.FEATURE | SurfType.MINIMAP,
        new point.Rect(
          minimap_offset,
          minimap_offset + minimap_size_px
        ),
        new transform.Chain(  // surf
          this._world_to_feature_minimap,
          feature_minimap_to_main_minimap
        ),
        this._world_to_feature_minimap_px,
        this.draw_mini_map
      )
    }

    if (this._render_feature_grid && num_feature_layers > 0) {
      // Add the raw and feature layers
      const features_loc = new point.Point(screen_size_px.x, 0)
      const feature_pane = this._window.subsurface(
        gamejs.Rect(features_loc, window_size_px.sub(features_loc))
      )
      feature_pane.fill(colors.white.div(2))
      const feature_pane_size = new point.Point(...feature_pane.get_size())
      const feature_grid_size = feature_pane_size.div(
        new point.Point(
          feature_cols,
          feature_rows
        )
      )
      const feature_layer_area = new point.Point(1, 1)
        .scale_max_size(feature_grid_size)
      const feature_layer_padding = feature_layer_area // 20
      const feature_layer_size = feature_layer_area.minus(feature_layer_padding.mul(2))

      const feature_font_size = Math.floor(feature_grid_size.y * 0.09)
      const feature_font = gamejs.font.Font(null, feature_font_size)

      const feature_counter = itertools.count()
      function add_layer(surf_type, world_to_surf, world_to_obs, name, fn) {
        //Add a layer surface.//
        i = next(feature_counter)
        grid_offset = new point.Point(
          i % feature_cols,
          i / feature_cols
        ).mul(feature_grid_size)
        text = feature_font.render(name, true, colors.white)
        rect = text.get_rect()
        rect.center = grid_offset.add(
          new point.Point(
            feature_grid_size.x / 2,
            feature_font_size
          )
        )
        feature_pane.blit(text, rect)
        const surf_loc = features_loc
          .add(grid_offset)
          .add(feature_layer_padding)
          .add(
            new point.Point(0, feature_font_size)
          )
        
        add_surface(
          surf_type,
          new point.Rect(
            surf_loc,
            surf_loc.add(feature_layer_size).round()
          ),
          world_to_surf, world_to_obs, fn
        )
      }

      const raw_world_to_obs = new transform.Linear()
      const raw_world_to_surf = new transform.Linear(feature_layer_size.div(this._map_size)
      )
      function add_raw_layer(from_obs, name, color) {
        add_layer(
          SurfType.FEATURE | SurfType.MINIMAP,
          raw_world_to_surf, raw_world_to_obs, "raw " + name,
          (surf) => this.draw_raw_layer(surf, from_obs, name, color)
        )
      }

      if (this._game_info.options.raw) {
        add_raw_layer(false, "terrain_height", colors.height_map(256))
        add_raw_layer(false, "pathing_grid", colors.winter(2))
        add_raw_layer(false, "placement_grid", colors.winter(2))
        add_raw_layer(true, "visibility", colors.VISIBILITY_PALETTE)
        add_raw_layer(true, "creep", colors.CREEP_PALETTE)
      }

      function add_feature_layer(feature, surf_type, world_to_surf, world_to_obs) {
        add_layer(
          surf_type, world_to_surf, world_to_obs, feature.full_name,
          (surf) => this.draw_feature_layer(surf, feature)
        )
      }

      if (this._feature_minimap_px) {
        // Add the minimap feature layers
        const feature_minimap_to_feature_minimap_surf = new transform.Linear(
          feature_layer_size.div(this._feature_minimap_px)
        )
        const world_to_feature_minimap_surf = new transform.Chain(
          this._world_to_feature_minimap,
          feature_minimap_to_feature_minimap_surf
        )
        features.MINIMAP_FEATURES.forEach((feature) => {
          add_feature_layer(
            feature, SurfType.FEATURE | SurfType.MINIMAP,
            world_to_feature_minimap_surf,
            this._world_to_feature_minimap_px
          )
        })
      }

      if (this._feature_screen_px) {
        // Add the screen feature layers
        const feature_screen_to_feature_screen_surf = new transform.Linear(
          feature_layer_size.div(this._feature_screen_px)
        )
        const world_to_feature_screen_surf = new transform.Chain(
          this._world_to_feature_screen,
          feature_screen_to_feature_screen_surf
        )
        features.SCREEN_FEATURES.forEach((feature) => {
          add_feature_layer(
            feature, SurfType.FEATURE | SurfType.SCREEN,
            world_to_feature_screen_surf,
            this._world_to_feature_screen_px
          )
        })

      }
    }
    // Add the help screen
    const help_size = new point.Point(
      (Math.max(...this.shortcuts.map((s) => s.length)) +
      Math.max(...this.shortcuts.map((_, s) => String(s).length))) * 0.4 + 4,
      this.shortcuts.length + 3
    ).mul(this._scale)
    const help_rect = new point.Rect(
      window_size_px.div(2).sub(help_size.div(2)),
      window_size_px.div(2).add(help_size.div(2))
    )
    add_surface(SurfType.CHROME, help_rect, null, null, this.draw_help)

    // Arbitrarily set the initial camera to the center of the map.
    this._update_camera(this._map_size.div(2))
  }

  _update_camera(camera_center) {
    //Update the camera transform based on the new camera center.//
    this._world_tl_to_world_camera_rel.offset = (
      this._world_to_world_tl.fwd_pt(camera_center).mul(-1).mul(this._world_tl_to_world_camera_rel.scale)
    )

    if (this._feature_screen_px) {
      const camera_radius = (this._feature_screen_px.div(
        this._feature_screen_px.x).mul(this._feature_camera_width_world_units).div(2)
      )
      const center = camera_center.bound(camera_radius, this._map_size.sub(camera_radius))

      this._camera = new point.Rect(
        center.sub(camera_radius).bound(this._map_size),
        center.add(camera_radius).bound(this._map_size)
      )
    }
  }

  zoom(factor) {
    //Zoom the window in/out.//
    this._window_scale *= factor
    if (performance.now() - this._last_zoom_time < 1) {
      // Avoid a deadlock in gamejs if you zoom too quickly
      return
    }
    this.init_window()
    this._last_zoom_time = performance.now()
  }

  get_mouse_pos(window_pos = null) {
    //Return a MousePos filled with the world position and surf it hit.//
    window_pos = window_pos || gamejs.mouse.get_pos()
    // +0.5 to center the point on the middle of the pixel.
    const window_pt = new poin.Point(...window_pos).add(0.5)
    for (let i = this._surfaces.length - 1; i >= 0; i--) {
      const surf = this._surfaces[i]
      if (sur.surf_type != SurfType.CHROME && surf.surf_rect.contains_point(window_pt)) {
        const surf_rel_pt = window_pt.sub(surf.surf_rect.tl)
        const world_pt = surf.world_to_surf.back_pt(surf_rel_pt)
        return MousePos(world_pt, surf)
      }
    }
  }

  clear_queued_action() {
    this._queued_hotkey = ''
    this._queued_action = null
  }

  save_replay(run_config, controller) {
    if (controller.status == remote_controller.Status.in_game || controller.status == remote_controller.Status.ended) {
      const prefix = path.basename(this._game_info.local_map_path).split('.')[0]
      const replay_path = run_config.save_replay(controller.save_replay(), 'local', prefix)
      console.log('Wrote replay to: ', replay_path)
    }
  }

  get_actions(run_config, controller) {
    //Get actions from the UI, apply to controller, and return an ActionCmd.
    if (!this._initialized) {
      return ActionCmd.STEP
    }
    const events = gamejs.event.get()
    for (let i = 0; i < events.length; i++) {
      ctrl = gamejs.key.get_mods() & gamejs.event.KMOD_CTRL
      shift = gamejs.key.get_mods() & gamejs.event.KMOD_SHIFT
      alt = gamejs.key.get_mods() & gamejs.event.KMOD_ALT
      if (event.type == gamejs.event.QUIT) {
        return ActionCmd.QUIT
      } else if (event.type == gamejs.event.KEYDOWN) {
        if (this._help) {
          this._help = false
        } else if (event.key == gamejs.event.K_QUESTION || event.key == gamejs.event.K_SLASH) {
          this._help = true
        } else if (event.key == gamejs.event.K_PAUSE) {
          let pause = true
          while (pause) {
            time.sleep(0.1)
            const events2 = gamejs.event.get()
            for (let j = 0; j < events2.length; j++) {
              const event2 = events2[i]
              if (event2.type == gamejs.event.KEYDOWN) {
                if (event2.key == gamejs.event.K_PAUSE ||  gamejs.event.K_ESCAPE) {
                  pause = false
                } else if (event2.key == gamejs.event.K_F4){
                  return ActionCmd.QUIT
                } else if (event2.key == gamejs.event.K_F5) {
                  return ActionCmd.RESTART
                }
              }
            }
          }
        } else if (event.key == gamejs.event.K_F4) {
          return ActionCmd.QUIT
        } else if (event.key == gamejs.event.K_F5) {
          return ActionCmd.RESTART
        } else if (event.key == gamejs.event.K_F9) {  // Toggle rgb rendering.
          if (this._rgb_screen_px && this._feature_screen_px) {
            this._render_rgb = !this._render_rgb
            console.log('Rendering', this._render_rgb && 'RGB' || 'Feature Layers')
            this.init_window()
          }
        } else if (event.key == gamejs.event.K_F11) { // Toggle synchronous rendering.
          this._render_sync = !this._render_sync
          console.log('Rendering', this._render_sync && 'Sync' || 'Async')
        } else if (event.key == gamejs.event.K_F12) {
          this._raw_actions = !this._raw_actions
          console.log('Action space:', this._raw_actions && 'Raw' || 'Spatial')
         } else if (event.key == gamejs.event.K_F10) {  // Toggle player_relative layer.
          this._render_player_relative = !this._render_player_relative
         } else if (event.key == gamejs.event.K_F8) {  // Save a replay.
          this.save_replay(run_config, controller)
         } else if (event.key == gamejs.event.K_PLUS || event.key == gamejs.event.K_EQUALS && ctrl) {
          this.zoom(1.1)  // zoom in
         } else if (event.key == gamejs.event.K_MINUS || event.key == gamejs.event.K_UNDERSCORE && ctrl) {
          this.zoom(1 / 1.1)  // zoom out
         } else if (event.key == gamejs.event.K_PAGEUP || event.key == gamejs.event.K_PAGEDOWN) {
          if (ctrl) {
            if (event.key == gamejs.event.K_PAGEUP) {
              this._step_mul += 1
            } else if (this._step_mul > 1) {
              this._step_mul -= 1
            }
            console.log('New step mul:', this._step_mul)
          } else {
            event.key == gamejs.event.K_PAGEUP ? (this._fps *= 1.25) : (1 / 1.25)
            console.log(`New max game speed: ${this._fps}`)
          }
        } else if (event.key == gamejs.event.K_F1) {
          if (this._obs.observation.player_common.idle_worker_count > 0) {
            controller.act(this.select_idle_worker(ctrl, shift))
          }
        } else if (event.key == gamejs.event.K_F2) {
          if (this._obs.observation.player_common.army_count > 0) {
            controller.act(this.select_army(shift))
          }
        } else if (event.key == gamejs.event.K_F3) {
          if (this._obs.observation.player_common.warp_gate_count > 0) {
            controller.act(this.select_warp_gates(shift))
          }
          if (this._obs.observation.player_common.larva_count > 0) {
            controller.act(this.select_larva())
          }
        } else if (this.cmd_group_keys.hasOwnProperty(event.key)) {
          controller.act(this.control_group(this.cmd_group_keys[event.key], ctrl, shift, alt))
        } else if (this.camera_actions.hasOwnProperty(event.key)) {
          if (this._obs) {
            pt = point.Point.build(this._obs.observation.raw_data.player.camera)
            pt += this.camera_actions[event.key]
            controller.act(this.camera_action_raw(pt))
            controller.observer_act(this.camera_action_observer_pt(pt))
          }
        } else if (event.key == gamejs.event.K_ESCAPE) {
          controller.observer_act(this.camera_action_observer_player(
              this._obs.observation.player_common.player_id))
          if (this._queued_action) {
            this.clear_queued_action()
          } else {
            cmds = this._abilities((cmd) => cmd.hotkey == 'escape')  // Cancel
            cmds.forEach((cmd) => {
              // There could be multiple cancels.
              assert(!cmd.requires_point, '!cmd.requires_point')
              controller.act(this.unit_action(cmd, null, shift))
            })
          }
        } else {
          if (!this._queued_action) {
            key = gamejs.key.name(event.key).toLowerCase()
            new_cmd = this._queued_hotkey + key
            cmds = this._abilities((cmd, n=new_cmd) =>  cmd.hotkey != 'escape' && cmd.hotkey.startswith(n))
            if (cmds) {
              this._queued_hotkey = new_cmd
              if (cmds.length == 1) {
                cmd = cmds[0]
                if (cmd.hotkey == this._queued_hotkey) {
                  if (cmd.requires_point) {
                    this.clear_queued_action()
                    this._queued_action = cmd
                  } else {
                    controller.act(this.unit_action(cmd, null, shift))
                  }
                }
              }
            }
          }
        }
      } else if (event.type == gamejs.MOUSEBUTTONDOWN) {
        mouse_pos = this.get_mouse_pos(event.pos)
        if (event.button == MouseButtons.LEFT && mouse_pos) {
          if (this._queued_action) {
            controller.act(this.unit_action(
                this._queued_action, mouse_pos, shift))
          } else if (mouse_pos.surf.surf_type & SurfType.MINIMAP) {
            controller.act(this.camera_action(mouse_pos))
            controller.observer_act(this.camera_action_observer_pt(
                mouse_pos.world_pos))
          } else {
            this._select_start = mouse_pos
          }
        } else if (event.button == MouseButtons.RIGHT) {
          if (this._queued_action) {
            this.clear_queued_action()
          }
          cmds = this._abilities((cmd) => cmd.name == 'Smart')
          if (cmds) {
            controller.act(this.unit_action(cmds[0], mouse_pos, shift))
          }
        }
      } else if (event.type == gamejs.MOUSEBUTTONUP) {
        mouse_pos = this.get_mouse_pos(event.pos)
        if (event.button == MouseButtons.LEFT && this._select_start) {
          if (mouse_pos
            && mouse_pos.surf.surf_type & SurfType.SCREEN
            && mouse_pos.surf.surf_type == this._select_start.surf.surf_type) {
            controller.act(
              this.select_action(
                this._select_start, mouse_pos, ctrl, shift
              )
            )
          }
          this._select_start = null
        }
      }
      return ActionCmd.STEP
    }
  }

  camera_action(mouse_pos) {
    //Return a `sc_pb.Action` with the camera movement filled.//
    const action = new sc_pb.Action()
    const action_spatial = mouse_pos.action_spatial(action)
    mouse_pos.obs_pos.assign_to(action_spatial.getCameraMove().getCenterMinimap())
    return action
  }

  camera_action_raw(world_pos) {
    //Return a `sc_pb.Action` with the camera movement filled.//
    const action = new sc_pb.Action()
    const action_raw = new sc_pb.ActionRaw()
    const camera_move = new sc_pb.ActionObserverCameraMove()
    const center_world_space = new sc_pb.Point2d()
    camera_move.setCenterWorldSpace(center_world_space)
    action_raw.setCameraMove(camera_move)
    action.setActionRaw(action_raw)
    world_pos.assign_to(action.action_raw.camera_move.center_world_space)
    return action
  }

  camera_action_observer_pt(world_pos) {
    //Return a `sc_pb.ObserverAction` with the camera movement filled.//
    const action = new sc_pb.ObserverAction()
    const camera_move = new sc_pb.ActionObserverCameraMove()
    const proto_world_pos = new sc_pb.Point2d()
    world_pos.assign_to(proto_world_pos)
    camera_move.setWorldPos(proto_world_pos)
    action.setCameraMove(camera_move)
    return action
  }

  camera_action_observer_player(player_id) {
    //Return a `sc_pb.ObserverAction` with the camera movement filled.//
    const action = new sc_pb.ObserverAction()
    const camera_follow_player = new sc_pb.ActionObserverCameraFollowPlayer()
    camera_follow_player.setPlayerId(player_id)
    action.setCameraFollowPlayer(camera_follow_player)
    return action
  }

  select_action(pos1, pos2, ctrl, shift) {
    //Return a `sc_pb.Action` with the selection filled.//
    assert(
      pos1.surf.surf_type == pos2.surf.surf_type,
      'pos1.surf.surf_type == pos2.surf.surf_type'
    )
    assert(
      pos1.surf.world_to_obs == pos2.surf.world_to_obs,
      'pos1.surf.world_to_obs == pos2.surf.world_to_obs'
    )

    const action = new sc_pb.Action()
    const action_raw = new sc_pb.ActionRaw()
    const unit_command = new sc_pb.ActionRawUnitCommand()
    action_raw.setUnitCommand(unit_command)
    action.setActionRaw(action_raw)
    if (this._raw_actions) {
      unit_command.setAbilityId(0) // no-op
      const player_id = this._obs.getObservation().getPlayerCommon().getPlayerId()
      if (pos1.world_pos == po2.word_pos) { //select a point
        this._visible_units().forEach(([u, p]) => {
          if (pos1.world_pos.contained_circle(p, u.getRadius()) && u.getOwner() === player_id) {
            unit_command.addUnitTags(u.getTag())
          }
        })
      } else {
        const rect = new point.Rect(pos1.world_pos, pos2.world_pos)
        const unitTags = []
        this._visible_units().forEach(([u, p]) => {
          if (u.getOwner() === player_id && rect.intersects_circle(p, u.getRadius())) {
            unit_command.addUnitTags(u.getTag())
          }
        })
        const usedTags = unit_command.getUnitTags()
        usedTags.extend()
        unit_command.addUnitTags(u.getUn)
      }
    } else {
      const action_spatial = pos1.action_spatial(action)
      if (pos1.world_pos.eq(pos2.world_pos)) {
        const select = action_spatial.getUnitSelectionPoint()
        pos1.obs_pos.assign_to(select.getSelectionScreenCoord())
        const mod = new sc_spatial.ActionSpatialUnitSelectionPoint()
        if (ctrl) {
          shift ? select.setType(mod.getAddAllType()) : select.setType(mod.getAllType())
        } else {
          shift ? select.setType(mod.getToggle()) : select.setType(mod.getSelect())
        }
      } else {
        const select = action_spatial.getUnitSelectionRect()
        const rect = select.getSelectionScreenCoord()
        pos1.obs_pos.assign_to(rect.getP0())
        pos2.obs_pos.assign_to(rect.getP1())
        select.setSelectionAdd(shift)
      }
    }
    // Clear the queued action if something will be selected. An alternative
    // implementation may check whether the selection changed next frame.
    const units = this._units_in_area(new point.Rect(pos1.world_pos, pos2.world_pos))
    if (units) {
      this.clear_queued_action()
    }
    return action
  }

  select_idle_worker(ctrl, shift) {
    //Select an idle worker.//
    const action = new sc_pb.Action()
    const action_ui = new sc_pb.ActionUI()
    const selectIdleWorker = new sc_pb.ActionSelectIdleWorker()
    action_ui.setSelectIdleWorker(selectIdleWorker)
    action.setActionUi(action_ui)
    const mod = sc_ui.ActionSelectIdleWorker.Type
    let select_worker
    if (ctrl) {
      select_worker = shift ? mod.ADDALL : mod.ALL
    } else {
      select_worker = shift ? mod.ADD : mod.SET
    }
    action.getActionUi().getSelectIdleWorker().setType(select_worker)
    return action
  }

  select_army(shift) {
    //Select the entire army.//
    const action = new sc_pb.Action()
    const action_ui = new sc_pb.ActionUI()
    const select_army = new sc_pb.ActionSelectArmy()
    select_army.setSelectionAdd(shift)
    action_ui.setSelectArmy(select_army)
    action.setActionUi(action_ui)
    return action

  }

  select_warp_gates(shift) {
    //Select all warp gates.//
    const action = new sc_pb.Action()
    const action_ui = new sc_pb.ActionUI()
    const select_warp_gates = new sc_pb.ActionSelectWarpGates()
    select_warp_gates.setSelectionAdd(shift)
    action_ui.setSelectWarpGates(select_warp_gates)
    action.setActionUi(action_ui) 
    return action
  }

  select_larva() {
    //Select all larva.//
    const action = new sc_pb.Action()
    const action_ui = new sc_pb.ActionUI()
    const select_larva = new sc_pb.ActionSelectLarva()
    action_ui.setSelectLarva(select_larva)
    action.setActionUi(action_ui)
    // action.action_ui.select_larva.SetInParent() // Adds the empty proto field.
    return action
  }

  control_group(control_group_id, ctrl, shift, alt) {
    //Act on a control group, selecting, setting, etc.//
    const action = new sc_pb.Action()
    const action_ui = new sc_pb.ActionUI()
    action.setActionUi(action_ui)
    const select = new sc_pb.ActionControlGroup()
    action_ui.setControlGroup(select)
    const mod = sc_pb.ActionControlGroup.ControlGroupAction
    if (!(ctrl && shift && alt)) {
      select.setAction(mod.RECALL)
    } else if (ctrl && !(shift && alt)) {
      select.setAction(mod.SET)
    } else if (!ctrl && shift && !alt) {
      select.setAction(mod.APPEND)
    } else if (!(ctrl && shift) && alt) {
      select.setAction(mod.SETANDSTEAL)
    } else if (!ctrl && shift && alt) {
      select.setAction(mod.APPENDANDSTEAL)
    } else {
      return //unknown
    }
    select.setControlGroupId(control_group_id)
    return action
  }

  unit_action(cmd, pos, shift) {
    //Return a `sc_pb.Action` filled with the cmd and appropriate target.//
    const action = new sc_pb.Action()
    const action_raw = new sc_pb.ActionRaw()
    let unit_command = new sc_pb.ActionRawUnitCommand()
    const target_world_space_pos = new sc_pb.Point2D()
    unit_command.setTargetWorldSpacePos(target_world_space_pos)
    action_raw.setUnitCommand(unit_command)
    if (this._raw_actions) {
      unit_command.setAbilityId(cmd.getAbilityId())
      unit_command.setQueueCommand(shift)
      const player_id = this._obs.getObservation().getPlayerCommon().getPlayerId()
      unit_command.setUnitTagsList(
        this._visible_units().filter(([u]) => u.getIsSelected() && u.getOwner() == player_id)
      )
      if (pos) {
        const units = this._visible_units()
        let found
        for (let i = 0; i < units.length; i++) {
          const [u, p] = units[i]
          if (pos.world_pos.contained_circle(p, u.getRadius())) {
            unit_command.setTargetUnitTag(u.getTag())
            found = true
            break
          }
        }
        if (!found) {
          pos.world_pos.assign_to(target_world_space_pos)
        }
      }
    } else {
      if (pos) {
        const action_spatial = pos.action_spatial(action)
        unit_command.setAbilityId(cmd.getAbilityId())
        unit_command.setQueueCommand(shift)
        if (pos.surf.surf_type & SurfType.SCREEN) {
          pos.obs_pos.assign_to(unit_command.target_screen_coord)
        } else if (pos.surf.surf_type & SurfType.MINIMAP) {
          pos.obs_pos.assign_to(unit_command.target_minimap_coord)
        }
      } else {
        unit_command = new sc_pb.ActionSpatialUnitCommand()
        unit_command.setAbilityId(cmd.getAbilityId())
        if (this._feature_screen_px) {
          const action_feature_layer = new sc_pb.ActionSpatial()
          action_feature_layer.setUnitCommand(unit_command)
          action.setFeatureLayer(action_feature_layer)
        } else {
          const action_render = new sc_pb.ActionSpatial()
          action_render.setUnitCommand(unit_command)
          action.setActionRender(action_render)
        }
      }
    }

    this.clear_queued_action()
    return action
  }

  _abilities(fn = null) {
    //Return the list of abilities filtered by `fn`.//
    const out = []
    this._obs.getObservation().getAbilitiesList().forEach((cmd) => {
      const ability = _Ability(cmd, this._static_data.abilities)
      if (!fn || fn(ability)) {
        // out[ability.ability_id] = ability
        out.push(ability)
      }
    })
    return out
  }

  _visible_units() {
    /*
      A generator of visible units and their positions as `Point`s, sorted.//
      Sort the units by elevation, then owned (eg refinery) above world (ie 16)
      (eg geiser), small above big, and otherwise arbitrary but stable.
    */
    let units = new Array(this._obs.getObservation().getRawData().getUnitsList().length)
    this._obs.getObservation().getRawData().getUnitsList().forEach((u, i) => {
      units[i] = [u.getPos().getZ(), u.getOwner() != 16, -u.getRadius(), u.getTag(), u]
    })
    units = units.sorted((a, b) => a[0] - b[0])
    return units.map((arr) => [arr[arr.length - 1], new point.Point(u.getPos())])
  }

  _units_in_area(rect) {
    //Return the list of units that intersect the rect.//
    const player_id = this._obs.getObservation().getPlayerCommon().getPlayerId()
    return this._visible_units.filter(([u, p]) => rect.intersects_circle(p, u.getRadius()) && u.getOwner() == player_id)
  }

  get_unit_name(surf, name, radius) {
    //Get a length limited unit name for drawing units.//
    const key = [name, radius].join(',')
    if (!this._name_lengths.hasOwnProperty(key)) {
      const max_len = surf.world_to_surf.fwd_dist(radius * 1.6)
      let found = false
      for (let i = 0; i < name.length; i++) {
        if (this._font_small.size(name.slice(0, i + 1)) > max_len) {
          this._name_lengths[key] = name.slice(0, i)
          found = true
          break
        }
      }
      if (!found) {
        this._name_lengths[key] = name
      }
    }
    return this._name_lengths[key]
  }

  draw_units(surf) {
    //Draw the units and buildings.//
    const unit_dict = null // Cache the units {tag: unit_proto} for orders.
    const tau = 2 * Math.PI
    this._visible_units().forEach(([u, p]) => {
      if (this._camera.intersects_circle(p, u.getRadius())) {
        const fraction_damage = clamp(
          (u.getHealthMax() - u.getHealth()) / (u.getHealthMax() || 1),
          0,
          1
        )
        if (u.getDisplayType() == sc_raw.DisplayType.PLACEHOLDER) {
          surf.draw_circle(
            Math.floor(colors.PLAYER_ABSOLUTE_PALETTE[u.getOwner()] / 3),
            p,
            u.getRadius()
          )
        } else {
          surf.draw_circle(
            colors.PLAYER_ABSOLUTE_PALETTE[u.getOwner()],
            p,
            u.getRadius()
          )

          if (fraction_damage > 0) {
            surf.draw_circle(
              Math.floor(colors.PLAYER_ABSOLUTE_PALETTE[u.getOwner()] / 2),
              p,
              u.getRadius() * fraction_damage
            )
          }
        }
        let thickness = 1
        surf.draw_circle(colors.black, p, u.getRadius(), thickness)

        if (this._static_data.unit_stats[u.getUnitType()].movement_speed > 0) {
          surf.draw_arc(
            colors.white,
            p,
            u.getRadius(),
            u.getFacing() - 0.1,
            u.getFacing() + 0.1,
            thickness
          )
        }

        function draw_arc_ratio(color, world_loc, radius, start, end, thickness) {
          surf.draw(
            color,
            world_loc,
            radius,
            start * tau,
            end * tau,
            thickness
          )
        }

        if (u.getShield() && u.getShieldMax()) {
          draw_arc_ratio(colors.blue, p, u.getRadius() - 0.05, 0, u.getShield() / u.getShieldMax())
        }

        if (u.getEnergy() && u.getEnergyMax()) {
          draw_arc_ratio(colors.purple * 0.9, p, u.getRadius() - 0.1, 0, u.getEnergy() / u.getEnergyMax())
        }

        if (0 < u.getBuildProgress() < 1) {
          draw_arc_ratio(colors.cyan, p, u.getRadius() - 0.15, 0, u.getBuildProgress())
        } else if (u.getOrdersList().length && 0 < u.getOrdersList()[0].getProgress() < 1) {
          draw_arc_ratio(colors.cyan, p, u.getRadius() - 0.15, 0,
                         u.getOrdersList()[0].getProgress())
        }

        if (u.getBuffDurationRemain() && u.buff_duration_max) {
          draw_arc_ratio(colors.white, p, u.getRadius() - 0.2, 0,
                         u.getBuffDurationRemain() / u.buffDurationMax())
        }

        thickness = 3
        if (u.getAttackUpgradeLevel()) {
          draw_arc_ratio(this.upgrade_colors[u.getAttackUpgradeLevel()], p,
                         u.getRadius() - 0.25, 0.18, 0.22, thickness)
        }

        if (u.getArmorUpgradeLevel()) {
          draw_arc_ratio(this.upgrade_colors[u.getArmorUpgradeLevel()], p,
                         u.getRadius() - 0.25, 0.23, 0.27, thickness)
        }

        if (u.getShieldUpgradeLevel()) {
          draw_arc_ratio(this.upgrade_colors[u.getShieldUpgradeLevel()], p,
                         u.getRadius() - 0.25, 0.28, 0.32, thickness)
        }

        function write_small(loc, s) {
          surf.write_world(this._font_small, colors.white, loc, String(s))
        }

        const name = this.get_unit_name(
            surf, this._static_data.units.get(u.getUnitType(), "<none>"), u.getRadius())
        if (name) {
          write_small(p, name)
        }
        if (u.getIdealHarvesters() > 0) {
          write_small(p.add(new point.Point(0, 0.5)),
                      `${u.getAssignedHarvesters()} / ${u.getIdealHarvesters()}`)
        }
        if (u.getMineralContents() > 0) {
          write_small(p.sub(new point.Point(0, 0.5)), u.getMineralContents())
        } else if (u.getVespeneContents() > 0) {
          write_small(p.sub(new point.Point(0, 0.5)), u.getVespeneContents())
        } else if (u.getDisplayType() == sc_raw.DisplayType.SNAPSHOT) {
          write_small(p.sub(new point.Point(0, 0.5)), "snapshot")
        } else if (u.getDisplayType() == sc_raw.DisplayType.PLACEHOLDER) {
          write_small(p.sub(new point.Point(0, 0.5)), "placeholder")
        } else if (u.getIsHallucination()) {
          write_small(p.sub(new point.Point(0, 0.5)), "hallucination")
        } else if (u.getIsBurrowed()) {
          write_small(p.sub(new point.Point(0, 0.5)), "burrowed")
        } else if (u.getCloak() != sc_raw.CloakState.NOTCLOAKED) {
          write_small(p.sub(new point.Point(0, 0.5)), "cloaked")
        }

        if (u.getIsSelected()) {
          surf.draw_circle(colors.green, p, u.radius + 0.1, 1)
          const unit_dict = {}

          // Draw the orders of selected units.
          let start_point = p
          const orders = u.getOrdersList()
          for (let i = 0; i < orders.length; i++) {
            let target_point = null
            const o = orders[i]
            if (o.hasTargetWorldSpacePos()) {
              target_point = new point.Point(o.getTargetWorldSpacePos())
            } else if (o.hasTargetUnitTag()) {
              this._obs.getObservation().getRawData().getUnitsList().forEach((t) => {
                unit_dict[t.getTag()] = t
              })
              const target_unit = unit_dict[o.getTargetUnitTag()]
              let target_point
              if (target_unit) {
                target_point = new point.Point(target_unit.getPos())
              }
              if (target_point) {
                surf.draw_line(colors.cyan * 0.75, start_point, target_point)
                start_point = target_point
              } else {
                break
              }
            }
          }
          const rallyTargets = u.getRallyTargetsList()
          for (let i = 0; i < rallyTargets.length; i++) {
            surf.draw_line(colors.cyan * 0.75, p,
                           new point.Point(rally.getPoint()))
          }
        }
      }
    })
  }

  draw_selection(surf) {
    //Draw the selection rectangle.//
    const select_start = this._select_start // Cache to avoid a race condition.
    if (select_start) {
      const mouse_pos = this.get_mouse_pos()
      if (mouse_pos && mouse_pos.surf.surft_type & SurfType.SCREEN && mouse_pos.surf.surf_type == select_start.surf.surf_type) {
        const rect = new point.Rect(select_start.world_pos, mouse_pos.world_pos)
        surf.draw_rect(colors.green, rect, 1)
      }
    }
  }

  draw_build_target(surf) {
    // Draw the build target//
    const round_half = (v, cond) => cond ?  Math.round(v - 0.5) + 0.5 : Math.round(v)

    const queued_action = this._queued_action
    if (queued_action) {
      const radius = queued_action.footprint_radius
      if (radius) {
        let pos = this.get_mouse_pos()
        if (pos) {
          pos = new point.Point(
            round_half(pos.world_pos.y, (radius * 2) % 2),
            round_half(pos.world_pos.y, (radius * 2) % 2)
          )
          surf.draw_circle(
            colors.PLAYER_ABSOLUTE_PALETTE[
              this._obs.getObservation().getPlayerCommon().getPlayerId()
            ],
            pos,
            radius
          )
        }
      }
    }
  }

  draw_overlay(surf) {
    function sum(arr) {
     return arr.reduce((acc, curr = 0) => acc + curr)
    }
    //Draw the overlay describing resources.//
    const obs = this._obs.getObservation()
    const player = obs.getPlayerCommon()
    surf.write_screen(
      this._font_large, colors.green, [0.2, 0.2],
      `Minearls: ${player.getMinerals()}, Vespene: ${player.getVespene()}, Food: ${player.getFoodUsed()} / ${player.getFoodCap()}`,
      'right'
    )

    const [times, steps] = zip(this._game_times)
    const sec = Math.floor(obs.getGameLoop() / 22.4)
    surf.write_screen(
      this._font_large, colors.green, [-0.2, 0.2],
      `Score: ${obs.getScore.getScore()}, Step: ${obs.getGameLoop()}, ${sum(steps) / (sum(times) || 1)}/s, Time: ${Math.floor(sec / 60)}: ${sec % 60}`,
      'right'
    )

    surf.write_screen(
      this._font_large, colors.green * 0.8, [-0.2, 1.2]
      `APM: ${obs.getScore().getScoreDetails().getCurrentApm()}, EPM: ${obs.getScore.getScoreDetails().getCurrentEffectiveApm()}, FPS: O:${times.length / (sum(times) || 1)}, R: ${this._render_times / (sum(this._render_times) || 1)}`,
      'left'
    )

    const line = 3
    const alerts = this._alerts.sort((a, b) => a[1] - b[1])
    alerts.forEach(([alert, ts]) => {
      if (performance.now() < ts + (3 * 1000)) { // Show for 3 seconds.
        surf.write_screen(this._font_large, colors.red, [20, line], alert)
        line += 1
      } else {
        delete this._alerts[alert]
      }
    })
  }

  draw_help(surf) {
    //Draw the help dialog.//
    if (!this._help) {
      return
    }
    function write(loc, text) {
      surf.write_screen(this._font_large, colors.black, loc, text)
    }

    surf.surf.fill(colors.white * 0.8)
    write([1, 1], 'Shortcuts:')

    const max_len = Math.max(...this.shortcuts.map((s) => s.length))
    const shortcuts = this.shortcuts.slice(2)
    shortcuts.forEach(([hotkey, description], i) => {
      write([2, i], hotkey)
      write([3 + max_len * 0.7, i], description)
    })
  }
  
  draw_commands(surf) {
    // Draw the list of upgrades available commands.//
    function write(loc, text, color = colors.yellow) {
      surf.write_screen(this._font_large, color, loc, text)
    }
    let line = 2
    function write_line(x, args) {
      line += 1
      write([x, line], ...(Array.from(arguments).slice(1)))
    }
    action_count = this._obs.getObservation().getAbilitiesList().length
    if (action_count > 0) {
      write_line(0.2, 'Available Actions: ', colors.green)
      const past_abilities = {}
      this._past_actions.forEach((act) => {
        if (act.ability) {
          past_abilities[act.abilitiy] = act
        }
      })
      let color
      this._abilities((c) => c.name != 'Smart')
        .sort((a, b) => a.name > b.name ? 1 : -1)
        .forEach((cmd) => {
          if (this._queued_action && cmd == this._queued_action) {
            color = colors.green
          } else if (this._queued_hotkey
            && cmd.hotkey.slice(0, this._queued_hotkey.length) == this._queued_hotkey) {
            color = colors.green * 0.75
          } else if (past_abilities.hasOwnProperty(cmd.ability_id)) {
            color = colors.red
          } else {
            color = colors.yellow
          }
          const hotkey = cmd.hotkey.slice(0, 3) // trunccate "escape" -> "esc"
          line += 1
          y = line
          write([1, y], hotkey, color)
          write([4, y], cmd.name, color)
      })
      line += 1
    }
    const upgradesList = this._obs.getObservation().getRawData().getPlayer().getUpgradeIdsList()
    const upgrade_count = upgradesList.length
    if (upgrade_count > 0) {
      write_line(0.2, `Upgrades: ${upgrade_count}`, colors.green)
      const upgrades = upgradesList
        .map((upgrade_id) => this._static_data.upgrades[upgrade_id].name)
      upgrades.sort().forEach((name) => write_line(1, name))
    }
  }

  draw_panel(surf) {
    //Draw the unit selection or build queue.//
    const left = -14 // How far from the right border
    let line = 3

    function unit_name(unit_type) {
      return this._static_data.units[unit_type] || '<unknown>'
    }
    function write(loc, text, color = colors.yellow) {
      surf.write_screen(this._font_large, color, loc,  text)
    }
    function write_line(x, args) {
      line += 1
      write([left + x, line], ...(Array.from(arguments).slice(1)))
    }

    function write_single(unit) {
      // Write a description of a single selected unit.//
      write_line(1, unit_name(unit.getUnitType()), colors.cyan)
      write_line(1, `Health: ${unit.getHealth()} / ${unit.getMaxHealth()}`)
      if (unit.getMaxShields()) {
        write_line(1, `Shields: ${unit.getShields()} / ${unit.getMaxShields()}`)
      }
      if (unit.getMaxEnergy()) {
        write_line(1, `Energy: ${unit.getEnergy()} / ${unit.getMaxEnergy()}`)
      }
      if (unit.getBuildProgress() > 0) {
        write_line(1, `Progress: ${Math.round(unit.getBuildProgress() * 100)}`)
      }
      if (unit.getTransportSlotsTaken()> 0) {
        write_line(1, `Slots: ${unit.getTransportSlotsTaken()}`)
      }
    }

    function write_multi(units) {
      //Write a description of multiple selected units.//
      const counts = new DefaultDict(1)
      units.forEach((unit) => {
        counts[unit_name(unit.getUnitType())] += 1
      })
      Object.keys(counts).sort().forEach((name) => {
        const count = counts[name]
        line += 1
        const y = line
        write([left + 1, y], count)
        write([left + 3, y], name)
      })
    }

    const ui = this._obs.getObservation().getUiData()

    if (ui.getGroups()) {
      write_line(0, 'Control Groups: ', colors.green)
      ui.getGroupsList().forEach((group) => {
        line += 1
        const y = line
        write([left + 1, y], `${group.getControlGroupIndex()}`, colors.green)
        write([left + 3, y], `${group.getCount()} ${unit_name(group.getLeaderUnitType())}`)
      })
      line += 1
    }

    if (ui.hasSingle()) {
      write_line(0, 'Selection: ', colors.green)
      write_single(ui.getSingleUnit())
      if (ui.getSingle().getAttackUpgradeLevel()
        || ui.getSingle().getArmorUpgradeLevel()
        || ui.getSingle().getShieldUpgradeLevel()) {
        write_line(1, 'Upgrades: ')
        if (ui.getSingle().getAttackUpgradeLevel()) {
          write_line(2, `Attack: ${ui.getSingle().getAttackUpgradeLevel()}`)
        }
        if (ui.getSingle().getArmorUpgradeLevel()) {
          write_line(2, `Armor: ${ui.getSingle().getArmorUpgradeLevel()}`)
        }
        if (ui.getSingle().getShieldUpgradeLevel()) {
          write_line(2, `Shield: ${ui.getSingle().getShieldUpgradeLevel()}`)
        }
      }
      if (ui.getSingle().getBuffsList().length) {
        write_line(1, 'Buffs:')
        ui.getSinge().getBuffsList().forEach((b) => {
          write(line(2, buffs.Buffs(b).name))
        })
      }
    } else if (ui.hasMulti()) {
      write_line(0, 'Selection: ', colors.green)
      write_multi(ui.getMulti().getUnitsList())
    } else if (ui.hasCargo()) {
      write_line(0, 'Selection: ', colors.green)
      write_single(ui.getCargo().getUnit())
      line += 1
      write_line(0, 'Cargo: ', colors.green)
      write_line(1, `Empty slots: ${ui.getCargo().getSlotsAvailable()}`)
      write_multi(ui.getCargo().getPassengersList())
    } else if (ui.hasProduction()) {
      write_line(0, 'Selection: ', colors.green)
      write_single(ui.getProduction().getUnit())
      line += 1
      if (ui.getProduction().getProductionQueue()) {
        write_line(0, 'Production: ', colors.green)
        ui.getProduction().getProductionQueue().forEach((item) => {
          const specific_data =this.static_data.abilities[item.ability_id]
          let general_data
          if (specific_data.remaps_to_ability_id) {
            general_data = this._static_data.abilities[specific_data.remaps_to_ability_id]
          } else {
            general_data = specific_data
          }
          let s = general_data.friendly_name || general_data.button_name || general_data.link_name
          s = s.replace('Research ', '').replace('Train ', '')
          if (item.getBuildProgress() > 0) {
            s += `: ${Math.round(item.getBuildProgress() * 100)}`
          }
          write_line(1, s)
        })
      }
    }
  }

  draw_actions() {
    //Draw the actions so that they can be inspected for accuracy.//
    const now = performance.now()
    this._past_actions.forEach((act) => {
      if (act.pos && now < act.deadline) {
        const remain = (act.deadline - now) / (act.deadline - act.time)
        if (act.pos instanceof point.Point) {
          const size = remain / 3
          this.all_surfs(_Surface.draw_circle, act.color, act.pos, size, 1)
        } else {
          // Fade with alpha would be nice, but doesn't seem to work.
          this.all_surfs(_Surface.draw_rect, act.color, act.pos, 1)
        }
      }
    })
  }
  prepare_actions(obs) {
    //Keep a list of the past actions so they can be drawn.//
    const now = performance.now()
    while (this._past_actions.length && this._past_actions[0].dealine < now) {
      this._past_actions.pop()
    }

    function add_act(ability_id, color, pos, timeout = 1000) {
      let ability
      if (ability_id) {
        ability = this._static_data.abilities[ability_id]
        if (ability.remaps_to_ability_id) {
          ability_id = ability.remaps_to_ability_id
        }
      }
      this._past_actions.append(new PastAction(ability_id, color, pos, now, now + timeout))
    }

    obs.getActionsList().forEach((act) => {
      let pos
      if (act.hasActionRaw()
        && act.getActionRaw().hasUnitCommand()
        && act.getActionRaw().getUnitCommand().hasTargetWorldSpacePos()) {
        pos = new point.Point(act.getActionRaw().getUnitCommand().getTargetWorldSpacePos())
      add_act(act.getActionRaw().getUnitCommand().getAbilityId(), colors.yellow, pos)
      }
      if (act.hasActionFeatureLayer()) {
        const act_fl = act.getActionFeatureLayer()
        if (act_fl.hasUnitCommand()) {
          if (act_fl.getUnitCommand().hasTargetScreenCoord()) {
            pos = this._world_to_feature_screen_px.back_pt(
              new point.Point(act_fl.getUnitCommand().getTargetScreenCoord())
            )
            add_act(act_fl.getUnitCommand().getAbilityId(), colors.cyan, pos)
          } else if (act_fl.getUnitCommand().hasTargetMinimapCoord()) {
            pos = this._world_to_feature_minimap_px.back_pt(
              new point.Point(act_fl.getUnitCommand().getTargetMinimapCoord())
            )
            add_act(act_fl.getUnitCommand().getAbilityId(), colors.cyan, pos)
          } else {
            add_act(act_fl.getUnitCommand().getAbilityId(), null, null)
          }
        }
        if (act_fl.hasUnitSelectionPoint()
          && act_fl.getUnitSelectionPoint().hasSelectionScreenCoord()) {
          pos = this._world_to_feature_screen_px.back_pt(
            new point.Point(act_fl.getUnitSelectionPoint().getSelectionScreenCoord())
          )
          add_act(null, colors.cyan, pos)
        }
        if (act_fl.hasUnitSelectionRect()) {
          act_fl.hasUnitSelectionRect().getSelectionScreenCoordList().forEach((r) => {
            const rect = new point.Rect(
              this._world_to_feature_screen_px.back_pt(
                new point.Point(r.getP0()),
              ),
              this._world_to_feature_screen_px.back_pt(
                new point.Point(r.getP1())
              )
            )
            add_act(null, colors.cyan, rect, 0.3)
          })
        }
        if (act.hasActionRender()) {
          const act_rgb = act.getActionRender()
          if (act_rgb.hasUnitCommand()) {
            if (act_rgb.getUnitCommand().hasTargetSCreenCoord()) {
              pos = this._world_to_rgb_screen_px.back_pt(
                new point.Point(act_rgb.getUnitCommand().getTargetScreenCoord())
              )
              add_act(act_rgb.getUnitCommand().getAbilityId(), colors.red, pos)
            } else if (act_rgb.getUnitCommand().hasTargetMinimapCoord()) {
              pos = this._world_to_rgb_minimap_px.back_pt(
                new point.Point(act_rgb.getUnitCommand().getTargetMinimapCoord())
              )
              add_act(act_rgb.getUnitCommand().getAbilityId(), colors.red, pos)
            } else {
              add_act(act_rgb.getUnitCommand().getAbilityId(), null, null)
            }
          }
          if (act_rgb.hasUnitSelectionPoint()
            && act_rgb.getUnitSelectionPoint.hasSelectionScreenCoord()) {
            pos = this._word_to_rgb_screen_px.back_pt(
              new point.Point(act_rgb.getUnitSelectionPoint().getSelectionScreenCoord())
            )
            add_act(null, colors.red, pos)
          }
          if (act_rgb.hasUnitSelectionRect()) {
            act_rgb.getUnitSelectionRect().getSelectionScreenCoordList().forEach((r) => {
              const rect = new point.Rect(
                this._world_to_rgb_screen_px.back_pt(
                  new point.Point(r.getP0())
                ),
                this._world_to_rgb_screen_px.back_pt(
                  new point.Point(r.getP1())
                )
              )
              add_act(null, colors.red, rect, 0.3)
            })
          }
        }
      }
    })
  }

  async draw_base_map(surf) {
    //Draw the base map.//
    const hmap_feature = features.SCREEN_FEATURES.height_map
    let hmap = hmap_feature.unpack(this._obs.getObservation())
    if (!np.any(hmap)) {
      hmap.add(100)
    }
    const hmap_color = hmap_feature.color(hmap)
    let out = hmap_color.mul(0.6)

    const creep_feature = features.SCREEN_FEATURES.creep
    const creep = creep_feature.unpack(this._obs.getObservation())
    const creep_mask = creep.greater(0)
    const creep_color = creep_feature.color(creep)
    let temp1 = out.where(creep_mask, out.mul(0.4))
    let temp2 = creep_color.where(creep_mask, creep_color.mul(0.6))
    out = out.where(creep_mask, temp1.add(temp2))
    
    const power_feature = features.SCREEN_FEATURES.power_feature
    const power = power_feature.unpack(this._obs.getObservation())
    const power_mask = power.greater(0)
    const power_color = power_feature.color(power)
    temp1 = out.where(power_mask, out.mul(0.7))
    temp2 = power_color.where(power_mask, power_color.mul(0.3))
    out = out.where(power_mask, temp1.add(temp2))

    if (this._render_player_relative) {
      const player_rel_feature = features.SCREEN_FEATURES.player_relative
      const player_rel = player_rel_feature.unpack(this._obs.getObservation())
      const player_rel_mask = player_rel.greater(0)
      const player_rel_color = player_rel_feature.color(player_rel)
      out = out.where(player_rel_mask, player_rel_color)
    }

    const visibility = features.SCREEN_FEATURES.visibility_map.unpack(this._obs.getObservation())
    const visibility_fade = np.tensor([[0.5, 0.5, 0.5], [0.75, 0.75, 0.75], [1, 1, 1]])
    out = out.where(visibility, out.mul(visibility_fade))

    surf.blit_np_array(out)
  }

  draw_mini_map(surf) {
    //Draw the minimap//
    if (this._render_rgb
      && this._obs.getObservation.hasRenderData()
      && this._obs.getObservation().getRenderData().hasMinimap()) {
      // Draw the rendered version.
      surf.blit_np_array(features.Feature.unpack_rgb_image(
        this._obs.getObservation().getRenderData().getMinimap()
      ))
    } else { // Render it manually from feature layer data.
      const hmap_feature = features.MINIMAP_FEATURES.height_map
      let hmap = hmap_feature.unpack(this._obs.getObservation())
      if (!np.any(hmap)) {
        hmap = hmap.add(100)
      }
      hmap_color = hmap_feaure.color(hmap)

      const creep_feature = features.MINIMAP_FEATURES.creep
      const creep = creep_feature.unpack(this._obs.getObservation())
      const creep_mask = creep.greater(0)
      const creep_color = creep_feature.color(creep)

      const player_id = this._obs.getObservation().getPlayerCommon().getPlayerId()
      let player_feature
      if (player_id == 0 || player_id == 16) { // observer
        // If we're the observer, show the absolute since otherwise all player
        // units are friendly, making it pretty boring.
        const player_feature = features.MINIMAP_FEATURES.player_id
      } else {
        const player_feature = features.MINIMAP_FEATURES.player_id
      }

      const player_data = player_feature.unpack(self._obs.observation)
      const player_mask = player_data.greater(0)
      const player_color = player_feature.color(player_data)

      const visibility = features.MINIMAP_FEATURES.visibility_map.unpack(
        this._obs.getObservation()
      )
      const visibility_fade = np.tensor([[0.5, 0.5, 0.5], [0.75, 0.75, 0.75], [1, 1, 1]])
      // Compose and color the different layers.
      let out = hmap_color.mul(0.6)
      let temp1 = out.where(creep_mask, out.mul(0.4))
      let temp2 = creep_color.where(creep_mask, creep_color.mul(0.6))
      out = out.where(creep_mask, temp1.add(temp2))

      out = out.where(player_mask, player_color)
      out = out.where(visibility, out.mul(visibility_fade))

      const shape = this._playable.diagonal.scale_max_size(
        this._feature_minimap_px
      ).floor()
      surf.blit_np_array(out.slice([0, 0], [shape.y, shape.x]))

      surf.draw_rect(colors.white.mul(0.8), this._camera, 1) // Camera

      // Sensor rings.
      this._obs.getObservation().getRawData().getRadarList().forEach((radar) => {
        surf.draw_circle(
          colors.white.div(2),
          new point.Point(radar.getPos()),
          radar.getRadius(),
          1
        )
      })
    }

    // highlight enemy base locations for a short while at start of game
    if (this._obs.getObservation().getGameLoop() < 22.4 * 20) {
      this._game_info.getStartRaw().getStartLocationsList().forEach((loc) => {
        surf.draw_circle(colors.red, new point.Point(loc), 5, 1)
      })
    }

    gamejs.draw.rect(surf.surf, colors.red, surf.surf.get_rect(), 1) // Border
  }

  check_valid_queued_action() {
    // Make sure the existing command is still valid
    if (this._queued_hotkey && !this._abilities((cmd) => cmd.hotkey.slice(0, this._queued_hotkey.length) == this._queued_hotkey)) {
      this._queued_hotkey = ''
    }
    if (this._queued_action && !this._abilities((cmd) => this._queued_action == cmd)) {
      this._queued_action = null
    }
  }

  draw_rendered_map(surf) {
    // Draw the rendered pixels.//
    surf.blit_np_array(features.Feature.unpack_rgb_image(
      this._obs.getObservation().getRenderData().getMap()
    ))
  }

  draw_screen(surf) {
    //Draw the screen area.//
    if (this._reander_rgb &&
      this._obs.getObservation().hasRenderData() &&
      this._obs.getObservation().getRenderData().hasMap()) {
      this.draw_rendered_map(surf)
    } else {
      this.draw_base_map(surf)
      this.draw_effects(surf)
      this.draw_units(surf)
    }
    this.draw_selection(surf)
    this.draw_build_target(surf)
    this.draw_overlay(surf)
    this.draw_commands(surf)
    this.draw_panel(surf)
  }

  draw_feature_layer(surf, feature) {
    //Draw a feature layer//
    const layer = feature.unpack(this._obs.getObservation())
    if (layer != null) {
      surf.blit_np_array(feature.color(layer))
    } else { // Ignore layers that aren't in this version of SC2.
      surf.surf.fill(colors.black)
    }
  }

  draw_all_surfs(fn, args) {
    this._surfaces.forEach((surf) => {
      if (surf.world_to_surf) {
        fn(surf, ...Array.from(arguments).slice(1))
      }
    })
  }

  render(obs) {
    //Push an observation onto the queue to be rendered.//
    if (!this._initialized) {
      return
    }
    const now = performance.now()
    this._game_times.push(
      now - this._last_time,
      Math.max(1, obs.getObservation().getGameLoop() - this._obs.getObersvation().getGameLoop())
    )
    this._last_time = now
    this._last_game_loop = this._obs.getObservation().getGameLoop()
    this._obs_queue.add(obs)
    // dont think we need this for JavaScript
    // if (this._render_sync) {
    //   this._obs_queue.join()
    // }
  }

  get sc_alerts() {
    return Enum.IntEnum('Alert', sc_pb.Alert)
  }

  get sc_error_action_result() {
    return Enum.IntEnum('ActionResult')
  }

  async render_thread() {
    //A render loop that pulls observations off the queue to render.//
    let obs = true
    while (obs) {  // Send something falsy through the queue to shut down.
      obs = await this._obs_queue.get()
      if (obs) {
        obs.getObservation().getAlerts().forEach((alert) => {
          this._alerts[this.sc_alerts(alert)] = performance.now()
        })
        obs.getActionErrorsList().forEach((err) => {
          if (err.getResult() != this.sc_error_action_result.SUCCESS) {
            this._alerts[this.sc_error_action_result(err.getResult())] = performance.now()
          }
        })
        this.prepare_actions(obs)
        if (this._obs_queue.length === 0) {
          // Only render the latest observation so we keep up with the game.
          this.render_obs(obs)
        }
        if (this._video_writer) {
          const axes = [1, 0, 2]
          this._video_writer.add(np.transpose(
            window.gamejs.surfarray.pixels3d(this._window), axes)
          )
        }
      }
      // Dont think we need this in JavaScript
      // this._obs_queue.task_done()
    }
  }

  render_obs(obs) {
    //Render a frame given an observation.//
    const start_time = performance.now()
    this._obs = obs
    this.check_valid_queued_action()
    this._update_camera(new point.Point(
      this._obs.getObservation().getRawData().getPlayer().getCamera())
    )

    this._surfaces.forEach((surf) => {
      // Render that surface.
      surf.draw(surf)
    })
    const mouse_pos = this.get_mouse_pos()
    if (mouse_pos) {
      // Draw a small mouse cursor)
      this.all_surfs(_Surface.draw_circle, colors.green, mouse_pos.world_pos, 0.1)
    }

    this.draw_actions()

    withPython(sw('flip'), () => {
      window.gamejs.display.flip()
    })

    this._render_times.push(performance.now() - start_time)
  }

}

class RendererHumanBackend {
  //Render starcraft obs with gamejs such that it's playable by humans.//

  static get camera_actions() {
    const camera_actions = {}
    camera_actions[window.gamejs.event.K_LEFT] = new point.Point(-3, 0)
    camera_actions[window.gamejs.event.K_RIGHT] = new point.Point(3, 0)
    camera_actions[window.gamejs.event.K_UP] = new point.Point(0, 3)
    camera_actions[window.gamejs.event.K_DOWN] = new point.Point(0, -3)
    return camera_actions
  }

  get camera_actions() { //eslint-disable-line
    return RendererHuman.camera_actions
  }

  static get cmd_group_keys() {
    const cmd_group_keys = {}
    cmd_group_keys[window.gamejs.event.K_0] = 0
    cmd_group_keys[window.gamejs.event.K_1] = 1
    cmd_group_keys[window.gamejs.event.K_2] = 2
    cmd_group_keys[window.gamejs.event.K_3] = 3
    cmd_group_keys[window.gamejs.event.K_4] = 4
    cmd_group_keys[window.gamejs.event.K_5] = 5
    cmd_group_keys[window.gamejs.event.K_6] = 6
    cmd_group_keys[window.gamejs.event.K_7] = 7
    cmd_group_keys[window.gamejs.event.K_8] = 8
    cmd_group_keys[window.gamejs.event.K_9] = 9
    return cmd_group_keys
  }

  get cmd_group_keys() { //eslint-disable-line
    return RendererHuman.cmd_group_keys
  }

  static get upgrade_colors() {
    return [
      colors.black,  // unused...
      colors.white.mul(0.6),
      colors.white.mul(0.8),
      colors.white,
    ]
  }

  get upgrade_colors() {
    return RendererHuman.upgrade_colors
  }

  constructor(fps = 22.4, step_mul = 1, render_sync = false, render_feature_grid = true, video = null) {
    /*Create a renderer for use by humans.

    Make sure to call `init` with the game info, or just use `run`.

    Args:
      fps: How fast should the game be run.
      step_mul: How many game steps to take per observation.
      render_sync: Whether to wait for the obs to render before continuing.
      render_feature_grid: When RGB and feature layers are available, whether
          to render the grid of feature layers.
      video: A filename to write the video to. Implicitly enables render_sync.
    */
    this._fps = fps
    this._step_mul = step_mul
    this._render_sync = render_sync || Boolean(video)
    this._raw_actions = false
    this._render_player_relative = false
    this._render_rgb = null
    this._render_feature_grid = render_feature_grid
    this._window = null
    this._window_scale = 0.75
    this._obs_queue = deque(undefined, 100)
    // probably won't need these in javascript
    this._render_thread = null //threading.Thread(target=this.render_thread, name="Renderer")
    // this._render_thread.start()
    this._game_times = deque(undefined, 100)  // Avg FPS over 100 frames.
    this._render_times = deque(undefined, 100)
    this._last_time = performance.now()
    this._last_game_loop = 0
    this._name_lengths = {}
    this._video_writer = video ? new video_writer.VideoWriter(video, fps) : null
  }

  close() {
    if (this._obs_queue.length) {
      //this._obs_queue.push(null) //??
      this._obs_queue = null
      this._render_thread = null
    }
    if (this._video_writer) {
      this._video_writer.close()
      this._video_writer = null
    }
  }

  async init(game_info, static_data) {
    /*Take the game info and the static data needed to set up the game.

    This must be called before render or get_actions for each game or restart.

    Args:
      game_info: A `sc_pb.ResponseGameInfo` object for this game.
      static_data: A `StaticData` object for this game.

    Raises:
      ValueError: if there is nothing to render.
    
    */
    this._game_info = game_info
    this._static_data = static_data
    assert(game_info.hasStartRaw(), 'game_info.hasStartRaw()')

    this._map_size = point.Point.build(game_info.getStartRaw().getMapSize())
    this._playable = new point.Rect(
      point.Point.build(game_info.getStartRaw().getPlayableArea().getP0()),
      point.Point.build(game_info.getStartRaw().getPlayableArea().getP1())
    )

    if (game_info.getOptions().hasFeatureLayer()) {
      const fl_opts = game_info.getOptions().getFeatureLayer()
      this._feature_screen_px = point.Point.build(fl_opts.getResolution())
      this._feature_minimap_px = point.Point.build(fl_opts.getMinimap_resolution())
      this._feature_camera_width_world_units = fl_opts.getWidth()
      this._render_rgb = false
      if (!fl_opts.getCropToPlayableArea()) {
        this._playable = new point.Rect(this._map_size)
      }
    } else {
      this._feature_screen_px = null
      this._feature_minimap_px = null
    }
    if (game_info.getOptions().hasRender()) {
      const render_opts = game_info.getOptions().getRender()
    }

    if (!this._feature_screen_px && !this._rgb_screen_px) {
      throw new ValueError('Nothing to render.')
    }

    try {
      await this.init_window()
      this._initialized = true
    } catch (err) {
      this._initialized = false
      console.error(''.lpad(60, '-'))
      console.error('Failed to initialize gamejs: ', e)
      console.error('Continuing without gamejs.')
      console.error('If you\'re using ssh and have an X server, try ssh -X.')
      console.error(''.lpad(60, '-'))
    }

    this._obs = new sc_pb.ResponseObservation()
    this._queued_action = null
    this._queued_hotkey = ''
    this._select_start = null
    this._alerts = {}
    this._past_actions = []
    this._help = false
    this._last_zoom_time = 0
  }

  async init_window() {
    //Initialize the gamejs window and lay out the surfaces//

    let resolve
    const prom = new Promise((res) => {
      resolve = res
    })
    gamejs.ready(resolve)
    await prom

    let main_screen_px
    if (this._render_rgb && this._rgb_screen_px) {
      main_screen_px = this._rgb_screen_px
    }
    else {
      main_screen_px = this._feature_screen_px
    }

    let window_size_ratio = main_screen_px
    let num_feature_layers = 0
    if (this._render_feature_grid) {
      // Want a roughly square grid of feature layers, each being roughly square.
      if (this._game_info.options.raw) {
        num_feature_layers += 5
      }
      if (this._feature_screen_px) {
        num_feature_layers += features.SCREEN_FEATURES.length
        num_feature_layers += features.MINIMAP_FEATURES.length
      }
      if (num_feature_layers > 0) {
        const feature_cols = Math.ceil(Math.sqrt(num_feature_layers))
        const feature_rows = Math.ceil(num_feature_layers / feature_cols)
        const features_layout = new point.Point(
          feature_cols, feature_rows * 1.05 // Make room for titles.
        )

        // Scale features_layout to main_screen_px height so we know its width.
        const features_aspect_ratio = (features_layout * main_screen_px.y /
                                 features_layout.y)
        window_size_ratio += point.Point(features_aspect_ratio.x, 0)
      }
    }
    const window_size_px = window_size_ratio.scale_max_size(
      _get_desktop_size().mul(this._window_scale)
    ).ceil()

    // Create the actual window surface. This should only be blitted to from one
    // of the sub-surfaces defined below.
    this._window = gamejs.display.set_mode(window_size_px, 0, 32)
    gamejs.display.set_caption('Starcraft Viewer')

    // The sub-surfaces that the various draw functions will draw to.
    this._surfaces = []
    function add_surface(surf_type, surf_loc, world_to_surf, world_to_obs, draw_fn) {
      //Add a surface. Drawn in order and intersect in reverse order.//
      const sub_surf = this._window.subsurface(
        gamejs.Rect(surf_loc.tl, surf_loc.size)
      )
      this._surfaces.append(new _Surface(
          sub_surf, surf_type, surf_loc, world_to_surf, world_to_obs, draw_fn
        )
      )
    }

    this._scale = window_size_px.y // 32
    this._font_small = gamejs.font.Font(null, Math.floor(this._scale * 0.5))
    this._font_large = gamejs.font.Font(null, this._scale)

    function check_eq(a, b) {
      //Used to run unit tests on the transforms.//
      assert(a.sub(b).len() < 0.0001, `${a} != ${b}`)
    }

    // World has origin at bl, world_tl has origin at tl.
    this._world_to_world_tl = new transform.Linear(
      new point.Point(1, -1), new point.Point(0, this._map_size.y)
    )

    check_eq(
      this._world_to_world_tl.fwd_pt(new point.Point(0, 0)),
      new point.Point(0, this._map_size.y)
    )
    check_eq(
      this._world_to_world_tl.fwd_pt(new point.Point(5, 10)),
      new point.Point(5, this._map_size.y - 10)
    )

    // Move the point to be relative to the camera. This gets updated per frame.
    this._world_tl_to_world_camera_rel = new transform.Linear({
      offset: this._map_size.div(4).mul(-1)
    })

    check_eq(
      this._world_tl_to_world_camera_rel.fwd_pt(this._map_size.div(4)),
      new point.Point(0, 0)
    )
    check_eq(
      this._world_tl_to_world_camera_rel.fwd_pt(
        this._map_size.div(4).add(new point.Point(5, 10))
      ),
      new point.Point(5, 10)
    )

    if (this._feature_screen_px) {
      // Feature layer locations in continuous space.
      let feature_world_per_pixel = this._feature_screen_px
        .div(this._feature_camera_width_world_units)
      let world_camera_rel_to_feature_screen = new transform.Linear(
        feature_world_per_pixel, this._feature_screen_px.div(2)
      )

      check_eq(world_camera_rel_to_feature_screen.fwd_pt(
        new point.Point(0, 0)),
        this._feature_screen_px.div(2)
      )
      check_eq(
        world_camera_rel_to_feature_screen.fwd_pt(
          (new point.Point(-0.5, -0.5)).mul(this._feature_camera_width_world_units)
        ),
        new point.Point(0, 0)
      )

      this._world_to_feature_screen = new transform.Chain(
        this._world_to_world_tl,
        this._world_tl_to_world_camera_rel,
        world_camera_rel_to_feature_screen
      )
      this._world_to_feature_screen_px = new transform.Chain(
        this._world_to_feature_screen,
        new transform.PixelToCoord()
      )

      const world_tl_to_feature_minimap = new transform.Linear(
        this._feature_minimap_px.div(this._playable.diagonal.max_dim())
      )
      world_tl_to_feature_minimap.offset = world_tl_to_feature_minimap.fwd_pt(
        this._world_to_world_tl.fwd_pt(this._playable.bl).mul(-1)
      )

      this._world_to_feature_minimap = new transform.Chain(
        this._world_to_world_tl,
        world_tl_to_feature_minimap
      )
      this._world_to_feature_minimap_px = new transform.Chain(
        this._world_to_feature_minimap,
        new transform.PixelToCoord()
      )

      // These are confusing since this._playable is in world coords which is
      // (bl <= tr), but stored in a Rect that is (tl <= br).
      check_eq(this._world_to_feature_minimap.fwd_pt(
        this._playable.bl),
        new point.Point(0, 0)
      )
      check_eq(
        this._world_to_feature_minimap.fwd_pt(this._playable.tr),
        this._playable.diagonal.scale_max_size(this._feature_minimap_px)
      )
    }

    if (this._rgb_screen_px) {
      // RGB pixel locations in continuous space.

      // TODO(tewalds): Use a real 3d projection instead of orthogonal.
      let rgb_world_per_pixel = this._rgb_screen_px.div(24)
      let world_camera_rel_to_rgb_screen = new transform.Linear(
        rgb_world_per_pixel, 
        this._rgb_screen_px.div(2)
      )

      check_eq(
        world_camera_rel_to_rgb_screen.fwd_pt(
          new point.Point(0, 0)
        ),
        this._rgb_screen_px.div(2)
      )
      check_eq(
        world_camera_rel_to_rgb_screen.fwd_pt(
          new point.Point(-0.5, -0.5).mul(24)
        ),
        new point.Point(0, 0)
      )

      this._world_to_rgb_screen = new transform.Chain(
        this._world_to_world_tl,
        this._world_tl_to_world_camera_rel,
        world_camera_rel_to_rgb_screen
      )
      this._world_to_rgb_screen_px = new transform.Chain(
        this._world_to_rgb_screen,
        new transform.PixelToCoord()
      )

      const world_tl_to_rgb_minimap = new transform.Linear(
        this._rgb_minimap_px.div(this._map_size.max_dim())
      )

      check_eq(world_tl_to_rgb_minimap.fwd_pt(
        new point.Point(0, 0)),
        new point.Point(0, 0)
      )
      check_eq(
        world_tl_to_rgb_minimap.fwd_pt(this._map_size),
        this._map_size.scale_max_size(this._rgb_minimap_px)
      )

      this._world_to_rgb_minimap = new transform.Chain(
        this._world_to_world_tl,
        world_tl_to_rgb_minimap
      )
      this._world_to_rgb_minimap_px = new transform.Chain(
        this._world_to_rgb_minimap,
        new transform.PixelToCoord()
      )
    }
    // Renderable space for the screen.
    let screen_size_px = main_screen_px.scale_max_size(window_size_px)
    let minimap_size_px = this._playable.diagonal.scale_max_size(screen_size_px.div(4))
    let minimap_offset = new point.Point(0, (screen_size_px.y - minimap_size_px.y))

    if (this._render_rgb) {
      rgb_screen_to_main_screen = new transform.Linear(
        screen_size_px / this._rgb_screen_px
      )
      add_surface(
        SurfType.RGB | SurfType.SCREEN,
        new point.Rect(point.origin, screen_size_px),
        new transform.Chain(  // surf
            this._world_to_rgb_screen,
            rgb_screen_to_main_screen),
        this._world_to_rgb_screen_px,
        this.draw_screen
      )
      rgb_minimap_to_main_minimap = new transform.Linear(
        minimap_size_px.div(this._rgb_minimap_px)
      )
      add_surface(
        SurfType.RGB | SurfType.MINIMAP,
        new point.Rect(minimap_offset,
                   minimap_offset + minimap_size_px),
        new transform.Chain(  // surf
            this._world_to_rgb_minimap,
            rgb_minimap_to_main_minimap),
        this._world_to_rgb_minimap_px,
        this.draw_mini_map
      )
    } else {  // Feature layer main screen
      const feature_screen_to_main_screen = new transform.Linear(
        screen_size_px.div(this._feature_screen_px)
      )
      add_surface(
        SurfType.FEATURE | SurfType.SCREEN,
        new point.Rect(point.origin, screen_size_px),
        new transform.Chain(  // surf
          this._world_to_feature_screen,
          feature_screen_to_main_screen
        ),
        this._world_to_feature_screen_px,
        this.draw_screen
      )
      const feature_minimap_to_main_minimap = new transform.Linear(
        minimap_size_px.max_dim() / this._feature_minimap_px.max_dim()
      )
      add_surface(
        SurfType.FEATURE | SurfType.MINIMAP,
        new point.Rect(
          minimap_offset,
          minimap_offset + minimap_size_px
        ),
        new transform.Chain(  // surf
          this._world_to_feature_minimap,
          feature_minimap_to_main_minimap
        ),
        this._world_to_feature_minimap_px,
        this.draw_mini_map
      )
    }

    if (this._render_feature_grid && num_feature_layers > 0) {
      // Add the raw and feature layers
      const features_loc = new point.Point(screen_size_px.x, 0)
      const feature_pane = this._window.subsurface(
        gamejs.Rect(features_loc, window_size_px.sub(features_loc))
      )
      feature_pane.fill(colors.white.div(2))
      const feature_pane_size = new point.Point(...feature_pane.get_size())
      const feature_grid_size = feature_pane_size.div(
        new point.Point(
          feature_cols,
          feature_rows
        )
      )
      const feature_layer_area = new point.Point(1, 1)
        .scale_max_size(feature_grid_size)
      const feature_layer_padding = feature_layer_area // 20
      const feature_layer_size = feature_layer_area.minus(feature_layer_padding.mul(2))

      const feature_font_size = Math.floor(feature_grid_size.y * 0.09)
      const feature_font = gamejs.font.Font(null, feature_font_size)

      const feature_counter = itertools.count()
      function add_layer(surf_type, world_to_surf, world_to_obs, name, fn) {
        //Add a layer surface.//
        i = next(feature_counter)
        grid_offset = new point.Point(
          i % feature_cols,
          i / feature_cols
        ).mul(feature_grid_size)
        text = feature_font.render(name, true, colors.white)
        rect = text.get_rect()
        rect.center = grid_offset.add(
          new point.Point(
            feature_grid_size.x / 2,
            feature_font_size
          )
        )
        feature_pane.blit(text, rect)
        const surf_loc = features_loc
          .add(grid_offset)
          .add(feature_layer_padding)
          .add(
            new point.Point(0, feature_font_size)
          )
        
        add_surface(
          surf_type,
          new point.Rect(
            surf_loc,
            surf_loc.add(feature_layer_size).round()
          ),
          world_to_surf, world_to_obs, fn
        )
      }

      const raw_world_to_obs = new transform.Linear()
      const raw_world_to_surf = new transform.Linear(feature_layer_size.div(this._map_size)
      )
      function add_raw_layer(from_obs, name, color) {
        add_layer(
          SurfType.FEATURE | SurfType.MINIMAP,
          raw_world_to_surf, raw_world_to_obs, "raw " + name,
          (surf) => this.draw_raw_layer(surf, from_obs, name, color)
        )
      }

      if (this._game_info.options.raw) {
        add_raw_layer(false, "terrain_height", colors.height_map(256))
        add_raw_layer(false, "pathing_grid", colors.winter(2))
        add_raw_layer(false, "placement_grid", colors.winter(2))
        add_raw_layer(true, "visibility", colors.VISIBILITY_PALETTE)
        add_raw_layer(true, "creep", colors.CREEP_PALETTE)
      }

      function add_feature_layer(feature, surf_type, world_to_surf, world_to_obs) {
        add_layer(
          surf_type, world_to_surf, world_to_obs, feature.full_name,
          (surf) => this.draw_feature_layer(surf, feature)
        )
      }

      if (this._feature_minimap_px) {
        // Add the minimap feature layers
        const feature_minimap_to_feature_minimap_surf = new transform.Linear(
          feature_layer_size.div(this._feature_minimap_px)
        )
        const world_to_feature_minimap_surf = new transform.Chain(
          this._world_to_feature_minimap,
          feature_minimap_to_feature_minimap_surf
        )
        features.MINIMAP_FEATURES.forEach((feature) => {
          add_feature_layer(
            feature, SurfType.FEATURE | SurfType.MINIMAP,
            world_to_feature_minimap_surf,
            this._world_to_feature_minimap_px
          )
        })
      }

      if (this._feature_screen_px) {
        // Add the screen feature layers
        const feature_screen_to_feature_screen_surf = new transform.Linear(
          feature_layer_size.div(this._feature_screen_px)
        )
        const world_to_feature_screen_surf = new transform.Chain(
          this._world_to_feature_screen,
          feature_screen_to_feature_screen_surf
        )
        features.SCREEN_FEATURES.forEach((feature) => {
          add_feature_layer(
            feature, SurfType.FEATURE | SurfType.SCREEN,
            world_to_feature_screen_surf,
            this._world_to_feature_screen_px
          )
        })

      }
    }
    // Add the help screen
    const help_size = new point.Point(
      (Math.max(...this.shortcuts.map((s) => s.length)) +
      Math.max(...this.shortcuts.map((_, s) => String(s).length))) * 0.4 + 4,
      this.shortcuts.length + 3
    ).mul(this._scale)
    const help_rect = new point.Rect(
      window_size_px.div(2).sub(help_size.div(2)),
      window_size_px.div(2).add(help_size.div(2))
    )
    add_surface(SurfType.CHROME, help_rect, null, null, this.draw_help)

    // Arbitrarily set the initial camera to the center of the map.
    this._update_camera(this._map_size.div(2))
  }

  _update_camera(camera_center) {
    //Update the camera transform based on the new camera center.//
    this._world_tl_to_world_camera_rel.offset = (
      this._world_to_world_tl.fwd_pt(camera_center).mul(-1).mul(this._world_tl_to_world_camera_rel.scale)
    )

    if (this._feature_screen_px) {
      const camera_radius = (this._feature_screen_px.div(
        this._feature_screen_px.x).mul(this._feature_camera_width_world_units).div(2)
      )
      const center = camera_center.bound(camera_radius, this._map_size.sub(camera_radius))

      this._camera = new point.Rect(
        center.sub(camera_radius).bound(this._map_size),
        center.add(camera_radius).bound(this._map_size)
      )
    }
  }

  zoom(factor) {
    //Zoom the window in/out.//
    this._window_scale *= factor
    if (performance.now() - this._last_zoom_time < 1) {
      // Avoid a deadlock in gamejs if you zoom too quickly
      return
    }
    this.init_window()
    this._last_zoom_time = performance.now()
  }

  get_mouse_pos(window_pos = null) {
    //Return a MousePos filled with the world position and surf it hit.//
    window_pos = window_pos || gamejs.mouse.get_pos()
    // +0.5 to center the point on the middle of the pixel.
    const window_pt = new poin.Point(...window_pos).add(0.5)
    for (let i = this._surfaces.length - 1; i >= 0; i--) {
      const surf = this._surfaces[i]
      if (sur.surf_type != SurfType.CHROME && surf.surf_rect.contains_point(window_pt)) {
        const surf_rel_pt = window_pt.sub(surf.surf_rect.tl)
        const world_pt = surf.world_to_surf.back_pt(surf_rel_pt)
        return MousePos(world_pt, surf)
      }
    }
  }

  clear_queued_action() {
    this._queued_hotkey = ''
    this._queued_action = null
  }

  save_replay(run_config, controller) {
    if (controller.status == remote_controller.Status.in_game || controller.status == remote_controller.Status.ended) {
      const prefix = path.basename(this._game_info.local_map_path).split('.')[0]
      const replay_path = run_config.save_replay(controller.save_replay(), 'local', prefix)
      console.log('Wrote replay to: ', replay_path)
    }
  }

  get_actions(run_config, controller) {
    //Get actions from the UI, apply to controller, and return an ActionCmd.
    if (!this._initialized) {
      return ActionCmd.STEP
    }
    const events = gamejs.event.get()
    for (let i = 0; i < events.length; i++) {
      ctrl = gamejs.key.get_mods() & gamejs.event.KMOD_CTRL
      shift = gamejs.key.get_mods() & gamejs.event.KMOD_SHIFT
      alt = gamejs.key.get_mods() & gamejs.event.KMOD_ALT
      if (event.type == gamejs.event.QUIT) {
        return ActionCmd.QUIT
      } else if (event.type == gamejs.event.KEYDOWN) {
        if (this._help) {
          this._help = false
        } else if (event.key == gamejs.event.K_QUESTION || event.key == gamejs.event.K_SLASH) {
          this._help = true
        } else if (event.key == gamejs.event.K_PAUSE) {
          let pause = true
          while (pause) {
            time.sleep(0.1)
            const events2 = gamejs.event.get()
            for (let j = 0; j < events2.length; j++) {
              const event2 = events2[i]
              if (event2.type == gamejs.event.KEYDOWN) {
                if (event2.key == gamejs.event.K_PAUSE ||  gamejs.event.K_ESCAPE) {
                  pause = false
                } else if (event2.key == gamejs.event.K_F4){
                  return ActionCmd.QUIT
                } else if (event2.key == gamejs.event.K_F5) {
                  return ActionCmd.RESTART
                }
              }
            }
          }
        } else if (event.key == gamejs.event.K_F4) {
          return ActionCmd.QUIT
        } else if (event.key == gamejs.event.K_F5) {
          return ActionCmd.RESTART
        } else if (event.key == gamejs.event.K_F9) {  // Toggle rgb rendering.
          if (this._rgb_screen_px && this._feature_screen_px) {
            this._render_rgb = !this._render_rgb
            console.log('Rendering', this._render_rgb && 'RGB' || 'Feature Layers')
            this.init_window()
          }
        } else if (event.key == gamejs.event.K_F11) { // Toggle synchronous rendering.
          this._render_sync = !this._render_sync
          console.log('Rendering', this._render_sync && 'Sync' || 'Async')
        } else if (event.key == gamejs.event.K_F12) {
          this._raw_actions = !this._raw_actions
          console.log('Action space:', this._raw_actions && 'Raw' || 'Spatial')
         } else if (event.key == gamejs.event.K_F10) {  // Toggle player_relative layer.
          this._render_player_relative = !this._render_player_relative
         } else if (event.key == gamejs.event.K_F8) {  // Save a replay.
          this.save_replay(run_config, controller)
         } else if (event.key == gamejs.event.K_PLUS || event.key == gamejs.event.K_EQUALS && ctrl) {
          this.zoom(1.1)  // zoom in
         } else if (event.key == gamejs.event.K_MINUS || event.key == gamejs.event.K_UNDERSCORE && ctrl) {
          this.zoom(1 / 1.1)  // zoom out
         } else if (event.key == gamejs.event.K_PAGEUP || event.key == gamejs.event.K_PAGEDOWN) {
          if (ctrl) {
            if (event.key == gamejs.event.K_PAGEUP) {
              this._step_mul += 1
            } else if (this._step_mul > 1) {
              this._step_mul -= 1
            }
            console.log('New step mul:', this._step_mul)
          } else {
            event.key == gamejs.event.K_PAGEUP ? (this._fps *= 1.25) : (1 / 1.25)
            console.log(`New max game speed: ${this._fps}`)
          }
        } else if (event.key == gamejs.event.K_F1) {
          if (this._obs.observation.player_common.idle_worker_count > 0) {
            controller.act(this.select_idle_worker(ctrl, shift))
          }
        } else if (event.key == gamejs.event.K_F2) {
          if (this._obs.observation.player_common.army_count > 0) {
            controller.act(this.select_army(shift))
          }
        } else if (event.key == gamejs.event.K_F3) {
          if (this._obs.observation.player_common.warp_gate_count > 0) {
            controller.act(this.select_warp_gates(shift))
          }
          if (this._obs.observation.player_common.larva_count > 0) {
            controller.act(this.select_larva())
          }
        } else if (this.cmd_group_keys.hasOwnProperty(event.key)) {
          controller.act(this.control_group(this.cmd_group_keys[event.key], ctrl, shift, alt))
        } else if (this.camera_actions.hasOwnProperty(event.key)) {
          if (this._obs) {
            pt = point.Point.build(this._obs.observation.raw_data.player.camera)
            pt += this.camera_actions[event.key]
            controller.act(this.camera_action_raw(pt))
            controller.observer_act(this.camera_action_observer_pt(pt))
          }
        } else if (event.key == gamejs.event.K_ESCAPE) {
          controller.observer_act(this.camera_action_observer_player(
              this._obs.observation.player_common.player_id))
          if (this._queued_action) {
            this.clear_queued_action()
          } else {
            cmds = this._abilities((cmd) => cmd.hotkey == 'escape')  // Cancel
            cmds.forEach((cmd) => {
              // There could be multiple cancels.
              assert(!cmd.requires_point, '!cmd.requires_point')
              controller.act(this.unit_action(cmd, null, shift))
            })
          }
        } else {
          if (!this._queued_action) {
            key = gamejs.key.name(event.key).toLowerCase()
            new_cmd = this._queued_hotkey + key
            cmds = this._abilities((cmd, n=new_cmd) =>  cmd.hotkey != 'escape' && cmd.hotkey.startswith(n))
            if (cmds) {
              this._queued_hotkey = new_cmd
              if (cmds.length == 1) {
                cmd = cmds[0]
                if (cmd.hotkey == this._queued_hotkey) {
                  if (cmd.requires_point) {
                    this.clear_queued_action()
                    this._queued_action = cmd
                  } else {
                    controller.act(this.unit_action(cmd, null, shift))
                  }
                }
              }
            }
          }
        }
      } else if (event.type == gamejs.MOUSEBUTTONDOWN) {
        mouse_pos = this.get_mouse_pos(event.pos)
        if (event.button == MouseButtons.LEFT && mouse_pos) {
          if (this._queued_action) {
            controller.act(this.unit_action(
                this._queued_action, mouse_pos, shift))
          } else if (mouse_pos.surf.surf_type & SurfType.MINIMAP) {
            controller.act(this.camera_action(mouse_pos))
            controller.observer_act(this.camera_action_observer_pt(
                mouse_pos.world_pos))
          } else {
            this._select_start = mouse_pos
          }
        } else if (event.button == MouseButtons.RIGHT) {
          if (this._queued_action) {
            this.clear_queued_action()
          }
          cmds = this._abilities((cmd) => cmd.name == 'Smart')
          if (cmds) {
            controller.act(this.unit_action(cmds[0], mouse_pos, shift))
          }
        }
      } else if (event.type == gamejs.MOUSEBUTTONUP) {
        mouse_pos = this.get_mouse_pos(event.pos)
        if (event.button == MouseButtons.LEFT && this._select_start) {
          if (mouse_pos
            && mouse_pos.surf.surf_type & SurfType.SCREEN
            && mouse_pos.surf.surf_type == this._select_start.surf.surf_type) {
            controller.act(
              this.select_action(
                this._select_start, mouse_pos, ctrl, shift
              )
            )
          }
          this._select_start = null
        }
      }
      return ActionCmd.STEP
    }
  }

  camera_action(mouse_pos) {
    //Return a `sc_pb.Action` with the camera movement filled.//
    const action = new sc_pb.Action()
    const action_spatial = mouse_pos.action_spatial(action)
    mouse_pos.obs_pos.assign_to(action_spatial.getCameraMove().getCenterMinimap())
    return action
  }

  camera_action_raw(world_pos) {
    //Return a `sc_pb.Action` with the camera movement filled.//
    const action = new sc_pb.Action()
    const action_raw = new sc_pb.ActionRaw()
    const camera_move = new sc_pb.ActionObserverCameraMove()
    const center_world_space = new sc_pb.Point2d()
    camera_move.setCenterWorldSpace(center_world_space)
    action_raw.setCameraMove(camera_move)
    action.setActionRaw(action_raw)
    world_pos.assign_to(action.action_raw.camera_move.center_world_space)
    return action
  }

  camera_action_observer_pt(world_pos) {
    //Return a `sc_pb.ObserverAction` with the camera movement filled.//
    const action = new sc_pb.ObserverAction()
    const camera_move = new sc_pb.ActionObserverCameraMove()
    const proto_world_pos = new sc_pb.Point2d()
    world_pos.assign_to(proto_world_pos)
    camera_move.setWorldPos(proto_world_pos)
    action.setCameraMove(camera_move)
    return action
  }

  camera_action_observer_player(player_id) {
    //Return a `sc_pb.ObserverAction` with the camera movement filled.//
    const action = new sc_pb.ObserverAction()
    const camera_follow_player = new sc_pb.ActionObserverCameraFollowPlayer()
    camera_follow_player.setPlayerId(player_id)
    action.setCameraFollowPlayer(camera_follow_player)
    return action
  }

  select_action(pos1, pos2, ctrl, shift) {
    //Return a `sc_pb.Action` with the selection filled.//
    assert(
      pos1.surf.surf_type == pos2.surf.surf_type,
      'pos1.surf.surf_type == pos2.surf.surf_type'
    )
    assert(
      pos1.surf.world_to_obs == pos2.surf.world_to_obs,
      'pos1.surf.world_to_obs == pos2.surf.world_to_obs'
    )

    const action = new sc_pb.Action()
    const action_raw = new sc_pb.ActionRaw()
    const unit_command = new sc_pb.ActionRawUnitCommand()
    action_raw.setUnitCommand(unit_command)
    action.setActionRaw(action_raw)
    if (this._raw_actions) {
      unit_command.setAbilityId(0) // no-op
      const player_id = this._obs.getObservation().getPlayerCommon().getPlayerId()
      if (pos1.world_pos == po2.word_pos) { //select a point
        this._visible_units().forEach(([u, p]) => {
          if (pos1.world_pos.contained_circle(p, u.getRadius()) && u.getOwner() === player_id) {
            unit_command.addUnitTags(u.getTag())
          }
        })
      } else {
        const rect = new point.Rect(pos1.world_pos, pos2.world_pos)
        const unitTags = []
        this._visible_units().forEach(([u, p]) => {
          if (u.getOwner() === player_id && rect.intersects_circle(p, u.getRadius())) {
            unit_command.addUnitTags(u.getTag())
          }
        })
        const usedTags = unit_command.getUnitTags()
        usedTags.extend()
        unit_command.addUnitTags(u.getUn)
      }
    } else {
      const action_spatial = pos1.action_spatial(action)
      if (pos1.world_pos.eq(pos2.world_pos)) {
        const select = action_spatial.getUnitSelectionPoint()
        pos1.obs_pos.assign_to(select.getSelectionScreenCoord())
        const mod = new sc_spatial.ActionSpatialUnitSelectionPoint()
        if (ctrl) {
          shift ? select.setType(mod.getAddAllType()) : select.setType(mod.getAllType())
        } else {
          shift ? select.setType(mod.getToggle()) : select.setType(mod.getSelect())
        }
      } else {
        const select = action_spatial.getUnitSelectionRect()
        const rect = select.getSelectionScreenCoord()
        pos1.obs_pos.assign_to(rect.getP0())
        pos2.obs_pos.assign_to(rect.getP1())
        select.setSelectionAdd(shift)
      }
    }
    // Clear the queued action if something will be selected. An alternative
    // implementation may check whether the selection changed next frame.
    const units = this._units_in_area(new point.Rect(pos1.world_pos, pos2.world_pos))
    if (units) {
      this.clear_queued_action()
    }
    return action
  }

  select_idle_worker(ctrl, shift) {
    //Select an idle worker.//
    const action = new sc_pb.Action()
    const action_ui = new sc_pb.ActionUI()
    const selectIdleWorker = new sc_pb.ActionSelectIdleWorker()
    action_ui.setSelectIdleWorker(selectIdleWorker)
    action.setActionUi(action_ui)
    const mod = sc_ui.ActionSelectIdleWorker.Type
    let select_worker
    if (ctrl) {
      select_worker = shift ? mod.ADDALL : mod.ALL
    } else {
      select_worker = shift ? mod.ADD : mod.SET
    }
    action.getActionUi().getSelectIdleWorker().setType(select_worker)
    return action
  }

  select_army(shift) {
    //Select the entire army.//
    const action = new sc_pb.Action()
    const action_ui = new sc_pb.ActionUI()
    const select_army = new sc_pb.ActionSelectArmy()
    select_army.setSelectionAdd(shift)
    action_ui.setSelectArmy(select_army)
    action.setActionUi(action_ui)
    return action

  }

  select_warp_gates(shift) {
    //Select all warp gates.//
    const action = new sc_pb.Action()
    const action_ui = new sc_pb.ActionUI()
    const select_warp_gates = new sc_pb.ActionSelectWarpGates()
    select_warp_gates.setSelectionAdd(shift)
    action_ui.setSelectWarpGates(select_warp_gates)
    action.setActionUi(action_ui) 
    return action
  }

  select_larva() {
    //Select all larva.//
    const action = new sc_pb.Action()
    const action_ui = new sc_pb.ActionUI()
    const select_larva = new sc_pb.ActionSelectLarva()
    action_ui.setSelectLarva(select_larva)
    action.setActionUi(action_ui)
    // action.action_ui.select_larva.SetInParent() // Adds the empty proto field.
    return action
  }

  control_group(control_group_id, ctrl, shift, alt) {
    //Act on a control group, selecting, setting, etc.//
    const action = new sc_pb.Action()
    const action_ui = new sc_pb.ActionUI()
    action.setActionUi(action_ui)
    const select = new sc_pb.ActionControlGroup()
    action_ui.setControlGroup(select)
    const mod = sc_pb.ActionControlGroup.ControlGroupAction
    if (!(ctrl && shift && alt)) {
      select.setAction(mod.RECALL)
    } else if (ctrl && !(shift && alt)) {
      select.setAction(mod.SET)
    } else if (!ctrl && shift && !alt) {
      select.setAction(mod.APPEND)
    } else if (!(ctrl && shift) && alt) {
      select.setAction(mod.SETANDSTEAL)
    } else if (!ctrl && shift && alt) {
      select.setAction(mod.APPENDANDSTEAL)
    } else {
      return //unknown
    }
    select.setControlGroupId(control_group_id)
    return action
  }

  unit_action(cmd, pos, shift) {
    //Return a `sc_pb.Action` filled with the cmd and appropriate target.//
    const action = new sc_pb.Action()
    const action_raw = new sc_pb.ActionRaw()
    let unit_command = new sc_pb.ActionRawUnitCommand()
    const target_world_space_pos = new sc_pb.Point2D()
    unit_command.setTargetWorldSpacePos(target_world_space_pos)
    action_raw.setUnitCommand(unit_command)
    if (this._raw_actions) {
      unit_command.setAbilityId(cmd.getAbilityId())
      unit_command.setQueueCommand(shift)
      const player_id = this._obs.getObservation().getPlayerCommon().getPlayerId()
      unit_command.setUnitTagsList(
        this._visible_units().filter(([u]) => u.getIsSelected() && u.getOwner() == player_id)
      )
      if (pos) {
        const units = this._visible_units()
        let found
        for (let i = 0; i < units.length; i++) {
          const [u, p] = units[i]
          if (pos.world_pos.contained_circle(p, u.getRadius())) {
            unit_command.setTargetUnitTag(u.getTag())
            found = true
            break
          }
        }
        if (!found) {
          pos.world_pos.assign_to(target_world_space_pos)
        }
      }
    } else {
      if (pos) {
        const action_spatial = pos.action_spatial(action)
        unit_command.setAbilityId(cmd.getAbilityId())
        unit_command.setQueueCommand(shift)
        if (pos.surf.surf_type & SurfType.SCREEN) {
          pos.obs_pos.assign_to(unit_command.target_screen_coord)
        } else if (pos.surf.surf_type & SurfType.MINIMAP) {
          pos.obs_pos.assign_to(unit_command.target_minimap_coord)
        }
      } else {
        unit_command = new sc_pb.ActionSpatialUnitCommand()
        unit_command.setAbilityId(cmd.getAbilityId())
        if (this._feature_screen_px) {
          const action_feature_layer = new sc_pb.ActionSpatial()
          action_feature_layer.setUnitCommand(unit_command)
          action.setFeatureLayer(action_feature_layer)
        } else {
          const action_render = new sc_pb.ActionSpatial()
          action_render.setUnitCommand(unit_command)
          action.setActionRender(action_render)
        }
      }
    }

    this.clear_queued_action()
    return action
  }

  _abilities(fn = null) {
    //Return the list of abilities filtered by `fn`.//
    const out = []
    this._obs.getObservation().getAbilitiesList().forEach((cmd) => {
      const ability = _Ability(cmd, this._static_data.abilities)
      if (!fn || fn(ability)) {
        // out[ability.ability_id] = ability
        out.push(ability)
      }
    })
    return out
  }

  _visible_units() {
    /*
      A generator of visible units and their positions as `Point`s, sorted.//
      Sort the units by elevation, then owned (eg refinery) above world (ie 16)
      (eg geiser), small above big, and otherwise arbitrary but stable.
    */
    let units = new Array(this._obs.getObservation().getRawData().getUnitsList().length)
    this._obs.getObservation().getRawData().getUnitsList().forEach((u, i) => {
      units[i] = [u.getPos().getZ(), u.getOwner() != 16, -u.getRadius(), u.getTag(), u]
    })
    units = units.sorted((a, b) => a[0] - b[0])
    return units.map((arr) => [arr[arr.length - 1], new point.Point(u.getPos())])
  }

  _units_in_area(rect) {
    //Return the list of units that intersect the rect.//
    const player_id = this._obs.getObservation().getPlayerCommon().getPlayerId()
    return this._visible_units.filter(([u, p]) => rect.intersects_circle(p, u.getRadius()) && u.getOwner() == player_id)
  }

  get_unit_name(surf, name, radius) {
    //Get a length limited unit name for drawing units.//
    const key = [name, radius].join(',')
    if (!this._name_lengths.hasOwnProperty(key)) {
      const max_len = surf.world_to_surf.fwd_dist(radius * 1.6)
      let found = false
      for (let i = 0; i < name.length; i++) {
        if (this._font_small.size(name.slice(0, i + 1)) > max_len) {
          this._name_lengths[key] = name.slice(0, i)
          found = true
          break
        }
      }
      if (!found) {
        this._name_lengths[key] = name
      }
    }
    return this._name_lengths[key]
  }

  draw_units(surf) {
    //Draw the units and buildings.//
    const unit_dict = null // Cache the units {tag: unit_proto} for orders.
    const tau = 2 * Math.PI
    this._visible_units().forEach(([u, p]) => {
      if (this._camera.intersects_circle(p, u.getRadius())) {
        const fraction_damage = clamp(
          (u.getHealthMax() - u.getHealth()) / (u.getHealthMax() || 1),
          0,
          1
        )
        if (u.getDisplayType() == sc_raw.DisplayType.PLACEHOLDER) {
          surf.draw_circle(
            Math.floor(colors.PLAYER_ABSOLUTE_PALETTE[u.getOwner()] / 3),
            p,
            u.getRadius()
          )
        } else {
          surf.draw_circle(
            colors.PLAYER_ABSOLUTE_PALETTE[u.getOwner()],
            p,
            u.getRadius()
          )

          if (fraction_damage > 0) {
            surf.draw_circle(
              Math.floor(colors.PLAYER_ABSOLUTE_PALETTE[u.getOwner()] / 2),
              p,
              u.getRadius() * fraction_damage
            )
          }
        }
        let thickness = 1
        surf.draw_circle(colors.black, p, u.getRadius(), thickness)

        if (this._static_data.unit_stats[u.getUnitType()].movement_speed > 0) {
          surf.draw_arc(
            colors.white,
            p,
            u.getRadius(),
            u.getFacing() - 0.1,
            u.getFacing() + 0.1,
            thickness
          )
        }

        function draw_arc_ratio(color, world_loc, radius, start, end, thickness) {
          surf.draw(
            color,
            world_loc,
            radius,
            start * tau,
            end * tau,
            thickness
          )
        }

        if (u.getShield() && u.getShieldMax()) {
          draw_arc_ratio(colors.blue, p, u.getRadius() - 0.05, 0, u.getShield() / u.getShieldMax())
        }

        if (u.getEnergy() && u.getEnergyMax()) {
          draw_arc_ratio(colors.purple * 0.9, p, u.getRadius() - 0.1, 0, u.getEnergy() / u.getEnergyMax())
        }

        if (0 < u.getBuildProgress() < 1) {
          draw_arc_ratio(colors.cyan, p, u.getRadius() - 0.15, 0, u.getBuildProgress())
        } else if (u.getOrdersList().length && 0 < u.getOrdersList()[0].getProgress() < 1) {
          draw_arc_ratio(colors.cyan, p, u.getRadius() - 0.15, 0,
                         u.getOrdersList()[0].getProgress())
        }

        if (u.getBuffDurationRemain() && u.buff_duration_max) {
          draw_arc_ratio(colors.white, p, u.getRadius() - 0.2, 0,
                         u.getBuffDurationRemain() / u.buffDurationMax())
        }

        thickness = 3
        if (u.getAttackUpgradeLevel()) {
          draw_arc_ratio(this.upgrade_colors[u.getAttackUpgradeLevel()], p,
                         u.getRadius() - 0.25, 0.18, 0.22, thickness)
        }

        if (u.getArmorUpgradeLevel()) {
          draw_arc_ratio(this.upgrade_colors[u.getArmorUpgradeLevel()], p,
                         u.getRadius() - 0.25, 0.23, 0.27, thickness)
        }

        if (u.getShieldUpgradeLevel()) {
          draw_arc_ratio(this.upgrade_colors[u.getShieldUpgradeLevel()], p,
                         u.getRadius() - 0.25, 0.28, 0.32, thickness)
        }

        function write_small(loc, s) {
          surf.write_world(this._font_small, colors.white, loc, String(s))
        }

        const name = this.get_unit_name(
            surf, this._static_data.units.get(u.getUnitType(), "<none>"), u.getRadius())
        if (name) {
          write_small(p, name)
        }
        if (u.getIdealHarvesters() > 0) {
          write_small(p.add(new point.Point(0, 0.5)),
                      `${u.getAssignedHarvesters()} / ${u.getIdealHarvesters()}`)
        }
        if (u.getMineralContents() > 0) {
          write_small(p.sub(new point.Point(0, 0.5)), u.getMineralContents())
        } else if (u.getVespeneContents() > 0) {
          write_small(p.sub(new point.Point(0, 0.5)), u.getVespeneContents())
        } else if (u.getDisplayType() == sc_raw.DisplayType.SNAPSHOT) {
          write_small(p.sub(new point.Point(0, 0.5)), "snapshot")
        } else if (u.getDisplayType() == sc_raw.DisplayType.PLACEHOLDER) {
          write_small(p.sub(new point.Point(0, 0.5)), "placeholder")
        } else if (u.getIsHallucination()) {
          write_small(p.sub(new point.Point(0, 0.5)), "hallucination")
        } else if (u.getIsBurrowed()) {
          write_small(p.sub(new point.Point(0, 0.5)), "burrowed")
        } else if (u.getCloak() != sc_raw.CloakState.NOTCLOAKED) {
          write_small(p.sub(new point.Point(0, 0.5)), "cloaked")
        }

        if (u.getIsSelected()) {
          surf.draw_circle(colors.green, p, u.radius + 0.1, 1)
          const unit_dict = {}

          // Draw the orders of selected units.
          let start_point = p
          const orders = u.getOrdersList()
          for (let i = 0; i < orders.length; i++) {
            let target_point = null
            const o = orders[i]
            if (o.hasTargetWorldSpacePos()) {
              target_point = new point.Point(o.getTargetWorldSpacePos())
            } else if (o.hasTargetUnitTag()) {
              this._obs.getObservation().getRawData().getUnitsList().forEach((t) => {
                unit_dict[t.getTag()] = t
              })
              const target_unit = unit_dict[o.getTargetUnitTag()]
              let target_point
              if (target_unit) {
                target_point = new point.Point(target_unit.getPos())
              }
              if (target_point) {
                surf.draw_line(colors.cyan * 0.75, start_point, target_point)
                start_point = target_point
              } else {
                break
              }
            }
          }
          const rallyTargets = u.getRallyTargetsList()
          for (let i = 0; i < rallyTargets.length; i++) {
            surf.draw_line(colors.cyan * 0.75, p,
                           new point.Point(rally.getPoint()))
          }
        }
      }
    })
  }

  draw_selection(surf) {
    //Draw the selection rectangle.//
    const select_start = this._select_start // Cache to avoid a race condition.
    if (select_start) {
      const mouse_pos = this.get_mouse_pos()
      if (mouse_pos && mouse_pos.surf.surft_type & SurfType.SCREEN && mouse_pos.surf.surf_type == select_start.surf.surf_type) {
        const rect = new point.Rect(select_start.world_pos, mouse_pos.world_pos)
        surf.draw_rect(colors.green, rect, 1)
      }
    }
  }

  draw_build_target(surf) {
    // Draw the build target//
    const round_half = (v, cond) => cond ?  Math.round(v - 0.5) + 0.5 : Math.round(v)

    const queued_action = this._queued_action
    if (queued_action) {
      const radius = queued_action.footprint_radius
      if (radius) {
        let pos = this.get_mouse_pos()
        if (pos) {
          pos = new point.Point(
            round_half(pos.world_pos.y, (radius * 2) % 2),
            round_half(pos.world_pos.y, (radius * 2) % 2)
          )
          surf.draw_circle(
            colors.PLAYER_ABSOLUTE_PALETTE[
              this._obs.getObservation().getPlayerCommon().getPlayerId()
            ],
            pos,
            radius
          )
        }
      }
    }
  }

  draw_overlay(surf) {
    function sum(arr) {
     return arr.reduce((acc, curr = 0) => acc + curr)
    }
    //Draw the overlay describing resources.//
    const obs = this._obs.getObservation()
    const player = obs.getPlayerCommon()
    surf.write_screen(
      this._font_large, colors.green, [0.2, 0.2],
      `Minearls: ${player.getMinerals()}, Vespene: ${player.getVespene()}, Food: ${player.getFoodUsed()} / ${player.getFoodCap()}`,
      'right'
    )

    const [times, steps] = zip(this._game_times)
    const sec = Math.floor(obs.getGameLoop() / 22.4)
    surf.write_screen(
      this._font_large, colors.green, [-0.2, 0.2],
      `Score: ${obs.getScore.getScore()}, Step: ${obs.getGameLoop()}, ${sum(steps) / (sum(times) || 1)}/s, Time: ${Math.floor(sec / 60)}: ${sec % 60}`,
      'right'
    )

    surf.write_screen(
      this._font_large, colors.green * 0.8, [-0.2, 1.2]
      `APM: ${obs.getScore().getScoreDetails().getCurrentApm()}, EPM: ${obs.getScore.getScoreDetails().getCurrentEffectiveApm()}, FPS: O:${times.length / (sum(times) || 1)}, R: ${this._render_times / (sum(this._render_times) || 1)}`,
      'left'
    )

    const line = 3
    const alerts = this._alerts.sort((a, b) => a[1] - b[1])
    alerts.forEach(([alert, ts]) => {
      if (performance.now() < ts + (3 * 1000)) { // Show for 3 seconds.
        surf.write_screen(this._font_large, colors.red, [20, line], alert)
        line += 1
      } else {
        delete this._alerts[alert]
      }
    })
  }

  draw_help(surf) {
    //Draw the help dialog.//
    if (!this._help) {
      return
    }
    function write(loc, text) {
      surf.write_screen(this._font_large, colors.black, loc, text)
    }

    surf.surf.fill(colors.white * 0.8)
    write([1, 1], 'Shortcuts:')

    const max_len = Math.max(...this.shortcuts.map((s) => s.length))
    const shortcuts = this.shortcuts.slice(2)
    shortcuts.forEach(([hotkey, description], i) => {
      write([2, i], hotkey)
      write([3 + max_len * 0.7, i], description)
    })
  }
  
  draw_commands(surf) {
    // Draw the list of upgrades available commands.//
    function write(loc, text, color = colors.yellow) {
      surf.write_screen(this._font_large, color, loc, text)
    }
    let line = 2
    function write_line(x, args) {
      line += 1
      write([x, line], ...(Array.from(arguments).slice(1)))
    }
    action_count = this._obs.getObservation().getAbilitiesList().length
    if (action_count > 0) {
      write_line(0.2, 'Available Actions: ', colors.green)
      const past_abilities = {}
      this._past_actions.forEach((act) => {
        if (act.ability) {
          past_abilities[act.abilitiy] = act
        }
      })
      let color
      this._abilities((c) => c.name != 'Smart')
        .sort((a, b) => a.name > b.name ? 1 : -1)
        .forEach((cmd) => {
          if (this._queued_action && cmd == this._queued_action) {
            color = colors.green
          } else if (this._queued_hotkey
            && cmd.hotkey.slice(0, this._queued_hotkey.length) == this._queued_hotkey) {
            color = colors.green * 0.75
          } else if (past_abilities.hasOwnProperty(cmd.ability_id)) {
            color = colors.red
          } else {
            color = colors.yellow
          }
          const hotkey = cmd.hotkey.slice(0, 3) // trunccate "escape" -> "esc"
          line += 1
          y = line
          write([1, y], hotkey, color)
          write([4, y], cmd.name, color)
      })
      line += 1
    }
    const upgradesList = this._obs.getObservation().getRawData().getPlayer().getUpgradeIdsList()
    const upgrade_count = upgradesList.length
    if (upgrade_count > 0) {
      write_line(0.2, `Upgrades: ${upgrade_count}`, colors.green)
      const upgrades = upgradesList
        .map((upgrade_id) => this._static_data.upgrades[upgrade_id].name)
      upgrades.sort().forEach((name) => write_line(1, name))
    }
  }

  draw_panel(surf) {
    //Draw the unit selection or build queue.//
    const left = -14 // How far from the right border
    let line = 3

    function unit_name(unit_type) {
      return this._static_data.units[unit_type] || '<unknown>'
    }
    function write(loc, text, color = colors.yellow) {
      surf.write_screen(this._font_large, color, loc,  text)
    }
    function write_line(x, args) {
      line += 1
      write([left + x, line], ...(Array.from(arguments).slice(1)))
    }

    function write_single(unit) {
      // Write a description of a single selected unit.//
      write_line(1, unit_name(unit.getUnitType()), colors.cyan)
      write_line(1, `Health: ${unit.getHealth()} / ${unit.getMaxHealth()}`)
      if (unit.getMaxShields()) {
        write_line(1, `Shields: ${unit.getShields()} / ${unit.getMaxShields()}`)
      }
      if (unit.getMaxEnergy()) {
        write_line(1, `Energy: ${unit.getEnergy()} / ${unit.getMaxEnergy()}`)
      }
      if (unit.getBuildProgress() > 0) {
        write_line(1, `Progress: ${Math.round(unit.getBuildProgress() * 100)}`)
      }
      if (unit.getTransportSlotsTaken()> 0) {
        write_line(1, `Slots: ${unit.getTransportSlotsTaken()}`)
      }
    }

    function write_multi(units) {
      //Write a description of multiple selected units.//
      const counts = new DefaultDict(1)
      units.forEach((unit) => {
        counts[unit_name(unit.getUnitType())] += 1
      })
      Object.keys(counts).sort().forEach((name) => {
        const count = counts[name]
        line += 1
        const y = line
        write([left + 1, y], count)
        write([left + 3, y], name)
      })
    }

    const ui = this._obs.getObservation().getUiData()

    if (ui.getGroups()) {
      write_line(0, 'Control Groups: ', colors.green)
      ui.getGroupsList().forEach((group) => {
        line += 1
        const y = line
        write([left + 1, y], `${group.getControlGroupIndex()}`, colors.green)
        write([left + 3, y], `${group.getCount()} ${unit_name(group.getLeaderUnitType())}`)
      })
      line += 1
    }

    if (ui.hasSingle()) {
      write_line(0, 'Selection: ', colors.green)
      write_single(ui.getSingleUnit())
      if (ui.getSingle().getAttackUpgradeLevel()
        || ui.getSingle().getArmorUpgradeLevel()
        || ui.getSingle().getShieldUpgradeLevel()) {
        write_line(1, 'Upgrades: ')
        if (ui.getSingle().getAttackUpgradeLevel()) {
          write_line(2, `Attack: ${ui.getSingle().getAttackUpgradeLevel()}`)
        }
        if (ui.getSingle().getArmorUpgradeLevel()) {
          write_line(2, `Armor: ${ui.getSingle().getArmorUpgradeLevel()}`)
        }
        if (ui.getSingle().getShieldUpgradeLevel()) {
          write_line(2, `Shield: ${ui.getSingle().getShieldUpgradeLevel()}`)
        }
      }
      if (ui.getSingle().getBuffsList().length) {
        write_line(1, 'Buffs:')
        ui.getSinge().getBuffsList().forEach((b) => {
          write(line(2, buffs.Buffs(b).name))
        })
      }
    } else if (ui.hasMulti()) {
      write_line(0, 'Selection: ', colors.green)
      write_multi(ui.getMulti().getUnitsList())
    } else if (ui.hasCargo()) {
      write_line(0, 'Selection: ', colors.green)
      write_single(ui.getCargo().getUnit())
      line += 1
      write_line(0, 'Cargo: ', colors.green)
      write_line(1, `Empty slots: ${ui.getCargo().getSlotsAvailable()}`)
      write_multi(ui.getCargo().getPassengersList())
    } else if (ui.hasProduction()) {
      write_line(0, 'Selection: ', colors.green)
      write_single(ui.getProduction().getUnit())
      line += 1
      if (ui.getProduction().getProductionQueue()) {
        write_line(0, 'Production: ', colors.green)
        ui.getProduction().getProductionQueue().forEach((item) => {
          const specific_data =this.static_data.abilities[item.ability_id]
          let general_data
          if (specific_data.remaps_to_ability_id) {
            general_data = this._static_data.abilities[specific_data.remaps_to_ability_id]
          } else {
            general_data = specific_data
          }
          let s = general_data.friendly_name || general_data.button_name || general_data.link_name
          s = s.replace('Research ', '').replace('Train ', '')
          if (item.getBuildProgress() > 0) {
            s += `: ${Math.round(item.getBuildProgress() * 100)}`
          }
          write_line(1, s)
        })
      }
    }
  }

  draw_actions() {
    //Draw the actions so that they can be inspected for accuracy.//
    const now = performance.now()
    this._past_actions.forEach((act) => {
      if (act.pos && now < act.deadline) {
        const remain = (act.deadline - now) / (act.deadline - act.time)
        if (act.pos instanceof point.Point) {
          const size = remain / 3
          this.all_surfs(_Surface.draw_circle, act.color, act.pos, size, 1)
        } else {
          // Fade with alpha would be nice, but doesn't seem to work.
          this.all_surfs(_Surface.draw_rect, act.color, act.pos, 1)
        }
      }
    })
  }
  prepare_actions(obs) {
    //Keep a list of the past actions so they can be drawn.//
    const now = performance.now()
    while (this._past_actions.length && this._past_actions[0].dealine < now) {
      this._past_actions.pop()
    }

    function add_act(ability_id, color, pos, timeout = 1000) {
      let ability
      if (ability_id) {
        ability = this._static_data.abilities[ability_id]
        if (ability.remaps_to_ability_id) {
          ability_id = ability.remaps_to_ability_id
        }
      }
      this._past_actions.append(new PastAction(ability_id, color, pos, now, now + timeout))
    }

    obs.getActionsList().forEach((act) => {
      let pos
      if (act.hasActionRaw()
        && act.getActionRaw().hasUnitCommand()
        && act.getActionRaw().getUnitCommand().hasTargetWorldSpacePos()) {
        pos = new point.Point(act.getActionRaw().getUnitCommand().getTargetWorldSpacePos())
      add_act(act.getActionRaw().getUnitCommand().getAbilityId(), colors.yellow, pos)
      }
      if (act.hasActionFeatureLayer()) {
        const act_fl = act.getActionFeatureLayer()
        if (act_fl.hasUnitCommand()) {
          if (act_fl.getUnitCommand().hasTargetScreenCoord()) {
            pos = this._world_to_feature_screen_px.back_pt(
              new point.Point(act_fl.getUnitCommand().getTargetScreenCoord())
            )
            add_act(act_fl.getUnitCommand().getAbilityId(), colors.cyan, pos)
          } else if (act_fl.getUnitCommand().hasTargetMinimapCoord()) {
            pos = this._world_to_feature_minimap_px.back_pt(
              new point.Point(act_fl.getUnitCommand().getTargetMinimapCoord())
            )
            add_act(act_fl.getUnitCommand().getAbilityId(), colors.cyan, pos)
          } else {
            add_act(act_fl.getUnitCommand().getAbilityId(), null, null)
          }
        }
        if (act_fl.hasUnitSelectionPoint()
          && act_fl.getUnitSelectionPoint().hasSelectionScreenCoord()) {
          pos = this._world_to_feature_screen_px.back_pt(
            new point.Point(act_fl.getUnitSelectionPoint().getSelectionScreenCoord())
          )
          add_act(null, colors.cyan, pos)
        }
        if (act_fl.hasUnitSelectionRect()) {
          act_fl.hasUnitSelectionRect().getSelectionScreenCoordList().forEach((r) => {
            const rect = new point.Rect(
              this._world_to_feature_screen_px.back_pt(
                new point.Point(r.getP0()),
              ),
              this._world_to_feature_screen_px.back_pt(
                new point.Point(r.getP1())
              )
            )
            add_act(null, colors.cyan, rect, 0.3)
          })
        }
        if (act.hasActionRender()) {
          const act_rgb = act.getActionRender()
          if (act_rgb.hasUnitCommand()) {
            if (act_rgb.getUnitCommand().hasTargetSCreenCoord()) {
              pos = this._world_to_rgb_screen_px.back_pt(
                new point.Point(act_rgb.getUnitCommand().getTargetScreenCoord())
              )
              add_act(act_rgb.getUnitCommand().getAbilityId(), colors.red, pos)
            } else if (act_rgb.getUnitCommand().hasTargetMinimapCoord()) {
              pos = this._world_to_rgb_minimap_px.back_pt(
                new point.Point(act_rgb.getUnitCommand().getTargetMinimapCoord())
              )
              add_act(act_rgb.getUnitCommand().getAbilityId(), colors.red, pos)
            } else {
              add_act(act_rgb.getUnitCommand().getAbilityId(), null, null)
            }
          }
          if (act_rgb.hasUnitSelectionPoint()
            && act_rgb.getUnitSelectionPoint.hasSelectionScreenCoord()) {
            pos = this._word_to_rgb_screen_px.back_pt(
              new point.Point(act_rgb.getUnitSelectionPoint().getSelectionScreenCoord())
            )
            add_act(null, colors.red, pos)
          }
          if (act_rgb.hasUnitSelectionRect()) {
            act_rgb.getUnitSelectionRect().getSelectionScreenCoordList().forEach((r) => {
              const rect = new point.Rect(
                this._world_to_rgb_screen_px.back_pt(
                  new point.Point(r.getP0())
                ),
                this._world_to_rgb_screen_px.back_pt(
                  new point.Point(r.getP1())
                )
              )
              add_act(null, colors.red, rect, 0.3)
            })
          }
        }
      }
    })
  }

  async draw_base_map(surf) {
    //Draw the base map.//
    const hmap_feature = features.SCREEN_FEATURES.height_map
    let hmap = hmap_feature.unpack(this._obs.getObservation())
    if (!np.any(hmap)) {
      hmap.add(100)
    }
    const hmap_color = hmap_feature.color(hmap)
    let out = hmap_color.mul(0.6)

    const creep_feature = features.SCREEN_FEATURES.creep
    const creep = creep_feature.unpack(this._obs.getObservation())
    const creep_mask = creep.greater(0)
    const creep_color = creep_feature.color(creep)
    let temp1 = out.where(creep_mask, out.mul(0.4))
    let temp2 = creep_color.where(creep_mask, creep_color.mul(0.6))
    out = out.where(creep_mask, temp1.add(temp2))
    
    const power_feature = features.SCREEN_FEATURES.power_feature
    const power = power_feature.unpack(this._obs.getObservation())
    const power_mask = power.greater(0)
    const power_color = power_feature.color(power)
    temp1 = out.where(power_mask, out.mul(0.7))
    temp2 = power_color.where(power_mask, power_color.mul(0.3))
    out = out.where(power_mask, temp1.add(temp2))

    if (this._render_player_relative) {
      const player_rel_feature = features.SCREEN_FEATURES.player_relative
      const player_rel = player_rel_feature.unpack(this._obs.getObservation())
      const player_rel_mask = player_rel.greater(0)
      const player_rel_color = player_rel_feature.color(player_rel)
      out = out.where(player_rel_mask, player_rel_color)
    }

    const visibility = features.SCREEN_FEATURES.visibility_map.unpack(this._obs.getObservation())
    const visibility_fade = np.tensor([[0.5, 0.5, 0.5], [0.75, 0.75, 0.75], [1, 1, 1]])
    out = out.where(visibility, out.mul(visibility_fade))

    surf.blit_np_array(out)
  }

  draw_mini_map(surf) {
    //Draw the minimap//
    if (this._render_rgb
      && this._obs.getObservation.hasRenderData()
      && this._obs.getObservation().getRenderData().hasMinimap()) {
      // Draw the rendered version.
      surf.blit_np_array(features.Feature.unpack_rgb_image(
        this._obs.getObservation().getRenderData().getMinimap()
      ))
    } else { // Render it manually from feature layer data.
      const hmap_feature = features.MINIMAP_FEATURES.height_map
      let hmap = hmap_feature.unpack(this._obs.getObservation())
      if (!np.any(hmap)) {
        hmap = hmap.add(100)
      }
      hmap_color = hmap_feaure.color(hmap)

      const creep_feature = features.MINIMAP_FEATURES.creep
      const creep = creep_feature.unpack(this._obs.getObservation())
      const creep_mask = creep.greater(0)
      const creep_color = creep_feature.color(creep)

      const player_id = this._obs.getObservation().getPlayerCommon().getPlayerId()
      let player_feature
      if (player_id == 0 || player_id == 16) { // observer
        // If we're the observer, show the absolute since otherwise all player
        // units are friendly, making it pretty boring.
        const player_feature = features.MINIMAP_FEATURES.player_id
      } else {
        const player_feature = features.MINIMAP_FEATURES.player_id
      }

      const player_data = player_feature.unpack(self._obs.observation)
      const player_mask = player_data.greater(0)
      const player_color = player_feature.color(player_data)

      const visibility = features.MINIMAP_FEATURES.visibility_map.unpack(
        this._obs.getObservation()
      )
      const visibility_fade = np.tensor([[0.5, 0.5, 0.5], [0.75, 0.75, 0.75], [1, 1, 1]])
      // Compose and color the different layers.
      let out = hmap_color.mul(0.6)
      let temp1 = out.where(creep_mask, out.mul(0.4))
      let temp2 = creep_color.where(creep_mask, creep_color.mul(0.6))
      out = out.where(creep_mask, temp1.add(temp2))

      out = out.where(player_mask, player_color)
      out = out.where(visibility, out.mul(visibility_fade))

      const shape = this._playable.diagonal.scale_max_size(
        this._feature_minimap_px
      ).floor()
      surf.blit_np_array(out.slice([0, 0], [shape.y, shape.x]))

      surf.draw_rect(colors.white.mul(0.8), this._camera, 1) // Camera

      // Sensor rings.
      this._obs.getObservation().getRawData().getRadarList().forEach((radar) => {
        surf.draw_circle(
          colors.white.div(2),
          new point.Point(radar.getPos()),
          radar.getRadius(),
          1
        )
      })
    }

    // highlight enemy base locations for a short while at start of game
    if (this._obs.getObservation().getGameLoop() < 22.4 * 20) {
      this._game_info.getStartRaw().getStartLocationsList().forEach((loc) => {
        surf.draw_circle(colors.red, new point.Point(loc), 5, 1)
      })
    }

    gamejs.draw.rect(surf.surf, colors.red, surf.surf.get_rect(), 1) // Border
  }

  check_valid_queued_action() {
    // Make sure the existing command is still valid
    if (this._queued_hotkey && !this._abilities((cmd) => cmd.hotkey.slice(0, this._queued_hotkey.length) == this._queued_hotkey)) {
      this._queued_hotkey = ''
    }
    if (this._queued_action && !this._abilities((cmd) => this._queued_action == cmd)) {
      this._queued_action = null
    }
  }

  draw_rendered_map(surf) {
    // Draw the rendered pixels.//
    surf.blit_np_array(features.Feature.unpack_rgb_image(
      this._obs.getObservation().getRenderData().getMap()
    ))
  }

  draw_screen(surf) {
    //Draw the screen area.//
    if (this._reander_rgb &&
      this._obs.getObservation().hasRenderData() &&
      this._obs.getObservation().getRenderData().hasMap()) {
      this.draw_rendered_map(surf)
    } else {
      this.draw_base_map(surf)
      this.draw_effects(surf)
      this.draw_units(surf)
    }
    this.draw_selection(surf)
    this.draw_build_target(surf)
    this.draw_overlay(surf)
    this.draw_commands(surf)
    this.draw_panel(surf)
  }

  draw_feature_layer(surf, feature) {
    //Draw a feature layer//
    const layer = feature.unpack(this._obs.getObservation())
    if (layer != null) {
      surf.blit_np_array(feature.color(layer))
    } else { // Ignore layers that aren't in this version of SC2.
      surf.surf.fill(colors.black)
    }
  }

  draw_all_surfs(fn, args) {
    this._surfaces.forEach((surf) => {
      if (surf.world_to_surf) {
        fn(surf, ...Array.from(arguments).slice(1))
      }
    })
  }

  render(obs) {
    //Push an observation onto the queue to be rendered.//
    if (!this._initialized) {
      return
    }
    const now = performance.now()
    this._game_times.push(
      now - this._last_time,
      Math.max(1, obs.getObservation().getGameLoop() - this._obs.getObersvation().getGameLoop())
    )
    this._last_time = now
    this._last_game_loop = this._obs.getObservation().getGameLoop()
    this._obs_queue.add(obs)
    // dont think we need this for JavaScript
    // if (this._render_sync) {
    //   this._obs_queue.join()
    // }
  }

  get sc_alerts() {
    return Enum.IntEnum('Alert', sc_pb.Alert)
  }

  get sc_error_action_result() {
    return Enum.IntEnum('ActionResult')
  }

  async render_thread() {
    //A render loop that pulls observations off the queue to render.//
    let obs = true
    while (obs) {  // Send something falsy through the queue to shut down.
      obs = await this._obs_queue.get()
      if (obs) {
        obs.getObservation().getAlerts().forEach((alert) => {
          this._alerts[this.sc_alerts(alert)] = performance.now()
        })
        obs.getActionErrorsList().forEach((err) => {
          if (err.getResult() != this.sc_error_action_result.SUCCESS) {
            this._alerts[this.sc_error_action_result(err.getResult())] = performance.now()
          }
        })
        this.prepare_actions(obs)
        if (this._obs_queue.length === 0) {
          // Only render the latest observation so we keep up with the game.
          this.render_obs(obs)
        }
        if (this._video_writer) {
          const axes = [1, 0, 2]
          this._video_writer.add(np.transpose(
            window.gamejs.surfarray.pixels3d(this._window), axes)
          )
        }
      }
      // Dont think we need this in JavaScript
      // this._obs_queue.task_done()
    }
  }

  render_obs(obs) {
    //Render a frame given an observation.//
    const start_time = performance.now()
    this._obs = obs
    this.check_valid_queued_action()
    this._update_camera(new point.Point(
      this._obs.getObservation().getRawData().getPlayer().getCamera())
    )

    this._surfaces.forEach((surf) => {
      // Render that surface.
      surf.draw(surf)
    })
    const mouse_pos = this.get_mouse_pos()
    if (mouse_pos) {
      // Draw a small mouse cursor)
      this.all_surfs(_Surface.draw_circle, colors.green, mouse_pos.world_pos, 0.1)
    }

    this.draw_actions()

    withPython(sw('flip'), () => {
      window.gamejs.display.flip()
    })

    this._render_times.push(performance.now() - start_time)
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
        await this.init(await controller.game_info(), await controller.data())
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

function getTypes() {
  const root = new protobuf.Root().loadSync('human_renderer.proto')
  const RequestStaticData = root.lookupType('human_renderer.RequestStaticData')
  return { RequestStaticData }
}

// function getTypes() {
//   let resolve
//   let reject
//   const prom = new Promise((res, rej) => {
//     resolve = res
//     reject = rej
//   })
//   let requestTypes
//   let responseTypes
//   let dataTypes
//   protobuf.load('human_renderer.proto', (err, root) => {
//     if (err) {
//       reject(err)
//     }
//     // Data types
//     const Point = root.lookupType('human_renderer.Point')
//     const Rectangle = root.lookupType('human_renderer.Rectangle')
//     dataTypes = [Point, Rectangle]
//     // Request types
//     const DrawLineRequest = root.lookupType('human_renderer.DrawLineRequest')
//     const DrawArcRequest = root.lookupType('human_renderer.DrawArcRequest')
//     const DrawCircleRequest = root.lookupType('human_renderer.DrawCircleRequest')
//     const BlitArrayRequest = root.lookupType('human_renderer.BlitArrayRequest')
//     const WriteScreenRequest = root.lookupType('human_renderer.WriteScreenRequest')
//     const WriteWorldRequest = root.lookupType('human_renderer.WriteWorldRequest')
//     const RequestStaticData = root.lookupType('human_renderer.RequestStaticData')
//     requestTypes = [
//       DrawLineRequest, DrawArcRequest,
//       DrawCircleRequest, BlitArrayRequest,
//       WriteScreenRequest, WriteWorldRequest,
//       RequestStaticData,
//     ]
//     // Response types
//     const DrawLineResponse = root.lookupType('human_renderer.DrawLineResponse')
//     const DrawArcResponse = root.lookupType('human_renderer.DrawArcResponse')
//     const DrawCircleResponse = root.lookupType('human_renderer.DrawCircleResponse')
//     const BlitArrayResponse = root.lookupType('human_renderer.BlitArrayResponse')
//     const WriteScreenResponse = root.lookupType('human_renderer.WriteScreenReponse')
//     const WriteWorldResponse = root.lookupType('human_renderer.WriteWorldResponse')
//     responseTypes = [
//       DrawLineResponse, DrawArcResponse,
//       DrawCircleResponse, BlitArrayResponse,
//       WriteScreenResponse, WriteWorldResponse
//     ]
//     resolve({ dataTypes, requestTypes, responseTypes })
//   })
//   return prom
// }

module.exports = {
  ActionCmd,
  circle_mask,
  getTypes,
  MouseButtons,
  MousePos,
  PastAction,
  RendererHuman,
  SurfType,
  _get_desktop_size,
  _Surface,
  _Ability,
}
