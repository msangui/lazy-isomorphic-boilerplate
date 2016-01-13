import App from './App/App';

// Home
import preHome from './Home/preHome';

// Layouts
import DefaultLayout from './Layouts/DefaultLayout';

// Items
import preItems from './Items/preItems';

export default {
    app: {
        component: App
    },
    defaultLayout: {
        component: DefaultLayout
    },
    home: {
        component: preHome
    },
    items: {
        component: preItems
    }
};
