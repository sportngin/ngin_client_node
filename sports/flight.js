"use strict"
var Url = require('url')
var _ = require('underscore')

module.exports = function(ngin) {
  var SportsModel = ngin.SportsModel
  var Super = SportsModel.prototype
  var config = ngin.config

  /**
   * Flight Class
   *
   * @param {Object} attr
   * @param {Object} options
   * @api public
   */

  var Flight = SportsModel.extend({

    fetch: function(options, callback) {
      var url = Flight.urlRoot() + '/' + this.id
      return Super.fetch.call(this, url, options, callback)
    },

    save: function(options, callback) {
      var url = Flight.urlRoot() + '/' + this.id
      return Super.save.call(this, url, options, callback)
    },

    destroy: function(options, callback) {
      var url = Flight.urlRoot() + '/' + this.id
      return Super.destroy.call(this, url, options, callback)
    },

    addTeam: function(teamID, callback) {
      var url = Flight.urlRoot() + '/' + this.id + '/add_team/' + teamID
      return Flight.sync('update', null, { url:url }, callback)
    },

    removeTeam: function(teamID, callback) {
      var url = Flight.urlRoot() + '/' + this.id + '/remove_team/' + teamID
      return Flight.sync('delete', null, { url:url }, callback)
    },

    addToWaitlist: function(teamID, callback) {
      var url = Flight.urlRoot() + '/' + this.id + '/add_to_waitlist/' + teamID
      return Flight.sync('update', null, { url:url }, callback)
    },

    removeFromWaitlist: function(teamID, callback) {
      var url = Flight.urlRoot() + '/' + this.id + '/remove_from_waitlist/' + teamID
      return Flight.sync('update', null, { url:url }, callback)
    },

    stages: function(callback){
      return ngin.FlightStage.list({flight_id: this.id}, callback)
    },

    createSchedule: function(callback) {
      var url = Flight.tournamentUrlRoot() + '?flight_id=' + this.id
      return Flight.sync('create', null, { url:url }, callback)
    },

    schedule: function(callback) {
      return ngin.GameSlot.list({flight_id: this.id}, callback)
    },

    publish: function(callback) {
      var url = Flight.tournamentUrlRoot() + '/publish?flight_id=' + this.id
      // semantically this is an update (PUT), but must technically be a POST
      return ngin.GameSlot.sync('update', null, { url:url, method:'POST' }, callback)
    },

    // Commenting this out for now. It may be needed later, however,
    // it probably shouldn't be using `list`.
    // tiebreakPreference: function(callback){
    //   return ngin.TiebreakPreference.list({flight_id: this.id}, function(err, list, resp) {
    //     if (Array.isArray(list) && !err ) {
    //       return callback(err, list[0], resp)
    //     }
    //     callback(err, null, resp)
    //   })
    // }

  }, {

    urlRoot: function() {
      var base = config.urls && config.urls.sports || config.url
      return Url.resolve(base, '/flights')
    },

    tournamentUrlRoot: function(options) {
      var base = config.urls && config.urls.sports || config.url
      return Url.resolve(base, '/tournament_schedules')
    },

    list: function(options, callback) {
      var url = Flight.urlRoot()
      return SportsModel.list.call(this, url, options, callback)
    }

  })

  return Flight

}
