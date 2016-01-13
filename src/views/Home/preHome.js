import ViewLoader from '../App/ViewLoader';

const fetchComponent = () => {
    return new Promise(resolve => {
        if (__SERVER__) {
            resolve({componentName: 'home', component: require('./Home')});
            return;
        }
        require.ensure([], () => {
            resolve({componentName: 'home', component: require('./Home')});
        }, 'home');
    });
};

export default
class PreHome extends ViewLoader {

    static fetchComponent = fetchComponent;

    constructor() {
        super();
        this.fetch = fetchComponent;
    }
}
