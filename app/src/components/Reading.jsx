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
        encoding: PropTypes.string,
        divWidth: PropTypes.number,
        divHeight: PropTypes.number
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.checkFile();
        this.readFileContent();
        window.addEventListener('keydown', this.handleKeyPress);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyPress);
    }

    render() {
        let display;
        let fontSize = 18;
        let readingMainStyle = {
            minHeight: '200px',
            maxWidth: '800px !important',
            color: 'black',
            textAlign: 'center'
        };
        let readingInnerStyle = {
            height: this.props.divHeight - 145,
            background: 'rgba(255, 255, 255, 0.4)',
            margin: '30px 15px 20px 15px',
            padding: '30px',
            borderRadius: '10px',
            fontSize: fontSize,
            textAlign: 'left',
            whiteSpace: 'pre-wrap'
        };
        
        // let fcontent = this.formatContent(fontSize);
        // let _content = fcontent.split('\n');
        // let content = [];
        // for (let i in _content) {
        //     content.push(_content[i], (<br />));
        // }
        let content = this.formatContent(fontSize);

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
                        {content}
                    </div>
                    <Progress multi style={{margin: '16px'}} id='reading-progress'>
                        <Progress bar value={this.props.bookProgress} max={this.props.bookSize} color='success' />
                        <Progress className='restBar' bar value={this.props.bookSize - this.props.bookProgress} max={this.props.bookSize} />
                    </Progress>
                </div>
            );
        }

        return (
            <div id='readingFrame'>
                {display}
            </div>
        );
    }
    
    formatContent(fontSize) {
        // let _content = String(this.props.bookContent).split('\n');
        let _content = String(this.props.bookContent);
        let height = this.props.divHeight - 205; 
        let lineheight = 1.5;
        let content = '';
        let offset = 0;
        let numOfLines = 1;
        let numOfWords = 0;
        let numOfSpecial = 0;
        let line = '';
        let len = 0;
        
        console.log(this.props.divWidth);
        
        for (let i = 0; i < _content.length; i += 1) {
            let c = _content[i];
            if (c === '“' || c === '”') {
                numOfSpecial += 1;
            } 
            len = this.getLineLength(line + c, fontSize) + numOfSpecial * fontSize * 0.1;
            if (c === '\n') {
                numOfWords += 1;
                if (lineheight * numOfLines * fontSize > height) {
                    break;
                }
                content += '\n';
                line = '';
                numOfLines += 1;
                numOfSpecial = 0;
            } else if (len <= this.props.divWidth) {
                numOfWords += 1;
                content += c;
                line += c;
            } else {
                if (lineheight * numOfLines * fontSize > height) {
                    break;
                }
                i -= 1;
                content += '\n';
                line = '';
                numOfLines += 1;
                numOfSpecial = 0;
            }
        }
        
        return content;
    }
    
    getLineLength(txt, fontSize) {
        this.element = document.createElement('canvas');
        this.context = this.element.getContext("2d");
        this.context.font = 'PingFang TC';
        return this.context.measureText(txt).width * fontSize / 10;
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
        let buffer = new Buffer(4000);
        if (this.props.bookPath !== '') {
            fs.open(this.props.bookPath, 'r', (err1, fd) => {
                if (err1 !== null) {
                    console.error(err1);
                }
                console.log(this.props.bookProgress);
                fs.read(fd, buffer, 0, buffer.length, this.bookProgress, (err2, byteRead, readResult) => {
                    if (err2 !== null) {
                        console.error(err2);
                    } else if (readResult === null) {
                        console.error('Empty content!');
                    } else {
                        console.log(readResult);
                    }
    
                    const jcd = require('jschardet');
                    const iconv = require('iconv-lite');
                    
                    let encoding = this.props.encoding;
                    
                    // if encoding is null, set default encoding to utf-8
                    if (encoding === null) {
                        console.log('encoding is null! use default: utf-8');
                        encoding = 'utf-8'; 
                    } 
                    let text = Traditionalized(iconv.decode(readResult, encoding), byteRead);
                    this.props.dispatch(changeReadingContent(text));
                });
            });
        }
    }

    handleKeyPress(e) {
        if ((e.keyCode === 32 && e.shiftKey === false) || e.keyCode === 39) {
            console.log('Next Page');
        } else if ((e.keyCode === 32 && e.shiftKey === true) || e.keyCode === 37) {
            console.log('Previous Page');
        }
    }
}

export default connect(state => ({
    ...state.reading,
}))(Reading);