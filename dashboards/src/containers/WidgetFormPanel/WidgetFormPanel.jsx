// @flow
import {connect} from 'react-redux';
import {deepClone} from 'src/helpers';
import {DISPLAY_MODE} from 'store/widgets/data/constants';
import {FIELDS} from 'WidgetFormPanel';
import Form from 'components/organisms/WidgetFormPanel';
import {functions, props} from './selectors';
import NewWidget from 'store/widgets/data/NewWidget';
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
		const {id, ...values} = this.props.widget;
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
		}
	};

	isNew = () => this.props.widget.id === NewWidget.id;

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

		isSubmitting && this.validate(values);

		return {
			values
		};
	}, callback);

	setSchema = (schema: Object) => this.setState({schema});

	validate = async (values?: Object) => {
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
		const {
			attributes,
			cancelForm,
			context,
			dynamicGroups,
			fetchAttributes,
			fetchDynamicAttributeGroups,
			fetchDynamicAttributes,
			fetchRefAttributes,
			layoutMode,
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
					dynamicGroups={dynamicGroups}
					errors={errors}
					fetchAttributes={fetchAttributes}
					fetchDynamicAttributeGroups={fetchDynamicAttributeGroups}
					fetchDynamicAttributes={fetchDynamicAttributes}
					fetchRefAttributes={fetchRefAttributes}
					isNew={this.isNew()}
					layoutMode={layoutMode}
					onSubmit={this.handleSubmit}
					personalDashboard={personalDashboard}
					refAttributes={refAttributes}
					setDataFieldValue={this.setDataFieldValue}
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
