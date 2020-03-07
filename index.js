const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const mime = require("mime");

const server = http.createServer();

function respondGet(req, res) {
  const filepath = path.join(
    __dirname,
    decodeURIComponent(url.parse(req.url).pathname)
  );
  fs.stat(filepath, function(er, stat) {
    if (er) {
      if (er.code == "ENOENT") {
        res.statusCode = 404;
        res.end("Not Found");
      } else {
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    } else {
      res.setHeader("Content-Type", mime.getType(filepath));
      res.setHeader("Content-Length", stat.size);
      const stream = fs.createReadStream(filepath);
      stream.on("error", function(er) {
        res.statusCode = 500;
        res.end("Internal Server Error");
      });
      stream.pipe(res);
    }
  });
}

function respondHead(req, res) {
  const filepath = path.join(
    __dirname,
    decodeURIComponent(url.parse(req.url).pathname)
  );
  fs.stat(filepath, function(er, stat) {
    if (er) {
      if (er.code == "ENOENT") {
        res.statusCode = 404;
        res.end("Not Found");
      } else {
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    } else {
      res.setHeader("Content-Type", mime.getType(filepath));
      res.setHeader("Content-Length", stat.size);
      res.end();
    }
  });
}

function respondPost(req, res) {
  let data = "";
  req.on("data", function(chunk) {
    data += chunk;
  });
  req.on("end", function() {
    console.log(data);
    res.end();
  });
}

server.on("request", function(req, res) {
  switch (req.method) {
    case "GET":
      respondGet(req, res);
      break;
    case "HEAD":
      respondHead(req, res);
      break;
    case "POST":
      respondPost(req, res);
      break;
    default:
      res.end();
      break;
  }
});

const argv = process.argv;
const host = argv[2] || "127.0.0.1";
const port = argv[3] || 3000;

server.listen({
  host,
  port
});

console.log(`Server is running at http://${host}:${port}`);
