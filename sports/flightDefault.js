var Url = require('url')
var _ = require('underscore')

module.exports = function(ngin) {
  var SportsModel = ngin.SportsModel
  var config = ngin.config

  /**
   * FlightDefault Class
   *
   * @param {Object} attr
   * @param {Object} options
   * @api public
   */

  var FlightDefault = SportsModel.extend({

    urlRoot: function(options) {
      options = options || {}
      var tournamentID = options.tournament_id || this.tournament_id
      this.tournament_id = tournamentID
      delete options.tournament_id
      var base = config.urls && config.urls.sports || config.url
      return Url.resolve(base, 'tournaments/' + tournamentID + '/flight_defaults')
    },

    save: function(options, callback) {
      if (typeof options == 'function') {
        callback = options
        options = {}
      }

      options.method = options.method || 'PUT'
      FlightDefault.__super__.save.call(this, options, callback)
    }

  },{
    parseList: function(data,resp) {
      if (data.result) data = data.result
      return [data]
    }
  })

  // wrap the inheirited list function with arg checking
  FlightDefault.list = _.wrap(FlightDefault.list, function(list, options, callback) {
    if (!options.tournament_id) return callback(new Error('tournament_id is required'))
    list.call(FlightDefault, options, callback)
  })


  return FlightDefault

}
