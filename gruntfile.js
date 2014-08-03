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
      }
    }

  });

  grunt.registerTask('test', ['karma']);

};