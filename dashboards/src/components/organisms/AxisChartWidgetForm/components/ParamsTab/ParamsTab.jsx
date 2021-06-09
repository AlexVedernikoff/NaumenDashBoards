// @flow
import {createAxisDataSet} from 'store/widgetForms/axisChartForm/helpers';
import type {DataSet} from 'store/widgetForms/axisChartForm/types';
import DataSetSettings from 'WidgetFormPanel/components/ChartDataSetSettings';
import {DEFAULT_AXIS_SORTING_SETTINGS, SORTING_VALUES, WIDGET_TYPES} from 'store/widgets/data/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import DisplayModeSelectBox from 'containers/DisplayModeSelectBox/DisplayModeSelectBox';
import {getAttributeValue} from 'store/sources/attributes/helpers';
import {GROUP_WAYS} from 'store/widgets/constants';
import NavigationBox from 'containers/NavigationBox/NavigationBox';
import type {Parameter} from 'store/widgetForms/types';
import ParametersDataBox from 'WidgetFormPanel/components/ParametersDataBox';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import SourceBox from 'WidgetFormPanel/components/SourceBox';
import SourceFieldset from 'containers/SourceFieldset';
import uuid from 'tiny-uuid';
import WidgetNameBox from 'WidgetFormPanel/components/WidgetNameBox';
import WidgetSelectBox from 'WidgetFormPanel/components/WidgetSelectBox';
import withType from 'WidgetFormPanel/HOCs/withType';

export class ParamsTab extends PureComponent<Props> {
	handleAddDataSet = () => {
		const {onChange, values} = this.props;

		onChange(DIAGRAM_FIELDS.data, [...values.data, createAxisDataSet(uuid())]);
	};

	handleChangeData = (data: Array<DataSet>) => this.props.onChange(DIAGRAM_FIELDS.data, data);

	handleChangeDataSet = (index: number, newDataSet: DataSet) => {
		const {onChange, values} = this.props;
		const newData = values.data.map((dataSet, i) => i === index ? newDataSet : dataSet);

		onChange(DIAGRAM_FIELDS.data, newData);
	};

	handleChangeParameters = (index: number, parameters: Array<Parameter>) => {
		const {onChange, values} = this.props;
		const {sorting = DEFAULT_AXIS_SORTING_SETTINGS} = values;
		const {DEFAULT, INDICATOR} = SORTING_VALUES;
		const dataSet = values.data[index];
		const {attribute, group} = parameters[0];
		let {value} = sorting;

		if (group.way === GROUP_WAYS.CUSTOM && sorting.value !== DEFAULT) {
			value = DEFAULT;
		} else if (sorting.value === DEFAULT) {
			value = INDICATOR;
		}

		onChange(DIAGRAM_FIELDS.sorting, {...sorting, value});

		this.handleChangeDataSet(index, {
			...dataSet,
			parameters,
			xAxisName: getAttributeValue(attribute, 'title')
		});
	};

	handleRemoveDataSet = (index: number) => {
		const {onChange, values} = this.props;
		const {data} = values;

		data.length > 1 && onChange(DIAGRAM_FIELDS.data, data.filter((dataSet, i) => i !== index));
	};

	hasCustomGroup = (): boolean => {
		const {breakdown, parameters} = this.props.values.data[0];
		const {CUSTOM} = GROUP_WAYS;

		return parameters[0].group.way === CUSTOM || breakdown?.[0].group.way === CUSTOM;
	};

	renderDataSetSettings = (dataSet: DataSet, index: number) => {
		const {type} = this.props;

		if (!dataSet.sourceForCompute) {
			const {BAR_STACKED, COLUMN_STACKED} = WIDGET_TYPES;
			const requiredBreakdown = [BAR_STACKED, COLUMN_STACKED].includes(type.value);
			const hasCustomGroup = this.hasCustomGroup();

			return (
				<DataSetSettings
					index={index}
					key={dataSet.dataKey}
					onChange={this.handleChangeDataSet}
					requiredBreakdown={requiredBreakdown}
					usesBlankData={!hasCustomGroup}
					usesEmptyData={hasCustomGroup}
					value={dataSet}
				/>
			);
		}

		return null;
	};

	renderSourceFieldset = (dataSet: DataSet, index: number, data: Array<DataSet>) => (
		<SourceFieldset
			index={index}
			key={dataSet.dataKey}
			onChange={this.handleChangeDataSet}
			onRemove={this.handleRemoveDataSet}
			removable={data.length > 1}
			value={dataSet}
		/>
	);

	render () {
		const {onChange, values} = this.props;
		const {data, displayMode, navigation} = values;

		return (
			<Fragment>
				<WidgetNameBox onChange={onChange} values={values} />
				<WidgetSelectBox />
				<SourceBox onAdd={this.handleAddDataSet}>{data.map(this.renderSourceFieldset)}</SourceBox>
				<ParametersDataBox onChange={this.handleChangeData} onChangeParameters={this.handleChangeParameters} value={data} />
				{data.map(this.renderDataSetSettings)}
				<DisplayModeSelectBox name={DIAGRAM_FIELDS.displayMode} onChange={onChange} value={displayMode} />
				<NavigationBox name={DIAGRAM_FIELDS.navigation} onChange={onChange} value={navigation} />
			</Fragment>
		);
	}
}

export default withType(ParamsTab);
