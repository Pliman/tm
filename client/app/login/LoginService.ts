import { put } from 'redux-saga/effects'

import Http from '../utils/http'
import { action, saga, reducer } from '../utils/redux-decorators'

const LOGIN_API = './api/users/login'

class LoginService {
    @action('LOGIN')
    static ACTION

    @saga()
    static * LOGIN(action, payload) {
        try {
            let data = yield Http.post(LOGIN_API, action.payload.user)

            if (data.code !== 0) {
                yield put({
                    type: LoginService.ACTION.FAILED
                })

                action.payload.callback && action.payload.callback(data.message)

                return
            }

            yield put({
                type: LoginService.ACTION.SUCCESS,
                payload: {
                    user: data.user
                }
            })

            action.payload.callback && action.payload.callback(null)
        } catch (err) {
            yield put({type: LoginService.ACTION.FAILED})
            action.payload.callback && action.payload.callback(err)
        }
    }

    @reducer('user')
    LOGIN_SUCCESS(state, payload) {
        return {
            ...state,
            ...payload
        }
    }
}

