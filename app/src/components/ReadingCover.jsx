import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
    Input,
    Button,
} from 'reactstrap';

import {
    setJumpProgress,
    setReadingCoverState,
    setReadingCoverFadeoutState,
} from '../states/reading-actions.js';

import './ReadingCover.css';

class ReadingCover extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
        coverState: PropTypes.number,
        coverFadeOut: PropTypes.number,
        bookSize: PropTypes.number,
        bookProgress: PropTypes.number,
    };

    constructor(props) {
        super(props);

        this.hideCover = this.hideCover.bind(this);
        this.handleDecimal = this.handleDecimal.bind(this);
        this.handleSetProgress = this.handleSetProgress.bind(this);
    }

    render() {
        if (this.props.coverState === 1) {
            return (
                <div>
                    <div className={this.props.coverFadeOut === 1 ? "reading-cover-background reading-cover-background-fadeout" : "reading-cover-background"} onClick={this.hideCover}></div>
                    <div className={this.props.coverFadeOut === 1 ? "reading-cover-jump reading-cover-jump-fadout" : "reading-cover-jump"}>
                        <div className="reading-cover-title">跳轉</div>
                        <Input id="jump-box" placeholder={'目前進度：' + String((this.props.bookProgress / this.props.bookSize * 100).toFixed(3)) + ' %'} type="text" onKeyPress={this.handleDecimal}></Input>
                        <Button className="btn btn-outline-secondary reading-cover-button-cancel" onClick={this.hideCover}>取消</Button>
                        <Button color="success" className="reading-cover-button-go" onClick={this.handleSetProgress}>前往</Button>
                    </div>
                </div>
            );
        } else {
            return (<div></div>);
        }
    }

    hideCover() {
        if (this.props.coverState !== 0) {
            this.props.dispatch(setReadingCoverFadeoutState(1));
            setTimeout(() => {
                this.props.dispatch(setReadingCoverState(0));
            }, 400);
        }
    }

    handleSetProgress() {
        let prog = document.getElementById('jump-box').value;
        this.hideCover();
        this.props.dispatch(setJumpProgress(prog));
    }

    handleDecimal(e) {
        let ele = document.getElementById('jump-box');
        let keyCode = e.keyCoce | e.which;
        if (keyCode >= 48 && keyCode <= 57) {
            if (ele.value.length === 2 && ele.value.indexOf('.') === -1) {
                ele.value += '.';
            } else if (ele.value.length === 6) {
                e.preventDefault();
            }
        } else if (keyCode === 46) {
            if (ele.value.length === 2 && ele.value.indexOf('.') === -1) {
                // pass
            } else if (ele.value.length === 1) {
                // pass
            } else {
                e.preventDefault();
            }
        } else if (keyCode === 13 && ele.value !== '') {
            this.handleSetProgress();
        } else {
            e.preventDefault();
        }
    }
}

export default connect(state => ({
    coverState:     state.reading.coverState,
    coverFadeOut:   state.reading.coverFadeOut,
    bookSize:       state.reading.bookSize,
    bookProgress:   state.reading.bookProgress,
}))(ReadingCover);