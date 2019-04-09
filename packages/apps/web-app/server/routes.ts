import nextRoutes from '@yolkai/next-routes';

export const routes = nextRoutes()
  .add({ name: 'home', pattern: '/', page: 'Home' });
