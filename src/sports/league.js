"use strict"
var Url = require('url')
var _ = require('underscore')

module.exports = function(ngin) {
  var SportsModel = ngin.SportsModel
  var Super = SportsModel.prototype
  var config = ngin.config

  /**
   * League Class
   *
   * @param {Object} attr
   * @param {Object} options
   * @api public
   */

  var League = SportsModel.extend({

    fetch: function(options, callback) {
      var url = League.urlRoot() + '/' + this.id
      return Super.fetch.call(this, url, options, callback)
    },

    save: function(options, callback) {
      var url = League.urlRoot() + (this.id ? '/' + this.id : '')
      return Super.save.call(this, url, options, callback)
    },

    destroy: function(options, callback) {
      var url = League.urlRoot() + '/' + this.id
      return Super.destroy.call(this, url, options, callback)
    }

  },{

    getStandingsDefaults: function(options, callback) {
      var url = League.urlRoot() + '/' + options.id + '/standings_defaults/' + options.gameType
      return SportsModel.list.call(this, url, options, callback)
    },

    urlRoot: function() {
      var base = config.urls && config.urls.sports || config.url
      return Url.resolve(base, '/leagues')
    },

    list: function(options, callback) {
      var url = League.urlRoot()
      return SportsModel.list.call(this, url, options, callback)
    }

  })

  return League

}
