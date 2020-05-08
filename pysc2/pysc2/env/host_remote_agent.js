//Creates SC2 processes and games for remote agents to connect into.

const path = require('path')
const maps = require(path.resolve(__dirname, '..', 'maps'))
const run_configs = require(path.resolve(__dirname, '..', 'run_configs'))
const protspicker = require(path.resolve(__dirname, '..', 'lib', 'protspicker.js'))
const protocol = require(path.resolve(__dirname, '..', 'lib', 'protocol.js'))
const remote_controller = require(path.resolve(__dirname, '..', 'lib', 'remote_controller.js'))
/*
from s2clientprotocol import common_pb2 as sc_common
from s2clientprotocol import sc2api_pb2 as sc_pb
*/

class VsAgent extends object {

  constructor() {
    this._num_agents = 2
    this._run_config = run_configs.get()
    this._processes = []
    this._controllers = []
    this._saved_maps = set()
    // Reserve LAN ports.
    this._lan_ports = portspicker.pick_unused_ports(this._num_agents * 2)
    // Start SC2 processes.
    for (var i = 1; i < this._num_agents.length; i++) {
      const process = this._run_config.start(extra_ports = this._lan_ports)
      this._processes.push(process)
      this._controllers.push(process.controller)
    }
  }

  __enter__() {
    return this
  }

  __exit__(exception_type, exception_value, traceback) {
    this.close()
  }

  __del__() {
    this.close()
  }

  create_game(map_name) {
    /*
    Create a game for the agents to join.

    Args:
      map_name: The map to use.
    */
    this._reconnect()

    const map_inst = maps.get(map_name)
    const map_data = map_inst.data(this._run_config)
    if (!(this._saved_maps.has(map_name))) {
      Object.keys(this._controllers).forEach((key) => {
        const controller = this._controllers[key]
        controller.save_map(map_inst.path, map_data)
      })
      this._saved_maps.add(map_name)
    }

    // Form the create game message.
    const create = sc_pb.RequestCreateGame(
      local_map = sc_pb.LocalMap(map_path = map_inst.path),
      disable_fog = false)

    // Set up for two agents.
    for (var i = 1; i < this._num_agents.length; i ++) {
      create.player_setup.add(type = sc_pb.Participant)
    }

    // Create the game.
    this._controllers[0].create_game(create)
    this._disconnect()
  }

  _disconnect() {
    Object.keys(this._controllers).forEach((key) => {
      const c = this._controllers[key]
      c.close()
    })
    this._controllers = []
  }

  _reconnect() {
    if (!(this._controllers)) {
      this._controllers = [
        Object.keys(this._processes).forEach((key) => {
          const p = this._processes[key]
          remote_controller.RemoteController(p.host, p.port, p, ...arguments)
        })]
    }
  }

  save_replay(replay_dir, replay_name) {
    this._reconnect()
    return this._run_config.save_replay(
      this._controllers[0].save_replay(), replay_dir, replay_name)
  }

  get hosts() {
    // The hosts that the remote agents should connect to.
    Object.keys(this._processes).forEach((key) => {
      const process = this._processes[key]
      return [process.host]
    })
  }

  get host_ports() {
    // The WebSocket ports that the remote agents should connect to.
    Object.keys(this._processes).forEach((key) => {
      const process = this._processes[key]
      return [process.port]
    })
  }

  get lan_prots() {
    // The LAN ports which the remote agents should specify when joining
    return this._lan_ports
  }

  close() {
    // Shutdown and free all resources.
    try {
      this._reconnect(timeout_seconds = 1)
      Object.keys(this._controllers).forEach((key) => {
        const controller = this._controllers[key]
        controller.quit()
      })
    }

    catch (remote_controller.ConnectError, protocol.ConnectionError) {
      {}
    }

    this._controllers = []

    Object.keys(this._processes).forEach((key) => {
      const process = this._processes[key]
      process.close()
    })

    this._processes = []

    portspicker.return_ports(this._lan_ports)
    this._lan_ports = []
  }
}

class VsBot extends object {
  /*
  Host a remote agent vs bot game.

  Starts a single SC2 process. Call create_game, then have the agent connect
  to host_port.

  The agent should leave the game once it has finished, then another game can
  be created. Note that failure of the agent to leave prior to creating
  the next game will lead to SC2 crashing.

  Best used as a context manager for simple and timely resource release.

  **NOTE THAT** currently re-connecting to the same SC2 process is flaky.
  If you experience difficulties the workaround is to only create one game
  per instantiation of VsBot.
  */
  constructor() {
    // Start the SC2 process.
    this._run_config = run_configs.get()
    this._processes = this._run_config.start()
    this._controller = this._process.controller
    this._saved_maps = set()
  }
  __enter__() {
    return this
  }

  __exit__(exception_type, exception_value, traceback) {
    this.close()
  }

  __del__() {
    this.close()
  }

  create_game(
    map_name,
    bot_difficulty = sc_pb.VeryEasy,
    bot_race = sc_common.Random,
    bot_first = false) {
    /*
    Create a game, one remote agent vs the specified bot.

    Args:
      map_name: The map to use.
      bot_difficulty: The difficulty of the bot to play against.
      bot_race: The race for the bot.
      bot_first: Whether the bot should be player 1 (else is player 2).
    */
    this._reconnect()
    this._controller.ping()

    // Form the create game message.
    const map_inst = maps.get(map_name)
    const map_data = map_inst.data(this._run_config)
    if (!(this._saved_maps.has(map_name))) {
      this._controller.save_map(map_inst.path, map_data)
      this._saved_maps.add(map_name)
    }

    const create = sc_pb.RequestCreateGame(
      local_map = sc_pb.LocalMap(map_path = map_inst.path, map_data = map_data), disable_fog = false)
    
    // Set up for one bot, one agent.
    if(!(bot_first)) {
      create.player_setup.add(type = sc_pb.Participant)
    }

    create.player_setup.add(
      type = sc_pb.Computer, race = bot_race, difficulty = bot_difficulty)

    if (bot_first) {
      create.player_setup.add(type = sc_pb.Participant)
    }

    // Create the game.
    this._controller.create_game(create)
    this._disconnect()
  }

  _disconnect() {
    this._controller.close()
    this._controller = null
  }

  _reconnect() {
    if(!(this._controller)) {
      this._controller = remote_controller.RemoteController(
        this._process.host, this._process.port, this._process, ...arguments)
    }
  }

  save_replay(replay_dir, replay_name) {
    this._reconnect()
    return this._run_config.save_replay(
      this._controller.save_replay(), replay_dir, replay_name)
  }

  get host() {
    // The host that the remote agent should connect to.
    return this._process.port
  }

  get host_port() {
    // The WebSocket port that the remote agent should connect to.
    return this._process.port
  }

  close() {
    // Shutdown and free all resources.
    if (hasattr("_process") && this._process !== null) {
      try {
        this._reconnect(timeout_seconds = 1)
        this._controller.quit()
      }
      catch (remote_controller.ConnectionError, protocol.ConnectionError) {
        {}
      }
      this._controller = null
      this._process.close()
      this._process = null
    }
  }
}

module.exports = {
  VsAgent,
  VsBot
}