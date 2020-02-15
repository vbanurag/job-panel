'use strict'

angular.module('travelAdmin')
    .factory('ContinentAPI', function ($resource) {
        return $resource('/api/v1/admin/continent/:controller/:id/:friendlyUrl', {
                id: '@_id'
            },
            {
                fetchContinents: {
                    method: 'GET'
                },
                getContinent: {
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
