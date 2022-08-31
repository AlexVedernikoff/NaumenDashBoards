// @flow
import {deepClone} from 'helpers';
import {DEFAULT_TOOLTIP_SETTINGS} from 'store/widgets/data/constants';
import {ERRORS_CONTEXT} from './HOCs/withErrors/constants';
import memoize from 'memoize-one';
import type {Props, State} from './types';
import React, {Component} from 'react';
import type {Ref} from 'components/types';
import SubscribeManager, {SUBSCRIBE_COMMANDS} from './HOCs/withSubscriptions/SubscribeManager';
import {VALUES_CONTEXT} from './HOCs/withValues/constants';

class WidgetForm extends Component<Props, State> {
	static defaultProps = {
		validate: () => null
	};

	emitterRef = {
		emit: null
	};

	errorFocusRef: Ref<'div'> | null = null;

	state = {
		errors: {},
		submitted: false,
		values: this.props.initialValues
	};

	getErrorsContext = memoize(errors => ({
		errors,
		setErrorFocusRef: this.setErrorFocusRef
	}));

	getValuesContext = memoize(values => ({
		setFieldValue: this.setFieldValue,
		values
	}));

	componentDidUpdate (prevProps: Props, prevState: State) {
		const {onChange} = this.props;
		const {submitted, values} = this.state;

		if (prevState.values !== values) {
			submitted && this.validate();
			onChange(values);
		}

		this.focusOnFirstError();
	}

	focusOnFirstError = () => {
		const {errors, submitted} = this.state;
		const field = this.errorFocusRef?.current;

		if (field && submitted && Object.keys(errors).length > 1) {
			field.scrollIntoView({behavior: 'smooth'});
		}
	};

	handleSubmit = async () => {
		const {onSubmit} = this.props;

		await this.normalizeValues();
		await this.emitterRef.emit?.(SUBSCRIBE_COMMANDS.FORCE_SAVE);

		const {values} = this.state;

		this.setState({submitted: true});
		await this.validate() && onSubmit(values);
	};

	normalizeValues = (): Promise<void> => new Promise(resolve => {
		const {values} = this.state;
		const newValues = deepClone(values);
		const {data, tooltip} = newValues;
		let changed = false;

		if (tooltip && tooltip.show && tooltip.text === '' && tooltip.title === '') {
			newValues.tooltip = {...DEFAULT_TOOLTIP_SETTINGS};
			changed = true;
		}

		if (data) {
			data.forEach(({indicators}) => {
				indicators && indicators.forEach(indicator => {
					const {tooltip} = indicator;

					if (tooltip && tooltip.show && tooltip.title === '') {
						indicator.tooltip = {...DEFAULT_TOOLTIP_SETTINGS};
						changed = true;
					}
				});
			});
		}

		if (changed) {
			this.setState({values: newValues}, resolve);
		} else {
			resolve();
		}
	});

	setErrorFocusRef = (ref: Ref<'div'>) => {
		if (!this.errorFocusRef) this.errorFocusRef = ref;
	};

	setFieldValue = (name: string, value: any, callback?: Function) => this.setState(({values: prevValues}) => ({
		values: {
			...prevValues,
			[name]: value
		}
	}), callback);

	validate = async (): Promise<boolean> => {
		const {validate} = this.props;
		const {errors: prevErrors, values} = this.state;
		const errors = await validate(values) || prevErrors;

		this.setState({errors});

		return Object.keys(errors).length === 0;
	};

	render () {
		const {onCancel, render, submitting} = this.props;
		const {errors, values} = this.state;
		const props = {
			errors,
			handleCancel: onCancel,
			handleSubmit: this.handleSubmit,
			setFieldValue: this.setFieldValue,
			submitting,
			values
		};

		this.errorFocusRef = null;

		return (
			<SubscribeManager emitterRef={this.emitterRef}>
				<VALUES_CONTEXT.Provider value={this.getValuesContext(values)}>
					<ERRORS_CONTEXT.Provider value={this.getErrorsContext(errors)}>
						{render(props)}
					</ERRORS_CONTEXT.Provider>
				</VALUES_CONTEXT.Provider>
			</SubscribeManager>
		);
	}
}

export default WidgetForm;
