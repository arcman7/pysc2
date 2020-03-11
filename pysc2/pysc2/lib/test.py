import actions

# def validate(param):
#   if not isinstance(param, actions.ActionSpace):
#     print(param == actions.ActionSpace.FEATURES)
#     print ('type param:')
#     print(type(param))
#     print('value : ', param)
#     raise ValueError("action_space must be of type ActionSpace.")
#   else:
#     print('LGTM')


# validate(actions.ActionSpace.FEATURES)
# def iteritems(d, **kw):
#     return iter(d.items(**kw))

# class meta_af(type):
#   def __iter__(cls):
#     return iter(cls.__name__)

# class Rect(metaclass=meta_af):
class Rect(object):
  _fields = ["t", "l", "b", "r"]
  __slots__ = ("t", "l", "b", "r")

  # def __new__(cls, fields):
  #   print('cls:')
  #   print(cls._fields)
  #   print('fields:')
  #   print(fields)
  #   return cls
  # def __init__(self, *kwargs): 
  #   print('kwargs: ', kwargs)
  #   print('type: ', type(kwargs)) # prints out tuple
  # def __init__(self, t, l, b, r):
  def __init__(self):
  # def __init__(self, **kwargs):
    # print('Rect init: ', kwargs)
    print('Rect init: ')
    # for name,val in kwargs:
    #   self[name] = val
    # self.t = t
    # self.l = l
    # self.b = b
    # self.r = r

  def __len__(self):
    return len(self._fields)

#   def _replace(self, **kwds):
#     # result = self._make(map(kwds.pop, self._fields, self))
#     print(kwds)
#     result = Rect(self.t, self.l, self.b, self.r)
#     for field in kwds:
#       setattr(result, field, kwds[field])
#     return result

#   def __reduce__(self):
#     # return self.__class__, tuple(self)
#     return self.__class__, (self.t, self.l, self.b, self.r)

  # def __len__(self):
  #   return len(self._fields)

# a = Rect(1,2,3,4)
def __new__(cls, **kwargs):
  print('inside redefined new')
  print(kwargs)

# Rect.__new__ = __new__
# a = Rect(t = 1, l = 2, b = 3, r = 4)
a = Rect()

# a._replace(t=0)



# class defaultdict(dict):
#   def __init__(self, *args, **kwargs):
#     if 'default' in kwargs:
#       self.default = kwargs['default']
#       del kwargs['default']
#     else:
#       self.default = None
#     dict.__init__(self, *args, **kwargs)
#   def __repr__(self):
#     return 'defaultdict(%s, %s)' % (self.default, dict.__repr__(self))
#   def __missing__(self, key):
#     if self.default:
#       return self.default(key)
#     else:
#       raise KeyError(key)
#   def __getitem__(self, key):
#     try:
#       return dict.__getitem__(self, key)
#     except KeyError:
#       return self.__missing__(key)


