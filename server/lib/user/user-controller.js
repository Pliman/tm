import {route, HttpMethod} from 'koa-router-decorators-async';
import {commonRtn} from '../utils/request-utils';
import _ from 'lodash';
import userService from './user-service';

@route('/users')
export default class UserController {
    constructor() {
        return this.router.routes();
    }

    @route('/login', HttpMethod.POST)
    async login(ctx) {
        let loginUser = ctx.request.body;
        let rtn = _.cloneDeep(commonRtn);

        let user = await userService.validateUser(loginUser);
        if (user) {
            rtn.message = '登录成功';

            ctx.session.user = user;
            rtn.user = user;
        } else {
            rtn.code = 1;
            rtn.message = '用户名或密码错误';
        }

        ctx.body = rtn;
    }
}
