// @flow
import AxisSettingsBox from 'DiagramWidgetEditForm/components/AxisChartForm/components/AxisSettingsBox';
import ColorsBox from 'containers/DiagramWidgetEditForm/components/ColorsBox';
import DataLabelsBox from 'DiagramWidgetEditForm/components/DataLabelsBox';
import {DEFAULT_AXIS_SORTING_SETTINGS, WIDGET_TYPES} from 'store/widgets/data/constants';
import {DEFAULT_CHART_SETTINGS} from 'utils/chart/constants';
import {extend} from 'helpers';
import {FIELDS} from 'DiagramWidgetEditForm/constants';
import {getLegendSettings} from 'utils/chart/helpers';
import {getMainDataSetIndex} from 'store/widgets/data/helpers';
import {getSortingOptions} from 'DiagramWidgetEditForm/helpers';
import HeaderBox from 'DiagramWidgetEditForm/components/HeaderBox';
import LegendBox from 'DiagramWidgetEditForm/components/LegendBox';
import type {OnChangeEvent} from 'components/types';
import React, {Component} from 'react';
import SortingBox from 'DiagramWidgetEditForm/components/SortingBox';
import type {StyleTabProps} from 'DiagramWidgetEditForm/types';
import styles from './styles.less';

export class StyleTab extends Component<StyleTabProps> {
	getData = (defaultData: Object, data?: Object) => {
		return data && typeof data === 'object' ? {...defaultData, ...data} : defaultData;
	};

	handleChange = (name: string, data: Object) => {
		const {setFieldValue} = this.props;

		setFieldValue(name, data);
	};

	handleChangeAxisName = (index: number) => ({name, value}: OnChangeEvent<string>) => {
		const {setDataFieldValue} = this.props;

		setDataFieldValue(index, name, value);
	};

	renderColorsBox = () => {
		const {values, widget} = this.props;
		const {colorsSettings} = values;
		const disabledCustomSettings = widget.type === WIDGET_TYPES.LINE;

		return (
			<ColorsBox
				disabledCustomSettings={disabledCustomSettings}
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
			data,
			dataLabels = DEFAULT_CHART_SETTINGS.dataLabels,
			header,
			indicator = DEFAULT_CHART_SETTINGS.axis,
			legend = getLegendSettings(values),
			parameter = DEFAULT_CHART_SETTINGS.axis,
			sorting = DEFAULT_AXIS_SORTING_SETTINGS
		} = values;
		const index = getMainDataSetIndex(data);
		const {xAxisName, yAxisName} = data[index];

		return (
			<div className={styles.container}>
				<HeaderBox data={header} name={FIELDS.header} onChange={this.handleChange} />
				<LegendBox data={legend} name={FIELDS.legend} onChange={this.handleChange} />
				<AxisSettingsBox
					axisFieldName={FIELDS.xAxisName}
					axisName={xAxisName}
					name={FIELDS.parameter}
					onChangeAxisName={this.handleChangeAxisName(index)}
					onChangeSettings={this.handleChange}
					settings={extend(DEFAULT_CHART_SETTINGS.axis, parameter)}
					title="Параметр"
				/>
				<AxisSettingsBox
					axisFieldName={FIELDS.yAxisName}
					axisName={yAxisName}
					name={FIELDS.indicator}
					onChangeAxisName={this.handleChangeAxisName(index)}
					onChangeSettings={this.handleChange}
					settings={extend(DEFAULT_CHART_SETTINGS.axis, indicator)}
					title="Показатель"
				/>
				<SortingBox
					data={sorting}
					name={FIELDS.sorting}
					onChange={this.handleChange}
					options={getSortingOptions(values)}
				/>
				<DataLabelsBox data={dataLabels} name={FIELDS.dataLabels} onChange={this.handleChange} />
				{this.renderColorsBox()}
			</div>
		);
	}
}

export default StyleTab;
