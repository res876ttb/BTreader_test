export function setEdit(editStatus) {
    return {
        type: '@LIBRARY/SET_EDIT',
        edit: editStatus
    };
}

export function cancelSelect(bookPath) {
    return {
        type: '@LIBRARY/CANCEL_SELECT',
        bookPath: bookPath
    };
}

export function addSelect(bookPath) {
    return {
        type: '@LIBRARY/ADD_SELECT',
        bookPath: bookPath
    };
}

export function cancelAllSelect() {
    return {
        type: '@LIBRARY/CANCEL_ALL_SELECT'
    };
}
