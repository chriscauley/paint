import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

SECRET_KEY = '8d&j_3zjc^4!)+3_s0!waya72jhx8j=3iryhexz=uq)9t)vbcs'

DEBUG = TEMPLATE_DEBUG = False

ALLOWED_HOSTS = []

MIDDLEWARE_CLASSES = (
  'django.contrib.sessions.middleware.SessionMiddleware',
  'django.middleware.common.CommonMiddleware',
  'django.middleware.csrf.CsrfViewMiddleware',
  'django.contrib.auth.middleware.AuthenticationMiddleware',
  'django.contrib.messages.middleware.MessageMiddleware',
  'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
  'django.contrib.auth.context_processors.auth',
  'django.core.context_processors.debug',
  'django.core.context_processors.i18n',
  'django.core.context_processors.media',
  'django.core.context_processors.static',
  'django.core.context_processors.tz',
  'django.core.context_processors.request',
  'django.contrib.messages.context_processors.messages'
  #'social.apps.django_app.context_processors.backends',
  #'social.apps.django_app.context_processors.login_redirect',
)

AUTHENTICATION_BACKENDS = (
  #'social.backends.google.GoogleOAuth2',
  #'social.backends.twitter.TwitterOAuth',
  'main.backends.EmailOrUsernameModelBackend',
  'django.contrib.auth.backends.ModelBackend',
)

# Above comments are useful for social auth. Requires these keys in a private file
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = ""
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = ""

SOCIAL_AUTH_TWITTER_SECRET = ""
SOCIAL_AUTH_TWITTER_KEY = ""

ROOT_URLCONF = 'main.urls'

WSGI_APPLICATION = 'main.wsgi.application'

DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
  }
}


LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True = True = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, '../.static')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, '../.media')
LOGIN_URL = '/auth/login/'
LOGIN_REDIRECT_URL = "/"

STATICFILES_FINDERS = (
  'django.contrib.staticfiles.finders.FileSystemFinder',
  'django.contrib.staticfiles.finders.AppDirectoriesFinder',
  # other finders..
  'compressor.finders.CompressorFinder',
)

FAVICON = '/static/favicon.ico'
