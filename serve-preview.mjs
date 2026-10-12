import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.json':'application/json','.webmanifest':'application/manifest+json'};

http.createServer(async (req,res)=>{
  try {
    const urlPath = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let file = path.resolve(root, '.' + (urlPath === '/' ? '/index.html' : urlPath));
    if (!file.startsWith(root)) throw new Error('Invalid path');
    if ((await stat(file)).isDirectory()) file = path.join(file,'index.html');
    const body = await readFile(file);
    res.writeHead(200, {'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(body);
  } catch {
    res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});
    res.end('Not found');
  }
}).listen(4173,'127.0.0.1',()=>console.log('Glow Getter preview: http://127.0.0.1:4173'));
