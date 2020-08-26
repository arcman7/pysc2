// Test that multiplayer works independently of the SC2Env.

const path = require('path')
const s2clientprotocol = require('s2clientprotocol')
const maps = require(path.resolve(__dirname, '..', 'maps'))
const run_configs = require(path.resolve(__dirname, '..', 'run_configs'))
const point = require(path.resolve(__dirname, '..', 'lib', 'point.js'))
const portspicker = require(path.resolve(__dirname, '..', 'lib', 'portspicker.js'))
const run_parallel = require(path.resolve(__dirname, '..', 'lib', 'run_parallel.js'))
const utils = require(path.resolve(__dirname, './utils.js'))
const sc_common = s2clientprotocol.common_pb
const sc_pb = s2clientprotocol.sc2api_pb

const pythonUtils = require(path.resolve(__dirname, '..', 'lib', 'pythonUtils.js'))
const { assert } = pythonUtils

function print_stage(stage) {
  console.info(`${stage}`.center(80, '-'))
}

async function TestMultiplayer() {
  console.log('TestMultiplayer')
  const testCase = new utils.TestCase()

  async function test_multi_player() {
    console.log('=== test_multi_player ===')
    testCase.setUp()
    const players = 2
    const run_config = run_configs.get()
    const parallel = new run_parallel.RunParallel()
    const map_inst = maps.get('Simple64')

    const screen_size_px = new point.Point(64, 64)
    const minimap_size_px = new point.Point(32, 32)
    const interfacee = new sc_pb.InterfaceOptions()
    const resol = new sc_pb.SpatialCameraSetup()
    resol.setResolution()
    resol.setMinimapResolution()
    interfacee.setFeatureLayer(resol)

    screen_size_px.assign_to(interfacee.getFeatureLayer().getResolution())
    minimap_size_px.assign_to(interfacee.getFeatureLayer().getMinimapResolution())

    // Reserve a whole bunch of ports for the weird multiplayer implementation.
    const ports = await portspicker.pick_unused_ports(players * 2)
    console.info(`Valid Ports: ${ports}`)

    // Actually launch the game processes.
    print_stage('start')
    const sc2_procs = []
    for (let i = 0; i < players; i += 1) {
      sc2_procs.push(run_config.start({
        extra_ports: ports,
        want_rgb: false
      }))
    }
    const controllers = []
    sc2_procs.forEach((p) => {
      controllers.push(p.controller)
    })

    try {
      // Save the maps so they can access it.
      const map_path = path.basename(map_inst.path)
      print_stage('save_map')
      controllers.forEach((c) => { //Skip parallel due to a race condition on Windows.
        c.save_map(map_path, map_inst.data(run_config))
      })

      // Create the create request.
      const create = new sc_pb.RequestCreateGame()
      const localmap = new sc_pb.LocalMap()
      localmap.setMapPath(map_path)
      create.setLocalMap(localmap)
      for (let i = 0; i < players; i += 1) {
        const playersetup = new sc_pb.PlayerSetup()
        playersetup.setType(sc_pb.PlayerType.PARTICIPANT)
        create.addPlayerSetup(playersetup)
      }

      // Create the join request.
      const join = new sc_pb.RequestJoinGame()
      join.setRace(sc_common.Race.RANDOM)
      join.setOptions(interfacee)
      join.setSharedPort(0)
      const serverport = new sc_pb.PortSet()
      serverport.setGamePort(ports[0])
      serverport.setBasePort(ports[1])
      join.setServerPorts(serverport)
      const clientport = new sc_pb.PortSet()
      clientport.setGamePort(ports[2])
      clientport.setBasePort(ports[3])
      join.addClientPorts(clientport)

      // Play a few short games.
      for (let i = 0; i < 2; i += 1) { //2 episodes
        // Create and Join
        print_stage('create')
        await controllers[0].create_game(create)
        print_stage('join')
        let joins = []
        controllers.forEach((c) => {
          joins.push()
        })
          await parallel.run([c.join_game, join]) //eslint-disable-line

        print_stage('run')
        for (let game_loop = 1; game_loop < 10; game_loop += 1) { //steps per episode
          // Step the game
          let csteps = []
          controllers.forEach((c) => {
            csteps.push(c.step)
          })
          await parallel.run(csteps)

          //Observe
          const obs 
        }
      }
      print_stage('leave')
      
    }
    finally {
      print_stage('quit')
      // Done, shut down. Don't depend on parallel since it might be broken.
      controllers.forEach((c) => {
        await c.quit()
      })
      sc2_procs.forEach((p) => {
        await p.quit()
      })
      await portspicker.return_ports(ports)
    } 

    await testCase.tearDown()
  }
  test_multi_player()
}

TestMultiplayer()
