import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';

export default
class Loading extends Component {
    static propTypes = {
        className: PropTypes.string,
        show: PropTypes.bool
    }

    render() {
        const {show, className} = this.props;

        return show ? (
            <div className={classnames('loading', className)}>
                <div className="loader"></div>
            </div>
        ) : null;
    }
}

