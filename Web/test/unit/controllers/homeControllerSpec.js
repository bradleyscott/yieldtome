'use strict';

describe('homeController', function() {

    beforeEach(module('yieldtome.controllers'));
    
    beforeEach(inject(function($controller) {
        $controller('HomeController');
    }));

    it('should set an error if no Api token is granted on login', inject(function($controller) {
      spyOn(AuthenticationService, "getApiToken").and.returnValue("1234");
      $controller.login();
      expect(AuthenticationService.getApiToken).toHaveBeenCalled();
      expect($scope.error).not.toBeNull();
    }));


});
