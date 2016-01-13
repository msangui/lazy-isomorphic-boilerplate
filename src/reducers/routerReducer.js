import {
    ROUTER_CHANGE_ROUTE
    } from '../actions/actionTypes';
import {parseQuery} from '../router/router';

const initialState = {
    routerState: {}
};

export default function router(state = initialState, action = {}) {

    switch (action.type) {
        case ROUTER_CHANGE_ROUTE:
            action.routerState.location.query = parseQuery(action.routerState.location.query);

            return {
                ...state,
                routerState: Object.assign({}, state.routerState, action.routerState)
            };
        default:
            return state;
    }

}
