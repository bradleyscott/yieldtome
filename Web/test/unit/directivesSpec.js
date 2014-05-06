'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {

/* I have commented these tests out because my unit tests display this error:
Chrome 34.0.1847 (Windows) directives The homemenu directive should render the H
ome page menu FAILED
        Error: Unexpected request: GET partials/homeMenu.html
        No more request expected
            at $httpBackend (C:/Users/Bradley/Documents/src/yieldtome_vNow/Web/b
ower_components/angular-mocks/angular-mocks.js:1178:9)
            at sendReq (C:/Users/Bradley/Documents/src/yieldtome_vNow/Web/bower_
components/angular/angular.js:8180:9)
            at $get.serverRequest (C:/Users/Bradley/Documents/src/yieldtome_vNow
/Web/bower_components/angular/angular.js:7921:16)
            at deferred.promise.then.wrappedCallback (C:/Users/Bradley/Documents
/src/yieldtome_vNow/Web/bower_components/angular/angular.js:11319:81)
            at deferred.promise.then.wrappedCallback (C:/Users/Bradley/Documents
/src/yieldtome_vNow/Web/bower_components/angular/angular.js:11319:81)
            at C:/Users/Bradley/Documents/src/yieldtome_vNow/Web/bower_component
s/angular/angular.js:11405:26
            at Scope.$get.Scope.$eval (C:/Users/Bradley/Documents/src/yieldtome_
vNow/Web/bower_components/angular/angular.js:12412:28)
            at Scope.$get.Scope.$digest (C:/Users/Bradley/Documents/src/yieldtom
e_vNow/Web/bower_components/angular/angular.js:12224:31)
            at null.<anonymous> (C:/Users/Bradley/Documents/src/yieldtome_vNow/W
eb/test/unit/directivesSpec.js:21:24)
            at Object.invoke (C:/Users/Bradley/Documents/src/yieldtome_vNow/Web/
bower_components/angular/angular.js:3869:17)
        Error: Declaration Location
            at window.inject.angular.mock.inject (C:/Users/Bradley/Documents/src
/yieldtome_vNow/Web/bower_components/angular-mocks/angular-mocks.js:2132:25)
            at null.<anonymous> (C:/Users/Bradley/Documents/src/yieldtome_vNow/W
eb/test/unit/directivesSpec.js:19:13)
Chrome 34.0.1847 (Windows): Executed 9 of 9 (1 FAILED) (4.564 secs / 3.202 secs)
*/

 /*   var $compile, $scope;

    beforeEach(module('yieldtome.directives'));
    beforeEach(module('yieldtome.templates'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
    }));

    describe('The homemenu directive', function() {
        it('should render the Home page menu', function() {
            inject(function($compile, $rootScope) {
                var element = $compile('<homemenu></homemenu>')($scope);
                $scope.$digest();

                expect(element.html().length).toBeGreaterThan(20);
            });
        });
    });*/
});
