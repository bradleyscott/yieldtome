var EditEventPage = function() {

    this.nameInput = element(by.model('event.Name'));
    this.descriptionInput = element(by.model('event.Description'));
    this.startDateInput = element(by.model('startDate'));
    this.endDateInput = element(by.model('endDate'));
    this.saveButton = element(by.id('saveButton'));
    this.backButton = element(by.id('backButton'));
    this.deleteButton = element(by.id('deleteButton'));
    this.deleteCancelButton = element(by.id('deleteCancelButton'));
    this.deleteConfirmButton = element(by.id('deleteConfirmButton'));

    this.getCurrentEventDetails = function() {
        var deferred = protractor.promise.defer();

        this.nameInput.getAttribute('value')
            .then(function(value) {
                deferred.fulfill(value);
            });

        return deferred.promise;
    };

    // Only changes Name and Description due to limitations of Selenium on HTML5 input fields
    this.editEvent = function(name, description) {
        this.nameInput.clear();
        this.nameInput.sendKeys(name);

        // this.descriptionInput.clear();
        // this.descriptionInput.sendKeys(description);

        this.saveEvent();
    };

    this.saveEvent = function() {
        this.saveButton.click();
    };

    this.showDeleteConfirmation = function() {
        this.deleteButton.click();
    };

    this.cancelDeleteEvent = function() {
        this.deleteCancelButton.click();
    };

    this.deleteEvent = function() {
        this.showDeleteConfirmation();
        this.deleteConfirmButton.click();
    };
};

module.exports = new EditEventPage();
