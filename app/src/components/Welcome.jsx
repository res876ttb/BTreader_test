// Welcome.jsx
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Jumbotron, Button} from 'reactstrap'; 
import {Link} from 'react-router-dom';

import './Welcome.css';

import {
    setCurPosition,
} from 'states/main-actions.js';

class Welcome extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
        color: PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="welcome-main container">
                <div className="welcome-jumbotron blur">
                    <div className="welcome-jumbotron-title" style={{color: this.props.color}}>
                        閱讀新世界
                    </div>
                    <br/>
                    {/* <div style={{border: "1px solid #999"}}></div> */}
                    <div className="welcome-jumbotron-content" style={{color: this.props.color}}>
                        BTreader是您在電腦上閱讀txt文件的最佳利器。自動的書籤紀錄讓你不怕忘記上次的閱讀進度。
                    </div>
                    <br/>
                    <Button color='primary' className="welcome-buttons" tag={Link} to='/reading'
                        onClick={() => {this.props.dispatch(setCurPosition('reading'));}}>閱讀上次進度</Button>
                    <Button color='secondary' className="welcome-buttons" tag={Link} to='/library'
                        onClick={() => {this.props.dispatch(setCurPosition('library'));}}>立刻前往書架</Button> 
                </div>
            </div>
        );
    }
}

export default connect(state => ({
    color:  state.reading.color,
}))(Welcome);