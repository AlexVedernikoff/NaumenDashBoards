// @flow
import cn from 'classnames';
import {FONT_SIZE_AUTO_OPTION, FONT_STYLES} from 'store/widgets/data/constants';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import ResizeDetector from 'components/molecules/ResizeDetector';
import settingsStyles from 'styles/settings.less';
import styles from './styles.less';

export class Summary extends PureComponent<Props, State> {
	state = {
		fontSize: null
	};

	getTextWidth = (fontSize: number) => {
		const {fontFamily, fontStyle} = this.props;
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

		return context.measureText(this.getValue().toString()).width;
	};

	getValue = () => {
		const {options} = this.props;
		const {data, value} = options;
		return data?.formatter?.(value) ?? value;
	};

	handleResize = (width: number, height: number) => {
		const value = this.getValue();

		if (value) {
			const charWidth = Math.round(width / value.toString().length);
			let fontSize = charWidth > height ? height : charWidth * 1.2;

			while (this.getTextWidth(fontSize) > width && fontSize > 0) {
				fontSize *= 0.95;
			}

			this.setState({fontSize});
		}
	};

	renderValue = (fontSize: number) => {
		const {onClickValue} = this.props;
		const height = fontSize * 0.8;
		const lineHeight = `${height}px`;

		return <span className={styles.value} onClick={onClickValue} style={{height, lineHeight}}>{this.getValue()}</span>;
	};

	renderWithResize = (className: string, style: Object) => {
		const {forwardedRef} = this.props;
		const {fontSize} = this.state;

		return (
			<ResizeDetector onResize={this.handleResize}>
				<div className={className} ref={forwardedRef} style={{...style, fontSize}}>
					{fontSize && this.renderValue(fontSize)}
				</div>
			</ResizeDetector>
		);
	};

	render () {
		const {color, fontFamily, fontSize, fontStyle, forwardedRef} = this.props;
		const {BOLD, ITALIC, UNDERLINE} = FONT_STYLES;
		const containerCN = cn({
			[styles.container]: true,
			[settingsStyles.bold]: fontStyle === BOLD,
			[settingsStyles.italic]: fontStyle === ITALIC,
			[settingsStyles.underline]: fontStyle === UNDERLINE
		});

		let style = {
			color,
			fontFamily
		};

		if (fontSize === FONT_SIZE_AUTO_OPTION) {
			return this.renderWithResize(containerCN, style);
		}

		const customFontSize = Number(fontSize);

		style = {...style, fontSize: customFontSize};

		return (
			<div className={containerCN} ref={forwardedRef} style={style}>
				{this.renderValue(customFontSize)}
			</div>
		);
	}
}

export default Summary;
