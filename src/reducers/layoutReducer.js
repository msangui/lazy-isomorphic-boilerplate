import {
    LAYOUT_BREAKPOINT_CHANGE
    } from '../actions/actionTypes';

const initialState = {
    breakpoint: '',
    width: 0
};

export default function(state = initialState, action = {}) {
    switch (action.type) {
        case LAYOUT_BREAKPOINT_CHANGE:
            return {
                ...state,
                breakpoint: action.breakpoint,
                width: action.clientRect.right - action.clientRect.left
            };
        default:
            return state;
    }
}
