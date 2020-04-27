// @flow
import {connect} from 'react-redux';
import {deepClone} from 'src/helpers';
import {FIELDS} from 'WidgetFormPanel';
import Form from 'components/organisms/WidgetFormPanel';
import {functions, props} from './selectors';
import {NewWidget} from 'utils/widget';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import type {UpdateWidget} from 'WidgetFormPanel/types';

class WidgetFormPanel extends PureComponent<Props, State> {
	state = {
		errors: {},
		isSubmitting: false,
		schema: null,
		values: {},
		valuesSet: false
	};

	componentDidMount () {
		const {id, layout, ...values} = this.props.widget;
		this.setState({values: deepClone(values), valuesSet: true});
	}

	componentDidCatch () {
		const {cancelForm, createToast} = this.props;

		createToast({
			text: 'Ошибка формы редактирования',
			type: 'error'
		});
		cancelForm();
	}

	handleSubmit = async (updateWidget: UpdateWidget) => {
		const {createWidget, saveWidget, widget} = this.props;
		const {values} = this.state;
		const isValid = await this.validate();

		if (isValid) {
			const updatedWidget = updateWidget(widget, values);
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

	setFieldValue = (name: string, value: any) => this.setState(({isSubmitting, values: prevValues}) => {
		const values = {
			...prevValues,
			[name]: value
		};

		isSubmitting && this.validate(values);

		return {
			values
		};
	});

	setSchema = (schema: Object) => this.setState({schema});

	validate = async (values?: Object) => {
		const {schema, values: stateValues} = this.state;
		let errors = {};

		if (schema) {
			try {
				const validateValues = values || stateValues;

				await schema.validate(validateValues, {
					abortEarly: false,
					values: validateValues
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
		const {errors, values, valuesSet} = this.state;

		if (valuesSet) {
			return (
				<Form
					attributes={attributes}
					cancelForm={cancelForm}
					context={context}
					errors={errors}
					fetchAttributes={fetchAttributes}
					fetchRefAttributes={fetchRefAttributes}
					isNew={this.isNew()}
					onSubmit={this.handleSubmit}
					personalDashboard={personalDashboard}
					refAttributes={refAttributes}
					setDataFieldValue={this.setDataFieldValue}
					setDataFieldValues={this.setDataFieldValues}
					setFieldValue={this.setFieldValue}
					setSchema={this.setSchema}
					sources={sources}
					updating={updating}
					user={user}
					values={values}
				/>
			);
		}

		return null;
	}
}

export default connect(props, functions)(WidgetFormPanel);
