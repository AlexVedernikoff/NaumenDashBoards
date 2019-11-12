// @flow
import {CHART_SELECTS} from 'utils/chart';
import {createOrderName, getNumberFromName} from 'utils/widget';
import {FIELDS, getAggregateOptions, getGroupOptions, TYPES} from 'components/organisms/WidgetFormPanel';
import {OrderFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import React, {Fragment} from 'react';
import type {SelectValue} from 'components/organisms/WidgetFormPanel/types';
import {styles} from 'components/organisms/WidgetFormPanel/Tabs/ParamsTab';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class ComboChart extends OrderFormBuilder {
	defaultOrder = [1, 2];
	sourceRefs = [FIELDS.breakdown, FIELDS.xAxis, FIELDS.yAxis];

	changeDependingOnMain = (number: number) => {
		const {setFieldValue, values} = this.props;
		const order = this.getOrder();
		const mainNumber = order[0];
		const mainSource = values[createOrderName(mainNumber)(FIELDS.source)];
		const currentSource = values[createOrderName(number)(FIELDS.source)];

		if (mainNumber !== number && mainSource && currentSource) {
			const xAxisName = createOrderName(number)(FIELDS.xAxis);
			const groupName = createOrderName(number)(FIELDS.group);
			const currentXAxis = values[xAxisName];

			if (mainSource.value === currentSource.value) {
				this.setMainValue(xAxisName, groupName);
			} else {
				const mainXAxis = values[createOrderName(mainNumber)(FIELDS.xAxis)];

				if (mainXAxis && currentXAxis && mainXAxis.type !== currentXAxis.type) {
					setFieldValue(xAxisName, null);
				}

				this.setMainValue(groupName);
			}
		}
	};

	handleSelectComboGroup = async (name: string, group: SelectValue) => {
		const order = this.getOrder();
		await this.handleSelect(name, group);

		if (getNumberFromName(name) === order[0]) {
			order.forEach(this.changeDependingOnMain);
		}
	};

	handleSelectComboXAxis = async (name: string, xAxis: SelectValue) => {
		const order = this.getOrder();
		await this.handleSelectWithRef(FIELDS.group, getGroupOptions)(name, xAxis);

		if (getNumberFromName(name) === order[0]) {
			order.forEach(this.changeDependingOnMain);
		}
	};

	handleSelectSource = async (name: string, source: SelectValue) => {
		await this.baseHandleSelectSource(name, source);

		this.changeDependingOnMain(getNumberFromName(name));
	};

	renderYAxisInput = (yAxis: string) => {
		const {values} = this.props;

		const props = {
			border: false,
			getOptionLabel: this.getLabelWithSource,
			onSelect: this.handleSelectWithRef(FIELDS.aggregation, getAggregateOptions),
			name: yAxis,
			placeholder: 'Ось Y',
			value: values[yAxis],
			withCreateButton: true
		};

		return this.renderAttrSelect(props);
	};

	renderChartInput = (name: string = FIELDS.type) => {
		const {values} = this.props;

		const chart = {
			defaultValue: CHART_SELECTS.AXIS_SELECTS[0],
			getOptionLabel: this.getIconLabel,
			name: name,
			options: CHART_SELECTS.AXIS_SELECTS,
			value: values[name]
		};

		return (
			<div className={styles.chartInputContainer}>
				<div className={styles.chartInput}>
					{this.renderSelect(chart)}
				</div>
				<div>Ось Y</div>
			</div>
		);
	};

	renderComboXAxis = (xAxis: string, group: string) => {
		const {values} = this.props;
		const mainNumber = this.getOrder()[0];
		const mainSource = values[createOrderName(mainNumber)(FIELDS.source)];
		const currentNumber = getNumberFromName(xAxis);
		const currentSource = values[createOrderName(currentNumber)(FIELDS.source)];
		const currentXAxis = values[xAxis];

		const xAxisProps = {
			border: false,
			onSelect: this.handleSelectComboXAxis,
			isDisabled: false,
			name: xAxis,
			placeholder: 'Ось X',
			options: undefined,
			value: currentXAxis
		};

		const groupProps = {
			isDisabled: false,
			onSelect: this.handleSelectComboGroup
		};

		if (mainNumber !== currentNumber && mainSource && currentSource) {
			if (mainSource.value === currentSource.value) {
				xAxisProps.isDisabled = true;
			} else {
				const mainXAxis = values[createOrderName(mainNumber)(FIELDS.xAxis)];
				let xAxisOptions = this.getAttributeOptions(xAxis);

				if (xAxisOptions.length > 0 && mainXAxis) {
					const {DATE, OBJECT} = TYPES;

					xAxisOptions = xAxisOptions.filter(a => {
						if (OBJECT.includes(mainXAxis.type)) {
							return a.metaClassFqn === mainXAxis.metaClassFqn;
						}

						if (DATE.includes(mainXAxis.type)) {
							return DATE.includes(a.type);
						}

						return false;
					});
				}

				xAxisProps.options = xAxisOptions;
			}

			groupProps.isDisabled = true;
		}

		return (
			<div key={xAxis}>
				{this.combineInputs(
					this.renderGroupInput(group, xAxis, groupProps),
					this.renderAttrSelect(xAxisProps)
				)}
			</div>
		);
	};

	renderComboYAxis = (yAxis: string, chart: string, aggregation: string, breakdown: string, breakdownGroup: string) => {
		return (
			<div key={yAxis}>
				{this.renderChartInput(chart)}
				{this.combineInputs(
					this.renderAggregateInput(aggregation, yAxis),
					this.renderYAxisInput(yAxis)
				)}
				{this.renderBreakdownWithGroup(breakdownGroup, breakdown)}
			</div>
		);
	};

	renderInputs = () => {
		const {aggregation, breakdown, breakdownGroup, group, source, type, xAxis, yAxis} = FIELDS;

		const xAxisLabel = {
			name: 'Ось Х'
		};

		return (
			<Fragment>
				{this.renderModal()}
				{this.renderAddSourceInput()}
				{this.renderByOrder(this.renderOrderSource(true), source)}
				{this.renderLabel(xAxisLabel)}
				{this.renderByOrder(this.renderComboXAxis, [xAxis, group])}
				{this.renderByOrder(this.renderComboYAxis, [yAxis, type, aggregation, breakdown, breakdownGroup], true)}
			</Fragment>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(ComboChart);
