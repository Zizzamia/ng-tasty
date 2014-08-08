'use strict';

var _ = require('underscore');
var gulp = require('gulp'); 
var concat = require("gulp-concat");
var header = require('gulp-header');
var html2js = require('gulp-html2js');
var jshint = require('gulp-jshint');
var karma = require('gulp-karma');
var rename = require('gulp-rename');
var tap = require('gulp-tap');
var uglify = require('gulp-uglify');
var grunt = require('grunt');

var testFiles = [
  'components/angular/angular.min.js',
  'components/angular-mocks/angular-mocks.js',
  'src/**/*.js',
  'template/table/*.html.js'
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

grunt.initConfig({
  modules: [], //to be filled in by build task
  pkg: grunt.file.readJSON('package.json'),
  dist: 'dist',
  filename: 'ng-tasty'
})

gulp.task('build', function() {
  gulp.src('template/**/*.html')
    .pipe(gulp.dest('dist/template/'));

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
      all: 'angular.module("ngTasty", ["ngTasty.tpls", <%= srcModules %>]);'
    }
  });


  //Common ngTasty module containing all modules for src and templates
  //findModule: Adds a given module to config
  var foundModules = {};
  function findModule(name) {
    if (foundModules[name]) { return; }
    foundModules[name] = true;
    
    function enquote(str) {
      return '"' + str + '"';
    }

    var module = {
      name: name,
      moduleName: enquote('ngTasty.' + name),
      srcFiles: grunt.file.expand('src/'+name+'/*.js'),
      tplFiles: grunt.file.expand('template/'+name+'/*.html'),
      tpljsFiles: grunt.file.expand('template/'+name+'/*.html.js'),
      tplModules: grunt.file.expand('template/'+name+'/*.html').map(enquote),
    };
    grunt.config('modules', grunt.config('modules').concat(module));
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

  var metaHeader = banner + grunt.config('meta.modules') + '\n';

  gulp.src(srcFiles)
    .pipe(concat(filename + '.js'))
    .pipe(header(metaHeader))
    .pipe(gulp.dest(dist))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(dist));

  var metaHeader = banner + 
                   grunt.config('meta.all') + '\n' +
                   grunt.config('meta.tplmodules') + '\n';

  gulp.src(srcFiles.concat(tpljsFiles))
    .pipe(concat(filename + '-tpls.js'))
    .pipe(header(metaHeader))
    .pipe(gulp.dest(dist))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(dist));
});