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
        dispatch: PropTypes.func
    };

    constructor(props) {
        super(props);

        console.log("Main is loaded");

        this.handleNavbarToggle = this.handleNavbarToggle.bind(this);
        this.debug = this.debug.bind(this);
        this.readRecord();

        this.props.dispatch(setInitialize(false));
    }

    render() {
        let imageSource = "images/welcome_bg.jpeg";
        let mainStyle = `background-image: url(${imageSource})`;

        if (this.props.initialized === false) {
            this.props.dispatch(setInitialize(true));
            return (
                <Router>
                    <Redirect to='/'/>
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
                        <Reading bookTitle={this.props.reading.bookTitle} bookPath={this.props.reading.bookPath} bookCurrentPage={this.props.reading.bookCurrentPage}
                         bookTotalPages={this.props.reading.bookTotalPages} />
                    )}/>
                    {/* <Route exact path="/setting" render={() => (
                        <Setting />
                    )}/>  */}

                    <div className='footer'>
                        BTreader By Hsu Keng Jui
                    </div>
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
        let books = {
            '愛麗絲夢遊仙境': {
                bookTotalPages: 98,
                bookCurrentPage: 89,
                bookPath: 'path1',
            },
            '西遊記': {
                bookTotalPages: 355,
                bookCurrentPage: 25,
                bookPath: 'path2',
            },
            '紅樓夢': {
                bookTotalPages: 877,
                bookCurrentPage: 87,
                bookPath: 'path3',
            },
            '地心歷險記': {
                bookTotalPages: 53,
                bookCurrentPage: 3,
                bookPath: 'path4',
            },
            '厚黑學': {
                bookTotalPages: 239,
                bookCurrentPage: 0,
                bookPath: 'path5',
            },
            '賣香屁': {
                bookTotalPages: 31,
                bookCurrentPage: 22,
                bookPath: 'path6',
            },
        };

        // add imformation to memory
        for (let p in books) {
            this.props.dispatch(addBook(p, books[p].bookTotalPages, books[p].bookCurrentPage, books[p].bookPath));
        };

        // set default recent reading book
        this.props.dispatch(changeReadingBook('紅樓夢', 87, 877, 'path3'));
    }

    debug() {
        // this.readRecord();
        console.log(this.props.books);
    }
}

export default connect (state => ({
    ...state.main,
}))(Main);