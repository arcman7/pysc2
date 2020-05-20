const path = require('path') //eslint-disable-line
const Enum = require('python-enum') //eslint-disable-line
const s2clientprotocol = require('s2clientprotocol') //eslint-disable-line
const websocket = require('ws') //eslint-disable-line
const flags = require('flags') //eslint-disable-line
const { performance } = require('perf_hooks')
const stopwatch = require(path.resolve(__dirname, 'stopwatch.js'))
const pythonUtils = require(path.resolve(__dirname, './pythonUtils.js'))



// mimic python strip
if(typeof(String.prototype.strip) === "undefined")
{
    String.prototype.trim = function() 
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

//Protocol library to make communication easy.//

const { sc2api_pb } = s2clientprotocol
const sc_pb = sc2api_pb
const { assert } = pythonUtils

flags.defineInteger('sc2_verbose_protocol', 0, `
  Print the communication packets with SC2. 0 disables.
  -1 means all. >0 will print that many lines per 
  'packet. 20 is a good starting value.`
) //eslint-disable-line

const FLAGS = flags.FLAGS

const sw = stopwatch.sw

// Create a python version of the Status enum in the proto.
const Status = Enum.Enum('Status', sc_pb.Status)

const MAX_WIDTH = Number(process.env.COLUMNS) || 200 // Get your TTY width.


class ConnectionError extends Error {
  //Failed to read/write a message, details in the error string.//
  constructor(msg) {
    super(msg)
    this.name = 'ConnectionError'
  }
}
class ProtocolError extends Error {
  constructor(msg) {
    super(msg)
    this.name = 'ProtocolError'
  }
}
// function catch_websocket_connection_errors() {
//   //A context manager that translates websocket errors into ConnectionError.//

//   /* not sure we need this in javascript */
// }
// function makeRangeIterator(start = 0, end = Infinity, step = 1) {
//   let nextIndex = start;
//   let iterationCount = 0;

//   const rangeIterator = {
//     next: function() {
//       let result;
//       if (nextIndex < end) {
//         result = { value: nextIndex, done: false }
//         nextIndex += step;
//         iterationCount++;
//         return result;
//       }
//       return { value: iterationCount, done: true }
//     }
//   };
//   return rangeIterator;
// }
class StarcraftProtocol {
  constructor(sock) {
    this._status = Status.LAUNCHED
    this._sock = sock
    this._port = sock.sock.getpeername()[1]
    this._count = 1
    // javascript only set up
    this.read = sw.decorate(this.read.bind(this))
    this.write = sw.decorate(this.write.bind(this))
  }

  get status() {
    return this._status
  }

  get count() {
    return this._count
  }

  set count(val) {
    this._count = val
  }

  close() {
    if (this._sock) {
      this._sock.close()
      this._sock = null
    }
    this._status = Status.QUIT
  }

  read() {
    //Read a Response, do some validation, and return it.//
    let start
    if (FLAGS.sc2_verbose_protocol) {
      this._log(`-------------- [${this._port}] Reading response --------------`)
      // performance.now() => measured in milliseconds.
      start = performance.now() * 1000
    }
    const response = this._read()
    if (FLAGS.sc2_verbose_protocol) {
      this.log(`-------------- [${this._port}] Read ${response.getResponseCase()} in ${performance.now() * 1000 - start} msec --------------\n${this._packet_str(response)}`)
    }
    if (!response.getStatus()) {
      throw new ProtocolError('Got an incomplete response without a status')
    }
    const prev_status = this._status
    this._status = Status(response.getStatus)
    if (response.getError()) {
      const err_str = `Error in RPC response (likely a bug).\n Prev status: ${prev_status}, new status: ${this._status} \n ${response.getError()}`
      this._log(err_str)
      throw new ProtocolError(err_str)
    }
    return response
  }

  write(request) {
    //Write a Request.//
    if (FLAGS.sc2_verbose_protocol) {
      this._log(`-------------- [${this._port}] Writing request: ${request.getResponseCase()} --------------\n${this._packet_str(request)}`)
    }
    this._write(request)
  }

  send_req(request) {
    //Write a pre-filled Request and return the Response.//
    this.write(request)
    return this.read()
  }

  send(kwargs) {
    /*
    Create and send a specific request, and return the response.

    For example: send(ping=sc_pb.RequestPing()) => sc_pb.ResponsePing

    Args:
      **kwargs: A single kwarg with the name and value to fill in to Request.

    Returns:
      The Response corresponding to your request.
    Raises:
      ConnectionError: if it gets a different response.
    */
    const names = Object.keys(kwargs)
    assert(names.length === 1, 'Must make a single request')
    let name = names[0]
    const req = new sc_pb.Request(kwargs[name])
    req.setId(this._count)
    let res
    try {
      res = this.send_req(req)
    } catch (err) {
      throw new ConnectionError(`Error during ${name}: Got a response with a different id`)
    }
    const isList = Array.isArray(kwargs[name])
    name = name[0].toUpperCase() + name.slice(1, name.length)
    // proto getters: getFoo, getFooList
    return res[`get${name + isList ? 'List' : ''}`]()
  }

  _packet_str(packet) {
    //Return a string form of this packet.//
    const max_lines = FLAGS.sc2_verbose_protocol
    const packet_str = String(packet)
  }

  //eslint-disable-next-line
  _log(s) {
    process.stderr.write(s + '\n')
  }
}

module.exports = {
  StarcraftProtocol,
  Status,
}
