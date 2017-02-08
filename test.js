'use strict';
const tagShell = require('.');

describe('tag-shell', () => {
  tagShell.should.be.a('function');
  tagShell.should.itself.respondTo('makeTag');

  describe('parses arguments correctly', () => {
    const sh = tagShell.makeTag(args => args);

    it('splits literal part by spaces', () => {
      sh``.should.eql([]);
      sh`cmd`.should.eql(['cmd']);
      sh`cmd hello`.should.eql(['cmd', 'hello']);
      sh`cmd hello world`.should.eql(['cmd', 'hello', 'world']);
    });

    it('takes in account all whitespaces', () => {
      sh`cmd\ttab`.should.eql(['cmd', 'tab']);
      sh`cmd  new\nline`.should.eql(['cmd', 'new', 'line']);
    });

    it('pushes subst if literal ends with space', () => {
      sh`${''}`.should.eql(['']);
      sh`cmd ${''} empty`.should.eql(['cmd', '', 'empty']);
      sh`cmd with\t${'tab'}`.should.eql(['cmd', 'with', 'tab']);
      sh`cmd new\n${'line'}`.should.eql(['cmd', 'new', 'line']);
    });

    it(`appends subst to last arg if literal doesn't end with space`, () => {
      sh`param=${''}`.should.eql(['param=']);
      sh`param=${'value'} --bool`.should.eql(['param=value', '--bool']);
      sh`param=${'with space'} --bool`.should.eql(['param=with space', '--bool']);
    });

    it(`doesn't coerce substs to strings`, () => {
      sh`cmd ${1} ${false}`.should.eql(['cmd', 1, false]);
      sh`cmd ${[]} ${true}`.should.eql(['cmd', [], true]);
    });

    it('skips `null` and `undefined`', () => {
      sh`${null}`.should.eql([]);
      sh`${null} --bool`.should.eql(['--bool']);
      sh`cmd ${undefined}`.should.eql(['cmd']);
    });
  });
});
