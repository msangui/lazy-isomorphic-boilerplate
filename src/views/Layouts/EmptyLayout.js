import React, {Component, PropTypes} from 'react';

export default
class EmptyLayout extends Component {

    static propTypes = {
        children: PropTypes.element.isRequired
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
