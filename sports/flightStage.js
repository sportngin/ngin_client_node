"use strict"
var Url = require('url')
var _ = require('underscore')

module.exports = function(ngin) {
  var SportsModel = ngin.SportsModel
  var config = ngin.config

  /**
   * Scopes the url to the tournament or flight
   *
   * @param {Object} options
   * @returns {String}
   * @api public
   */

  function scopeUrl(options, inst) {
    options = _.extend(_.clone(options || {}), inst)
    if (typeof options !== 'object' && !options.flight_id)
      throw new Error('flight_id required to make flight defaults api calls')

    return ngin.Flight.urlRoot() + '/' + options.flight_id + FlightStage.urlRoot()
  }

  /**
   * FlightStage Class
   *
   * @param {Object} attr
   * @param {Object} options
   * @api public
   */

  var FlightStage = SportsModel.extend({

    validate: function() {
      return ~['pool','single_elim','double_elim','round_robin'].indexOf(this.type) ? false : 'Property "type" has an invalid value'
    },

    addTeam: function(teamID, callback) {
      var url = scopeUrl({}, this) + '/' + this.id + '/add_team/' + teamID
      return FlightStage.sync('update', null, { url:url }, callback)
    },

    removeTeam: function(teamID, callback) {
      var url = scopeUrl({}, this) + '/' + this.id + '/remove_team/' + teamID
      return FlightStage.sync('delete', null, { url:url }, callback)
    },

    schedule: function(callback) {
      return ngin.GameSlot.list({flight_stage_id: this.id}, callback)
    },

    standings: function(callback) {
      return ngin.Standings.create({ flight_stage_id:this.id }).fetch(callback)
    },

    teams_advancing: function(callback) {
      var url = scopeUrl({}, this) + '/' + this.id + '/teams_advancing'
      return FlightStage.sync('fetch', null, { url:url }, callback)
    },

    advance_teams: function(callback) {
      var url = scopeUrl({}, this) + '/' + this.id + '/teams_advancing'
      return FlightStage.sync('create', { teams:this.teams }, { url:url }, callback) // Stat Ngin expects a POST
    }

  }, {

    urlRoot: function() {
      return '/flight_stages'
    },

    list: function(options, callback) {
      var url = scopeUrl(options)
      return SportsModel.list.call(this, url, options, callback)
    }

  })

  return FlightStage

}
