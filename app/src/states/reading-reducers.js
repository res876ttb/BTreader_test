const jf = require('jsonfile');
import {writeJson} from '../api/jsonrw.js';
import {setProgress} from './library-actions.js';

const initReadingState = {
	bookTitle: '',
	bookSize: 0,
	bookProgress: 0,
	bookPath: '',
	content: '',
	encoding: '',
};

export function reading(state = initReadingState, action) {
	switch(action.type) {
		case '@READING/CHANGE_READING_BOOK':
			return save({
				bookTitle: action.bookTitle,
				bookSize: action.bookSize,
				bookProgress: action.bookProgress,
				bookPath: action.bookPath,
				content: '',
				encoding: action.encoding,
			});
		case '@READING/CHANGE_READING_CONTENT': 
			return save({
				...state,
				content: action.content,
			});
		case '@READING/SET_PROGRESS':
			console.log('Current progress:', state.bookProgress);
			let bookProgress = state.bookProgress + action.bookProgress;
			return save({
				...state,
				bookProgress: bookProgress,
			});
		case '@READING/DATA_LOAD':
			return action.data;
		default:
			return state;
	}
};

function save(obj) {
	writeJson('./app/data/data-reading.json', obj);
	return obj;
}