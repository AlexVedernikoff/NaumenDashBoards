// @flow
import cn from 'classnames';
import {FONT_SIZE_AUTO_OPTION, FONT_STYLES} from 'store/widgets/data/constants';
import {getBuildSet} from 'store/widgets/data/helpers';
import {hasMSInterval, parseMSInterval} from 'store/widgets/helpers';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import {ResizeDetector} from 'components/molecules';
import settingsStyles from 'styles/settings.less';
import styles from './styles.less';

export class Summary extends PureComponent<Props, State> {
	state = {
		fontSize: null,
		value: null
	};

	static getDerivedStateFromProps (props: Props) {
		const {data, widget} = props;
		const {total} = data;
		const value = hasMSInterval(getBuildSet(widget)) ? parseMSInterval(total) : total;

		return {
			value: String(value)
		};
	}

	handleResize = (width: number, height: number) => {
		const {value} = this.state;

		if (value) {
			const charWidth = Math.round(width / value.length);
			const fontSize = charWidth > height ? height : charWidth * 1.2;

			this.setState({fontSize});
		}
	};

	renderWithResize = (value: string | number, className: string, style: Object) => {
		const {fontSize} = this.state;

		return (
			<ResizeDetector className={className} onResize={this.handleResize} style={{...style, fontSize}}>
				{fontSize && value}
			</ResizeDetector>
		);
	};

	render () {
		const {data, widget} = this.props;
		const {fontColor, fontFamily, fontSize, fontStyle} = widget.indicator;
		const {total} = data;
		const {BOLD, ITALIC, UNDERLINE} = FONT_STYLES;
		const containerCN = cn({
			[styles.container]: true,
			[settingsStyles.bold]: fontStyle === BOLD,
			[settingsStyles.italic]: fontStyle === ITALIC,
			[settingsStyles.underline]: fontStyle === UNDERLINE
		});
		const value = hasMSInterval(getBuildSet(widget)) ? parseMSInterval(total) : total;
		const style = {
			color: fontColor,
			fontFamily
		};

		if (fontSize === FONT_SIZE_AUTO_OPTION) {
			return this.renderWithResize(value, containerCN, style);
		}

		return (
			<div className={containerCN} style={{...style, fontSize: Number(fontSize)}}>
				{value}
			</div>
		);
	}
}

export default Summary;
