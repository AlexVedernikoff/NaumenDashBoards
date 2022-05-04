// @flow
import {compose} from 'redux';
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import type {InnerFormErrors, Props, State} from './types';
import React, {PureComponent} from 'react';
import type {RenderProps} from 'components/organisms/WidgetForm/types';
import t from 'localization';
import {TAB_TYPES} from 'src/containers/DiagramWidgetForm/constants';
import {TabbedWidgetForm} from 'components/templates/WidgetForm';
import type {Values} from 'store/widgetForms/axisChartForm/types';
import WidgetForm from 'components/organisms/WidgetForm';
import {withAttributesHelpersContext} from 'containers/DiagramWidgetForm/HOCs/withAttributesHelpers';

export class DiagramWidgetForm extends PureComponent<Props, State> {
	static defaultProps = {
		components: {
			OptionsTab: () => null,
			ParamsTab: () => null,
			StyleTab: () => null
		}
	};

	state = {
		optionsTabErrors: {},
		paramsTabErrors: {},
		styleTabErrors: {}
	};

	handleOptionsTabErrors = (optionsTabErrors: InnerFormErrors) => this.setState({optionsTabErrors});

	handleParamsTabErrors = (paramsTabErrors: InnerFormErrors) => this.setState({paramsTabErrors});

	handleStyleTabErrors = (styleTabErrors: InnerFormErrors) => this.setState({styleTabErrors});

	validate = async (values: Values) => {
		const environment = process.env.NODE_ENV;
		const {optionsTabErrors, paramsTabErrors, styleTabErrors} = this.state;
		const {schema, widgets} = this.props;
		let errors = {...optionsTabErrors, ...styleTabErrors, ...paramsTabErrors};

		try {
			await schema.validate(values, {abortEarly: false, values, widgets});
		} catch (err) {
			errors = err.inner.reduce((errors, innerError) => ({
				...errors, [innerError.path]: innerError.message
			}), errors);

			if (environment === 'development') {
				console.error(errors);
			}
		}

		return errors;
	};

	renderForm = (props: RenderProps<Values>) => {
		const {tabs} = this.props;
		const {handleCancel, handleSubmit, values} = props;
		const title = values.templateName || t('DiagramWidgetForm::NewWidget');

		return (
			<TabbedWidgetForm onCancel={handleCancel} onSubmit={handleSubmit} tabs={tabs} title={title}>
				{name => this.renderTab(name, props)}
			</TabbedWidgetForm>
		);
	};

	renderTab = (tab: string, props: RenderProps<Values>) => {
		const {components} = this.props;
		const {OptionsTab, ParamsTab, StyleTab} = components;
		const {setFieldValue: onChange, values} = props;
		const {OPTIONS, PARAMS, STYLE} = TAB_TYPES;

		switch (tab) {
			case OPTIONS:
				return <OptionsTab onChange={onChange} raiseErrors={this.handleOptionsTabErrors} values={values} />;
			case PARAMS:
				return <ParamsTab onChange={onChange} raiseErrors={this.handleParamsTabErrors} values={values} />;
			case STYLE:
				return <StyleTab onChange={onChange} raiseErrors={this.handleStyleTabErrors} values={values} />;
			default:
				return null;
		}
	};

	render () {
		const {cancelForm, onChange, onSubmit, saving, values} = this.props;

		return (
			<WidgetForm
				initialValues={values}
				onCancel={cancelForm}
				onChange={onChange}
				onSubmit={onSubmit}
				render={this.renderForm}
				submitting={saving}
				validate={this.validate}
			/>
		);
	}
}

export default compose(connect(props, functions), withAttributesHelpersContext)(DiagramWidgetForm);
