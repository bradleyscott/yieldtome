exports.config = {

    allScriptsTimeout: 11000,

    specs: [
        'e2e/loginScenarios.js',
        // 'e2e/event/listEventScenarios.js',
        //'e2e/event/editEventScenarios.js',
        //'e2e/event/createEventScenarios.js',
        //'e2e/attendee/createAttendeeScenarios.js',        
        //'e2e/event/deleteEventScenarios.js',
        //'e2e/profile/editProfileScenarios.js',
        'e2e/attendee/listAttendeeScenarios.js',
        'e2e/chat/directMessageScenarios.js'
    ],

    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
            'args': ["user-data-dir=C:\\Chrome-Profile"]
        }
    },

    baseUrl: 'http://localhost:8000/app/',

    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000,
        showColors: true
    },
};
