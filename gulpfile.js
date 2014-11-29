var gulp = require('gulp')
var shell = require('gulp-shell')
var path = require('path')
var connect = require('gulp-connect');
var proxy = require('./proxy');

var webapp = {
  assets: [
    'src/webapp/assets/**/*',
    'src/webapp/assets/*',
    'src/webapp/index.html',
  ],
  dist: path.join(__dirname, './dist'),
}

gulp.task('webapp:copy', function() {
  gulp.src(webapp.assets)
  .pipe(gulp.dest(webapp.dist));
});

gulp.task('webapp:watch:assets', function() {
  gulp.watch(webapp.assets, ['webapp:copy'])
})

gulp.task('shopping-cart-vue:connect', function() {
  connect.server({
    root: webapp.dist,
    port: 8001
  });
})

gulp.task('example', function() {
  connect.server({
    root: './example',
    port: 8005
  });
})

gulp.task('proxy:connect', function() {
  proxy()
})

gulp.task('webpack:watch', shell.task([
  'webpack --progress --colors -w'
]));

gulp.task('webapp', [
  'webapp:copy',
  'webapp:connect',
  'webapp:watch:assets',
  'proxy:connect',
  'example',
  'webpack:watch',
])

gulp.task('default', function() {
  gulp.start('webapp')
});
