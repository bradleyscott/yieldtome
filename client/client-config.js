Accounts.ui.config({
    requestPermissions: {
        facebook: ['email'],
        google: ['email', 'profile', 'me'],
        twitter: ['read'],
    },
    requestOfflineToken: {
        google: true
    },
});
