// @flow
import cn from 'classnames';
import {FONT_SIZE_AUTO_OPTION, FONT_STYLES} from 'store/widgets/data/constants';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import ResizeDetector from 'components/molecules/ResizeDetector';
import settingsStyles from 'styles/settings.less';
import styles from './styles.less';
import WidgetTooltip from 'components/molecules/WidgetTooltip';

export class Summary extends PureComponent<Props, State> {
	state = {
		fontSize: null,
		height: 0
	};

	getTextHeight = (value: string, fontSize: number) => {
		const {fontFamily, fontStyle} = this.props;
		const {body} = document;
		let result = fontSize;

		if (body) {
			const text = document.createElement('span');

			text.style.fontFamily = fontFamily;
			text.style.fontSize = fontSize + 'px';

			if (fontStyle === FONT_STYLES.BOLD) {
				text.style.fontWeight = 'bold';
			}

			if (fontStyle === FONT_STYLES.ITALIC) {
				text.style.fontStyle = 'italic';
			}

			if (fontStyle === FONT_STYLES.UNDERLINE) {
				text.style.textDecoration = 'underline';
			}

			text.textContent = value;
			body.appendChild(text);
			result = text.getBoundingClientRect().height;

			body.removeChild(text);
		}

		return result;
	};

	getTextWidth = (value: string, fontSize: number) => {
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

		return context.measureText(value).width;
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
			let tw = Number.MAX_VALUE;
			let th = Number.MAX_VALUE;

			while (fontSize > 0.01) {
				tw = this.getTextWidth(value, fontSize);
				th = this.getTextHeight(value, fontSize);

				if (tw <= width && th <= height) {
					break;
				}

				fontSize *= 0.95;
			}

			this.setState({fontSize, height: th});
		}
	};

	renderValue = (fontSize: number) => {
		const {onClickValue, options: {data: {tooltip}}} = this.props;
		const {height: textHeight} = this.state;
		const style = {
			height: textHeight > 0 ? `${textHeight}px` : 'auto'
		};

		return (
			<span
				className={styles.value}
				onClick={onClickValue}
				style={style}
			>
				{this.getValue()}
				<WidgetTooltip className={styles.tooltip} tooltip={tooltip} />
			</span>
		);
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
