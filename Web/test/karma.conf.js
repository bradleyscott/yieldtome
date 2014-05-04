module.exports = function(config) {
    config.set({

        basePath: '../',

        preprocessors: {
            'app/partials/**/*.html': ['ng-html2js']
        },

        ngHtml2JsPreprocessor: {
            moduleName: 'yieldtome.templates'
        },

        files: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-facebook/lib/angular-facebook.js',
            'bower_components/angular-resource/angular-resource.js',
            'app/js/controllers/homeController.js',
            'app/js/services/configService.js',
            'app/js/**/*.js',
            'test/unit/**/*.js',
            'app/partials/**/*.html'
        ],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-ng-html2js-preprocessor'
        ],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }
    });
};
