
var _ = require('underscore')
var extendable = require('extendable')
var sync = require('./sync')

var noop = function(){}

var Model = function(attributes, options) {
  _.extend(this, attributes)
  this.initialize.apply(this, arguments)
}

// Instance methods
// ================

_.extend(Model.prototype, {

  initialize: function() {},

  isValid: function(options) {
    return !this.validate || !this.validate(options)
  },

  fetch: function(options, callback) {
    var self = this
    if (typeof options == 'function') {
      callback = options
      options = {}
    }
    sync('read', this, options, function(err, data, resp) {
      if (err) return callback(err)
      data = self.parse(data, resp)
      _.extend(self, data)
      callback(err, data)
    })
  },

  save: function(options, callback) {
    var self = this
    if (typeof options == 'function') {
      callback = options
      options = {}
    }

    if (!this.isValid()) return callback('Model is not in a valid state.')

    var method = !!this.id ? 'update' : 'create'
    sync(method, this, options, function(err, data, resp) {
      if (err) return callback(err)
      data = self.parse(data, resp)
      _.extend(self, data)
      callback(err, data)
    })
  },

  destroy: function(options, callback) {
    if (typeof options == 'function') {
      callback = options
      options = {}
    }
    if (!this.id) callback(null, true)
    sync('delete', this, options, function(err, data, resp) {
      return callback(err, data, resp)
    })
  },

  url: function(options){
    // Get base url
    var url = (this.urlRoot instanceof Function) ? this.urlRoot(options) : this.urlRoot
    // Append id if set
    if (this.id) url += (url.charAt(url.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id)
    // Add options as query parameters
    var separator = "?"
    _.each(options, function(val, key){
      url += separator + encodeURIComponent(key) + "=" + encodeURIComponent(val)
      separator = "&"
    })
    return url
  },

  parse: function(attributes) {
    return attributes
  },

  sync: function(method, options, callback) {
    sync(method, this, options, callback)
  }

})

// Class methods
// =============

_.extend(Model, {

  create: function(attributes, options, callback) {
    if (typeof options === 'function') {
      callback = options
      options = null
    }

    var Class = this
    var defaults = Class.defaults
    options || (options = {})
    attributes || (attributes = {})
    if (defaults = _.result(Class, 'defaults')) {
      attributes = _.extend({}, defaults, attributes)
    }

    var inst = new Class(attributes, options)

    if (!inst.id || options.fetched === true) {
      // Don't go fetch the model's data
      callback && callback(null, inst)
    }
    else {
      // Fetch the model from API
      inst.fetch(options, function(err, data, resp) {
        callback && callback(err, inst)
      })
    }

    return inst
  },

  list: function(options, callback) {
    var self = this
    if (typeof options == 'function') {
      callback = options
      options = {}
    }

    if (!options.url) {
      options.url = _.isFunction(this.prototype.url) ? this.prototype.url(options) : this.prototype.url
    }

    sync('read', null, options, function(err, data, resp) {
      if (err) return callback(err)
      data = self.parseList(data, resp)
      var list = []
      for (var i = 0; i < data.length; i++) {
        // TODO: The create method should run snychronously since we've already
        // fetched the data. Might want to convert this code to use the `async`
        // module so that we don't have to make assumptions about how the
        // create method runs
        self.create(data[i], {fetched:true}, function(err, inst) {
          list.push(inst)
        })
      }
      callback(err, list)
    })
  },

  parseList: function(data, resp) {
    return data
  },

  sync: sync,

  extend: extendable

})

module.exports = Model
