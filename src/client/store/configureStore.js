import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import createRootReducer from '../reducers'
import createHelpers from './createHelpers'
import createLogger from './logger'

export default function configureStore (initialState, config) {
  const helpers = createHelpers(config)
  //const { apolloClient } = config

  const middleware = [
    thunk.withExtraArgument(helpers),
    //apolloClient.middleware()
  ]

  let enhancer

  if (__DEV__) {  // eslint-disable-line no-undef
    middleware.push(createLogger())

    // https://github.com/zalmoxisus/redux-devtools-extension#redux-devtools-extension
    let devToolsExtension = f => f
    if (process.env.BROWSER && window.devToolsExtension) {
      devToolsExtension = window.devToolsExtension()
    }

    enhancer = compose(
      applyMiddleware(...middleware),
      devToolsExtension
    )
  } else {
    enhancer = applyMiddleware(...middleware)
  }

  const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT_USER') {
      state = undefined
    }
    return appReducer(state, action)
  }

  const appReducer = createRootReducer()

  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  const store = createStore(rootReducer, initialState, enhancer)

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (__DEV__ && module.hot) {  // eslint-disable-line no-undef
    module.hot.accept('../reducers', () =>
      // Don't forget to remove `()` if you change reducers back to normal rootReducer.
      // eslint-disable-next-line global-require
      store.replaceReducer(require('../reducers').default())
    )
  }

  return store
}
