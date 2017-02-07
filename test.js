'use strict';
const tagShell = require('.');

describe('tag-shell', () => {
  tagShell.should.be.a('function');
  tagShell.should.itself.respondTo('makeTag');

  describe('should parse args correctly', () => {
    const sh = tagShell.makeTag(args => args);

    it('splits literal part', () => {
      sh``.should.eql([]);
      sh`echo`.should.eql(['echo']);
      sh`echo hello`.should.eql(['echo', 'hello']);
      sh`echo hello world`.should.eql(['echo', 'hello', 'world']);
    });

    it('handles all whitespaces', () => {
      sh`echo\ttab`.should.eql(['echo', 'tab']);
      sh`echo  new\nline`.should.eql(['echo', 'new', 'line']);
    });

    it('appends substitutions', () => {
      sh`${''}`.should.eql(['']);
      sh`${'echo'}`.should.eql(['echo']);
    });

    it('skips `null` and `undefined`', () => {
      sh`echo ${null}`.should.eql(['echo']);
      sh`echo ${undefined}`.should.eql(['echo']);
    });
  });
});
