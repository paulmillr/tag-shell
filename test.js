'use strict';
const tagShell = require('.');

describe('tag-shell', () => {
  it('should parse args correctly', () => {
    const sh = tagShell.makeTag(function() {
      return [].slice.call(arguments, 0, -1);
    });

    sh``.should.eql([undefined, []]);
    sh`echo`.should.eql(['echo', []]);
    sh`echo hello`.should.eql(['echo', ['hello']]);
    sh`echo hello world!`.should.eql(['echo', ['hello', 'world!']]);
  });
});
