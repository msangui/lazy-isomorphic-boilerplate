import Express from 'express';
import React from 'react';
import {Provider} from 'react-redux';
import {renderToString} from 'react-dom/server';
import {match, RoutingContext} from 'react-router';
import favicon from 'serve-favicon';
import compression from 'compression';
import path from 'path';
import Html from './Html';
import serverConfig from './config/config';
import createStore from './redux/createStore';
import clientApi from './api/clientApi';
import {buildRoutes, getRouteDependencies, getRouteComponents} from './router/router';
import logger from './config/logger';
import proxy from 'proxy-middleware';
import url from 'url';
import cluster from 'cluster';
import os from 'os';

// init interceptors
require('./helpers/logInterceptor');
require('./helpers/serverInterceptor');

if (cluster.isMaster) {

    // Count the machine's CPUs
    const cpuCount = os.cpus().length;

    // Create a worker for each CPU
    for (let i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', (worker) => {

        // Replace the dead worker, we're not sentimental
        console.log('Worker %d died :(', worker.id);
        cluster.fork();

    });

    console.info('==> ✅ Server is listening');
    console.info('==> ? %s running on port %s', serverConfig.app.name, serverConfig.port);
// Code to run if we're in a worker process
} else {

    const app = new Express();

    app.use(compression());
    app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));
    app.use(require('serve-static')(path.join(__dirname, '..', 'static')));
    app.use('/api', clientApi);

    if (__DEVELOPMENT__) {
        app.use('/dist', proxy(url.parse('http://' + process.env.HOST + ':' + process.env.WEBPACK_PORT + '/dist')));
    }

    app.use((req, res) => {
        navigator.userAgent = req.headers['user-agent'];
        try {
            const routes = buildRoutes();
            match({routes, location: req.url}, (error, redirectLocation, renderProps) => {

                if (error) {
                    res.status(500).send({error: error.message});
                    logger.log('error', `router ${error.message}`);
                } else if (renderProps) {
                    let store;
                    try {
                        // set router state
                        store = createStore({
                            router: {
                                routerState: {
                                    location: renderProps.location,
                                    params: renderProps.params
                                }
                            }
                        });
                    } catch (e) {
                        res.status(500).send({error: e.stack});
                        logger.log('error', e.message, e.stack);
                    }
                    Promise.all(getRouteComponents(renderProps.components)).then(routeComponents => {
                        try {
                            const components = routeComponents.map(routeComponent => routeComponent && routeComponent.component ? routeComponent.component : routeComponent);

                            Promise.all(
                                getRouteDependencies(
                                    components,
                                    store,
                                    renderProps.location,
                                    renderProps.params)
                            ).then(() => {
                                try {
                                    if (redirectLocation) {
                                        res.redirect(redirectLocation.pathname + redirectLocation.search);
                                        return;
                                    }
                                    const storeState = store.getState();

                                    const component = (
                                        <Provider store={store} key="provider">
                                            <RoutingContext {...renderProps} components={components}/>
                                        </Provider>
                                    );

                                    try {
                                        res.send('<!doctype html>\n' +
                                            renderToString(<Html component={component}
                                                                 storeState={storeState}/>));
                                    } catch (e) {
                                        res.status(500).send({error: e.stack});
                                        logger.log('error', e.message, e.stack);
                                    }
                                } catch (e) {
                                    res.status(500).send({error: e.stack});
                                    logger.log('error', e.message, e.stack);
                                }

                            });
                        } catch (e) {
                            res.status(500).send({error: e.stack});
                            logger.log('error', e.message, e.stack);
                        }
                    });
                } else {
                    res.status(404).send({error: 'Not found'});
                    logger.log('error', `router 404 ${req.url}`);
                }
            });
        } catch (e) {
            res.status(500).send({error: e.stack});
            logger.log('error', e.message, e.stack);
        }

    });

    app.listen(serverConfig.port, (err) => {
        if (err) {
            logger.log('error', err);
        }
    });
}
