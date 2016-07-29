module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    /*
     * Cleaning build directory and temporary directory 
     */
    clean: {
      build: "build/",
      test: "test/ui/lib/"
    },
    /*
     * Creating one temporary combined css file from all external css dependencies 
     */
    concat: {
      lib: {
        files: {
          "test/ui/lib/data-widget.js": ["lib/client/ui/data-widgets-js/DataWidgets.js", "lib/client/ui/data-widgets-js/WidgetContainer.js", "lib/client/ui/data-widgets-js/GaugeWidget.js" ],
          "test/ui/lib/time-utils.js": ["lib/client/time-utils-js/Time.js"],
          "test/ui/lib/solarboard-client.js": ["lib//client/api/solar-board-client-js/SolarBoard.js", "lib//client/api/solar-board-client-js/SolarBoardClient.js"],
        },
      },
    },
    copy: {
      lib: {
        files: [{
          expand: true,
          cwd: "lib/client/ui/data-widgets-js/css/",
          src: "data-widgets-js.css",
          dest: "test/ui/lib/"
        }, {
          expand: true,
          cwd: "lib/client/ui/data-widgets-js/icons/",
          src: "*.ttf",
          dest: "test/ui/lib"
        }]
      }
    },
  });


  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask("lib", ["clean:build", "clean:test", "concat:lib", "copy:lib", ]);
};
