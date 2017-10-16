import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
    ListGroup,
    ListGroupItem,
    Card,
    CardBlock,
    CardTitle, 
    CardSubtitle, 
    Button,
    Row,
    Col,
} from 'reactstrap';
import {Link} from 'react-router-dom';

import LibraryItem from '../components/LibraryItem.jsx';

import './Library.css';

import {
    setEdit,
    cancelAllSelect,
} from '../states/library-actions.js';
import {
    deleteSelect,
    addBook
} from '../states/main-actions.js';

class Library extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
        books: PropTypes.object,
        edit: PropTypes.bool,
        select: PropTypes.array,
    };

    constructor(props) {
        super(props);

        this.setEditTrue = this.setEditTrue.bind(this);
        this.setEditFalse = this.setEditFalse.bind(this);
        this.openFile = this.openFile.bind(this);
        this.deleteSelect = this.deleteSelect.bind(this);
        this.cancelAllSelect = this.cancelAllSelect.bind(this);
    }

    render() {
        let controlButton;
        let children = [];
        let bk = this.props.books;
        for (let p in this.props.books) {
            children.push((
                <LibraryItem 
                    key={p} 
                    edit={this.props.edit} 
                    bookTitle={bk[p].bookTitle} 
                    bookSize={bk[p].bookSize}
                    bookProgress={bk[p].bookProgress} 
                    bookPath={p} 
                    encoding={bk[p].encoding}
                    select={this.props.select.indexOf(p) > -1}
                />
            ));
        }

        if (this.props.edit) {
            if (this.props.select.length > 0) {
                controlButton = (
                    <div>
                        <Button color="danger" className="library-edit-button" onClick={this.deleteSelect}>刪除</Button>
                        <Button color="secondary" className="library-edit-button" onClick={this.cancelAllSelect}>取消</Button>
                    </div>
                );
            } else {
                controlButton = (
                    <div>
                        <Button color="primary" className="library-edit-button" onClick={this.openFile}>開啟...</Button>
                        <Button color="secondary" className="library-edit-button" onClick={this.setEditFalse}>取消</Button>
                    </div>
                );
            }
        } else {
            controlButton = (
                <Button color="info" className="library-edit-button" onClick={this.setEditTrue}>編輯</Button>
            );
        }

        return (
            <div className="container library-main">
                <div className="container library-button-panel">
                    {controlButton}
                </div>
                {children}
                <div className='footer'>
                    BTreader By Hsu Keng Jui
                </div>
            </div>
        );
    }

    setEditTrue() {
        this.props.dispatch(setEdit(true));
    }
    
    setEditFalse() {
        this.props.dispatch(setEdit(false));
    }

    cancelAllSelect() {
        this.props.dispatch(cancelAllSelect());
        this.props.dispatch(setEdit(false));
    }

    openFile() {
        const {ipcRenderer} = require('electron');
        const fs = require('fs');
        let paths = ipcRenderer.sendSync('synchronous-message', 'openTXT');
        console.log(paths);

        // read info of files
        // api: addBook(bookTitle, bookSize, bookProgress, bookPath)
        if (paths !== null) {
            for (let p in paths) {
                let bookPath = paths[p];
                let bookSize = fs.statSync(bookPath).size;
                let bookTitle = bookPath.split('/').pop().split('\\').pop().split('.')[0];
                this.getEncoding(bookPath).then(encoding => {
                    this.props.dispatch(addBook(bookTitle, bookSize, 0, bookPath, encoding));
                });
            }
        }

        this.props.dispatch(setEdit(false));
    }
    
    getEncoding(bookPath) {
        const fs = require('fs');
        return new Promise((resolve, reject) => {
            if (bookPath === '') reject('empty path');
            var buffer = new Buffer(100);
            fs.open(bookPath, 'r', (err1, fd) => {
                if (err1 !== null) {
                    console.error(err1);
                }
                fs.read(fd, buffer, 0, buffer.length, 0, (err2, byteRead, readResult) => {
                    if (err2 !== null) {
                        reject(err2);
                    } else if (readResult === null) {
                        reject('Empty content!');
                    }
                    return resolve(readResult);
                });
            });
        }).then(rr => {
            const jcd = require('jschardet');
            let encoding = jcd.detect(rr).encoding.toLowerCase();
            console.log('Encoding is', encoding);
            return encoding;
        }).catch(e => {
            console.error(e);
        });
    }

    deleteSelect() {
        this.props.dispatch(deleteSelect(this.props.select));
        this.props.dispatch(cancelAllSelect());
        this.props.dispatch(setEdit(false));
    }
}

export default connect(state => ({
    ...state.library,
}))(Library);