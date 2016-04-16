//'use strict';

function isFunction(fn) {
  return typeof fn === 'function';
}

function isArray(arr) {
  return typeof arr === 'object' && 
    arr.filter;
}

// Function that takes the callback and 
// argument and places it on the top
// of the next call stack
var callAsync = function(cb, arg) {
  var nodeExec = process.nextTick || setImmediate;
  if (nodeExec) {
    return nodeExec(function() {
      try {
        console.log('trying callback', cb, arg);
        cb(arg);
      } catch (ex) {
        console.error('catching exception', ex);
        return ex;
      }
    });
  } else {
    return setTimeout(function() {
      try {
        cb(arg);
      } catch (ex) {
        return ex;
      }
    });
  }
};


var PlainPrm = {

  deferred: function deferred() {
    return {
      resolve: function resolve(data) {
        var _this = this;
        var args = Array.prototype.slice.call(arguments);
        this.promise.data = data;
        if (this.promise.fulfilled) {
          this.promise.fulfilled.forEach(function(fulfilled, i) {
            if (args.length > 0) {
              return fulfilled && _this.promise.callAsync(fulfilled, data);
            }
          });
          console.log('nullifying from resolve', data);
          this.promise.fulfilled = null;
          this.promise.rejected = null;
        } 
      },
      reject: function reject(error) {
        var _this = this;
        this.promise.err = error;
        if (this.promise.fulfilled) {
          this.promise.fulfilled = null;
        }
        if (this.promise.rejected) {
          this.promise.rejected.forEach(function(rejected) {
            return rejected && _this.promise.callAsync(rejected, error);
          });
          console.log('nullifying from reject');
          this.promise.fulfilled = null;
          this.promise.rejected = null;
        }
      },
      promise: {
        _callback: function(arg) { 
          return arg;
        },
        fulfilled: [],
        rejected: [],
        immediate: [],
        /**
         * Resolves a promise
         * @param {function} onFulfilled
         * @param {function} onRejected
         *
         * @return {object} promise It is chainable
         **/ 
        then: function then(onFulfilled, onRejected) {
          if (this.fulfilled && isFunction(onFulfilled)) {
            console.log('push onFulfilled');
            this.fulfilled.push(onFulfilled);
            if (this.rejected && isFunction(onRejected)) {
              console.log('push onRejected');
              this.rejected.push(onRejected);
            }
          } else if (this.rejected && isFunction(onRejected)) {
            console.log('only push onRejected');
            this.rejected.push(onRejected);
          } else if (!this.fulfilled && isFunction(onFulfilled)) {
            console.log('immediate onFulfilled', onFulfilled, this.data);
            this.callAsync(onFulfilled, this.data);
          } else if (isFunction(onRejected)) {
            console.log('immediate onRejected');
            this.callAsync(onRejected, this.err); 
          } else if (this.data) {
            console.log('immediate this.data');
            this.callAsync(this._callback, this.data);
          } else if (this.err) {
            console.log('immediate this.err');
            this.callAsync(this._callback, this.err);
          }
          console.log('object.create', this);
          return Object.create(this);
        },
        // Function that takes the callback and 
        // argument and places it on the top
        // of the next call stack
        callAsync: function callAsync(cb, arg) {
          var _this = this;
          var nodeExec = process.nextTick || setImmediate;
          if (nodeExec) {
            return nodeExec(function() {
              try {
                console.log('trying callback', cb, arg, _this.data);
                _this.data = cb(arg);
                console.log('cb called', _this.data);
                console.log('object.create.1', _this);
                return Object.create(_this);
              } catch (ex) {
                console.error('catching exception', ex);
                _this.err = ex;
                return Object.create(_this);
              }
            });
          } else {
            return setTimeout(function() {
              try {
                _this.data = cb(arg);
              } catch (ex) {
                return ex;
              }
            });
          }
        }
      }
    };
  }
};

module.exports = PlainPrm;

