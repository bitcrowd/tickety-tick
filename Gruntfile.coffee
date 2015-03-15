module.exports = (grunt) ->
  grunt.initConfig
    image_resize:
      icon16_chrome:
        options: width: 16
        files: 'dist/chrome-extension/icon16.png': 'src/data/icon.png'
      icon48_chrome:
        options: width: 48
        files: 'dist/chrome-extension/icon48.png': 'src/data/icon.png'
      icon128_chrome:
        options: width: 128
        files: 'dist/chrome-extension/icon128.png': 'src/data/icon.png'
      icon16_firefox:
        options: width: 16
        files: 'dist/firefox-extension/data/icon16.png': 'src/data/icon.png'
      icon32_firefox:
        options: width: 32
        files: 'dist/firefox-extension/data/icon32.png': 'src/data/icon.png'
      icon64_firefox:
        options: width: 64
        files: 'dist/firefox-extension/data/icon64.png': 'src/data/icon.png'
      icon16_safari:
        options: width: 16
        files: 'dist/tickety-tick.safariextension/data/icon16.png': 'src/data/icon.png'
      icon32_safari:
        options: width: 32
        files: 'dist/tickety-tick.safariextension/data/icon32.png': 'src/data/icon.png'
      icon64_safari:
        options: width: 64
        files: 'dist/tickety-tick.safariextension/data/icon64.png': 'src/data/icon.png'
      icon_safari:
        options: width: 64
        files: 'dist/tickety-tick.safariextension/Icon.png': 'src/data/icon.png'
    copy:
      src:
        files: [
          # Chrome Extension
          { expand: true, cwd: "dist/bower_dest",  src: ['**'], dest: 'dist/chrome-extension/' },
          { expand: true, cwd: "src/common",  src: ['**'], dest: 'dist/chrome-extension/' },
          { expand: true, cwd: "src/data",    src: ['**'], dest: 'dist/chrome-extension/' },
          { expand: true, cwd: "src/chrome",  src: ['**', '!manifest.json'], dest: 'dist/chrome-extension/' }
          # Firefox Extension
          { expand: true, cwd: "dist/bower_dest",  src: ['**'], dest: 'dist/firefox-extension/data/' },
          { expand: true, cwd: "src/common",  src: ['**'], dest: 'dist/firefox-extension/data/' },
          { expand: true, cwd: "src/data",    src: ['**'], dest: 'dist/firefox-extension/data/' },
          { expand: true, cwd: "src/firefox", src: ['**', '!package.json'], dest: 'dist/firefox-extension/lib/' }
          # Safari Extension
          { expand: true, cwd: "dist/bower_dest",  src: ['**'], dest: 'dist/tickety-tick.safariextension/data/' },
          { expand: true, cwd: "src/common",  src: ['**'], dest: 'dist/tickety-tick.safariextension/data/' },
          { expand: true, cwd: "src/data",    src: ['**'], dest: 'dist/tickety-tick.safariextension/data/' },
          { expand: true, cwd: "src/safari",  src: ['**', '!package.json'], dest: 'dist/tickety-tick.safariextension/' }
        ]
    bower:
      dev:
        dest: 'dist/bower_dest'
    watch:
      all:
        files: ['src/**']
        tasks: ['build:sources', 'build:manifests', 'build:icons']
    zip:
      'chrome': { cwd: 'dist/chrome-extension/', src: ['dist/chrome-extension/**'], dest: 'dist/chrome-extension.zip' }

  grunt.loadNpmTasks 'grunt-image-resize'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-bower'
  grunt.loadNpmTasks 'grunt-zip'

  grunt.registerTask 'build:manifest-chrome', 'Build chrome manifest file.', () ->
    mnf = grunt.file.readJSON 'src/chrome/manifest.json'
    pckg = grunt.file.readJSON 'package.json'

    mnf.name = pckg.name
    mnf.version = pckg.version
    mnf.description = pckg.description

    mnf.icons =
      "16": "icon16.png"
      "48": "icon48.png"
      "128": "icon128.png"

    grunt.file.write 'dist/chrome-extension/manifest.json', JSON.stringify(mnf)

  grunt.registerTask 'build:manifest-firefox', 'Build firefox manifest file.', () ->
    mnf = grunt.file.readJSON 'src/firefox/package.json'
    pckg = grunt.file.readJSON 'package.json'

    mnf.name  = pckg.name
    mnf.title = pckg.name
    mnf.version = pckg.version
    mnf.description = pckg.description

    grunt.file.write 'dist/firefox-extension/package.json', JSON.stringify(mnf)

  grunt.registerTask 'build:icons', ['image_resize']
  grunt.registerTask 'build:sources', ['copy:src']
  grunt.registerTask 'build:manifests', ['build:manifest-chrome', 'build:manifest-firefox']
  grunt.registerTask 'build', ['bower', 'build:sources', 'build:manifests', 'build:icons', 'bower', 'zip']
  grunt.registerTask 'run', ['build', 'watch']
  grunt.registerTask 'default', ['build']
