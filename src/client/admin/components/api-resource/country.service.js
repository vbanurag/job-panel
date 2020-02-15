'use strict'

angular.module('travelAdmin')
    .factory('CountryAPI', function ($resource) {
        return $resource('/api/v1/admin/country/:controller/:id/:friendlyUrl', {
                id: '@_id'
            },
            {
                fetchCountries: {
                    method: 'GET'
                },
                getCountry: {
                    method: 'GET'
                },
                create: {
                    method: 'POST'
                },
                update: {
                    method: 'PUT'
                }
            })
    });
