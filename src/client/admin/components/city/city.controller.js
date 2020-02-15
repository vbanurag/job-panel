'use strict'

angular.module('travelAdmin')
    .controller( "cityListController", cityListController )
    .controller( "cityFormController", cityFormController )

cityListController.$inject = [ '$stateParams', '$state', '$location', 'toaster','ContinentAPI' , 'cityAPI']
cityFormController.$inject = [ '$stateParams', '$state', 'toaster', 'ContinentAPI' , 'cityAPI', 'CountryAPI']

function cityListController( $stateParams, $state, $location, toaster, ContinentAPI, cityAPI ) {

    let city  = this
    city.loading = true
    city.q = ''
    city.cities = []

    city.refresh = refresh
    city.edit = edit
    city.setActivatedStatus = setActivatedStatus

    init()

    function refresh (page) {
        let pageNumber = page || city.currentPage || 1
        let offset = pageNumber ? (pageNumber - 1) * city.max : 0
        let params = (offset >= 0) ? {max: city.max, offset: offset} : {}
        params.q = city.q
        $state.transitionTo('city.list', params)
    }

    function edit (targetCity, $index) {
        $state.transitionTo('city.edit', {friendlyUrl: targetCity.friendlyUrl})
    }

    function setActivatedStatus(targetCity, status) {
        targetCity.isActivated = status
        delete targetCity._id
        let saveCity = cityAPI.update(targetCity)
        saveCity.$promise.then(function (data) {
            if( data.message === 'Done'){
                $state.transitionTo('city.list')
            } else {
                toaster.pop('error', 'Error in saving', 'Something went wrong')
            }
        })
    }


    function init () {
        let cities = cityAPI.fetchCities()
        cities.$promise.then(function (data) {
            city.loading = false
            city.cities = data.cities
        })
    }

}

function cityFormController ( $stateParams, $state, toaster, ContinentAPI, cityAPI, CountryAPI) {

    let city = this
    city.payload = {
        status: 'DRAFT',
        isActivated: true
    }
    city.loading = true

    city.toggleStatus = toggleStatus
    city.saveOrUpdate = saveOrUpdate
    city.getContinents = getContinents
    city.setContinent = setContinent
    city.getCountries = getCountries
    city.setCountry = setCountry

    init()

    function toggleStatus(payload, status) {
        city.payload.status = status
    }

    function setContinent(value) {
        city.payload.continent = {
            id: value._id,
            name: value.name,
            friendlyUrl: value.friendlyUrl
        }
    }

    function getContinents(value) {
        let continents = ContinentAPI.fetchContinents({
            q: value
        })
        return continents.$promise.then(function (data) {
            if(data.continents.length > 0)
                return data.continents
            else {
                return[
                    {
                        name: value
                    }
                ]
            }
        })
    }

    function setCountry(value) {
        city.payload.country = {
            id: value._id,
            name: value.name,
            friendlyUrl: value.friendlyUrl
        }
    }

    function getCountries(value) {
        let countries = CountryAPI.fetchCountries({
            q: value
        })
        return countries.$promise.then(function (data) {
            if(data.countries.length > 0)
                return data.countries
            else {
                return[
                    {
                        name: value
                    }
                ]
            }
        })
    }

    function init () {
        const friendlyUrl = $stateParams.friendlyUrl
        city.isNewOperation = !angular.isDefined(friendlyUrl)

        if( city.isNewOperation ) {
            city.loading = false
            city.payload = {
                status: 'DRAFT'
            }
        } else {
            let Continents = cityAPI.getCity({
                friendlyUrl: friendlyUrl
            })
            Continents.$promise.then(function (data) {
                city.loading = false
                if( data && data.city ) {
                    city.payload = data.city
                } else {
                    toaster.pop('error','Invalid', 'No data Found')
                }
            })
        }
    }

    function saveOrUpdate() {
        city.loading = true
        if ( city.isNewOperation ) {
            let saveCity = cityAPI.create(city.payload)
            saveCity.$promise.then(function (data) {
                if( data.message === 'Done'){
                    $state.transitionTo('city.list')
                } else {
                    toaster.pop('error', 'Error in saving', 'Something went wrong')
                }
            })
        } else {
            delete city.payload._id
            let saveCity = cityAPI.update(city.payload)
            saveCity.$promise.then(function (data) {
                if( data.message === 'Done'){
                    $state.transitionTo('city.list')
                } else {
                    toaster.pop('error', 'Error in saving', 'Something went wrong')
                }
            })
        }
    }
}
