// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {Breakdown, Indicator, Parameter} from 'store/widgetForms/types';
import {connect} from 'react-redux';
import FiltersOnWidget from 'containers/FiltersOnWidget';
import {functions, props} from './selectors';
import {HELPERS_CONTEXT} from 'containers/DiagramWidgetForm/HOCs/withHelpers/constants';
import memoize from 'memoize-one';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import type {RenderProps} from 'components/organisms/WidgetForm/types';
import {TAB_TYPES, TABS} from 'src/containers/DiagramWidgetForm/constants';
import {TabbedWidgetForm} from 'components/templates/WidgetForm';
import type {Values} from 'store/widgetForms/axisChartForm/types';
import WidgetForm from 'components/organisms/WidgetForm';

export class DiagramWidgetForm extends PureComponent<Props> {
	static defaultProps = {
		components: {
			ParamsTab: () => null,
			StyleTab: () => null
		}
	};

	getHelpers = memoize(() => ({
		filterAttributesByUsed: this.filterAttributesByUsed
	}));

	/**
	 * Отфильтровывает атрибуты в зависимости от уже использованных
	 * @param {Array<Attribute>} options - список атрибутов
	 * @param {number} dataSetIndex - индекс набора данных
	 * @returns  {Array<Attribute>} - список отфильтрованных атрибутов
	 */
	filterAttributesByUsed = (options: Array<Attribute>, dataSetIndex: number): Array<Attribute> => {
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

				return usedAttributes.findIndex(
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
		return items?.reduce((used, {attribute}) => {
			return attribute && attribute.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR ? [...used, attribute] : used;
		}, []) ?? [];
	};

	validate = async (values: Values) => {
		const {schema, widgets} = this.props;
		let errors = {};

		try {
			await schema.validate(values, {abortEarly: false, values, widgets});
		} catch (err) {
			errors = err.inner.reduce((errors, innerError) => ({
				...errors, [innerError.path]: innerError.message
			}), errors);
		}

		return errors;
	};

	renderForm = (props: RenderProps<Values>) => {
		const {handleCancel, handleSubmit, values} = props;
		const title = values.templateName || 'Новый виджет';

		return (
			<TabbedWidgetForm onCancel={handleCancel} onSubmit={handleSubmit} tabs={TABS} title={title}>
				{name => this.renderTab(name, props)}
			</TabbedWidgetForm>
		);
	};

	renderTab = (tab: string, props: RenderProps<Values>) => {
		const {ParamsTab, StyleTab} = this.props.components;
		const {setFieldValue: onChange, values} = props;
		const {OPTIONS, PARAMS, STYLE} = TAB_TYPES;

		switch (tab) {
			case OPTIONS:
				return <FiltersOnWidget onChange={onChange} values={values} />;
			case PARAMS:
				return <ParamsTab onChange={onChange} values={values} />;
			case STYLE:
				return <StyleTab onChange={onChange} values={values} />;
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
