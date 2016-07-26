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
          flatte: true,
          cwd: "lib/client/ui/data-widgets-js/css/",
          src: "data-widgets-js.css",
          dest: "test/ui/lib/"
        }]
      }
    },
    /*
    uglify: {
      options: {
      build: {
        files: {
          "build/js/app.min.js": ["src/js/ConnectionVisualizations.js", "src/js/MainController.js", "src/js/JSONLoader.js", "src/js/DataHandler.js", "src/js/MainView.js", "src/js/ArtistNetworkView.js", "src/js/ArtworkViewController.js", "src/js/ArtworkLinearConnectionView.js", "src/js/ArtworkTimelineNetworkView.js", "src/js/ArtistToArtistInfluencesView.js", "src/js/init.js", ],
          "build/js/bundle.min.js": ["dependencies/lib/jquery-2.1.4.js", "dependencies/lib/vis.js", "dependencies/lib/bootstrap.js", "dependencies/lib/cytoscape.js", "dependencies/lib/jquery.tooltipster.js", "dependencies/lib/icheck.js", "dependencies/lib/underscore.js", "dependencies/lib/owl.carousel.min.js", "dependencies/lib/easeljs-0.8.2.min.js", "dependencies/lib/preloadjs-0.6.2.min.js", "dependencies/lib/vex.combined.min.js", "dependencies/lib/jquery.qtip.min.js", "dependencies/lib/cytoscape-qtip.js"],
        }
      }
    },
    cssmin: {
      options: {
        "keepSpecialComments": 0,
      },
      build: {
        files: {
          "build/res/css/styles.min.css": "src/css/styles.css",
          "build/res/css/bundle.min.css": "tmp/bundle.css",
        },
      }
    },
    */
  });


  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask("lib", ["clean:build", "clean:test", "concat:lib", "copy:lib", ]);
};
