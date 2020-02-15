'use strict'

angular.module('travelAdmin')
    .config(function ($stateProvider) {

        $stateProvider
            .state('region', {
                url: '/region',
                template: '<div ui-view></div>'
            })
            .state('region.list', {
                url: '/list?max&offset&q&level',
                templateUrl: 'components/region/region.list.html',
                controller: 'regionListController as Region'
            })
            .state('region.create', {
                url: '/create',
                templateUrl: 'components/region/region.edit.html',
                controller: 'regionFormController as regionForm'
            })
            .state('region.edit', {
                url: '/edit/:friendlyUrl',
                templateUrl: 'components/region/region.edit.html',
                controller:'regionFormController as regionForm'
            })

    });
