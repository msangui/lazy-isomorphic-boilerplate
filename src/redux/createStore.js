/* global __DEVELOPMENT__, __CLIENT__, __DEVTOOLS__ */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import promiseMiddleware from './promiseMiddleware';
import logMiddleware from './logMiddleware';
import crashReportMiddleWare from './crashReporterMiddleware';
import transitionMiddleware from './transitionMiddleware';
import * as reducers from '../reducers/reducers';
const reducer = combineReducers(reducers);

export default function(data) {
    const _promiseMiddleware = promiseMiddleware();
    const _logMiddleware = logMiddleware();
    const _crashReportMiddleWare = crashReportMiddleWare();
    const _transitionMiddleware = transitionMiddleware();
    let finalCreateStore;
    if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
        const { devTools, persistState } = require('redux-devtools');
        finalCreateStore = compose(
            applyMiddleware(_promiseMiddleware, _transitionMiddleware, _logMiddleware, _crashReportMiddleWare),
            devTools(),
            persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
        )(createStore);
    } else {
        finalCreateStore = applyMiddleware(_promiseMiddleware, _transitionMiddleware, _crashReportMiddleWare)(createStore);
    }
    return finalCreateStore(reducer, data);
}

