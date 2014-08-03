module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({

    'meta': {
    },
    'jshint': {
      'files': ['Gruntfile.js','src/*.js'],
      'options': {
        'jshintrc': '.jshintrc'
      }
    },
    'karma': {
      'options': {
        'configFile': 'test/karma.conf.js'
      },
      'watch': {
        'background': true
      },
      'continuous': {
        'singleRun': true
      },
      'travis': {
        'singleRun': true,
        'reporters': ['dots'],
        'browsers': ['Firefox']
      },
      'coverage': {
        'preprocessors': {
          'src/*.js': 'coverage'
        },
        'reporters': ['progress', 'coverage']
      }
    }

  });

  grunt.registerTask('test', 'Run tests on singleRun karma server', function () {
    if (process.env.TRAVIS) {
      grunt.task.run('karma:travis');
    } else {
      grunt.task.run('karma:continuous');
    }
  });

  return grunt;
};