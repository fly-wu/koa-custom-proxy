const Koa = require('koa');
const koaProxy = require('../');

// http://127.0.0.1:3003/api/ip will be mapped to http://httpbin.org/ip
const proxyConfigs = [{
  matchPath: '/test/:proxyPath(.*)',
  options: {
    // config for http-proxy
    proxyOptions: {
      target: 'http://httpbin.org',
      changeOrigin: true,
    },
    // show logs or not
    logs: true,
    // get url for dest server from current url
    pathRewrite: function(url, match) {
      return '/' + match['proxyPath'];
    }
  }
}]

const port = 3003;
const app = new Koa();

app.use(async(ctx, next) => {
  let start = Date.now();
  await next();
  let ms = Date.now() - start;
  // console.log(`X-Response-Time: ${ms}ms`);
  ctx.set('X-Response-Time', `${ms}ms`);
});

proxyConfigs.forEach(it => {
  app.use(koaProxy.proxy(it.matchPath, it.options));
});

app.use((ctx, next) => {
  console.log('middleware after koa-custom-proxy');
})

app.listen(port);
console.log(`start server: http://127.0.0.1:${port}`);