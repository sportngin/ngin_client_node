"use strict"
var assert = require('assert')
var sinon = require('sinon')

var Server = require('../fixtures/http.js')
var NginClient = require('../../index')
var ngin = new NginClient(require('../fixtures/config.js'))

var server

describe('Division Model', function() {

  before(function() {
    server = Server()
  })

  after(function(done) {
    server.close(done)
  })

  describe('Division Class', function() {

    it('should make requests on fetch with ID and season ID', function(done) {
      ngin.Division.create({season_id:1, id:2}, function(err, division, data, resp) {
        assert(!err)
        assert(!!division)
        assert.equal(resp.req.method, 'GET')
        assert.equal(resp.req.path, '/seasons/1/divisions/2')
        done()
      })
    })

    it('should make requests on list', function(done) {
      ngin.Division.list({season_id:1}, function(err, data, resp) {
        assert(!err)
        assert(!!resp)
        assert.equal(resp.req.method, 'GET')
        assert.equal(resp.req.path, '/seasons/1/divisions')
        done()
      })
    })

  })

  describe('Division Instance', function() {

    var testDivision

    beforeEach(function() {
      testDivision = ngin.Division.create({season_id:1, id:2}, {fetched:true})
    })

    it("should make a request for standings with ID and subseasonID ", function(done){
      testDivision.standings(1, function(err, division, resp) {
        assert(!err)
        assert(!!resp)
        assert.equal(resp.req.method, 'GET')
        assert.equal(resp.req.path, '/divisions/2/standings')
        done()
      })
    })

    it('should make requests on save with ID', function(done) {
      testDivision.save(function(err, data, resp) {
        assert(!err)
        assert(!!resp)
        assert.equal(resp.req.method, 'PUT')
        assert.equal(resp.req.path, '/seasons/1/divisions/2')
        done()
      })
    })

    it('should make requests on save without ID', function(done) {
      delete testDivision.id
      testDivision.save(function(err, data, resp) {
        assert(!err)
        assert(!!resp)
        assert.equal(resp.req.method, 'POST')
        assert.equal(resp.req.path, '/seasons/1/divisions')
        done()
      })
    })

    it('should make requests on destroy with ID', function(done) {
      testDivision.destroy(function(err, data, resp) {
        assert(!err)
        assert(!!resp)
        assert.equal(resp.req.method, 'DELETE')
        assert.equal(resp.req.path, '/seasons/1/divisions/2')
        done()
      })
    })

  })

})
