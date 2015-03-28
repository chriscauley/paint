# Settings loader file.

import os, sys, glob, re, socket

pwd = os.path.dirname(__file__)
# This if fucking ugly!
sys.path.append(os.path.join(pwd,'..'))
sys.path.append(os.path.join(pwd,'..','..'))
sys.path.append(os.path.join(pwd,'..','..','..'))

# Open and compile each file
for f in ['00-base.py','10-apps.py']:
  exec(compile(open(os.path.join(pwd,f)).read(), f, 'exec'), globals(), locals())

machine_name = re.sub('[^A-z0-9._]', '_', socket.gethostname())

# machine name is local stuff in repository
# private should not be kept in the repository
for f in ['%s.py'%machine_name,"private.py"]:
  try:
    exec(compile(open(os.path.join(pwd,f)).read(), f, 'exec'), globals(), locals())
  except IOError:
    print "Optional settings are missing. We looked here: %s"%os.path.join(pwd,f)
