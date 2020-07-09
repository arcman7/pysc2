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

const sc_error = s2clientprotocol.error_pb
const sc_raw = s2clientprotocol.raw_pb
const sc_pb = s2clientprotocol.sc2api_pb
const spatial = s2clientprotocol.spatial_pb
const sc_ui = s2clientprotocol.ui_pb
const sw = stopwatch.sw

const { assert, namedtuple, ValueError, withPython } = pythonUtils

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
    const rect = window.gamejs.Rect(tl, br - tl)
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

  async init() {
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
        this._rgb_minimap_px / this._map_size.max_dim()
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
          screen_size_px / this._rgb_screen_px)
      add_surface(SurfType.RGB | SurfType.SCREEN,
                  new point.Rect(point.origin, screen_size_px),
                  new transform.Chain(  // surf
                      this._world_to_rgb_screen,
                      rgb_screen_to_main_screen),
                  this._world_to_rgb_screen_px,
                  this.draw_screen)
      rgb_minimap_to_main_minimap = new transform.Linear(
          minimap_size_px / this._rgb_minimap_px)
      add_surface(SurfType.RGB | SurfType.MINIMAP,
                  new point.Rect(minimap_offset,
                             minimap_offset + minimap_size_px),
                  new transform.Chain(  // surf
                      this._world_to_rgb_minimap,
                      rgb_minimap_to_main_minimap),
                  this._world_to_rgb_minimap_px,
                  this.draw_mini_map)
    } else {  // Feature layer main screen
      feature_screen_to_main_screen = new transform.Linear(
          screen_size_px / this._feature_screen_px)
      add_surface(SurfType.FEATURE | SurfType.SCREEN,
                  new point.Rect(point.origin, screen_size_px),
                  transform.Chain(  // surf
                      this._world_to_feature_screen,
                      feature_screen_to_main_screen),
                  this._world_to_feature_screen_px,
                  this.draw_screen)
      feature_minimap_to_main_minimap = new transform.Linear(
          minimap_size_px.max_dim() / this._feature_minimap_px.max_dim())
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
      const feature_layer_area = new point.Point(1, 1).scale_max_size(
          feature_grid_size)
      const feature_layer_padding = feature_layer_area // 20
      const feature_layer_size = feature_layer_area - feature_layer_padding * 2

      const feature_font_size = int(feature_grid_size.y * 0.09)
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
            feature_layer_size / this._feature_minimap_px)
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
        const world_pt - surf.world_to_surf.back_pt(surf_rel_pt)
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
    const world_pos.assign_to(action.action_raw.camera_move.center_world_space)
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
    assert(pos1.surf.surf_type == pos2.surf.surf_type, 'pos1.surf.surf_type == pos2.surf.surf_type')
    assert(pos1.surf.world_to_obs == pos2.surf.world_to_obs, 'pos1.surf.world_to_obs == pos2.surf.world_to_obs')

    const action = new sc_pb.Action()
    const action_raw = new sc_pb.ActionRaw()
    const unit_command = new sc_pb.ActionRawUnitCommand()
    action_raw.setUnitCommand(unit_command)
    action.setActionRaw(action_raw)
    if (this._raw_actions) {
      const unit_command.setAbilityId(0)  // no-op
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
        const unit_command.addUnitTags(u.getUn)
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

  select_army(self, shift) {
    //Select the entire army.//
    const action = new sc_pb.Action()
    action.action_ui.select_army.selection_add = shift
    return action

  }

  select_warp_gates(self, shift) {
    //Select all warp gates.//
    const action = new sc_pb.Action()
    action.action_ui.select_warp_gates.selection_add = shift
    return action

  }

  select_larva(self) {
    //Select all larva.//
    const action = new sc_pb.Action()
    action.action_ui.select_larva.SetInParent()  # Adds the empty proto field.
    return action
  }
}

function getTypes() {
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
