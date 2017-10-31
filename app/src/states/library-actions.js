export function setEdit(editStatus) {
    return {
        type: '@LIBRARY/SET_EDIT',
        edit: editStatus
    };
}

export function addSelect(bookPath) {
    return {
        type: '@LIBRARY/ADD_SELECT',
        bookPath: bookPath
    };
}

export function cancelSelect(bookPath) {
    return {
        type: '@LIBRARY/CANCEL_SELECT',
        bookPath: bookPath
    };
}

export function cancelAllSelect() {
    return {
        type: '@LIBRARY/CANCEL_ALL_SELECT'
    };
}

export function addBook(bookTitle, bookSize, bookProgress, bookPath, encoding) {
    return {
        type: '@LIBRARY/ADD_BOOK',
        bookTitle: bookTitle,
        bookSize: bookSize,
        bookProgress: bookProgress,
        bookPath: bookPath,
        encoding: encoding
    };
}

export function deleteSelect(bookPaths) {
    return {
        type: '@LIBRARY/DELETE_SELECT',
        bookPaths: bookPaths
    };
}

export function SetProgress(bookPath, progress) {
    return {
        type: '@LIBRARY/SET_PROGRESS',
        bookPath: bookPath,
        bookProgress: progress,
    };
}

export function SetAbsoluteProgress(bookPath, bookProgress) {
    return {
        type: '@LIBRARY/SET_ABSOLUTE_PROGRESS',
        bookPath: bookPath,
        bookProgress: bookProgress,
    };
}

export function dataLibraryLoad(data) {
    return {
        type: '@LIBRARY/DATA_LOAD',
        data: data,
    }
}

export function setSearchLibraryText(text) {
    return {
        type: '@LIBRARY/SET_SEARCH_TEXT',
        text: text,
    }
}
