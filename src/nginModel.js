"use strict"
var _ = require('underscore')

module.exports = function(ngin) {
  var config = ngin.config
  var Model = ngin.Model

  function normalizeParams(url, options, callback) {
    if (url && typeof url === 'object') {
      options = url
      url = null
    }
    else if (typeof url === 'function') {
      callback = url
      url = null
    }
    if (typeof options === 'function') {
      callback = options
      options = null
    }
    options || (options = {})
    options.url = options.url || url
    return [options, callback]
  }

  /**
   * Extend from this model to do the new hotness
   *
   * @param {Object} attr
   * @param {Object} options
   * @api public
   */

  var NginModel = Model.extend({

    urlById: function(optional) {
      var url = this.constructor.urlRoot()
      if (this.id || !optional) url += '/'+ this.id
      return url
    },

    fetch: function(url, options, callback) {
      var args = normalizeParams(url, options, callback)
      if (!args[0].url) throw new Error('Url not present or fetch not implemented.')
      return Model.prototype.fetch.apply(this, args)
    },

    save: function(url, options, callback) {
      var args = normalizeParams(url, options, callback)
      if (!args[0].url) throw new Error('Url not present or save not implemented.')
      return Model.prototype.save.apply(this, args)
    },

    destroy: function(url, options, callback) {
      var args = normalizeParams(url, options, callback)
      if (!args[0].url) throw new Error('Url not present or destroy not implemented.')
      return Model.prototype.destroy.apply(this, args)
    }

  }, {

    list: function(url, options, callback) {
      var args = normalizeParams(url, options, callback)
      if (!args[0].url) throw new Error('Url not present or list not implemented.')
      return Model.list.apply(this, args)
    }

  })

  return NginModel

}
