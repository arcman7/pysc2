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
    const interfacee = new sc_pb.InterfaceOptions(new sc_pb.SpatialCameraSetup())
    screen_size_px.assign_to(interfacee.getFeatureLayer().getResolution())
    minimap_size_px.assign_to(interfacee.getFeatureLayer().getMinimapResolution())

    // Reserve a whole bunch of ports for the weird multiplayer implementation.
    const ports = await portspicker.pick_unused_ports(players * 2)
    console.info(`Valid Ports: ${ports}`)

    // Actually launch the game processes.
    console.log('start')
    



    await testCase.tearDown()
  }
  await test_multi_player()
}

TestMultiplayer()
