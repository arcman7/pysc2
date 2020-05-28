class RunParallel {
  //Run all funcs in parallel.//

  constructor(timeout = null) {
    this._timeout = timeout
    this._executor = null
    this._workers = 0
  }

  run(funcs) {
    /*Run a set of functions in parallel, returning their results.

    Make sure any function you pass exits with a reasonable timeout. If it
    doesn't return within the timeout or the result is ignored due an exception
    in a separate thread it will continue to stick around until it finishes,
    including blocking process exit.

    Args:
      funcs: An iterable of functions or iterable of args to functools.partial.

    Returns:
      A list of return values with the values matching the order in funcs.

    Raises:
      Propagates the first exception encountered in one of the functions.
    */
    funcs = funcs.map((f) => typeof(f) === 'function' ? f : partial(...f))
    if (funcs.length === 1) {
      return [funcs[0]]
    }
    if (funcs.length > this._workers) {
      this.shutdown()
      this._workers = funcs.length
      this._executor = 
    }
  }
}

module.exports = {
  RunParallel,
}