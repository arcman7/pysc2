
// Copyright 2017 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/*A stopwatch to check how much time is used by bits of code.*/

import os from 'os'
// import Thread from 'threading-js' //'.../node_modules/threading-js/Thread.js'
import { performance } from 'perf_hooks'
import pythonUtils from './pythonUtils'

const { DefaultDict, withPython, zip } = pythonUtils
String = pythonUtils.String //eslint-disable-line

class Stat {
  static get _fields() { return ["num", "min", "max", "sum", "sum_sq"] }

  constructor() {
    this.reset()
  }

  reset() {
    this.num = 0
    this.min = 1000000000
    this.max = 0
    this.sum = 0
    this.sum_sq = 0
  }

  add(val) {
    this.num += 1
    if (this.min > val) {
      this.min = val
    }
    if (this.max < val) {
      this.max = val
    }
    this.sum += val
    this.sum_eq += val ** 2
  }

  get avg() {
    if (this.num === 0) {
      return 0
    }
    return this.sum / this.num
  }

  get dev() {
    //Standard deviation.//
    if (this.num === 0) {
      return 0
    }
    return Math.sqrt(Math.max(0, (this.sum_sq / this.num) - ((this.sum / this.num) ** 2)))
  }

  merge(other) {
    this.num += other.num
    this.min = Math.min(this.min, other.min)
    this.max = Math.max(this.max, other.max)
    this.sum += other.sum
    this.sum_sq += other.sum_sq
  }

  static build(summation, average, standard_deviation, minimum, maximum, number) {
    const stat = new this.prototype.constructor()
    if (number > 0) {
      stat.num = number
      stat.min = minimum
      stat.max = maximum
      stat.sum = summation
      stat.sum_sq = number * ((standard_deviation ** 2) + (average ** 2))
    }
    return stat
  }

  static parse() {
    const s = this.toString()
    if (s === 'num=0') {
      return new this.prototype.constructor()
    } //eslint-disable-next-line
    const parts = s.split(', ').map((p) => {
      return Number(p.split(':')[1])
    })
    return Stat.build(...parts)
  }

  toString() {
    if (this.num === 0) {
      return 'num=0'
    }
    return `sum: ${this.sum.toFixed(4)}, avg: ${this.avg.toFixed(4)}, dev: ${this.dev.toFixed(4)}, min: ${this.min.toFixed(4)}, max: ${this.max.toFixed(4)}, num: ${this.num}`
  }
}

class StopWatchContext {
  //Time an individual call.//
  static get _fields() { return ['_sw', '_start'] }

  constructor(stopwatch, name) {
    this._sw = stopwatch
    this._sw.push(name)
  }
  // performance.now() => measured in milliseconds.
  __enter__() {
    this._start = performance.now() * 1000
  }

  __exit() {
    this._sw.add(this._sw.pop(), (performance.now() * 1000) - this._start)
  }
}

class TracingStopWatchContext extends StopWatchContext {
  //Time an individual call, but also output all the enter/exit calls.//

  __enter__() {
    super.__enter__()
    this._log(`>>> ${this._sw.cur_stack()}`)
  }

  __exit__() {
    this._log(`<<< ${this._sw.cur_stack()} ${(performance.now() - this._start).toFixed(6)} secs`)
    super.__exit()
  }

  //eslint-disable-next-line
  _log(s) {
    process.stderr.write(s)
  }
}


class FakeStopWatchContext {
  constructor() {} //eslint-disable-line

  __enter__() {} //eslint-disable-line

  __exit__() {} //eslint-disable-line
}

const fake_context = FakeStopWatchContext()

let StopWatchRef

class StopWatch {
  /*A context manager that tracks call count and latency, and other stats.

  Usage:
      sw = stopwatch.Stopwatch()
      with sw("foo"):
        foo()
      with sw("bar"):
        bar()
      @sw.decorate
      def func():
        pass
      func()
      print(sw)
  */
  static get _fields() { return ['_times', '_local', '_factory'] }
  static _make(kwargs) {
    return new this.prototype.constructor(kwargs);
  }
  constructor(enabled = true, trace = false) {
    this._times = new DefaultDict(Stat)
    // we dont need to declare anything as being local to the context
    // of the thread since by default node js worker threads are local
    this._local = {}//threading.local()
    if (trace) {
      this.trace()
    } else if (enabled) {
      this.enable()
    } else {
      this.disable()
    }
    const self = this
    function stopwatchProxy(name) {
      return self.__call__(name)
    }
    ['disable', 'enable', 'trace', 'custom', 'decorate', 'push', 'pop', 'curr_stack', 'clear', 'add', 'merge', 'str', 'toString'].forEach((methodName) => {
      stopwatchProxy[methodName] = this[methodName].bind(this)
    })
    stopwatchProxy.times = this.times
    stopwatchProxy.parse = this.constructor.parse
    stopwatchProxy.instanceRef = this
    return stopwatchProxy
  }

  disable() {
    this._factory = () => fake_context
  }

  enable() {
    this._factory = name => new StopWatchContext(this, name)
  }

  trace() {
    this._factory = name => new TracingStopWatchContext(this, name)
  }

  custom(factory) {
    this._factory = factory
  }

  __call__(name) {
    return this._factory(name)
  }

  decorate(name_or_func) {
    /*Decorate a function/method to check its timings.

    To use the function's name:
      @sw.decorate
      def func():
        pass

    To name it explicitly:
      @sw.decorate("name")
      def random_func_name():
        pass

    Args:
      name_or_func: the name or the function to decorate.

    Returns:
      If a name is passed, returns this as a decorator, otherwise returns the
      decorated function.
    */
    if (process.env['SC2_NO_STOPWATCH']) {
      return typeof (name_or_func) === 'function' ? name_or_func : func => func
    }
    const self = this
    function decorator(name, func) {
      function _stopwatch() {
        return withPython(self.__call__(name), () => {
          func(arguments) //eslint-disable-line
        })
      }
      return _stopwatch
    }
    if (typeof (name_or_func) === 'function') {
      return decorator(name_or_func.name, name_or_func)
    }
    return func => decorator(name_or_func, func)
  }
  push(name) {
    try {
      this._local.stack.push(name)
    } catch (err) {
      this._local.stack = [name]
    }
  }
  pop() {
    const stack = this._local.stack
    const ret = stack.join('.')
    stack.pop()
    return ret
  }
  curr_stack() {
    return this._local.stack.join('.')
  }
  clear() {
    this._times = new DefaultDict(Stat)// this._times.clear()
  }
  add(name, duration) {
    this._times[name].add(duration)
  }
  get times() {
    return this._times
  }
  merge(other) {
    let value
    Object.keys(other.times).forEach((key) => {
      value = other[key]
      this._times[key].merge(value)
    })
  }
  static parse(s) {
    //Parse the output below to create a new StopWatch.//
    const stopwatch = new StopWatchRef()
    s.splitlines().forEach((line) => {
      if (line.trim()) {
        const parts = line.split('')
        const name = parts[0]
        if (name !== '%') { // ie not the header line
          const rest = parts.slice(2, parts.length).map(v => Number(v))
          stopwatch.times[parts[0]].merge(Stat.build(...rest))
        }
      }
    })
    return stopwatch
  }

  str(threshold = 0.1) {
    //Return a string representation of the timings.//
    if (!this._times) {
      return ''
    }
    let cur
    const total = Object.keys(this._times).reduce((acc, key) => {
      cur = this._times[key]
      return !(key.includes('.')) ? cur.sum + acc : 0
    }, 0)
    const table = [["", "% total", "sum", "avg", "dev", "min", "max", "num"]]
    let percent
    let v
    Object.keys(this._times).sort().forEach((key) => {
      v = this._times[key]
      percent = (100 * v.sum) / (total || 1)
      if (percent > threshold) {
        table.push([
          key,
          percent.toFixed(2),
          v.sum.toFixed(4),
          v.avg.toFixed(4),
          v.dev.toFixed(4),
          v.min.toFixed(4),
          v.max.toFixed(4),
          String(v.num)
        ])
      }
    })
    const col_widths = table.map((row) => {//eslint-disable-line
      return Math.max(...row.map((colStr => colStr.length)))
    })
    let out = ''
    table.forEach((row) => { //eslint-disable-next-line
      out += ' ' + row[0].ljust(col_widths[0]) + ' '
      out += zip(row.slice(1, row.length), col_widths.slice(1, col_widths.length))
        .join(' ')
      out += '\n'
    })
    return out
  }

  toString() {
    return this.str()
  }
}
StopWatchRef = StopWatch

// Global stopwatch is disabled by default to not incur the performance hit if
// it's not wanted.
const sw = StopWatch(false)

export default {
  Stat,
  StopWatchContext,
  TracingStopWatchContext,
  FakeStopWatchContext,
  fake_context,
  StopWatch,
  StopWatchRef,
  sw,
}
