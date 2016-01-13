import ViewLoader from '../App/ViewLoader';

const fetchComponent = () => {
    return new Promise(resolve => {
        if (__SERVER__) {
            resolve({componentName: 'items', component: require('./Items')});
            return;
        }
        require.ensure([], () => {
            resolve({componentName: 'items', component: require('./Items')});
        }, 'items');
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
