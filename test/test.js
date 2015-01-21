'use strict';

global.Promise = require('es6-promise').Promise;

var
  assert = require('assert'),
  PromiseEvent = require('../promiseevent');


describe('PromiseEvent', function () {
  it('should mixin into prototype', function () {
    var
      test = function () {};

    test.prototype.test = function () {};

    PromiseEvent.mixin(test);

    assert.notEqual(test.prototype.test, null);
    assert.notEqual(test.prototype.addListener, null);
    assert.notEqual(test.prototype.removeListener, null);
    assert.notEqual(test.prototype.emit, null);
  });

  it('should mixin into existing object', function () {
    var
      test = { test: function () {} };

    PromiseEvent.mixin(test);

    assert.notEqual(test.test, null);
    assert.notEqual(test.addListener, null);
    assert.notEqual(test.removeListener, null);
    assert.notEqual(test.emit, null);
  });

  it('should add listener', function () {
    var
      test = new PromiseEvent();

    test.addListener(function () {});
  });

  it('should remove listener', function () {
    var
      test = new PromiseEvent(),
      func = function () {};

    test.addListener(func);

    test.removeListener(func);
  });

  it('should ignore remove not registered listener', function () {
    var
      test = new PromiseEvent(),
      func = function () {};

    test.removeListener(func);
  });

  it('should handle sync emit', function (done) {
    var
      test = new PromiseEvent(),
      processed = false;

    test.addListener('test', function () { processed = true; });

    test.emit('test')
      .then(function () { assert(processed) })
      .then(function () { done(); })
      .catch(function (error) { done(error); });
  });

  it('should ignore emit without listener', function (done) {
    var
      test = new PromiseEvent();

    test.emit('test')
      .then(function () { done(); })
      .catch(function (error) { done(error); });
  });

  it('should handle async emit using Promise', function (done) {
    var
      test = new PromiseEvent(),
      processed = false;

    test.addListener('test', function () {
      return new Promise(function (resolve) {
        setTimeout(function () {
          processed = true;

          resolve();
        }, 200);
      });
    });

    test.emit('test')
      .then(function () { assert(processed) })
      .then(function () { done(); })
      .catch(function (error) { done(error); });
  });

  it('should handle async emit using callback', function (done) {
    var
      test = new PromiseEvent(),
      processed = false;

    test.addListener('test', function (callback) {
      setTimeout(function () {
        processed = true;

        callback();
      }, 200);
    });

    test.emit('test')
      .then(function () { assert(processed) })
      .then(function () { done(); })
      .catch(function (error) { done(error); });
  });
});