"use strict"

var crypto = require('crypto')
var Url = require('url')
var request = require('request')
var _ = require('underscore')


// Map from CRUD to HTTP for the default `sync` implementation.
var methodMap = {
  'create': 'POST',
  'update': 'PUT',
  'delete': 'DELETE',
  'read':   'GET'
}

module.exports = function(ngin) {
  var config = ngin.config
  var auth = ngin.auth

  // Override this function to change the manner in which Nokomis persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful HTTP request
  // to the model's `url()`.
  return function(method, model, options, callback) {
    var type = methodMap[method]

    // Default options, unless specified.
    options || (options = {})
    if (typeof options == 'function') {
      callback = options, options = {}
    }

    // Default JSON-request options.
    var params = _.extend({}, options, {
      jar: false, // don't remember cookies
      method: options.method || type,
      headers: _.extend({Accept:'application/json'}, config.headers, options.headers)
    })

    // Ensure that we have a URL.
    if (!params.url) return callback(new Error('Url not present'))

    // request expects the `url` property to be a parsed Url object
    if (typeof params.url == 'string') {
      params.url = Url.parse(params.url)
    }

    // Ensure that we have the appropriate request data.
    if (!params.data && model && (method === 'create' || method === 'update')) {
      params.headers['Content-Type'] = 'application/json'
      params.body = JSON.stringify(model)
    }

    // translate from query to qs for request
    if (params.query) {
      params.qs = _.extend({}, params.query)
    }

    // put the org id on the query string
    if (params.org_id) {
      params.qs || (params.qs = {})
      params.qs.org_id = params.org_id
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET') {
      params.processData = false
    }

    // setup authorization
    if (auth && auth.access_token) {
      params.headers.Authorization = 'Bearer ' + auth.access_token
    }

    var req = request(params, function(err, resp, body) {
      if (err) {
        console.error('Request to ' + params.url + ' resulted in an error:', err)
        return callback(err, body, resp)
      }

      console.log('NGINClient:', req.nginID, 'Status:', resp.statusCode)

      var contentType = resp.headers['content-type'] || resp.headers['Content-Type'] || ''

      var parsedBody = body
      if (contentType.match(/json/)) {
        try {
          parsedBody = JSON.parse(parsedBody)
        } catch (e) {
          console.error('API response not parsable JSON:', body)
        }
      }

      // if the response wasn't in the 2XX status
      // code block then we treat it as an error
      if (resp.statusCode >= 300) {
        var err = new Error('NGIN Request failed with ' + resp.statusCode)
        err.url = params.url
        err.statusCode = resp.statusCode
        err.body = parsedBody
        console.error(err)
        return callback(err, body, resp)
      }

      callback(err, parsedBody, resp)
    })

    // identify the request and log the url
    req.nginID = crypto.randomBytes(4).toString('hex')
    console.log('NGINClient:',
      req.nginID, params.method,
      req.uri.host.substring(0, req.uri.host.indexOf('.')),
      req.uri.path)


    return req
  }

}