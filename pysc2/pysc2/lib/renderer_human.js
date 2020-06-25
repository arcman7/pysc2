const { spawn } = require('child_process') //eslint-disable-line
const path = require('path') //eslint-disable-line
const http = require('http') //eslint-disable-line
const url = require('url') // eslint-disable-line
const gfile = require(path.resolve(__dirname, './gfile.js'))
// const portspicker = require(path.resolve(__dirname, './portspicker.js'))

const args = ['chrome.exe', '-incognito', '--new-window', 'http://127.0.0.1/']


class HumanRenderer {
  constructor(wsPort, httpPort) {
    this.wsPort = wsPort
    this.httpPort = httpPort
    this.args = args
    this.browserFilePath = '/human_renderer/browser.js'
    const fullUrl = this.args.pop() + this.browserFilePath + '?port=' + wsPort
    this.args.push(fullUrl)
    //await portspicker.pick_unused_ports(2)
  }

  async setUp() {
    await this.hostJSScript()
  }

  hostJSScript() {
    this.httpServer = http.createServer(function (request, response) {
      const reqPath = url.parse(request.url, true).pathname;

      if (request.method === 'GET') {
        if (reqPath === this.browserFilePath) {
          response.writeHead(200, { 'Content-Type': 'application/javascript' })
          const data = gfile.Open(path.resolve(__dirname, 'human_renderer', 'browser.js'), { encoding: 'utf8' })
          response.end(data, 'utf-8')
        } else {
          response.end(404)
        }
      }
    })
  }

  launchChrome() {
    this._proc = spawn(this.args[0], this.args)
  }
}

module.exports = {
  HumanRenderer,
}
