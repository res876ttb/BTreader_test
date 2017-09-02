import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
    ListGroup,
    ListGroupItem,
    Card,
    CardBlock,
    CardTitle, 
    CardSubtitle, 
    Button,
    Row,
    Col,
} from 'reactstrap';

import LibraryItem from 'components/LibraryItem.jsx';

import './Library.css';

class Library extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
        books: PropTypes.object,
    };

    constructor(props) {
        super(props);
    }

    render() {
        let children = [];
        let bk = this.props.books;
        for (let p in this.props.books) {
            children.push((
                <LibraryItem key={p} bookTitle={p} bookTotalPages={bk[p].bookTotalPages} bookCurrentPage={bk[p].bookCurrentPage} bookPath={bk[p].bookPath}/>
            ));
        }

        return (
            <div className="container library-main">
                {children}
            </div>
        );
    }
}

export default connect(state => ({
    ...state.library
}))(Library);