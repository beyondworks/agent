import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { serve } from 'inngest/node';
import { inngest, renderFFmpegFunction } from './inngest-functions.js';

const PORT = Number(process.env.PORT) || 3001;

const inngestHandler = serve({
  client: inngest,
  functions: [renderFFmpegFunction],
});

async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'videoforge-worker' }));
    return;
  }

  if (req.url?.startsWith('/api/inngest')) {
    return inngestHandler(req, res);
  }

  res.writeHead(404);
  res.end('Not Found');
}

const server = createServer(handler);

server.listen(PORT, () => {
  console.log(`VideoForge Worker running on port ${PORT}`);
});
