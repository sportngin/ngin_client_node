var Url = require('url')
var _ = require('underscore')

module.exports = function(ngin) {
  var Model = ngin.NginModel
  var Super = Model.prototype
  var config = ngin.config

  /**
   * Password Class
   *
   * @param {Object} attr
   * @param {Object} options
   * @api public
   */

  var Password = Model.extend({

    save: function(options, callback) {
      var url = Password.urlRoot() + '/' + this.id + '/password'
      return Super.save.call(this, url, options, callback)
    }

  },{

    urlRoot: function() {
      var base = config.urls && config.urls.users || config.url
      return Url.resolve(base, '/users')
    }

  })

  return Password

}
