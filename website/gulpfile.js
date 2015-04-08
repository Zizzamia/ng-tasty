var concat = require('gulp-concat');
var del = require('del');
var Dgeni = require('dgeni');
var gulp = require('gulp');
var less = require('gulp-less');
var markdown = require('gulp-markdown');
var minifyCSS = require('gulp-minify-css');
var path = require('path');
var rename = require('gulp-rename');
var replace = require('gulp-replace');

var paths = {
  build: ['build', 'docgen/build'],
  docs: ['../docs/*.md'],
  dgeniTemplates: ['docgen/templates/*.txt', 'docgen/processors/*.js'],
  html: ['index.html', 'partials/*.html'],
  js: [
    'js/modules.js',
    'js/**/*.js',
    'bower_components/bootstrap/dist/js/bootstrap.min.js',
    'bower_components/lodash/dist/lodash.min.js'
  ],
  less: ['css/protractor.less'],
  outputDir: 'build/'
};

gulp.task('clean', function(cb) {
  del(paths.build, cb);
});

gulp.task('copyFiles', function() {
  // html.
  gulp.src('index.html')
      .pipe(gulp.dest(paths.outputDir));
  gulp.src('partials/*.html')
      .pipe(gulp.dest(paths.outputDir + '/partials'));

  // Images.
  gulp.src('img/**')
      .pipe(gulp.dest('build/img'));
});

// Generate the table of contents json file using Dgeni. This is output to
// docgen/build/toc.json
gulp.task('dgeni', function() {
  var packages = [require('./docgen/dgeni-config')];
  var dgeni = new Dgeni(packages);

  dgeni.generate().then(function(docs) {
    console.log(docs.length, 'docs generated');
  }).then(function() {
    // Copy files over
    gulp.src(['docgen/build/*.json'])
        .pipe(gulp.dest(paths.outputDir + '/apiDocs'));
  });
});

// Transform md files to html.
gulp.task('markdown', function() {
  gulp.src(['../docs/*.md', '!../docs/api.md'])
    // Parse markdown.
    .pipe(markdown())
    // Fix in-page hash paths.
    .pipe(replace(/"#([^ ]*?)"/g, '#/{{path}}#$1'))
    // Fix md urls.
    .pipe(replace(/"(?:\/docs\/)?([\w\-]+)\.md/g, '"#/$1'))
    // Fix png urls.
    .pipe(replace(/"(?:\/docs\/)?([\w\-]+\.png)"/g, '"img/$1"'))
    // Fix urls to reference js files.
    .pipe(replace(
      /"(?:\/([\-\.\w\/]+)\/)?(\w+\.js(?:#\w*)?)"/g,
      function(match, path, file) {
        path = path || 'docs';
        return '"https://github.com/zizzamia/ng-tasty/blob/master/' +
            path + '/' + file + '"';
      }
    ))
    // Add anchor links
    .pipe(replace(/<h2 id="([^"]*)">(.*?)<\/h2>/g, '<h2 id="$1" class="' +
        'anchored"><div><a href="#{{path}}#$1">&#x1f517;</a>$2</div></h2>'))
    // Decorate tables.
    .pipe(replace(/<table>/g, '<table class="table table-striped">'))
    // Fix <code> blocks to not interpolate Angular
    .pipe(replace(/<code>/g, '<code ng-non-bindable>'))
    .pipe(rename(function(path) {
      path.extname = '.html';
    }))
    .pipe(gulp.dest('./build/partials'));
});

gulp.task('default', [
  'dgeni',
  'markdown',
  'copyFiles'
]);
