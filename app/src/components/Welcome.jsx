import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Jumbotron, Button} from 'reactstrap'; 
import {Link} from 'react-router-dom';

import './Welcome.css';

export default class Welcome extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="welcome-main container">
                <div className="welcome-jumbotron blur">
                    <div className="welcome-jumbotron-title">
                        閱讀新世界
                    </div>
                    <br/>
                    {/* <div style={{border: "1px solid #999"}}></div> */}
                    <div className="welcome-jumbotron-content">
                        BTreader是您在電腦上閱讀txt文件的最佳利器。自動的書籤紀錄讓你不怕忘記上次的閱讀進度。
                    </div>
                    <br/>
                    <Button color='primary' className="welcome-buttons" tag={Link} to='/reading'>閱讀上次進度</Button>
                    <Button color='secondary' className="welcome-buttons" tag={Link} to='/library'>立刻前往書架</Button> 
                </div>
            </div>
        );
    }
}