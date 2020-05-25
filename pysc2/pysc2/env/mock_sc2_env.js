/* Mocking the Starcraft II environment. */

const s2clientprotocol = require('s2clientprotocol')
const path = require('path')
const environment = require(path.resolve(__dirname, 'environment.js'))
const sc2_env = require(path.resolve(__dirname, 'sc2_env.js'))
const features = require(path.resolve(__dirname, '..', 'lib', 'features.js'))
const point = require(path.resolve(__dirname, '..', 'lib', 'point.js'))
const units = require(path.resolve(__dirname, '..', 'lib', 'units.js'))
const dummy_observation = require(path.resolve(__dirname, '..', 'tests', 'dummy_observation.js'))
const np = require(path.resolve(__dirname, '..', 'lib', 'numpy.js'))
const { common_pb } = s2clientprotocol

const DUMMY_MAP_SIZE = point.Point(256, 256)

class _TestEnvironment extends environment.Base {
  /*
   simple generic test environment.

  This class is a lightweight implementation of `environment.Base` that returns
  the same timesteps on every observation call. By default, each returned
  timestep (one per agent) is reward 0., discount 1., and the observations are
  zero `np.ndarrays` of dtype `np.int32` and the shape specified by the
  environment's spec.

  However, the behavior of the `TestEnvironment` can be configured using the
  object's attributes.

  Attributes:
    next_timestep: The `environment.TimeStep`s to return on the next call to
      `step`. When necessary, some fields will be overridden to ensure the
      `step_type` contract.
    episode_length: if the episode length (number of transitions) exceeds
      `episode_length` on a call to `step`, the `step-type` will be set to
      `environment.StepType.LAST`, forcing an end of episode. This allows a
      stub of a production environment to have end_episodes. Will be ignored if
      set to `float('inf')` (the default).
  */
  constructor (num_agents, observation_spec, action_spec) { //eslint-disable-line
    /*
    Initializes the TestEnvironment.

    The `next_observation` is initialized to be reward = 0., discount = 1.,
    and an appropriately sized observation of all zeros. `episode_length` is set
    to `float('inf')`.

    Args:
      num_agents: The number of agents.
      observation_spec: The observation specs for each player.
      action_spec: The action specs for each player.
    */
    this._num_agents = num_agents
    this._observation_spec = observation_spec
    this._action_spec = action_spec
    this._episode_steps = 0
    this.next_timestep = []

    Object.keys(observation_spec.entries()).forEach((key) => {
      const agent_index = key
      const obs_spec = observation_spec.entries()[key]
      this.next_timestep.push(environment.TimeStep({
        step_type: environment.StepType.MID,
        reward: 0.0,
        discount: 1.0,
        observation: this._default_observation(obs_spec, agent_index)
      }))
    })

    this.episode_length = Infinity
  }

  reset() {
    /* Restarts episode and returns `next_observation` with `StepType.FIRST`. */
    this._episode_steps = 0
    return this.step([null] * this._num_agents)
  }

  step(actions, step_mul = null) {
    /* Returns `next_observation` modifying its `step_type` if necessary. */
    step_mul = null // ignored currently
    // del step_mul 

    if (actions.length !== this._num_agents) {
      throw new Error("ValueError: Expected ${this._num_agents} actions, received ${actions.length}.")
    }

    let step_type
    if (this._episode_steps == 0) {
      step_type = environment.StepType.FIRST
    } else if (this._episode_steps >= this.episode_length) {
      step_type = environment.StepType.LAST
    } else {
      step_type = environment.StepType.MID
    }

    const timesteps = []
    Object.keys(this.next_timestep).forEach((key) => {
      const timestep = this.next_timestep[key]
      if (step_type === environment.StepType.FIRST) {
        timesteps.push(timestep._replace({
          step_type,
          reward: 0.0,
          discount: 0.0
        }))
      } else if (step_type === environment.StepType.LAST) {
        timesteps.push(timestep._replace({
          step_type,
          discount: 0.0
        }))
      } else {
        timesteps.push(timestep)
      }
    })

    if (timesteps[0].step_type === environment.StepType.LAST) {
      this._episode_steps = 0
    } else {
      this._episode_steps += 1
    }

    return timesteps
  }

  action_spec() {
    // See base class.
    return this._action_spec
  }

  observation_spec() {
    // See base class.
    return this._observation_spec
  }

  _default_observation(obs_spec, agent_index) {
    // Returns an observation based on the observation spec.
    const observation = {}
    Object.keys(obs_spec.items()).forEach((key) => {
      const spec = obs_spec.items()[key]
      observation[key] = np.zeros({
        shape: spec,
        dytpe: int32
      })
    })
    return observation
  }
}

class SC2TestEnv extends _TestEnvironment {
  /* A TestEnvironment to swap in for `starcraft2.env.sc2_env.SC2Env`.

  Repeatedly returns a mock observation for 10 calls to `step` whereupon it
  sets discount to 0. and changes state to READY_TO_END_EPISODE.

  Example:

  ```
  @mock.patch(
      'starcraft2.env.sc2_env.SC2Env',
      mock_sc2_env.SC2TestEnv)
  def test_method(self):
    env = sc2_env.SC2Env('nonexisting map')  # Really a SC2TestEnv.
    ...
  ```

  See base class for more details. */
  constructor(_only_use_kwargs = null,
    map_name = null,
    players = null,
    agent_interface_format = null,
    discount = 1.0,
    discount_zero_after_timeout = false,
    visualize = false,
    step_mul = null,
    realtime = false,
    save_replay_episodes = 0,
    replay_dir = null,
    game_steps_per_episode = null,
    score_index = null,
    score_multiplier = null,
    random_seed = null,
    disable_fog = false,
    ensure_available_actions = true,
    version = null) {
        /* nitializes an SC2TestEnv.

    Args:
      _only_use_kwargs: Don't pass args, only kwargs.
      map_name: Map name. Ignored.
      players: A list of Agent and Bot instances that specify who will play.
      agent_interface_format: A sequence containing one AgentInterfaceFormat
        per agent, matching the order of agents specified in the players list.
        Or a single AgentInterfaceFormat to be used for all agents.
      discount: Unused.
      discount_zero_after_timeout: Unused.
      visualize: Unused.
      step_mul: Unused.
      realtime: Not supported by the mock environment, throws if set to true.
      save_replay_episodes: Unused.
      replay_dir: Unused.
      game_steps_per_episode: Unused.
      score_index: Unused.
      score_multiplier: Unused.
      random_seed: Unused.
      disable_fog: Unused.
      ensure_available_actions: Whether to throw an exception when an
        unavailable action is passed to step().
      version: Unused.
    Raises:
      ValueError: if args are passed. */
    map_name = null
    discount = null
    discount_zero_after_timeout = null
    visualize = null
    step_mul = null
    save_replay_episodes = null
    replay_dir = null
    game_steps_per_episode = null
    score_index = null
    score_multiplier = null
    random_seed = null
    disable_fog = null
    ensure_available_actions = null
    version = null

    if (_only_use_kwargs) {
      throw Error("ValueError: All arguments must be passed as keyword arguments.")
    }

    if (realtime) {
      throw Error("ValueError: realtime mode is not supported by the mock env.")
    }
    let num_agents
    if (!(players)) {
      num_agents = 1
    } else {
      num_agents = 0
      Object.keys(players).forEach((key) => {
        const p = players[key]
        if (p instanceof sc2_env.Agent) {
          num_agents += 1
        }
      })
    }

    if (agent_interface_format === null) {
      throw Error("ValueError: Please specify agent_interface_format.")
    }

    if (agent_interface_format instanceof sc2_env.AgentInterfaceFormat) {
      agent_interface_format = [agent_interface_format] * num_agents
    }

    if (agent_interface_format.length != num_agents) {
      throw Error("ValueError: The number of entries in agent_interface_format should correspond 1-1 with the number of agents.")
    }

    this._agent_interface_formats = agent_interface_format
    this._features = Object.keys(agent_interface_format).map((key) => {
      const interface_format = agent_interface_format[key]
      return features.Features({ interface_format, map_size: DUMMY_MAP_SIZE })
    })
    super()
    this.num_agents = num_agents
    let tuple1 = []
    Object.keys(this._features).forEach((key) => {
      const f = this._features[key]
      tuple1.push(f.actionspec())
    })
    this.action_spec = tuple1
    let tuple2 = []
    Object.keys(this._features).forEach((key) => {
      const f = this._features[key]
      tuple2.push(f.observation_spec())
    })
    this.observation_spec = tuple2

    this.episode_length = 10
  }

  save_replay() {
    // Does nothing.
  }

  _default_observation(obs_spec, agent_index) {
    // Returns a mock observation from an SC2Env.
    const builder = dummy_observation.Builder(obs_spec).game_loop(0)
    const aif = this._agent_interface_formats[agent_index]
    if (aif.use_feature_units || aif.use_raw_units) {
      const feature_units = [
        dummy_observation.FeatureUnit({
          units.Neutral.LabBot, 
          features.PlayerRelative.NEUTRAL,
          owner: 16,
          pos: common_pb.Point(x = 10, y = 10, z = 0),
          radius:  1.0,
          health: 5,
          health_max: 5,
          is_on_screen: true,
        })
      ]
      builder.feature_units(feature_units)
    }

    const response_observation = builder.build()
    const features_ = this._features[agent_index]
    const observation = features_.transform_obs(response_observation)

    // Add bounding box for the minimap camera in top left of feature screen.
    if ("feature_minimap" in observation) {
      const minimap_camera = observation.feature_minimap.camera
      minimap_camera.fill(0)
      Object.keys(minimap_camera.shape).forEach((key) => {
        const dim = minimap_camera.shape[key]
        const [height, width] = [Math.floor(dim / 2)]
      })
      minimap_camera.slice(0, height).map(i => i.slice(0, width)).fill(1)
    }

    return observation
  }
}

module.exports = {
  _TestEnvironment,
  SC2TestEnv
}
