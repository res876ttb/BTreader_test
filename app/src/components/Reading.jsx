import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import './Reading.css';

import {Progress} from 'reactstrap';
import ReactTooltip from 'react-tooltip';

import {
    SetProgress,
    deleteSelect,
    SetAbsoluteProgress,
} from '../states/library-actions.js';
import {
    setProgress,
    setJumpProgress,
    changeReadingBook,
    setAbsoluteProgress,
    changeReadingContent,
    setReadingCoverState,
    setReadingCoverFadeoutState,
} from '../states/reading-actions.js';
import {
    Traditionalized,
    Simplized,
} from '../api/traditionalization.js';

import ReadingCover from 'components/ReadingCover.jsx';

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
        divHeight: PropTypes.number,
        fontSize: PropTypes.number,
        lineHeight: PropTypes.number,
        coverState: PropTypes.number,
        jumpProgress: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.fontSize = this.props.fontSize;
        this.lineHeight = this.props.lineHeight;
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handleJumpClick = this.handleJumpClick.bind(this);
        this.handleChapterClick = this.handleChapterClick.bind(this);
        this.handlePreviousClick = this.handlePreviousClick.bind(this);
        this.handleBookmarkClick = this.handleBookmarkClick.bind(this);
    }

    componentWillMount() {
        this.checkFile();
        this.readFileContent();
        window.addEventListener('keyup', this.handleKeyPress);
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.handleKeyPress); 
    }

    componentDidUpdate() {
        if (this.props.jumpProgress !== -1) {
            this.findProgress(this.props.jumpProgress);
            this.props.dispatch(setJumpProgress(-1));
        }
    }

    render() {
        let display;
        this.readingMainStyle = {
            minHeight: '200px',
            maxWidth: '800px !important',
            color: 'black',
            textAlign: 'center'
        };
        this.readingInnerStyle = {
            height: this.props.divHeight - 145,
            margin: '30px 15px 20px 15px',
            padding: '30px',
            borderRadius: '10px',
            fontSize: this.fontSize,
            lineHeight: this.lineHeight,
            textAlign: 'left',
            whiteSpace: 'pre-wrap'
        };
        let content = this.formatContent(this.fontSize, this.lineHeight);
        
        if (this.props.bookPath === '') {
            display = (
                <div className="reading-noRecord-outter container">
                    <div className="reading-noRecord-inner">
                        沒有最近的閱讀紀錄，從書架選一本書來閱讀吧！
                    </div>
                </div>
            );
        } else {
            display = (
                <div className="container" style={this.readingMainStyle}>
                    <div 
                        style={this.readingInnerStyle} 
                        className='reading-content'
                    >
                        {content}
                    </div>
                    <div className='reading-content-enpty-div'>
                        <i className="fa fa-bookmark reading-icon reading-icon-bookmark" onClick={this.handleBookmarkClick} data-tip="書籤"></i>
                        <i className="fa fa-share reading-icon reading-icon-jump" onClick={this.handleJumpClick} data-tip="跳轉"></i>
                        {/* <i className="fa fa-list-ul reading-icon reading-icon-chapter" onClick={this.handleChapterClick} data-tip="章節"></i> */}
                        <ReactTooltip place="left" effect="solid" />
                    </div>
                    <Progress multi 
                        style={{margin: '16px 16px 0px 16px'}} 
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
                <div id='readingLeftButton' onClick={this.handlePreviousClick} onContextMenu={this.handleNextClick}></div>
                <div id='readingRightButton'  onClick={this.handleNextClick} onContextMenu={this.handlePreviousClick}></div>
                <ReadingCover />
            </div>
        );
    }

    findProgress(prog) {
        const fs = require('fs');
        const jcd = require('jschardet');
        let guessP = Math.floor(this.props.bookSize * prog / 100);
        let find = new Promise((res, rej) => {
            for (let ofs = 0; ofs < 5; ofs += 1) {
                let buffer = new Buffer(100);
                if (this.props.bookPath !== '') {
                    fs.open(this.props.bookPath, 'r', (err1, fd) => {
                        if (err1 !== null) {
                            console.error(err1);
                        }
                        fs.read(fd, buffer, 0, buffer.length, guessP + ofs, (err2, byteRead, readResult) => {
                            if (byteRead === 0) {
                                console.log('findProgress: Cannot read this page!');
                                return;
                            }
                            
                            if (err2 !== null) {
                                console.error(err2);
                            } else if (readResult === null) {
                                console.error('findProgress: Empty content!');
                            }
                            
                            // copy readResult to a new array
                            let result = readResult.slice(0, byteRead);
                            // check if encoding is correct
                            let encoding = jcd.detect(result).encoding;
                            if (encoding !== null) {
                                if (encoding.toLowerCase() === this.props.encoding) {
                                    res(guessP + ofs);
                                }
                            }
                            fs.close(fd);
                        });
                    });
                }
            }
        }).then(prog => {
            this.props.dispatch(setAbsoluteProgress(prog));
            this.props.dispatch(SetAbsoluteProgress(this.props.bookPath, prog));
            this.readFileContent();
        });
    }

    handleChapterClick() {
        console.log('Reading: Chapter is clicked!');
    }

    handleBookmarkClick() {
        console.log("Reading: Bookmark is clicked!");
    }

    handleJumpClick() {
        console.log("Reading: Jump is clicked!");
        if (this.props.coverState === 1) {
            this.props.dispatch(setReadingCoverFadeoutState(1));
            setTimeout(() => {
                this.props.dispatch(setReadingCoverState(0));
            }, 400);
        } else {
            this.props.dispatch(setReadingCoverState(1));
            this.props.dispatch(setReadingCoverFadeoutState(0));
        }
        
    }
    
    formatContent(fontSize, lineHeight) {
        let result = '';
        let _content = this.props.bookContent;
        let content = this.formatWidth(fontSize, String(this.props.bookContent));
        let height = this.props.divHeight - 205; 
        let numOfLines = 0;
        let numOfLineError = 0;
        let i = 0;
        let j = 0;
        
        while (i < content.length) {
            if (content[i] === '\n') {
                numOfLines += 1;
                if (_content[j] !== '\n') {
                    j -= 1;
                    numOfLineError += 1;
                }
                if (lineHeight * numOfLines * fontSize > height) {
                    break;
                }
            }
            result += content[i];
            i += 1;
            j += 1;
        }
        this.numOfWords = i + 1 - numOfLineError;
        return result;
    }
    
    formatWidth(fontSize, _content) {
        let content = '';
        let offset = 0;
        let numOfLines = 1;
        let numOfWords = 0;
        let numOfSpecial = 0;
        let line = '';
        let len = 0;
        
        for (let i = 0; i < _content.length; i += 1) {
            let c = _content[i];
            if (c === '-') {
                numOfSpecial += 1.65;
            } else if ((c.match(/[\x00-\xff]/g) && c !== '\n' && c !== ' ') || 
                 c === '“' || c === '”' || c === '‘' || c === '’') {
                numOfSpecial += 1;
            } 
            len = this.getLineLength(line + c, fontSize) + numOfSpecial * fontSize * 0.15;
            if (c === '\n') {
                numOfWords += 1;
                content += '\n';
                line = '';
                numOfLines += 1;
                numOfSpecial = 0;
            } else if (len <= this.props.divWidth) {
                numOfWords += 1;
                content += c;
                line += c;
            } else {
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
        console.log('Reading: Check if book exists:', this.props.bookPath);
        if (this.props.bookPath !== '' && fs.existsSync(this.props.bookPath) === false) {
            console.log('Reading: Book does not exist!');
            ipcRenderer.sendSync('synchronous-message', 'fileNotExists');
            this.props.dispatch(changeReadingBook('', 0, 0, '', ''));
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
                fs.read(fd, buffer, 0, buffer.length, this.props.bookProgress, (err2, byteRead, readResult) => {
                    if (byteRead === 0) {
                        this.props.dispatch(setProgress(0 - this.bufferLength));
                        this.props.dispatch(SetProgress(this.props.bookPath, 0 - this.bufferLength));
                        console.log('ReadFile: Cannot read this page!');
                        return;
                    }
                    
                    if (err2 !== null) {
                        console.error(err2);
                    } else if (readResult === null) {
                        console.error('ReadFile: Empty content!');
                    }
    
                    const iconv = require('iconv-lite');
                    
                    // if encoding is null, set default encoding to utf-8
                    let encoding = this.props.encoding;
                    if (encoding === null || encoding === 'utf-8') {
                        console.log('ReadFile: Use encoding: utf-8');
                        encoding = 'utf-8';
                    } else {
                        console.log('ReadFile: Use encoding:', encoding);
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
        console.log('Next Page: Key press detected!');
        let text = this.props.bookContent;
        let numOfWords = this.numOfWords;
        const iconv = require('iconv-lite');
        let oriTxt = '';
        for (let i = 0; i < numOfWords; i += 1) {
            oriTxt += text[i];
        }
        let simTxt = Simplized(oriTxt);
        let buffer = iconv.encode(simTxt, this.props.encoding);
        console.log('Next Page: Buffer size:', buffer.length);
        this.bufferLength = buffer.length;
        this.props.dispatch(setProgress(buffer.length));
        this.props.dispatch(SetProgress(this.props.bookPath, buffer.length));
        this.readFileContent();
    }
    
    previousPage() {
        console.log('Previous Page: Key press detect.');
        if (this.props.bookProgress === 0) {
            console.log('Pregious Page: This is the first page.');
            return;
        }
        let p = new Promise((res, rej) => {
            console.log('Previous Page: Read previous content');
            const fs = require('fs');
            let buffer = new Buffer(4000);
            fs.open(this.props.bookPath, 'r', (err1, fd) => {
                if (err1 !== null) {
                    console.error(err1);
                }
                fs.read(fd, buffer, 0, buffer.length, this.props.bookProgress - 4000, (err2, byteRead, readResult) => {
                    if (byteRead === 0) {
                        this.props.dispatch(setProgress(0 - this.bufferLength));
                        this.props.dispatch(SetProgress(this.props.bookPath, 0 - this.bufferLength));
                        console.log('Previous Page: Cannot read previous page!');
                        return;
                    }
                    
                    if (err2 !== null) {
                        console.error(err2);
                    } else if (readResult === null) {
                        console.error('Previous Page: Empty content!');
                    }
        
                    const iconv = require('iconv-lite');
                    
                    // if encoding is null, set default encoding to utf-8
                    let encoding = this.props.encoding;
                    if (encoding === null || encoding === 'utf-8') {
                        console.log('Previous Page: Use encoding: utf-8');
                        encoding = 'utf-8';
                    } else {
                        console.log('Previous Page: Use encoding:', encoding);
                    }
                    // copy readResult to a new array
                    let result;
                    if (this.props.bookProgress - 4000 < 0) {
                        result = readResult.slice(0, this.props.bookProgress);
                    } else {
                        result = readResult.slice(0, byteRead);
                    }
                    // decode text by utf-8
                    let translated = Traditionalized(iconv.decode(result, encoding));
                    fs.close(fd);
                    res(translated);
                });
            });
        }).then(txt => {
            console.log('Previous Page: Format content in background.');
            this.tmp = txt;
            return this.formatWidth(this.fontSize, String(txt));
        }).then(txt => {
            console.log('Previous Page: Select line.');
            let result = '';
            let _content = this.tmp;
            let content = txt;
            let height = this.props.divHeight - 205; 
            let lineHeight = this.lineHeight;
            let fontSize = this.fontSize;
            let numOfLines = 0;
            let numOfLineError = 0;
            let i = content.length - 1;
            let j = this.tmp.length - 1;
            
            while (i >= 0) {
                if (content[i] === '\n') {
                    numOfLines += 1;
                    if (_content[j] !== '\n') {
                        j += 1;
                        numOfLineError += 1;
                    }
                    if (lineHeight * numOfLines * fontSize > height) {
                        break;
                    }
                }
                result = content[i] + result;
                i -= 1;
                j -= 1;
            }
            this.numOfWords = content.length - i + numOfLineError;
            return {result, numOfLineError};
        }).then(v => {
            console.log('Previous Page: Set offset.');
            const iconv = require('iconv-lite');
            let correction = '';
            for (let i = 0; i < v.numOfLineError; i++) {correction += '\n';}
            let simTxt = Simplized(v.result);
            let buffer1 = iconv.encode(simTxt, this.props.encoding);
            let buffer2 = iconv.encode(correction, this.props.encoding);
            let bufferLength = buffer1.length - buffer2.length + 1;
            console.log('Previous Page: Buffer size of previous page is', bufferLength);
            if (this.props.bookProgress - bufferLength <= 0) {
                this.props.dispatch(setProgress(0 - this.props.bookProgress));
                this.props.dispatch(SetProgress(this.props.bookPath, 0 - this.props.bookProgress));
            } else {
                this.props.dispatch(setProgress(0 - bufferLength));
                this.props.dispatch(SetProgress(this.props.bookPath, 0 - bufferLength));
            }
            this.readFileContent();
        }).catch(e => {
            console.error('Something go wrong:', e);
        });
    }

    handleKeyPress(e) {
        if (this.props.coverState === 0 && document.getElementById("search-library") !== document.activeElement) {
            if ((e.keyCode === 32 && e.shiftKey === false) || e.keyCode === 39) {
                this.nextPage();
            } else if ((e.keyCode === 32 && e.shiftKey === true) || e.keyCode === 37) {
                this.previousPage();
            }
        }
        
        if (e.keyCode === 27 && this.props.coverState !== 0) {
            this.props.dispatch(setReadingCoverFadeoutState(1));
            setTimeout(() => {
                this.props.dispatch(setReadingCoverState(0));
            }, 400);
        }
    }

    handleNextClick() {
        if (this.props.bookPath !== '') {
            this.nextPage();
        }
    }

    handlePreviousClick() {
        if (this.props.bookPath !== '') {
            this.previousPage();
        }
    }
}

export default connect(state => ({
    bookPath:       state.reading.bookPath,
    bookTitle:      state.reading.bookTitle,
    bookProgress:   state.reading.bookProgress,
    bookSize:       state.reading.bookSize,
    bookContent:    state.reading.content,
    encoding:       state.reading.encoding,
    coverState:     state.reading.coverState,
    jumpProgress:   state.reading.jumpProgress,
    divWidth:       state.main.divWidth,
    divHeight:      state.main.divHeight,
    fontSize:       state.setting.fontSize,
    lineHeight:     state.setting.lineHeight,
}))(Reading);