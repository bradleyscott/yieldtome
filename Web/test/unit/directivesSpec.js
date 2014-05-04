'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {

    var $compile, $scope;

    beforeEach(module('yieldtome.directives'));
    beforeEach(angular.mock.module('yieldtome.templates'));

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
    });
});
