const jf = require('jsonfile');
import {writeJson, readJson} from '../api/jsonrw.js';

const initMainState = {
    navbarToggle: false,
    debug: false,
    mainLoading: true,
    osVersion: 'Unknown',
    divWidth: 600,
    divHeight: 400,
    rerender: 0,
};

export function main(state = initMainState, action) {
    switch (action.type) {
        case '@MAIN/SET_OS_VERSION':
            return save({
                ...state, 
                osVersion: action.osVersion
            });
            break;
        case '@MAIN/TOGGLE_NAVBAR':
            return {
                ...state,
                navbarToggle: !state.navbarToggle
            };
        case '@MAIN/SET_DEBUG':
            return {
                ...state,
                debug: action.status,
            };
        case '@MAIN/SET_LOADING':
            return {
                ...state,
                mainLoading: action.status,
            };
        case '@MAIN/CHANGE_WINDOW_SIZE':
            return save({
                ...state,
                divWidth: action.divWidth,
                divHeight: action.divHeight
            });
        case '@MAIN/RERENDER_TRIGGER':
            return {
                ...state,
                rerender: action.state,
            }
        case '@MAIN/LOAD_DATA':
            return {
                ...state,
                debug: false
            };
        case '@MAIN/DATA_INITIALIZE':
            return save({
                ...initMainState
            });
        default:
            return state;
    }
}

function save(obj) {
    writeJson(window.appPath + 'data/data-main.json', obj);
    return obj;
}