export function setOsVersion() {
    if (navigator.appVersion.indexOf("Win") !== -1) {
        console.log('Here');
        return {
            type: '@MAIN/SET_OS_VERSION',
            osVersion: 'Windows'
        };
    } else if (navigator.appVersion.indexOf("Mac") !== -1) {
        return {
            type: '@MAIN/SET_OS_VERSION',
            osVersion: 'macOS'
        };
    } else if (navigator.appVersion.indexOf("X11") !== -1) {
        return {
            type: '@MAIN/SET_OS_VERSION',
            osVersion: 'UNIX'
        };
    } else if (navigator.appVersion.indexOf("Linux") !== -1) {
        return {
            type: '@MAIN/SET_OS_VERSION',
            osVersion: 'Linux'
        };
    } else {
        return {
            type: '@MAIN/SET_OS_VERSION',
            osVersion: 'Unknown'
        };
    }
}

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
