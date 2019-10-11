// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {
	AttrSelectProps,
	InputProps,
	LabelProps,
	RenderFunction,
	SelectProps,
	SelectValue
} from 'components/organisms/WidgetFormPanel/types';
import {CHART_SELECTS} from 'utils/chart';
import {createOrderName} from 'utils/widget';
import Cross from 'icons/form/cross.svg';
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import {Divider} from 'components/atoms/Divider/Divider';
import {FIELDS, styles, VALUES} from 'components/organisms/WidgetFormPanel';
import {getAggregateOptions} from 'utils/aggregate';
import {getGroupOptions} from 'utils/group';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class ComboChart extends DataFormBuilder {
	componentDidMount () {
		const {setFieldValue, values} = this.props;

		if (!values[FIELDS.order]) {
			setFieldValue(FIELDS.order, VALUES.ORDER);
		}
	}

	getBaseName = (name: string) => name.split('_').shift();

	getYAxisLabel = (a: Attribute) => `${a.title} (${a.sourceName})`;

	getOrder = () => this.props.values.order || VALUES.ORDER;

	addSet = () => {
		const {setFieldValue, values} = this.props;
		const {order} = values;
		const nextNumber = order[order.length - 1] + 1;

		setFieldValue(FIELDS.order, [...order, nextNumber]);
	};

	removeSet = (e: SyntheticMouseEvent<HTMLImageElement>) => {
		const name = e.currentTarget.dataset.name;
		const number = this.getNumberFromName(name);
		const {setFieldValue, values} = this.props;
		const {order} = values;

		if (order.length > 2) {
			setFieldValue(FIELDS.order, order.filter(n => n !== number));

			[FIELDS.source, FIELDS.xAxis, FIELDS.yAxis, FIELDS.group, FIELDS.aggregation, FIELDS.breakdown, FIELDS.chart]
				.map(createOrderName(number)).forEach(name => {
				setFieldValue(name, null);
			});
		}
	};

	setMainValue = (...names: Array<string>) => {
		const {setFieldValue, values} = this.props;
		const mainNumber = this.getOrder()[0];

		names.forEach(name => {
			const mainProperty = values[createOrderName(mainNumber)(this.getBaseName(name))];
			const currentProperty = values[name];
			const currentIsNotMain = !currentProperty
				|| mainProperty.value !== currentProperty.value
				|| mainProperty.code !== currentProperty.code;

			if (mainProperty && currentIsNotMain) {
				setFieldValue(name, mainProperty);
			}
		});
	};

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

	handleSelectComboSource = async (name: string, source: SelectValue) => {
		const number = this.getNumberFromName(name);

		await this.handleSelectSource(name, source);
		this.changeDependingOnMain(number);
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

	renderByOrder = (renderFunction: RenderFunction, ...names: Array<string>) => {
		return this.getOrder().map(num => renderFunction(...names.map(createOrderName(num))));
	};

	renderYAxisInput = (name: string = FIELDS.yAxis) => {
		const {attributes, values} = this.props;
		const order = this.getOrder();
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

		const yAxis: AttrSelectProps = {
			getOptionLabel: this.getYAxisLabel,
			handleSelect: this.handleSelectAxis(FIELDS.aggregation, getAggregateOptions),
			name: name,
			options,
			placeholder: 'Ось Y',
			value: values[name]
		};

		return this.renderAttrSelect(yAxis);
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
						? a.property === mainXAxis.property
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

	renderSourceWithRemove = (source: string) => {
		const {order} = this.props.values;
		const deletable = order && order.length > 2;

		const sourceProps: InputProps = {
			onChange: this.handleSelectComboSource
		};

		return (
			<div className={styles.positionRelative} key={source}>
				{deletable && <Cross data-name={source} onClick={this.removeSet} className={styles.deleteSourceIcon}/>}
				{this.renderSourceInput(source, sourceProps)}
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
				{this.renderLabel(sourceLabel)}
				{this.renderByOrder(this.renderSourceWithRemove, source)}
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
