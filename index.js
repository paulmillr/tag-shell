'use strict';
const cp = require('child_process');
const makeTag = (fn, options) => function(first) {
  if (!Array.isArray(first)) {
    return tag(fn, Object.assign({}, options, first));
  }

  const args = [];

  first.forEach((string, index) => {
    string.split(/\s+/).forEach(arg => {
      if (arg) args.push(arg);
    });

    const arg = arguments[index + 1];
    if (arg == null) return;

    args.push(/\S$/.test(string)
      ? args.pop() + arg
      : arg
    );
  });

  const cmd = args.shift();

  return fn(cmd, args, options);
};

const promise = function() {
  return new Promise((resolve, reject) => {
    const proc = cp.spawn.apply(cp, arguments);
    proc.on('exit', code => {
      if (code) reject(code)
      else resolve()
    });
  });
};

const sh = makeTag(promise);
sh.makeTag = makeTag;

module.exports = sh;
