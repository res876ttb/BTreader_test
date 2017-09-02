import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
    Button,
    Progress,
} from 'reactstrap';
import {Link} from 'react-router-dom';

import {changeReadingBook} from 'states/main-actions.js';

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

        this.jumpToReading = this.jumpToReading.bind(this);
    }

    render() {
        return (
            <div className="libraryItem">
                <Link to='/reading' onClick={this.jumpToReading}>
                    <div className="bookCover">
                        <div className="container">
                            <div className="bookTitle">{this.props.bookTitle}</div>
                            <div className="bookPage">{(this.props.bookCurrentPage <= 1 ? '尚未閱讀' : '閱讀到: ' + this.props.bookCurrentPage.toString() + '/' + this.props.bookTotalPages.toString())}</div>
                            <Progress multi>
                                <Progress bar value={this.props.bookCurrentPage} max={this.props.bookTotalPages} color='success' />
                                <Progress className='restBar' bar value={this.props.bookTotalPages - this.props.bookCurrentPage} max={this.props.bookTotalPages} />
                            </Progress>
                        </div>
                    </div>
                </Link>
            </div>
        );
    }

    jumpToReading() {
        this.props.dispatch(changeReadingBook(this.props.bookTitle, this.props.bookCurrentPage, this.props.bookTotalPages, this.props.bookPath));
    }
}

export default connect(state => ({
    ...state.libraryItem,
}))(LibraryItem);