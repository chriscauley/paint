babel main/static/js/paint/tools.js \
      main/static/js/paint/image.js \
      main/static/js/paint/action.js \
      main/static/js/paint/storage.js \
      main/static/js/hueShiftCanvas.js \
      main/static/js/paint/debug.js > .build/paint.js
cat main/static/tags/*.tag > .build/paint.tag
cp main/static/js/app.js .build/
lessc main/static/less/base.less > .build/paint.css
