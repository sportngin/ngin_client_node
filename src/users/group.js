"use strict"
var Url = require('url')
var request = require('request')
var _ = require('underscore')

module.exports = function(ngin) {
  var Model = ngin.NginModel
  var Super = Model.prototype
  var config = ngin.config

  /**
   * Group Class
   *
   * @param {Object} attr
   * @param {Object} options
   * @api public
   */

  var Group = Model.extend({

    fetch: function(options, callback) {
      var url = Group.urlRoot() + '/' + this.id
      return Super.fetch.call(this, url, options, callback)
    },

    save: function(options, callback) {
      var url = Group.urlRoot() + (this.id ? '/' + this.id : '')
      return Super.save.call(this, url, options, callback)
    },

    destroy: function(options, callback) {
      var url = Group.urlRoot() + '/' + this.id
      return Super.destroy.call(this, url, options, callback)
    },

    personas: function(options, callback) {
      if (typeof options === 'function') {
        callback = options, options = {}
      }
      options || (options = {})
      var url = Group.urlRoot() + '/' + this.id + '/personas'
      return ngin.Persona.list(_.extend({}, options, {url:url}), callback)
    },

    addPersona: function(personId, callback) {
      var url = Group.urlRoot() + '/' + this.id + '/add_persona/' + personId
      return Group.sync('create', null, { url:url }, this.callbackWithParse(callback))
    },

    removePersona: function(personId, callback) {
      var url = Group.urlRoot() + '/' + this.id + '/remove_persona/' + personId
      return Group.sync('create', null, { url:url }, this.callbackWithParse(callback))
    }

  }, {

    urlRoot: function() {
      var base = config.urls && config.urls.users || config.url
      return Url.resolve(base, '/groups')
    },

    list: function(options, callback) {
      if (!options.owner_type) return callback(new Error('owner_type is required'))
      if (!options.owner_id) return callback(new Error('owner_id is required'))
      options.query = {
        owner_id: options.owner_id,
        owner_type: options.owner_type
      }
      var url = Group.urlRoot()
      return Model.list.call(this, url, options, callback)
    }

  })

  return Group

}


