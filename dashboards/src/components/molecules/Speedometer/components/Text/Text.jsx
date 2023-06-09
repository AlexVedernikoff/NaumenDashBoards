// @flow
import cn from 'classnames';
import type {DefaultProps, Props} from './types';
import {FONT_SIZE_AUTO_OPTION, FONT_STYLES} from 'store/widgets/data/constants';
import React, {PureComponent} from 'react';
import settingsStyles from 'styles/settings.less';

export class Text extends PureComponent<Props> {
	static defaultProps: DefaultProps = {
		className: '',
		dominantBaseline: 'middle',
		fill: null,
		fontSizeScale: 1,
		textAnchor: 'middle'
	};

	render () {
		const {fontSizeScale, forwardedRef, style, ...transparentProps} = this.props;
		const {fontColor, fontFamily, fontSize: styleFontSize, fontStyle, show} = style;

		if (show) {
			const {BOLD, ITALIC, UNDERLINE} = FONT_STYLES;
			const className = cn({
				[settingsStyles.bold]: fontStyle === BOLD,
				[settingsStyles.italic]: fontStyle === ITALIC,
				[settingsStyles.underline]: fontStyle === UNDERLINE
			});

			let fontSize = null;

			if (fontSize !== FONT_SIZE_AUTO_OPTION) {
				if (typeof styleFontSize === 'string') {
					fontSize = Number.parseFloat(styleFontSize) * fontSizeScale;
				} else {
					fontSize = styleFontSize * fontSizeScale;
				}
			}

			const textStyle = {
				color: fontColor,
				fontFamily: `${fontFamily}, Helvetica, Arial, sans-serif`,
				fontSize
			};

			const textProps = {
				...transparentProps,
				className,
				fill: fontColor,
				fontFamily,
				fontSize,
				style: textStyle
			};

			return <text {...textProps} ref={forwardedRef} />;
		}

		return null;
	}
}

export default Text;
