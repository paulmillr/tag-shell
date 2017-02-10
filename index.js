'use strict';
const cp = require('child_process');
const makeTag = (fn, opts) => function(first) {
  if (!Array.isArray(first)) {
    return tag(fn, Object.assign({}, opts, first));
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

  return fn(args, opts);
};

const spawn = (args, opts) => cp.spawn(args.shift(), args, opts);
const spawnSync = (args, opts) => cp.spawnSync(args.shift(), args, opts);

const promise = (args, opts) => {
  let out = '';
  let err = '';

  return new Promise((resolve, reject) => {
    const proc = spawn(args, opts);

    proc.on('exit', code => {
      if (code) reject(err.trim());
      else resolve(out.trim());
    });

    proc.stdout.on('data', data => out += data);
    proc.stderr.on('data', data => err += data);
  });
};

const sync = (args, opts) => {
  const proc = spawnSync(args, opts);
  if (proc.error) throw proc.error;
  if (proc.status) throw new Error(`${proc.stderr}`.trim());

  return `${proc.stdout}`.trim();
};

const sh = makeTag(promise);
sh.sync = makeTag(sync);
sh.sync.spawn = makeTag(spawnSync);
sh.spawn = makeTag(spawn);
sh.makeTag = makeTag;

module.exports = sh;
