'use strict';

var _ = require('underscore');
var gulp = require('gulp'); 
var concat = require("gulp-concat");
var header = require('gulp-header');
var jshint = require('gulp-jshint');
var html2js = require('gulp-html2js');
var karma = require('gulp-karma');
var rename = require('gulp-rename');
var path = require('path');
var tap = require('gulp-tap');
var grunt = require('grunt');
var markdown = require('node-markdown').Markdown;
var uglify = require('gulp-uglify');

var testFiles = [
  'components/angular/angular.min.js',
  'components/angular-mocks/angular-mocks.js',
  'src/**/*.js',
  'test/spec.js',
  'template/table/*.js'
];

gulp.task('jshint', function() {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('html2js', function() {
  gulp.src('template/**/*.html')
    .pipe(html2js({
      module: null, // no bundle module for all the html2js templates
      base: '.'
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
  gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run',
      reporters: ['dots'],
      browsers: ['Firefox']
    }));
});

gulp.task('watch', function() {
  gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch'
    }));
});




grunt.initConfig({
  modules: [], //to be filled in by build task
  pkg: grunt.file.readJSON('package.json'),
  dist: 'dist',
  filename: 'ng-tasty'
})

gulp.task('build', function() {

  var pkg = grunt.file.readJSON('package.json');
  var filename = 'ng-tasty';
  var dist = 'dist';

  var banner = ['/*',
               ' * ' + pkg.name,
               ' * ' + pkg.homepage + '\n',
               ' * Version: ' + pkg.version + ' - ' + grunt.template.today("yyyy-mm-dd"),
               ' * License: ' + pkg.license,
               ' */\n'].join('\n');

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.initConfig({
    modules: [], //to be filled in by build task
    pkg: pkg,
    dist: dist,
    filename: filename,
    meta: {
      modules: 'angular.module("ngTasty", [<%= srcModules %>]);',
      tplmodules: 'angular.module("ngTasty.tpls", [<%= tplModules %>]);',
      all: 'angular.module("ngTasty", ["ngTasty.tpls", <%= srcModules %>]);',
      banner: banner
    }
  });


  //Common ngTasty module containing all modules for src and templates
  //findModule: Adds a given module to config
  var foundModules = {};
  function findModule(name) {
    if (foundModules[name]) { return; }
    foundModules[name] = true;

    function breakup(text, separator) {
      return text.replace(/[A-Z]/g, function (match) {
        return separator + match;
      });
    }
    function ucwords(text) {
      return text.replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
      });
    }
    function enquote(str) {
      return '"' + str + '"';
    }

    var module = {
      name: name,
      moduleName: enquote('ngTasty.' + name),
      displayName: ucwords(breakup(name, ' ')),
      srcFiles: grunt.file.expand('src/'+name+'/*.js'),
      tplFiles: grunt.file.expand('template/'+name+'/*.html'),
      tpljsFiles: grunt.file.expand('template/'+name+'/*.html.js'),
      tplModules: grunt.file.expand('template/'+name+'/*.html').map(enquote),
      dependencies: dependenciesForModule(name)
    };
    module.dependencies.forEach(findModule);
    grunt.config('modules', grunt.config('modules').concat(module));
  }

  function dependenciesForModule(name) {
    var deps = [];
    grunt.file.expand('src/' + name + '/*.js')
    .map(grunt.file.read)
    .forEach(function(contents) {
      //Strategy: find where module is declared,
      //and from there get everything inside the [] and split them by comma
      var moduleDeclIndex = contents.indexOf('angular.module(');
      var depArrayStart = contents.indexOf('[', moduleDeclIndex);
      var depArrayEnd = contents.indexOf(']', depArrayStart);
      var dependencies = contents.substring(depArrayStart + 1, depArrayEnd);
      dependencies.split(',').forEach(function(dep) {
        if (dep.indexOf('ngTasty.') > -1) {
          var depName = dep.trim().replace('ngTasty.','').replace(/['"]/g,'');
          if (deps.indexOf(depName) < 0) {
            deps.push(depName);
            //Get dependencies for this new dependency
            deps = deps.concat(dependenciesForModule(depName));
          }
        }
      });
    });
    return deps;
  }

  grunt.file.expand({
    filter: 'isDirectory', cwd: '.'
  }, 'src/*').forEach(function(dir) {
    findModule(dir.split('/')[1]);
  });

  var modules = grunt.config('modules');
  grunt.config('srcModules', _.pluck(modules, 'moduleName'));
  grunt.config('tplModules', _.pluck(modules, 'tplModules').filter(function(tpls) { 
    return tpls.length > 0;
  } ));

  var srcFiles = _.pluck(modules, 'srcFiles');
  var tpljsFiles = _.pluck(modules, 'tpljsFiles');
  srcFiles = srcFiles.reduce(function(a, b) {
    return a.concat(b);
  });
  tpljsFiles = tpljsFiles.reduce(function(a, b) {
    return a.concat(b);
  });

  var metaHeader = grunt.config('meta.banner') + grunt.config('meta.modules') + '\n';

  gulp.src(srcFiles)
    .pipe(concat(filename + '-' + pkg.version + '.js'))
    .pipe(header(metaHeader))
    .pipe(gulp.dest(dist))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(dist));

  var metaHeader = grunt.config('meta.banner') + 
                   grunt.config('meta.all') + '\n' +
                   grunt.config('meta.tplmodules') + '\n';

  gulp.src(srcFiles.concat(tpljsFiles))
    .pipe(concat(filename + '-tpls-' + pkg.version + '.js'))
    .pipe(header(metaHeader))
    .pipe(gulp.dest(dist))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(dist));
});