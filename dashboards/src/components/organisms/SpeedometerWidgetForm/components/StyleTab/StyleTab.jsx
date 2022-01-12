// @flow
import BorderStyleBox from 'components/organisms/SpeedometerWidgetForm/components/BorderStyleBox';
import type {BordersStyle, RangesStyle} from 'store/widgets/data/types';
import {DEFAULT_SPEEDOMETER_SETTINGS} from 'store/widgetForms/speedometerForm/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import HeaderBox from 'WidgetFormPanel/components/HeaderBox';
import IndicatorBox from 'components/organisms/SummaryWidgetForm/components/IndicatorBox';
import type {Props} from './types';
import RangesStyleBox from 'components/organisms/SpeedometerWidgetForm/components/RangesStyleBox';
import React, {Component} from 'react';
import styles from './styles.less';

export class StyleTab extends Component<Props> {
	handleChange = (name: string, data: Object, callback?: Function) => {
		const {onChange} = this.props;

		onChange(name, data, callback);
	};

	handleChangeBorderStyle = (name: string, style: BordersStyle, callback?: Function) => {
		const {onChange, values: {borders}} = this.props;
		const newBorders = {...borders, style};

		onChange(DIAGRAM_FIELDS.borders, newBorders, callback);
	};

	handleChangeRangesStyle = (name: string, style: RangesStyle, callback?: Function) => {
		const {onChange, values: {ranges}} = this.props;
		const newRanges = {...ranges, style};

		onChange(DIAGRAM_FIELDS.ranges, newRanges, callback);
	};

	render () {
		const {
			borders: {style: bordersStyle = DEFAULT_SPEEDOMETER_SETTINGS.borders.style},
			header,
			indicator,
			ranges: {style: rangesStyle = DEFAULT_SPEEDOMETER_SETTINGS.ranges.style}
		} = this.props.values;

		return (
			<div className={styles.container}>
				<HeaderBox name={DIAGRAM_FIELDS.header} onChange={this.handleChange} value={header} />
				<IndicatorBox
					name={DIAGRAM_FIELDS.indicator}
					onChange={this.handleChange}
					useAutoFontSize={true}
					value={indicator}
				/>
				<BorderStyleBox name={DIAGRAM_FIELDS.style} onChange={this.handleChangeBorderStyle} value={bordersStyle} />
				<RangesStyleBox name={DIAGRAM_FIELDS.style} onChange={this.handleChangeRangesStyle} value={rangesStyle} />
			</div>
		);
	}
}

export default StyleTab;
