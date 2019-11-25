// @flow
import {createOrderName, getNumberFromName} from 'utils/widget';
import {FIELDS, getAggregateOptions, getGroupOptions, OPTIONS, styles as mainStyles, TYPES} from 'components/organisms/WidgetFormPanel';
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

	changeRefFields = () => this.getOrder().forEach(this.changeDependingOnMain);

	changeSourceRefs = (name: string) => this.changeDependingOnMain(getNumberFromName(name));

	handleSelectComboGroup = async (name: string, group: SelectValue) => {
		const order = this.getOrder();
		await this.handleSelect(name, group);

		if (getNumberFromName(name) === order[0]) {
			this.changeRefFields();
		}
	};

	renderYAxisInput = (yAxis: string, aggregationName: string) => {
		const {values} = this.props;

		const props = {
			name: yAxis,
			onSelect: this.handleSelectWithRef(aggregationName, getAggregateOptions),
			placeholder: 'Ось Y',
			refInput: this.renderAggregation(aggregationName, yAxis),
			value: values[yAxis],
			withCreate: true
		};

		return this.renderAttribute(props);
	};

	renderChartInput = (name: string = FIELDS.type) => {
		const {values} = this.props;

		const chart = {
			name: name,
			options: OPTIONS.CHARTS,
			showCaret: false,
			tip: 'Тип графика',
			value: values[name]
		};

		return (
			<div className={mainStyles.field}>
				<div className={styles.chartInputContainer}>
					<div className={styles.chartInput}>
						{this.renderMiniSelect(chart)}
					</div>
					<div>Ось Y</div>
				</div>
			</div>
		);
	};

	renderComboXAxis = (xAxisName: string, groupName: string) => {
		const {values} = this.props;
		const mainNumber = this.getOrder()[0];
		const mainSource = values[createOrderName(mainNumber)(FIELDS.source)];
		const currentNumber = getNumberFromName(xAxisName);
		const currentSource = values[createOrderName(currentNumber)(FIELDS.source)];
		const currentXAxis = values[xAxisName];
		let onSelectCallback;

		if (mainSource === currentSource) {
			onSelectCallback = this.changeRefFields;
		}

		const props = {
			isDisabled: false,
			name: xAxisName,
			onSelect: this.handleSelectWithRef(groupName, getGroupOptions),
			onSelectCallback,
			options: undefined,
			refInput: undefined,
			value: currentXAxis
		};

		const groupMixin = {
			isDisabled: false,
			onSelect: this.handleSelectComboGroup
		};

		if (mainNumber !== currentNumber && mainSource && currentSource) {
			if (mainSource.value === currentSource.value) {
				props.isDisabled = true;
			} else {
				const mainXAxis = values[createOrderName(mainNumber)(FIELDS.xAxis)];
				let xAxisOptions = this.getAttributeOptions(xAxisName);

				if (xAxisOptions.length > 0 && mainXAxis) {
					const {DATE, OBJECT} = TYPES;

					xAxisOptions = xAxisOptions.filter(a => {
						if (OBJECT.includes(mainXAxis.type)) {
							return a.property === mainXAxis.property;
						}

						if (DATE.includes(mainXAxis.type)) {
							return DATE.includes(a.type);
						}

						return false;
					});
				}

				props.options = xAxisOptions;
			}

			groupMixin.isDisabled = true;
		}

		props.refInput = this.renderGroup(groupName, xAxisName, groupMixin);

		return this.renderAttribute(props);
	};

	renderComboYAxis = (yAxis: string, chart: string, aggregation: string, withBreakdown: string, breakdown: string, breakdownGroup: string) => {
		return (
			<div key={yAxis}>
				{this.renderChartInput(chart)}
				{this.renderYAxisInput(yAxis, aggregation)}
				{this.renderBreakdownWithExtend(withBreakdown, breakdown, breakdownGroup)}
			</div>
		);
	};

	renderInputs = () => {
		const {aggregation, breakdown, breakdownGroup, group, source, type, xAxis, yAxis, withBreakdown} = FIELDS;

		return (
			<Fragment>
				{this.renderModal()}
				{this.renderAddSourceInput()}
				{this.renderByOrder(this.renderOrderSource(true, this.changeSourceRefs), source)}
				{this.renderLabel('Ось Х')}
				{this.renderByOrder(this.renderComboXAxis, [xAxis, group])}
				{this.renderByOrder(this.renderComboYAxis, [yAxis, type, aggregation, withBreakdown, breakdown, breakdownGroup], true)}
			</Fragment>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(ComboChart);
