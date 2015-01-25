var ListEventsPage = function() {

    this.eventsFilter = element(by.model('query'));
    this.eventList = element.all(by.repeater('event in events'));
    this.createButton = element(by.id('createButton'));
    this.editButton = function(event) {
        return event.element(by.id('editButton'));
    };
    this.selectedEventName = element(by.binding('event.Name'));
    this.selectedEventDescription = element(by.binding('event.Description'));
    this.selectedEventDates = element(by.binding('event.DisplayDate'));
    this.selectedEventAttendees = element.all(by.repeater('attendee in attendees'));
    this.selectedEventAttendeesFilter = element(by.model('queryAttendees'));
    this.clearEventButton = element(by.id('clearEventButton'));

    this.open = function() {
        browser.get('#/events');
    };

    this.getEvent = function(index) {
        if (index == 'first') {
            return this.eventList.first();
        } else if (index == 'last') {
            return this.eventList.last();
        } else {
            return this.eventList.get(index);
        }
    };

    this.editEvent = function(index) {
        var eventToEdit = this.getEvent(index);
        this.editButton(eventToEdit).click();
    };

    this.selectEvent = function(index) {
        this.getEvent(index).click();
    };

    this.clearEvent = function(){
        this.clearEventButton.click();
    };

    this.createEvent = function() {
        this.createButton.click();
    };

    this.clearEventFilter = function() {
        this.eventsFilter.clear();
    };
    
    this.filterEvents = function(filter) {
        this.eventsFilter.sendKeys(filter);
    };

    this.clearAttendeeFilter = function(){
        this.selectedEventAttendeesFilter.clear();
    };

    this.filterAttendees = function(filter) {
        this.selectedEventAttendeesFilter.sendKeys(filter);
    };
};

module.exports = new ListEventsPage();
