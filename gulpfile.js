var gulp = require('gulp'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  imagemin = require('gulp-imagemin'),
  inject = require('gulp-inject'),
  connect = require('gulp-connect'),
  cssnano = require('gulp-cssnano'),
  twig = require('gulp-twig'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  source = require('vinyl-source-stream');

// SCSS file
gulp.task('styles', function () {
  return gulp.src('./app/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(cssnano())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(connect.reload());
});

// Manage image
gulp.task('image', function () {
  return gulp.src('app/assets/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/assets/img/'));
});

// Manage fonts
gulp.task('fonts', function () {
  return gulp.src('app/assets/fonts/*/**')
    .pipe(gulp.dest('./dist/assets/fonts/'));
});

// Manage twig
gulp.task('templates', function () {
  gulp.src('app/templates/*.twig')
    .pipe(twig())
    .pipe(gulp.dest('./dist/'))
    .pipe(connect.reload());
});

// Manage js
gulp.task('browserify', function() {
  return browserify({ debug: true })
    .transform(babelify)
    .require('app/js/main.js', { entry: true })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(connect.reload());
});

gulp.task('html', ['templates'], function () {
  gulp.src(['./dist/', './src/*.html'])
    .pipe(connect.reload());
});

gulp.task('default', function() {
  gulp.watch(['./app/scss/*.scss', './app/scss/**/*.scss'],['styles']);
  gulp.watch(['app/templates/*.twig', 'app/templates/**/*.twig'],['html']);
  gulp.watch(['app/js/*.js', 'app/js/**/*.js'],['browserify']);
});

gulp.task('connect', function () {
  connect.server({
    root: './dist/',
    livereload: true
  });
});

gulp.task('serve', ['connect', 'default'], function () {
  require('opn')('http://localhost:8080');
});

gulp.task('assets', ['fonts', 'image'])

gulp.task('build', ['templates', 'assets', 'styles', 'browserify'])