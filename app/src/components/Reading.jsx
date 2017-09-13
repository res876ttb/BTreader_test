import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import './Reading.css';

import {Progress} from 'reactstrap';
import {
    changeReadingBook, 
    deleteSelect,
    changeReadingContent,
} from '../states/main-actions.js';
import {Traditionalized} from '../api/traditionalization.js';

class Reading extends React.Component {
    static props = {
        dispatch: PropTypes.func,
        bookPath: PropTypes.string,
        bookTitle: PropTypes.string,
        bookProgress: PropTypes.number,
        bookSize: PropTypes.number,
        bookContent: PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.checkFile();
        this.readFileContent();
    }

    render() {
        let display;
        let readingMainStyle = {
            'minHeight': '200px',
            'maxWidth': '800px !important',
            'color': 'black',
            'textAlign': 'center'
        };
        let readingInnerStyle = {
            'background': 'rgba(255, 255, 255, 0.4)',
            'margin': '30px 15px 20px 15px',
            'padding': '30px',
            'borderRadius': '10px',
            'fontSize': '20px',
            'textAlign': 'left'
        };
        let _content = String(this.props.bookContent).split('\n');
        let content = [];
        for (let i in _content) {
            content.push(_content[i], (<br />));
        }

        if (this.props.bookPath === '') {
            display = (
                <div className="noRecord-outter container">
                    <div className="noRecord-inner">
                        沒有最近的閱讀紀錄，從書架選一本書來閱讀吧！
                    </div>
                </div>
            );
        } else {
            display = (
                <div className="container" style={readingMainStyle}>
                    <div style={readingInnerStyle} id='reading-content'>
                        {content} <br/>
                    </div>
                    <Progress multi style={{margin: '16px'}} id='reading-progress'>
                        <Progress bar value={this.props.bookProgress} max={this.props.bookSize} color='success' />
                        <Progress className='restBar' bar value={this.props.bookSize - this.props.bookProgress} max={this.props.bookSize} />
                    </Progress>
                </div>
            );
        }

        return (
            <div>
                {display}
            </div>
        );
    }

    checkFile() {
        const fs = require('fs');
        const {ipcRenderer} = require('electron');
        console.log(this.props.bookPath);
        if (this.props.bookPath !== '' && fs.existsSync(this.props.bookPath) === false) {
            ipcRenderer.sendSync('synchronous-message', 'fileNotExists');
            this.props.dispatch(changeReadingBook('', 0, 0, ''));
            this.props.dispatch(deleteSelect([this.props.bookPath]));
        }
    }

    readFileContent() {
        const fs = require('fs');
        let buffer = new Buffer(1000);
        if (this.props.bookPath !== '') {
            fs.open(this.props.bookPath, 'r', (err1, fd) => {
                if (err1 !== null) {
                    console.error(err1);
                }
                fs.read(fd, buffer, 0, buffer.length, 0, (err2, byteRead, readResult) => {
                    if (err2 !== null) {
                        console.error(err2);
                    }
    
                    const jcd = require('jschardet');
                    const iconv = require('iconv-lite');
                        this.props.dispatch(changeReadingContent(Traditionalized(iconv.decode(readResult, jcd.detect(readResult).encoding.toLowerCase()), byteRead)));
                });
            });
        }
    }

    getTexSize(txt, font) {
        this.element = document.createElement('canvas');
        this.context = this.element.getContext("2d");
        this.context.font = font;
        var tsize = {'width':this.context.measureText(txt).width, 'height':parseInt(this.context.font)};
        return tsize;
    }
}

export default connect(state => ({
    ...state.reading,
}))(Reading);