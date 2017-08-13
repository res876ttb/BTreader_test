import React from 'react';
import PropTypes from 'prop-types';
import {
    BrowserRouter as Router,
    Route, 
    Link
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
} from 'states/main-actions.js';
import Welcome from 'components/Welcome.jsx';
import Library from 'components/Library.jsx';

import './Main.css';

class Main extends React.Component {
    static propTypes = {
        navbarToggle: PropTypes.bool,
        books: PropTypes.object,
        dispatch: PropTypes.func
    };

    constructor(props) {
        super(props);

        console.log("Main is loaded");

        this.handleNavbarToggle = this.handleNavbarToggle.bind(this);
        this.debug = this.debug.bind(this);
        this.readRecord();
    }

    render() {
        let imageSource = "images/welcome_bg.jpeg";
        let mainStyle = `background-image: url(${imageSource})`;

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
                                            <NavLink tag={Link} to='/recent'>最近閱讀</NavLink>
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
                    {/* <Route exact path="/setting" render={() => (
                        <Setting />
                    )}/>
                    <Route exact path="/reading" render={() => (
                        <Read />
                    )}/> */}

                    <div className='footer' onClick={this.debug}>
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
                totalPages: 100,
                currentPage: 34,
            },
            '西遊記': {
                totalPages: 100,
                currentPage: 25,
            },
            '紅樓夢': {
                totalPages: 100,
                currentPage: 87,
            },
            '地心歷險記': {
                totalPages: 100,
                currentPage: 3,
            },
            '厚黑學': {
                totalPages: 100,
                currentPage: 0,
            },
            '賣香屁': {
                totalPages: 100,
                currentPage: 56,
            },
        };

        // add imformation to memory
        for (let p in books) {
            this.props.dispatch(addBook(p, books[p].totalPages, books[p].currentPage));
        };
    }

    debug() {
        // this.readRecord();
        console.log(this.props.books);
    }
}

export default connect (state => ({
    ...state.main,
}))(Main);