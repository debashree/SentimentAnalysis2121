const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const types = { ".html": "text/html; charset=utf-8", ".csv": "text/csv; charset=utf-8", ".txt": "text/plain; charset=utf-8" };

http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname); }
  catch { response.writeHead(400).end("Bad request"); return; }
  if (pathname === "/") pathname = "/index.html";
  const filename = path.resolve(root, `.${pathname}`);
  if (!filename.startsWith(root + path.sep)) { response.writeHead(403).end("Forbidden"); return; }
  fs.readFile(filename, (error, content) => {
    if (error) { response.writeHead(404).end("Not found"); return; }
    response.writeHead(200, { "Content-Type": types[path.extname(filename)] || "application/octet-stream" });
    response.end(content);
  });
}).listen(8765, "127.0.0.1");
