var EditAttendeePage = function() {

    this.nameInput = element(by.model('selectedAttendee.Name'));
    this.saveButton = element(by.id('saveButton'));
    this.backButton = element(by.id('backButton'));
    this.deleteButton = element(by.id('deleteButton'));
    this.deleteCancelButton = element(by.id('deleteCancelButton'));
    this.deleteConfirmButton = element(by.id('deleteConfirmButton'));

    this.getCurrentAttendeeDetails = function() {
        var deferred = protractor.promise.defer();

        this.nameInput.getAttribute('value')
            .then(function(value) {
                deferred.fulfill(value);
            });

        return deferred.promise;
    };

    this.editAttendee = function(name) {
        this.nameInput.clear();
        this.nameInput.sendKeys(name);
        this.saveAttendee();
    };

    this.saveAttendee = function() {
        this.saveButton.click();
    };

    this.showDeleteConfirmation = function() {
        this.deleteButton.click();
    };

    this.cancelDeleteAttendee = function() {
        this.deleteCancelButton.click();
    };

    this.deleteAttendee= function() {
        this.showDeleteConfirmation();
        this.deleteConfirmButton.click();
    };
};

module.exports = new EditAttendeePage();
