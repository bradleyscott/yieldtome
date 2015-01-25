exports.config = {

    allScriptsTimeout: 11000,

    specs: [
        'e2e/loginScenarios.js',
        'e2e/event/listEventScenarios.js',
        //'e2e/event/editEventScenarios.js',
        //'e2e/event/createEventScenarios.js',
        'e2e/event/deleteEventScenarios.js',
    ],

    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
            'args': ["user-data-dir=C:\\Chrome-Profile"]
        }
    },

    suites: {
        login: 'e2e/loginScenarios.js',
        events: 'e2e/event/*.js'
    },

    baseUrl: 'http://localhost:8000/app/',

    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000,
        showColors: true
    },
};
