// A Starcraft II environment.
const s2clientprotocol = require('s2clientprotocol')
const Enum = require('python-enum')
const path = require("path")
const maps = require(path.resolve(__dirname, '..', 'maps')) // need to verify
const run_configs = require(path.resolve(__dirname, '..', 'run_configs')) // need to verify
const collections = require(path.resolve(__dirname, 'collections.js'))
const all_collections_generated_classes = require(path.resolve(__dirname, 'all_collections_generated_classes.js'))
const environment = require(path.resolve(__dirname, 'environment.js'))
const actions = require(path.resolve(__dirname, '..', 'lib', 'actions.js'))
const features = require(path.resolve(__dirname, '..', 'lib', 'features.js'))
const metrics = require(path.resolve(__dirname, '..', 'lib', 'metrics.js'))
const portspicker = require(path.resolve(__dirname, '..', 'lib', 'portspicker.js'))
const renderer_human = require(path.resolve(__dirname, '..', 'lib', 'renderer_human.js'))
const run_parallel = require(path.resolve(__dirname, '..', 'lib', 'run_parallel.js'))
const stopwatch = require(path.resolve(__dirname, '..', 'lib', 'stopwatch.js'))
const pythonUtils = require(path.resolve(__dirname, '..', 'lib', 'pythonUtils.js'))

const { performance } = require('perf_hooks')
const { randomChoice, any, zip, assert} = pythonUtils
const { common_pb, sc2api_pb } = s2clientprotocol
const sc_common = common_pb
const sc_pb = sc2api_pb

const sw = stopwatch.sw

const possible_results = {
  sc_pb.Victory: 1,
  sc_pb.Defeat: -1,
  sc_pb.Tie: 0,
  sc_pb.Undecided: 0,
}

const Race = Enum.IntEnum('Race', {
  random = sc_common.Random
  protoss = sc_common.Protoss
  terran = sc_common.Terran
  zerg = sc_common.Zerg
}) 

const Difficulty = Enum.IntEnum('Difficulty', {
  // Bot difficulties.
  very_easy = sc_pb.VeryEasy
  easy = sc_pb.Easy
  medium = sc_pb.Medium
  medium_hard = sc_pb.MediumHard
  hard = sc_pb.Hard
  harder = sc_pb.Harder
  very_hard = sc_pb.VeryHard
  cheat_vision = sc_pb.CheatVision
  cheat_money = sc_pb.CheatMoney
  cheat_insane = sc_pb.CheatInsane
})

const BotBuild = Enum.IntEnum('BotBuild', {
  // Bot build strategies.
  random = sc_pb.RandomBuild
  rush = sc_pb.Rush
  timing = sc_pb.Timing
  power = sc_pb.Power
  macro = sc_pb.Macro
  air = sc_pb.Air
})

// Re-export these names to make it easy to construct the environment.
const ActionSpace = action_lib.ActionSpace
const Dimensions = features.Dimensions
const AgentInterfaceFormat = features.AgentInterfaceFormat
const parse_agent_interface_format = fetures.parse_agent_interface_format

function to_list(arg) {
  if(arg instanceof Array) {
    return arg
  } else {
    return [arg]
  }
}

function get_default(a, b) {
  if(a == null) {
    return b
  } else {
    return a
  }
}

class Agent extends all_collections_generated_classes.Agent {
// Define an Agent. It can have a single race or a list of races.
  constructor(race, name = null) {
    super(to_list(race), name or "<unknown>")
  }
}

class Bot extends all_collections_generated_classes.Bot {
// Define a Bot. It can have a single or list of races or builds.
  constructor(race, difficulty, build = null) {
    super(to_list(race), difficulty, to_list(build or BotBuild.random))
  }
}

const _DelayedAction = all_collections_generated_classes._DelayedAction 

const REALTIME_GAME_LOOP_SECONDS = 1 / 22.4
const MAX_STEP_COUNT = 524000 // The game fails above 2^19=524288 steps.
const NUM_ACTION_DELAY_BUCKETS = 10

class SC2Env extends environment.Base {
  /* 
  A Starcraft II environment.

  The implementation details of the action and observation specs are in
  lib/features.py
  */
  constructor(
    _only_use_kwargs = null,
    map_name = null,
    battle_net_map = false,
    players = null,
    agent_interface_format = null,
    discount = 1.0,
    discount_zero_after_timeout = false,
    visualize = false,
    step_mul = null,
    realtime = false,
    save_replay_episodes = 0,
    replay_dir = null,
    replay_prefix = null,
    game_steps_per_episode = null,
    score_index = null,
    score_multiplier = null,
    random_seed = null,
    disable_fog = false,
    ensure_available_actions = true,
    version = null
  ) {
    /*
    Create a SC2 Env.

    You must pass a resolution that you want to play at. You can send either
    feature layer resolution or rgb resolution or both. If you send both you
    must also choose which to use as your action space. Regardless of which you
    choose you must send both the screen and minimap resolutions.

    For each of the 4 resolutions, either specify size or both width and
    height. If you specify size then both width and height will take that value.

    Args:
      _only_use_kwargs: Don't pass args, only kwargs.
      map_name: Name of a SC2 map. Run bin/map_list to get the full list of
          known maps. Alternatively, pass a Map instance. Take a look at the
          docs in maps/README.md for more information on available maps. Can
          also be a list of map names or instances, in which case one will be
          chosen at random per episode.
      battle_net_map: Whether to use the battle.net versions of the map(s).
      players: A list of Agent and Bot instances that specify who will play.
      agent_interface_format: A sequence containing one AgentInterfaceFormat
        per agent, matching the order of agents specified in the players list.
        Or a single AgentInterfaceFormat to be used for all agents.
      discount: Returned as part of the observation.
      discount_zero_after_timeout: If True, the discount will be zero
          after the `game_steps_per_episode` timeout.
      visualize: Whether to pop up a window showing the camera and feature
          layers. This won't work without access to a window manager.
      step_mul: How many game steps per agent step (action/observation). null
          means use the map default.
      realtime: Whether to use realtime mode. In this mode the game simulation
          automatically advances (at 22.4 gameloops per second) rather than
          being stepped manually. The number of game loops advanced with each
          call to step() won't necessarily match the step_mul specified. The
          environment will attempt to honour step_mul, returning observations
          with that spacing as closely as possible. Game loops will be skipped
          if they cannot be retrieved and processed quickly enough.
      save_replay_episodes: Save a replay after this many episodes. Default of 0
          means don't save replays.
      replay_dir: Directory to save replays. Required with save_replay_episodes.
      replay_prefix: An optional prefix to use when saving replays.
      game_steps_per_episode: Game steps per episode, independent of the
          step_mul. 0 means no limit. null means use the map default.
      score_index: -1 means use the win/loss reward, >=0 is the index into the
          score_cumulative with 0 being the curriculum score. null means use
          the map default.
      score_multiplier: How much to multiply the score by. Useful for negating.
      random_seed: Random number seed to use when initializing the game. This
          lets you run repeatable games/tests.
      disable_fog: Whether to disable fog of war.
      ensure_available_actions: Whether to throw an exception when an
          unavailable action is passed to step().
      version: The version of SC2 to use, defaults to the latest.

    Raises:
      ValueError: if no map is specified.
      ValueError: if wrong number of players are requested for a map.
      ValueError: if the resolutions aren't specified correctly.
    */

    if (_only_use_kwargs) {
      throw new Error("ValueError: All arguments must be passed as keyword arguments.")
    }

    if (!(players)) {
      throw new Error("ValueError: You must spesify the lsit of players.")
    }

    Object.keys(players).forEach((key) => {
      const p = players[key]
      if (!(p instanceof (Agent, Bot))) {
        throw new Error("ValueError: Expected players to be of type Agent or Bot. Got: ${p}")
      }
    })

    const num_players = players.length
    let n_agents = 0
    Object.keys(players).forEach((key) => {
      const p = players[key]
      if(p instanceof Agent) {
        n_agents += 1
      }
    })
    this._num_agents = n_agents
    this._players = players

    if (!(1 <= num_players <= 2) || !(this._num_agents)) {
      throw new Error("ValueError: Only 1 or 2 players with at least one agent is supported at the moment")
    }

    if (!map_name) {
      throw new Error("ValueError: Missing a map name.")
    }

    this._battle_net_map = battle_net_map
    let map = []
    Object.keys(to_list(map_name)).forEach((key) => {
      const name = to_list(map_name)[key]
      map.push(maps.get(name))
    })
    this._maps = map
    let playercollect = []
    Object.keys(this._maps).forEach((key) => {
      const m = this._maps[key]
      playercollect.push(m.players)
    })
    const min_players = Math.min(...playercollect)
    const max_players = Math.max(...playercollect)

    if (this._battle_net_map) {
      Object.keys(this._maps).forEach((key) => {
        const m = this._maps[key]
        if(!m.battle_net_map) {
          throw new Error("ValueError: ${m.name} isn't known on Battle.net")
        }
      })
    }

    if (max_players == 1) {
      if (this._num_agents !== 1) {
        throw new Error("ValueError: Single player maps require exactly one Agent.")
      }
    } else if (!(2 <= num_players <= min_players)) {
      throw new Error("ValueError: Maps support 2 - ${min_players} players, but trying to join with ${num_players}")
    }

    if (save_replay_episodes && !(replay_dir)) {
      throw new Error("ValueError: Missing replay_dir")
    }

    this._realtime = realtime
    this._last_step_time = null
    this._save_replay_episodes = save_replay_episodes
    this._replay_dir = replay_dir
    this._replay_prefix = replay_prefix
    this._random_seed = random_seed
    this._disable_fog = disable_fog
    this._ensure_available_actions = ensure_available_actions
    this._discount = discount
    this._discount_zero_after_timeout = discount_zero_after_timeout
    this._default_step_mul = step_mul
    this._default_score_index = score_index
    this._default_score_multiplier = score_multiplier
    this._default_episode_length = game_steps_per_episode
    this._run_config = run_configs.get({version})
    this._parallel = run_parallel.RunParallel()  // Needed for multiplayer.
    this._game_info = null

    if (agent_interface_format == null) {
      throw new Error("ValueError: Please specify agent_interface_format.")
    }

    if (agent_interface_format instanceof AgentInterfaceFormat) {
      agent_interface_format = [agent_interface_format] * this._num_agents
    }

    if (agent_interface_format.length !== this._num_agents) {
      throw new Error("ValueError: The number of entries in agent_interface_format should be correspond 1-1 with the number of agents.")
    }

    this._action_delay_fns = []
    Object.keys(agent_interface_format).forEach((key) => {
      const aif = agent_interface_format[key]
      this._action_delay_fns.push(aif._action_delay_fns)
    }) 
    this._interface_formats = agent_interface_format

    this._interface_options = []
    Object.keys(agent_interface_format.entries()).forEach((key) => {
      const i = key
      const interface_format = agent_interface_format.entries()
      this._interface_options.push(this._get_interface({interface_format, require_raw: visualize && i == 0 }))
    })

    this._launch_game()
    this._create_join()
    this._finalize_join()

    // apply @sw.decorate
    this.reset = sw.decorate(this.reset.bind(this))
    this.step = sw.decorate(this.step.bind(this))
    // check with  @sw.decorate("step_env")
    //             def step(...)
  }

  _finalize(visualize) {
    for (var i = 1: i < this._action_delay_fns.lenght(); i++) {
      this._delayed_actions = [collections.deque()]
    }

    if (visualize) {
      this._renderer_human =  renderer_human.RendererHuman()
      this._renderer_human.init({
        this._controllers[0].game_info(),
        this._controllers[0].data()
      })
    } else {
      this._renderer_human = null
    }
    
    this._metrics = metrics.Metrics(this._map_name)
    this._metrics.increment_instance()

    this._last_score = null
    this._total_steps = 0
    this._episode_steps = 0
    this._episode_count = 0
    this._obs = Array(this._num_agents.length).fill(null)
    this._agent_obs = Array(this._num_agents.length).fill(null)
    this._state = environment.StepType.LAST  // Want to jump to `reset`.
    console.log("Environment is ready")
  }

  static _get_interface(agent_interface_format, require_raw) {
    const aif = agent_interface_format
    const interface = sc_pb.InterfaceOptions({
      raw: (aif.use_feature_units || 
        aif.use_unit_counts ||
        aif.use_raw_units ||
        require_raw),
      show_cloaked: aif.show_cloaked,
      show_burrowed_shadows: aif.show_burrowed_shadows,
      show_placeholders: aif.show_placeholders,
      raw_affects_selection: true,
      raw_crop_to_playable_area: aif.raw_crop_to_playable_area,
      score = true)
    })
    
    if (aif.feature_dimensions) {
      interface.feature_layer.width = aif.camera_width_world_units
      aif.feature_dimensions.screen.assign_to(
          interface.feature_layer.resolution)
      aif.feature_dimensions.minimap.assign_to(
          interface.feature_layer.minimap_resolution)
      interface.feature_layer.crop_to_playable_area = aif.crop_to_playable_area
      interface.feature_layer.allow_cheating_layers = aif.allow_cheating_layers
    }

    if (aif.rgb_dimensions) {
      aif.rgb_dimensions.screen.assign_to(interface.render.resolution)
      aif.rgb_dimensions.minimap.assign_to(interface.render.minimap_resolution)
    }

    return interface
  }

  _launch_game() {
    // Reserve a whole bunch of ports for the weird multiplayer implementation.
    if (this._num_agents > 1) {
      this._ports = portspicker.pick_unused_ports(this._num_agents * 2)
      console.log("Ports used for multiplayer: ${this._ports}")
    } else {
      this._ports = []
    }

    // Actually launch the game processes.
    this._sc2_procs = []
    Object.keys(this._interface_options).forEach((key) => {
      const interface = this._interface_options[key]
      this._sc2_procs.push(this._run_config.start({
        extra_ports: this._ports,
        want_rgb: interface.has("render")
      }))
    })
    this._controllers = []
    Object.keys(this._sc2_procs).forEach((key) => {
      const p = this._sc2_procs[key]
      this._controllers.push(p.controller)
    })

    if (this._battle_net_map) {
      const available_maps = this._controllers[0].available_maps()
      available_maps = set(available_maps.battlenet_map_names)
      const unavailable = []
      Object.keys(this._maps).forEach((key) => {
        const m = this.maps[key]
        if(!(m.battle_net.includes(available_maps))) {
          unavailable.push(m.name)
        }
      })

      if (unavailable) {
        throw new Error("ValueError: Requested map(s) not in the battle.net cache: ${",".join(unavailable)}")
      }
    }
  }

  _create_join() {
  // Create the game, and join it.
    const map_list = randomChoice(this._maps)
    this._map_name = map_inst.name
    this._step_mul = Math.max(1, this._default_step_mul || map_inst.step_mul)
    this._score_index = get_default(this._default_score_index, map_inst.score_index)
    this._score_multiplier = get_default(this._default_score_multiplier, map_inst.score_multiplier)
    this._episode_length = get_default(this._default_episode_length, map_inst.game_steps_per_episode)
    if (this._episode_length <= 0 || this._episode_length > MAX_STEP_COUNT) {
      this._episode_length = MAX_STEP_COUNT
    }

    // Create the game. Set the first instance as the host.
    const create = sc_pb.RequestCreateGame({
      disable_fog: this._disable_fog,
      realtime: this._realtime
    })

    if (this._battle_net_map) {
      create.battlenet_map_name = map_inst.battle_net
    } else {
      create.local_map.map_path = map_inst.path
      map_data = map_inst.data(this._run_config)
      if (this._num_agents == 1) {
        create.local_map.map_data = map_data
      } else {
        Object.keys(this._controllers).map((key) => {
          const c = this._controllers[key]
          return c.save_map(map_inst.path, map_data)
        })
      }
    }

    if(this._random_seed !== null) {
      create.random_seed = this._random_seed
    }

    Object.keys(this._players).map((key) => {
      const p = this._players[key]
      if (p instanceof Agent) {
        return create.player_setup.add({type: sc_pb.Participant})
      } else {
        return create.player_setup.add({
          type: sc_pb.Computer,
          race: randomChoice(p.race),
          difficulty: p.difficulty,
          ai_build: randomChoice(p.build)
        })
      }
    })
    this._controllers[0].create_game(create)

    // Create the join requests.
    let agent_players = []
    Object.keys(this._players).forEach((key) => {
      const p = this._players[key]
      if (p instanceof Agent) {
        agent_players.push(p)
      }
    })
    let sanitized_names
    Object.keys(agent_players).map((key) => {
      const p = agent_players[key]
      return crop_and_deduplicate_names(p.name)
    })

    const join_reqs = []
    zip(agent_players, sanitized_names, this._interface_options).forEach((keys) => {
      const [p, name, interface] = keys
      const join = sc_pb.RequestCreateGame({options: interface})
      join.race = randomChoice(p.race)
      join.player_name = name
      if (this._ports) {
        join.shared_port = 0
        join.server_ports.game_port = this._ports[0]
        join.server_ports.base_port = this._ports[1]
        for (var i = 0; i < this._num_agents -1; i++) {
          join.client_ports.add({
            game_port: this._ports[i * 2 + 2],
            base_port: this._ports[i * 2 + 3]
          })
        }
      }
      join_reqs.push(join)
    })
    
    // Join the game. This must be run in parallel because Join is a blocking call to the game that waits until all clients have joined.
    zip(this._controllers, join_reqs).forEach((keys) => {
      const [c, join] = keys
      this._parallel.run((c.join_game, join))
    })

    Object.keys(this._controllers).forEach((key) => {
      const c = this._controllers[key]
      this._game_info = this._parallel(c.game_info)       
    })

    zip(this._game_info, this._interface_options).forEach((keys) => {
      const [g, interface] = keys
      if (g.options.render !== interface.render) {
        console.warn("Actual interface options don't match requested options: \n"
          "Requested: ${interface} \n\nActual: ${g.options}")
      }
    })

    zip(this._game_info, this._interface_formats).forEach((keys) => {
      const [g, aif] = keys
      this._features = [features.features_from_game_info({
        game_info: g,
        agent_interface_format: aif,
        map_name: this._map_name
      })]
    })
  }

  get map_name() {
    return this._map_name
  }

  get game_info() {
  // A list of ResponseGameInfo, one per agent.
    return this._game_info
  }

  static_data() {
    return this._controllers[0].data()
  }

  observation_spec() {
  // Look at Features for full specs.
    let tuple = []
    Object.keys(this._features).forEach((key) => {
      const f = this._features[key]
      tuple.push(f.observation_spec())
    })
    return tuple 
  }

  action_spec() {
    let tuple = []
    Object.keys(this._features).forEach((key) => {
      const f = this._features[key]
      tuple.push(f.action_spec())
    })
    return tuple
  }

  action_delays() {
    /*
    In realtime we track the delay observation -> action executed.

    Returns:
      A list per agent of action delays, where action delays are a list where
      the index in the list corresponds to the delay in game loops, the value
      at that index the count over the course of an episode.

    Raises:
      ValueError: If called when not in realtime mode.
    */
    if (!(this._realtime)) {
      throw new Error("ValueError: This method is only supported in realtime mode.")
    }
    return this._action_delays
  }

  _restart() {
    if (this._players.length == 1 && this._players[0].race == 1 && this._maps.length == 1) {
      // Need to support restart for fast-restart of mini-games.
      this._controllers[0].restart()
    } else {
      if (this._controllers.length > 1) {
        Object.keys(this._controllers).map((key) => {
          const c = this._controllers[key]
          return this._parallel.run(c.leave)
        })
      }
      this._create_join()
    }
  }

  reset() {
    // Start a new episode.
    this._episode_steps = 0
    if (this._episode_count) {
      // No need to restart for the first episode.
      this._restart()
    }

    this._episode_count += 1
    let races = []
    const array = this._features[0].requested_races.items().sort()
    Object.keys(array).forEach((key) => {
      const r = array[key]
      races.push(Race(r).name)
    })
    console.log("Starting episode ${this._episode_count}: [${", ".join(races)}] on ${this._map_name}")
    this._metrics.increment_episode()
    this._last_score = Array(this._num_agents.length).fill(0)
    this._state = environment.StepType.FIRST
    if (this._realtime) {
      this._last_step_time = performance.now() * 1000
      this._last_obs_game_loop = null
      this._action_delays = Array(this._num_agents).fill(Array(NUM_ACTION_DELAY_BUCKETS).fill(0)) 
    }

    return this._observe({target_game_loop: 0}) 
  }

  step(actions, step_mul = null) {
    /*
    Apply actions, step the world forward, and return observations.

    Args:
      actions: A list of actions meeting the action spec, one per agent, or a
          list per agent. Using a list allows multiple actions per frame, but
          will still check that they're valid, so disabling
          ensure_available_actions is encouraged.
      step_mul: If specified, use this rather than the environment's default.

    Returns:
      A tuple of TimeStep namedtuples, one per agent.
    */
    if (this._state == environment.StepType.LAST) {
      return this.reset()
    }

    const skip = !(this._ensure_available_actions)
    let temp_actions = []
    zip(this._features, this._obs, actions).forEach((keys) => {
      const [f, o, acts] = keys
      Object.keys(to_list(acts)).forEach((key) => {
        const a = to_list(acts)[key]
        temp_actions.push(f.transform_action({o.observation, a, skip_available: skip}))
      })
    })
    actions = temp_actions

    if (!(this._realtime)) {
      actions = this._apply_action_delays(actions)
    }

    zip(this._controllers, actions).forEach((keys) => {
      const [c,a] = keys
      this._parallel.run((c.actions, sc_pb.RequestAction({actions: a})))
    })

    this._state = environment.StepType.MID
    return this._step(step_mul)
  }

  _step(step_mul = null) {
    const step_mul = step_mul || this._step_mul
    if (step_mul <= 0) {
      throw new Error("ValueError: step_mul should be positive, got ${step_mul}")
    }

    const target_game_loop = this._episode_steps + step_mul
    if (!(this._realtime)) {
      // Send any delayed actions that were scheduled up to the target game loop.
      const current_game_loop = this._send_delayed_actions({
        up_to_game_loop: target_game_loop,
        current_game_loop: this._episode_steps
      })

      this._step_to({
        game_loop: target_game_loop,
        current_game_loop: current_game_loop
      })
    }

    return this._observe({target_game_loop: target_game_loop})
  }

  _apply_action_delays(actions) {
    // Apply action delays to the requested actions, if configured to.
    assert(!(this._realtime))
    const actions_now = []
    zip(actions, this._action_delay_fns, this._delayed_actions).forEach((keys) => {
      const [actions_for_player, delay_fn, delayed_actions] = keys
      let actions_now_for_player = []
      actions_for_player.forEach((action) => {
        if (delay_fn) {
          const delay = delay_fn()
        } else {
          const delay = 1
        }
        if (delay > 1 && Object.keys(action)) { //action.ListFields() //Skip no-ops
          const game_loop = this._episode_steps + delay - 1
          // Randomized delays mean that 2 delay actions can be reversed.
          // Make sure that doesn't happen.
          if (delayed_actions) {
            const game_loop = Math.max(game_loop, delayed_actions[delayed_actions.length - 1].game_loop)
          }
          // Don't send an action this frame.
          delayed_actions.push(_DelayedAction(game_loop, action))
        } else {
          actions_now_for_player.push(action)
        }
      })
      actions_now.push(actions_now_for_player)
    }) 
    return actions_now
  }

  _send_delayed_actions(up_to_game_loop, current_game_loop){
    // Send any delayed actions scheduled for up to the specified game loop.
    assert(!(this._realtime))
    while (true) {
      if (!(any(this._delayed_actions))) {
        return current_game_loop
      }
      let array_temp = []
      Object.keys(this._delayed_actions).forEach((key) => {
        const d = this._delayed_actions[key]
        if (d) {
          array_temp.push(d[0].game_loop)
        }
      })
      const act_game_loop = Math.min(...array_temp)
      if (act_game_loop > up_to_game_loop) {
        return current_game_loop
      }

      this._step_to(act_game_loop, current_game_loop)
      current_game_loop = act_game_loop
      if (this._controllers[0].status_ended) {
         // We haven't observed and may have hit game end.
        return current_game_loop
      }

      let actions = []
      this._delayed_actions.forEach((d) => {
        if (d && d[0].game_loop == current_game_loop) {
          const delayed_action = d.shift()
          actions.push(delayed_action)
        } else {
          actions.push(null)
        }
      })

      zip(this._controllers, actions).forEach((keys) => {
        const [c, a] = keys
        this._parallel.run((c.act, a))
      })
    }
  }

  _step_to(game_loop, current_game_loop) {
    const step_mul = game_loop - current_game_loop
    if (step_mul < 0) {
      throw new Error("ValueError: We should never need to step backwards")
    }
    if (step_mul > 0) {
      with (this._metrics.measure_step_time(step_mul)) {
        if (!(this._controllers[0].status_ended)) {
          // May already have ended.
          this._controllers.forEach((c) => {
            this._parallel.run((c.step, step_mul))            
          })
        }
      }
    }
  }

  _get_observations(target_game_loop) {
    // Transform in the thread so it runs while waiting for other observations.
    function parallel_observe(c, f) {
      const obs = c.observe(target_game_loop)
      const agent_obs = f.transform_obs(obs)
      return obs, agent_obs
    }

    with (this._metrics.measure_observation_time()) {
      zip(this._controllers, this._features).forEach((keys) => {
        const [c, f] = keys
        [this._obs, this._agent_obs] = zip(...this._parallel.run((parallel_observe, c, f)))
      })
    }
    const bucket = []
    const game_loop = this._agent_obs[0].game_loop[0]
    this._obs.forEach((o) => {
      bucket.push(o.player_result)
    })
    if (game_loop < target_game_loop && !(any(bucket))) {
      throw new Error("ValueError: The game didn't advance to the expected game loop.\n"
        "Expected: ${target_game_loop}, got: ${game_loop}")
    } else if (game_loop > target_game_loop && target_game_loop > 0)  {
      console.warn("Received observation ${game_loop - target_game_loop} step(s) late: ${game_loop} rather than ${target_game_loop}")
    }

    if (this._realtime) {
      /*
      Track delays on executed actions.
      Note that this will underestimate e.g. action sent, new observation taken before action executes, action executes, observation taken with action. This is difficult to avoid without changing the SC2 binary - e.g. send the observation game loop with each action, return them in the observation action proto.
      */
      if (this._last_step_time !== null) {
        for (let [i, o] of Object.entries(this._obs)) {
          for (const action of obs.actions) {
            if (action.has("game_loop")) {
              const delay = action.game_loop - this._last_obs_game_loop
              if (delay > 0) {
                const num_slots = this._action_delays[i].length
                delay = Math.min(delay, num_slots - 1) // Cap to num buckets.
                this._action_delays[i][delay] += 1
                break
              }
            }
          }
        }
      }
      this._last_obs_game_loop = game_loop
    }
  }

  _observe(target_game_loop) {
    this._get_observations(target_game_loop)
    // TODO(tewalds): How should we handle more than 2 agents and the case where the episode can end early for some agents?
    const outcome = Array(this._num_agents.length).fill(0)
    const discount = this._discount
    this._obs.forEach((o) => {
      const episode_complete = any(o.player_result)
    })

    if (episode_complete) {
      this._state = environment.StepType.LAST
      discount = 0
      for (let [i, o] of Object.entries(this._obs)) {
        const player_id = o.observation.player_common.player_id
        for (let result of o.player_result) {
          if (result.player_id == player_id) {
            outcome[i] = possible_results.get(result.result, 0)
          }
        }
      }
    }
    let cur_score = []
    if (this._score_index >= 0) {
      // Game score, not win/loss reward.
      this._agent_obs.forEach((o) => {
        cur_score.push(o["score_cumulative"][this._score_index])
      })
      if (this._episode_steps == 0) {
        // First reward is always 0.
        const reward = Array(this._num_agents.length).fill(0)
      } else {
        let reward = []
        zip(cur_score, this._last_score).forEach(([cur, last]) => {
          reward.push(cur - last)
        })
      }
      this._last_score = cur_score
    } else {
      const reward = outcome
    }

    if (this._renderer_human) {
      this._renderer_human.render(this._obs[0])
      const cmd = this._renderer_human.get_actions(this._run_config, this._controllers[0])
      if (cmd == renderer_human.ActionCmd.STEP) {
        return        
      } else if (cmd == renderer_human.ActionCmd.RESTART) {
        this._state = environment.StepType.LAST
      } else if (cmd == renderer_human.ActionCmd.QUIT) {
        throw new Error("KeyboardInterrup: Quit?")
      }
    }

    this._total_steps += this._agent_obs[0].game_loop[0] - this._episode_steps
    this._episode_steps = this._agent_obs[0].game_loop[0]
    if (this._episode_steps >= this._episode_length) {
      this._state = environment.StepType.LAST
      if (this._discount_zero_after_timeout) {
        const discount = 0.0
      }
      if (this._episode_steps >= MAX_STEP_COUNT) {
        console.log("Cut short to avoid SC2's max step count of 2^19=524288.")
      }
    }

    if (this._state == environment.StepType.LAST) {
      if (this._save_replay_episodes > 0 && (this._episode_count % this._save_replay_episodes) == 0) {
        this.save_replay(this._replay_dir, this._replay_prefix)
      }
      let score_val = []
      this._agent_obs.forEach((o) => {
        score_val.push(o["score_cumulative"][0])
      })
      console.log("Episode ${this._episode_count} finished after ${this._episode_steps} game steps.\n"
        "Outcome: ${outcome}, reward: ${reward}, score: ${score_val}")
    }

    function zero_on_first_step(value) {
      if (this._state == environment.StepType.FIRST) {
        return 0.0
      } else {
        return value
      }
    }

    let tuple = []
    zip(reward, this._agent_obs).forEach(([r, o]) => {
      tuple.push(environment.TimeStep({
        step_type: this._state,
        reward: zero_on_first_step(r * this._score_multiplier),
        discount: zero_on_first_step(discount),
        observation: o
      }))
    })
    return tuple
  }

  send_chat_message(messages, broadcast = true) {
    // Useful for logging messages into the replay.
    zip(this._controllers, messages).forEach(([c, messages]) =>{
      if (broadcast) {
        this._parallel.run(c.chat, messages, sc_pb.ActionChat.Broadcast)
      } else {
        this._parallel.run(c.chat, messages, sc_pb.ActionChat.Team)
      }
    })
  }

  save_replay(replay_dir, prefix = null) {
    if (prefix == null) {
      prefix = this._map_name
    }
    replay_path = this._run_config.save_replay(this._controllers[0].save_replay(), replay_dir, prefix)
    console.log("Wrote replay to: ${replay_path}")
    return replay_path
  }

  close() {
    console.log("Environment Close")
    if (this.hasAttribute("_metrics") && this._metrics) {
      this._metrics.close()
      this._metrics = null
    }
    if (this.hasAttribute("_renderer_human") && this._renderer_human) {
      this._renderer_human.close()
      this._renderer_human = null
    }
    // Don't use parallel since it might be broken by an exception.
    if (this.hasAttribute("_controllers") && this._controllers) {
      this._controllers.forEach((c) => {
        c.quit()
      })
      this._controllers = null
    }
    if (this.hasAttribute("_sc2_procs") && this._sc2_procs) {
      this._sc2_procs.forEach((p) => {
        p.close()
      })
      this._sc2_procs = null
    }
    if (this.hasAttribute("_ports") && this._ports) {
      portspicker.return_ports(this._ports)
      this._ports = null
    }
    this._game_info = null
  }
}

function crop_and_deduplicate_names(names) {
  /*
  Crops and de-duplicates the passed names.

  SC2 gets confused in a multi-agent game when agents have the same
  name. We check for name duplication to avoid this, but - SC2 also
  crops player names to a hard character limit, which can again lead
  to duplicate names. To avoid this we unique-ify names if they are
  equivalent after cropping. Ideally SC2 would handle duplicate names,
  making this unnecessary.

  TODO(b/121092563): Fix this in the SC2 binary.

  Args:
    names: List of names.

  Returns:
    De-duplicated names cropped to 32 characters.
  */
  const max_name_length = 32
  // Crop.
  let cropped = []
  Object.keys(names).forEach((key) => {
    const n = names[key]
    cropped.push(n.slice(0,max_name_length))
  })

  // De-duplicate.
  let deduplicated = []
  Object.keys(cropped).forEach((key) => {
    const n = cropped[key]
    name_counts = all_collections_generated_classes.Counter(n)
  }) 

  const name_index = new Defaultdict(1)
  Object.keys(cropped).forEach((key) => {
    const n = cropped[key]
    if (name_counts[n] == 1) {
      deduplicated.push(n)
    } else {
      deduplicated.push("(${name_index[n]}) ${n}")
      name_index[n] += 1
    }
  })

  // Crop again.
  let recropped = []
  Object.keys(deduplicated).forEach((key) => {
    const n = deduplicated[key]
    recropped.push(n.slice(0,max_name_length))
  })
  if (set(recropped).length !== recropped.length) {
    throw new Error("ValueError: Failed to de-duplicate names")
  }
  return recopped
}

module.exports = {
  SC2Env,
  crop_and_deduplicate_names,
}