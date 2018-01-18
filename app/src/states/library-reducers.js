// library-reducers.js
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
        //     bookmark: {
        //         progress1: {
        //             progress: 0,
        //             content: '',...
        //         }, progress2: {...
        //     },
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

            return {
                ...state,
                select: S
            };
        case '@LIBRARY/CANCEL_SELECT':
            S = state.select.slice();
            let i = S.indexOf(action.bookPath);
            if (i > -1) {
                S.splice(i, 1);
            }

            return {
                ...state,
                select: S
            };
        case '@LIBRARY/CANCEL_ALL_SELECT':
            return {
                ...state,
                select: []
            };
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
                    bookPath: action.bookPath,
                    bookmark: {},
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
        case '@LIBARY/ADD_BOOKMARK':
            B = {
                ...state.books,
            };
            for (let i in B[action.bookPath].bookmark) {
                if (i === action.progress) {
                    return state
                }
            }
            B[action.bookPath].bookmark[action.progress] = {
                progress: action.progress,
                size: action.size,
                content: action.content,
                time: action.time,
            };
            return save({
                ...state,
                books: B,
            });
        case '@LIBRARY/DELETE_BOOKMARK':
            B = {
                ...state.books,
            };
            delete B[action.bookPath].bookmark[action.progress];
            return save({
                ...state,
                books: B,
            });
        case '@LIBRARY/DATA_INITIALIZE':
            return save({
                ...initLibraryState
            });
        default: 
            return state;
    }
}

function save(obj) {
    writeJson(window.appDataPath + '/data/data-library.json', obj);
    return obj;
}