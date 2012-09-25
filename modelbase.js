
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
    if (!this.id) callback(null, true)
    sync('destroy', this, options, function(err, data, resp) {
      return callback(err, data, resp)
    })
  },

  url: function() {
    var base = _.result(this, 'urlRoot')
    if (!this.id) return base
    return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id)
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
    var Class = this
    var defaults = Class.defaults
    options || (options = {})
    attributes || (attributes = {})
    if (defaults = _.result(Class, 'defaults')) {
      attributes = _.extend({}, defaults, attributes)
    }

    console.log(attributes)
    var inst = new Class(attributes, options)

    if (!inst.id || options.fetched === true) {
      console.log('Already here')
      callback && callback(null, inst)
    }
    else {
      console.log('Fetching model from API')
      inst.fetch(options, function(err, data, resp) {
        callback && callback(err, inst)
      })
    }

    return inst
  },

  list: function(options, callback) {
    var self = this
    options || (options = {})

    if (!options.url) options.url = _.result(this.prototype, 'url')

    sync('read', null, options, function(err, data, resp) {
      if (err) return callback(err)
      data = self.parseList(data, resp)
      var list = []
      for (var i = 0; i < data.length; i++) {
        // this should run snychronously since we've already fetched the data
        // TODO: could be converted to use the `async` module later
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
