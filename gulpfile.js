'use strict';

var _ = require('underscore');
var gulp = require('gulp'); 
var clean = require('gulp-clean');
var concat = require("gulp-concat");
var header = require('gulp-header');
var html2js = require('gulp-ng-html2js');
var jshint = require('gulp-jshint');
var karma = require('gulp-karma');
var ngAnnotate = require('gulp-ng-annotate');
var rename = require('gulp-rename');
var tap = require('gulp-tap');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var zip = require('gulp-zip');
var moment = require('moment');
var runSequence = require('run-sequence');
var fs = require('fs');
var pkg = require('./package.json');

var testFiles = [
    'components/jquery/dist/jquery.min.js',
    'components/angular/angular.min.js',
    'components/angular-mocks/angular-mocks.js',
    'src/**/*.js',
    'template/table/*.html.js'
  ];

gulp.task('clean', function () {  
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

gulp.task('move-template', function () {  
  gulp.src('template/**/*.html')
    .pipe(gulp.dest('dist/template/'));
});

gulp.task('jshint', function() {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('html2js', function() {
  gulp.src('template/**/*.html')
    .pipe(html2js({
      module: null, // no bundle module for all the html2js templates
       prefix: "template/"
    }))
    .pipe(rename({
      extname: ".html.js"
    }))
    .pipe(gulp.dest('template'))
});

gulp.task('test', function() {
  gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run',
      browsers: ['Chrome']
    }));
});

gulp.task('travis', function() {
  gulp.src([
    'components/jquery/dist/jquery.min.js',
    'components/angular/angular.min.js',
    'components/angular-mocks/angular-mocks.js',
    'src/*/test/*.js',
    'dist/ng-tasty.js',
    'template/table/*.html.js'
  ])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run',
      reporters: ['dots'],
      browsers: ['Firefox']
    }));

  gulp.src([
    'components/jquery/dist/jquery.min.js',
    'components/angular/angular.min.js',
    'components/angular-mocks/angular-mocks.js',
    'src/*/test/*.js',
    'dist/ng-tasty.min.js',
    'template/table/*.html.js'
  ])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run',
      reporters: ['dots'],
      browsers: ['Firefox']
    }));

  gulp.src([
    'components/jquery/dist/jquery.min.js',
    'components/angular/angular.min.js',
    'components/angular-mocks/angular-mocks.js',
    'src/*/test/*.js',
    'dist/ng-tasty-tpls.js',
    'template/table/*.html.js'
  ])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run',
      reporters: ['dots'],
      browsers: ['Firefox']
    }));

  gulp.src([
    'components/jquery/dist/jquery.min.js',
    'components/angular/angular.min.js',
    'components/angular-mocks/angular-mocks.js',
    'src/*/test/*.js',
    'dist/ng-tasty-tpls.min.js',
    'template/table/*.html.js'
  ])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run',
      reporters: ['dots'],
      browsers: ['Firefox']
    }));
});

gulp.task('watch', function() {

  gulp.watch('template/**/*.html', function (event) {
    gulp.run('html2js');
  });

  gulp.watch('src/**/*.js', function (event) {
    gulp.run('jshint');
    gulp.run('build');
  });

  gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch',
      browsers: ['Chrome']
    }));
});

var srcModules = [];
var tplModules = [];

function getExtension(filename) {
  var i = filename.lastIndexOf('.');
  return (i < 0) ? '' : filename.substr(i);
}

gulp.task('get-modules-name', function() {
  function enquote(str) {
    return '"' + str + '"';
  }

  fs.readdir('src', function (err, directories) {
    directories = directories.filter(function(directory) { 
      return directory[0] !== '.';
    });
    directories.forEach(function (directory) {
      srcModules.push(enquote('ngTasty.' + directory));
      fs.readdir('template/' + directory, function (err, files) {
        if (!files) {
          return;
        }
        files = files.filter(function(file) { 
          return getExtension(file) === '.html';
        });
        files.forEach(function (file) {
          tplModules.push(enquote('template/' + file));
        });
      });
    })
  });
});

gulp.task('build-dist', function() {
  var filename = 'ng-tasty';
  var dist = 'dist';
  var modules = [];
  var meta = {
    modules: 'angular.module("ngTasty", [<%= srcModules %>]);',
    tplmodules: 'angular.module("ngTasty.tpls", [<%= tplModules %>]);',
    all: 'angular.module("ngTasty", ["ngTasty.tpls", <%= srcModules %>]);'
  };
  var banner = ['/*',
               ' * ' + pkg.name,
               ' * ' + pkg.homepage + '\n',
               ' * Version: ' + pkg.version + ' - ' + moment().format("YYYY-MM-DD"),
               ' * License: ' + pkg.license,
               ' */\n'].join('\n');

  tplModules = tplModules.filter(function(tpls) { 
    return tpls.length > 0;
  });

  var metaHeader = banner + meta.modules + '\n';

  var dict = {
    'srcModules': srcModules,
    'tplModules': tplModules
  };

  gulp.src('src/*/*.js')
    .pipe(concat(filename + '.js'))
    .pipe(header(metaHeader, dict))
    .pipe(gulp.dest(dist))
    .pipe(ngAnnotate())
    .pipe(uglify({mangle: false}))
    .pipe(header(banner, dict))
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(dist));

  var metaHeader = banner + 
                   meta.all + '\n' +
                   meta.tplmodules + '\n';

  gulp.src(['src/*/*.js', 'template/*/*.html.js'])
    .pipe(concat(filename + '-tpls.js'))
    .pipe(header(metaHeader, dict))
    .pipe(gulp.dest(dist))
    .pipe(ngAnnotate())
    .pipe(uglify({mangle: false}))
    .pipe(header(banner, dict))
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(dist));

  gulp.src('dist/**/*')
    .pipe(zip(pkg.version + '.zip'))
    .pipe(gulp.dest('releases'));
});

gulp.task('build', function() {
  runSequence('clean',
              'html2js',
              'move-template',
              'get-modules-name',
              'build-dist');
});
