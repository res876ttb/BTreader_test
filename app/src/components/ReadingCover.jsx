import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import './ReadingCover.css';

import {
    Input,
    Button,
} from 'reactstrap';

import {
    setReadingCoverState,
    setReadingCoverFadeoutState,
} from '../states/reading-actions.js';

class ReadingCover extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
        coverState: PropTypes.number,
        coverFadeOut: PropTypes.number,
    };

    constructor(props) {
        super(props);

        this.hideCover = this.hideCover.bind(this);
    }

    render() {
        if (this.props.coverState === 1) {
            return (
                <div>
                    <div className={this.props.coverFadeOut === 1 ? "reading-cover-background reading-cover-background-fadeout" : "reading-cover-background"} onClick={this.hideCover}></div>
                    <div className={this.props.coverFadeOut === 1 ? "reading-cover-jump reading-cover-jump-fadout" : "reading-cover-jump"}>
                        <div className="reading-cover-title">跳轉</div>
                        <Input placeholder="進度百分比"></Input>
                        <Button className="btn btn-outline-secondary reading-cover-button-cancel" onClick={this.hideCover}>取消</Button>
                        <Button color="success" className="reading-cover-button-go">前往</Button>
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
}

export default connect(state => ({
    coverState: state.reading.coverState,
    coverFadeOut: state.reading.coverFadeOut,
}))(ReadingCover);