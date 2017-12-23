import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Style from 'style-it';

import {
	setAutoReading,
	biggerFont,
	smallerFont,
	originalFont,
	heigherLine,
	lowerLine,
	originalLineHeight,
} from '../states/setting-actions.js';

import './Setting.css';

class Setting extends React.Component {
	static propTypes = {
		dispatch: PropTypes.func,
		autoReading: PropTypes.bool,
		fontSize: PropTypes.number,
		lineHeight: PropTypes.number,
	}
	
	constructor(props) {
		super(props);

		this.state = {
			previewBackground: window.appPath + 'image/background.jpeg'
		};
		
		this.setAutoReading = this.setAutoReading.bind(this);
		this.originalFont = this.originalFont.bind(this);
		this.smallerFont = this.smallerFont.bind(this);
		this.biggerFont = this.biggerFont.bind(this);
		this.heigherLine = this.heigherLine.bind(this);
		this.lowerLine = this.lowerLine.bind(this);
		this.originalLineHeight = this.originalLineHeight.bind(this);
		this.setBackbround = this.setBackbround.bind(this);
		this.resetBackbround = this.resetBackbround.bind(this);
		this.selecttest = true;
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
						background-image: url(\"` + this.state.previewBackground + `\");
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
						<div className='ns sbnh' style={{borderTop: '2px solid', borderColor: '#C0BCAD'}}>背景設定（重新啟動程式來生效）</div>
						<div className='ns sb sbbl' style={{display: 'inline-block', width: '50%'}} onClick={this.resetBackbround}>恢復預設背景</div>
						<div className='ns sb sbbr' style={{display: 'inline-block', width: '50%'}} onClick={this.setBackbround}>選擇背景圖片</div>

						{div20}
						<div className='ns sbp' style={{fontSize: this.props.fontSize, lineHeight: this.props.lineHeight, backgroundImage: 'url("' + this.state.previewBackground + '")'}}>
							<div className='Blur' style={{fontColor: 'black', padding: '15px', margin: '5px 15px'}}>
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

	setBackbround() {
		var fs = require('fs-extra');
		const {ipcRenderer} = require('electron');
		let path = ipcRenderer.sendSync('synchronous-message', 'openImage');
		fs.copy(path[0], window.appPath + 'image/background.jpeg', (err) => {
			if (err) {
				throw err;
			} else {
				this.setState({previewBackground: path[0].replace(/\\/g,'/')});
				console.log('Background setting done.');
			}
		});
	}

	resetBackbround() {
		var fs = require('fs-extra');
		fs.copy(window.appPath + 'image/default.jpeg', window.appPath + 'image/background.jpeg', err => {
			if (err) {
				throw err;
			} else {
				this.setState({previewBackground: window.appPath + 'image/default.jpeg'});
				console.log('Restore successed!');
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
	autoReading: state.setting.autoReading,
	fontSize: state.setting.fontSize,
	lineHeight: state.setting.lineHeight,
}))(Setting);