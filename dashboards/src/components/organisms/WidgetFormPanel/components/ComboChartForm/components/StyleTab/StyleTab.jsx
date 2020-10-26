// @flow
import {ColorsBox, DataLabelsBox, HeaderBox, LegendBox, SortingBox} from 'WidgetFormPanel/components';
import {DEFAULT_AXIS_SORTING_SETTINGS} from 'store/widgets/data/constants';
import {DEFAULT_CHART_SETTINGS, DEFAULT_COMBO_Y_AXIS_SETTINGS} from 'utils/chart/constants';
import {extend} from 'src/helpers';
import {FIELDS} from 'WidgetFormPanel/constants';
import {getLegendSettings} from 'utils/chart/helpers';
import {IndicatorBox, ParameterBox} from 'WidgetFormPanel/components/AxisChartForm/components';
import {IndicatorSettingsBox} from 'WidgetFormPanel/components/ComboChartForm/components';
import React, {Component} from 'react';
import type {StyleTabProps} from 'WidgetFormPanel/types';
import styles from './styles.less';

export class StyleTab extends Component<StyleTabProps> {
	getData = (defaultData: Object, data?: Object) => {
		return data && typeof data === 'object' ? {...defaultData, ...data} : defaultData;
	};

	handleChange = (name: string, data: Object) => {
		const {setFieldValue} = this.props;
		setFieldValue(name, data);
	};

	render () {
		const {values} = this.props;
		const {
			colors,
			dataLabels = DEFAULT_CHART_SETTINGS.dataLabels,
			header,
			indicator = DEFAULT_CHART_SETTINGS.yAxis,
			indicatorSettings = DEFAULT_COMBO_Y_AXIS_SETTINGS,
			legend = getLegendSettings(values),
			parameter = DEFAULT_CHART_SETTINGS.xAxis,
			sorting = DEFAULT_AXIS_SORTING_SETTINGS
		} = values;

		return (
			<div className={styles.container}>
				<HeaderBox data={header} name={FIELDS.header} onChange={this.handleChange} />
				<LegendBox data={legend} name={FIELDS.legend} onChange={this.handleChange} />
				<ParameterBox data={parameter} name={FIELDS.parameter} onChange={this.handleChange} />
				<IndicatorBox data={extend(DEFAULT_CHART_SETTINGS.yAxis, indicator)} name={FIELDS.indicator} onChange={this.handleChange} />
				<IndicatorSettingsBox data={indicatorSettings} name={FIELDS.indicatorSettings} onChange={this.handleChange} />
				<SortingBox data={sorting} name={FIELDS.sorting} onChange={this.handleChange} />
				<DataLabelsBox data={dataLabels} name={FIELDS.dataLabels} onChange={this.handleChange} />
				<ColorsBox data={colors} name={FIELDS.colors} onChange={this.handleChange} />
			</div>
		);
	}
}

export default StyleTab;
