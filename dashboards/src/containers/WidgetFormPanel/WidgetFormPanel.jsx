// @flow
import {connect} from 'react-redux';
import FIELDS from 'components/organisms/WidgetFormPanel/constants/fields';
import Form from 'components/organisms/WidgetFormPanel';
import {functions, props} from './selectors';
import {NewWidget} from 'utils/widget';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import schema from './schema';
import update from './update';

class WidgetFormPanel extends PureComponent<Props, State> {
	state = {
		currentId: '',
		errors: {},
		isSubmitting: false,
		values: {}
	};

	static getDerivedStateFromProps (props: Props, state: State) {
		const {widget} = props;
		const {currentId} = state;
		const {id, layout, ...values} = widget;

		if (id !== currentId) {
			return {
				currentId: id,
				errors: {},
				isSubmitting: false,
				values
			};
		}

		return state;
	}

	componentDidCatch () {
		const {cancelForm, createToast} = this.props;

		createToast({
			text: 'Ошибка формы редактирования',
			type: 'error'
		});
		cancelForm();
	}

	handleSubmit = async () => {
		const {createWidget, saveWidget, widget} = this.props;
		const {values} = this.state;
		const isValid = await this.validate();

		if (isValid) {
			const updatedWidget = update(widget, values);
			this.isNew() ? createWidget(updatedWidget) : saveWidget(updatedWidget);
		}
	};

	isNew = () => this.props.widget.id === NewWidget.id;

	setDataFieldValue = (index: number) => (name: string, value: any) => {
		let {data} = this.state.values;
		data[index][name] = value;

		this.setFieldValue(FIELDS.data, data);
	};

	setDataFieldValues = (index: number) => (values: Object) => {
		let {data} = this.state.values;
		data[index] = {...data[index], ...values};
		this.setFieldValue(FIELDS.data, data);
	};

	setFieldValue = (name: string, value: any) => {
		const {isSubmitting, values: prevValues} = this.state;

		const values = {
			...prevValues,
			[name]: value
		};

		isSubmitting && this.validate(values);
		this.setState({values});
	};

	validate = async (values?: Object) => {
		const {values: stateValues} = this.state;
		let errors = {};

		try {
			await schema.validate(values || stateValues, {
				abortEarly: false
			});
		} catch (e) {
			e.inner.forEach(({message, path}) => {
				errors[path] = message;
			});
		}

		this.setState({errors, isSubmitting: true});

		return Object.keys(errors).length === 0;
	};

	render () {
		const {
			attributes,
			cancelForm,
			context,
			fetchAttributes,
			fetchRefAttributes,
			personalDashboard,
			refAttributes,
			sources,
			updating,
			user
		} = this.props;
		const {errors, isSubmitting, values} = this.state;

		return (
			<Form
				attributes={attributes}
				cancelForm={cancelForm}
				context={context}
				errors={errors}
				fetchAttributes={fetchAttributes}
				fetchRefAttributes={fetchRefAttributes}
				isNew={this.isNew()}
				isSubmitting={isSubmitting}
				onSubmit={this.handleSubmit}
				personalDashboard={personalDashboard}
				refAttributes={refAttributes}
				setDataFieldValue={this.setDataFieldValue}
				setDataFieldValues={this.setDataFieldValues}
				setFieldValue={this.setFieldValue}
				sources={sources}
				updating={updating}
				user={user}
				values={values}
			/>
		);
	}
}

export default connect(props, functions)(WidgetFormPanel);
