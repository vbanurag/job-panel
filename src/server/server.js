import path from 'path'
import Promise from 'bluebird'
import express from 'express'
import cookieParser from 'cookie-parser'
import requestLanguage from 'express-request-language'
import bodyParser from 'body-parser'
import expressGraphQL from 'express-graphql'
import React from 'react'
import ReactDOM from 'react-dom/server'
import {getDataFromTree} from 'react-apollo'
import PrettyError from 'pretty-error'
import {IntlProvider} from 'react-intl'
import mongoose from 'mongoose'
import passport from 'passport'
import morgan from 'morgan'
import boom from 'express-boom'
import compression from 'compression'
import assets from './assets.json'
import App from '../client/components/App'
import Html from '../client/components/Html'
import createFetch from './createFetch'

import router from './router'
import configureStore from '../client/store/configureStore'
import config from './config'
import {setRuntimeVariable} from '../../src/client/actions/runtime'
import apiRoutes from './api-routes'
import { ErrorPageWithoutStyle } from '../client/routes/error/ErrorPage'
import cors from "cors";
//import './serverIntlPolyfill'

const MONGO_URL = config.databaseUrl

mongoose.Promise = global.Promise
mongoose.connect(MONGO_URL, { useMongoClient: true })
  .then(() => console.log(`Database connected at ${MONGO_URL}`))
  .catch(err => console.log(`Database connection error: ${err.message}`))

const app = express()
const appRoot = path.resolve(__dirname)

// setup graphql data endpoint
const graphqlMiddleware = expressGraphQL(req => ({
  schema,
  graphiql: process.env.APP  ? process.env.APP === 'dev' : true,
  rootValue: { request: req },
  pretty: __DEV__,
  formatError: error => ({
    message: error.message,
    // state: error.originalError && error.originalError.state,
    // locations: error.locations,
    path: error.path,
    // details: __DEV__ ? error.stack : null,
    statusCode: error.originalError && error.originalError.statusCode,
    error: error.originalError && error.originalError.error
  })
}))

global.navigator = global.navigator || {}
global.navigator.userAgent = global.navigator.userAgent || 'all'

app.use(cors())
app.use(compression())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static(path.join(appRoot, 'public')))
app.use(cookieParser())
app.use(boom())
app.use(passport.initialize())
app.use(passport.session())

process.env.NODE_ENV === 'production'
  ? app.use(morgan('common'))
  : app.use(morgan('dev'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

if (__DEV__) {  // eslint-disable-line no-undef
  app.enable('trust proxy')
}


app.use('/api/v1/',apiRoutes)


// Setup SSR
app.get('*', async(req, res, next) => {
  try {
    /*const apolloClient = createApolloClient({
      schema,
      rootValue: {
        request: {...req,}
      }
    })*/

    const fetch = createFetch({
      baseUrl: config.api.serverUrl,
      cookie: req.headers.cookie,
    })

    const initialState = {
      user: req.user || null
    }

    const store = configureStore(initialState, {
      cookie: req.headers.cookie,
      fetch,
      history: null
    })

    store.dispatch(setRuntimeVariable({
      name: 'initialNow',
      value: Date.now()
    }))
    store.dispatch(setRuntimeVariable({
      name: 'availableLocales',
      value: config.locales
    }))

    const locale = 'sv' || req.language

    /*await store.dispatch(setLocale({
      locale
    }))*/

    const css = new Set()

    let data = {
      title: '',
      description: ''
    }

    const context = {
      insertCss: (...styles) => {
        styles.forEach(style => {
          css.add(style._getCss())
        })
      },
        setTitle: value => (data.title = value),
        setMeta: (key, value) => (data[key] = value),
      fetch,
      store,
      storeSubscription: null,
      pathname: req.path
    }

    // Client routes
    // Universal router
    const route = await router.resolve({
      ...context,
      path: req.path,
      query: req.query,
      locale
    })


    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect)
    }

    data = {...route}
    const rootComponent = (
      <App context={context} store={store}>
        {route.component}
      </App>
    )

    await getDataFromTree(rootComponent)
    // lets see if this is needed
    await Promise.delay(0)
    data.children = await ReactDOM.renderToString(rootComponent)
    data.styles = [
      {id: 'css', cssText: [...css].join('')}
    ]
    data.scripts = [
      assets.vendor.js,
      assets.client.js
    ]

    if (assets[route.chunk]) {
      data.scripts.push(assets[route.chunk].js)
    }

    const namedRoute = router.root.children.map(route => {
      return {
        path: route.path,
        name: route.name
      }
    })

    data.app = {
      apiUrl: config.api.clientUrl,
      authUrl: config.api.serverUrl,
      state: context.store.getState(),
      lang: locale,
      route: namedRoute
    }

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />)
    res.status(route.status || 200)
    res.send(`<!doctype html>${html}`)
  } catch (err) {
    next(err)
  }
})

// Error handling
const pe = new PrettyError()
pe.skipNodeFiles()
pe.skipPackage('express')

/*
app.use((err, req, res, next) => {
  const locale = req.language
  console.error(pe.render(err))
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title='Internal Server Error'
      description={err.message}
      styles={[{id: 'css', cssText: errorPageStyle._getCss()}]}
      app={{lang: locale}}>
    {ReactDOM.renderToString()}
    </Html>
  )
  res.status(err.status || 500)
  res.send(`<!doctype html>${html}`)
})
*/

app.listen(config.port, () => {
  console.info(`The server is running at http://localhost:${config.port}/`)
})