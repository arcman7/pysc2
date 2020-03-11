def namedtuple(fields):
  fields.append("_index")
  fields.append("_store")

  class thing(object):
    _fields = fields
    __slots__ = _fields

    def __new__(cls, **kwargs):
      cls._index = 0
      cls._store = {}
      for name, val in kwargs.items():
        print('name: ', name, ' = ', val)
        cls._store[name] = val
      return cls

    def __next__(self):
      # minus two because _fields is used for iterating
      if self._index < len(self._fields) - 2:
        result = self._store[self._fields[self._index]]
        self._index += 1
        return result
      else:
        self._index = 0
        raise StopIteration

    def __iter__(self):
      return self

    def __len__(self):
      return len(self._fields)

    def __getitem__(self, key):
      return self._store[key]

  return thing

class Point(namedtuple(["x", "y"])):
    def __init__(self, x, y):
      print('init: ')
      print(x, y)
      self.x = x
      self.y = y

p1 = Point(x= 1, y= 2)


print('p1: ')
print(p1)
print(p1.x, p1.y)

print(p1.x == 1)


# print('p2:')
# print(p2)
# p2 = Point(2, 3)

# for i in p1:
#   print(i)

#import my_collections