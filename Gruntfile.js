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
    // Minify JS
    uglify: {
      my_target: {
        files: {
          'symplie/dist/bundle.js': ['symplie/dist/bundle.js']
        }
      }
    },
    // Minify CSS
    cssmin: {
      combine: {
        files: {
          'symplie/dist/bundle.min.css': ['symplie/src/css/reset/reset.css'
                                         ,'symplie/src/css/highlightjs/*.css'
                                         ,'symplie/src/css/*.css']
        }
      }
    },
    // Copy lib files to the dist directory
    copy: {
      main: {
        expand: true,
        src: 'symplie/src/js/lib/*',
        dest: 'symplie/dist/',
        flatten: true,
        filter: 'isFile'
      }
    },
    // Watch for changes
    watch: {
      files: ['symplie/src/js/**/*.js', 'symplie/src/css/**/*.css'],
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