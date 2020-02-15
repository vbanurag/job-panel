'use strict'

angular.module('travelAdmin')
    .factory('_', [function lodash () {
        if (!window._) {
            throw ('Lodash not found!!')
        }
        return window._
    }])
