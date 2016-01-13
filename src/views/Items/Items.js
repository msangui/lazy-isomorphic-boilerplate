import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Loading from '../../components/Common/Loading/Loading';
import * as itemsActions from '../../actions/itemsActions';

@connect(state => ({
    items: state.items.data,
    loading: state.items.loading
}))
export default
class Items extends Component {
    static propTypes = {
        items: PropTypes.array,
        loading: PropTypes.bool
    }

    render() {
        const {items, loading} = this.props;

        const itemsElements = items.map((item, index) => (
            <tr key={`item-${index}`} className="item">
                <td>
                    {item.id}
                </td>
                <td>
                    {item.userId}
                </td>
                <td>
                    {item.title}
                </td>
                <td>
                    {item.body}
                </td>
            </tr>
        ));

        const content = loading ? (
            <Loading show />
        ) : (
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>UID</th>
                        <th>Title</th>
                        <th>Body</th>
                    </tr>
                </thead>
                <tbody>
                    {itemsElements}
                </tbody>
            </table>
        );

        return (
            <div className="items view-container">
                <h1>Items</h1>
                {content}
            </div>
        );
    }

    static fetchData(store) {
        return store.dispatch(itemsActions.getItems());
    }
}
