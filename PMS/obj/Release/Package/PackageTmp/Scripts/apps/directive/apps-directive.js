var app = angular.module('apps.global', [])
    .directive('focusMe', function () {
        return {
            link: function (scope, element, attrs) {
                scope.$watch(attrs.focusMe, function (value) {
                    if (value === true) {
                        element[0].focus();
                        element[0].select();
                    }
                });
            }
        };
    })
    .directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        // scope.$emit('ngRepeatFinished');
                        // Init Theme Core
                        Core.init();
                        // Init Theme Core
                        Demo.init();
                    });
                }
            }
        }
    })


    .directive('title', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
        return {
            link: function () {

                var listener = function (event, toState) {

                    $timeout(function () {
                        $rootScope.title = (toState.data && toState.data.pageTitle)
                            ? toState.data.pageTitle
                            : 'Default title';

                        $rootScope.modulename = (toState.data && toState.data.modulename)
                            ? toState.data.modulename
                            : 'Default title';

                        $rootScope.breadcrumb = (toState.data && toState.data.breadcrumb)
                            ? toState.data.breadcrumb
                            : 'Default title';
                    });
                };

                $rootScope.$on('$stateChangeSuccess', listener);
            }
        };
    }
    ])

    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })

    .directive('uppercased', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (input) {
                    return input ? input.toUpperCase() : "";
                });
                element.css("text-transform", "uppercase");
            }
        };
    })

    .filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);


