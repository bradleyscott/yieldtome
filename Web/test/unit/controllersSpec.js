'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  beforeEach(module('yieldtome.controllers'));

  it('should ....', inject(function($controller) {
    //spec body
    var home1 = $controller('Home');
    expect(home1).toBeDefined();
  }));
  
  it('should ....', inject(function($controller) {
    //spec body
    var myCtrl1 = $controller('MyCtrl1');
    expect(myCtrl1).toBeDefined();
  }));

  it('should ....', inject(function($controller) {
    //spec body
    var myCtrl2 = $controller('MyCtrl2');
    expect(myCtrl2).toBeDefined();
  }));
});
