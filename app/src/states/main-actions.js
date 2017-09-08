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

export function addBook(bookTitle, bookSize, bookProgress, bookPath) {
    return {
        type: '@MAIN/ADD_BOOK',
        bookTitle: bookTitle,
        bookSize: bookSize,
        bookProgress: bookProgress,
        bookPath: bookPath,
    };
}

export function changeReadingBook(bookTitle, bookSize, bookProgress, bookPath) {
    return {
        type: '@MAIN/CHANGE_READING_BOOK',
        bookTitle: bookTitle,
        bookSize: bookSize,
        bookProgress: bookProgress,
        bookPath: bookPath,
    }
}

export function setInitialize(status) {
    return {
        type: '@MAIN/SET_INITIALIZE',
        status: status,
    }
}

export function deleteSelect(bookPaths) {
    return {
        type: '@MAIN/DELETE_SELECT',
        bookPaths: bookPaths
    };
}

export function changeReadingContent (content, byteRead) {
    return {
        type: '@MAIN/CHANGE_READING_CONTENT',
        content: content,
        byteRead: byteRead
    };
}
