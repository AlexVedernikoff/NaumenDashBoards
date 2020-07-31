// @flow
import {AxisChartForm, CircleChartForm, ComboChartForm, Form, SpeedometerForm, SummaryForm, TableForm} from './components';
import cn from 'classnames';
import type {DivRef} from 'components/types';
import {isLegacyBrowser} from 'utils/export/helpers';
import type {Props, RenderFormProps, State} from './types';
import React, {Component, createContext, createRef} from 'react';
import styles from './styles.less';
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
			values
		};
	};

	resolve = () => {
		const {type} = this.props.values;
		const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE, SPEEDOMETER, SUMMARY, TABLE} = WIDGET_TYPES;

		switch (type) {
			case BAR:
			case BAR_STACKED:
			case COLUMN:
			case COLUMN_STACKED:
			case LINE:
				return AxisChartForm;
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
		}
	};

	renderForm = (props: RenderFormProps) => <Form {...this.props} {...props} />;

	renderTypedForm = () => {
		const TypedWidgetForm = this.resolve();
		const {current: container} = formRef;

		if (TypedWidgetForm && container) {
			return (
				<FormContext.Provider value={this.getContextValue()}>
					<TypedWidgetForm render={this.renderForm} />
				</FormContext.Provider>
			);
		}
	};

	render () {
		this.fieldErrorRefs = [];
		const formCN = cn({
			[styles.form]: true,
			[styles.ieForm]: isLegacyBrowser(false)
		});

		return (
			<div className={formCN} ref={formRef}>
				{this.renderTypedForm()}
			</div>
		);
	}
}

export default WidgetFormPanel;
