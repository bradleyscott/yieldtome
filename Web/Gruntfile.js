module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['app/js/app.js',
                    'app/js/services/configService.js',
                    'app/js/services/**/*.js',
                    'app/js/controllers/homeController.js',
                    'app/js/controllers/**/*.js',
                    'app/js/directives.js',
                    'app/js/filters.js'
                ],
                dest: 'dist/js/<%= pkg.name %>.js'
            }
        },
        replace: {
          deploy: {
            src: ['dist/js/yieldtome.js'],
            overwrite: true,
            replacements: [{
              from: "233412823470428",
              to: "120213154812744"
            },
            {
              from: "localhost:61353",
              to: "test-api.yieldto.me"
            }]
          }
        },
        copy: {
            main: {
                files: [{ // Move css
                    expand: true,
                    src: ['app/css/**'],
                    dest: 'dist/css',
                    flatten: true,
                    filter: 'isFile'
                }, { // Move html partials
                    expand: true,
                    cwd: 'app',
                    src: ['partials/**'],
                    dest: 'dist',
                    flatten: false,
                    filter: 'isFile'
                }, { // Move css dependencies
                    expand: true,
                    nonull: true,
                    src: ['bower_components/bootstrap/dist/css/bootstrap.min.css'],
                    dest: 'dist/css',
                    flatten: true
                }, { // Move js dependencies
                    expand: true,
                    nonull: true,
                    src: [
                        'bower_components/jquery/dist/jquery.min.js',
                        'bower_components/jquery/dist/jquery.min.map',
                        'bower_components/jquery-ui/ui/minified/jquery-ui.min.js',
                        'bower_components/jquery-ui-touch-punch/jquery.ui.touch-punch.min.js',
                        'bower_components/angular/angular.min.js',
                        'bower_components/angular/angular.min.js.map',
                        'bower_components/angular-resource/angular-resource.min.js',
                        'bower_components/angular-resource/angular-resource.min.js.map',
                        'bower_components/angular-route/angular-route.min.js',
                        'bower_components/angular-route/angular-route.min.js.map',
                        'bower_components/angular-touch/angular-touch.min.js',
                        'bower_components/angular-touch/angular-touch.min.js.map',
                        'bower_components/angular-facebook/lib/angular-facebook.js',
                        'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                        'bower_components/angular-ui-sortable/sortable.min.js'
                    ],
                    dest: 'dist/js',
                    flatten: true
                }, { // Move font dependencies
                    expand: true,
                    nonull: true,
                    src: ['bower_components/bootstrap/dist/fonts/**'],
                    dest: 'dist/fonts',
                    flatten: true
                }, { // Move index.html
                    expand: true,
                    nonull: true,
                    src: ['app/index.html.dist'],
                    dest: 'dist',
                    flatten: true,
                    filter: 'isFile',
                    rename: function(dest, src) {
                        return 'dist/index.html';
                    }
                }]
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-text-replace');
    
    grunt.registerTask('default', ['concat', 'copy', 'replace', 'uglify']);

};
