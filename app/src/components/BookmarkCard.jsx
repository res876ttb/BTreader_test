import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {
    libraryDeleteBookmark,
    SetAbsoluteProgress,
} from '../states/library-actions.js';
import {
    setAbsoluteProgress,
} from '../states/reading-actions.js';

import './BookmarkCard.css';

class BookmarkCard extends React.Component {
    static props = {
        dispatch: PropTypes.func,
        progress: PropTypes.number,
        size: PropTypes.number,
        content: PropTypes.string,
        date: PropTypes.array,
        hide: PropTypes.func,
        bookPath: PropTypes.string,
        readFileContent: PropTypes.func,
    }

    constructor(props) {
        super(props);

        this.handleJump = this.handleJump.bind(this);
        this.handleDeleteBookmark = this.handleDeleteBookmark.bind(this);
    }

    render() {
        let content = this.props.content;
        let progress = String((this.props.progress / this.props.size * 100).toFixed(3));
        let date = String(this.props.date[0]) + '/' + String(this.props.date[1]) + '/' +
            String(this.props.date[2]) + ' ' + String(this.props.date[3]) + ':';
        if (this.props.date[4] < 10) {
            date += '0' + String(this.props.date[4]);
        } else {
            date += String(this.props.date[4]);
        }
        return (
            <div className='bookmarkCard-main'>
                <div className='bookmarkCard-content' onClick={this.handleJump}>
                    {content}
                </div>
                <div className='bookmarkCard-information'>
                    <div className='bookmarkCard-progress' style={{
                        width: '70px',
                        display: 'inline-block',
                    }}>{progress}%</div>
                    <div style={{
                        width: '120px',
                        display: 'inline-block'}}>
                        {date}
                    </div>
                    <div className='bookmarkCard-delete' onClick={this.handleDeleteBookmark}>
                        <i className="fa fa-trash"></i>
                        刪除
                    </div>
                </div>
            </div>
        );
    }

    handleDeleteBookmark() {
        console.log('Delete bookmark ' + this.props.progress);
        this.props.dispatch(libraryDeleteBookmark(this.props.bookPath, this.props.progress));
    }

    handleJump() {
        console.log('Jump to bookmark ' + this.props.progress);
        this.props.dispatch(setAbsoluteProgress(this.props.progress));
        this.props.dispatch(SetAbsoluteProgress(this.props.bookPath, this.props.progress));
        this.props.readFileContent();
        this.props.hide();
    }
};

export default connect(state => ({
    
}))(BookmarkCard);