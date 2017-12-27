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

import Welcome from 'components/Welcome.jsx';
import Library from 'components/Library.jsx';
import Reading from 'components/Reading.jsx';
import Setting from 'components/Setting.jsx';

import {
    toggleNavbar, 
    setDebug,
    setLoad,
    setOsVersion,
    changeWindowSize,
    dataMainLoad,
    rerenderTrigger,
    mainDataInitialize,
    setCurPosition,
} from 'states/main-actions.js';
import {
    addBook,
    dataLibraryLoad,
    setSearchLibraryText,
    libraryDataInitialize,
} from 'states/library-actions.js';
import {
    dataReadingLoad,
    changeReadingBook,
    readingDataInitialize,
    setReadingFontColor,
} from 'states/reading-actions.js';
import {
    dataSettingLoad,
    settingDataInitialize,
} from 'states/setting-actions.js';
import {
    writeJson, 
    readJson,
} from '../api/jsonrw.js';

import 'components/Main.css';

const fs = require('fs');

class Main extends React.Component {
    static propTypes = {
        autoReading: PropTypes.bool,
        bookTitle: PropTypes.string,
        curPositon: PropTypes.string,
        debug: PropTypes.bool,
        dispatch: PropTypes.func,
        divHeight: PropTypes.number,
        divWidth: PropTypes.number,
        navbarToggle: PropTypes.bool,
        osVersion: PropTypes.string,
        rerender: PropTypes.number,
        searchText: PropTypes.string,
        settingColor: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.debug = false;
        this.handleClearSearch = this.handleClearSearch.bind(this);
        this.handleClearSearchEsc = this.handleClearSearchEsc.bind(this);
        this.handleNavbarToggle = this.handleNavbarToggle.bind(this);
        this.handleSearchKeyPress = this.handleSearchKeyPress.bind(this);
        this.updateWindowSize = this.updateWindowSize.bind(this);

        this.state = {
            content: 'Better Text Reader',
            class: 'main-loading ns normal',
            style: {

            }
        };
    }

    componentWillMount() {
        this.getCurPath();
        window.addEventListener('resize', this.updateWindowSize);
        this.updateWindowSize();
        
        this.props.dispatch(setDebug(false));
        this.props.dispatch(setOsVersion());
        this.readRecord();

        if (this.debug) {
            this.props.dispatch(setDebug(true));
            setTimeout(() => {
                this.props.dispatch(setDebug(false));
            }, 600);
        } else {
            this.props.dispatch(setDebug(false));
            setTimeout(() => {
                if (this.props.autoReading) {
                    this.props.dispatch(rerenderTrigger(2));
                    this.props.dispatch(rerenderTrigger(0));
                    this.props.dispatch(setCurPosition('reading'));
                } else {
                    this.props.dispatch(rerenderTrigger(1));
                    this.props.dispatch(rerenderTrigger(0));
                    this.props.dispatch(setCurPosition('welcome'));
                }
            }, 600);
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState(() => {
                return {
                    class: 'main-loading ns disappear',
                };
            });
        }, 1500);
        setTimeout(() => {
            this.setState(() => {
                return {
                    style: {
                        display: 'none'
                    }
                };
            });
        }, 3000);
        this.props.dispatch(setReadingFontColor(this.props.settingColor));
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowSize);
        console.log(window.location.pathname);
    }

    render() {
        if (this.props.debug === true) {
            return (
                <Router>
                    <Switch>
                        <Route exact path="/setting" render={() => (<div>Redirecting...</div>)}/>
                        <Redirect to='/setting'/>
                    </Switch>
                </Router>
            );
        }

        if (this.props.rerender === 1) {
            return (
                <Router>
                    <Switch>
                        <Route exact path="/" render={() => (<div>Redirecting...</div>)}/>
                        <Redirect to='/'/>
                    </Switch>
                </Router>
            );
        } else if (this.props.rerender === 2) {
            return (
                <Router>
                    <Switch>
                        <Route exact path="/reading" render={() => (<div>Redirecting...</div>)}/>
                        <Redirect to='/reading'/>
                    </Switch>
                </Router>
            );
        }

        let topRight = (
            <div className='search ml-auto'>
                <Input tag={Link} to='/library' id='search-library' className='ml-auto' type='text' placeholder='搜尋書架' onKeyPress={this.handleSearchKeyPress} onKeyDown={this.handleClearSearchEsc}></Input>{
                    this.props.searchText && <i className='navbar-text fa fa-times' onClick={this.handleClearSearch}></i>
                }
            </div>  
        );

        if (this.props.curPosition === 'reading') {
            topRight = (
                // <div className='main-showReadingBook'>
                //     {this.props.bookTitle}
                // </div>
                <div className='search ml-auto'>
                    <Input tag={Link} to='/library' id='search-library' className='ml-auto' type='text' placeholder={this.props.bookTitle} onKeyPress={this.handleSearchKeyPress} onKeyDown={this.handleClearSearchEsc} disabled></Input>{
                        this.props.searchText && <i className='navbar-text fa fa-times' onClick={this.handleClearSearch}></i>
                    }
                </div>  
            );
        }

        return (
            <Router><Switch><div className='main'>
                <div className={this.state.class} style={this.state.style}>
                    {this.state.content}
                </div>
                <div className='bg-light'>
                    <div className='container'>
                        <Navbar color='light' light expand>
                            <NavbarBrand className='text-info mr-auto' tag={Link} to="/" onClick={() => {
                                this.props.dispatch(setCurPosition('welcome'));
                            }}>BTreader</NavbarBrand>
                            <NavbarToggler className='mr-2' onClick={this.handleNavbarToggle}/>
                            <Collapse isOpen={this.props.navbarToggle} navbar>
                                <Nav navbar>
                                    <NavItem>
                                        <NavLink tag={Link} to='/reading' onClick={() => {
                                            this.props.dispatch(setCurPosition('reading'));
                                        }}>最近閱讀</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink tag={Link} to='/library' onClick={() => {
                                            this.props.dispatch(setCurPosition('library'));
                                        }}>書架</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink tag={Link} to='/setting' onClick={() => {
                                            this.props.dispatch(setCurPosition('setting'));
                                        }}>設定</NavLink>
                                    </NavItem>
                                </Nav>
                                {topRight}
                            </Collapse>
                        </Navbar>
                    </div>
                </div>

                <div style={{height: '56px'}}></div>
                
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
                {
                    this.props.searchText && 
                    <Redirect to='/library' />
                }
            </div></Switch></Router>
        );
    }

    getCurPath() {
        const {ipcRenderer} = require('electron');
        let path = ipcRenderer.sendSync('synchronous-message', ['getDataPath']);
        window.appDataPath = path;
        console.log(path)
        let a = window.location.pathname;
        let b = a.split('/');
        let c = '';
        b.pop();
        for (let i in b) {
            c += b[i] + '/';
        }
        window.appPath = c;
        if (navigator.appVersion.indexOf("Win") !== -1) {
            console.log('original c:', c);
            window.appPath = c.slice(3,c.length);
        }
        console.log('Main: current Path is', window.appPath);
        console.log('Main: app data path is', window.appDataPath);
        if (!fs.existsSync(window.appDataPath + '/data')) {
            console.log('Folder ' + window.appDataPath + ' does NOT exist!');
            fs.mkdirSync(window.appDataPath + '/data');
        }
    }

    handleSearchKeyPress(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13){
            this.props.dispatch(setSearchLibraryText(e.target.value));
            console.log('Main: Search Library: Enter is pressed');
        }
    }

    handleClearSearchEsc(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 27) {
            this.handleClearSearch();
        }
    }

    handleClearSearch() {
        this.props.dispatch(setSearchLibraryText(''));
        document.getElementById('search-library').value = '';
    }

    handleNavbarToggle() {
        this.props.dispatch(toggleNavbar());
    }
    
    updateWindowSize() {
        console.log('Main: resize width:', window.innerWidth, 'height:', window.innerHeight);
        this.props.dispatch(changeWindowSize(window.innerWidth, window.innerHeight));
    }

    readRecord() {
        if (fs.existsSync(window.appDataPath + '/data/data-main.json')) {
            readJson(window.appDataPath + '/data/data-main.json').then(data => {
                this.props.dispatch(dataMainLoad(data));
            });
        } else {
            this.props.dispatch(mainDataInitialize());
        }
        if (fs.existsSync(window.appDataPath + '/data/data-library.json')) {
            readJson(window.appDataPath + '/data/data-library.json').then(data => {
                this.props.dispatch(dataLibraryLoad(data));
            });
        } else {
            this.props.dispatch(libraryDataInitialize());
        }
        if (fs.existsSync(window.appDataPath + '/data/data-reading.json')) {
            readJson(window.appDataPath + '/data/data-reading.json').then(data => {
                this.props.dispatch(dataReadingLoad(data));
            });
        } else {
            this.props.dispatch(readingDataInitialize());
        }
        if (fs.existsSync(window.appDataPath + '/data/data-setting.json')) {
            readJson(window.appDataPath + '/data/data-setting.json').then(data => {
                this.props.dispatch(dataSettingLoad(data));
            });
        } else {
            this.props.dispatch(settingDataInitialize());
        }
    }
}

export default connect (state => ({
    ...state.main,
    autoReading: state.setting.autoReading,
    searchText: state.library.searchText,
    bookTitle: state.reading.bookTitle,
    settingColor: state.setting.color,
}))(Main);