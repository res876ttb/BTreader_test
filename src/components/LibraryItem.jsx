import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Button} from 'reactstrap';
import {Link} from 'react-router-dom';

import './LibraryItem.css';

class LibraryItem extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
        bookTitle: PropTypes.string,
        bookTotalPages: PropTypes.number,
        bookCurrentPage: PropTypes.number,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="libraryItem">
                <Link to='/reading'>
                    <div className="bookCover">
                        <div className="container">
                            <div className="bookTitle">{this.props.bookTitle}</div>
                            <div className="bookPage">閱讀到: {this.props.bookCurrentPage}/{this.props.bookTotalPages}</div>
                        </div>
                    </div>
                </Link>
                {/* <Button color="primary" className="bookButton">繼續閱讀</Button> */}
            </div>
        );
    }
}

export default connect(state => ({
    ...state.libraryItem,
}))(LibraryItem);