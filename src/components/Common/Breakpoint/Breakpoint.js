import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as layoutActions from '../../../actions/layoutActions';
import debounce from '../../../utils/debounce';
import getStyle from '../../../utils/getStyle';

class Breakpoint extends Component {

    static propTypes = {
        changeBreakpoint: PropTypes.func
    };

    constructor() {
        super();

        this.onResize = debounce(this.resize.bind(this), 300).bind(this);
    }


    componentWillMount() {
        if (__CLIENT__) {
            if (window.addEventListener) {
                window.addEventListener('resize', this.onResize);
            } else {
                window.attachEvent('onresize', this.onResize);
            }
            this.onResize();
        }
    }

    render() {
        return (
            <span>
                <span ref="lg" className="hidden-xs hidden-sm hidden-md"/>
                <span ref="md" className="hidden-xs hidden-sm hidden-lg"/>
                <span ref="sm" className="hidden-xs hidden-md hidden-lg"/>
                <span ref="xs" className="hidden-sm hidden-md hidden-lg"/>
            </span>
        );
    }

    resize() {
        const {changeBreakpoint} = this.props;

        ['lg', 'md', 'sm', 'xs']
            .map(key => ({key, element: this.refs[key]}))
            .filter(item => getStyle(item.element, 'display') === 'inline')
            .forEach(item => changeBreakpoint(item.key, document.body.getBoundingClientRect()));
    }
}

@connect(() => ({}))
export default
class BreakpointContainer extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired
    };

    render() {
        return (
            <Breakpoint
                {...bindActionCreators(layoutActions, this.props.dispatch)} />
        );
    }
}
