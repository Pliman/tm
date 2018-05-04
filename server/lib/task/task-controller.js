import {route, HttpMethod} from 'koa-router-decorators-async';
import {commonRtn} from '../utils/request-utils';
import _ from 'lodash';
import taskService from './task-service';

@route('/tasks')
export default class UserController {

    constructor() {
        return this.router.routes();
    }

    @route('/', HttpMethod.POST)
    async createTask(ctx) {
        let taskCreateObj = ctx.request.body;
        let rtn = _.cloneDeep(commonRtn);

        let task = await taskService.createTask(taskCreateObj);

        if (task) {
            rtn.message = '创建成功';
            rtn.task = task;
        } else {
            rtn.code = '1';
            rtn.message = '创建失败';
        }

        ctx.body = rtn;
    }

    @route('/:id/start', HttpMethod.POST)
    async startTask(ctx) {
        let taskId = ctx.params.id;
        let rtn = _.cloneDeep(commonRtn);

        let task = await taskService.startTask(taskId);

        if (task) {
            rtn.message = '任务开始成功';
            rtn.task = task;
        } else {
            rtn.code = '1';
            rtn.message = '任务开始失败';
        }

        ctx.body = rtn;
    }

    @route('/:id/complete', HttpMethod.POST)
    async completeTask(ctx) {
        let taskId = ctx.params.id;
        let rtn = _.cloneDeep(commonRtn);

        let task = await taskService.completeTask(taskId);

        if (task) {
            rtn.message = '任务完成成功';
            rtn.task = task;
        } else {
            rtn.code = '1';
            rtn.message = '任务完成失败';
        }

        ctx.body = rtn;
    }

    @route('/undone', HttpMethod.GET)
    async getUndoneTasks(ctx) {
        let rtn = _.cloneDeep(commonRtn);
        let undoneTasks = await taskService.getUndoneTasks();

        if (undoneTasks) {
            rtn.undoneTasks = undoneTasks;
        } else {
            rtn.code = 1;
            rtn.message = '获取失败';
        }

        ctx.body = rtn;
    }

    @route('/recent-done-tasks', HttpMethod.GET)
    async recent3MonthDoneTasks(ctx) {
        let rtn = _.cloneDeep(commonRtn);
        let recent3MonthDoneTasks = await taskService.getRecent3MonthDoneTasks();

        if (recent3MonthDoneTasks) {
            rtn.recent3MonthDoneTasks = recent3MonthDoneTasks;
        } else {
            rtn.code = 1;
            rtn.message = '获取失败';
        }

        ctx.body = rtn;
    }
}
