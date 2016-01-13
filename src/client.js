import React from 'react';
import ReactDOM from 'react-dom';
import Router, {match} from 'react-router';
import {Provider} from 'react-redux';
import createStore from './redux/createStore';
import {createHistory} from 'history';
import {buildRoutes, getRouteComponents} from './router/router';

Object.assign = Object.assign || require('object-assign');

const storeState = window.__data;

const store = createStore(storeState);
const globalState = store.getState();

require('./style/themes/base.scss');

require('es6-promise').polyfill();

// create history
const history = createHistory(store);

match({ routes: buildRoutes(), location: globalState.router.routerState.location.pathname }, (error, redirectLocation, renderProps) => {
    // no need to wait for the dependency since this only gets called from the client-side
    Promise.all(getRouteComponents(renderProps.components)).then((loadedComponents) => {
        const routes = buildRoutes(loadedComponents);

        ReactDOM.render(
            <Provider store={store} key="provider">
                <Router history={history} children={routes}/>
            </Provider>,
            document.getElementById('content'));
    });
});
