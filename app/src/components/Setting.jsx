// Setting.jsx
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Style from 'style-it';
import { ChromePicker } from 'react-color';

import {
	biggerFont,
	heigherLine,
	lowerLine,
	originalFont,
	originalLineHeight,
	setAutoReading,
	setFontColor,
	smallerFont,
} from '../states/setting-actions.js';
import {
	setReadingFontColor,
} from '../states/reading-actions.js';

import './Setting.css';

class Setting extends React.Component {
	static propTypes = {
		autoReading: PropTypes.bool,
		color: PropTypes.string,
		dispatch: PropTypes.func,
		fontSize: PropTypes.number,
		lineHeight: PropTypes.number,
	}
	
	constructor(props) {
		super(props);

		this.state = {
			previewBackground: window.appPath + 'image/background.jpeg',
			showColorPicker: false,
		};
		
		this.biggerFont = this.biggerFont.bind(this);
		this.handleColorPickerClick = this.handleColorPickerClick.bind(this);
		this.handleColorPickerShow = this.handleColorPickerShow.bind(this);
		this.heigherLine = this.heigherLine.bind(this);
		this.hideColorPicker = this.hideColorPicker.bind(this);
		this.lowerLine = this.lowerLine.bind(this);
		this.originalFont = this.originalFont.bind(this);
		this.originalLineHeight = this.originalLineHeight.bind(this);
		this.resetBackground = this.resetBackground.bind(this);
		this.setAutoReading = this.setAutoReading.bind(this);
		this.setBackground = this.setBackground.bind(this);
		this.setBackgroundBlack = this.setBackgroundBlack.bind(this);
		this.setBackgroundWhite = this.setBackgroundWhite.bind(this);
		this.setFontColor = this.setFontColor.bind(this);
		this.setFontColorBlack = this.setFontColorBlack.bind(this);
		this.setFontColorGray = this.setFontColorGray.bind(this);
		this.setFontColorGreen = this.setFontColorGreen.bind(this);
		this.setFontColorWhite = this.setFontColorWhite.bind(this);
		this.setFontColorYellow = this.setFontColorYellow.bind(this);
		this.showColorPicker = this.showColorPicker.bind(this);
		this.smallerFont = this.smallerFont.bind(this);
	}
	
	render() {
		const div05 = (<div style={{height: "0.5rem"}}></div>);
		const div10 = (<div style={{height: "1rem"}}></div>);
		const div15 = (<div style={{height: "1.5rem"}}></div>);
		const div20 = (<div style={{height: "2rem"}}></div>);

		let checklist_style;
		if (this.props.autoReading) {
			checklist_style = 'ns checklist-style checklist-check';
		} else {
			checklist_style = 'ns checklist-style checklist-uncheck';
		}

		return(
			<Style>
				{`
					.Blur:after {
						background-image: url(\"${this.state.previewBackground}\");
					}
				`}
				<div className='container setting-outter'>
					<div className='setting-inner blur'>
						{div10}
						{/* <div className='ns checklist-style checklist-check' style={{textAlign: 'center',width: '47.5%',display: 'inline-block'}}>ON</div>
						<div style={{width: '5%', display: 'inline-block'}}></div>
						<div className='ns checklist-style checklist-uncheck' style={{textAlign: 'center', width: '47.5%', display: 'inline-block'}}>OFF</div>
						
						{div20} */}
						<div className={checklist_style} onClick={this.setAutoReading}>啟動程式後，自動開啟最近閱讀書籍</div>

						{div20}
						<div className='ns sbtl sbtr sbnh'>字體大小設定</div>
						<div className='ns sb' style={{display: 'inline-block', width: '50%'}} onClick={this.originalFont}>回復預設值</div>
						<div className='ns sb' style={{display: 'inline-block', width: '25%'}} onClick={this.smallerFont}>更小</div>
						<div className='ns sb' style={{display: 'inline-block', width: '25%'}} onClick={this.biggerFont}>更大</div>

						<div className='ns sbnh' style={{borderTop: '2px solid', borderColor: '#C0BCAD'}}>行距設定</div>
						<div className='ns sb' style={{display: 'inline-block', width: '50%'}} onClick={this.originalLineHeight}>回復預設值</div>
						<div className='ns sb' style={{display: 'inline-block', width: '25%'}} onClick={this.lowerLine}>更窄</div>
						<div className='ns sb' style={{display: 'inline-block', width: '25%'}} onClick={this.heigherLine}>更寬</div>

						<div style={{height: '125px', overflow: 'hidden'}}>
							<div className='ns sbnh' style={{borderTop: '2px solid', borderColor: '#C0BCAD'}}>背景設定（重新啟動程式來生效）</div>
							<div className='ns sb sbb' style={{
								background: 'black',
								}}
								onClick={this.resetBackground}>
								<div className='sbbb' style={{
									backgroundImage: 'url("' + window.appPath + 'image/default-yellow.jpeg' + '")',
									backgroundPosition: 'center'
								}}>預設</div>
							</div>
							<div className='ns sb sbb' style={{
								background: 'black',
								padding: '0px'}} 
								onClick={this.setBackgroundWhite}>
								<div className='sbbb' style={{
									backgroundImage: 'url("' + window.appPath + 'image/default-white.jpeg' + '")',
									color: 'black',
									backgroundPosition: 'center'
								}}>白色</div>
							</div>
							<div className='ns sb sbb' style={{
								background: 'black',
								}} 
								onClick={this.setBackgroundBlack}>
								<div className='sbbb' style={{
									backgroundImage: 'url("' + window.appPath + 'image/default-black.jpeg' + '")',
									color: 'white',
									backgroundPosition: 'center'
								}}>黑色</div>
							</div>
							<div className='ns sb sbb' 
								onClick={this.setBackground}><div className='sbbb'>自訂</div></div>
						</div>
						
						<div className='ns sbnh' style={{borderTop: '2px solid', borderColor: '#C0BCAD'}}>字體顏色</div>
						<div className='ns sbbl' 
							style={{display: 'inline-block', width: '16%', padding: '0px',
							backgroundColor: 'black'}}
							onClick={this.setFontColorBlack}>
							<div className='sb sbfsc'
								style={{color: 'white'}}>
								黑</div>
						</div>
						<div className='ns' 
							style={{display: 'inline-block', width: '16%', padding: '0px',
							backgroundColor: 'rgb(112, 112, 112)'}}
							onClick={this.setFontColorGray}>
							<div className='sb sbfsc' style={{color: 'white'}}>
								灰</div>
						</div>
						<div className='ns' 
							style={{display: 'inline-block', width: '16%', padding: '0px',
							backgroundColor: 'white'}}
							onClick={this.setFontColorWhite}>
							<div className='sb sbfsc' style={{color: 'black'}}>
								白</div>
						</div>
						<div className='ns' 
							style={{display: 'inline-block', width: '16%', padding: '0px',
							backgroundColor: 'rgb(27, 148, 33)'}}
							onClick={this.setFontColorGreen}>
							<div className='sb sbfsc' style={{color: 'white'}}>
								深綠</div>
						</div>
						<div className='ns' 
							style={{display: 'inline-block', width: '16%', padding: '0px',
							backgroundColor: 'rgb(105, 75, 0)'}}
							onClick={this.setFontColorYellow}>
							<div className='sb sbfsc' style={{color: 'white'}}>
								深黃</div>
						</div>
						<div className='ns sb sbbr' style={{
							display: 'inline-block', width: '20%', color: this.props.color}}
							onClick={this.handleColorPickerShow}>自訂</div>	
						<div className='sbcpc' onClick={this.hideColorPicker} 
							style={this.state.showColorPicker ? {} : {display: 'none'}}/>
						<div className={this.state.showColorPicker ? 'sbcp' : 'sbcp sbcp-hide'}>
							<ChromePicker 
								onChangeComplete={this.handleColorPickerClick} 
								disableAlpha={true}
								color={this.props.color}/>
						</div>

						{div20}
						<div className='ns sbp' style={{
							fontSize: this.props.fontSize, 
							lineHeight: this.props.lineHeight, 
							backgroundImage: 'url(\"' + this.state.previewBackground + '\")'}}>
							<div className='Blur' style={{
								color: this.props.color, 
								backgroundColor:'rgba(255,255,255,0.2)',
								padding: '15px', 
								margin: '5px 15px'}}>
								字體大小預覽 <br />行距預覽
							</div>
						</div>

						{div10}
					</div>
					{div20}
				</div>
			</Style>
		);
	}

	handleColorPickerClick(colorObj) {
		this.setFontColor(colorObj.hex);
	}

	showColorPicker() {
		this.setState({
			showColorPicker: true
		});
	}

	hideColorPicker() {
		this.setState({
			showColorPicker: false
		});
	}

	handleColorPickerShow() {
		if (this.state.showColorPicker === true) {
			this.hideColorPicker();
		} else {
			this.showColorPicker();
		}
	}

	setFontColor(color) {
		this.props.dispatch(setReadingFontColor(color));
		this.props.dispatch(setFontColor(color));
	}

	setFontColorBlack() {
		this.setFontColor('black');
	}

	setFontColorGray() {
		this.setFontColor('rgb(112, 112, 112)');
	}

	setFontColorGreen() {
		this.setFontColor('rgb(27, 148, 33)');
	}

	setFontColorWhite() {
		this.setFontColor('white');
	}

	setFontColorYellow() {
		this.setFontColor('rgb(105, 75, 0)');
	}

	setBackground() {
		var fs = require('fs-extra');
		const {ipcRenderer} = require('electron');
		let path = ipcRenderer.sendSync('synchronous-message', ['openImage']);
		if (path === null) {
			return;
		}
		fs.copy(path[0], window.appPath + 'image/background.jpeg', (err) => {
			if (err) {
				throw err;
			} else {
				this.setState({previewBackground: path[0].replace(/\\/g,'/')});
				console.log('Background set done!');
			}
		});
	}

	setBackgroundWhite() {
		var fs = require('fs-extra');
		fs.copy(window.appPath + 'image/default-white.jpeg', window.appPath + 'image/background.jpeg', err => {
			if (err) {
				throw err;
			} else {
				this.props.dispatch(setFontColor('black'));
				this.setState({previewBackground: window.appPath + 'image/default-white.jpeg'});
				console.log('Background set done!');
			}
		});
	}

	setBackgroundBlack() {
		var fs = require('fs-extra');
		fs.copy(window.appPath + 'image/default-black.jpeg', window.appPath + 'image/background.jpeg', err => {
			if (err) {
				throw err;
			} else {
				this.props.dispatch(setFontColor('white'));
				this.setState({previewBackground: window.appPath + 'image/default-black.jpeg'});
				console.log('Background set done!');
			}
		});
	}

	resetBackground() {
		var fs = require('fs-extra');
		fs.copy(window.appPath + 'image/default-yellow.jpeg', window.appPath + 'image/background.jpeg', err => {
			if (err) {
				throw err;
			} else {
				this.props.dispatch(setFontColor('rgb(105, 75, 0)'));
				this.setState({previewBackground: window.appPath + 'image/default-yellow.jpeg'});
				console.log('Background set done!');
			}
		});
	}
	
	setAutoReading() {
		this.props.dispatch(setAutoReading());
	}

	originalFont() {
		this.props.dispatch(originalFont());
	}

	smallerFont() {
		this.props.dispatch(smallerFont());
	}

	biggerFont() {
		this.props.dispatch(biggerFont());
	}

	heigherLine() {
		this.props.dispatch(heigherLine());
	}

	lowerLine() {
		this.props.dispatch(lowerLine());
	}

	originalLineHeight() {
		this.props.dispatch(originalLineHeight());
	}
}

export default connect(state => ({
	autoReading: 	state.setting.autoReading,
	color: 			state.setting.color,
	fontSize: 		state.setting.fontSize,
	lineHeight: 	state.setting.lineHeight,
}))(Setting);