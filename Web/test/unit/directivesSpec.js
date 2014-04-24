'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {
  beforeEach(module('yieldtome.directives'));

  describe('homemenu', function() {
    it('should render the Home page menu', function() {
      inject(function($compile, $rootScope) {
        var element = $compile('<homemenu></homemenu>')($rootScope);
        expect(element.html().length).toBeGreaterThan(20);
        console.log("Home Menu HTML: " + element.html());
        console.log("HTML char count: " + element.html().length);
      });
    });
  });
  
  describe('app-version', function() {
    it('should print current version', function() {
      module(function($provide) {
        $provide.value('version', 'TEST_VER');
      });
      inject(function($compile, $rootScope) {
        var element = $compile('<span app-version></span>')($rootScope);
        expect(element.text()).toEqual('TEST_VER');
      });
    });
  });
});
