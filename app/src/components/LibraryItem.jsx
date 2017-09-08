import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
    Button,
    Progress,
} from 'reactstrap';
import {Link} from 'react-router-dom';

import {changeReadingBook} from '../states/main-actions.js';
import {addSelect, cancelSelect} from '../states/library-actions.js';

import './LibraryItem.css';

class LibraryItem extends React.Component {
    static propTypes = {
        edit: PropTypes.bool,
        select: PropTypes.bool,
        dispatch: PropTypes.func,
        bookTitle: PropTypes.string,
        bookPath: PropTypes.string,
        bookSize: PropTypes.number,
        bookProgress: PropTypes.number,
    };

    constructor(props) {
        super(props);

        this.jumpToReading = this.jumpToReading.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    render() {
        let display;

        if (this.props.edit) {
            let itemSelect = (this.props.select) ? 'libraryItemEdit select' : 'libraryItemEdit';
            display = (
                <div className="libraryItem">
                    <div className={itemSelect} onClick={this.handleSelect}>
                        <div className="bookCover">
                            <div className="container">
                                <div className="bookTitle">{this.props.bookTitle}</div>
                                <div className="bookPage">{(this.props.bookProgress === 0 ? '尚未閱讀' : '閱讀到: ' + (this.props.bookProgress / this.props.bookSize * 100).toFixed(3) + '%')}</div>
                                <Progress multi>
                                    <Progress bar value={this.props.bookProgress} max={this.props.bookSize} color='success' />
                                    <Progress className='restBar' bar value={this.props.bookSize - this.props.bookProgress} max={this.props.bookSize} />
                                </Progress>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            display = (
                <div className="libraryItem">
                    <Link to='/reading' onClick={this.jumpToReading}>
                        <div className="bookCover">
                            <div className="container">
                                <div className="bookTitle">{this.props.bookTitle}</div>
                                <div className="bookPage">{(this.props.bookProgress === 0 ? '尚未閱讀' : '閱讀到: ' + (this.props.bookProgress / this.props.bookSize * 100).toFixed(3) + '%')}</div>
                                <Progress multi>
                                    <Progress bar value={this.props.bookProgress} max={this.props.bookSize} color='success' />
                                    <Progress className='restBar' bar value={this.props.bookSize - this.props.bookProgress} max={this.props.bookSize} />
                                </Progress>
                            </div>
                        </div>
                    </Link>
                </div>
            );
        }

        return (
            <div>
                {display}
            </div>
        );
    }

    jumpToReading() {
        this.props.dispatch(changeReadingBook(this.props.bookTitle, this.props.bookSize, this.props.bookProgress, this.props.bookPath));
    }

    handleSelect() {
        if (this.props.select) {
            this.props.dispatch(cancelSelect(this.props.bookPath));
        } else {
            this.props.dispatch(addSelect(this.props.bookPath));
        }
    }
}

export default connect(state => ({
    ...state.libraryItem,
}))(LibraryItem);