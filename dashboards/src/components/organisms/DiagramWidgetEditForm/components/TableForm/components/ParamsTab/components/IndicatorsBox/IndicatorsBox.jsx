// @flow
import {FIELDS} from 'DiagramWidgetEditForm/constants';
import FormBox from 'components/molecules/FormBox';
import {getDataErrorKey, getDefaultIndicator} from 'DiagramWidgetEditForm/helpers';
import {hasDifferentAggregations} from 'DiagramWidgetEditForm/components/TableForm/helpers';
import type {Indicator} from 'store/widgets/data/types';
import IndicatorFieldset from 'DiagramWidgetEditForm/components/IndicatorFieldset';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import SortableList from 'DiagramWidgetEditForm/components/SortableList';
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
		const {dataSet, setDataFieldValue} = this.props;
		const {indicators} = dataSet;
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

	renderFieldset = (indicator: Indicator, index: number, indicators: Array<Indicator>) => {
		const {dataSet, errors, index: dataSetIndex} = this.props;
		const removable = indicators.length > 1;
		const errorKey = getDataErrorKey(dataSetIndex, FIELDS.indicators, index);
		const {dataKey, source} = dataSet;

		return (
			<IndicatorFieldset
				dataKey={dataKey}
				dataSetIndex={dataSetIndex}
				error={errors[errorKey]}
				index={index}
				key={index}
				onChange={this.handleChange}
				onRemove={this.handleRemove}
				removable={removable}
				source={source}
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
