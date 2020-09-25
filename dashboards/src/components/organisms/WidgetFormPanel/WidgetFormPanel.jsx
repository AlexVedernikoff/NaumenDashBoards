// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {AxisChartForm, CircleChartForm, ComboChartForm, Form, SpeedometerForm, SummaryForm, TableForm} from './components';
import type {ComputedAttr, Group} from 'store/widgets/data/types';
import {createRefKey} from 'store/sources/refAttributes/actions';
import type {DivRef} from 'components/types';
import {FIELDS} from './constants';
import type {OnSelectAttributeEvent, Props, RenderFormProps, State} from './types';
import React, {Component, createContext, createRef} from 'react';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export const formRef: DivRef = createRef();
export const FormContext: React$Context<Object> = createContext({});

export class WidgetFormPanel extends Component<Props, State> {
	state: {
		// $FlowFixMe
		rendered: false
	};

	changeAttributeTitle = (currentValue: Attribute, parent: Attribute | null, title: string) => {
		let value = currentValue;

		if (parent) {
			value = {
				...parent,
				ref: {
					...parent.ref,
					title
				}
			};
		} else {
			value = {
				...currentValue,
				title
			};
		}

		return value;
	};

	getContextValue = () => {
		const {
			addFieldErrorRef,
			attributes,
			dynamicGroups,
			errors,
			fetchAttributes,
			fetchDynamicAttributeGroups,
			fetchDynamicAttributes,
			fetchLinkedDataSources,
			fetchRefAttributes,
			linkedSources,
			refAttributes,
			setDataFieldValue,
			setFieldValue,
			sources,
			values
		} = this.props;

		return {
			addFieldErrorRef,
			attributes,
			changeAttributeTitle: this.changeAttributeTitle,
			dynamicGroups,
			errors,
			fetchAttributes: fetchAttributes,
			fetchDynamicAttributeGroups,
			fetchDynamicAttributes,
			fetchLinkedDataSources,
			fetchRefAttributes: fetchRefAttributes,
			handleChangeGroup: this.handleChangeGroup,
			linkedSources,
			refAttributes,
			removeComputedAttribute: this.removeComputedAttribute,
			saveComputedAttribute: this.saveComputedAttribute,
			setDataFieldValue,
			setFieldValue,
			sources,
			transformAttribute: this.transformAttribute,
			values
		};
	};

	getTitleAttribute = (attributes: Array<Attribute>) => {
		return attributes.find(attribute => attribute.code === 'title') || null;
	};

	handleChangeGroup = (index: number, name: string, value: Group, field: Object) => {
		const {setDataFieldValue} = this.props;
		const {name: fieldName, parent, value: attribute} = field;

		setDataFieldValue(index, fieldName, this.changeAttributeTitle(attribute, parent, attribute.title));
		setDataFieldValue(index, name, value);
	};

	onLoadRefAttributes = (event: OnSelectAttributeEvent, callback: Function, ...rest: Array<any>) =>
		(refAttributes: Array<Attribute>) => {
			event.value = {...event.value, ref: this.getTitleAttribute(refAttributes)};
			callback(event, ...rest);
		};

	removeComputedAttribute = (attribute: ComputedAttr) => {
		const {setFieldValue, values} = this.props;
		setFieldValue(FIELDS.computedAttrs, values.computedAttrs.filter(a => a.code !== attribute.code));
	};

	resolve = () => {
		const {type} = this.props.values;
		const {COMBO, DONUT, PIE, SPEEDOMETER, SUMMARY, TABLE} = WIDGET_TYPES;

		switch (type) {
			case COMBO:
				return ComboChartForm;
			case DONUT:
			case PIE:
				return CircleChartForm;
			case SPEEDOMETER:
				return SpeedometerForm;
			case SUMMARY:
				return SummaryForm;
			case TABLE:
				return TableForm;
			default:
				return AxisChartForm;
		}
	};

	saveComputedAttribute = (attribute: ComputedAttr) => {
		const {setFieldValue, values} = this.props;
		const {computedAttrs} = values;
		const attrIndex = computedAttrs.findIndex(attr => attr.code === attribute.code);

		if (attrIndex !== -1) {
			computedAttrs[attrIndex] = attribute;
		} else {
			computedAttrs.push(attribute);
		}

		setFieldValue(FIELDS.computedAttrs, computedAttrs);
	};

	transformAttribute = (event: OnSelectAttributeEvent, callback: Function, ...rest: Array<any>) => {
		const {fetchRefAttributes, refAttributes} = this.props;
		let {parent, value} = event;

		if (parent) {
			value = {
				...parent,
				ref: value
			};

			parent = null;
		}

		if (value && value.type in ATTRIBUTE_SETS.REF && !value.ref) {
			const key = createRefKey(value);

			if (refAttributes[key]) {
				value = {
					...value,
					ref: this.getTitleAttribute(refAttributes[key].options)
				};
			} else {
				const callbackEvent = {...event, parent, value};
				fetchRefAttributes(value, this.onLoadRefAttributes(callbackEvent, callback, ...rest));
			}
		}

		return value;
	};

	renderForm = (props: RenderFormProps) => <Form forwardedRef={formRef} {...this.props} {...props} />;

	renderTypedForm = () => {
		const Form = this.resolve();

		return (
			<FormContext.Provider value={this.getContextValue()}>
				<Form render={this.renderForm} />
			</FormContext.Provider>
		);
	};

	render () {
		return this.renderTypedForm();
	}
}

export default WidgetFormPanel;
