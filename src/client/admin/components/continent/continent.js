'use strict'

angular.module('travelAdmin')
    .config(function ($stateProvider) {

        $stateProvider
            .state('continent', {
                url: '/continent',
                template: '<div ui-view></div>'
            })
            .state('continent.list', {
                url: '/list?max&offset&q&level',
                templateUrl: 'components/continent/continent.list.html',
                controller: 'continentListController as continent'
            })
            .state('continent.create', {
                url: '/create',
                templateUrl: 'components/continent/continent.edit.html',
                controller: 'continentFormController as continentForm'
            })
            .state('continent.edit', {
                url: '/edit/:friendlyUrl',
                templateUrl: 'components/continent/continent.edit.html',
                controller:'continentFormController as continentForm'
            })

    });
