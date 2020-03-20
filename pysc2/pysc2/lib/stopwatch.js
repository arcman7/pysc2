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
import { PerformanceObserver, performance } from 'perf_hooks'

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

  __enter__() {
    this._start = performance.now() * 0.001
  }

  __exit() {
    this._sw.add(this._sw.pop(), (performance.now() * 0.001) - this._start)
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
    console.log(s)
  }
}
