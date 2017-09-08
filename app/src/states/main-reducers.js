const initMainState = {
    navbarToggle: false,
    initialized: false,
    books: {
        // 'empty': {
        //     bookSize: 0,
        //     bookProgress: 0, // this is offset of the book
        //     bookPath: '',
        // }
    },
    reading: {
        bookTitle: '',
        bookSize: 0,
        bookProgress: 0,
        bookPath: '',
        content: '',
    }
};

export function main(state = initMainState, action) {
    let B;
    let R;
    switch (action.type) {
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
                    content: ''
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
            for (let p in action.bookPaths) {
                delete B[action.bookPaths[p]];
            }
            
            return {
                ...state,
                books: B
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
        default:
            return state;
    }
}