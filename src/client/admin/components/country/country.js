'use strict'

angular.module('travelAdmin')
    .config(function ($stateProvider) {

        $stateProvider
            .state('country', {
                url: '/country',
                template: '<div ui-view></div>'
            })
            .state('country.list', {
                url: '/list?max&offset&q',
                templateUrl: 'components/country/country.list.html',
                controller: 'countryListController as country'
            })
            .state('country.create', {
                url: '/create',
                templateUrl: 'components/country/country.edit.html',
                controller: 'countryFormController as countryForm'
            })
            .state('country.edit', {
                url: '/edit/:friendlyUrl',
                templateUrl: 'components/country/country.edit.html',
                controller:'countryFormController as countryForm'
            })

    });
