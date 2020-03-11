
def next(self): 
  if self._index < len(self._fields):
    result = self[self._fields[self._index]]
    self._index += 1
    return result
  else:
    self._index = 0
    raise StopIteration

def sett(self, key, val):
  self._store[key] = val

def init(self, kwargs):
  print('init: ', kwargs)
  self._store = {}
  for key in kwargs:
    self._store[key] = kwargs[key]
    exec('self.{} = {}'.format(key, kwargs[key]))
    print('key: ', key, 'val: ', kwargs[key])

classes = {}

def namedtuple(name, fields):
  # https://l.messenger.com/l.php?u=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F7642434%2Fis-there-a-way-to-implement-methods-like-len-or-eq-as-classmethods&h=AT3I1fBIKVr63uLN5xVoHE3ykeBPsREqMzVM7xyjbf_VD8g82OqHD1nyuBmYjBXmU1sSw4irrFPsjjm6cSENbPitUXFgn8-1ZiwZtMcTS1f0WsRwiI5f6kK8Edo3alCDdrLYpg9h
  defs = {
    '_index': 0,
    '_fields': fields,
    '__init__': init,
    '_store': {},

    '__next__': lambda self: next(self),

    '__iter__': lambda self: self,

    '__len__': lambda self: len(self._fields),

    '__getitem__': lambda self, key: self._store[key],

    '__setitem__': lambda self, key, val: sett(self, key, val)
  }
  for name in fields:
    defs[name] = None

  # https://stackoverflow.com/questions/4858298/python-3-class-template-function-that-returns-a-parameterized-class
  thing = type(name, (object,), defs)
  classes[name] = thing
  return lambda **kwargs: classes[name](kwargs)

# Point = namedtuple('Point', ['x', 'y'])
# p1 = Point(x= 1, y= 2 )
