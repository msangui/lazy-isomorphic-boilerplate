import React, {Component, PropTypes} from 'react';
import Header from '../../components/Layout/Header/Header';
import Footer from '../../components/Layout/Footer/Footer';

export default
class DefaultLayout extends Component {

    static propTypes = {
        children: PropTypes.element
    }

    render() {
        return (
            <div className="default-layout">
                <Header />
                <article className="main-container">
                    {this.props.children}
                </article>
                <Footer/>
            </div>
        );
    }
}
