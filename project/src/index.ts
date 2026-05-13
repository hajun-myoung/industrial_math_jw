import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import menuRouter from './menu-router.js';
import orderRouter from './order-router.js';

const app = new Hono();
app.route('/api/menus', menuRouter);
app.route('/api/orders', orderRouter);

app.use(
  '/*',
  serveStatic({
    //local3000/뒤에 쓰는 모든 것을 여기서 받겠다는 의미. 그래서 local3000/admin.html을 직접 입력해도 들어가짐.
    root: './public',
  }),
);

app.get('/', (c) => {
  return c.text('Hello Hono! 환영합니다!');
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
