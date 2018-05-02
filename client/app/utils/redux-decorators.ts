import { fork, takeEvery } from 'redux-saga/effects'

let actionTypes = {}
let sagas = []
let reducers = {}

export function actionGenerator(key) {
    return {
        ACTION: key,
        SUCCESS: `${key}_SUCCESS`,
        FAILED: `${key}_FAILED`
    }
}

export function action(typeName?) {
    return (target, key) => {
        if (!actionTypes[typeName || key]) {
            actionTypes[typeName || key] = actionGenerator(typeName || key)
        }

        target[key] = actionTypes[typeName || key]
    }
}

export function saga(actionType?, effect?) {
    return (target, key, descriptor) => {
        sagas.push(function* () {
            yield (effect || takeEvery)(actionType || key, descriptor.value)
        })

        return descriptor
    }
}

export function* getSagas() {
    let saga
    for (let i = 0, length = sagas.length; i < length; i++) {
        yield fork(sagas[i])
    }
}

function createReducer(initialState, fnMap) {
    return (state = initialState, {
        type,
        payload
    }, ...rest) => {
        const handler = fnMap[type]
        return handler ? handler(state, payload, ...rest) : state
    }
}

export function reducer(namespace?, actionType?, initialState?) {
    return (target, key, descriptor) => {
        let reducer = createReducer(initialState || null, {
            [actionType || key]: descriptor.value
        })

        if (reducers[namespace || target.constructor.name]) {
            console.error(`reducer namespace ${namespace || target.constructor.name} all ready exists`)
        }

        reducers = {
            ...reducers,
            [namespace || target.constructor.name]: reducer
        }

        return descriptor
    }
}

export function getReducers() {
    return reducers
}
