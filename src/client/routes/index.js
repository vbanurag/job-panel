
export default {

  path: '/',

  // Keep in mind, routes are evaluated in order
  children: [
    require('./home').default,
    require('./about').default,

    // Wildcard routes, e.g. { path: '*', ... } (must go last)
    //require('./notFound').default
  ],

  async action ({ next }) {
    // Execute each child route until one of them return the result
    const route = await next()

    // Provide default values for title, description etc.
    route.title = `${route.title}`|| ''
    route.description = route.description || ''

    return route
  }

}
