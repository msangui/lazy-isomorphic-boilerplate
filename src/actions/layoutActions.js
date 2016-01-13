import {
    LAYOUT_BREAKPOINT_CHANGE
    } from './actionTypes';

export function changeBreakpoint(breakpoint, clientRect) {
    return {
        type: LAYOUT_BREAKPOINT_CHANGE,
        breakpoint,
        clientRect
    };
}
