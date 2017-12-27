const jf = require('jsonfile');
import {writeJson} from '../api/jsonrw.js';
import {setProgress} from './library-actions.js';

const initReadingState = {
	bookmark: {},
	bookPath: '',
	bookProgress: 0,
	bookSize: 0,
	bookTitle: '',
	color: 'black',
	content: '',
	coverFadeOut: 0,
	coverState: 0,
	encoding: '',
	jumpProgress: 0,
};

export function reading(state = initReadingState, action) {
	let BK;
	switch(action.type) {
		case '@READING/CHANGE_READING_BOOK':
			return save({
				...state,
				bookTitle: action.bookTitle,
				bookSize: action.bookSize,
				bookProgress: action.bookProgress,
				bookPath: action.bookPath,
				content: '',
				encoding: action.encoding,
				jumpProgress: -1,
				coverState: 0,
				coverFadeOut: 0,
				bookmark: action.bookmark,
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
			};
		case '@READING/SET_READING_FONT_COLOR':
			let color = action.color;
			if (color === null || color === undefined) {
				color = 'black';
			}
			return {
				...state,
				color: color
			};
		case '@READING/DATA_LOAD':
			return {
				...action.data,
				coverState: 0,
				coverFadeOut: 0,
				jumpProgress: -1,
			};
		case '@READING/DATA_INITIALIZE':
			return save({
				...initReadingState
			});
		default:
			return state;
	}
};

function save(obj) {
	writeJson(window.appDataPath + '/data/data-reading.json', obj);
	return obj;
}