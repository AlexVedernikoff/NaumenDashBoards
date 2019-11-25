// @flow
import {createOrderName, getNumberFromName, WIDGET_VARIANTS} from 'utils/widget';
import DataFormBuilder from 'components/organisms/WidgetFormPanel/Builders/DataFormBuilder';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import type {LabelProps} from 'components/organisms/WidgetFormPanel/Builders/FormBuilder/types';
import type {OnSelectCallback} from 'components/organisms/WidgetFormPanel/Builders/DataFormBuilder/types';
import React from 'react';
import type {RenderFunction} from './types';
import styles from './styles.less';
import uuid from 'tiny-uuid';

export class OrderFormBuilder extends DataFormBuilder {
	// Порядок полей по умолчанию
	defaultOrder = [1];

	async componentDidMount () {
		const {SUMMARY, TABLE} = WIDGET_VARIANTS;
		const {setFieldValue, values} = this.props;
		const order = values[FIELDS.order];
		const type = values[FIELDS.type];

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

		this.setDefaultValues();
	}

	addSet = () => {
		const {setFieldValue, values} = this.props;
		const {order} = values;
		const nextNumber = order[order.length - 1] + 1;

		setFieldValue(FIELDS.order, [...order, nextNumber]);
		setFieldValue(createOrderName(nextNumber)(FIELDS.dataKey), uuid());
		setFieldValue(createOrderName(nextNumber)(FIELDS.sourceForCompute), true);
	};

	getBaseName = (name: string) => name.split('_').shift();

	getOrder = () => this.props.values.order || this.defaultOrder;

	removeSet = (e: SyntheticMouseEvent<HTMLImageElement>) => {
		const name = e.currentTarget.dataset.name;
		const number = getNumberFromName(name);
		const {setFieldValue, values} = this.props;
		const {order} = values;

		if (order.length > this.defaultOrder.length) {
			setFieldValue(FIELDS.order, order.filter(n => n !== number));
		}
	};

	setDefaultValues = () => {
		const {setFieldValue, values} = this.props;
		const {descriptor, source} = FIELDS;
		const mainNumber = this.getOrder()[0];
		const createName = createOrderName(mainNumber);
		const mainSource = createName(source);

		if (!values[mainSource]) {
			setFieldValue(mainSource, values[source]);
			setFieldValue(createName(descriptor), values[descriptor]);
		}
	};

	setMainValue = (...names: Array<string>) => {
		const {setFieldValue, values} = this.props;
		const mainNumber = this.getOrder()[0];

		names.forEach(name => {
			const mainProperty = values[createOrderName(mainNumber)(this.getBaseName(name))];
			const currentProperty = values[name];
			const currentIsNotMain = !currentProperty
				|| mainProperty.code !== currentProperty.code
				|| mainProperty !== currentProperty;

			if (mainProperty && currentIsNotMain) {
				setFieldValue(name, mainProperty);
			}
		});
	};

	renderAddSourceInput = () => {
		const props: LabelProps = {
			icon: 'plus',
			name: 'Источник',
			onClick: this.addSet
		};

		return this.renderLabelWithIcon(props);
	};

	renderByOrder = (renderFunction: RenderFunction, names: Array<string> | string, accordingSource: boolean = false) => {
		const {values} = this.props;

		return this.getOrder().map(num => {
			const createName = createOrderName(num);
			const sourceForCompute = values[createName(FIELDS.sourceForCompute)];

			if (!accordingSource || (accordingSource && !sourceForCompute)) {
				const renderNames = Array.isArray(names) ? names.map(createName) : [createName(names)];
				return renderFunction(...renderNames);
			}
		});
	};

	renderComputeCheckbox = (source: string, withComputeHandler: boolean) => {
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

	renderOrderSource = (withComputeHandler: boolean, callback?: OnSelectCallback) => (source: string) => (
		<div key={source} className={styles.source}>
			{this.renderSource(source, callback)}
			{this.renderRemoveSourceButton(source)}
			{this.renderComputeCheckbox(source, withComputeHandler)}
		</div>
	);

	renderRemoveSourceButton = (source: string) => {
		const order = this.getOrder();

		if (order.length > this.defaultOrder.length && order[0] !== getNumberFromName(source)) {
			return (
				<button type="button" onClick={this.removeSet} data-name={source} className={styles.removeSourceButton}>
					удалить
				</button>
			);
		}
	}
}

export default OrderFormBuilder;
