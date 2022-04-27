// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Breakdown, Indicator, Parameter} from 'store/widgetForms/types';
import {connect} from 'react-redux';
import {filterByAttribute} from 'containers/WidgetFormPanel/helpers';
import {functions, props} from './selectors';
import {getSourceAttribute} from 'store/sources/attributes/helpers';
import {HELPERS_CONTEXT} from 'containers/DiagramWidgetForm/HOCs/withHelpers/constants';
import type {InnerFormErrors, Props, State} from './types';
import memoize from 'memoize-one';
import React, {PureComponent} from 'react';
import type {RenderProps} from 'components/organisms/WidgetForm/types';
import t from 'localization';
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
		filterAttributeByMainDataSet: this.filterAttributeByMainDataSet,
		filterAttributesByUsed: this.filterAttributesByUsed,
		filterBreakdownAttributeByMainDataSet: this.filterBreakdownAttributeByMainDataSet,
		getCommonAttributes: this.getCommonAttributes
	}));

	/**
	 * Фильтрует атрибуты в зависимости от главного источника
	 * Используется в таблицах, в которых установленно "не использовать параметры"
	 * @param {Array<Attribute>} options - список атрибутов
	 * @param {number} dataSetIndex - индекс набора данных
	 * @returns {Array<Attribute>} - список отфильтрованных атрибутов
	 */
	filterAttributeByMainDataSet = (options: Array<Attribute>, dataSetIndex: number): Array<Attribute> => {
		const {attributes, fetchAttributes, setLoadingStateAttributes, values: {data}} = this.props;
		let result = [];

		if (options && options.length > 0) {
			const dataSet = data[dataSetIndex];
			const dataSetSource = dataSet.source.value.value;
			const mainDataSet = data.find(ds => !ds.sourceForCompute);
			const mainSource = mainDataSet.source?.value?.value;
			const mainAttributes = attributes[mainSource];

			if (!mainAttributes || (!mainAttributes.uploaded && !mainAttributes.loading)) {
				// атрибуты главного источника не загружены, переводим источник в загрузку,
				// и загружаем атрибуты главного источника
				setLoadingStateAttributes(dataSetSource, true);
				fetchAttributes(mainSource, null, null, () => setLoadingStateAttributes(dataSetSource, false));
			} else {
				if (!mainAttributes.loading) {
					// атрибуты главного источника загружены,
					// оставляем только те атрибуты, которые встречаются
					// в главном источнике
					const mainOptions = mainAttributes.options;

					result = options.filter(({code, property}) =>
						mainOptions.find(item => item.code === code && item.property === property)
					);
				}
			}
		}

		return result;
	};

	/**
	 * Фильтрует атрибуты в зависимости от уже использованных
	 * @param {Array<Attribute>} options - список атрибутов
	 * @param {number} dataSetIndex - индекс набора данных
	 * @param {?Array<?Attribute>} includeAttributes - атрибут который не надо отфильтровывать
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
			filteredOptions = [];

			options.forEach(attribute => {
				const {code, sourceCode = null} = attribute;
				const isInclude = includeAttributes?.some(
					includeAttribute => includeAttribute && includeAttribute.code === code && includeAttribute.sourceCode === sourceCode
				) ?? false;
				const isUsedAttribute = usedAttributes.find(
					usedAttribute => usedAttribute.code === code && usedAttribute.sourceCode === sourceCode
				);

				if (isInclude || !isUsedAttribute) {
					filteredOptions.push(attribute);
				}
			});
		}

		return filteredOptions;
	};

	/**
	 * Фильтрует атрибуты разбивки в соответствии с типом разбивки первого источника
	 * @param {Array<Attribute>} options - список атрибутов
	 * @returns {Array<Attribute>} - список отфильтрованных атрибутов
	 */
	filterBreakdownAttributeByMainDataSet = (options: Array<Attribute>): Array<Attribute> => {
		const {values: {data}} = this.props;
		let result = [];

		if (options && options.length > 0) {
			const mainDataSet = data.find(ds => !ds.sourceForCompute);

			if (mainDataSet.breakdown.length > 0) {
				const {attribute} = mainDataSet.breakdown[0];

				result = filterByAttribute(options, attribute, false);
			}
		}

		return result;
	};

	/**
	 * Возвращает только те атрибуты, которые используются во всех источниках
	 * @param {Array<Attribute>} options - список атрибутов
	 * @returns {Array<Attribute>} - список отфильтрованных атрибутов
	 */
	getCommonAttributes = (options: Array<Attribute>): Array<Attribute> => {
		const {attributes, fetchAttributes, values: {data}} = this.props;
		const result = [];
		const optionsList = [];
		let allLoaded = true;

		// проверка на загруженность атрибутов
		data.forEach(ds => {
			const source = ds.source?.value?.value;
			const sourceAttributes = attributes[source];

			if (!sourceAttributes || (!sourceAttributes.uploaded && !sourceAttributes.loading)) {
				allLoaded = false;
				fetchAttributes(source, null, null);
			} else if (sourceAttributes.loading) {
				allLoaded = false;
			} else {
				optionsList.push(sourceAttributes.options);
			}
		});

		// оставляет те атрибуты первого источника,
		// которые есть во всех остальных источниках
		if (allLoaded) {
			options.forEach(mainItem => {
				const isAdd = optionsList.every(options =>
					options.find(({code, property}) => code === mainItem.code && property === mainItem.property)
				);

				if (isAdd) {
					result.push(mainItem);
				}
			});
		}

		return result;
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
				const sourceAttribute = getSourceAttribute(attribute);

				if (sourceAttribute) {
					result.push(sourceAttribute);
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
