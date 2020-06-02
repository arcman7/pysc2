const path = require('path') //eslint-disable-line
const lib = require(path.resolve(__dirname, './lib.js'))

class Melee extends lib.Map {}
Melee.directory = "Melee"
Melee.download = "https://github.com/Blizzard/s2client-proto#map-packs"
Melee.players = 2
Melee.game_steps_per_episode = 16 * 60 * 30 // 30 minute limit.
Melee._subclasses = []
lib.Map._subclasses.push(Melee)

const melee_maps = [
  // 'Empty128',  # Not really playable, but may be useful in the future.
  'Flat32',
  'Flat48',
  'Flat64',
  'Flat96',
  'Flat128',
  'Simple64',
  'Simple96',
  'Simple128',
]

const modExports = {
  Melee,
  melee_maps,
}

melee_maps.forEach((name) => {
  modExports[name] = class extends Melee {}
  modExports[name].filename = name
  lib.Map._subclasses.push(modExports[name])
  Melee._subclasses.push(modExports[name])
})

module.exports = modExports
