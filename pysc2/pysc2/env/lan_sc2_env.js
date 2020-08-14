const net = require('net') //eslint-disable-line
const dgram = require('dgram') //eslint-disable-line
const s2clientprotocol = require('s2clientprotocol') //eslint-disable-line
const path = require('path') //eslint-disable-line
const run_config = require(path.resolve(__dirname, '..')) //eslint-disable-line
const sc2_env = require(path.resolve(__dirname, 'sc2_env.js')) //eslint-disable-line
const features = require(path.resolve(__dirname, '..', 'lib', 'feature.js')) //eslint-disable-line
const pythonUtils = require(path.resolve(__dirname, '..', 'lib', 'pythonUtils.js')) //eslint-disable-line

/*
A Starcraft II environment for playing LAN games vs humans.

Check pysc2/bin/play_vs_agent.py for documentation.
*/

const { namedtuple } = pythonUtils
const { sc2api_pb } = s2clientprotocol
const sc_pb = sc2api_pb

class Addr extends namedtuple("Addr", ["ip", "port"]) {
  toString() {
    const ip = this.ip.includes(':') ? `[${this.ip}]` : this.ip
    return `${ip}:${this.port}`
  }
}

// function deamon_thread(target) {
//   // t = threading.Thread(target=target, args=args)
//   const t = threading.Thread(target = target, args = args)
//   t.deamon = true
//   t.start()
//   return t
// }

//returns promise that resolves in a bound udp socket
function udp_server(addr) {
  let sock
  if (addr.ip.includes(':')) {
    sock = dgram.createSocket('udp4')
  } else {
    sock = dgram.createSocket('udp6')
  }
  const prom = new Promise((resolve) => {
    sock.bind(addr, resolve)
  })
  return prom
}

const window = this
async function tcp_server(tcp_addr, settings) {
  //Start up the tcp server, send the settings.

  // node determines whether or not to use ipv4 vs ipv6
  // based on the format of the address passed in the
  // options to the listen method
  const sock = net.createServer((c) => {
    // 'connection' listener.
    console.log('client connected')
    c.on('end', () => {
      console.log('client disconnected')
    })
    // c.write('hello\r\n')
    // c.pipe(c)
  })
  const prom = new Promise((resolve) => {
    sock.listen({
      port: tcp_addr.port,
      host: tcp_addr.ip,
    }, (connection) => {
      console.log('from sock.listen callback')
      console.log(connection)
      window.test = connection
      resolve(connection)
    })
  })
  const conn = await prom
  const { address } = conn._socket.address()
  console.log(`Accepted connection from $${address}`)
  // Send map_data independently
  await write_tcp(conn, settings['map_data'])
  const send_settings = {}
  Object.keys(settings).forEach((k) => {
    if (k === 'map_data') {
      return
    }
    send_settings[k] = settings[k]
  })
  console.log(`settings: ${send_settings}`)
  write_tcp(conn, JSON.stringify(send_settings))
  return conn
}

function tcp_client(tcp_addr) {
  //Connect to the tcp server, and return the settings.//
  
}

module.exports = {
  Addr,
  // deamon_thread,
  udp_server,
  tcp_server,
  tcp_client
}
