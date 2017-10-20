export function setProgress(bookProgress) {
	return {
		type: '@READING/SET_PROGRESS',
		bookProgress: bookProgress,
	}
}

export function changeReadingContent (content, byteRead) {
    return {
        type: '@READING/CHANGE_READING_CONTENT',
        content: content,
        byteRead: byteRead
    };
}

export function changeReadingBook(bookTitle, bookSize, bookProgress, bookPath, encoding) {
    return {
        type: '@READING/CHANGE_READING_BOOK',
        bookTitle: bookTitle,
        bookSize: bookSize,
        bookProgress: bookProgress,
        bookPath: bookPath,
        encoding: encoding,
    };
}

export function dataReadingLoad(data) {
    return {
        type: '@READING/DATA_LOAD',
        data: data,
    };
}
