"use strict"
var Url = require('url')
var _ = require('underscore')
var massUpdate = require('../mixins/massUpdate')

module.exports = function(ngin) {
  var Model = ngin.NginModel
  var Super = Model.prototype
  var config = ngin.config

  /**
   * VenueGameAssignment Class
   *
   * @param {Object} attr
   * @param {Object} options
   * @api public
   */

  var VenueGameAssignment = Model.extend({

    fetch: function(options, callback) {
      var url = VenueGameAssignment.urlRoot() + '/' + this.id
      return Super.fetch.call(this, url, options, callback)
    },

    save: function(options, callback) {
      var url = VenueGameAssignment.urlRoot() + (this.id ? '/' + this.id : '')
      return Super.save.call(this, url, options, callback)
    },

    destroy: function(options, callback) {
      var url = VenueGameAssignment.urlRoot() + '/' + this.id
      return Super.destroy.call(this, url, options, callback)
    }

  }, {

    urlRoot: function() {
      var base = config.urls && config.urls.venues || config.url
      return Url.resolve(base, '/game_assignments')
    },

    list: function(options, callback) {
      var url = VenueGameAssignment.urlRoot()
      return Model.list.call(this, url, options, callback)
    },

    update: function(options, callback) {
      var url = VenueGameAssignment.urlRoot()
      return massUpdate.call(this, url, options, callback)
    }

  })

  return VenueGameAssignment

}
