// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import BreakdownFieldset from 'DiagramWidgetEditForm/components/BreakdownFieldset';
import Checkbox from 'components/atoms/Checkbox';
import type {ComputedAttr, DataTopSettings} from 'store/widgets/data/types';
import ComputedBreakdownFieldset from 'DiagramWidgetEditForm/components/ComputedBreakdownFieldset';
import DataTopField from 'DiagramWidgetEditForm/components/DataTopField';
import type {DefaultBreakdown, Indicator} from 'containers/DiagramWidgetEditForm/types';
import {
	DEFAULT_CIRCLE_SORTING_SETTINGS,
	DEFAULT_TOP_SETTINGS,
	SORTING_VALUES,
	WIDGET_TYPES
} from 'store/widgets/data/constants';
import ExtendingFieldset from 'DiagramWidgetEditForm/components/ExtendingFieldset';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import FormBox from 'components/molecules/FormBox';
import {getDataErrorKey, getDefaultParameter} from 'DiagramWidgetEditForm/helpers';
import {getMapValues} from 'helpers';
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

	createComputedBreakdown = (indicator: ComputedAttr) => {
		const {values} = this.props;
		const breakdown = [];
		const arrData = getMapValues(indicator.computeData);
		values.data.map(set => set.dataKey)
			.filter(dataKey => arrData.find(set => set.dataKey === dataKey))
			.forEach(dataKey => breakdown.push({dataKey, group: null, value: null}));

		return breakdown;
	};

	handleChange = (dataSetIndex: number, index: number, newIndicator: Indicator) => {
		const {setDataFieldValue, values} = this.props;
		const {data, top = DEFAULT_TOP_SETTINGS} = values;
		const {indicators} = data[dataSetIndex];
		const newIndicators = indicators.map((indicator, i) => i === index ? newIndicator : indicator);
		const {aggregation} = newIndicator;

		if (top.show && !isAllowedTopAggregation(aggregation)) {
			setDataFieldValue(index, FIELDS.top, {...top, show: false});
		}

		setDataFieldValue(index, FIELDS.indicators, newIndicators, this.onSelectIndicatorCallback(index));
	};

	handleChangeBreakdown = (index: number, breakdown: DefaultBreakdown) => {
		const {setDataFieldValue, setFieldValue, values} = this.props;
		const {sorting = DEFAULT_CIRCLE_SORTING_SETTINGS, type} = values;

		if (isCircleChart(type)) {
			const {group} = breakdown;
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
		const {setDataFieldValue} = this.props;

		setDataFieldValue(index, FIELDS.withBreakdown, true);
		this.setDefaultBreakdown(index);
	};

	handleRemoveBreakdown = (index: number) => {
		const {setDataFieldValue} = this.props;

		setDataFieldValue(index, FIELDS.breakdown, null);
		setDataFieldValue(index, FIELDS.withBreakdown, false);
	};

	onSelectIndicatorCallback = (index: number) => {
		const {onSelectCallback} = this.props;

		onSelectCallback && onSelectCallback(index);
		this.showBreakdown(index) && this.setDefaultBreakdown(index);
	};

	requiredBreakdown = () => {
		const {values} = this.props;
		const {BAR_STACKED, COLUMN_STACKED, DONUT, PIE} = WIDGET_TYPES;

		return [BAR_STACKED, COLUMN_STACKED, DONUT, PIE].includes(values.type);
	};

	setDefaultBreakdown = (index: number) => {
		const {setDataFieldValue, values} = this.props;
		const {breakdown, indicators} = values.data[index];
		const {attribute} = indicators[0];
		let newBreakdown = breakdown;

		if (attribute && attribute.type === ATTRIBUTE_TYPES.COMPUTED_ATTR && !Array.isArray(breakdown)) {
			newBreakdown = this.createComputedBreakdown(attribute);
		} else if (Array.isArray(breakdown)) {
			newBreakdown = null;
		}

		breakdown !== newBreakdown && setDataFieldValue(index, FIELDS.breakdown, newBreakdown);
	};

	showBreakdown = (index: number) => {
		const dataSet = this.props.values.data[index];
		return this.requiredBreakdown() || dataSet[FIELDS.withBreakdown] || dataSet[FIELDS.breakdown];
	};

	renderBreakdownFieldSet = () => {
		const {dataSet, index, usesBreakdown} = this.props;
		const {attribute} = dataSet.indicators[0];

		if (usesBreakdown) {
			const show = this.showBreakdown(index);
			const field = attribute && attribute.type === ATTRIBUTE_TYPES.COMPUTED_ATTR
				? this.renderComputedBreakdownFieldSet(attribute)
				: this.renderDefaultBreakdownFieldSet();

			return (
				<ExtendingFieldset index={index} onClick={this.handleExtendBreakdown(index)} show={show} text="Разбивка">
					{field}
				</ExtendingFieldset>
			);
		}
	};

	renderComputedBreakdownFieldSet = (indicator: ComputedAttr) => {
		const {dataSet, errors, index, setDataFieldValue, values} = this.props;
		const {data} = values;
		let {breakdown} = dataSet;

		if (!Array.isArray(breakdown)) {
			breakdown = this.createComputedBreakdown(indicator);
		}

		return (
			<ComputedBreakdownFieldset
				createDefaultValue={this.createComputedBreakdown}
				data={data}
				errors={errors}
				index={index}
				key={getDataErrorKey(FIELDS.breakdown, index)}
				name={FIELDS.breakdown}
				onChange={setDataFieldValue}
				onRemove={this.handleRemoveBreakdown}
				removable={!this.requiredBreakdown()}
				value={breakdown}
			/>
		);
	};

	renderDataTopField = () => {
		const {errors, index, usesTop} = this.props;
		const {indicators, top} = this.props.dataSet;
		const disabled = !isAllowedTopAggregation(indicators[0].aggregation);
		const error = errors[getDataErrorKey(index, FIELDS.top, FIELDS.count)];

		return usesTop && <DataTopField disabled={disabled} error={error} onChange={this.handleChangeTopSettings} value={top} />;
	};

	renderDefaultBreakdownFieldSet = () => {
		const {dataSet, errors, index} = this.props;
		const errorKey = getDataErrorKey(index, FIELDS.breakdown);
		let {breakdown} = dataSet;

		if (!breakdown || Array.isArray(breakdown)) {
			breakdown = getDefaultParameter();
		}

		return (
			<BreakdownFieldset
				dataSet={dataSet}
				dataSetIndex={index}
				error={errors[errorKey]}
				index={index}
				key={errorKey}
				name={FIELDS.breakdown}
				onChange={this.handleChangeBreakdown}
				onRemove={this.handleRemoveBreakdown}
				removable={!this.requiredBreakdown()}
				value={breakdown}
			/>
		);
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
