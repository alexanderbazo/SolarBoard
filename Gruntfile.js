module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    clean: {
      www: "build/www",
      srv: ["build/srv", "build/node_modules", "build/config.json", "build/package.json", "build/index.js", ],
      tmp: "_tmp",
    },
    concat: {
      www: {
        files: {
          "_tmp/lib/data-widgets.js": ["lib/client/ui/data-widgets-js/DataWidgets.js", "lib/client/ui/data-widgets-js/WidgetContainer.js", "lib/client/ui/data-widgets-js/GaugeWidget.js", "lib/client/ui/data-widgets-js/BarWidget.js", ],
          "_tmp/lib/info-widgets.js": ["lib/client/ui/info-widgets-js/InfoWidgets.js", "lib/client/ui/info-widgets-js/WeatherWidget.js", ],
          "_tmp/lib/time-utils.js": ["lib/client/time-utils-js/Time.js"],
          "_tmp/lib/solarboard-client.js": ["lib//client/api/solar-board-client-js/SolarBoard.js", "lib//client/api/solar-board-client-js/SolarBoardClient.js"],
        },
      },
    },
    replace: {
      www: {
        options: {
          patterns: [
          {
            match: "SITE_ID",
            replace: grunt.file.readJSON("_config.json").sites[0].id,
          },
          ],
        },
        files: [
        {
          src: "client/src/js/app.js",
          dest: "_tmp/app.js",
        },
        ],
      },
    },
    uglify: {
      www: {
        files: {
          "build/www/lib/bundle.min.js": ["_tmp/lib/time-utils.js", "_tmp/lib/data-widgets.js", "_tmp/lib/info-widgets.js", "_tmp/lib/solarboard-client.js",],
          "build/www/app.min.js": ["_tmp/app.js", "client/src/js/view.js", "client/src/js/start.js",],
        },
      },
    },
    copy: {
      srv: {
        files: [{
          expand: true,
          cwd: "lib/srv/",
          src: "*.js",
          dest: "build/lib/",
        },{
          expand: true,
          src: "package.json",
          dest: "build/",
        },{
          expand: true,
          cwd: "srv/src/",
          src: "index.js",
          dest: "build/",
        },{
          expand: true,
          src: "_config.json",
          dest: "build/",
          rename: function(dest, src) {
            return dest + src.replace("_", "");
          },
        }],
      },
      www: {
        files: [{
          expand: true,
          cwd: "client/src/html/",
          src: "index.html",
          dest: "build/www/",
        }, {
          expand: true,
          cwd: "client/src/css/",
          src: "app.css",
          dest: "build/www/res/css",
        }, {
          expand: true,
          cwd: "lib/client/ui/data-widgets-js/css/",
          src: "data-widgets-js.css",
          dest: "build/www/lib",
        }, {
          expand: true,
          cwd: "lib/client/ui/data-widgets-js/icons/",
          src: "*.ttf",
          dest: "build/www/lib",
        },{
          expand: true,
          cwd: "lib/client/ui/info-widgets-js/css/",
          src: "info-widgets-js.css",
          dest: "build/www/lib",
        }, {
          expand: true,
          cwd: "lib/client/ui/info-widgets-js/icons/",
          src: "*.png",
          dest: "build/www/lib",
        }, {
          expand: true,
          cwd: "lib/client/ui/info-widgets-js/fonts/",
          src: "*.ttf",
          dest: "build/www/lib",
        },]
      },
    },
    exec: {
      srv: {
        cwd: "build/",
        cmd: "npm install --only=production",
      },
    },
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-replace");
  grunt.loadNpmTasks("grunt-exec");

  grunt.registerTask("www", function() {
    grunt.task.run("clean:www", "concat:www", "replace:www", "uglify:www", "copy:www", "clean:tmp");
  });

  grunt.registerTask("srv", ["clean:srv", "copy:srv", "exec:srv" ]);
};
