

$(function() {
  'use strict';

  QUnit.module('smoothState', {
    beforeEach: function(assert) {
      var
          test = this,
          done = assert.async(),
          frameReady = function(frameWin) {
            test.frameWin = frameWin;
            window.frameReady = $.noop;
            done();
          };

      window.frameReady = frameReady;
      $('#qunit-fixture').append('<iframe src="views/home.html">');
    },
    afterEach: function(assert) {
      delete window.frameReady;
    }
  });

  QUnit.test('should be defined on jquery object', function (assert) {
    assert.expect(1);
    assert.ok(this.frameWin.jQuery.fn.smoothState, 'smoothState method is defined');
  });

  QUnit.test('load(url)', function(assert){
    assert.expect(3);
    var
        frameWin = this.frameWin,
        frameDoc = frameWin.document,
        _$ = frameWin.jQuery,
        url = _$('#page-about').prop('href'),
        done = assert.async(),
        options = {
          development: true,
          callback: function(){
            assert.ok(_$('#page-title').text() === 'About', 'Updates the title of the page');
            assert.equal(frameDoc.title, 'About - My Site', 'Replaces the contents of the page');
            assert.equal(frameWin.location.href, url, 'Updates the url');
            done();
          }
        },
        smoothState = _$('#main').smoothState(options).data('smoothState');

    smoothState.load(url);

  });

  QUnit.test('fetch(url, callback)', function(assert){
    assert.expect(5);
    var
        frameWin = this.frameWin,
        _$ = frameWin.$,
        url = _$('#page-about').prop('href'),
        done = assert.async(),
        options = {
          development: true,
        },
        callback = function(){
          assert.ok(smoothState.cache[url], 'Stores contents in cache[url]');
          assert.equal(smoothState.cache[url].title, 'About - My Site', 'Stores the title of the page in cache[url].title');
          assert.ok(smoothState.cache[url].html instanceof frameWin.jQuery, 'Stores contents as a jquery object in cache[url].html');
          assert.ok(smoothState.cache[url].html.is('#main'), 'Stores only the smoothState container in cache[url].html');
          assert.ok(smoothState.cache[url].html.find('#page-about'), 'Stores new contents in cache[url].html');
          done();
        },
        smoothState = _$('#main').smoothState(options).data('smoothState');

    smoothState.fetch(url, callback);

  });

});
