'use strict'

angular.module('travelAdmin')
    .config(function ($stateProvider) {

        $stateProvider
            .state('city', {
                url: '/city',
                template: '<div ui-view></div>'
            })
            .state('city.list', {
                url: '/list?max&offset&q&level',
                templateUrl: 'components/city/city.list.html',
                controller: 'cityListController as city'
            })
            .state('city.create', {
                url: '/create',
                templateUrl: 'components/city/city.edit.html',
                controller: 'cityFormController as cityForm'
            })
            .state('city.edit', {
                url: '/edit/:friendlyUrl',
                templateUrl: 'components/city/city.edit.html',
                controller:'cityFormController as cityForm'
            })

    });
