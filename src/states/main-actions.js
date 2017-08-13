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

export function addBook(bookTitle, bookTotalPage, bookCurrentPage) {
    return {
        type: '@MAIN/ADD_BOOK',
        bookTitle: bookTitle,
        bookTotalPages: bookTotalPage,
        bookCurrentPage: bookCurrentPage,
    };
}