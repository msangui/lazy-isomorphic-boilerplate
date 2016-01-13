import React, {Component, PropTypes} from 'react';
import {isEqual} from 'lodash/lang';
import * as routerActions from '../../actions/routerActions';
import {setRoutes} from '../../router/router';
import Breakpoint from '../../components/Common/Breakpoint/Breakpoint';
export default
class App extends Component {

    static propTypes = {
        children: PropTypes.element.isRequired,
        location: PropTypes.object,
        params: PropTypes.object,
        routes: PropTypes.array
    }

    static contextTypes = {
        store: PropTypes.object.isRequired
    }

    componentWillMount() {
        const {routes} = this.props;
        // set plain routes
        setRoutes(routes);
    }

    componentDidMount() {
        if ('addEventListener' in document) {
            document.addEventListener('DOMContentLoaded', () => {
                window.FastClick.attach(document.body);
            }, false);
        }
    }

    componentWillReceiveProps(props) {
        const {store} = this.context;
        const {location, params} = props;
        const {dispatch} = store;
        const state = store.getState();
        if (this.routeDiffersFromState(state.router.routerState, {location, params})) {
            dispatch(routerActions.changeRoute({
                location,
                params
            }));
        }
    }

    render() {
        return (
            <div>
                <Breakpoint />
                {this.props.children}
            </div>
        );
    }

    routeDiffersFromState(routerState, newRouterState) {
        return (routerState.location.pathname !== newRouterState.location.pathname) ||
            (routerState.location.search !== newRouterState.location.search) ||
            (!isEqual(routerState.params, newRouterState.params));
    }

}
