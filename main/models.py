from django.db import models
from django.contrib.auth.models import User

import json

class Image(models.Model):
  user = models.ForeignKey(User)
  data = models.TextField()
  def __unicode__(self):
    try:
      return json.loads(self.data)['name']
    except (ValueError,KeyError):
      return "Bad Data"
