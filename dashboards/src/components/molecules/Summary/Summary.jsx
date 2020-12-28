// @flow
import cn from 'classnames';
import {FONT_SIZE_AUTO_OPTION, FONT_STYLES} from 'store/widgets/data/constants';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import {ResizeDetector} from 'components/molecules';
import settingsStyles from 'styles/settings.less';
import styles from './styles.less';

export class Summary extends PureComponent<Props, State> {
	state = {
		fontSize: null
	};

	getTextWidth = (fontSize: number) => {
		const {fontFamily, fontStyle, value} = this.props;
		const {BOLD, ITALIC} = FONT_STYLES;
		const container = document.createElement('canvas');
		const context = container.getContext('2d');
		let font = '';

		if (fontStyle === ITALIC) {
			font += 'italic ';
		}

		if (fontStyle === BOLD) {
			font += 'bold ';
		}

		font = `${font}${parseFloat(fontSize)}px ${fontFamily}`;

		context.font = font;

		return context.measureText(value.toString()).width;
	};

	handleResize = (width: number, height: number) => {
		const {value} = this.props;

		if (value) {
			const charWidth = Math.round(width / value.toString().length);
			let fontSize = charWidth > height ? height : charWidth * 1.2;

			while (this.getTextWidth(fontSize) > width && fontSize > 0) {
				fontSize *= 0.95;
			}

			this.setState({fontSize});
		}
	};

	renderWithResize = (className: string, style: Object) => {
		const {onClick, value} = this.props;
		const {fontSize} = this.state;

		return (
			<ResizeDetector onResize={this.handleResize}>
				<div className={className} onClick={onClick} style={{...style, fontSize}}>
					{fontSize && value}
				</div>
			</ResizeDetector>
		);
	};

	render () {
		const {color, fontFamily, fontSize, fontStyle, onClick, value} = this.props;
		const {BOLD, ITALIC, UNDERLINE} = FONT_STYLES;
		const containerCN = cn({
			[styles.container]: true,
			[settingsStyles.bold]: fontStyle === BOLD,
			[settingsStyles.italic]: fontStyle === ITALIC,
			[settingsStyles.underline]: fontStyle === UNDERLINE
		});
		const style = {
			color,
			fontFamily,
			fontSize: Number(fontSize)
		};

		if (fontSize === FONT_SIZE_AUTO_OPTION) {
			return this.renderWithResize(containerCN, style);
		}

		return (
			<div className={containerCN} onClick={onClick} style={style}>
				{value}
			</div>
		);
	}
}

export default Summary;
