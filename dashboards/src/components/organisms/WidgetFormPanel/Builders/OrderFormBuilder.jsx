// @flow
import {Button} from 'components/atoms';
import {components} from 'react-select';
import ComputeAttrCreator from 'components/organisms/WidgetFormPanel/Modals/ComputeAttrCreator';
import type {ComputedAttr} from 'components/organisms/WidgetFormPanel/Modals/ComputeAttrCreator/types';
import {createOrderName} from 'utils/widget';
import Cross from 'icons/form/cross.svg';
import DataFormBuilder from './DataFormBuilder';
import {FIELDS, styles, VALUES} from 'components/organisms/WidgetFormPanel';
import type {OrderAttrSelectProps, RenderFunction} from 'components/organisms/WidgetFormPanel/types';
import React, {Fragment} from 'react';

export class OrderFormBuilder extends DataFormBuilder {
	state = {
		showModal: false
	};

	componentDidMount () {
		const {setFieldValue, values} = this.props;

		if (!values[FIELDS.order]) {
			setFieldValue(FIELDS.order, VALUES.ORDER);
		}
	}

	handleShowModal = (showModal: boolean) => () => this.setState({showModal});

	handleCreateAttr = (attr: ComputedAttr) => {
		const {setFieldValue, values} = this.props;
		let computedAttrs = values[FIELDS.computedAttrs];
		computedAttrs = Array.isArray(computedAttrs) ? [attr, ...computedAttrs] : [attr];

		setFieldValue(FIELDS.computedAttrs, computedAttrs);
		this.handleShowModal(false)();
	};

	getBaseName = (name: string) => name.split('_').shift();

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

	renderByOrder = (renderFunction: RenderFunction, ...names: Array<string>) => {
		return this.getOrder().map(num => renderFunction(...names.map(createOrderName(num))));
	};

	renderOrderSource = (source: string) => {
		const {order} = this.props.values;
		const deletable = order && order.length > 2;

		return (
			<div className={styles.positionRelative} key={source}>
				{deletable && <Cross data-name={source} onClick={this.removeSet} className={styles.deleteSourceIcon} />}
				{this.renderSourceInput(source)}
			</div>
		);
	};

	renderModal = () => {
		const {showModal} = this.state;

		if (showModal) {
			return <ComputeAttrCreator onSubmit={this.handleCreateAttr} onClose={this.handleShowModal(false)} />;
		}
	};

	renderAttrListWithCreator = (props: any) => {
		return (
			<Fragment>
				<components.MenuList {...props}>
					<Button className="m-1" onClick={this.handleShowModal(true)}>Создать поле</Button>
					{props.children}
				</components.MenuList>
			</Fragment>
		);
	};

	renderAttrSelectWithCreator = (props: OrderAttrSelectProps) => {
		const {computedAttrs} = this.props.values;

		if (props.withCreate) {
			const MenuList = this.renderAttrListWithCreator;
			props.components = {MenuList};

			if (Array.isArray(computedAttrs)) {
				props.options = [...computedAttrs, ...props.options];
			}
		}

		return this.renderAttrSelect(props);
	};
}

export default OrderFormBuilder;
