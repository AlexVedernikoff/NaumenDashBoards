// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {ComputedAttr, Indicator} from 'store/widgets/data/types';
import {FIELDS} from 'WidgetFormPanel/constants';
import {FormBox} from 'components/molecules';
import {getDataErrorKey} from 'WidgetFormPanel/helpers';
import {getDefaultAggregation} from 'WidgetFormPanel/components/AttributeAggregationField/helpers';
import {getDefaultIndicator, hasDifferentAggregations} from 'WidgetFormPanel/components/TableForm/helpers';
import {IndicatorFieldset, SortableList} from 'WidgetFormPanel/components';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'WidgetFormPanel/types';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import withForm from 'WidgetFormPanel/withForm';

export class IndicatorsBox extends PureComponent<Props> {
	checkForBreakdown = () => {
		const {onRemoveBreakdown, values} = this.props;

		if (hasDifferentAggregations(values.data)) {
			onRemoveBreakdown();
		}
	};

	getIndicators = () => {
		const {indicators = [getDefaultIndicator()]} = this.props.set;
		return indicators;
	};

	handleChangeAttributeTitle = (event: OnChangeAttributeLabelEvent, index: number) => {
		const {changeAttributeTitle, index: dataSetIndex, setDataFieldValue} = this.props;
		const {label, parent} = event;
		const indicators = this.getIndicators();

		indicators[index] = {
			...indicators[index],
			// $FlowFixMe
			attribute: changeAttributeTitle(indicators[index].attribute, parent, label)
		};

		setDataFieldValue(dataSetIndex, FIELDS.indicators, indicators);
	};

	handleChangeOrder = (indicators: Array<Object>) => {
		const {index, setDataFieldValue} = this.props;
		setDataFieldValue(index, FIELDS.indicators, indicators);
	};

	handleClickAddInput = () => {
		const {index, setDataFieldValue} = this.props;
		setDataFieldValue(index, FIELDS.indicators, [...this.getIndicators(), getDefaultIndicator()]);
	};

	handleClickSumInput = () => {
		const {calcTotalColumn, setFieldValue} = this.props;
		setFieldValue(FIELDS.calcTotalColumn, !calcTotalColumn);
	};

	handleRemove = (index: number) => {
		const {index: dataSetIndex, setDataFieldValue} = this.props;
		const indicators = this.getIndicators();

		if (indicators.length > 1) {
			indicators.splice(index, 1);

			setDataFieldValue(dataSetIndex, FIELDS.indicators, indicators);
		}
	};

	handleRemoveComputedAttribute = (index: number, name: string, attribute: ComputedAttr) => {
		const {index: dataSetIndex, removeComputedAttribute, setDataFieldValue} = this.props;
		const indicators = this.getIndicators();
		indicators[index] = {
			...indicators[index],
			attribute: null
		};

		removeComputedAttribute(attribute);
		setDataFieldValue(dataSetIndex, FIELDS.indicators, indicators);
	};

	handleSaveComputedAttribute = (index: number, name: string, attribute: ComputedAttr) => {
		const {index: dataSetIndex, saveComputedAttribute, setDataFieldValue} = this.props;
		const indicators = this.getIndicators();
		indicators[index] = {
			...indicators[index],
			attribute
		};

		saveComputedAttribute(attribute);
		setDataFieldValue(dataSetIndex, FIELDS.indicators, indicators);
	};

	handleSelect = (event: OnSelectAttributeEvent, index: number) => {
		const {index: dataSetIndex, setDataFieldValue, transformAttribute} = this.props;
		const indicators = this.getIndicators();
		const currentValue = indicators[index];
		const {value} = event;

		if (value && value.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR && (!currentValue || currentValue.type !== value.type)) {
			indicators[index] = {
				...indicators[index],
				aggregation: getDefaultAggregation(value)
			};
		}

		indicators[index] = {
			...indicators[index],
			attribute: transformAttribute(event, this.handleSelect, index)
		};

		setDataFieldValue(dataSetIndex, FIELDS.indicators, indicators, this.checkForBreakdown);
	};

	handleSelectAggregation = (index: number, name: string, value: string) => {
		const {index: dataSetIndex, setDataFieldValue} = this.props;
		const indicators = this.getIndicators();
		indicators[index] = {
			...indicators[index],
			aggregation: value
		};

		setDataFieldValue(dataSetIndex, FIELDS.indicators, indicators, this.checkForBreakdown);
	};

	renderFieldset = (indicator: Indicator, index: number, indicators: Array<Indicator>) => {
		const {errors, index: dataSetIndex, set} = this.props;
		const {aggregation, attribute} = indicator;
		const removable = indicators.length > 1;
		const errorKey = getDataErrorKey(dataSetIndex, FIELDS.indicators, index, FIELDS.attribute);

		return (
			<IndicatorFieldset
				aggregation={aggregation}
				error={errors[errorKey]}
				index={index}
				key={index}
				name={FIELDS.attribute}
				onChangeLabel={this.handleChangeAttributeTitle}
				onRemove={this.handleRemove}
				onRemoveComputedAttribute={this.handleRemoveComputedAttribute}
				onSaveComputedAttribute={this.handleSaveComputedAttribute}
				onSelect={this.handleSelect}
				onSelectAggregation={this.handleSelectAggregation}
				removable={removable}
				set={set}
				usesNotApplicableAggregation={true}
				value={attribute}
			/>
		);
	};

	renderRightControl = () => {
		const {calcTotalColumn, renderAddInput, renderSumInput} = this.props;
		const sumInputProps = {
			active: calcTotalColumn,
			onClick: this.handleClickSumInput
		};
		const addInputProps = {
			onClick: this.handleClickAddInput
		};

		return (
			<Fragment>
				{renderSumInput(sumInputProps)}
				{renderAddInput(addInputProps)}
			</Fragment>
		);
	};

	render () {
		return (
			<FormBox rightControl={this.renderRightControl()} title="Показатели">
				<SortableList
					list={this.getIndicators()}
					onChangeOrder={this.handleChangeOrder}
					renderItem={this.renderFieldset}
				/>
			</FormBox>
		);
	}
}

export default withForm(IndicatorsBox);
