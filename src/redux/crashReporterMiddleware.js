import axios from '../contrib/axios/axios';
import serverConfig from '../config/config';

export default function crashLogger() {
    return () => (next) => (action) => {
        try {
            return next(action);
        } catch (err) {
            const url = __SERVER__ ? 'http://127.0.0.1:' + serverConfig.port : '';
            axios.post(url + '/api/errors', {
                action: action.type,
                message: err.message,
                stack: err.stack
            });
            throw err;
        }
    };
}
