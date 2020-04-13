import os
import fnmatch
foldname = '/Users/jihan/Desktop/Project/pysc2/pysc2/pysc2/tests'
for file in os.listdir(foldname):
	if fnmatch.fnmatch(file, '*.py'):
		print(file)