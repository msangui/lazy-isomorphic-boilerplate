import express from 'express';
import bodyParser from 'body-parser';
import axios from '../contrib/axios/axios';
import logger from '../config/logger';

const clientApi = express();
clientApi.use(bodyParser.json());

clientApi.post('/errors', (req, res) => {
    const data = req.body;
    logger.log('error', data);
    res.status(200);
});
clientApi.all('*', (req, res) => {

    const processed = req.headers.proceesed;
    const request = {method: req.method, processed: true};

    if (!processed) {
        if (request.method === 'POST') {
            request.data = req.body;
        } else {
            request.params = req.query;
        }

        request.url = 'http://jsonplaceholder.typicode.com' + req.url;

    } else {
        request.url = req.url;
        request.data = req.data;
    }

    axios(request).then(response => {
        res.json(response.data);
    }).catch(response => {
        res.status(response.status).json(response.data);
    });
});

export default clientApi;
