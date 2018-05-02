import { applyMiddleware, createStore, compose, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { createLogger } from 'redux-logger'

import { getReducers, getSagas } from '../utils/redux-decorators'

const reducer = combineReducers({
  ...getReducers(),
  routing: routerReducer
})

const sagaMiddleware = createSagaMiddleware()

let createStoreWithMiddleware

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
  const logger = createLogger({
    collapsed: true
  })

  createStoreWithMiddleware = compose(applyMiddleware(sagaMiddleware, routerMiddleware(), logger))(createStore)
} else {
  createStoreWithMiddleware = applyMiddleware(sagaMiddleware, routerMiddleware())(createStore)
}

const store = createStoreWithMiddleware(reducer, {})
sagaMiddleware.run(getSagas)

export default store
