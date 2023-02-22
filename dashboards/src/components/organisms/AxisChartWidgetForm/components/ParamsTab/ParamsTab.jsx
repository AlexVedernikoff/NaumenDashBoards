// @flow
import type {Breakdown, Parameter} from 'store/widgetForms/types';
import type {
	BreakdownFieldsetProps,
	Components
} from 'WidgetFormPanel/components/ChartDataSetSettings/types';
import ChartDataSetSettings from 'WidgetFormPanel/components/ChartDataSetSettings';
import {createAxisDataSet} from 'store/widgetForms/axisChartForm/helpers';
import type {DataSet} from 'store/widgetForms/axisChartForm/types';
import {
	DEFAULT_AXIS_SORTING_SETTINGS,
	MODE_OF_TOP,
	SORTING_TYPES,
	SORTING_VALUES,
	WIDGET_TYPES
} from 'store/widgets/data/constants';
import DefaultComponents from 'WidgetFormPanel/components/ChartDataSetSettings/defaultComponents';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import DisplayModeSelectBox from 'containers/DisplayModeSelectBox/DisplayModeSelectBox';
import {getAttributeValue} from 'store/sources/attributes/helpers';
import {getDefaultFormatForAttribute} from 'store/widgets/data/helpers';
import {getSortValue} from './helpers';
import {GROUP_WAYS} from 'store/widgets/constants';
import memoize from 'memoize-one';
import NavigationBox from 'containers/NavigationBox/NavigationBox';
import type {OnChangeBreakdown, Props} from './types';
import ParametersDataBox from 'WidgetFormPanel/components/ParametersDataBox';
import React, {Fragment, PureComponent} from 'react';
import ShowTotalAmountBox from 'WidgetFormPanel/components/ShowTotalAmountBox';
import SourceBox from 'WidgetFormPanel/components/SourceBox';
import SourceFieldset from 'containers/SourceFieldset';
import uuid from 'tiny-uuid';
import WidgetNameBox from 'WidgetFormPanel/components/WidgetNameBox';
import WidgetSelectBox from 'WidgetFormPanel/components/WidgetSelectBox';
import withType from 'WidgetFormPanel/HOCs/withType';

export class ParamsTab extends PureComponent<Props> {
	getDataSetSettingsComponents = memoize((): Components => ({
		...DefaultComponents,
		BreakdownFieldset: this.renderBreakdownFieldset
	}));

	breakdownChangeDecorator = (onChangeBreakdown: OnChangeBreakdown) =>
		(breakdown: Breakdown, callback?: Function) => {
			const {onChange} = this.props;
			const breakdownItem = breakdown?.[0] ?? null;
			let format = null;

			if (breakdownItem) {
				const {attribute, group} = breakdownItem;

				format = getDefaultFormatForAttribute(attribute, group);
			}

			onChange(DIAGRAM_FIELDS.breakdownFormat, format);
			onChangeBreakdown(breakdown, callback);
		};

	handleAddDataSet = () => {
		const {onChange, values} = this.props;

		onChange(DIAGRAM_FIELDS.data, [...values.data, createAxisDataSet(uuid())]);
	};

	handleChangeData = (data: Array<DataSet>, callback?: Function) =>
		this.props.onChange(DIAGRAM_FIELDS.data, data, callback);

	handleChangeDataSet = (index: number, newDataSet: DataSet, callback?: Function) => {
		const {onChange, values} = this.props;
		const newData = values.data.map((dataSet, i) => i === index ? newDataSet : dataSet);
		const {top: newTop} = newDataSet;
		const {top: oldTop} = values.data?.[index] ?? {};

		if (
			!newDataSet.sourceForCompute
			&& newTop.show
			&& (newTop.show !== oldTop?.show || newTop.modeOfTop !== oldTop?.modeOfTop)
		) {
			const {sorting: prevSorting} = values;
			const type = newTop.modeOfTop === MODE_OF_TOP.MAX ? SORTING_TYPES.ASC : SORTING_TYPES.DESC;
			const newSorting = {...prevSorting, type, value: SORTING_VALUES.INDICATOR};

			onChange(DIAGRAM_FIELDS.sorting, newSorting);
		}

		onChange(DIAGRAM_FIELDS.data, newData, callback);
	};

	handleChangeParameters = (index: number, parameters: Array<Parameter>, callback?: Function) => {
		const {onChange, values} = this.props;
		const {sorting = DEFAULT_AXIS_SORTING_SETTINGS, parameter} = values;
		const dataSet = values.data[index];
		const {attribute, group} = parameters[0];

		if (!dataSet.sourceForCompute) {
			const value = getSortValue(parameters, sorting);
			const format = getDefaultFormatForAttribute(attribute, group);

			onChange(DIAGRAM_FIELDS.sorting, {...sorting, value});
			onChange(DIAGRAM_FIELDS.parameter, {...parameter, format});
		}

		this.handleChangeDataSet(index, {
			...dataSet,
			parameters,
			xAxisName: getAttributeValue(attribute, 'title')
		}, callback);
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

	renderBreakdownFieldset = (props: BreakdownFieldsetProps) => (
		<DefaultComponents.BreakdownFieldset
			{...props}
			onChange={this.breakdownChangeDecorator(props.onChange)}
		/>
	);

	renderDataSetSettings = (dataSet: DataSet, index: number) => {
		const {type} = this.props;

		if (!dataSet.sourceForCompute) {
			const {BAR_STACKED, COLUMN_STACKED} = WIDGET_TYPES;
			const requiredBreakdown = [BAR_STACKED, COLUMN_STACKED].includes(type.value);
			const hasCustomGroup = this.hasCustomGroup();

			return (
				<ChartDataSetSettings
					components={this.getDataSetSettingsComponents()}
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
		const {onChange, type, values} = this.props;
		const {data, displayMode, navigation, showSubTotalAmount, showTotalAmount} = values;
		const stackedTypes = [WIDGET_TYPES.COLUMN_STACKED, WIDGET_TYPES.BAR_STACKED];
		const subTotalAmountView = stackedTypes.includes(type.value);

		return (
			<Fragment>
				<WidgetNameBox onChange={onChange} values={values} />
				<WidgetSelectBox />
				<SourceBox onAdd={this.handleAddDataSet}>{data.map(this.renderSourceFieldset)}</SourceBox>
				<ParametersDataBox
					onChange={this.handleChangeData}
					onChangeParameters={this.handleChangeParameters}
					value={data}
				/>
				{data.map(this.renderDataSetSettings)}
				<ShowTotalAmountBox
					onChange={onChange}
					showSubTotalAmount={showSubTotalAmount}
					showTotalAmount={showTotalAmount}
					subTotalAmountView={subTotalAmountView}
				/>
				<DisplayModeSelectBox
					name={DIAGRAM_FIELDS.displayMode}
					onChange={onChange}
					value={displayMode}
				/>
				<NavigationBox name={DIAGRAM_FIELDS.navigation} onChange={onChange} value={navigation} />
			</Fragment>
		);
	}
}

export default withType(ParamsTab);
