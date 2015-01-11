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
            test: {
                src: ['dist/js/yieldtome.js','dist/index.html'],
                overwrite: true,
                replacements: [{
                  from: "localhost:1337",
                  to: "chat-api.yieldto.me:1337"
                },
                {
                  from: "233412823470428",
                  to: "120213154812744"
                },
                {
                  from: "http://localhost:61353/",
                  to: "https://test-api.yieldto.me/"
                }]
            },
            beta: { 
				src: ['dist/js/yieldtome.js', 'dist/index.html'],
				overwrite: true,
				replacements: [{
                  from: "localhost:1337",
                  to: "chat-api.yieldto.me:1338"
                },
                {
				  from: "233412823470428",
				  to: "120213154812744"
				},
				{
				  from: "http://localhost:61353/",
				  to: "https://beta-api.yieldto.me/"
				}]
            }
        },
        copy: {
            main: {
                files: [{ // Move img
                    expand: true,
                    src: ['app/img/**'],
                    dest: 'dist/img',
                    flatten: true,
                    filter: 'isFile'
                }, { // Move css
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
                    src: ['bower_components/bootstrap/dist/css/bootstrap.min.css', 
                            'bower_components/angular-loading-bar/build/loading-bar.min.css',
                            'bower_components/angular-growl/build/angular-growl.min.css',
                            'bower_components/bootstrap-material-design/dist/css/ripples.min.css',
                            'bower_components/bootstrap-material-design/dist/css/material-wfont.min.css'],
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
                        'bower_components/angular-cookies/angular-cookies.min.js',
                        'bower_components/angular-cookies/angular-cookies.min.js.map',
                        'bower_components/angular-touch/angular-touch.min.js',
                        'bower_components/angular-touch/angular-touch.min.js.map',
                        'bower_components/satellizer/satellizer.min.js',
                        'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                        'bower_components/angular-ui-sortable/sortable.min.js',
                        'bower_components/angular-loading-bar/build/loading-bar.min.js',
                        'bower_components/angular-animate/angular-animate.min.js',
                        'bower_components/angular-animate/angular-animate.min.js.map',
                        'bower_components/angular-growl/build/angular-growl.min.js',
                        'bower_components/angular-sanitize/angular-sanitize.min.js',
                        'bower_components/angular-sanitize/angular-sanitize.min.js.map',
                        'bower_components/angulartics/dist/angulartics.min.js',
                        'bower_components/angulartics/dist/angulartics-ga.min.js',
                        'bower_components/bootstrap-material-design/dist/js/ripples.min.js',
                        'bower_components/bootstrap-material-design/dist/js/material.min.js',
                        'bower_components/underscore/underscore-min.js',
                        'bower_components/underscore/underscore-min.map',
                        'bower_components/moment/min/moment.min.js',
                        'bower_components/angular-moment/angular-moment.min.js',
                        'bower_components/angular-moment/angular-moment.min.js.map'
                        'bower_components/socket.io-client/socket.io.js',
                        'bower_components/sails.io.js/sails.io.js',
                   ],
                    dest: 'dist/js',
                    flatten: true
                }, { // Move font dependencies
                    expand: true,
                    nonull: true,
                    src: ['bower_components/bootstrap/dist/fonts/**',
                    'bower_components/bootstrap-material-design/dist/fonts/**'],
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
    
    grunt.registerTask('default', ['concat', 'copy', 'replace:' + grunt.option('site'), 'uglify']);

};
