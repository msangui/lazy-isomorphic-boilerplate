import {match} from 'react-router';
import axios from '../contrib/axios/axios';
import {getRouteElement, getRouteDependencies, getRouteComponents} from '../router/router';
import {ROUTER_CHANGE_ROUTE} from '../actions/actionTypes';
import qs from 'qs';

export default function() {
    return (store) => (next) => (action) => {
        if (action.type === ROUTER_CHANGE_ROUTE) {
            const routerState = action.routerState;
            const routes = getRouteElement();
            const query = routerState.location.query || {};

            const queryString = qs.stringify(query);
            const queryParams = queryString ? '?' + queryString : '';

            const url = routerState.location.pathname + queryParams;

            // abort all pending requests
            axios.abortAll();

            // find current route's matching component
            match({routes, location: url}, (error, redirectLocation, renderProps) => {
                Promise.all(getRouteComponents(renderProps.components)).then(routeComponents => {
                    const components = routeComponents.map(routeComponent => routeComponent && routeComponent.component ? routeComponent.component : routeComponent);

                    // for elements loaded dinamically
                    Promise.all(getRouteDependencies(
                        components,
                        store,
                        routerState.location,
                        renderProps.params
                    ));

                });
                // no need to wait for the dependency since this only gets called from the client-side
            });

            next(action);
        } else {
            next(action);
        }
    };
}
