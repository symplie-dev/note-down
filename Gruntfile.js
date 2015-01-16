'use strict';

module.exports = function (grunt) {
  var browserifyFiles = { 'symplie/dist/bundle.js': ['symplie/src/js/app/index.js'] };

  grunt.initConfig({
    // Browserify JS
    browserify: {
      dev: {
        files: browserifyFiles,
        options: { debug: true }
      },
      release: {
        files: browserifyFiles,
        options: { debug: false }
      },
    },
    cssmin: {
      combine: {
        files: {
          'symplie/dist/bundle.min.css': ['symplie/src/css/reset/reset.css'
                                         ,'symplie/src/css/*.css']
        }
      }
    },
    // Watch for changes
    watch: {
      files: ['symplie/src/js/**/*.js', 'symplie/src/css/**/*.css'],
      tasks: ['dev', 'cssmin']
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['browserify:dev']);
  grunt.registerTask('dev', ['browserify:dev']);
  grunt.registerTask('release', ['browserify:release']);
};