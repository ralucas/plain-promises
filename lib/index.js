'use strict';

// If it's not node
if (window && !require) {
  
}

var timeout = setImmediate || setTimeout;

function isFunction(fn) {
  return typeof fn === 'function';
}

var PlainPrm = {

  deferred: function deferred() {
    return {
      resolve: function resolve(data) {
        var args = Array.prototype.slice.call(arguments);
        if (this.promise.fulfilled) {
          this.promise.data = data;
          this.promise.fulfilled.forEach(function(fulfilled) {
            if (args.length > 0) {
              return fulfilled && timeout(fulfilled, data);
            }
          });
          this.promise.fulfilled = null;
        } 
      },
      reject: function reject(error) {
        if (this.promise.fulfilled) {
          this.promise.fulfilled = null;
        }
        if (this.promise.rejected) {
          this.promise.err = error;
          this.promise.rejected.forEach(function(rejected) {
            return rejected && timeout(rejected, error);
          });
          //this.promise.rejected = null;
        }
      },
      promise: {
        fulfilled: [],
        rejected: [],
        /**
         * Resolves a promise
         * @param {function} onFulfilled
         * @param {function} onRejected
         *
         * @return {object} promise It is chainable
         **/ 
        then: function then(onFulfilled, onRejected) {
          if (this.fulfilled) {
            if (isFunction(onFulfilled)) {
              this.fulfilled.push(onFulfilled);
            } 
          } else if (this.rejected && isFunction(onRejected)) {
            this.rejected.push(onRejected);
            if (this.err) {
              onRejected(this.err);
            }
          } else if (isFunction(onFulfilled)) {
            this.data = onFulfilled(this.data);
          } 
          return this;
        },
        fail: function fail(onRejected) {
          if (this.rejected && isFunction(onRejected)) {
            this.rejected.push(onRejected);
          } else if (isFunction(onRejected)){
            return onRejected(this.err);
          }
        }
      }
    };
  }
};

if (!window && module && require) {
  module.exports = PlainPrm;
} else {
  (function(win, lib) {
    return window[lib];
  })(window, PlainPrm);
}

