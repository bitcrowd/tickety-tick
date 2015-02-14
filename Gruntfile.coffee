module.exports = (grunt) ->
  grunt.initConfig
    image_resize:
      icon16_chrome:
        options: width: 16
        files: 'chrome-extension/icon16.png': 'src/data/icon.png'
      icon48_chrome:
        options: width: 48
        files: 'chrome-extension/icon48.png': 'src/data/icon.png'
      icon128_chrome:
        options: width: 128
        files: 'chrome-extension/icon128.png': 'src/data/icon.png'
      icon16_firefox:
        options: width: 16
        files: 'firefox-extension/data/icon16.png': 'src/data/icon.png'
      icon32_firefox:
        options: width: 32
        files: 'firefox-extension/data/icon32.png': 'src/data/icon.png'
      icon64_firefox:
        options: width: 64
        files: 'firefox-extension/data/icon64.png': 'src/data/icon.png'
    copy:
      src:
        files: [
          # Chrome Extension
          { expand: true, cwd: "bower_dest",  src: ['**'], dest: 'chrome-extension/' },
          { expand: true, cwd: "src/common",  src: ['**'], dest: 'chrome-extension/' },
          { expand: true, cwd: "src/data",    src: ['**'], dest: 'chrome-extension/' },
          { expand: true, cwd: "src/chrome",  src: ['**', '!manifest.json'], dest: 'chrome-extension/' }
          # Firefox Extension
          { expand: true, cwd: "bower_dest",  src: ['**'], dest: 'firefox-extension/data/' },
          { expand: true, cwd: "src/common",  src: ['**'], dest: 'firefox-extension/data/' },
          { expand: true, cwd: "src/data",    src: ['**'], dest: 'firefox-extension/data/' },
          { expand: true, cwd: "src/firefox", src: ['**', '!package.json'], dest: 'firefox-extension/lib/' }
        ]
    bower:
      dev:
        dest: 'bower_dest'
    watch:
      all:
        files: ['src/**']
        tasks: ['build:sources', 'build:manifests', 'build:icons']
    zip:
      'chrome': { cwd: 'chrome-extension/', src: ['chrome-extension/**'], dest: 'chrome-extension.zip' }

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

    grunt.file.write 'chrome-extension/manifest.json', JSON.stringify(mnf)

  grunt.registerTask 'build:manifest-firefox', 'Build firefox manifest file.', () ->
    mnf = grunt.file.readJSON 'src/firefox/package.json'
    pckg = grunt.file.readJSON 'package.json'

    mnf.name  = pckg.name
    mnf.title = pckg.name
    mnf.version = pckg.version
    mnf.description = pckg.description

    grunt.file.write 'firefox-extension/package.json', JSON.stringify(mnf)

  grunt.registerTask 'build:icons', ['image_resize']
  grunt.registerTask 'build:sources', ['copy:src']
  grunt.registerTask 'build:manifests', ['build:manifest-chrome', 'build:manifest-firefox']
  grunt.registerTask 'build', ['bower', 'build:sources', 'build:manifests', 'build:icons', 'bower', 'zip']
  grunt.registerTask 'run', ['build', 'watch']
  grunt.registerTask 'default', ['build']
