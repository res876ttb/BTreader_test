import {writeJson} from '../api/jsonrw.js';

const initSettingState = {
	autoReading: false,
	fontSize: 18,
	fontScale: 4,
	lineHeight: 1.5,
}

export function setting(state = initSettingState, action) {
	let t;
	const fontSizeArr = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40];
	switch(action.type) {
		case '@SETTING/SET_AUTOREADING':
			if (state.autoReading === true) {
				t = false;
			} else {
				t = true;
			}
			return save({
				...state,
				autoReading: t,
			});
		case '@SETTING/RESET_FONTSIZE':
			return save({
				...state,
				fontSize: 18,
				fontScale: 4
			});
		case '@SETTING/SET_FONTSIZE':
			let scale = state.fontScale + action.zoom;
			if (scale > 13) {
				scale = 13;
			} else if (scale < 0) {
				scale = 0;
			}
			return save({
				...state,
				fontSize: fontSizeArr[scale],
				fontScale: scale,
			});
		case '@SETTING/DATA_LOAD':
			return action.data;
		case '@SETTING/SET_LINE_HEIGHT':
			let height = state.lineHeight + action.height;
			if (height > 3.0) {
				height = 3.0;
			} else if (height < 1.1) {
				height = 1.1;
			}
			return save({
				...state,
				lineHeight: height,
			});
		case '@SETTING/RESET_LINE_HEIGHT':
			return save({
				...state,
				lineHeight: 1.5,
			});
		case '@SETTING/DATA_INITIALIZE':
			return save({
				...initSettingState
			});
		default:
			return state;
	}
}

function save(obj) {
	writeJson(window.appPath + 'data/data-setting.json', obj);
	return obj;
}