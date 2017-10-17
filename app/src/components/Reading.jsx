import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import './Reading.css';

import {Progress} from 'reactstrap';

import {
    changeReadingBook, 
    deleteSelect,
    changeReadingContent,
    setProgress,
} from '../states/main-actions.js';
import {
    Traditionalized,
    Simplized,
} from '../api/traditionalization.js';

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
        
        this.handleKeyPress = this.handleKeyPress.bind(this);
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
        this.fontSize = 18;
        this.readingMainStyle = {
            minHeight: '200px',
            maxWidth: '800px !important',
            color: 'black',
            textAlign: 'center'
        };
        this.readingInnerStyle = {
            height: this.props.divHeight - 145,
            background: 'rgba(255, 255, 255, 0.4)',
            margin: '30px 15px 20px 15px',
            padding: '30px',
            borderRadius: '10px',
            fontSize: this.fontSize,
            textAlign: 'left',
            whiteSpace: 'pre-wrap'
        };
        let content = this.formatContent(this.fontSize);
        
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
                <div className="container" style={this.readingMainStyle}>
                    <div 
                        style={this.readingInnerStyle} 
                        id='reading-content'
                    >
                        {content}
                    </div>
                    <Progress multi 
                        style={{margin: '16px'}} 
                        id='reading-progress'
                    >
                        <Progress bar 
                            value={this.props.bookProgress} 
                            max={this.props.bookSize} 
                            color='success' 
                        />
                        <Progress className='restBar' bar 
                            value={this.props.bookSize - this.props.bookProgress} 
                            max={this.props.bookSize} 
                        />
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
        let i = 0;
        
        for (i = 0; i < _content.length; i += 1) {
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
        this.numOfWords = numOfWords;
        return content;
    }
    
    getLineLength(txt, fontSize) {
        this.element = document.createElement('canvas');
        this.context = this.element.getContext("2d");
        this.context.font = 'Microsoft JhengHei';
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
        let buffer_t = new Buffer(5000);
        if (this.props.bookPath !== '') {
            fs.open(this.props.bookPath, 'r', (err1, fd) => {
                if (err1 !== null) {
                    console.error(err1);
                }
                fs.read(fd, buffer, 0, buffer.length, this.props.bookProgress, (err2, byteRead, readResult) => {
                    if (byteRead === 0) {
                        this.props.dispatch(setProgress(0 - this.bufferLength));
                        return;
                    }
                    
                    if (err2 !== null) {
                        console.error(err2);
                    } else if (readResult === null) {
                        console.error('Empty content!');
                    }
    
                    const iconv = require('iconv-lite');
                    
                    // if encoding is null, set default encoding to utf-8
                    let encoding = this.props.encoding;
                    if (encoding === null || encoding === 'utf-8') {
                        console.log('use encoding utf-8');
                        encoding = 'utf-8';
                    } else {
                        console.log('use encoding', encoding);
                    }
                    // copy readResult to a new array
                    let result = readResult.slice(0, byteRead);
                    // decode text by utf-8
                    let translated = Traditionalized(iconv.decode(result, encoding));
                    this.props.dispatch(changeReadingContent(translated));
                    fs.close(fd);
                });
            });
        }
    }
    
    nextPage() {
        console.log('Next Page');
        let text = this.props.bookContent;
        let numOfWords = this.numOfWords;
        const iconv = require('iconv-lite');
        let oriTxt = '';
        for (let i = 0; i < numOfWords; i += 1) {
            oriTxt += text[i];
        }
        let simTxt = Simplized(oriTxt);
        let buffer = iconv.encode(simTxt, this.props.encoding);
        console.log('buffer size:', buffer.length);
        this.bufferLength = buffer.length;
        this.props.dispatch(setProgress(buffer.length));
        this.readFileContent();
    }
    
    previousPage() {
        console.log('Previous Page');
    }

    handleKeyPress(e) {
        if ((e.keyCode === 32 && e.shiftKey === false) || e.keyCode === 39) {
            this.nextPage();
        } else if ((e.keyCode === 32 && e.shiftKey === true) || e.keyCode === 37) {
            this.previousPage();
        }
    }
}

export default connect(state => ({
    ...state.reading,
}))(Reading);