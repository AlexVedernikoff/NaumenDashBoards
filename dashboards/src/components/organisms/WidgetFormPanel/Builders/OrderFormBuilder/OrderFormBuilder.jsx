// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {COMPUTED_ATTR} from 'components/organisms/WidgetFormPanel/Modals/ComputeAttrCreator/constants';
import {createOrderName, getNumberFromName, WIDGET_VARIANTS} from 'utils/widget';
import DataFormBuilder from 'components/organisms/WidgetFormPanel/Builders/DataFormBuilder';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import type {LabelProps} from 'components/organisms/WidgetFormPanel/Builders/FormBuilder/types';
import React from 'react';
import type {RenderFunction} from './types';
import uuid from 'tiny-uuid';

export class OrderFormBuilder extends DataFormBuilder {
	defaultOrder = [1, 2];

	async componentDidMount () {
		const {TABLE, SUMMARY} = WIDGET_VARIANTS;
		const {setFieldValue, values} = this.props;
		const order = values[FIELDS.order];
		const type = values[FIELDS.type].value;

		if (!Array.isArray(order)) {
			this.defaultOrder.forEach(num => {
				setFieldValue(createOrderName(num)(FIELDS.dataKey), uuid());
			});

			await setFieldValue(FIELDS.order, this.defaultOrder);
		} else if (order.length < this.defaultOrder.length) {
			let diff = this.defaultOrder.length - order.length;

			while (diff > 0) {
				this.addSet();
				diff--;
			}
		} else if (type === TABLE || type === SUMMARY) {
			const additionalNumbers = order.slice(1);

			additionalNumbers.forEach(num => {
				setFieldValue(createOrderName(num)(FIELDS.sourceForCompute), true);
			});
		}
	}

	getLabelWithSource = (a: Attribute) => a.type !== COMPUTED_ATTR ? `${a.title} (${a.sourceName})` : a.title;

	getBaseName = (name: string) => name.split('_').shift();

	getOrder = () => this.props.values.order || this.defaultOrder;

	addSet = () => {
		const {setFieldValue, values} = this.props;
		const {order} = values;
		const nextNumber = order[order.length - 1] + 1;

		setFieldValue(FIELDS.order, [...order, nextNumber]);
		setFieldValue(createOrderName(nextNumber)(FIELDS.dataKey), uuid());
		setFieldValue(createOrderName(nextNumber)(FIELDS.sourceForCompute), true);
	};

	removeSet = (e: SyntheticMouseEvent<HTMLImageElement>) => {
		const name = e.currentTarget.dataset.name;
		const number = getNumberFromName(name);
		const {setFieldValue, values} = this.props;
		const {order} = values;

		if (order.length > this.defaultOrder.length) {
			setFieldValue(FIELDS.order, order.filter(n => n !== number));
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

	renderByOrder = (renderFunction: RenderFunction, names: Array<string> | string, accordingSource: boolean = false) => {
		const {values} = this.props;

		return this.getOrder().map(num => {
			const sourceForCompute = values[createOrderName(num)(FIELDS.sourceForCompute)];

			if (!accordingSource || (accordingSource && !sourceForCompute)) {
				const renderNames = Array.isArray(names) ? names.map(createOrderName(num)) : [createOrderName(num)(names)];
				return renderFunction(...renderNames);
			}
		});
	};

	renderAddSourceInput = () => {
		const props: LabelProps = {
			icon: 'plus',
			name: 'Источник',
			onClick: this.addSet
		};

		return this.renderLabel(props);
	};

	renderSourceComputeHandler = (source: string, withComputeHandler: boolean) => {
		const order = this.getOrder();
		const name = this.createRefName(source, FIELDS.sourceForCompute);
		const isNotFirst = getNumberFromName(source) !== order[0];
		const {[name]: value} = this.props.values;

		if (isNotFirst && withComputeHandler) {
			const props = {
				label: 'Только для вычислений',
				name,
				value
			};

			return this.renderCheckBox(props);
		}
	};

	renderOrderSource = (withComputeHandler: boolean) => (source: string) => (
		<div key={source}>
			{this.renderSourceInput(source)}
			{this.renderSourceComputeHandler(source, withComputeHandler)}
		</div>
	);
}

export default OrderFormBuilder;
