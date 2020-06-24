const { spawn } = require('child_process') //eslint-disable-line
const path = require('path') //eslint-disable-line
// const portspicker = require(path.resolve(__dirname, './portspicker.js'))

const args = ['chrome.exe', '-incognito', '--new-window', 'http://127.0.0.1/']


class HumanRenderer {
  constructor(port) {
    this.port = port
    this.args = args
    const fullUrl = this.args.pop() + port
    this.args.push(fullUrl)
  }

  launchChrome() {
    this._proc = spawn(this.args[0], this.args)
  }
}

module.exports = {
  HumanRenderer,
}
