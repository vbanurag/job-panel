import fetch from 'isomorphic-fetch'

function createFetch ({ baseUrl, cookie }) {
  const defaults = {
    method: 'POST',
    mode: baseUrl ? 'cors' : 'same-origin',
    credentials: baseUrl ? 'include' : 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : null)
    }
  }

  return (url, options) => {
    if (url.startsWith('/graphql') || url.startsWith('/api')) {
      return fetch(`${baseUrl}${url}`, {
        ...defaults,
        ...options,
        headers: {
          ...defaults.headers,
          ...(options && options.headers)
        }
      })
    }
    return fetch(url, options)
  }
}

export default createFetch
