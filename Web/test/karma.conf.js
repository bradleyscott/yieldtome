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
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/satellizer/satellizer.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'bower_components/underscore/underscore-min.js',
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
