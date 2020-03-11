
# # https://stackoverflow.com/questions/4858298/python-3-class-template-function-that-returns-a-parameterized-class

# # The type function has a 3-argument version which dynamically constructs a new class. Pass the name, bases and a dict containing the attributes and methods of the class.

# # In your case:

# # def class_factory(x):
# #     return type("C", (A,), {"p": x})

# # import my_collections as mc
# classes = {}
# # class iluvgarbage(type):
#   # def __new__(cls, **kwargs):
#   # def __new__(cls):
#   # # def __new__(cls, name, dct):
#   #   print('meta iluvgarbage new:')
#   #   x = cls
#   #   _fields = []
#   #   for key in kwargs:
#   #     _fields.append(key)

#   #   _fields.append('_index')
#   #   slots = _fields   
#   #   # bases = (object,)
#   #   # x = super().__new__(cls, name, bases, dct)
#   #   x._fields = _fields
#   #   x.__slots__ = slots
#   #   x._index = 0
#   #   return x
# class iluvgarbage(type):
#   def __init__(self, **kwargs):
#     pass
#   def __next__(self):
#     if self._index < len(self._fields) - 1:
#       result = self[self._fields[self._index]]
#       self._index += 1
#       return result
#     else:
#       self._index = 0
#       raise StopIteration

#   def __iter__(self):
#     return self

#   def __len__(self):
#     return len(self._fields)

#   def __getitem__(self, key):
#     print('meta inside getitem, key: ', key)
#     return getattr(self, key)

# def namedtuple(class_name, fields):
#   defs = {}
#   defs['_index'] = 0
#   for name in fields:
#     defs[name] = None
#   # iluvgarbage(class_name, defs)
#   return type(class_name, (object,), defs)
  
#   # classes[class_name] = type(class_name, (object,), defs)
# # pointproto = namedtuple("Point",["x", "y"])
# # class Point(namedtuple("Point",["x", "y"])):
# # class Point(protopoint):
# class Point(object, metaclass=iluvgarbage):
#     def __init__(self, **kwargs):
#       print('init: ')
#       print(**kwargs)
#       # print(x, y)
#       # self.x = x
#       # self.y = y
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


# defs = {
#   '_index': 0,
#   # '__slots__': fields,
#   '_fields': fields,
#   '__init__': init,
#   '_store': {},

#   '__next__': lambda self: next(self),

#   '__iter__': lambda self: self,

#   '__len__': lambda self: len(self._fields),

#   '__getitem__': lambda self, key: self._store[key],
#   # '__getitem__': lambda self, key: getattr(self._store, key),

#   # '__setitem__': lambda self, key, val: setattr(self._store, key, val)
#   '__setitem__': lambda self, key, val: sett(self, key, val)
# }
# for name in fields:
#   defs[name] = None

# thing = type(name, (object,), defs)
# Meta = type('Meta', (type, ), {
#     '_index': 0,
#     # '__slots__': fields,
#     # '_fields': fields,
#     # '__init__': init,
#     '_store': {},

#     '__next__': lambda self: next(self),

#     '__iter__': lambda self: self,

#     '__len__': lambda self: len(self._fields),

#     '__getitem__': lambda self, key: self._store[key],
#     # '__getitem__': lambda self, key: getattr(self._store, key),

#     # '__setitem__': lambda self, key, val: setattr(self._store, key, val)
#     '__setitem__': lambda self, key, val: sett(self, key, val)
# })

classes = {}
def namedtuple(name, fields):
  defs = {
    '_index': 0,
    # '__slots__': fields,
    '_fields': fields,
    '__init__': init,
    '_store': {},

    '__next__': lambda self: next(self),

    '__iter__': lambda self: self,

    '__len__': lambda self: len(self._fields),

    '__getitem__': lambda self, key: self._store[key],
    # '__getitem__': lambda self, key: getattr(self._store, key),

    # '__setitem__': lambda self, key, val: setattr(self._store, key, val)
    '__setitem__': lambda self, key, val: sett(self, key, val)
  }
  for name in fields:
    defs[name] = None

  thing = type(name, (object,), defs)
  classes[name] = thing
  return lambda **kwargs: classes[name](kwargs)

Point = namedtuple('Point', ['x', 'y'])
Point.__init__ 
p1 = Point(x= 1, y= 2 )


print('p1: ')
print(p1)
print(p1.x, p1.y)

# print(p1.x == 1)

p2 = Point(x=2, y=3)
print('p2:')
print(p2)

# for i in p1:
#   print(i)

# import my_collections as mc