'use strict';

var _ = require('underscore');
var md5 = require('blueimp-md5').md5;
var camelCase = require('camel-case');
var gulp = require('gulp'); 
var clean = require('gulp-clean');
var concat = require("gulp-concat");
var file = require('gulp-file');
var header = require('gulp-header');
var html2js = require('gulp-ng-html2js');
var jshint = require('gulp-jshint');
var karma = require('gulp-karma');
var ngAnnotate = require('gulp-ng-annotate');
var ngcompile = require('gulp-ngcompile');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var tap = require('gulp-tap');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var zip = require('gulp-zip');
var moment = require('moment');
var path = require('path');
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
var srcModules = [];
var tplModules = [];


var capitaliseFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
var enquote = function (str) {
  return '"' + str + '"';
}


gulp.task('clean', function () {  
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

gulp.task('clean-module', function () {  
  return gulp.src('dist/module', {read: false})
    .pipe(clean());
});

gulp.task('move-template', function () {  
  gulp.src('template/**/*.html')
    .pipe(gulp.dest('dist/template/'));
});

gulp.task('jshint', function () {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('html2js', function () {
  return gulp.src('template/**/*.html')
    .pipe(html2js({
      moduleName: function (file) {
        var path = file.path.split('/'),
            folder = path[path.length - 2],
            fileName = path[path.length - 1].split('.')[0];
        var name = 'ngTasty.tpls.' + camelCase(folder);
        return name + '.' + camelCase(fileName);
      },
      prefix: "template/"
    }))
    .pipe(rename({
      extname: ".html.js"
    }))
    .pipe(gulp.dest('template'))
});

gulp.task('test', function () {
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run',
      browsers: ['Chrome']
    }));
});

gulp.task('travis', function () {
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run',
      reporters: ['dots'],
      browsers: ['Firefox']
    }));
});

gulp.task('full-test', function () {
  gulp.src([
    'components/jquery/dist/jquery.min.js',
    'components/angular/angular.min.js',
    'components/angular-mocks/angular-mocks.js',
    'src/*/test/*.js',
    'dist/ng-tasty.js',
    'template/**/*.html.js'
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
    'template/**/*.html.js'
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
    'template/**/*.html.js'
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
    'template/**/*.html.js'
  ])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run',
      reporters: ['dots'],
      browsers: ['Firefox']
    }));
});

gulp.task('get-modules-name', function () {
  var setModules = function (folder, files) {
    files = files.filter(function (file) {
      return file.split('.').pop() == 'js';
    });
    files.forEach(function (file) {
      file = file.split('.')[0];
      var module = 'ngTasty.'+ camelCase(folder) + '.' + camelCase(file);
      srcModules.push(enquote(module));
      if (folder === 'component') {
        setTplsModules(file);
      }
    })
  };
  var setTplsModules = function (component) {
    fs.readdir('template/' + component, function (err, files) {
      if (!files) {
        return;
      }
      files = files.filter(function (file) { 
        return path.extname(file) === '.html';
      });
      files.forEach(function (file) {
        var module = 'ngTasty.tpls.' + camelCase(component);
        module += '.' + camelCase(file.split('.')[0]);
        tplModules.push(enquote(module));
      });
    });
  };
  fs.readdir('src/component', function (err, files) {
    setModules('component', files)
  });
  fs.readdir('src/filter', function (err, files) {
    setModules('filter', files)
  });
  fs.readdir('src/service', function (err, files) {
    setModules('service', files)
  });
});

gulp.task('build-dist', function () {
  var filename = 'ng-tasty';
  var dist = 'dist';
  var modules = [];

  tplModules = tplModules.filter(function (tpls) { 
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
    .pipe(ngAnnotate())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist))
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
    .pipe(ngAnnotate())
    .pipe(gulp.dest(dist))
    .pipe(uglify({mangle: false}))
    .pipe(header(banner, dict))
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(dist));

  gulp.src('src/*/*.js')
    .pipe(gulp.dest(dist + '/src'))

  gulp.src('dist/**/*')
    .pipe(zip(pkg.version + '.zip'))
    .pipe(gulp.dest('releases'));
});

gulp.task('build', function () {
  runSequence('clean',
              'html2js',
              'move-template',
              'get-modules-name',
              'build-dist');
});

gulp.task('create-module-file', function () {
  var modules = process.argv[4];
  if (modules === 'all') {

  } else {

  }
  modules = process.argv[4].split(':');
  var text = 'angular.module("ngTasty", ';
  text += JSON.stringify(modules) + ")";
  var str = banner + text;

  return file('ng-tasty-tpls.js', str, { src: true })
    .pipe(gulp.dest('dist/module'));
});

gulp.task('create-module', function () {
  return gulp.src(['src/**/*.js', 
    'template/**/*.html.js',
    'dist/module/ng-tasty-tpls.js'])
    .pipe(ngcompile('ngTasty'))
    .pipe(concat('ng-tasty-tpls.js'))
    .pipe(ngAnnotate())
    .pipe(gulp.dest('dist/module'))
    .pipe(uglify({mangle: false}))
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('dist/module'));
});

gulp.task('create-module-release', function () {
  return gulp.src('dist/module/*')
    .pipe(zip('ng-tasty.zip'))
    .pipe(gulp.dest('dist/releases'));
});

gulp.task('build-module', function () {
  runSequence('clean-module',
              'html2js',
              'create-module-file',
              'create-module',
              'create-module-release');
});

gulp.task('watch', function () {

  gulp.watch('template/**/*.html', ['html2js']);

  gulp.watch('template/**/*.html.js', ['build']);

  gulp.watch('src/**/*.js', function (event) {
    runSequence('jshint', 'build');
  });

  gulp.watch(['docs/server.js', 'docs/static/app.js'], function (event) {
    gulp.src(['docs/server.js', 'docs/static/app.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
  });

  gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch',
      browsers: ['Chrome']
    }));
});

