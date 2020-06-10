const deepdiff = require('deep-diff')
const dir = require('path')
const pythonUtils = require(dir.resolve(__dirname, './pythonUtils.js'))
const { hashCode, len, zip } = pythonUtils

const _ARRAY_PLACEHOLDER = '*'

class ProtoPath {
  // Path to a proto field, from the root of the proto object.
  constructor(path) {
    /*
    Initializer.

    Args:
      path: Tuple of attribute names / array indices on the path to a field.
    */
    this._path = path
  }

  get_field(proto) {
    // Returns field at this proto path, in the specified proto.
    let value = proto
    this._path.forEach((k) => {
      if (Number.isInteger(k)) {
        value = value[k]
      } else {
        value = value[k]
      }
    })
    return value
  }

  with_anonymous_array_indices() {
    // Path with array indices replaced with '*' so that they compare equal
    this._path.map((t) => {
      if (Number.isInteger(t)) {
        return ProtoPath(_ARRAY_PLACEHOLDER)
      }
      return ProtoPath(t)
    })
  }

  get path() {
    return this._path
  }

  __lt__(other) {
    zip(this._path, other.path).map(([k1, k2]) => {
      if (k1 < k2) {
        return true
      }
      return false
    })
    return len(this._path) < len(other.path)
  }

  // def __getitem__(self, item):
  //   return self._path.__getitem__(item)

  __len__() {
    return len(this._path)
  }

  __eq__(o) {
    for (let i = 0; i < len(this._path); i++) {
      if (this._path[i] !== o.path[i]) {
        return false
      }
    }
    return true
  }

  __hash__() {
    return hashCode(this._path)
  }

  __repr__() {
    let result = ""
    this._path.forEach((k) => {
      if (Number.isInteger(k) || k == _ARRAY_PLACEHOLDER) {
        result += `[${k}]`
      } else {
        if (result) {
          result += '.' + k
        }
        result += "" + k
      }
    })
    return result
  }
}

class ProtoDiffs {
  // Summary of diffs between two protos.
  __init__(proto_a, proto_b, changed, added, removed) {
    /*
    Initializer.

    Args:
      proto_a: First proto.
      proto_b: Second proto.
      changed: List of paths to attributes which changed between the two.
      added: List of paths to attributes added from proto_a -> proto_b.
      removed: List of paths to attributes removed from proto_a -> proto_b.
    */
    this._proto_a = proto_a
    this._proto_b = proto_b
    this._changed = changed.sort()
    this._added = added.sort()
    this._removed = removed.sort()
  }

  get proto_a() {
    return this._proto_a
  }

  get proto_b() {
    return this._proto_b
  }

  get changed() {
    return this._changed
  }

  get added() {
    return this._added
  }

  get removed() {
    return this._removed
  }

  all_diffs() {
    return this.chagned + this.added + this.removed
  }

  report(differencers = null, truncate_to = 0) {
    /*
    Returns a string report of diffs.

    Additions and removals are identified by proto path. Changes in value are
    reported as path: old_value -> new_value by default, though this can be
    customized via the differencers argument.

    Args:
      differencers: Iterable of callable(path, proto_a, proto_b) -> str or None
        If a string is returned it is used to represent the diff between
        path.get_field(proto_a) and path.get_field(proto_b), and no further
        differencers are invoked. If None is returned by all differencers, the
        default string diff is used.
      truncate_to: Number of characters to truncate diff output values to.
        Zero, the default, means no truncation.
    */
    const results = []
    this._added.forEach((a) => {
      results.push(`Added ${a}.`)
    })

    this._removed.forEach((r) => {
      results.push(`Removed ${r}.`)
    })

    for (const key_c in this._changed) { // eslint-disable-line
      const c = this._changed[key_c]
      let result = null
      if (differencers) {
        for (const key_d in differencers) { // eslint-disable-line
          const d = differencers[key_d]
          result = d(c, this._proto_a, this._proto_b)
          if (result) {
            break
          }
        }
      }

      if (!result) {
        result = `${_truncate(c.get_field(this._proto_a), truncate_to)} -> ${_truncate(c.get_field(this._proto_b), truncate_to)}`
      } else {
        result = _truncate(result, truncate_to)
      }

      results.push(`Changed ${c}: ${result}`)
    }

    if (results) {
      return `\n ${results}`
    }
    return 'No diffs.'
  }

  __repr__() {
    return `Changed: ${this._changed}, added: ${this._added}, removed: ${this._removed}`
  }
}

function _truncate(val, truncate_to) {
  const string_val = String(val)
  if (truncate_to && string_val.length > truncate_to) {
    return string_val.slice(0, Math.max(truncate_to - 3, 0)) + '...'
  }
  return string_val
}

function _dict_path_to_proto_path(dict_path) {
  dict_path = dict_path.slice(5, dict_path.length - 1) // strip off 'root[...]'
  const keys = dict_path.split('][') // tokenize
  keys.forEach((k) => {
    // key or idx
    if (k[0] == "'") {
      return ProtoPath(k.slice(1, k.length - 1))
    }
    return ProtoPath(parseInt(k, 10))
  })
}

function compute_diff(proto_a, proto_b) {
  /*
  Returns `ProtoDiff` of two protos, else None if no diffs.

  Args:
    proto_a: First of the two protos to compare.
    proto_b: Second of the two protos to compare.
  */
}

module.exports = {
  ProtoPath,
  ProtoDiffs,
  _truncate,
  _dict_path_to_proto_path,
  compute_diff,
}
