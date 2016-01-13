import React, {Component} from 'react';
import Loading from '../../components/Common/Loading/Loading';

export default
class ViewLoader extends Component {

    constructor() {
        super();
        this.state = {
            component: (<Loading className="view-container loading-container" show />)
        };
        this.fetch = () => {};
    }
    componentWillMount() {
        this.fetch().then(routeComponent => {
            this.setState({
                component: React.createElement(routeComponent.component)
            });
        });
    }

    render() {
        return this.state.component;
    }
}
