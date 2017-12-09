// react import
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Progress} from 'reactstrap';
import ReactTooltip from 'react-tooltip';

import ReadingCover from 'components/ReadingCover.jsx';

import {
    SetProgress,
    deleteSelect,
    SetAbsoluteProgress,
    libraryAddBookmark,
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

import './Reading.css';

// js import
const fs = require('fs');
const iconv = require('iconv-lite');
const {ipcRenderer} = require('electron');
const jcd = require('jschardet');

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
        this.readFileContent = this.readFileContent.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handleJumpClick = this.handleJumpClick.bind(this);
        this.handleChapterClick = this.handleChapterClick.bind(this);
        this.handlePreviousClick = this.handlePreviousClick.bind(this);
        this.handleBookmarkClick = this.handleBookmarkClick.bind(this);
        this.handleAddBookmarkClick = this.handleAddBookmarkClick.bind(this);
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
            height: this.props.divHeight - 120,
            margin: '2rem 1rem 7px 1rem',
            padding: '30px 0px 30px 30px',
            borderRadius: '13px',
            fontSize: this.fontSize,
            lineHeight: this.lineHeight,
            textAlign: 'left',
            whiteSpace: 'pre-wrap'
        };
        let content = this.formatContent(this.fontSize, this.lineHeight);
        
        if (this.props.bookPath === '') {
            display = (
                <div className="reading-noRecord-outter container">
                    <div className="reading-noRecord-inner blur">
                        沒有最近的閱讀紀錄，從書架選一本書來閱讀吧！
                    </div>
                </div>
            );
        } else {
            display = (
                <div className="container" style={this.readingMainStyle}>
                    <div 
                        style={this.readingInnerStyle} 
                        className='reading-content blur'
                    >
                        {content}
                    </div>
                    <div className='reading-content-enpty-div'>
                        <i className="fa fa-bookmark reading-icon reading-icon-bookmark" onClick={this.handleBookmarkClick} data-tip="書籤列表"></i>
                        <i className="fa fa-plus-square reading-icon reading-icon-addBookmark" onClick={this.handleAddBookmarkClick} data-tip="將本頁加入書籤"></i>
                        <i className="fa fa-share reading-icon reading-icon-jump" onClick={this.handleJumpClick} data-tip="跳轉"></i>
                        {/* <i className="fa fa-list-ul reading-icon reading-icon-chapter" onClick={this.handleChapterClick} data-tip="章節"></i> */}
                        <div className='reading-progress' data-tip="目前進度">
                            {String((this.props.bookProgress / this.props.bookSize * 100).toFixed(1))}
                            <span style={{fontSize: '8px'}}>%</span>
                        </div>
                        <ReactTooltip place="left" effect="solid" />
                    </div>
                </div>
            );
        }

        return (
            <div id='readingFrame'>
                {display}
                <div id='readingLeftButton' onClick={this.handlePreviousClick} onContextMenu={this.handleNextClick}></div>
                <div id='readingRightButton'  onClick={this.handleNextClick} onContextMenu={this.handlePreviousClick}></div>
                <ReadingCover 
                    readFileContent={this.readFileContent}/>
            </div>
        );
    }

    findProgress(prog) {
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
        if (this.props.coverState === 2) {
            this.props.dispatch(setReadingCoverFadeoutState(1));
            setTimeout(() => {
                this.props.dispatch(setReadingCoverState(0));
            }, 400);
        } else {
            this.props.dispatch(setReadingCoverState(2));
            this.props.dispatch(setReadingCoverFadeoutState(0));
        }
    }

    handleAddBookmarkClick() {
        console.log("Reading: AddBookmark is clicked!");
        let d = new Date();
        let t = [d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()];
        let c = this.getContent100(this.props.bookContent);
        let p = this.props.bookProgress;
        let s = this.props.bookSize;
        let b = this.props.bookPath;
        this.props.dispatch(libraryAddBookmark(b, p, s, t, c));
        if (this.props.coverState === 3) {
            this.props.dispatch(setReadingCoverFadeoutState(1));
            setTimeout(() => {
                this.props.dispatch(setReadingCoverState(0));
            }, 400);
        } else {
            this.props.dispatch(setReadingCoverState(3));
            this.props.dispatch(setReadingCoverFadeoutState(0));
        }
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

    getContent100(content) {
        let result = '';
        for (let i = 0; i < content.length && i < 100; i++) {
            if (content[i] !== ' ' && content[i] !== '\n' && content[i] !== '\r' && content[i] !== '\t') {
                result += content[i];
            }
        }
        return result;
    }

    formatContent(fontSize, lineHeight) {
        let oriContent = this.props.bookContent;
        let _content = this.formatWidth(fontSize, String(this.props.bookContent));
        let content = '';
        let height = this.props.divHeight - 160;
        let fixError = 0, i = 0, j = 0, numOfLines = 0;
        for (i = 0; i < _content.length; i += 1) {
            if (this.checkLineEmpty(_content[i])) {
                j += _content[i].length;
                fixError += _content[i].length;
            } else {
                if (_content[i][_content[i].length - 1] !== oriContent[j + _content[i].length - 1]) {
                    // this line is broken manually
                    fixError -= 1;
                    j += _content[i].length - 1;
                } else {
                    j += _content[i].length;
                }
                content += _content[i];
                numOfLines += 1;
                if ((numOfLines + 1) * lineHeight * fontSize > height) {
                    break;
                }
            }
        }
        this.numOfWords = content.length + fixError;
        return content;
    }

    formatWidth(fontSize, _content) {
        let content = [];
        let line = '';
        let numOfSpecial = 0, len = 0;
        for (let i = 0; i < _content.length; i += 1) {
            let c = _content[i];
            numOfSpecial += this.calSpecial(c);
            len = this.getLineLength(line + c, fontSize) + numOfSpecial * fontSize * 0.15;
            if (c === '\n') {
                content.push(line + c);
                line = '';
                numOfSpecial = 0;
            } else if (len <= this.props.divWidth) {
                line += c;
            } else {
                i -= 1;
                content.push(line + '\n');
                line = '';
                numOfSpecial = 0;
            }
        }
        content.push(line);
        return content;
    }

    checkLineEmpty(line) {
        for(let i = 0; i < line.length; i += 1) {
            if (line[i] !== ' ' && line[i] !== '\r' && line[i] !== '\n') {
                return false;
            }
        }
        return true;
    }

    calSpecial(c) {
             if (c === '-') {return 1.84;} 
        else if (c === '.') {return -0.058;} 
        else if (c === '"') {return 0.5;} 
        else if (c === "'") {return 0.37;} 
        else if (c === '‘' || c === '’') {return 0.95;} 
        else if (c === '“' || c === '”') {return 1.42;} 
        else if (c === ' ') {return 0.4;}
        else if (c === '=') {return 0.15;} 
        else if (c === '0') {return 0.3;} 
        else if (c === '1') {return -0.5;} 
        else if (c === '2'||c==='3'||c==='4'||c==='5'||c==='6'||c==='8'||c==='9') {return 0.35;} 
        else if (c === '7') {return -0.05;} 
        else if (c === '_') {return -0.35;} 
        else if (c === ',') {return -0.08;} 
        else if (c === '!') {return 0.4;} 
        else if (c === '?') {return -0.1;}
        else if (c === '(' || c === ')') {return 0.02;}
        else if (c === '[' || c === ']') {return 0.385;}
        else if (c === '{' || c === '}') {return 0;}
        else if (c === '@') {return -1;}
        else if (c === '*') {return 0.8;}
        else if (c === '/' || c === '\\') {return 1.5;}
        else if (c === '#') {return 0.3;}
        else if (c === '%') {return 0.6;}
        else if (c === '`') {return 0.02;}
        else if (c === '^') {return 0.35;}
        else if (c === '>' || c === '<') {return 0.2;}
        else if (c === '|') {return -0.42;}
        else if (c === '~') {return -0.53;}
        else if (c === '$') {return 0.3;}
        else if (c.match(/[\x00-\xff]/g) && c !== '\n' && c !== ' ') {return 1;} 
        else {return 0;}
    }
    
    getLineLength(txt, fontSize) {
        this.element = document.createElement('canvas');
        this.context = this.element.getContext("2d");
        this.context.font = 'PingFang TC';
        return this.context.measureText(txt).width * fontSize / 10;
    }

    checkFile() {
        console.log('Reading: Check if book exists:', this.props.bookPath);
        if (this.props.bookPath !== '' && fs.existsSync(this.props.bookPath) === false) {
            console.log('Reading: Book does not exist!');
            ipcRenderer.sendSync('synchronous-message', 'fileNotExists');
            this.props.dispatch(changeReadingBook('', 0, 0, '', ''));
            this.props.dispatch(deleteSelect([this.props.bookPath]));
        }
    }

    readFileContent() {
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
            let content = this.formatWidth(this.fontSize, txt);
            return {txt, content};
        }).then(v => {
            console.log('Previous Page: Select line.');
            let result = '';
            let _content = v.txt;
            let content = v.content;
            let height = this.props.divHeight - 160;
            let lineHeight = this.lineHeight;
            let fontSize = this.fontSize;
            let fixLineError = 0, fixEmptyError = '', i = 0, j = _content.length - 1, numOfLines = 0;
            for (i = content.length - 1; i >= 0; i -= 1) {
                if (this.checkLineEmpty(content[i])) {
                    // empty line 
                    j -= content[i].length;
                    fixEmptyError += content[i];
                } else {
                    if (_content[j] !== content[i][content[i].length - 1]) {
                        // this line is broken manually => fix line ending error
                        fixLineError += 1;
                        j -= (content[i].length - 1);
                    } else {
                        j -= content[i].length;
                    }
                    result += content[i];
                    numOfLines += 1;
                    if ((numOfLines + 1) * lineHeight * fontSize > height) {
                        break;
                    }
                }
            }
            result += fixEmptyError;
            return {result, fixLineError};
        }).then(v => {
            console.log('Previous Page: Set offset.');
            let correction = '';
            for (let i = 0; i < v.fixLineError; i++) {correction += '\n';}
            // let simTxt = Simplized(v.result);
            let simTxt = v.result;
            let buffer1 = iconv.encode(simTxt, this.props.encoding);
            let buffer2 = iconv.encode(correction, this.props.encoding);
            let bufferLength = buffer1.length - buffer2.length;
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