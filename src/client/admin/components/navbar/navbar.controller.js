
angular.module('travelAdmin')
    .controller('NavbarCtrl', function ($scope, $location, $state) {
        $scope.menu = [
            {
                'title': 'Dashboard',
                'state': 'dashboard',
                'icon': 'fa-globe'
            },
            {
                'title': 'Continent',
                'state': 'continent.list',
                'icon': 'fa fa-th-list'
            },
            {
                'title': 'Country',
                'state': 'country.list',
                'icon': 'fa fa-th-list'
            },
            {
                'title': 'City',
                'state': 'city.list',
                'icon': 'fa fa-th-list'
            },
            {
                'title': 'Region',
                'state': 'region.list',
                'icon': 'fa fa-th-list'
            }
        ]
        $scope.isCollapsed = true

        $scope.isActive = function (state) {
            return state === $state.current.name
        }
    })
