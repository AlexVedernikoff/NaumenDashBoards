// @flow
import {connect} from 'react-redux';
import {deepClone} from 'src/helpers';
import {DISPLAY_MODE} from 'store/widgets/data/constants';
import type {DivRef} from 'components/types';
import {FIELDS, formRef} from 'WidgetFormPanel';
import Form from 'components/organisms/WidgetFormPanel';
import {functions, props} from './selectors';
import type {LayoutSize} from 'components/organisms/WidgetFormPanel/types';
import NewWidget from 'store/widgets/data/NewWidget';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import type {UpdateWidget} from 'WidgetFormPanel/types';

class WidgetFormPanel extends PureComponent<Props, State> {
	fieldErrorRefs = [];
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

	addFieldErrorRef = (ref: DivRef) => {
		this.fieldErrorRefs.push(ref);
	};

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
		} else {
			this.focusOnError();
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
		this.fieldErrorRefs = [];
		const {
			attributes,
			cancelForm,
			context,
			dynamicGroups,
			fetchAttributes,
			fetchDynamicAttributeGroups,
			fetchDynamicAttributes,
			fetchLinkedDataSources,
			fetchRefAttributes,
			layoutMode,
			linkedSources,
			personalDashboard,
			refAttributes,
			saving,
			sources,
			user,
			widget
		} = this.props;
		const {errors, values, valuesSet} = this.state;

		if (valuesSet) {
			return (
				<Form
					addFieldErrorRef={this.addFieldErrorRef}
					attributes={attributes}
					cancelForm={cancelForm}
					context={context}
					dynamicGroups={dynamicGroups}
					errors={errors}
					fetchAttributes={fetchAttributes}
					fetchDynamicAttributeGroups={fetchDynamicAttributeGroups}
					fetchDynamicAttributes={fetchDynamicAttributes}
					fetchLinkedDataSources={fetchLinkedDataSources}
					fetchRefAttributes={fetchRefAttributes}
					isNew={this.isNew()}
					layoutMode={layoutMode}
					linkedSources={linkedSources}
					onChangeLayoutSize={this.handleChangeLayoutSize}
					onSubmit={this.handleSubmit}
					personalDashboard={personalDashboard}
					refAttributes={refAttributes}
					saving={saving}
					setDataFieldValue={this.setDataFieldValue}
					setFieldValue={this.setFieldValue}
					setSchema={this.setSchema}
					sources={sources}
					user={user}
					values={values}
					widget={widget}
				/>
			);
		}

		return null;
	}
}

export default connect(props, functions)(WidgetFormPanel);
