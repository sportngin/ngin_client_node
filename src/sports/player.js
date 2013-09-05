"use strict"
var Url = require('url')
var _ = require('underscore')

module.exports = function(ngin) {
  var SportsModel = ngin.SportsModel
  var Super = SportsModel.prototype
  var config = ngin.config

  function scopeUrl(options, inst) {
    options = _.extend(_.clone(options || {}), inst)
    var unrostered = options.league_id && options.season_id || options.tournament_id
    return ngin.Player.urlRoot(unrostered)
  }

  /**
   * Player Class
   *
   * @param {Object} attr
   * @param {Object} options
   * @api public
   */

  var Player = SportsModel.extend({

    fetch: function(options, callback) {
      var url = ngin.Player.urlRoot() + '/' + this.id
      return Super.fetch.call(this, url, options, callback)
    },

    save: function(options, callback) {
      var url = scopeURL(options, this) + (this.id ? '/' + this.id : '')
      return Super.save.call(this, url, options, callback)
    },

    destroy: function(options, callback) {
      var url = scopeURL(options, this) + '/' + this.id
      return Super.destroy.call(this, url, options, callback)
    }

  },{

    urlRoot: function(opts) {
      var base = config.urls && config.urls.sports || config.url
      var path = opts && opts.unrostered ? '/unrostered_players' : '/players'
      return Url.resolve(base, path)
    },

    list: function(options, callback) {
      var url = scopeURL(options, this)
      return SportsModel.list.call(this, url, options, callback)
    }

  })

  return Player

}
