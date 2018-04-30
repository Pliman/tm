import Koa from 'koa';
import session from 'koa-session2';
import koaCompress from 'koa-compress';
import bodyParser from 'koa-bodyparser';
import nodeCommandParams from 'node-command-params';
import router from './lib/router/router';

const app = new Koa();

app.use(session({
    key: 'SESSIONID' // default 'koa:sess'
}));
app.use(koaCompress());
app.use(bodyParser());

router(app, nodeCommandParams());

const port = 3100;
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }

    console.log(`listening on port ${ port }`);
});
