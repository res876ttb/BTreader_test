const jf = require('jsonfile');
import {writeJson} from '../api/jsonrw.js';

const initLibraryState = {
    edit: false,
    select: [],
    books: {
        // bookTitle: '',
        // bookProgress: 0,
        // bookSize: 0,
        // bookPath: '',
        // encoding: '',
    },
};

export function library(state = initLibraryState, action) {
    let S;
    let B;
    switch (action.type) {
        case '@LIBRARY/SET_EDIT':
            return save({
                ...state,
                edit: action.edit
            });
        case '@LIBRARY/ADD_SELECT':
            S = state.select.slice();
            S.push(action.bookPath);

            return save({
                ...state,
                select: S
            });
        case '@LIBRARY/CANCEL_SELECT':
            S = state.select.slice();
            let i = S.indexOf(action.bookPath);
            if (i > -1) {
                S.splice(i, 1);
            }

            return save({
                ...state,
                select: S
            });
        case '@LIBRARY/CANCEL_ALL_SELECT':
            return save({
                ...state,
                select: []
            });
        case '@LIBRARY/ADD_BOOK':
            B = {
                ...state.books
            };
            B[action.bookPath] = {
                bookSize: action.bookSize,
                bookProgress: action.bookProgress,
                bookTitle: action.bookTitle,
                encoding: action.encoding,
            };

            return save({
                ...state,
                books: B,
            });
        case '@LIBRARY/DELETE_SELECT':
            B = {
                ...state.books,
            };
            // R = {
            //     ...state.reading,
            // }
            for (let p in action.bookPaths) {
                delete B[action.bookPaths[p]];
                // if (state.reading.bookPath === action.bookPaths[p]) {
                //     R = {
                //         bookTitle: '',
                //         bookSize: 0,
                //         bookProgress: 0,
                //         bookPath: '',
                //         content: '',
                //         encoding: ''
                //     };
                // }
            }
            
            return save({
                ...state,
                books: B,
                // reading: R,
            });
        case '@LIBRARY/SET_PROGRESS':
            B = {
                ...state.books
            };
            B[action.bookPath].bookProgress += action.bookProgress;
            return save({
                ...state,
                books: B
            });
        case '@LIBRARY/DATA_LOAD':
            return action.data;
        default: 
            return state;
    }
}

function save(obj) {
    writeJson('./app/data/data-library.json', obj);
    return obj;
}