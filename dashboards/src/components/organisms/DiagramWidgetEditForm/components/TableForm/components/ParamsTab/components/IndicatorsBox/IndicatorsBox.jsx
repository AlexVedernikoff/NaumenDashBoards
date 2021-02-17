// @flow
import {FIELDS} from 'DiagramWidgetEditForm';
import {FormBox} from 'components/molecules';
import {getDataErrorKey, getDefaultIndicator} from 'DiagramWidgetEditForm/helpers';
import {hasDifferentAggregations} from 'DiagramWidgetEditForm/components/TableForm/helpers';
import type {Indicator} from 'store/widgets/data/types';
import {IndicatorFieldset, SortableList} from 'DiagramWidgetEditForm/components';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import withForm from 'DiagramWidgetEditForm/withForm';

export class IndicatorsBox extends PureComponent<Props> {
	checkForBreakdown = () => {
		const {onRemoveBreakdown, values} = this.props;

		if (hasDifferentAggregations(values.data)) {
			onRemoveBreakdown();
		}
	};

	getIndicators = () => {
		const {indicators = [getDefaultIndicator()]} = this.props.dataSet;
		return indicators;
	};

	handleChange = (dataSetIndex: number, index: number, newIndicator: Indicator) => {
		const {setDataFieldValue, values} = this.props;
		const {indicators} = values.data[dataSetIndex];
		const newIndicators = indicators.map((indicator, i) => i === index ? newIndicator : indicator);

		setDataFieldValue(index, FIELDS.indicators, newIndicators, this.checkForBreakdown);
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
		const {dataSet, errors, index: dataSetIndex} = this.props;
		const removable = indicators.length > 1;
		const errorKey = getDataErrorKey(dataSetIndex, FIELDS.indicators, index);

		return (
			<IndicatorFieldset
				dataSet={dataSet}
				dataSetIndex={dataSetIndex}
				error={errors[errorKey]}
				index={index}
				key={index}
				onChange={this.handleChange}
				onRemove={this.handleRemove}
				removable={removable}
				usesNotApplicableAggregation={true}
				value={indicator}
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
