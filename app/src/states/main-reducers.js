const initMainState = {
    navbarToggle: false,
    initialized: false,
    books: {
        // 'empty': {
        //     bookTotalPages: 0,
        //     bookCurrentPage: 0,
        //     bookPath: '',
        // }
    },
    reading: {
        bookTitle: '',
        bookTotalPages: 0,
        bookCurrentPage: 0,
        bookPath: '',
    }
};

export function main(state = initMainState, action) {
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
            let B = {
                ...state.books
            };
            B[action.bookTitle] = {
                bookTotalPages: action.bookTotalPages,
                bookCurrentPage: action.bookCurrentPage,
                bookPath: action.bookPath,
            };

            return {
                ...state,
                books: B,
            }
        case '@MAIN/CHANGE_READING_BOOK':
            return {
                ...state,
                reading: {
                    bookTitle: action.bookTitle,
                    bookCurrentPage: action.bookCurrentPage,
                    bookTotalPages: action.bookTotalPages,
                    bookPath: action.bookPath,
                }
            }
        case '@MAIN/SET_INITIALIZE':
            return {
                ...state,
                initialized: action.status,
            }
        default:
            return state;
    }
}