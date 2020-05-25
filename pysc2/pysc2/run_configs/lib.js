const path = require('path') //eslint-disable-line
const gfile = require(path.resolve(__dirname, '..', 'lib', 'gfile.js'))
const pythonUtils = require(path.resolve(__dirname, '..', 'lib', 'pythonUtils.js'))

const { namedtuple, ValueError } = pythonUtils

const Version = namedtuple('Version', ['game_version', 'build_version', 'data_version', 'binary'])

function version_dict(versions) {
  const dict = {}
  versions.forEach((ver) => {
    dict[ver.game_version] = ver
  })
  return dict
}

// https://github.com/Blizzard/s2client-proto/blob/master/buildinfo/versions.json
// Generate with bin/gen_versions.py
const VERSIONS = version_dict([
  Version("3.13.0", 52910, "8D9FEF2E1CF7C6C9CBE4FBCA830DDE1C", null),
  Version("3.14.0", 53644, "CA275C4D6E213ED30F80BACCDFEDB1F5", null),
  Version("3.15.0", 54518, "BBF619CCDCC80905350F34C2AF0AB4F6", null),
  Version("3.15.1", 54518, "6EB25E687F8637457538F4B005950A5E", null),
  Version("3.16.0", 55505, "60718A7CA50D0DF42987A30CF87BCB80", null),
  Version("3.16.1", 55958, "5BD7C31B44525DAB46E64C4602A81DC2", null),
  Version("3.17.0", 56787, "DFD1F6607F2CF19CB4E1C996B2563D9B", null),
  Version("3.17.1", 56787, "3F2FCED08798D83B873B5543BEFA6C4B", null),
  Version("3.17.2", 56787, "C690FC543082D35EA0AAA876B8362BEA", null),
  Version("3.18.0", 57507, "1659EF34997DA3470FF84A14431E3A86", null),
  Version("3.19.0", 58400, "2B06AEE58017A7DF2A3D452D733F1019", null),
  Version("3.19.1", 58400, "D9B568472880CC4719D1B698C0D86984", null),
  Version("4.0.0", 59587, "9B4FD995C61664831192B7DA46F8C1A1", null),
  Version("4.0.2", 59587, "B43D9EE00A363DAFAD46914E3E4AF362", null),
  Version("4.1.0", 60196, "1B8ACAB0C663D5510941A9871B3E9FBE", null),
  Version("4.1.1", 60321, "5C021D8A549F4A776EE9E9C1748FFBBC", null),
  Version("4.1.2", 60321, "33D9FE28909573253B7FC352CE7AEA40", null),
  Version("4.1.3", 60321, "F486693E00B2CD305B39E0AB254623EB", null),
  Version("4.1.4", 60321, "2E2A3F6E0BAFE5AC659C4D39F13A938C", null),
  Version("4.2.0", 62347, "C0C0E9D37FCDBC437CE386C6BE2D1F93", null),
  Version("4.2.1", 62848, "29BBAC5AFF364B6101B661DB468E3A37", null),
  Version("4.2.2", 63454, "3CB54C86777E78557C984AB1CF3494A0", null),
  Version("4.2.3", 63454, "5E3A8B21E41B987E05EE4917AAD68C69", null),
  Version("4.2.4", 63454, "7C51BC7B0841EACD3535E6FA6FF2116B", null),
  Version("4.3.0", 64469, "C92B3E9683D5A59E08FC011F4BE167FF", null),
  Version("4.3.1", 65094, "E5A21037AA7A25C03AC441515F4E0644", null),
  Version("4.3.2", 65384, "B6D73C85DFB70F5D01DEABB2517BF11C", null),
  Version("4.4.0", 65895, "BF41339C22AE2EDEBEEADC8C75028F7D", null),
  Version("4.4.1", 66668, "C094081D274A39219061182DBFD7840F", null),
  Version("4.5.0", 67188, "2ACF84A7ECBB536F51FC3F734EC3019F", null),
  Version("4.5.1", 67188, "6D239173B8712461E6A7C644A5539369", null),
  Version("4.6.0", 67926, "7DE59231CBF06F1ECE9A25A27964D4AE", null),
  Version("4.6.1", 67926, "BEA99B4A8E7B41E62ADC06D194801BAB", null),
  Version("4.6.2", 69232, "B3E14058F1083913B80C20993AC965DB", null),
  Version("4.7.0", 70154, "8E216E34BC61ABDE16A59A672ACB0F3B", null),
  Version("4.7.1", 70154, "94596A85191583AD2EBFAE28C5D532DB", null),
  Version("4.8.0", 71061, "760581629FC458A1937A05ED8388725B", null),
  Version("4.8.1", 71523, "FCAF3F050B7C0CC7ADCF551B61B9B91E", null),
  Version("4.8.2", 71663, "FE90C92716FC6F8F04B74268EC369FA5", null),
  Version("4.8.3", 72282, "0F14399BBD0BA528355FF4A8211F845B", null),
  Version("4.8.4", 73286, "CD040C0675FD986ED37A4CA3C88C8EB5", null),
  Version("4.8.5", 73559, "B2465E73AED597C74D0844112D582595", null),
  Version("4.8.6", 73620, "AA18FEAD6573C79EF707DF44ABF1BE61", null),
  Version("4.9.0", 74071, "70C74A2DCA8A0D8E7AE8647CAC68ACCA", null),
  Version("4.9.1", 74456, "218CB2271D4E2FA083470D30B1A05F02", null),
  Version("4.9.2", 74741, "614480EF79264B5BD084E57F912172FF", null),
  Version("4.9.3", 75025, "C305368C63621480462F8F516FB64374", null),
  Version("4.10.0", 75689, "B89B5D6FA7CBF6452E721311BFBC6CB2", null),
  Version("4.10.1", 75800, "DDFFF9EC4A171459A4F371C6CC189554", null),
])

class RunConfig {
  //Base class for different run configs.//
  constructor(replay_dir, data_dir, tmp_dir, version, cwd = null, env = null) {
    /*
    Initialize the runconfig with the various directories needed.

    Args:
      replay_dir: Where to find replays. Might not be accessible to SC2.
      data_dir: Where SC2 should find the data and battle.net cache.
      tmp_dir: The temporary directory. None is system default.
      version: The game version to run, a string.
      cwd: Where to set the current working directory.
      env: What to pass as the environment variables.

    */
    this.replay_dir = replay_dir
    this.data_dir = data_dir
    this.tmp_dir = tmp_dir
    this.cwd = cwd
    this.env = env
    this.version = this._get_version(version)
  }

  map_data(map_name, players = null) {
    //Return the map data for a map by name or path.//
    const map_names = [map_name]
    if (players) {
      map_names.push(path.join(
        path.dirname(map_name),
        `(${players})${path.basename(map_name)}`,
      ))
    }
    for (let i = 0; i < map_names.length; i++) {
      const name = map_names[i]
      const fPath = path.join(this.data_dir, 'Maps', name)
      if (gfile.Exists(fPath)) {
        return gfile.Open(path /*, { encoding: 'utf8' }*/)
      }
    }
    throw new ValueError(`Map ${map_name}  not found.`)
  }

  abs_replay_path(replay_path) {
    //Return the absolute path to the replay, outside the sandbox.//
    return path.join(this.replay_dir, replay_path)
  }

  replay_data(replay_path) {
    //Return the replay data given a path to the replay.//
    return gfile.Open(this.abs_replay_path(replay_path) /*, { encoding: 'utf8' }*/)
  }

  * replay_paths(replay_dir) {
    //A generator yielding the full path to the replays under `replay_dir`.//
    replay_dir = this.abs_replay_path(replay_dir)
    if (replay_dir.toLowerCase().split('.').pop().match('sc2replay')) {
      yield replay_dir
    } else {
      const fList = gfile.ListDir(replay_dir)
      for (let i = 0; i < fList.length; i++) {
        const f = fList[i]
        if (f.toLowerCase().split('.').pop().match('sc2replay')) {
          yield path.join(replay_dir, f)
        }
      }
    }
  }
}

module.exports = {
  RunConfig,
  VERSIONS,
}
