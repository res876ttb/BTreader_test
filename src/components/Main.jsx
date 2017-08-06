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

import {toggleNavbar} from 'states/main-actions.js';
import Welcome from 'components/Welcome.jsx';

import './Main.css';

class Main extends React.Component {
    static propTypes = {
        navbarToggle: PropTypes.bool,
        store: PropTypes.object,
        dispatch: PropTypes.func
    };

    constructor(props) {
        super(props);

        console.log("Main is loaded");

        this.handleNavbarToggle = this.handleNavbarToggle.bind(this);
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
                                <NavbarBrand className='text-info' href="/">TXTreader</NavbarBrand>
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
                    {/* <Route exact path="/setting" render={() => (
                        <Setting />
                    )}/>
                    <Route exact path="/library" render={() => (
                        <Library />
                    )}/>
                    <Route exact path="/reading" render={() => (
                        <Read />
                    )}/> */}

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
}

export default connect (state => ({
    ...state.main,
}))(Main);