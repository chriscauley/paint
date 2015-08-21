from django.conf import settings

import os

def _settings(request):
  return {
    'DEBUG': settings.DEBUG,
    'GOOGLE_CLIENT_ID': getattr(settings,'GOOGLE_CLIENT_ID',''),
    'GOOGLE_APP_ID': getattr(settings,'GOOGLE_APP_ID',''),
    'GOOGLE_DEVELOPER_KEY': getattr(settings,'GOOGLE_DEVELOPER_KEY',''),
  }

def nav(request):
  """
  nav should be a list of dictionaries like { 'name':str, 'url':str }
  "/" should be added after the for loop since s.startswith("/") is always true
  """
  nav = [
  ]
  for n in nav:
    if request.path.startswith(n['url']):
      n['current'] = True
  nav.insert(0,{'name': 'Home', 'url': '/', 'current': request.path == "/",})

  return {
    'nav': nav,
  }
