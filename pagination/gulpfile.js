/**
 * https://www.npmjs.com/package/gulp4
 */

var pkg = require('./package.json');


var del = require('del');
var gulp = require('gulp');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var header = require('gulp-header');
var minify = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

var paths = {
  styles: {
    src: './src/style/pagination.less',
    watch: 'styles/**/*',
    dest: 'dist/pagination/'
  },
  scripts: {
    src: './src/lib/pagination.js',
    watch: 'styles/**/*',
    dest: 'dist/pagination/'
  }
};

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del(['dist']);
}

/*
 * Define our tasks using plain functions
 */
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(less()
      .on('error', function (e) {
        console.error(e.message);
        this.emit('end');
      }))
    .pipe(autoprefixer())
    .pipe(minify({
      compatibility: 'ie7'
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.styles.dest));
}

/*
 * Define our tasks using plain functions
 */
function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scripts.dest));
}

function watch() {
  var watcher = gulp.watch(paths.styles.watch, styles);
  gulp.watch(paths.scripts.watch, scripts);

  watcher.on('all', function (event, path, stats) {
    console.log('File ' + path + ' was ' + event + ', running tasks...');
  });
}

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(clean, gulp.parallel(styles, scripts, watch));

/*
 * You can still use `gulp.task` to expose tasks
 */
gulp.task('build', build);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task('default', build);