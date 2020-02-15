'use strict'

angular.module('travelAdmin')
    .controller( "continentListController", continentListController )
    .controller( "continentFormController", continentFormController )

continentListController.$inject = [ '$stateParams', '$state', '$location', 'toaster','ContinentAPI' ]
continentFormController.$inject = [ '$stateParams', '$state', 'toaster', 'ContinentAPI' ]

function continentListController( $stateParams, $state, $location, toaster, ContinentAPI ) {

    let continent = this
    continent.loading = true
    continent.q = ''
    continent.continents = []

    continent.refresh = refresh
    continent.edit = edit
    continent.setActivatedStatus = setActivatedStatus

    init()

    function refresh (page) {
        let pageNumber = page || continent.currentPage || 1
        let offset = pageNumber ? (pageNumber - 1) * continent.max : 0
        let params = (offset >= 0) ? {max: continent.max, offset: offset} : {}
        params.q = continent.q
        $state.transitionTo('continent.list', params)
    }

    function edit (targetCont, $index) {
        $state.transitionTo('continent.edit', {friendlyUrl: targetCont.friendlyUrl})
    }

    function setActivatedStatus(targetCont, status) {
        targetCont.isActivated = status
        delete targetCont._id
        let saveContinent = ContinentAPI.update(targetCont)
        saveContinent.$promise.then(function (data) {
            if( data.message === 'Done'){
                $state.transitionTo('continent.list')
            } else {
                toaster.pop('error', 'Error in saving', 'Something went wrong')
            }
        })
    }


    function init () {
        let Continents = ContinentAPI.fetchContinents()
        Continents.$promise.then(function (data) {
            continent.loading = false
            continent.continents = data.continents
        })
    }

}

function continentFormController ( $stateParams, $state, toaster, ContinentAPI) {

    let continent = this
    continent.payload = {
        status: 'DRAFT'
    }
    continent.loading = true

    continent.toggleStatus = toggleStatus
    continent.saveOrUpdate = saveOrUpdate

    init()

    function toggleStatus(payload, status) {
        continent.payload.status = status
    }

    function init () {
        const friendlyUrl = $stateParams.friendlyUrl
        continent.isNewOperation = !angular.isDefined(friendlyUrl)

        if( continent.isNewOperation ) {
            continent.loading = false
            continent.payload = {
                status: 'DRAFT'
            }
        } else {
            let Continents = ContinentAPI.getContinent({
                friendlyUrl: friendlyUrl
            })
            Continents.$promise.then(function (data) {
                continent.loading = false
                if( data && data.continent ) {
                    continent.payload = data.continent
                } else {
                    toaster.pop('error','Invalid', 'No data Found')
                }
            })
        }
    }

    function saveOrUpdate() {
        continent.loading = true
        if ( continent.isNewOperation ) {
            let saveContinent = ContinentAPI.create(continent.payload)
            saveContinent.$promise.then(function (data) {
                if( data.message === 'Done'){
                    $state.transitionTo('continent.list')
                } else {
                    toaster.pop('error', 'Error in saving', 'Something went wrong')
                }
            })
        } else {
            delete continent.payload._id
            let saveContinent = ContinentAPI.update(continent.payload)
            saveContinent.$promise.then(function (data) {
                if( data.message === 'Done'){
                    $state.transitionTo('continent.list')
                } else {
                    toaster.pop('error', 'Error in saving', 'Something went wrong')
                }
            })
        }
    }
}
