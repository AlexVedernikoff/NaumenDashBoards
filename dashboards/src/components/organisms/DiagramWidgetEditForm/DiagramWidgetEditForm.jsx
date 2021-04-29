// @flow
import AxisChartForm from './components/AxisChartForm';
import CircleChartForm from './components/CircleChartForm';
import ComboChartForm from './components/ComboChartForm';
import type {DivRef} from 'components/types';
import Form from './components/Form';
import {FormContext} from './withForm';
import type {Props} from 'containers/DiagramWidgetEditForm/types';
import React, {Component, createRef} from 'react';
import type {RenderFormProps} from './types';
import SpeedometerForm from './components/SpeedometerForm';
import SummaryForm from './components/SummaryForm';
import TableForm from './components/TableForm';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export const formRef: DivRef = createRef();

export class DiagramWidgetEditForm extends Component<Props> {
	componentDidMount () {
		const {setForm} = this.props;
		const {current: form} = formRef;

		form && setForm(form);
	}

	getContextValue = () => {
		const {
			attributes,
			dynamicGroups,
			errors,
			fetchAttributes,
			fetchDynamicAttributeGroups,
			fetchDynamicAttributes,
			fetchLinkedDataSources,
			fetchRefAttributes,
			linkedSources,
			onAddFieldErrorRef,
			refAttributes,
			setDataFieldValue,
			setFieldValue,
			sources,
			values
		} = this.props;

		return {
			attributes,
			dynamicGroups,
			errors,
			fetchAttributes,
			fetchDynamicAttributeGroups,
			fetchDynamicAttributes,
			fetchLinkedDataSources,
			fetchRefAttributes,
			linkedSources,
			onAddFieldErrorRef,
			refAttributes,
			setDataFieldValue,
			setFieldValue,
			sources,
			values
		};
	};

	resolveForm = () => {
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

	renderForm = (props: RenderFormProps) => <Form forwardedRef={formRef} {...props} {...this.props} />;

	render () {
		const {layoutMode, values} = this.props;
		const Form = this.resolveForm();

		return (
			<FormContext.Provider value={this.getContextValue()}>
				<Form layoutMode={layoutMode} render={this.renderForm} values={values} />
			</FormContext.Provider>
		);
	}
}

export default DiagramWidgetEditForm;
