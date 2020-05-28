/*
A Starcraft II environment for playing LAN games vs humans.

Check pysc2/bin/play_vs_agent.py for documentation.
*/
const s2clientprotocol = require('s2clientprotocol')
const net = require('net')

const path = require('path')
const run_config = require(path.resolve(__dirname, '..'))
const sc2_env = require(path.resolve(__dirname, 'sc2_env.js'))
const features = require(path.resolve(__dirname, '..', 'lib', 'feature.js'))
const run_parallel = require(path.resolve(__dirname, '..', 'lib', 'run_parallel.js'))
const all_collections_generated_classes = require(path.resolve(__dirname, 'all_collections_generated_classes.js'))
const { sc2api_pb } = s2clientprotocol
const sc_pb = sc2api_pb

class Addr extends all_collections_generated_classes.Addr {
  constructor() {
    super()
    let ip
    if (this.ip.includes(":")) {
      ip = console.log("[", this.ip, "]")
    } else {
      ip = this.ip
    }
    return console.log(ip, ":", this.port)
  }
}

function deamon_thread(target) {
  // t = threading.Thread(target=target, args=args)
  const t = threading.Thread(target = target, args = args)
  t.deamon = true
  t.start()
  return t
}

function udp_server(addr) {
  let family
  if (addr.ip.indexOf(":") !== -1) {
    family = socket.AF_INET6
  } else {
    family = socket.AF_INET
  }
  let sock = socket.socket(family, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
  sock.bind(addr)
  return sock
}

function tcp_server(tcp_addr, settings) {
  //Start up the tcp server, send the settings.

}

module.exports = {
  Addr,
  deamon_thread,
  tcp_server,

}
