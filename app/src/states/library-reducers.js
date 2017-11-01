const jf = require('jsonfile');
import {writeJson} from '../api/jsonrw.js';

const initLibraryState = {
    edit: false,
    select: [],
    books: {
        // {
        //     bookTitle: '',
        //     bookProgress: 0,
        //     bookSize: 0,
        //     bookPath: '',
        //     encoding: '',
        // },
    },
    searchText: '',
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
            
            if (!B.hasOwnProperty(action.bookPath)) {
                B[action.bookPath] = {
                    bookSize: action.bookSize,
                    bookProgress: action.bookProgress,
                    bookTitle: action.bookTitle,
                    encoding: action.encoding,
                };
            }

            return save({
                ...state,
                books: B,
            });
        case '@LIBRARY/DELETE_SELECT':
            B = {
                ...state.books,
            };
            for (let p in action.bookPaths) {
                delete B[action.bookPaths[p]];
            }
            
            return save({
                ...state,
                books: B,
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
        case '@LIBRARY/SET_ABSOLUTE_PROGRESS':
            B = {
                ...state.books
            };
            B[action.bookPath].bookProgress = action.bookProgress;
            return save({
                ...state,
                books: B
            });
        case '@LIBRARY/SET_SEARCH_TEXT':
            return {
                ...state,
                searchText: action.text,
            };
        case '@LIBRARY/DATA_LOAD':
            S = {
                ...action.data,
                searchText: '',
            }
            return S;
        default: 
            return state;
    }
}

function save(obj) {
    writeJson(window.appPath + 'data/data-library.json', obj);
    return obj;
}