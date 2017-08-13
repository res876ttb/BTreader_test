const initMainState = {
    navbarToggle: false,
    books: {},
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
            };

            return {
                ...state,
                books: B,
            }
        default:
            return state;
    }
}