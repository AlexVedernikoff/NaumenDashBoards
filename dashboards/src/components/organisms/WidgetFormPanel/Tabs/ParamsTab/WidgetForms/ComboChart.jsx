// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {
	AttrSelectProps,
	InputProps,
	LabelProps,
	OrderAttrSelectProps,
	SelectProps,
	SelectValue
} from 'components/organisms/WidgetFormPanel/types';
import {CHART_SELECTS, CHART_VARIANTS} from 'utils/chart';
import {COMPUTED_ATTR} from 'components/organisms/WidgetFormPanel/Modals/ComputeAttrCreator/constants';
import {createOrderName} from 'utils/widget';
import {Divider} from 'components/atoms/Divider/Divider';
import {FIELDS, VALUES} from 'components/organisms/WidgetFormPanel';
import {getAggregateOptions} from 'utils/aggregate';
import {getGroupOptions} from 'utils/group';
import {OrderFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class ComboChart extends OrderFormBuilder {
	getYAxisLabel = (a: Attribute) => a.type !== COMPUTED_ATTR ? `${a.title} (${a.sourceName})` : a.title;

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

		if (this.getNumberFromName(name) === order[0]) {
			order.forEach(this.changeDependingOnMain);
		}
	};

	handleSelectComboXAxis = async (name: string, xAxis: SelectValue) => {
		const order = this.getOrder();
		await this.handleSelectAxis(FIELDS.group, getGroupOptions)(name, xAxis);

		if (this.getNumberFromName(name) === order[0]) {
			order.forEach(this.changeDependingOnMain);
		}
	};

	handleSelectSource = async (name: string, source: SelectValue) => {
		await this.baseHandleSelectSource(name, source);

		this.changeDependingOnMain(this.getNumberFromName(name));
	};

	renderYAxisInput = (yAxis: string = FIELDS.yAxis) => {
		const {attributes, values} = this.props;
		const {COLUMN, COLUMN_STACKED} = CHART_VARIANTS;
		const currentNumber = this.getNumberFromName(yAxis);
		const currentChart = values[createOrderName(currentNumber)(FIELDS.chart)];
		const order = this.getOrder();
		const withCreate = currentChart && (currentChart.value === COLUMN || currentChart.value === COLUMN_STACKED);
		const sources = {};
		let options = [];

		order.forEach(num => {
			let source = values[createOrderName(num)(FIELDS.source)];

			if (source) {
				sources[source.value] = source;
			}
		});

		Object.keys(sources).forEach(key => {
			if (attributes[key]) {
				options = [...options, ...attributes[key].data];
			}
		});

		const props: OrderAttrSelectProps = {
			getOptionLabel: this.getYAxisLabel,
			handleSelect: this.handleSelectAxis(FIELDS.aggregation, getAggregateOptions),
			name: yAxis,
			options,
			placeholder: 'Ось Y',
			value: values[yAxis],
			withCreate
		};

		return this.renderAttrSelectWithCreator(props);
	};

	renderChartInput = (name: string = FIELDS.chart) => {
		const {values} = this.props;

		const chart: SelectProps = {
			getOptionLabel: this.getLabelWithIcon,
			name: name,
			options: CHART_SELECTS.AXIS_SELECTS,
			placeholder: 'Выберите диаграмму',
			value: values[name]
		};

		return this.renderSelect(chart);
	};

	renderComboXAxis = (xAxis: string, group: string) => {
		const {values} = this.props;
		const mainNumber = this.getOrder()[0];
		const mainSource = values[createOrderName(mainNumber)(FIELDS.source)];
		const currentNumber = this.getNumberFromName(xAxis);
		const currentSource = values[createOrderName(currentNumber)(FIELDS.source)];
		const currentXAxis = values[xAxis];

		const xAxisProps: AttrSelectProps = {
			handleSelect: this.handleSelectComboXAxis,
			isDisabled: false,
			name: xAxis,
			placeholder: 'Ось X',
			options: undefined,
			value: currentXAxis
		};

		const groupProps: InputProps = {
			isDisabled: false,
			handleSelect: this.handleSelectComboGroup
		};

		if (mainNumber !== currentNumber && mainSource && currentSource) {
			if (mainSource.value === currentSource.value) {
				xAxisProps.isDisabled = true;
			} else {
				const mainXAxis = values[createOrderName(mainNumber)(FIELDS.xAxis)];
				let xAxisOptions = this.getAttributeOptions(xAxis);

				if (xAxisOptions.length > 0 && mainXAxis) {
					xAxisOptions = xAxisOptions.filter(a => VALUES.ATTR_TYPES.includes(mainXAxis.type)
						? a.metaClassFqn === mainXAxis.metaClassFqn
						: a.type === mainXAxis.type);
				}

				xAxisProps.options = xAxisOptions;
			}

			groupProps.isDisabled = true;
		}

		return (
			<div key={xAxis}>
				{this.renderAttrSelect(xAxisProps)}
				{this.renderGroupInput(group, xAxis, groupProps)}
			</div>
		);
	};

	renderComboYAxis = (yAxis: string, chart: string, aggregation: string, breakdown: string) => {
		const label: LabelProps = {
			name: 'Ось Y'
		};

		return (
			<div key={yAxis}>
				{this.renderLabel(label)}
				{this.renderYAxisInput(yAxis)}
				{this.renderChartInput(chart)}
				{this.renderAggregateInput(aggregation, yAxis)}
				{this.renderBreakdownInput(breakdown)}
			</div>
		);
	};

	renderInputs = () => {
		const {aggregation, breakdown, chart, group, source, xAxis, yAxis} = FIELDS;

		const sourceLabel: LabelProps = {
			icon: 'plus',
			name: 'Источник',
			onClick: this.addSet
		};

		const xAxisLabel: LabelProps = {
			name: 'Ось Х'
		};

		return (
			<Fragment>
				{this.renderModal()}
				{this.renderLabel(sourceLabel)}
				{this.renderByOrder(this.renderOrderSource, source)}
				<Divider />
				{this.renderLabel(xAxisLabel)}
				{this.renderByOrder(this.renderComboXAxis, xAxis, group)}
				<Divider />
				{this.renderByOrder(this.renderComboYAxis, yAxis, chart, aggregation, breakdown)}
			</Fragment>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(ComboChart);
