import {
    ROUTER_CHANGE_ROUTE
    } from './actionTypes';

export function changeRoute(routerState) {

    return {
        type: ROUTER_CHANGE_ROUTE,
        routerState
    };
}
