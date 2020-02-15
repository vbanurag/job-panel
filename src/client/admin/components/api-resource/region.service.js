'use strict'

angular.module('travelAdmin')
    .factory('regionAPI', function ($resource) {
        return $resource('/api/v1/admin/region/:controller/:id/:friendlyUrl', {
                id: '@_id'
            },
            {
                fetchRegions: {
                    method: 'GET'
                },
                getRegion: {
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
