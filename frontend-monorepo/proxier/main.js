var httpProxy = require('http-proxy');

httpProxy.createServer({
  target: 'http://79.132.143.69:9000',
  ws: true
}).listen(9000);
