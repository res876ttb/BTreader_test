import React from 'react';
import PropTypes from 'prop-types';
import {
    BrowserRouter as Router,
    Route, 
    Link,
    Redirect,
} from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Input, 
    Button
} from 'reactstrap';
import {connect} from 'react-redux';

import {
    toggleNavbar, 
    resetBooks,
    addBook,
    changeReadingBook,
    setInitialize,
    setOsVersion,
} from 'states/main-actions.js';
import Welcome from 'components/Welcome.jsx';
import Library from 'components/Library.jsx';
import Reading from 'components/Reading.jsx';

import 'components/Main.css';

class Main extends React.Component {
    static propTypes = {
        initialized: PropTypes.bool,
        navbarToggle: PropTypes.bool,
        books: PropTypes.object,
        reading: PropTypes.object,
        dispatch: PropTypes.func,
        osVersion: PropTypes.string,
    };

    constructor(props) {
        super(props);

        console.log("Main is loaded");

        this.handleNavbarToggle = this.handleNavbarToggle.bind(this);
        this.debug = this.debug.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(setInitialize(false));
        this.props.dispatch(setOsVersion());
        this.readRecord();

        let ele = document.getElementsByClassName('reader-bg');
        for (let i = 0; i < ele.length; i = i + 1) {
            ele[i].setAttribute("style", "background-image: url('src/image/welcome_bg.jpeg');");
        }
    }

    render() {
        if (this.props.initialized === false) {
            this.props.dispatch(setInitialize(true));
            return (
                <Router>
                    <Redirect to='/reading'/>
                </Router>
            );
        }

        return (
            <Router>
                <div className='main'>
                    <div className='bg-faded'>
                        <div className='container'>
                            <Navbar color='faded' light toggleable>
                                <NavbarToggler right onClick={this.handleNavbarToggle} />
                                <NavbarBrand className='text-info' tag={Link} to="/">BTreader</NavbarBrand>
                                <Collapse isOpen={this.props.navbarToggle} navbar>
                                    <Nav navbar>
                                        <NavItem>
                                            <NavLink tag={Link} to='/reading'>最近閱讀</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink tag={Link} to='/library'>書架</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink tag={Link} to='/setting'>設定</NavLink>
                                        </NavItem>
                                    </Nav>
                                        <div className='search ml-auto'>
                                        <Input className='ml-auto' type='text' placeholder='搜尋書架' onKeyPress={this.handleSearchKeyPress} getRef={e => this.searchEl = e}></Input>{
                                            this.props.searchText &&
                                            <i className='navbar-text fa fa-times' onClick={this.handleClearSearch}></i>
                                        }
                                    </div>  
                                </Collapse>
                            </Navbar>
                        </div>
                    </div>
                    
                    <Route exact path="/" render={() => (
                        <Welcome />
                    )}/>
                    <Route exact path="/library" render={() => (
                        <Library books={this.props.books} />
                    )}/>
                    <Route exact path="/reading" render={() => (
                        <Reading bookTitle={this.props.reading.bookTitle} bookPath={this.props.reading.bookPath} bookProgress={this.props.reading.bookProgress}
                            bookSize={this.props.reading.bookSize} bookContent={this.props.reading.content} />
                    )}/>
                    {/* <Route exact path="/setting" render={() => (
                        <Setting />
                    )}/>  */}
                </div>
            </Router>
        );
    }

    handleNavbarToggle() {
        this.props.dispatch(toggleNavbar());
    }

    readRecord() {
        console.log("reading record");
        // read file here
        // codes...

        // dispatch setting to action
        // this is default imformation
        let books;
        console.log(this.props.osVersion);
        if (navigator.appVersion.indexOf("Win") !== -1) {
            console.log("HERE!!!");
            books = {
                '愛麗絲夢遊仙境': {
                    bookSize: 22,
                    bookProgress: 0,
                    bookPath: 'D:\\Documents\\Git\\TextReader\\test\\test1.txt',
                },
                '西遊記': {
                    bookSize: 34,
                    bookProgress: 0,
                    bookPath: 'D:\\Documents\\Git\\TextReader\\test\\test2.txt',
                },
                '紅樓夢': {
                    bookSize: 18,
                    bookProgress: 0,
                    bookPath: 'D:\\Documents\\Git\\TextReader\\test\\test3.txt',
                },
                '地心歷險記': {
                    bookSize: 18,
                    bookProgress: 0,
                    bookPath: 'D:\\Documents\\Git\\TextReader\\test\\test.txt',
                },
                '厚黑學': {
                    bookSize: 3696,
                    bookProgress: 456,
                    bookPath: 'D:\\Documents\\Git\\TextReader\\test\\test5.txt',
                },
                '賣香屁': {
                    bookSize: 4509,
                    bookProgress: 22,
                    bookPath: 'D:\\Documents\\Git\\TextReader\\test\\test test.txt',
                },
            };
        } else {
            books = {
                '愛麗絲夢遊仙境': {
                    bookSize: 22,
                    bookProgress: 0,
                    bookPath: '/Users/Ricky/Documents/Git/BTreader/test/test1.txt',
                },
                '西遊記': {
                    bookSize: 34,
                    bookProgress: 0,
                    bookPath: '/Users/Ricky/Documents/Git/BTreader/test/test2.txt',
                },
                '紅樓夢': {
                    bookSize: 18,
                    bookProgress: 0,
                    bookPath: '/Users/Ricky/Documents/Git/BTreader/test/test3.txt',
                },
                '地心歷險記': {
                    bookSize: 18,
                    bookProgress: 0,
                    bookPath: '/Users/Ricky/Documents/Git/BTreader/test/test4.txt',
                },
                '厚黑學': {
                    bookSize: 3696,
                    bookProgress: 456,
                    bookPath: '/Users/Ricky/Documents/Git/BTreader/test/test5.txt',
                },
                '我的名字應該有超過十個字吧': {
                    bookSize: 4509,
                    bookProgress: 22,
                    bookPath: '/Users/Ricky/Documents/Git/BTreader/test/test test.txt',
                },
            };
        }

        // add imformation to memory
        for (let p in books) {
            this.props.dispatch(addBook(p, books[p].bookSize, books[p].bookProgress, books[p].bookPath));
        };

        // set default recent reading book
        this.props.dispatch(changeReadingBook('厚黑學', 3696, 456, '/Users/Ricky/Documents/Git/BTreader/test/test5.txt'));
    }

    debug() {
        // this.readRecord();
        console.log(this.props.books);
    }
}

export default connect (state => ({
    ...state.main,
}))(Main);