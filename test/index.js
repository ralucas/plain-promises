'use strict';

var assert = require('assert');
var Prm = require('../lib');
var fs = require('fs');

describe('plain-promises', function () {

  it('should be an object', function () {
    assert(typeof(Prm) === 'object');
  });

  describe('and the deferred object', function() {

    it('should have resolve and reject methods', function() {
      var defer = Prm.defer();
      assert(defer.resolve);
      assert(defer.reject);
    });

    it('should have a promise', function() {
      var defer = Prm.defer();
      assert(defer.promise);
    });

    describe('creating a promise', function() {
      var test, ans;
      beforeEach(function() {
        test = function() {
          var defer = Prm.defer();
          fs.readdir('./', function(err, files) {
            if (err) defer.reject('Test Error!!!!');
            defer.resolve(files); 
          });
          return defer.promise;
        };
        ans = test();
      });

      it('should create a deferred object', function(done) {
        assert(typeof(ans) == 'object');
        assert(ans.hasOwnProperty('then'), 'it is thenable');
        assert(typeof(ans.then) == 'function', 'and then is a function');
        console.log(ans.then);
        done();
      });

      it('`then` should return a callback with data', function(done) {
        ans.then(function(data) {
          console.log('data:', data);
          assert(data, 'received some data');
          assert(typeof(data) == "object", 'received an object type that is an array')
          assert(data.length > 0, 'confirmed that received an array');
          assert(typeof(data[2]) == 'string', 'picked an item that is a string');
          done();
        });
      });
    });

    describe('a failed promise', function() {
      var test, ans;
      beforeEach(function() {
        test = function() {
          var defer = Prm.defer();
          fs.readFile('filethatdoesnotexist.dne', function(err, data) {
            if (err) defer.reject('Expect this testing error');
            defer.resolve(data); 
          });
          return defer.promise;
        };
        ans = test();
      });
      
      it('should call `fail` with an error in the callback', function(done) {
        ans.then(function(data) {
          //This should NOT be called
          console.log('Should NOT have been called:', data);
          assert.fail(data, '', 'I should NOT have been called');
        }).fail(function(err) {
          console.log('Error:', err);
          assert(err);
          assert(/Exists/.test(err));
          assert(/testing/.test(err));
        });
      });
    });
  });

});
