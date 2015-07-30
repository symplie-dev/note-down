'use strict';

module.exports = function (grunt) {
  var browserifyFiles = { 'note-down/dist/bundle.js': ['note-down/src/js/app/index.js'] };

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
    // Minify JS
    uglify: {
      my_target: {
        files: {
          'note-down/dist/bundle.js': ['note-down/dist/bundle.js']
        }
      }
    },
    // Minify CSS
    cssmin: {
      combine: {
        files: {
          'note-down/dist/bundle.min.css': ['note-down/src/css/reset/reset.css'
                                         ,'note-down/src/css/highlightjs/*.css'
                                         ,'note-down/src/css/*.css']
        }
      }
    },
    // Copy lib files to the dist directory
    copy: {
      main: {
        expand: true,
        src: 'note-down/src/js/lib/*',
        dest: 'note-down/dist/',
        flatten: true,
        filter: 'isFile'
      }
    },
    // Watch for changes
    watch: {
      files: ['note-down/src/js/**/*.js', 'note-down/src/css/**/*.css'],
      tasks: ['dev', 'cssmin', 'copy']
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['browserify:dev']);
  grunt.registerTask('dev', ['browserify:dev', 'cssmin', 'copy']);
  grunt.registerTask('release', ['browserify:release', 'uglify', 'cssmin', 'copy']);
};