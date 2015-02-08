var ListAttendeesPage = function() {

    this.attendeeFilter = element(by.model('query'));
    this.attendeeList = element.all(by.repeater('attendee in attendees'));
    this.myAttendee = element(by.id('thisAttendee'));
    this.createButton = element(by.id('createButton'));
    this.editButton = function(attendee) {
        return attendee.element(by.id('editButton'));
    };

    this.open = function() {
        browser.get('#/attendees');
    };

    this.editMyAttendee = function() {
        this.editButton(this.myAttendee).click();
    };

    this.getAttendee = function(index) {
        if (index == 'first') {
            return this.attendeeList.first();
        } else if (index == 'last') {
            return this.attendeeList.last();
        } else {
            return this.attendeeList.get(index);
        }
    };

    this.chatWithAttendee = function(index) {
        var attendee = this.getAttendee(index);
        attendee.click();
    };

    this.editAttendee = function(index) {
        var attendeeToEdit = this.getAttendee(index);
        this.editButton(attendeeToEdit).click();
    };

    this.createAttendee = function() {
        this.createButton.click();
    };
    
    this.filterAttendees = function(filter) {
        this.attendeeFilter.sendKeys(filter);
    };

    this.clearAttendeeFilter = function(){
        this.attendeeFilter.clear();
    };
};

module.exports = new ListAttendeesPage();
