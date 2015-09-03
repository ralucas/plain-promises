'use strict';

var setTimeout = setImmediate || window.setTimeout;

module.exports = {

  defer: function() {
    return {
      resolve: function(data) {
        this.promise.resolved.forEach(callback) {
          setTimeout(function() {
            return callback && callback(data);
          });
        }
      },
      reject: function(error) {
        this.promise.errored.forEach(callback) {
          setTimeout(function() {
            return callback && callback(error);
          });
        }
      },
      promise: {
        resolved: [],
        errored: [],
        then: function(callback) {
          this.resolved.push(callback);
        },
        error: function(callback) {
          this.errored.push(callback);
        }
      }
    };
  }

};
