var Url = require('url')
var _ = require('underscore')

module.exports = function(ngin) {
  var SportsModel = ngin.SportsModel
  var config = ngin.config

  /**
   * Division Class
   *
   * @param {Object} attr
   * @param {Object} options
   * @api public
   */

  var Division = SportsModel.extend({

    urlRoot: function() {
      var base = config.urls && config.urls.sports || config.url
      return Url.resolve(base, '/divisions')
    },
    
    standings: function(callback) {

    },

    standingsPreference: function(callback) {
      
    }

  })

  return Division

}
