const jf = require('jsonfile');
import {writeJson, readJson} from '../api/jsonrw.js';

const initMainState = {
    navbarToggle: false,
    initialized: false,
    osVersion: 'Unknown',
    divWidth: 600,
    divHeight: 400,
    rerender: false,
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
        case '@MAIN/SET_INITIALIZE':
            return {
                ...state,
                initialized: action.status,
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
                rerender: action.bool,
            }
        case '@MAIN/LOAD_DATA':
            return state;
        default:
            return state;
    }
}

function save(obj) {
    writeJson('./app/data/data-main.json', obj);
    return obj;
}