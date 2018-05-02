import { put } from 'redux-saga/effects'

import Http from '../utils/http'
import { action, saga, reducer } from '../utils/redux-decorators'

const GET_UNDONE_TASKS_API = './api/tasks/undone'

class UndoneTasksService {
    @action('GET_UNDONE_TASKS')
    static UNDONE_TASKS_ACTION

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

    @reducer('undoneTask')
    GET_UNDONE_TASKS_SUCCESS(state, payload) {
        return {
            ...state,
            ...payload
        }
    }
}

