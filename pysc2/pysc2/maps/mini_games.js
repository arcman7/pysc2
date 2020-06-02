const path = require('path') //eslint-disable-line
const lib = require(path.resolve(__dirname, './lib.js'))

class MiniGame extends lib.Map {}
MiniGame.directory = 'MiniGame'
MiniGame.download = 'https://github.com/deepmind/pysc2#get-the-maps'
MiniGame.players = 1
MiniGame.score_index = 0
MiniGame.game_steps_per_episode = 0
MiniGame.step_mul = 8
MiniGame._subclasses = []
lib.Map._subclasses.push(MiniGame)

const mini_games = [
  'BuildMarines', // 900s
  'CollectMineralsAndGas', // 420s
  'CollectMineralShards', // 120s
  'DefeatRoaches', // 120s
  'DefeatZerglingsAndBanelings', // 120s
  'FindAndDefeatZerglings', // 180s
  'MoveToBeacon', // 120s
]

const modExports = {
  MiniGame,
  mini_games,
}

mini_games.forEach((name) => {
  modExports[name] = class extends MiniGame {}
  modExports[name].filename = name
  lib.Map._subclasses.push(modExports[name])
  MiniGame._subclasses.push(modExports[name])
})

module.exports = modExports
