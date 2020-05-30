const os = require('os') //eslint-disable-line
const path = require('path') //eslint-disable-line
/*
  The library and base Map for defining full maps.

  To define your own map just import this library and subclass Map. It will be
  automatically registered for creation by `get`.

    class NewMap(lib.Map):
      prefix = "map_dir"
      filename = "map_name"
      players = 3

  You can build a hierarchy of classes to make your definitions less verbose.

  To use a map, either import the map module and instantiate the map directly, or
  import the maps lib and use `get`. Using `get` from this lib will work, but only
  if you've imported the map module somewhere.
*/

class DuplicateMapError extends Error {
  constructor(msg) {
    super(msg)
    this.name = 'DuplicateMapError'
  }
}

class NoMapError extends Error {
  constructor(msg) {
    super(msg)
    this.name = 'NoMapError'
  }
}

class Map {
  /*
  Base map object to configure a map. To define a map just subclass this.

  Attributes:
    name: The name of the map/class.
    path: Where to find the map file.
    directory: Directory for the map
    filename: Actual filename. You can skip the ".SC2Map" file ending.
    download: Where to download the map.
    game_steps_per_episode: Game steps per episode, independent of the step_mul.
        0 (default) means no limit.
    step_mul: How many game steps per agent step?
    score_index: Which score to give for this map. -1 means the win/loss
        reward. >=0 is the index into score_cumulative.
    score_multiplier: A score multiplier to allow make small scores good.
    players: Max number of players for this map.
    battle_net: The map name on battle.net, if it exists.
  */
  static get directory() {
    return ''
  }

  static get filename() {
    return null
  }

  static get download() {
    return null
  }

  static get game_steps_per_episode() {
    return 0
  }

  static get step_mul() {
    return 8
  }

  static get score_index() {
    return -1
  }

  static get score_multiplier() {
    return 1
  }

  static get players() {
    return null
  }

  static get battle_net() {
    return null
  }

  get path() {
    //The full path to the map file: directory, filename and file ending.//
    if (this.filename) {
      let map_path = path.join(this.directory, this.filename)
      if (map_path.slice(map_path.length - 7, map_path.length) !== '.SC2Map') {
        map_path += '.SC2Map'
      }
      return map_path
    }
    return ''
  }

  date(run_config) {
    //Return the map data.//
    try {
      return run_config.map_data(this.path, this.players)
    } catch (err) {
      if (this.download && err.message.match('filename')) {
        console.info(`Error reading map '${this.name}' from: ${this.path}`)
      }
      throw err
    }
  }

  get name() {
    return this.constructor.name
  }

  toString() {
    
  }
}

module.exports = {
  DuplicateMapError,
  Map,
  NoMapError,
}
