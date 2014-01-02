var expect = require('expect.js'),
    co = require('co'),
    select = require('..');

describe('co-select', function() {
  function makeAsynchrony(err, value) {
    var args = Array.prototype.slice.call(arguments);
    var ctx = this;
    return function (cb) {
      setImmediate(function () {
        cb.apply(ctx, args);
        cb(err, value);
      });
    };
  }

  it('should be able to select the first value', function(done) {
    co(function *() {
      var a1 = makeAsynchrony(null, 1);
      var a2 = makeAsynchrony(null, 2);
      var first = yield select([a2, a1]);
      expect(first.caller).to.equal(a2);
      expect(first.value).to.equal(2);
      done();
    })();
  });

  it('should be able to just return values', function(done) {
    co(function *() {
      var a1 = makeAsynchrony(null, 1);
      var a2 = makeAsynchrony(null, 2);
      var firstValue = yield select([a2, a1], true);
      expect(firstValue).to.equal(2);
      done();
    })();
  });

  it('should throw errors (full)', function(done) {
    co(function *() {
      var err = new Error('something bad');
      var a1 = makeAsynchrony(null, 1);
      var a2 = makeAsynchrony(err, 2);
      try {
        var first = yield select([a2, a1]);
      } catch (e) {
        expect(e).to.equal(err);
        done();
      }
    })();
  });

  it('should throw errors (values)', function(done) {
    co(function *() {
      var err = new Error('something bad');
      var a1 = makeAsynchrony(null, 1);
      var a2 = makeAsynchrony(err, 2);
      try {
        var first = yield select([a2, a1], true);
      } catch (e) {
        expect(e).to.equal(err);
        done();
      }
    })();
  });

  it('should be able to return multiple values (full)', function(done) {
    co(function *() {
      var a1 = makeAsynchrony(null, 1);
      var a2 = makeAsynchrony(null, 2, 3);
      var first = yield select([a2, a1]);
      expect(first.caller).to.equal(a2);
      expect(first.value).to.eql([2, 3]);
      done();
    })();
  });

  it('should be able to return multiple values (values)', function(done) {
    co(function *() {
      var a1 = makeAsynchrony(null, 1);
      var a2 = makeAsynchrony(null, 2, 3);
      var firstValue = yield select([a2, a1], true);
      expect(firstValue).to.eql([2, 3]);
      done();
    })();
  });
});
