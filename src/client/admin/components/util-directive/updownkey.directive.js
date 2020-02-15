angular.module('travelAdmin').directive('kngUpDownKey', function () {
    return {
        restrict: 'A',
        scope: {
            type: '@type',
            index: '=',
            value: '=',
            list: '=',
            listId: '@listId',
            funCall: '&callbackFun'
        },
        transclude: true,
        link: function (scope, element, attrs) {
            var target = element[0]
            var targetList
            scope.count = undefined
            target.onkeyup = function (event) {
                targetList = document.querySelectorAll('#' + scope.listId + (scope.type ? (scope.type + scope.index) : scope.index))
                if (scope.list && scope.list.length) {
                    removeSelectClass(targetList)
                    if (event.keyCode == 40) {
                        if (scope.count === undefined) {
                            scope.count = 0
                        } else if (scope.count < scope.list.length - 1) {
                            scope.count++
                        }
                        targetList[scope.count].classList.add('list-selectable')
                    } else if (event.keyCode == 38) {
                        if (scope.count === undefined) {
                            scope.count = scope.list.length - 1
                        } else if (scope.count > 0) {
                            scope.count--
                        }
                        targetList[scope.count].classList.add('list-selectable')
                    } else if (!event.shiftKey && (event.which == 13 || event.keyCode == 13)) {
                        if (scope.count != undefined) {
                            scope.$apply(function () {
                                var value = scope.value != undefined ? scope.value : scope.index
                                scope.funCall({
                                    index: value,
                                    search: scope.list[scope.count],
                                    type: scope.type || null
                                })
                                scope.count = undefined
                            })
                        }
                    }
                }
            }
            function removeSelectClass (nodeList) {
                var nodeArray = Array.prototype.slice.call(nodeList)
                nodeArray.forEach(function (singleNode) {
                    if (singleNode.classList.contains('list-selectable')) {
                        singleNode.classList.remove('list-selectable')
                    }
                })
            }
        },
        controller: function ($scope, $rootScope) {
            $rootScope.$on('UPDATE:Count', function (err, data) {
                $scope.count = undefined
            })
        }
    }
})
