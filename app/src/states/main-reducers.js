const initMainState = {
    navbarToggle: false,
    initialized: false,
    books: {
        // 'empty': {
        //     bookSize: 0,
        //     bookProgress: 0, // this is offset of the book
        //     bookPath: '', // string
        //     encoding: ''  // string
        // }
    },
    reading: {
        bookTitle: '',
        bookSize: 0,
        bookProgress: 0,
        bookPath: '',
        content: '',
        encoding: '',
    },
    osVersion: 'Unknown',
    divWidth: 600,
    divHeight: 400,
};

export function main(state = initMainState, action) {
    let B;
    let R;
    switch (action.type) {
        case '@MAIN/SET_OS_VERSION':
            return {
                ...state, 
                osVersion: action.osVersion
            };
            break;
        case '@MAIN/TOGGLE_NAVBAR':
            return {
                ...state,
                navbarToggle: !state.navbarToggle
            };
        case '@MAIN/RESET_BOOKS':
            return {
                ...state,
                books: action.books,
            };
        case '@MAIN/ADD_BOOK':
            B = {
                ...state.books
            };
            B[action.bookPath] = {
                bookSize: action.bookSize,
                bookProgress: action.bookProgress,
                bookTitle: action.bookTitle,
                encoding: action.encoding,
            };

            return {
                ...state,
                books: B,
            }
        case '@MAIN/REMOVE_BOOK':
            B = {
                ...state.books
            };
            delete B[action.bookPath];

            if (state.reading.bookPath === action.bookPath) {
                R = {
                    bookTitle: '',
                    bookSize: 0,
                    bookProgress: 0,
                    bookPath: '',
                    content: '',
                    encoding: ''
                };
            } else {
                R = state.reading;
            }

            return {
                ...state,
                books: B,
                reading: R
            };
        case '@MAIN/CHANGE_READING_BOOK':
            return {
                ...state,
                reading: {
                    bookTitle: action.bookTitle,
                    bookProgress: action.bookProgress,
                    bookSize: action.bookSize,
                    bookPath: action.bookPath,
                    encoding: action.encoding,
                    content: ''
                }
            }
        case '@MAIN/SET_INITIALIZE':
            return {
                ...state,
                initialized: action.status,
            };
        case '@MAIN/DELETE_SELECT':
            B = {
                ...state.books,
            };
            R = {
                ...state.reading,
            }
            for (let p in action.bookPaths) {
                delete B[action.bookPaths[p]];
                if (state.reading.bookPath === action.bookPaths[p]) {
                    R = {
                        bookTitle: '',
                        bookSize: 0,
                        bookProgress: 0,
                        bookPath: '',
                        content: '',
                        encoding: ''
                    };
                }
            }
            
            return {
                ...state,
                books: B,
                reading: R,
            };
        case '@MAIN/CHANGE_READING_CONTENT':
            R = {
                ...state.reading,
                content: action.content,
            };

            return {
                ...state, 
                reading: R,
            };
            break;
        case '@MAIN/CHANGE_WINDOW_SIZE':
            return {
                ...state,
                divWidth: action.divWidth,
                divHeight: action.divHeight
            };
        case '@MAIN/CHANGE_BOOK_PROGRESS':
            console.log('Current progress:', state.reading.bookProgress);
            R = {
                ...state.reading,
                bookProgress: state.reading.bookProgress + action.curOffset
            };
            return {
                ...state,
                reading: R,
            };
        default:
            return state;
    }
}