import {
    GET_ITEMS,
    GET_ITEMS_SUCCESS,
    GET_ITEMS_FAIL
    } from '../actions/actionTypes';

const initialState = {
    data: [],
    loading: false,
    error: false
};

export default function(state = initialState, action = {}) {
    switch (action.type) {
        case GET_ITEMS:
            return ((action, state) => {
                return {
                    ...state,
                    data: [],
                    loading: true,
                    error: false
                };
            })(action, state);
        case GET_ITEMS_SUCCESS:
            return ((action, state) => {
                return {
                    ...state,
                    loading: false,
                    data: action.items
                };
            })(action, state);
        case GET_ITEMS_FAIL:
            if (action.error.status === 0) {
                return state;
            }
            return {
                ...state,
                loading: false,
                error: action.error,
                data: []
            };
        default:
            return state;
    }
}

