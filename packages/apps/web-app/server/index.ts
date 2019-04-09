import path from 'path';
import express from 'express';
import next from 'next';
import { routes } from './routes';

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dev,
  // dir: path.resolve(__dirname, '..'),
  // dir: '..',
  // dir: `${path.relative(__dirname, process.cwd())}/..`,
  // dir: dev ? path.resolve(__dirname, '..') : path.resolve(__dirname, '..', '..'),
  // conf: { distDir: `${path.relative(process.cwd(), __dirname)}/../` },
});
// const handle = app.getRequestHandler();
const nextRoutesHandler = routes.getRequestHandler(app);

app.prepare().then(() => {
  const server = express();

  server.use(nextRoutesHandler);

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
