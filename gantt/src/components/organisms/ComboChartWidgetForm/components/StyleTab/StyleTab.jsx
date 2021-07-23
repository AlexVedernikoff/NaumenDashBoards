// @flow
import AxisSettingsBox from 'components/organisms/AxisChartWidgetForm/components/AxisSettingsBox';
import ColorsBox from 'WidgetFormPanel/components/ColorsBox';
import DataLabelsBox from 'WidgetFormPanel/components/DataLabelsBox';
import {DIAGRAM_FIELDS} from 'components/organisms/WidgetFormPanel/constants';
import FormField from 'components/molecules/FormField';
import {getSortingOptions} from 'WidgetFormPanel/helpers';
import HeaderBox from 'WidgetFormPanel/components/HeaderBox';
import IndicatorSettingsBox from 'components/organisms/ComboChartWidgetForm/components/IndicatorSettingsBox';
import LegendBox from 'WidgetFormPanel/components/LegendBox';
import {MAX_TEXT_LENGTH} from 'components/constants';
import type {OnChangeEvent} from 'components/types';
import type {Props} from './types';
import React, {Component} from 'react';
import SortingBox from 'components/organisms/ComboChartWidgetForm/components/SortingBox';
import styles from './styles.less';
import TextInput from 'components/atoms/TextInput';
import withWidget from 'WidgetFormPanel/HOCs/withWidget';

export class StyleTab extends Component<Props> {
	handleChange = (name: string, data: Object) => {
		const {onChange} = this.props;

		onChange(name, data);
	};

	handleChangeAxisName = (index: number) => ({name, value}: OnChangeEvent<string>) => {
		const {onChange, values} = this.props;
		const newData = values.data.map((dataSet, i) => i === index ? {...dataSet, [name]: value} : dataSet);

		onChange(DIAGRAM_FIELDS.data, newData);
	};

	renderXAxisNameField = () => {
		const mainIndex = 0;
		const {xAxisName} = this.props.values.data[mainIndex];

		return (
			<FormField small>
				<TextInput
					maxLength={MAX_TEXT_LENGTH}
					name={DIAGRAM_FIELDS.xAxisName}
					onChange={this.handleChangeAxisName(mainIndex)}
					value={xAxisName}
				/>
			</FormField>
		);
	};

	render () {
		const {hasCustomGroup, values, widget} = this.props;
		const {colorsSettings, data, dataLabels, header, indicator, legend, parameter, sorting} = values;

		return (
			<div className={styles.container}>
				<HeaderBox name={DIAGRAM_FIELDS.header} onChange={this.handleChange} value={header} />
				<LegendBox name={DIAGRAM_FIELDS.legend} onChange={this.handleChange} value={legend} />
				<AxisSettingsBox
					name={DIAGRAM_FIELDS.parameter}
					onChange={this.handleChange}
					renderNameField={this.renderXAxisNameField}
					title="Параметр"
					value={parameter}
				/>
				<IndicatorSettingsBox
					data={data}
					name={DIAGRAM_FIELDS.indicator}
					onChange={this.handleChange}
					onChangeYAxisName={this.handleChangeAxisName}
					value={indicator}
				/>
				<SortingBox
					data={data}
					name={DIAGRAM_FIELDS.sorting}
					onChange={this.handleChange}
					options={getSortingOptions(!hasCustomGroup)}
					value={sorting}
				/>
				<DataLabelsBox name={DIAGRAM_FIELDS.dataLabels} onChange={this.handleChange} value={dataLabels} widget={widget} />
				<ColorsBox
					disabledCustomSettings={true}
					name={DIAGRAM_FIELDS.colorsSettings}
					onChange={this.handleChange}
					value={colorsSettings}
				/>
			</div>
		);
	}
}

export default withWidget(StyleTab);
