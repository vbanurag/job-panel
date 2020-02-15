'use strict'

angular.module('travelAdmin')
    .controller( "countryListController", countryListController )
    .controller( "countryFormController", countryFormController )

countryListController.$inject = [ '$stateParams', '$state', '$location', 'toaster','CountryAPI' ]
countryFormController.$inject = [ '$stateParams', '$state', 'toaster', 'CountryAPI', 'ContinentAPI' ]

function countryListController( $stateParams, $state, $location, toaster, CountryAPI ) {

    let country = this
    country.loading = true
    country.q = ''
    country.countrys = []

    country.refresh = refresh
    country.edit = edit
    country.setActivatedStatus = setActivatedStatus

    init()

    function refresh (page) {
        let pageNumber = page || country.currentPage || 1
        let offset = pageNumber ? (pageNumber - 1) * country.max : 0
        let params = (offset >= 0) ? {max: country.max, offset: offset} : {}
        params.q = country.q
        $state.transitionTo('country.list', params)
    }

    function edit (targetCont, $index) {
        $state.transitionTo('country.edit', {friendlyUrl: targetCont.friendlyUrl})
    }

    function setActivatedStatus(targetCont, status) {
        targetCont.isActivated = status
        delete targetCont._id
        let savecountry = CountryAPI.update(targetCont)
        savecountry.$promise.then(function (data) {
            if( data.message === 'Done'){
                $state.transitionTo('country.list')
            } else {
                toaster.pop('error', 'Error in saving', 'Something went wrong')
            }
        })
    }


    function init () {
        let Countries = CountryAPI.fetchCountries()
        Countries.$promise.then(function (data) {
            country.loading = false
            country.countries = data.countries
        })
    }

}

function countryFormController ( $stateParams, $state, toaster, CountryAPI, ContinentAPI) {

    let country = this
    country.payload = {
        status: 'DRAFT'
    }
    country.loading = true

    country.toggleStatus = toggleStatus
    country.saveOrUpdate = saveOrUpdate
    country.getContinents = getContinents
    country.setContinent = setContinent

    init()

    function toggleStatus(payload, status) {
        country.payload.status = status
    }

    function setContinent(value) {
        country.payload.continent = {
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

    function init () {
        const friendlyUrl = $stateParams.friendlyUrl
        country.isNewOperation = !angular.isDefined(friendlyUrl)

        if( country.isNewOperation ) {
            country.loading = false
            country.payload = {
                status: 'DRAFT'
            }
        } else {
            let countries = CountryAPI.getCountry({
                friendlyUrl: friendlyUrl
            })
            countries.$promise.then(function (data) {
                country.loading = false
                if( data && data.country ) {
                    country.payload = data.country
                } else {
                    toaster.pop('error','Invalid', 'No data Found')
                }
            })
        }
    }

    function saveOrUpdate() {
        country.loading = true
        if ( country.isNewOperation ) {
            let savecountry = CountryAPI.create(country.payload)
            savecountry.$promise.then(function (data) {
                if( data.message === 'Done'){
                    $state.transitionTo('country.list')
                } else {
                    toaster.pop('error', 'Error in saving', 'Something went wrong')
                }
            })
        } else {
            delete country.payload._id
            let savecountry = CountryAPI.update(country.payload)
            savecountry.$promise.then(function (data) {
                if( data.message === 'Done'){
                    $state.transitionTo('country.list')
                } else {
                    toaster.pop('error', 'Error in saving', 'Something went wrong')
                }
            })
        }
    }
}
