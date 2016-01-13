import React, {Component} from 'react';
import {Link} from 'react-router';

export default
class Header extends Component {

    render() {
        return (
            <div className="header">
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <Link className="navbar-brand" to="/">Home</Link>
                            <Link className="navbar-brand" to="/items">Items</Link>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}
