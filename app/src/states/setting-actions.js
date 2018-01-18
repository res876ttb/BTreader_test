// setting-actions.js
export function setAutoReading() {
	return {
		type: '@SETTING/SET_AUTOREADING',
	}
}

export function dataSettingLoad(data) {
	return {
		type: '@SETTING/DATA_LOAD',
		data: data
	};
}

export function biggerFont() {
	return {
		type: '@SETTING/SET_FONTSIZE',
		zoom: 1,
	}
}

export function smallerFont() {
	return {
		type: '@SETTING/SET_FONTSIZE',
		zoom: -1,
	}
}

export function originalFont() {
	return {
		type: '@SETTING/RESET_FONTSIZE',
	}
}

export function heigherLine() {
	return {
		type: '@SETTING/SET_LINE_HEIGHT',
		height: 0.1,
	}
}

export function lowerLine() {
	return {
		type: '@SETTING/SET_LINE_HEIGHT',
		height: -0.1,
	}
}

export function originalLineHeight() {
	return {
		type: '@SETTING/RESET_LINE_HEIGHT',
	}
}

export function settingDataInitialize() {
	return {
		type: '@SETTING/DATA_INITIALIZE'
	}
}

export function setFontColor(color) {
	return {
		type: '@SETTING/SET_FONT_COLOR',
		color: color
	}
}
