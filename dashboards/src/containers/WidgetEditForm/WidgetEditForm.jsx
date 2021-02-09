// @flow
import type {AnyWidget} from 'store/widgets/data/types';
import {connect} from 'react-redux';
import {deepClone} from 'helpers';
import DiagramWidgetEditForm from 'containers/DiagramWidgetEditForm';
import {DISPLAY_MODE, WIDGET_TYPES} from 'store/widgets/data/constants';
import type {DivRef} from 'components/types';
import {FIELDS} from './constants';
import type {FormElement, Props, Schema, State, Values} from './types';
import {functions, props} from './selectors';
import type {LayoutSize} from 'components/organisms/DiagramWidgetEditForm/types';
import NewWidget from 'store/widgets/data/NewWidget';
import React, {PureComponent} from 'react';
import {TextWidgetEditForm} from 'components/organisms';
import type {UpdateWidget} from 'containers/WidgetEditForm/types';

class WidgetEditForm extends PureComponent<Props, State> {
	form: FormElement | null = null;
	fieldErrorRefs = [];
	state = {
		errors: {},
		isSubmitting: false,
		schema: null,
		values: this.getValues(this.props.widget)
	};

	getValues (widget: AnyWidget): Values {
		const {id, ...values} = widget;
		return deepClone(values);
	}

	componentDidCatch (e: Error) {
		const {cancelForm, createToast} = this.props;
		console.error(e);

		createToast({
			text: 'Ошибка формы редактирования',
			type: 'error'
		});
		cancelForm();
	}

	focusOnError = () => {
		if (this.form !== null && this.fieldErrorRefs.length > 0) {
			const offsets = this.fieldErrorRefs.map(({current}) => {
				let top = 0;

				if (current) {
					top = current.getBoundingClientRect().top;
				}

				return top;
			});
			// $FlowFixMe
			const top = Math.min(...offsets) - this.form.getBoundingClientRect().top;
			// $FlowFixMe
			this.form.scrollTo({behavior: 'smooth', top: Math.max(top, 0)});
		}
	};

	handleAddFieldErrorRef = (ref: DivRef) => {
		this.fieldErrorRefs.push(ref);
	};

	handleChangeLayoutSize = (layoutSize: LayoutSize) => {
		const {changeLayout, layoutMode, widget} = this.props;
		const payload = {
			layout: {
				...layoutSize,
				i: widget.id
			},
			layoutMode
		};

		changeLayout(payload);
	};

	handleSubmit = async (updateWidget: UpdateWidget) => {
		const {changeLayoutMode, createWidget, layoutMode, saveWidget, widget} = this.props;
		const {values} = this.state;
		const isValid = await this.validate();
		const {displayMode} = values;

		if (isValid) {
			const updatedWidget = updateWidget(widget, values);
			const method = this.isNew() ? createWidget : saveWidget;
			const errors = await method(updatedWidget);

			if (layoutMode !== displayMode && displayMode !== DISPLAY_MODE.ANY) {
				changeLayoutMode(displayMode);
			}

			if (errors) {
				this.setState({errors});
			}

			this.setState({values: this.getValues(updatedWidget)});
		} else {
			this.focusOnError();
		}
	};

	isNew = (): boolean => this.props.widget.id === NewWidget.id;

	resolveForm = () => {
		const {type} = this.props.widget;
		const {
			BAR,
			BAR_STACKED,
			COLUMN,
			COLUMN_STACKED,
			COMBO,
			DONUT,
			LINE,
			PIE,
			SPEEDOMETER,
			SUMMARY,
			TABLE,
			TEXT
		} = WIDGET_TYPES;

		switch (type) {
			case BAR:
			case BAR_STACKED:
			case COLUMN:
			case COLUMN_STACKED:
			case COMBO:
			case DONUT:
			case LINE:
			case PIE:
			case SPEEDOMETER:
			case SUMMARY:
			case TABLE:
				return DiagramWidgetEditForm;
			case TEXT:
				return TextWidgetEditForm;
		}
	};

	setDataFieldValue = (index: number, name: string, value: any, callback?: Function) => {
		const {data} = this.state.values;
		data[index] = {
			...data[index],
			[name]: value
		};

		this.setFieldValue(FIELDS.data, data, callback);
	};

	setFieldValue = (name: string, value: any, callback?: Function) => this.setState(({isSubmitting, values: prevValues}) => {
		const values = {
			...prevValues,
			[name]: value
		};

		if (isSubmitting && prevValues.type === values.type) {
			this.validate(values);
		}

		return {
			values
		};
	}, callback);

	setForm = (form: FormElement) => {
		this.form = form;
	};

	setSchema = (schema: Schema) => {
		const {isSubmitting} = this.state;
		let callback;

		if (isSubmitting) {
			callback = this.validate;
		}

		this.setState({schema}, callback);
	};

	validate = async (values?: Values): Promise<boolean> => {
		const {widgets} = this.props;
		const {schema, values: stateValues} = this.state;
		let errors = {};

		if (schema) {
			try {
				const validateValues = values || stateValues;

				await schema.validate(validateValues, {
					abortEarly: false,
					values: validateValues,
					widgets
				});
			} catch (e) {
				e.inner.forEach(({message, path}) => {
					errors[path] = message;
				});
			}
		}

		this.setState({errors, isSubmitting: true});

		return Object.keys(errors).length === 0;
	};

	render () {
		this.fieldErrorRefs = [];
		const {
			cancelForm,
			context,
			layoutMode,
			personalDashboard,
			saving,
			user,
			widget
		} = this.props;
		const {errors, values} = this.state;
		const injectedProps = {
			cancelForm,
			context,
			errors,
			isNew: this.isNew(),
			layoutMode,
			onAddFieldErrorRef: this.handleAddFieldErrorRef,
			onChangeLayoutSize: this.handleChangeLayoutSize,
			onSubmit: this.handleSubmit,
			personalDashboard,
			saving,
			setDataFieldValue: this.setDataFieldValue,
			setFieldValue: this.setFieldValue,
			setForm: this.setForm,
			setSchema: this.setSchema,
			user,
			values,
			widget
		};
		const Form = this.resolveForm();

		return Form ? <Form {...injectedProps} /> : null;
	}
}

export default connect(props, functions)(WidgetEditForm);
