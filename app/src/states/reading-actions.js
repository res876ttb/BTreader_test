// reading-actions.js
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

export function changeReadingBook(bookTitle, bookSize, bookProgress, bookPath, encoding, bookmark) {
    return {
        type: '@READING/CHANGE_READING_BOOK',
        bookTitle: bookTitle,
        bookSize: bookSize,
        bookProgress: bookProgress,
        bookPath: bookPath,
        encoding: encoding,
        bookmark: bookmark,
    };
}

export function dataReadingLoad(data) {
    return {
        type: '@READING/DATA_LOAD',
        data: data,
    };
}

export function checkDeleteBook(bookPath) {
    return {
        type: '@READING/CHECK_DELETE_BOOK',
        bookPath: bookPath,
    };
}

export function setReadingCoverState(state) {
    return {
        type: '@READING/SET_READING_COVER_STATE',
        state: state,
    };
}

export function setReadingCoverFadeoutState(state) {
    return {
        type: '@READING/SET_READING_COVER_FADEOUT',
        state: state,
    }
}

export function setJumpProgress(prog) {
    return {
        type: '@READING/SET_JUMP_PROGRESS',
        prog: prog,
    }
}

export function setAbsoluteProgress(prog) {
    return {
        type: '@READING/SET_ABSOLUTE_PROGRESS',
        prog: prog,
    }
}

export function readingDataInitialize() {
    return {
        type: '@READING/DATA_INITIALIZE'
    }
}

export function setReadingFontColor(color) {
    return {
        type: '@READING/SET_READING_FONT_COLOR',
        color: color,
    }
}
