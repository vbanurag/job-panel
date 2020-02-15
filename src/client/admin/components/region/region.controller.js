'use strict'

angular.module('travelAdmin')
    .controller( "regionListController", regionListController )
    .controller( "regionFormController", regionFormController )

regionListController.$inject = [ '$stateParams', '$state', '$location', 'toaster','regionAPI']
regionFormController.$inject = [ '$stateParams', '$state', 'toaster', 'ContinentAPI' , 'cityAPI', 'CountryAPI', 'regionAPI']

function regionListController( $stateParams, $state, $location, toaster, regionAPI ) {

    let region  = this
    region.loading = true
    region.q = ''
    region.regions = []
    region.max = +$stateParams.max || 10
    region.maxSize = 10
    region.offset =+$stateParams.offset || 0
    region.totalItems = 0
    region.currentPage = 1


    region.refresh = refresh
    region.edit = edit
    region.setActivatedStatus = setActivatedStatus

    init()

    function refresh (page) {
        let pageNumber = page || region.currentPage || 1
        let offset = pageNumber ? (pageNumber - 1) * region.max : 0
        let params = (offset >= 0) ? {max: region.max, offset: offset} : {}
        params.q = region.q
        $state.transitionTo('region.list', params)
    }

    function edit (targetRegion, $index) {
        $state.transitionTo('region.edit', {friendlyUrl: targetRegion.friendlyUrl})
    }

    function setActivatedStatus(targetRegion, status) {
        targetRegion.isActivated = status
        delete targetRegion._id
        let saveRegion = regionAPI.update(targetRegion)
        saveRegion.$promise.then(function (data) {
            if( data.message === 'Done'){
                $state.transitionTo('region.list')
            } else {
                toaster.pop('error', 'Error in saving', 'Something went wrong')
            }
        })
    }


    function init () {
        let regions = regionAPI.fetchRegions({
            max: region.max,
            offset: region.offset,
            q: region.q
        })
        regions.$promise.then(function (data) {
            region.loading = false
            region.regions = data.regions
            region.totalItems = +data.count
            region.currentPage = (region.offset / region.max) + 1

        })
    }

}

function regionFormController ( $stateParams, $state, toaster, ContinentAPI, cityAPI, CountryAPI, regionAPI) {

    let region = this
    region.payload = {
        status: 'DRAFT',
        isActivated: true
    }
    region.loading = true

    region.toggleStatus = toggleStatus
    region.saveOrUpdate = saveOrUpdate
    region.getContinents = getContinents
    region.setContinent = setContinent
    region.getCountries = getCountries
    region.setCountry = setCountry

    init()

    function toggleStatus(payload, status) {
        region.payload.status = status
    }

    function setContinent(value) {
        region.payload.continent = {
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
        region.payload.country = {
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
        region.isNewOperation = !angular.isDefined(friendlyUrl)

        if( region.isNewOperation ) {
            region.loading = false
            region.payload = {
                status: 'DRAFT'
            }
        } else {
            let fetchRegion = regionAPI.getRegion({
                friendlyUrl: friendlyUrl
            })
            fetchRegion.$promise.then(function (data) {
                region.loading = false
                if( data && data.region ) {
                    region.payload = data.region
                } else {
                    toaster.pop('error','Invalid', 'No data Found')
                }
            })
        }
    }

    function saveOrUpdate() {
        region.loading = true
        if ( region.isNewOperation ) {
            let saveRegion = regionAPI.create(region.payload)
            saveRegion.$promise.then(function (data) {
                if( data.message === 'Done'){
                    $state.transitionTo('region.list')
                } else {
                    toaster.pop('error', 'Error in saving', 'Something went wrong')
                }
            })
        } else {
            delete region.payload._id
            let updateRegion = regionAPI.update(region.payload)
            updateRegion.$promise.then(function (data) {
                if( data.message === 'Done'){
                    $state.transitionTo('region.list')
                } else {
                    toaster.pop('error', 'Error in saving', 'Something went wrong')
                }
            })
        }
    }
}
