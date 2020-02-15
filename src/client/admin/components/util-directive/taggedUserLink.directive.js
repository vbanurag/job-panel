angular.module('travelAdmin')
    .directive('kngTaggedUserLink', function ($compile,$filter,$timeout) {
        return {
            restrict: 'A',
            scope: {
                commentText: '=',
                taggedUser:'=',
                commentId:'='
            },
            link: function (scope, elem) {

                scope.createTaggedLink= function () {
                    var list =scope.taggedUser || [];
                    async.each(list,function (user,cb) {
                        var userData = user[Object.keys(user)[0]];
                        var name = userData && userData.name && userData.name.full;
                        scope.taggedText = String(scope.taggedText || scope.commentText).split(Object.keys(user)[0]).join("<a class='taggedUserColor' ui-sref='main.profile({friendlyUrl:\"" + userData.friendlyUrl + "\"})'>" + '@' + name + "</a>");
                        cb()
                    }, function () {
                        var html = '';
                        if (scope.taggedText) {
                            html = $compile("<div  kng-read-more text='taggedText' limit='200' label-expand='{{labelExpand}}'  label-collapse='{{labelCollapse}}'></div>")(scope);
                        } else {
                            html = $compile("<div kng-read-more  text='commentText' limit='200' label-expand='{{labelExpand}}' label-collapse='{{labelCollapse}}'></div> ")(scope);
                        }
                        $timeout(function () {
                            elem.html(html);
                        })
                    })
                };
                scope.createTaggedLink();
            },
            controller: function ($scope,$rootScope,localStorageService,$translate) {
                $scope.listeners = {};
                $scope.lang = localStorageService.get('NG_TRANSLATE_LANG_KEY') || $translate.preferredLanguage() || 'sv';
                $scope.labelExpand = $scope.lang == "en" ? " read more" : "läs mer";
                $scope.labelCollapse = $scope.lang == "en" ? " read less" : "läs mindre";
                $scope.listeners["commentUpdate"] = $rootScope.$on("COMMENT:Update", function (err, data) {
                    if ($scope.commentId == data._id) {
                        $scope.commentText = data.editContent;
                        $scope.taggedUser = data.newTaggeUsers;
                        $scope.taggedText = '';
                        $scope.createTaggedLink();
                    }
                });
                $scope.$on("$destroy", function () {
                    for (var key in $scope.listeners) {
                        if ($scope.listeners.hasOwnProperty(key)) {
                            $scope.listeners[key]();
                        }
                    }
                });
            }
        }
    });
