import {put} from 'redux-saga/effects'

import Http from '../utils/http'
import {action, saga, reducer} from '../utils/redux-decorators'
import {Simulate} from "react-dom/test-utils";
import animationIteration = Simulate.animationIteration;

const GET_UNDONE_TASKS_API = './api/tasks/undone'
const CREATE_TASK_API = './api/tasks'
const START_TASK_API = './api/tasks/:id/start'
const COMPLETE_TASK_API = './api/tasks/:id/complete'

class UndoneTasksService {
    @action('GET_UNDONE_TASKS')
    static UNDONE_TASKS_ACTION
    @action('CREATE_TASK')
    static CREATE_TASK_ACTION
    @action('START_TASK')
    static START_TASK_ACTION
    @action('COMPLETE_TASK')
    static COMPLETE_TASK_ACTION

    @saga()
    static* GET_UNDONE_TASKS(action) {
        try {
            let data = yield Http.get(GET_UNDONE_TASKS_API)

            if (data.code !== 0) {
                yield put({
                    type: UndoneTasksService.UNDONE_TASKS_ACTION.FAILED
                })

                action.payload.callback && action.payload.callback(data.message)
                return
            }

            yield put({
                type: UndoneTasksService.UNDONE_TASKS_ACTION.SUCCESS,
                payload: {
                    undoneTasks: data.undoneTasks
                }
            })

            action.payload.callback && action.payload.callback(null)
        } catch (err) {
            yield put({type: UndoneTasksService.UNDONE_TASKS_ACTION.FAILED})
        }
    }

    @reducer('undoneTasks')
    GET_UNDONE_TASKS_SUCCESS(state, payload) {
        return {
            ...state,
            ...payload
        }
    }

    @saga()
    static* CREATE_TASK(action) {
        try {
            let data = yield Http.post(CREATE_TASK_API,
                action.payload.task
            )

            if (data.code !== 0) {
                yield put({
                    type: UndoneTasksService.CREATE_TASK_ACTION.FAILED
                })

                action.payload.callback && action.payload.callback(data.message)
                return
            }

            yield put({
                type: UndoneTasksService.CREATE_TASK_ACTION.SUCCESS,
                payload: {
                    undoneTasks: data.undoneTasks
                }
            })

            yield put({
                type: UndoneTasksService.UNDONE_TASKS_ACTION.ACTION
            })

            action.payload.callback && action.payload.callback(null)
        } catch (err) {
            yield put({type: UndoneTasksService.CREATE_TASK_ACTION.FAILED})
        }
    }

    @saga()
    static* START_TASK(action) {
        try {
            let data = yield Http.post(
                Http.setParam(START_TASK_API, [{name: 'id', value: action.payload.taskId}]),
                null
            )

            if (data.code !== 0) {
                yield put({
                    type: UndoneTasksService.START_TASK_ACTION.FAILED
                })

                action.payload.callback && action.payload.callback(data.message)
                return
            }

            yield put({
                type: UndoneTasksService.UNDONE_TASKS_ACTION.ACTION
            })

            action.payload.callback && action.payload.callback()
        } catch (err) {
            yield put({type: UndoneTasksService.START_TASK_ACTION.FAILED})
        }
    }

    @saga()
    static* COMPLETE_TASK(action) {
        try {
            let data = yield Http.post(
                Http.setParam(COMPLETE_TASK_API, [{name: 'id', value: action.payload.taskId}]),
                null
            )

            if (data.code !== 0) {
                yield put({
                    type: UndoneTasksService.COMPLETE_TASK_ACTION.FAILED
                })

                action.payload.callback && action.payload.callback(data.message)
                return
            }

            yield put({
                type: UndoneTasksService.UNDONE_TASKS_ACTION.ACTION
            })

            action.payload.callback && action.payload.callback()
        } catch (err) {
            yield put({type: UndoneTasksService.COMPLETE_TASK_ACTION.FAILED})
        }
    }
}
