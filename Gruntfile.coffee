module.exports = (grunt) ->
  grunt.initConfig
    image_resize:
      icon16:
        options: width: 16
        files: 'chrome-extension/icon16.png': 'src/icon.png'
      icon48:
        options: width: 48
        files: 'chrome-extension/icon48.png': 'src/icon.png'
      icon128:
        options: width: 128
        files: 'chrome-extension/icon128.png': 'src/icon.png'
    copy:
      src:
        files: [
          { expand: true, cwd: "src", src: ['**', '!manifest.json'], dest: 'chrome-extension/' }
        ]
    bower:
      dev:
        dest: 'chrome-extension'
    watch:
      all:
        files: ['src/*']
        tasks: ['build:manifest', 'copy:src' ]
    zip:
      'chrome': { cwd: 'chrome-extension/', src: ['chrome-extension/**'], dest: 'chrome-extension.zip' }

  grunt.loadNpmTasks 'grunt-image-resize'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-bower'
  grunt.loadNpmTasks 'grunt-zip'

  grunt.registerTask 'build:manifest', 'Build chrome manifest file.', () ->
    mnf = grunt.file.readJSON 'src/manifest.json'
    pckg = grunt.file.readJSON 'package.json'

    mnf.name = pckg.name
    mnf.version = pckg.version
    mnf.description = pckg.description

    mnf.icons =
      "16": "icon16.png"
      "48": "icon48.png"
      "128": "icon128.png"

    grunt.file.write 'chrome-extension/manifest.json', JSON.stringify(mnf)

  grunt.registerTask 'build:icons', ['image_resize:icon16', 'image_resize:icon48', 'image_resize:icon128']
  grunt.registerTask 'build:sources', ['copy:src']
  grunt.registerTask 'build', ['build:sources', 'build:manifest', 'build:icons', 'bower', 'zip']
  grunt.registerTask 'run', ['build:manifest', 'bower', 'build', 'watch']
  grunt.registerTask 'default', ['build']
