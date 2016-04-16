'use strict';

var assert = require('assert');
var Prm = require('../lib');
var fs = require('fs');

describe('plain-promises', function () {

  it('should be an object', function () {
    assert(typeof(Prm) === 'object');
  });

  describe('and the deferredred object', function() {

    it('should have resolve and reject methods', function() {
      var deferred = Prm.deferred();
      assert(deferred.resolve);
      assert(deferred.reject);
    });

    it('should have a promise', function() {
      var deferred = Prm.deferred();
      assert(deferred.promise);
    });

    describe('creating a promise', function() {
      var test, ans;
      beforeEach(function() {
        test = function() {
          var deferred = Prm.deferred();
          fs.readdir('./', function(err, files) {
            if (err) deferred.reject('Test Error!!!!');
            deferred.resolve(files); 
          });
          return deferred.promise;
        };
        ans = test();
      });

      it('should create a thenable deferred object', function(done) {
        assert(typeof(ans) === 'object');
        assert(ans.hasOwnProperty('then'), 'it is thenable');
        assert(typeof(ans.then) === 'function', 'and then is a function');
        done();
      });

      it('`then` should return a callback with data', function(done) {
        ans.then(function(data) {
          assert(data, 'received some data');
          assert(typeof(data) === "object", 'received an object type that is an array')
          assert(data.length > 0, 'confirmed that received an array');
          assert(typeof(data[2]) === 'string', 'picked an item that is a string');
          done();
        });
      });
    });

    describe('a failed promise', function() {
      var test, ans;
      beforeEach(function() {
        test = function() {
          var deferred = Prm.deferred();
          fs.readFile('filethatdoesnotexist.dne', function(err, data) {
            if (err) deferred.reject('Expect this testing error');
            deferred.resolve(data); 
          });
          return deferred.promise;
        };
        ans = test();
      });

      it('should call onRejected with an error in the callback', function(done) {
        ans.then(null, function(err) {
          assert(err);
          assert(/testing/.test(err));
          done();
        });
      });
    });
  });

  describe('Promises/A+ Tests', function () {
    require('promises-aplus-tests').mocha(Prm);
  });
});
