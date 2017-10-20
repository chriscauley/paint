var riot = require('gulp-riot');
var gulp = require('gulp');
var concat = require("gulp-concat");
var less = require('gulp-less');
var sourcemaps = require("gulp-sourcemaps");
var through = require('through2');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var babel = require('gulp-babel');

var PROJECT_NAME = "paint";

var JS_FILES = [
  ".dist/_tags.js",
  "src/app.js",
  "src/image.js",
  "src/action.js",
  "src/storage.js",
  "src/debug.js",
];

gulp.task('build-js', ['build-tag'], function () {
  return gulp.src(JS_FILES)
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(sourcemaps.init())
    .pipe(concat(PROJECT_NAME + '-built.js'))
    //.pipe(uglify({mangle: false, compress: false}))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(".dist/"));
});

var TAG_FILES = [
  "src/tools/abstract.js",
  "src/tools/menu.tag",

  // these open dialogs
  "src/tools/new-image.js",
  "src/tools/download.tag",
  "src/tools/upload.tag",

  // other tools
  "src/tools/brush.js",
  "src/tools/circle.js",
  "src/tools/eye-dropper.js",
  "src/tools/fill.js",
  "src/tools/rect.js",
  "src/tools/resize.tag",
  "src/tools/select.js",
  "src/tools/zoom.js",

  "src/tools.tag",
  "src/paint.tag",
]

gulp.task('build-tag', function() {
  return gulp.src(TAG_FILES)
    .pipe(riot())
    .pipe(concat("_tags.js"))
    .pipe(gulp.dest(".dist"));
});

LESS_FILES = ["less/base.less"];

gulp.task('build-css', function () {
  return gulp.src(LESS_FILES)
    .pipe(less({}))
    .pipe(concat(PROJECT_NAME+'-built.css'))
    .pipe(gulp.dest(".dist/"));
});

var build_tasks = ['build-js', 'build-css'];
gulp.task('watch', build_tasks, function () {
  gulp.watch(JS_FILES, ['build-js']);
  gulp.watch(TAG_FILES, ['build-js']);
  gulp.watch(["less/*.less"], ['build-css']);
});

gulp.task('default', build_tasks);
