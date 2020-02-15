var app = angular.module('travelAdmin', [
    'ui.router',
    'ui.bootstrap',
    'ngResource',
    'ngDraggable',
    'ngStorage',
    'ui.bootstrap',
    // 'angular-bootstrap-confirm',
    'LocalStorageModule',
    'ngTagsInput',
    'ngFileUpload',
    'cloudinary',
    'angularjs-dropdown-multiselect',
    'toaster',
    'ngAnimate',
    'truncate'
])

app.config(appConfigurations)

appConfigurations.$inject = [
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    '$httpProvider',
    'cloudinaryProvider'
]

function appConfigurations(
    $stateProvider,
    $urlRouterProvider,
    $locationProvider,
    $httpProvider,
    cloudinaryProvider) {
    $stateProvider
        .state('dashboard', {
            url: '/',
            templateUrl: 'components/dashboard/dashboard.html',
            controller: 'DashboardCtrl as dashboardCtrl'
        })

    $locationProvider.html5Mode(true)
    $urlRouterProvider.otherwise('/')

    let cloudName
    let uploadPreset


    cloudinaryProvider
        .set('url', 'https://api.cloudinary.com/v1_1/')
        .set('cloud_name', cloudName)
        .set('upload_preset', uploadPreset)

    $httpProvider.interceptors.push(function ($q, $localStorage) {
        return {
            request: function (config) {
                config.headers.Authorization = 'Bearer ' + localStorage.getItem('token')
                var regex = /api.cloudinary.com/i
                if (regex.test(config.url)) {
                    delete config.headers.Authorization
                }
                return config
            }
        }
    })
}
