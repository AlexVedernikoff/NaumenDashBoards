// @flow
import {AxisFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import Cross from 'icons/form/cross.svg';
import {FIELDS, styles} from 'components/organisms/WidgetFormPanel';
import React, {Fragment} from 'react';
import type {RenderFunction} from 'components/organisms/WidgetFormPanel/types';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

const defaultOrder = [1, 2];

export class AxisChart extends AxisFormBuilder {
	componentDidMount () {
		const {setFieldValue, values} = this.props;

		if (!values.orderFields) {
			setFieldValue(FIELDS.order, defaultOrder);
		}
	}

	addSet = () => {
		const {setFieldValue, values} = this.props;
		const {order} = values;

		setFieldValue(FIELDS.order, [...order, order[order.length - 1] + 1]);
	};

	createName = (num: number) => (name: string) => `${name}_${num}`;

	removeSet = (e: SyntheticMouseEvent<HTMLImageElement>) => {
		const name = e.currentTarget.dataset.name;
		const number = this.getNumberFromName(name);
		const {setFieldValue, values} = this.props;
		const {order} = values;

		if (order.length > 2) {
			setFieldValue(FIELDS.order, order.filter(n => n !== number));

			Object.keys(FIELDS).map(this.createName(number)).forEach(name => {
				setFieldValue(name, null);
			});
		}
	};

	renderByOrder = (renderFunction: RenderFunction, ...names: Array<string>) => {
		const {values} = this.props;
		const order = values.order || defaultOrder;

		return order.map(num => renderFunction(...names.map(this.createName(num))));
	};

	renderComboXAxis = (xAxis: string, group: string) => {
		return (
			<div key={xAxis}>
				{this.renderXAxisInput(xAxis)}
				{this.renderGroupInput(group, xAxis)}
			</div>
		);
	};

	renderComboYAxis = (yAxis: string, chart: string) => {
		const label = {
			name: 'Ось Y'
		};

		return (
			<div key={yAxis}>
				{this.renderLabel(label)}
				{this.renderYAxisInput(yAxis)}
				{this.renderChartInput(chart)}
			</div>
		);
	};

	renderSourceWithRemove = (source: string) => {
		const {order} = this.props.values;
		const isShownDeleteIcon = order && order.length > 2;

		return (
			<div className={styles.positionRelative} key={source}>
				{isShownDeleteIcon && <Cross data-name={source} onClick={this.removeSet} className={styles.deleteSourceIcon} />}
				{this.renderSourceInput(source)}
			</div>
		);
	};

	renderInputs = () => {
		const {chart, group, source, xAxis, yAxis} = FIELDS;

		const sourceLabel = {
			icon: 'plus',
			name: 'Источник',
			onClick: this.addSet
		};

		const xAxisLabel = {
			name: 'Ось Х'
		};

		return (
			<Fragment>
				{this.renderLabel(sourceLabel)}
				{this.renderByOrder(this.renderSourceWithRemove, source)}
				{this.renderLabel(xAxisLabel)}
				{this.renderByOrder(this.renderComboXAxis, xAxis, group)}
				{this.renderByOrder(this.renderComboYAxis, yAxis, chart)}
			</Fragment>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(AxisChart);
