const { Tickets } = require('./components/tickets.js');
const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();

const tickets = new Tickets();

const requestMethods = ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'];

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));

app.use((ctx, next) => {
  if (ctx.request.method !== 'OPTIONS') {
    next();

    return;
  }

  ctx.response.set('Access-Control-Allow-Origin', '*');

  ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST');

  ctx.response.status = 204;
});


app.use((ctx, next) => {
  if (!requestMethods.includes(ctx.request.method)) {
    next();
    return;
  }
  ctx.response.set('Access-Control-Allow-Origin', '*');
  const response = tickets.defineMethod(ctx.request);
  ctx.response.status = response.status;
  ctx.response.body = response.response;
  return;
});

const server = http.createServer(app.callback());

const port = process.env.PORT || 7070;

server.listen(port, (err) => {
  if (err) {
    console.log(err);

    return;
  }

  console.log('Server is listening to ' + port);
});
