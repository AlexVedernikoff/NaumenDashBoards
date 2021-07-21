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
import type {Props, XAxisNameContext} from './types';
import React, {Component, createContext} from 'react';
import SortingBox from 'components/organisms/ComboChartWidgetForm/components/SortingBox';
import styles from './styles.less';
import TextInput from 'components/atoms/TextInput';
import withWidget from 'WidgetFormPanel/HOCs/withWidget';

const XAXISNAME_CONTEXT = createContext<XAxisNameContext>({
	mainIndex: 0,
	xAxisName: ''
});

XAXISNAME_CONTEXT.displayName = 'XAXISNAME_CONTEXT';

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

	renderAxisSettingsBox = () => {
		const {values} = this.props;
		const {data, parameter} = values;
		const mainIndex = data.findIndex(ds => !ds.sourceForCompute);
		const xAxisName = data?.[mainIndex]?.xAxisName ?? '';
		const contextValue = {mainIndex, xAxisName};

		return (
			<XAXISNAME_CONTEXT.Provider value={contextValue}>
				<AxisSettingsBox
					name={DIAGRAM_FIELDS.parameter}
					onChange={this.handleChange}
					renderNameField={this.renderXAxisNameField}
					title="Параметр"
					value={parameter}
				/>
			</XAXISNAME_CONTEXT.Provider>
		);
	};

	renderXAxisNameField = () => (
		<FormField small>
			<XAXISNAME_CONTEXT.Consumer>
				{({mainIndex, xAxisName}) => (
					<TextInput
						maxLength={MAX_TEXT_LENGTH}
						name={DIAGRAM_FIELDS.xAxisName}
						onChange={this.handleChangeAxisName(mainIndex)}
						value={xAxisName}
					/>
				)}
			</XAXISNAME_CONTEXT.Consumer>
		</FormField>
	);;

	render () {
		const {hasCustomGroup, values, widget} = this.props;
		const {colorsSettings, data, dataLabels, header, indicator, legend, sorting} = values;

		return (
			<div className={styles.container}>
				<HeaderBox name={DIAGRAM_FIELDS.header} onChange={this.handleChange} value={header} />
				<LegendBox name={DIAGRAM_FIELDS.legend} onChange={this.handleChange} value={legend} />
				{this.renderAxisSettingsBox()}
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
