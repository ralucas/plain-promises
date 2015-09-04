'use strict';

var timeout = setImmediate || setTimeout || window.setTimeout;

module.exports = {

  defer: function() {
    return {
      resolve: function(data) {
        if (this.promise.fulfilled) {
          this.promise.data = data;
          this.promise.fulfilled.forEach(function(fulfilled) {
            timeout(function() {
              return fulfilled && fulfilled(data);
            });
          });
          this.promise.fulfilled = null;
        }
      },
      reject: function(error) {
        if (this.promise.rejected) {
          this.promise.err = error;
          this.promise.rejected.forEach(function(rejected) {
            timeout(function() {
              return rejected && rejected(error);
            });
          });
          this.promise.rejected = null;
        }
      },
      promise: {
        fulfilled: [],
        rejected: [],
        then: function(callback) {
          if (this.fulfilled) {
            this.fulfilled.push(callback);
          } else {
            callback(this.data);
          } 
        },
        fail: function(callback) {
          if (this.rejected) {
            this.rejected.push(callback);
          } else {
            callback(this.err);
          }
        }
      }
    };
  }
};
