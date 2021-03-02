// @flow
import ColorsBox from 'containers/DiagramWidgetEditForm/components/ColorsBox';
import DataLabelsBox from 'DiagramWidgetEditForm/components/DataLabelsBox';
import {DEFAULT_CHART_SETTINGS} from 'utils/chart/constants';
import {DEFAULT_CIRCLE_SORTING_SETTINGS, SORTING_VALUES} from 'store/widgets/data/constants';
import {FIELDS} from 'DiagramWidgetEditForm/constants';
import {getSortingOptions} from 'DiagramWidgetEditForm/helpers';
import HeaderBox from 'DiagramWidgetEditForm/components/HeaderBox';
import LegendBox from 'DiagramWidgetEditForm/components/LegendBox';
import React, {Component} from 'react';
import SortingBox from 'DiagramWidgetEditForm/components/SortingBox';
import type {StyleTabProps} from 'DiagramWidgetEditForm/types';
import styles from './styles.less';

export class StyleTab extends Component<StyleTabProps> {
	handleChange = (name: string, data: Object) => {
		const {setFieldValue} = this.props;

		setFieldValue(name, data);
	};

	renderColorsBox = () => {
		const {values, widget} = this.props;
		const {colorsSettings} = values;

		return (
			<ColorsBox
				name={FIELDS.colorsSettings}
				onChange={this.handleChange}
				value={colorsSettings}
				values={values}
				widget={widget}
			/>
		);
	};

	render () {
		const {values} = this.props;
		const {
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
				{this.renderColorsBox()}
			</div>
		);
	}
}

export default StyleTab;
