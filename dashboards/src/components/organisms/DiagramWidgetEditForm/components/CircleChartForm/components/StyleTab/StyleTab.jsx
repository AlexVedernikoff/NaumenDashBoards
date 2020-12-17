// @flow
import {ColorsBox, DataLabelsBox, HeaderBox, LegendBox, SortingBox} from 'DiagramWidgetEditForm/components';
import {DEFAULT_CHART_SETTINGS} from 'utils/chart/constants';
import {DEFAULT_CIRCLE_SORTING_SETTINGS, SORTING_VALUES} from 'store/widgets/data/constants';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import {getSortingOptions} from 'DiagramWidgetEditForm/helpers';
import React, {Component} from 'react';
import type {StyleTabProps} from 'DiagramWidgetEditForm/types';
import styles from './styles.less';

export class StyleTab extends Component<StyleTabProps> {
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
			legend = DEFAULT_CHART_SETTINGS.legend,
			sorting = DEFAULT_CIRCLE_SORTING_SETTINGS
		} = values;

		return (
			<div className={styles.container}>
				<HeaderBox data={header} name={FIELDS.header} onChange={this.handleChange} />
				<LegendBox data={legend} name={FIELDS.legend} onChange={this.handleChange} />
				<SortingBox
					data={sorting}
					name={FIELDS.sorting}
					onChange={this.handleChange}
					options={getSortingOptions(values).filter(option => option.value !== SORTING_VALUES.PARAMETER)}
				/>
				<DataLabelsBox data={dataLabels} name={FIELDS.dataLabels} onChange={this.handleChange} />
				<ColorsBox data={colors} name={FIELDS.colors} onChange={this.handleChange} />
			</div>
		);
	}
}

export default StyleTab;
