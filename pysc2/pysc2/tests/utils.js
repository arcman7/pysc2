const path = require('path') //eslint-disable-line
const s2clientprotocol = require('s2clientprotocol') //eslint-disable-line
const maps = require(path.resolve(__dirname, '..', 'maps'))
const run_configs = require(path.resolve(__dirname, '..', 'run_configs'))
const actions = require(path.resolve(__dirname, '..', 'lib', 'actions.js'))
const features = require(path.resolve(__dirname, '..', 'lib', 'features.js'))
const point = require(path.resolve(__dirname, '..', 'lib', 'point.js'))
const portspicker = require(path.resolve(__dirname, '..', 'lib', 'portspicker.js'))
const stopwatch = require(path.resolve(__dirname, '..', 'lib', 'stopwatch.js'))
const np = require(path.resolve(__dirname, '..', 'lib', 'numpy.js'))

const pythonUtils = require(path.resolve(__dirname, '..', 'lib', 'pythonUtils.js'))

const { assert, String } = pythonUtils //eslint-disable-line

const sc_common = s2clientprotocol.common_pb
const sc_debug = s2clientprotocol.debug_pb
const sc_error = s2clientprotocol.error_pb
const sc_raw = s2clientprotocol.raw_pb
const sc_pb = s2clientprotocol.sc2api_pb

class TestCase {
  //A test base class that enables stopwatch profiling.

  setUp() { //eslint-disable-line
    stopwatch.sw.clear()
    stopwatch.sw.enable()
  }

  tearDown() { //eslint-disable-line
    const s = stopwatch.sw.toString()
    if (s) {
      console.info(`Stop watch profile:\n ${s}`)
    }
    stopwatch.sw.disable()
  }
}

function get_units(obs, filter_fn = null, owner = null, unit_type = null, tag = null) {
  //Return a dict of units that match the filter.//
  if (unit_type && !Array.isArray(unit_type)) {
    unit_type = [unit_type]
  }
  const out = {}
  const units = obs.getObservation().getRawData().getUnitsList()
  units.forEach((u) => {
    if ((filter_fn === null || filter_fn(u))
      && (owner === null || u.getOwner() === owner)
      && (unit_type === null || unit_type[u.getUnitType()])
      && (tag === null || u.getTag() === tag)) {
      out[u.getTag()] = u
    }
  })
  return out
}

function get_unit() {
  //Return the first unit that matches, or None.//
  const out = get_unit(...arguments) //eslint-disable-line
  return out[Object.keys(out)[0]] || null
}

async function xy_locs(mask) {
  // Javascript: Assuming mask is an array of bools
  // Mask should be a set of bools from comparison with a feature layer.//
  return (await np.whereAsync(mask).arraySync()).map(([x, y]) => new point.Point(x, y))
}

function only_in_game(func) {
  function decorator() {
    if (this.in_game) {
      return func(...arguments) //eslint-disable-line
    }
  }
  return decorator
}

class GameReplayTestCase extends TestCase {
  //Tests that run through a game, then verify it still works in a replay.//

  static setup(kwargs) {
    //A decorator to replace unittest.setUp so it can take args.//
    function decorator(func) {
      function _setup() {
        function test_in_game() {
          console.log(` ${func.name}: Starting game `.center(80, '-'))
          this.start_game(kwargs)
          func(this)
        }

        function test_in_replay() {
          this.start_replay()
          console.log(`${func.name}: Starting replay `.center(80, '-'))
          func(this)
        }

        try {
          test_in_game()
          test_in_replay()
        } catch (err) {
          console.error(err)
          this.close()
        }
      }
      return _setup
    }
    return decorator
  }

  async start_game(show_cloaked = true, disable_fog = false, players = 2) {
    //Start a multiplayer game with options.//
    this._disable_fog = disable_fog
    const run_config = run_configs.get()
    // this._parallel = new run_parallel.RunParallel() // Python needed for multiplayer
    const map_inst = maps.get('Flat64')
    this._map_data = map_inst.data(run_config)

    this._ports = players === 2 ? await portspicker.pick_unused_ports(4) : []
    this._sc2_procs = Array(players)
      .map(() => run_config.start({ extra_ports: this._ports, want_rgb: false }))
    this._sc2_procs = await Promise.all(this._sc2_procs)
    this.controllers = this._sc2_procs.map((p) => p.controller)

    if (players === 2) {
      // Serial due to a race condition on Windows.
      await this._controllers[0].save_map(map_inst.path, this._map_data)
      await this._controllers[1].save_map(map_inst.path, this._map_data)
    }

    this._interface = new sc_pb.InterfaceOptions()
    this._interface.setRaw(true)
    this._interface.setRawCropToPlayableArea(true)
    this._interface.setShowCloaked(show_cloaked)
    this._interface.setScore(false)
    const featureLayer = new sc_pb.SpatialCameraSetup()
    featureLayer.setWidth(24)
    const resolution = new sc_pb.Size2DI()
    resolution.setX(64)
    resolution.setY(64)
    featureLayer.setResolution(resolution)
    const minimapResolution = new sc_pb.Size2DI()
    minimapResolution.setX(64)
    minimapResolution.setY(64)
    featureLayer.setMinimapResolution(minimapResolution)
    this._interface.setFeatureLayer(featureLayer)

    const create = new sc_pb.RequestCreateGame()
    create.setRandomSeed(1)
    create.setDisableFog(this._disable_fog)
    const localMap = new sc_pb.LocalMap()
    localMap.setMapPath(map_inst.path)
    create.setLocalMap(localMap)
    for (let i = 0; i < players; i++) {
      const playerSetup = new sc_pb.PlayerSetup()
      playerSetup.setType(sc_pb.PlayerType.PARTICIPANT)
      create.addPlayerSetup(playerSetup)
    }

    if (players === 1) {
      create.getLocalMap().setMapData(this._map_data)
      const playerSetup = new sc_pb.PlayerSetup()
      playerSetup.setType(sc_pb.PlayerType.COMPUTER)
      playerSetup.setRace(sc_common.Race.RANDOM)
      playerSetup.setDifficulty(sc_pb.Difficulty.VERYEASY)
      create.addPlayerSetup(playerSetup)
    }

    const join = new sc_pb.RequestJoinGame()
    join.setRace(sc_common.Race.PROTOSS)
    join.setOptions(this._interface)

    if (players === 2) {
      join.setSharedPort(0) //unused
      const serverPorts = new sc_pb.PortSet()
      serverPorts.setGamePort(this.ports[0])
      serverPorts.setBasePort(this.ports[1])
      join.setServerPorts(serverPorts)
      const clientPorts = new sc_pb.PortSet()
      clientPorts.setGamePort(this._ports[2])
      clientPorts.setBasePort(this._ports[3])
      join.addClientPorts(clientPorts)
    }

    await this._controllers[0].create_game(create)
    await Promise.all(this._controllers.map((c) => c.join_game(join)))

    this._info = await this._controllers[0].game_info()
    this._features = features.features_from_game_info(this._info, true)

    this._map_size = point.Point.build(this._info.getStartRaw().getMapSize())
    console.log('Map size: ', this._map_size)
    this.in_game = true
    await this.step() // Get into the game properly.
  }

  async start_replay() {
    //Switch from the game to a replay.//
    await this.step(300)
    const replay_data = await this._controllers[0].save_replay()
    await Promise.all(this._controllers.map((c) => c.leave()))
    await Promise.all(this._controllers.map((controller, player_id) => {
      const req = new sc_pb.RequestStartReplay()
      req.setReplayData(replay_data)
      req.setMapData(this._map_data)
      req.setOptions(this._interface)
      req.setDisableFog(this._disable_fog)
      req.setObservedPlayerId(player_id + 1)
      return controller.start_replay(req)
    }))
    this.in_game = false
    this.step() // Get into the game properly.
  }

  async close() { // Instead of tearDown.
    //Shut down the SC2 instances."//
    // Don't use parallel since it might be broken by an exception.
    if (this._controllers && this._controllers.length) {
      await Promise.all(this._controllers.map((c) => c.quit()))
      this._controllers = null
    }
    if (this._sc2_procs && this._sc2_procs.length) {
      await Promise.all(this._sc2_procs.map((p) => p.close()))
      this._sc2_procs = null
    }

    if (this._ports && this._ports.length) {
      //portspicker.return_ports(self._ports) // can't do this yet
      this._ports = null
    }
    this._parallel = null
  }

  step(count = 4) {
    return Promise.all(this._controllers.map((c) => c.step(count)))
  }

  observe(disable_fog = false) {
    return Promise.all(this._controllers.map((c) => c.observe(disable_fog)))
  }

  move_camera(x, y) {
    const action = new sc_pb.Action()
    const actionRaw = new sc_raw.ActionRaw()
    const cameraMove = new sc_raw.ActionRawCameraMove()
    const centerWorldSpace = new sc_raw.Point()
    centerWorldSpace.setX(x)
    centerWorldSpace.setY(y)
    cameraMove.setCenterWorldSpace(centerWorldSpace)
    actionRaw.setCameraMove(cameraMove)
    action.setActionRaw(actionRaw)
    return Promise.all(this._controllers.map((c) => c.act(action)))
  }

  async raw_unit(player, ability_id, unit_tags, pos = null, target = null) {
    //Issue a raw unit command.//
    if (typeof ability_id === 'string') {
      ability_id = actions.FUNCTION[ability_id].ability_id
    }
    const action = new sc_pb.Action()
    const actionRaw = new sc_raw.ActionRaw()
    const cmd = new sc_raw.ActionRawUnitCommand()
    actionRaw.setUnitCommand(cmd)
    action.setActionRaw(actionRaw)
    cmd.setAbilityId(ability_id)
    if (Array.isArray(unit_tags)) {
      unit_tags.forEach((unit_tag) => cmd.addUnitTags(unit_tag))
    } else {
      cmd.addUnitTags(unit_tags)
    }
    if (pos) {
      const targetWorldSpacePos = new sc_raw.Point2D()
      targetWorldSpacePos.setX(pos[0])
      targetWorldSpacePos.setY(pos[1])
      cmd.setTargetWorldSpacePos(targetWorldSpacePos)
    } else if (target) {
      cmd.setTargetUnitTag(target)
    }
    const response = await this._controllers[player].act(action)
    Object.keys(response.result).forEach((key) => {
      const result = response.result[key]
      assert(result == sc_error.ActionResult.SUCCESS, 'result == sc_error.ActionResult.SUCCESS')
    })
  }

  debug(player = 0, { game_state }) {
    const req = new sc_debug.DebugCommand()
    req.setGameState(game_state)
    return this._controllers[player].debug([req])
  }

  god() {
    //Stop the units from killing each other so we can observe them.//
    this.debug(0, { game_state: sc_debug.DebugGameState.GOD })
    this.debug(1, { game_state: sc_debug.DebugGameState.GOD })
  }

  create_unit(unit_type, owner, pos, quantity = 1) {
    const usedPos = new sc_common.Point2D()
    if (Array.isArray(pos)) {
      usedPos.setX(pos[0])
      usedPos.setY(pos[1])
    } else if (pos instanceof sc_common.Point) {
      usedPos.setX(pos.getX())
      usedPos.setY(pos.getY())
    }
    return this.debug
  }
}

module.exports = {
  get_unit,
  get_units,
  GameReplayTestCase,
  TestCase,
  xy_locs,
}
