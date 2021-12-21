// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {Breakdown, Indicator, Parameter} from 'store/widgetForms/types';
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import {HELPERS_CONTEXT} from 'containers/DiagramWidgetForm/HOCs/withHelpers/constants';
import type {InnerFormErrors, Props, State} from './types';
import memoize from 'memoize-one';
import React, {PureComponent} from 'react';
import type {RenderProps} from 'components/organisms/WidgetForm/types';
import {TAB_TYPES} from 'src/containers/DiagramWidgetForm/constants';
import {TabbedWidgetForm} from 'components/templates/WidgetForm';
import type {Values} from 'store/widgetForms/axisChartForm/types';
import WidgetForm from 'components/organisms/WidgetForm';

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

	getHelpers = memoize(() => ({
		filterAttributesByUsed: this.filterAttributesByUsed
	}));

	/**
	 * Отфильтровывает атрибуты в зависимости от уже использованных
	 * @param {Array<Attribute>} options - список атрибутов
	 * @param {number} dataSetIndex - индекс набора данных
	 * @param {Array<Attribute>} includeAttributes - атрибут который не надо отфильтровывать
	 * @returns {Array<Attribute>} - список отфильтрованных атрибутов
	 */
	filterAttributesByUsed = (options: Array<Attribute>, dataSetIndex: number, includeAttributes: ?Array<?Attribute>): Array<Attribute> => {
		const {breakdown, indicators, parameters} = this.props.values.data[dataSetIndex];
		const usedAttributes = [
			...this.getUsedAttributes(parameters),
			...this.getUsedAttributes(indicators),
			...this.getUsedAttributes(breakdown)
		];
		let filteredOptions = options;

		if (usedAttributes.length > 0) {
			filteredOptions = options.filter(attribute => {
				const {code, sourceCode = null} = attribute;
				let isInclude = false;

				if (includeAttributes) {
					isInclude = includeAttributes.some(
						includeAttribute => includeAttribute && includeAttribute.code === code && includeAttribute.sourceCode === sourceCode
					);
				}

				return isInclude || usedAttributes.findIndex(
					usedAttribute => usedAttribute.code === code && usedAttribute.sourceCode === sourceCode
				) === -1;
			});
		}

		return filteredOptions;
	};

	/**
	 * Возвращает использованные атрибуты
	 * @param {Array<Indicator> | Array<Parameter> | Breakdown} items - Список параметров, индикаторов или разбивок
	 * @returns {Array<Attribute>} - использованные атрибуты
	 */
	getUsedAttributes = (items: Array<Indicator> | ?(Array<Parameter> | Breakdown)): Array<Attribute> => {
		const result = [];

		if (items) {
			items.forEach(({attribute}) => {
				if (attribute && attribute.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR) {
					result.push(attribute.ref || attribute);
				}
			});
		}

		return result;
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
		const title = values.templateName || 'Новый виджет';

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
			<HELPERS_CONTEXT.Provider value={this.getHelpers()}>
				<WidgetForm
					initialValues={values}
					onCancel={cancelForm}
					onChange={onChange}
					onSubmit={onSubmit}
					render={this.renderForm}
					submitting={saving}
					validate={this.validate}
				/>
			</HELPERS_CONTEXT.Provider>
		);
	}
}

export default connect(props, functions)(DiagramWidgetForm);
