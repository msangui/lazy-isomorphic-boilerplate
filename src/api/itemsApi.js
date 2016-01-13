import axios from '../contrib/axios/axios';

export const getItems = () => {
    return axios.get('/api/posts', {
        abortOnRetry: true,
        requestId: 'get-items'
    }).then(res => ({items: res.data}));
};
