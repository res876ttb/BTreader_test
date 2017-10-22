import React from 'react';
import PropTypes from 'prop-types';
import {
    BrowserRouter as Router,
    Route, 
    Link,
    Redirect,
    Switch,
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
    setInitialize,
    setOsVersion,
    changeWindowSize,
    dataMainLoad,
    rerenderTrigger
} from 'states/main-actions.js';
import {
    addBook,
    dataLibraryLoad
} from 'states/library-actions.js';
import {
    dataReadingLoad,
    changeReadingBook
} from 'states/reading-actions.js';
import {
    dataSettingLoad,
} from 'states/setting-actions.js';
import Welcome from 'components/Welcome.jsx';
import Library from 'components/Library.jsx';
import Reading from 'components/Reading.jsx';
import Setting from 'components/Setting.jsx';

import 'components/Main.css';

import {writeJson, readJson} from '../api/jsonrw.js';

class Main extends React.Component {
    static propTypes = {
        initialized: PropTypes.bool,
        navbarToggle: PropTypes.bool,
        dispatch: PropTypes.func,
        osVersion: PropTypes.string,
        divWidth: PropTypes.number,
        divHeight: PropTypes.number,
        autoReading: PropTypes.bool,
        rerender: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.debug = false;
        this.handleNavbarToggle = this.handleNavbarToggle.bind(this);
        this.updateWindowSize = this.updateWindowSize.bind(this);
    }

    componentWillMount() {
        window.addEventListener('resize', this.updateWindowSize);
        
        this.props.dispatch(setInitialize(false));
        this.props.dispatch(setOsVersion());
        this.readRecord();

        setTimeout(() => {
            if (this.props.autoReading) {
                this.redirectReading = true;
                this.props.dispatch(rerenderTrigger(true));
                this.props.dispatch(rerenderTrigger(false));
            }
        }, 600);

        let ele = document.getElementsByClassName('reader-bg');
        for (let i = 0; i < ele.length; i = i + 1) {
            ele[i].setAttribute("style", "background-image: url('src/image/welcome_bg.jpeg');");
        }
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowSize);
    }

    render() {
        if (this.props.initialized === false) {
            this.props.dispatch(setInitialize(true));
            if (this.debug === true) {
                return (
                    <Router>
                        <Redirect to='/setting'/>
                    </Router>
                );
            } else {
                return (
                    <Router>
                        <Redirect to='/'/>
                    </Router>
                );
            }
        }
        if (this.props.rerender === true) {
            return (
                <Router>
                    <Switch>
                        <Route exact path="/reading" render={() => (
                            <div>Redirecting...</div>
                        )}/>
                        <Redirect to='/reading'/>
                    </Switch>
                </Router>
            );
        }

        return (
            <Router>
                <div className='main'>
                    <div className='bg-faded'>
                        <div className='container'>
                            <Navbar color='faded' light expand>
                                <NavbarBrand className='text-info mr-auto' tag={Link} to="/">BTreader</NavbarBrand>
                                <NavbarToggler className='mr-2' onClick={this.handleNavbarToggle}/>
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
                        <Library />
                    )}/>
                    <Route exact path="/reading" render={() => (
                        <Reading />
                    )}/>
                    <Route exact path="/setting" render={() => (
                        <Setting />
                    )}/>
                </div>
            </Router>
        );
    }

    handleNavbarToggle() {
        this.props.dispatch(toggleNavbar());
    }
    
    updateWindowSize() {
        console.log('Main: resize width:', window.innerWidth, 'height:', window.innerHeight);
        this.props.dispatch(changeWindowSize(window.innerWidth, window.innerHeight));
    }

    readRecord() {
        readJson('./app/data/data-main.json').then(data => {
            this.props.dispatch(dataMainLoad(data));
        });
        readJson('./app/data/data-library.json').then(data => {
            this.props.dispatch(dataLibraryLoad(data));
        });
        readJson('./app/data/data-reading.json').then(data => {
            this.props.dispatch(dataReadingLoad(data));
        });
        readJson('./app/data/data-setting.json').then(data => {
            this.props.dispatch(dataSettingLoad(data));
        });
    }
}

export default connect (state => ({
    ...state.main,
    autoReading: state.setting.autoReading,
}))(Main);