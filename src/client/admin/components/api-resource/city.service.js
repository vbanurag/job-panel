'use strict'

angular.module('travelAdmin')
    .factory('cityAPI', function ($resource) {
        return $resource('/api/v1/admin/city/:controller/:id/:friendlyUrl', {
                id: '@_id'
            },
            {
                fetchCities: {
                    method: 'GET'
                },
                getCity: {
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
