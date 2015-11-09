'use strict';
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');

function getArgs() {
  var output = {};
  var args = process.argv.slice(3);
  args.forEach(function(arg) {
    var split = arg.split('=');
    var key = split[0].replace(/\W/g, '');
    output[key] = split[1];
  });
  return output;
}

gulp.task('static', function () {
  return gulp.src('**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('nsp', function (cb) {
  nsp('package.json', cb);
});

gulp.task('pre-test', function () {
  return gulp.src('lib/**/*.js')
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function (cb) {
  var mochaErr;

  gulp.src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}))
    .on('error', function (err) {
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', function () {
      cb(mochaErr);
    });
});

gulp.task('mochaTest', function (cb) {
  var mochaErr;

  gulp.src('test/*.js')
    .pipe(plumber())
    .pipe(mocha({
      reporter: 'spec',
      grep: getArgs().grep,
      bail: true
    }))
    .on('error', function (err) {
      mochaErr = err;
    })
    .on('end', function () {
      cb(mochaErr);
    });
});

gulp.task('watch', function() {
  gulp.watch('lib/*.js', ['mochaTest']);
});

gulp.task('prepublish', ['nsp']);
gulp.task('default', ['static', 'test']);
