// @flow
import cn from 'classnames';
import {FONT_SIZE_AUTO_OPTION, FONT_STYLES} from 'store/widgets/data/constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import settingsStyles from 'styles/settings.less';
import {Speedometer} from 'components/organisms';
import type {TextValueProps} from 'components/organisms/Speedometer/types';

export class SpeedometerWidget extends PureComponent<Props> {
	renderTextValue = (props: TextValueProps) => {
		const {fontColor, fontFamily, fontSize: indicatorFontSize, fontStyle, show} = this.props.widget.indicator;

		if (show) {
			const {BOLD, ITALIC, UNDERLINE} = FONT_STYLES;
			const className = cn({
				[settingsStyles.bold]: fontStyle === BOLD,
				[settingsStyles.italic]: fontStyle === ITALIC,
				[settingsStyles.underline]: fontStyle === UNDERLINE
			});
			let {fontSize} = props;

			if (indicatorFontSize !== FONT_SIZE_AUTO_OPTION) {
				fontSize = indicatorFontSize;
			}

			const textProps = {
				...props,
				className,
				fill: fontColor,
				fontFamily,
				fontSize
			};

			return <text {...textProps} />;
		}

		return null;
	};

	render () {
		const {data, widget} = this.props;
		const {borders, ranges} = widget;
		const {max, min} = borders;
		const {title, total} = data;
		const components = {
			TextValue: this.renderTextValue
		};

		return (
			<Speedometer
				components={components}
				max={Number(max)}
				min={Number(min)}
				ranges={ranges}
				title={title}
				value={total}
			/>
		);
	}
}

export default SpeedometerWidget;
