
angular.module('travelAdmin')
    .directive('kngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.kngEnter);
                    });

                    event.preventDefault();
                }
            });
            scope.$on('$destroy', function () {
                element.off("keydown", "**");
                element.off("keypress", "**");
            });
        };
    });
