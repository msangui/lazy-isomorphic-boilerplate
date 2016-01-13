import axios from '../contrib/axios/axios';

// intercept external requests
axios.interceptors.request.use(requestConfig => {

    if (requestConfig.processed) {
        return requestConfig;
    }
    requestConfig.url = 'http://jsonplaceholder.typicode.com' + requestConfig.url.replace('/api', '');

    requestConfig.headers.processed = true;
    requestConfig.processed = true;
    return requestConfig;
});
