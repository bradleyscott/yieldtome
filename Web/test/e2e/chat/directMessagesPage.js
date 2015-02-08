var DirectMessagesPage = function() {

    this.messagesFilter = element(by.model('query'));
    this.messagesList = element.all(by.repeater('message in messages'));
    this.showSendButton = element(by.id('showSendButton'));
    this.messageInput = element(by.model('messageToSend'));
    this.cancelSendButton = element(by.id('sendCancelButton'));
    this.showLikeButton =  element(by.id('showSendButton'));
    this.likeCancelButton = element(by.id('likeCancelButton'));
    this.likeConfirmButton = element(by.id('likeConfirmButton'));

    this.sendMessage = function(message) {
        this.showSendButton.click();
        this.messageInput.sendKeys(message);
        this.messageInput.sendKeys('\n');
    };

    this.cancelSendMessage = function() {
        this.showSendButton.click();
        this.cancelSendButton.click();
    };

    this.likeAttendee = function(){
        this.showLikeButton.click();
        this.likeConfirmButton.click();
    };

    this.cancelLikeAttendee = function(){
        this.showLikeButton.click();
        this.likeCancelButton.click();
    };

    this.filterMessages = function(filter) {
        this.messagesFilter.sendKeys(filter);
    };

    this.clearMessagesFilter = function(){
        this.messagesFilter.clear();
    };
};

module.exports = new DirectMessagesPage();
