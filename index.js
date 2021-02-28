const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const mime = require('mime');

const server = http.createServer();
const baseURL = 'html';

function get(req, res) {
  const pathname = decodeURIComponent(url.parse(req.url).pathname);
  const filepath = path.join(__dirname, baseURL, pathname);
  fs.stat(filepath, function (er, stat) {
    if (er) {
      if (er.code == 'ENOENT') {
        res.statusCode = 404;
        res.end('Not Found');
      } else {
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    } else {
      res.setHeader('Content-Type', mime.getType(filepath));
      res.setHeader('Content-Length', stat.size);
      const stream = fs.createReadStream(filepath);
      stream.on('error', function () {
        res.statusCode = 500;
        res.end('Internal Server Error');
      });
      stream.pipe(res);
    }
  });
}

server.on('request', function (req, res) {
  switch (req.method) {
    case 'GET':
      get(req, res);
      break;
    case 'POST':
      break;
    default:
      break;
  }
});

const host = process.argv[2] || '127.0.0.1';
const port = process.argv[3] || 3000;

server.listen({
  host,
  port,
});

console.log(`Server is running at http://${host}:${port}`);
