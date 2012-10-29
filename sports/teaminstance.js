
module.exports = init

var Url = require('url')
var _ = require('underscore')
var Model = require('../modelbase')

var config = {}

/**
 * The entry point for the Team api
 *
 * @param {Object} conf
 * @returns {Object}
 * @api public
 */

function init(conf) {
  config = conf
  return TeamInstance
}

/**
 * Team Class
 *
 * @param {Object} attr
 * @param {Object} options
 * @api public
 */

var TeamInstance = Model.extend({

  url: function(options){
    // TODO: throw an error if no season_id?
    var base = config.urls && config.urls.sports || config.url
    base = Url.resolve(base, '/seasons/' + options.season_id + '/teams' )
    if (!this.id) return base
    return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id)
  },

  urlRoot: function() {
    var base = config.urls && config.urls.sports || config.url
    return Url.resolve(base, '/seasons')
  },

  initialize: function(attr, options) {
    console.log('TeamInstance#initialize', attr, options)
  }

})