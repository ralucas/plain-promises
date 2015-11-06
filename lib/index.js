'use strict';

module.exports = {

  defer: function defer() {
    return {
      resolve: function resolve(data) {
        if (this.promise.rejected) {
          this.promise.rejected = null;
        }
        if (this.promise.fulfilled) {
          this.promise.data = data;
          this.promise.fulfilled.forEach(function(fulfilled) {
            return fulfilled && fulfilled(data);
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
            return rejected && rejected(error);
          });
          this.promise.rejected = null;
        }
      },
      promise: {
        fulfilled: [],
        rejected: [],
        then: function then(callback) {
          if (!this.err) {
            if (this.fulfilled) {
              this.fulfilled.push(callback);
            } else {
              this.data = callback(this.data);
            }
          }
          return this;
        },
        fail: function fail(callback) {
          if (this.rejected) {
            this.rejected.push(callback);
          } else {
            return callback(this.err);
          }
        }
      }
    };
  }
};
