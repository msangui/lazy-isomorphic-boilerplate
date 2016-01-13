import {
    GET_ITEMS,
    GET_ITEMS_SUCCESS,
    GET_ITEMS_FAIL
    } from './actionTypes';
import * as itemsApi from '../api/itemsApi';

export function getItems(params) {
    return {
        types: [
            GET_ITEMS,
            GET_ITEMS_SUCCESS,
            GET_ITEMS_FAIL
        ],
        promise: itemsApi.getItems(params)
    };
}
