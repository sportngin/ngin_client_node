"use strict"
var Url = require('url')
var _ = require('underscore')

module.exports = function(ngin) {
  var SportsModel = ngin.SportsModel
  var Super = SportsModel.prototype
  var config = ngin.config

  /**
   * PlatformTeamPlayer Class
   *
   * @param {Object} attr
   * @param {Object} options
   * @api public
   */

  var PlatformTeamPlayer = SportsModel.extend({

    fetch: function(options, callback) {
      var url = PlatformTeamPlayer.urlRoot() + '/' + this.id
      return Super.fetch.call(this, url, options, callback)
    },

    save: function(options, callback) {
      var url = PlatformTeamPlayer.urlRoot() + (this.id ? '/' + this.id : '')
      return Super.save.call(this, url, options, callback)
    },

    destroy: function(options, callback) {
      var url = PlatformTeamPlayer.urlRoot() + '/' + this.id
      return Super.destroy.call(this, url, options, callback)
    }

  }, {

    urlRoot: function() {
      var base = config.urls && config.urls.platformTeam || config.url
      return Url.resolve(base, '/players')
    },

    list: function(options, callback) {
      var url = PlatformTeamPlayer.urlRoot()
      return SportsModel.list.call(this, url, options, callback)
    }

  })

  return PlatformTeamPlayer

}
