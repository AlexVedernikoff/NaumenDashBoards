// @flow
import type {Breakdown, Indicator} from 'containers/DiagramWidgetEditForm/types';
import BreakdownFieldset from 'DiagramWidgetEditForm/components/BreakdownFieldset';
import Checkbox from 'components/atoms/LegacyCheckbox';
import DataTopField from 'DiagramWidgetEditForm/components/DataTopField';
import type {DataTopSettings} from 'store/widgets/data/types';
import {
	DEFAULT_CIRCLE_SORTING_SETTINGS,
	DEFAULT_TOP_SETTINGS,
	SORTING_VALUES,
	WIDGET_TYPES
} from 'store/widgets/data/constants';
import ExtendingFieldset from 'DiagramWidgetEditForm/components/ExtendingFieldset';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import FormBox from 'components/molecules/FormBox';
import {getDataErrorKey, getDefaultBreakdown} from 'DiagramWidgetEditForm/helpers';
import {GROUP_WAYS} from 'store/widgets/constants';
import IndicatorFieldset from 'DiagramWidgetEditForm/components/IndicatorFieldset';
import {isAllowedTopAggregation, isCircleChart} from 'store/widgets/helpers';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import withForm from 'DiagramWidgetEditForm/withForm';

export class IndicatorDataBox extends PureComponent<Props> {
	static defaultProps = {
		children: null,
		usesBreakdown: true,
		usesEmptyData: false,
		usesTop: false
	};

	handleChange = (dataSetIndex: number, index: number, newIndicator: Indicator) => {
		const {onSelectCallback, setDataFieldValue, values} = this.props;
		const {data, top = DEFAULT_TOP_SETTINGS} = values;
		const {indicators} = data[dataSetIndex];
		const newIndicators = indicators.map((indicator, i) => i === index ? newIndicator : indicator);
		const {aggregation} = newIndicator;

		if (top.show && !isAllowedTopAggregation(aggregation)) {
			setDataFieldValue(index, FIELDS.top, {...top, show: false});
		}

		setDataFieldValue(index, FIELDS.indicators, newIndicators, onSelectCallback(index));
	};

	handleChangeBreakdown = (breakdown: Breakdown) => {
		const {index, setDataFieldValue, setFieldValue, values} = this.props;
		const {sorting = DEFAULT_CIRCLE_SORTING_SETTINGS, type} = values;

		if (isCircleChart(type)) {
			const {group} = breakdown[0];
			const {DEFAULT, INDICATOR} = SORTING_VALUES;
			let {value} = sorting;

			if (group && group.way === GROUP_WAYS.CUSTOM && sorting.value !== DEFAULT) {
				value = DEFAULT;
			} else if (sorting.value === DEFAULT) {
				value = INDICATOR;
			}

			setFieldValue(FIELDS.sorting, {...sorting, value});
		}

		setDataFieldValue(index, FIELDS.breakdown, breakdown);
	};

	handleChangeShowEmptyData = (name: string, value: boolean) => {
		const {index, setDataFieldValue} = this.props;
		setDataFieldValue(index, name, value);
	};

	handleChangeTopSettings = (top: DataTopSettings) => {
		const {index, setDataFieldValue} = this.props;
		setDataFieldValue(index, FIELDS.top, top);
	};

	handleExtendBreakdown = (index: number) => () => {
		const {setDataFieldValue, values} = this.props;
		const {dataKey} = values.data[index];

		setDataFieldValue(index, FIELDS.withBreakdown, true);
		setDataFieldValue(index, FIELDS.breakdown, [getDefaultBreakdown(dataKey)]);
	};

	handleRemoveBreakdown = () => {
		const {index, setDataFieldValue} = this.props;

		setDataFieldValue(index, FIELDS.breakdown, undefined);
		setDataFieldValue(index, FIELDS.withBreakdown, false);
	};

	requiredBreakdown = () => {
		const {values} = this.props;
		const {BAR_STACKED, COLUMN_STACKED, DONUT, PIE} = WIDGET_TYPES;

		return [BAR_STACKED, COLUMN_STACKED, DONUT, PIE].includes(values.type);
	};

	shouldShowBreakdown = (index: number) => {
		const dataSet = this.props.values.data[index];
		return this.requiredBreakdown() || dataSet[FIELDS.withBreakdown] || dataSet[FIELDS.breakdown];
	};

	renderBreakdownFieldSet = () => {
		const {dataSet, errors, index, usesBreakdown, values} = this.props;

		if (usesBreakdown) {
			const {data} = values;
			const {attribute} = dataSet.indicators[0];
			const show = this.shouldShowBreakdown(index);
			let {breakdown} = dataSet;

			return (
				<ExtendingFieldset index={index} onClick={this.handleExtendBreakdown(index)} show={show} text="Разбивка">
					<BreakdownFieldset
						data={data}
						errors={errors}
						index={index}
						indicator={attribute}
						key={index}
						onChange={this.handleChangeBreakdown}
						onRemove={this.handleRemoveBreakdown}
						removable={!this.requiredBreakdown()}
						value={breakdown}
					/>
				</ExtendingFieldset>
			);
		}

		return null;
	};

	renderDataTopField = () => {
		const {errors, index, usesTop} = this.props;
		const {indicators, top} = this.props.dataSet;
		const disabled = !isAllowedTopAggregation(indicators[0].aggregation);
		const error = errors[getDataErrorKey(index, FIELDS.top, FIELDS.count)];

		return usesTop && <DataTopField disabled={disabled} error={error} onChange={this.handleChangeTopSettings} value={top} />;
	};

	renderIndicatorFieldSet = (indicator: Indicator, indicatorIndex: number) => {
		const {dataSet, errors, index, values} = this.props;
		const {computedAttrs} = values;
		const errorKey = getDataErrorKey(index, FIELDS.indicators, indicatorIndex);

		return (
			<IndicatorFieldset
				computedAttrs={computedAttrs}
				dataSet={dataSet}
				dataSetIndex={index}
				error={errors[errorKey]}
				index={indicatorIndex}
				key={errorKey}
				name={FIELDS.indicators}
				onChange={this.handleChange}
				value={indicator}
			/>
		);
	};

	renderIndicators = () => {
		const {children, dataSet, index, renderLeftControl} = this.props;
		const control = renderLeftControl && renderLeftControl(dataSet, index);
		const {indicators} = dataSet;

		return (
			<FormBox leftControl={control} title="Показатель">
				{indicators.map(this.renderIndicatorFieldSet)}
				{this.renderBreakdownFieldSet()}
				{this.renderDataTopField()}
				{children}
			</FormBox>
		);
	};

	renderShowEmptyDataBox = () => {
		const {dataSet, usesEmptyData} = this.props;
		const {showEmptyData} = dataSet;

		if (usesEmptyData) {
			return (
				<FormBox>
					<Checkbox
						label="Показывать нулевые значения"
						name={FIELDS.showEmptyData}
						onClick={this.handleChangeShowEmptyData}
						value={Boolean(showEmptyData)}
					/>
				</FormBox>
			);
		}
	};

	render () {
		return (
			<Fragment>
				{this.renderIndicators()}
				{this.renderShowEmptyDataBox()}
			</Fragment>
		);
	}
}

export default withForm(IndicatorDataBox);
