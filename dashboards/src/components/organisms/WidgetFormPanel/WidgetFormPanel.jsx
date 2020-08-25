// @flow
import {AxisChartForm, CircleChartForm, ComboChartForm, Form, SpeedometerForm, SummaryForm, TableForm} from './components';
import type {DivRef} from 'components/types';
import type {Props, RenderFormProps, State} from './types';
import React, {Component, createContext, createRef} from 'react';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export const formRef: DivRef = createRef();
export const FormContext: React$Context<Object> = createContext({});

export class WidgetFormPanel extends Component<Props, State> {
	fieldErrorRefs = [];
	state: {
		// $FlowFixMe
		rendered: false
	};

	componentDidMount (): * {
		this.setState({rendered: true});
	}

	componentDidUpdate () {
		this.focusOnError();
	}

	addFieldErrorRef = (ref: DivRef) => this.fieldErrorRefs.push(ref);

	focusOnError = () => {
		const {current: form} = formRef;

		if (this.fieldErrorRefs.length > 0 && form) {
			const offsets = this.fieldErrorRefs.map(({current}) => {
				let top = 0;

				if (current) {
					top = current.getBoundingClientRect().top;
				}

				return top;
			});
			const top = Math.min(...offsets) - form.getBoundingClientRect().top;

			form.scrollTo({behavior: 'smooth', top: Math.max(top, 0)});
		}
	};

	getContextValue = () => {
		const {
			attributes,
			dynamicGroups,
			fetchAttributes,
			fetchDynamicAttributeGroups,
			fetchDynamicAttributes,
			fetchRefAttributes,
			refAttributes,
			sources,
			values
		} = this.props;

		return {
			addFieldErrorRef: this.addFieldErrorRef,
			attributes,
			dynamicGroups,
			fetchAttributes: fetchAttributes,
			fetchDynamicAttributeGroups,
			fetchDynamicAttributes,
			fetchRefAttributes: fetchRefAttributes,
			refAttributes,
			sources,
			values
		};
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
		this.fieldErrorRefs = [];
		return this.renderTypedForm();
	}
}

export default WidgetFormPanel;
