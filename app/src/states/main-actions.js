export function toggleNavbar() {
    return {
        type: '@MAIN/TOGGLE_NAVBAR'
    };
}

export function resetBooks(books) {
    return {
        type: '@MAIN/RESET_BOOKS',
        books: books
    };
}

export function addBook(bookTitle, bookTotalPages, bookCurrentPage, bookPath) {
    return {
        type: '@MAIN/ADD_BOOK',
        bookTitle: bookTitle,
        bookTotalPages: bookTotalPages,
        bookCurrentPage: bookCurrentPage,
        bookPath: bookPath,
    };
}

export function changeReadingBook(bookTitle, bookCurrentPage, bookTotalPages, bookPath) {
    return {
        type: '@MAIN/CHANGE_READING_BOOK',
        bookTitle: bookTitle,
        bookCurrentPage: bookCurrentPage,
        bookTotalPages: bookTotalPages,
        bookPath: bookPath,
    }
}

export function setInitialize(status) {
    return {
        type: '@MAIN/SET_INITIALIZE',
        status: status,
    }
}