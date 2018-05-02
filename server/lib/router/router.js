import Router from 'koa-router';
import koaStatic from 'koa-static';
import Users from '../user/user-controller';
import Tasks from '../task/task-controller';
import {commonRtn} from '../utils/request-utils';
import _ from 'lodash';

const rootRouter = new Router({
    prefix: '/api'
});


export default (app, runtimeConfig) => {
    app.use((ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000');
        ctx.set('Access-Control-Allow-Credentials', 'true');
        ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        ctx.set('Access-Control-Allow-Headers', 'Content-Type,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control');
        return next();
    });

    runtimeConfig.staticPath && app.use(koaStatic(__dirname + runtimeConfig.staticPath));
    // app.use(koaStatic(__dirname + '/../../public'));

    app.use((ctx, next) => {
        let sessionFreeUrls = ['/api/users/login'];

        for (let i = 0, length = sessionFreeUrls.length; i < length; i++) {
            if (ctx.originalUrl.startsWith(sessionFreeUrls[i])) {
                return next();
            }
        }

        if (!ctx.session.user || !ctx.session.user._id) {
            let rtn = _.cloneDeep(commonRtn);
            rtn.code = 503;
            rtn.message = '用户无效';
            ctx.body = rtn;
            return false;
        }

        return next();
    });

    rootRouter.use(new Users());
    rootRouter.use(new Tasks());

    app
        .use(rootRouter.routes())
        .use(rootRouter.allowedMethods());
};
