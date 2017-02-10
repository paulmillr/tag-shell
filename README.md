# tag-shell

Use ES6 template tags for your node.js shell commands.

Using *backticks* is important and the package won't work otherwise.

```javascript
const sh = require('tag-shell');
const opts = {app: 'App', icon: 'icon.png'};

// Async.
sh.async`notify-send -a ${opts.app}
  -i ${opts.icon}
`;

// Streaming.
sh.spawn`node -v`.stdout.on('data', data => console.log(data.toString()))

// Sync.
const version = sh`node -v`;
```

## License

MIT
