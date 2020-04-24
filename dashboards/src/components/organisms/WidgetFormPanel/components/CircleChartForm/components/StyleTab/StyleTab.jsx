// @flow
import {ColorsBox, DataLabelsBox, HeaderBox, LegendBox, SortingBox} from 'WidgetFormPanel/components';
import {DEFAULT_CHART_SETTINGS} from 'utils/chart/constants';
import {DEFAULT_CIRCLE_SORTING_SETTINGS} from 'store/widgets/data/constants';
import {FIELDS} from 'WidgetFormPanel/constants';
import React, {Component} from 'react';
import type {StyleTabProps} from 'WidgetFormPanel/types';
import styles from './styles.less';

export class StyleTab extends Component<StyleTabProps> {
	handleChange = (name: string, data: Object) => {
		const {setFieldValue} = this.props;
		setFieldValue(name, data);
	};

	render () {
		const {
			colors,
			dataLabels = DEFAULT_CHART_SETTINGS.dataLabels,
			header,
			legend = DEFAULT_CHART_SETTINGS.legend,
			sorting = DEFAULT_CIRCLE_SORTING_SETTINGS
		} = this.props.values;

		return (
			<div className={styles.container}>
				<HeaderBox data={header} name={FIELDS.header} onChange={this.handleChange} />
				<LegendBox data={legend} name={FIELDS.legend} onChange={this.handleChange} />
				<SortingBox circle={true} data={sorting} name={FIELDS.sorting} onChange={this.handleChange} />
				<DataLabelsBox data={dataLabels} name={FIELDS.dataLabels} onChange={this.handleChange} />
				<ColorsBox data={colors} name={FIELDS.colors} onChange={this.handleChange} />
			</div>
		);
	}
}

export default StyleTab;
