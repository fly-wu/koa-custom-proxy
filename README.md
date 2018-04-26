# koa-custom-proxy 用法

```js
const Koa = require('koa');
const koaProxy = require('koa-custom-proxy');

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
```

## 依赖包

- [node-http-proxy](https://github.com/nodejitsu/node-http-proxy)
  
  可以实现http, https, websocket格式的代理

- [path-to-regexp](https://github.com/component/path-to-regexp)

  将制定格式的url转为正则表达式

- [path-match](https://github.com/pillarjs/path-match)

  基于path-to-regexp的功能，获取url中每个关键字对应的的值
  
## 接口说明

- proxy(matchPath, options)

```
matchPath: 基于path-match格式的路径

options: {
  proxyOptions, // node-http-proxy使用的参数
  logs: true, // 是否展示日志
  pathRewrite: // 将当前url路径映射到目标url路径
}
```
