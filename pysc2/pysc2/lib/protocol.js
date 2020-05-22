const path = require('path') //eslint-disable-line
// const net = require('net') //eslint-disable-line
const Enum = require('python-enum') //eslint-disable-line
const s2clientprotocol = require('s2clientprotocol') //eslint-disable-line
const websocket = require('ws') //eslint-disable-line
const flags = require('flags') //eslint-disable-line
const { performance } = require('perf_hooks') //eslint-disable-line
const stopwatch = require(path.resolve(__dirname, 'stopwatch.js'))
const pythonUtils = require(path.resolve(__dirname, './pythonUtils.js'))


//Protocol library to make communication easy.//

const { sc2api_pb } = s2clientprotocol
const sc_pb = sc2api_pb
// const { socket } = net
const { assert, withPython } = pythonUtils

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
class StarcraftProtocol {
  constructor(sock) {
    this._status = Status.LAUNCHED
    this._sock = sock
    this._port = sock.address().port
    this._count = 1
    // apply @decoraters
    this.read = sw.decorate(this.read.bind(this))
    this.write = sw.decorate(this.write.bind(this))
  }

  get status() {
    return this._status
  }

  next(n) {
    this._count = n + 1
    return this._count
  }

  close() {
    if (this._sock) {
      this._sock.terminate()
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
    req.setId(this.next(this._count))
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

  _packet_str(packet) { //eslint-disable-line
    //Return a string form of this packet.//
    const max_lines = FLAGS.sc2_verbose_protocol
    const packet_str = String(packet).trim()
    if (max_lines <= 0) {
      return packet_str
    }
    let lines = packet_str.split('\n')
    const line_count = lines.length
    lines = lines.slice(0, max_lines + 1).map((line) => line.slice(0, MAX_WIDTH))
    if (line_count > max_lines + 1) { // +1 to prefer the last line to skipped msg.
      lines.push(`***** ${line_count - max_lines} lines skipped *****`)
    }
    return lines.join('\n')
  }

  _log(s) { //eslint-disable-line
    const args = []
    for (let i = 1; i < arguments.length; i++) {
      args.push(arguments[i]) //eslint-disable-line
    }
    process.stderr.write(s + '\n' + args)
    // process.stderr.clearScreenDown() // js equivalent of flush, unsure if we need it though
  }

  _read() {
    //Actually read the response and parse it, returning a Response.//
    let response_str
    withPython(sw('read_response'), () => {
      try { //eslint-disable-line
        response_str = this._sock.recv()
      } catch (err) {
        /* TODO: Handling of different error types
            raise ConnectionError("Connection already closed. SC2 probably crashed. "
              "Check the error log.")
            except websocket.WebSocketTimeoutException:
              raise ConnectionError("Websocket timed out.")
            except socket.error as e:
              raise ConnectionError("Socket error: %s" % e)
        */
        throw err
      }
    })
    if (!response_str) {
      throw new ProtocolError('Got and empty response from SC2.')
    }
    let response
    withPython(sw('parse_response'), () => {
      response = sc_pb.Response.deserializeBinary(response_str)
    })
    return response
  }

  _write(request) {
    //Actually serialize and write the request.//
    let request_str
    withPython(sw('serialize_request'), () => {
      request_str = request.serializeBinary()
    })
    withPython(sw('write_request'), () => {
      try { //eslint-disable-line
        this._sock.send(request_str)
      } catch (err) {
        /* TODO: Handling of different error types
            raise ConnectionError("Connection already closed. SC2 probably crashed. "
              "Check the error log.")
            except websocket.WebSocketTimeoutException:
              raise ConnectionError("Websocket timed out.")
            except socket.error as e:
              raise ConnectionError("Socket error: %s" % e)
        */
        throw err
      }
    })
  }
}

module.exports = {
  ConnectionError,
  ProtocolError,
  StarcraftProtocol,
  Status,
}
