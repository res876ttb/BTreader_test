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
	coverState: 0,
	coverFadeOut: 0,
	jumpProgress: 0,
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
				jumpProgress: -1,
				coverState: 0,
				coverFadeOut: 0,
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
		case '@READING/SET_ABSOLUTE_PROGRESS':
			return save({
				...state,
				bookProgress: action.prog,
			});
		case '@READING/CHECK_DELETE_BOOK':
			if (action.bookPath === state.bookPath) {
				return save({
					...initReadingState
				});
			} else {
				return save({
					...state
				});
			}
		case '@READING/SET_READING_COVER_STATE':
			return {
				...state,
				coverState: action.state,
			};
		case '@READING/SET_JUMP_PROGRESS':
			return {
				...state,
				jumpProgress: action.prog,
			};
		case '@READING/SET_READING_COVER_FADEOUT':
			return {
				...state,
				coverFadeOut: action.state,
			}
		case '@READING/DATA_LOAD':
			return {
				...action.data,
				coverState: 0,
				coverFadeOut: 0,
				jumpProgress: -1,
			}
		default:
			return state;
	}
};

function save(obj) {
	writeJson(window.appPath + 'data/data-reading.json', obj);
	return obj;
}