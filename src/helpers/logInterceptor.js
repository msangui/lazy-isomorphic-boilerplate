import axios from '../contrib/axios/axios';
import logger from '../config/logger';
import moment from 'moment';
import {uniqueId} from 'lodash/utility';

// intercept all requests
axios.interceptors.request.use(config => {
    config.startedOn = Date.now();
    config.requestUID = uniqueId('request_');

    logger.log('info', 'server request', {
        method: config.method,
        url: config.url,
        data: config.data,
        params: config.params,
        requestUID: config.requestUID
    });
    return config;
}, error => {
    const config = error.config;
    logger.log('error', 'server request', {
        method: config.method,
        url: config.url,
        data: config.data,
        params: config.params,
        error: error.data
    });
    return error;
});

axios.interceptors.response.use(response => {
    const config = response.config;
    logger.log('info', 'server response', {
        requestUID: config.requestUID,
        responseTime: moment(Date.now()).diff(moment(config.startedOn))
    });
    return response;
}, error => {
    const config = error.config;
    logger.log('error', 'server response', {
        status: error.status,
        requestUID: config.requestUID,
        error: error.data
    });
});
