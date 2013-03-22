"use strict"
var assert = require('assert')
var sinon = require('sinon')

var Server = require('../fixtures/http.js')
var NginClient = require('../../index')
var ngin = new NginClient({
  url:'http://localhost:1337'
})

var server

describe('Team Model', function() {

  before(function() {
    server = Server()
  })

  after(function(done) {
    server.close(done)
  })

  describe('Team Class', function() {

    it('should make requests on create with ID', function(done) {
      ngin.Team.create({id:1}, function(err, team) {
        assert(!err)
        assert(!!team)
        assert.equal(team.metadata.url, '/teams/1')
        done()
      })
    })

    it('should make requests on list', function(done) {
      ngin.Team.list(function(err, data, resp) {
        assert(!err)
        assert(!!resp)
        assert.equal(resp.req.path, '/teams')
        done()
      })
    })

  })

  describe('Team Instance', function() {

    var testTeam

    beforeEach(function() {
      testTeam = ngin.Team.create({id:1}, {fetched:true})
    })

    it('should make requests on save with ID', function(done) {
      testTeam.save(function(err, data, resp) {
        assert(!err)
        assert(!!resp)
        assert.equal(resp.req.path, '/teams/1')
        done()
      })
    })

    it('should make requests on destroy with ID', function(done) {
      testTeam.destroy(function(err, data, resp) {
        assert(!err)
        assert(!!resp)
        assert.equal(resp.req.path, '/teams/1')
        done()
      })
    })

    it("should make a request for standings with ID and subseasonID ", function(done){
      testTeam.standings(1, function(err, team, opts) {
        assert(!err)
        assert(!!opts)
        assert.equal(opts.req.path, '/subseasons/1/teams/1/standings')
        done()
      })
    })

    it("should make a request for rosters with ID and seasonID ", function(done){
      testTeam.roster(1, function(err, team, opts) {
        assert(!err)
        assert(!!opts)
        assert.equal(opts.req.path, '/seasons/1/teams/1/rosters')
        done()
      })
    })

    it("should make a request for instances with ID", function(done){
      testTeam.instances(function(err, team, opts) {
        assert(!err)
        assert(!!opts)
        assert.equal(opts.req.path, '/teams/1/team_instances')
        done()
      })
    })

  })

})
