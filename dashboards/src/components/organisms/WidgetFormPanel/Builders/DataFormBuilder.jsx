// @flow
import type {AttrSelectProps, GetRefOptions, InputProps, SelectProps, SelectValue} from 'components/organisms/WidgetFormPanel/types';
import {Button} from 'components/atoms';
import {createOrderName} from 'utils/widget';
import {ErrorMessage} from 'formik';
import {FIELDS, SETTINGS, styles} from 'components/organisms/WidgetFormPanel';
import FormBuilder from './FormBuilder';
import {getAggregateOptions} from 'utils/aggregate';
import {getGroupOptions, OVERLAP} from 'utils/group';
import {getWidgetIcon} from 'icons/widgets';
import type {OptionType} from 'react-select/src/types';
import type {Props as TreeProps} from 'components/molecules/TreeSelectInput/types';
import React, {Fragment} from 'react';
import TreeSelectInput from 'components/molecules/TreeSelectInput';

export class DataFormBuilder extends FormBuilder {
	getLabelWithIcon = (option: SelectValue) => {
		const Icon = getWidgetIcon(option.value);

		return (
			<div className={styles.labelWithIcon}>
				{Icon && <Icon />} <span>{option.label}</span>
			</div>
		);
	};

	getNumberFromName = (name: string) => Number(name.split('_').pop());

	getAttributeOptions = (name: string) => {
		const {attributes, fetchAttributes, values} = this.props;
		let sourceName = FIELDS.source;
		let options = [];

		if (name.includes('_')) {
			sourceName = createOrderName(this.getNumberFromName(name))(sourceName);
		}

		const source = values[sourceName];

		if (source) {
			const currentAttr = attributes[source.value];

			if (!currentAttr || (currentAttr.data.length === 0 && !currentAttr.loading && !currentAttr.error)) {
				fetchAttributes(source);
			} else {
				options = currentAttr.data;
			}
		}

		return options;
	};

	createRefName = (targetName: string, baseRefName: string) => {
		const number = this.getNumberFromName(targetName);
		return isNaN(number) ? baseRefName : createOrderName(number)(baseRefName);
	};

	handleSelectAxis = (baseRefName: string, getRefOptions: GetRefOptions) => (name: string, value: OptionType) => {
		const {setFieldValue, values} = this.props;
		const refName = this.createRefName(name, baseRefName);
		const refValue = values[refName];
		const refOptions = getRefOptions(value);

		setFieldValue(name, value);

		if (!refValue || !refOptions.filter(o => o.value === refValue.value).length) {
			setFieldValue(refName, refOptions[0]);
		}
	};

	baseHandleSelectSource = async (name: string, source: SelectValue) => {
		const {attributes, fetchAttributes, setFieldValue, values} = this.props;
		const currentSource = values[name];
		await setFieldValue(name, source);

		if (currentSource && currentSource.value !== source.value) {
			const descriptorName = this.createRefName(name, FIELDS.descriptor);

			setFieldValue(descriptorName, null);
		}

		if (!attributes[source.value]) {
			fetchAttributes(source);
		}
	};

	handleSelectSource = this.baseHandleSelectSource;

	createFilterContext = (sourceName: string) => {
		const {context: mainContext} = this.props;

		const context = {
			cases: [],
			clazz: sourceName,
			contentUuid: mainContext.contentCode
		};

		if (sourceName.includes('$')) {
			const parts = sourceName.split('$');
			context.cases = [sourceName];
			context.clazz = parts.shift();
		}

		return context;
	};

	callFilterModal = (sourceFieldName: string) => async () => {
		const {setFieldValue, values} = this.props;
		const descriptorName = this.createRefName(sourceFieldName, FIELDS.descriptor);
		const source = values[sourceFieldName];
		const descriptor = values[descriptorName];

		if (source) {
			const context = descriptor ? JSON.parse(descriptor) : this.createFilterContext(source.value);
			const {serializedContext} = await window.jsApi.commands.filterForm(context);

			setFieldValue(descriptorName, serializedContext);
		}
	};

	renderTreeSelect = (props: TreeProps) => {
		const {name} = props;

		return (
			<div className={styles.field}>
				<TreeSelectInput {...props} />
				<span className={styles.error}>
					<ErrorMessage name={name} />
				</span>
			</div>
		);
	};

	renderAttrSelect = (props: AttrSelectProps) => {
		let {name, options} = props;

		if (!options) {
			options = this.getAttributeOptions(name);
		}

		if (options.length && name === FIELDS.breakdown) {
			const noBreakdown = {
				...options[0],
				code: null,
				title: '[Не выбрано]',
				type: ''
			};

			options = [noBreakdown, ...options];
		}

		return this.renderSelect({...SETTINGS.ATTR_SELECT_PROPS, ...props, options});
	};

	renderFilterButton = (source: string) => {
		return (
			<Button onClick={this.callFilterModal(source)} className="mt-1">
				Добавить фильтр
			</Button>
		);
	};

	renderSourceInput = (name: string = FIELDS.source) => {
		const {values, sources} = this.props;

		let props: TreeProps = {
			name: name,
			onChange: this.handleSelectSource,
			placeholder: 'Выберите источник',
			tree: sources,
			value: values[name]
		};

		return (
			<Fragment>
				{this.renderTreeSelect(props)}
				{this.renderFilterButton(name)}
			</Fragment>
		);
	};

	renderBreakdownInput = (name: string = FIELDS.breakdown) => {
		const {values} = this.props;

		const breakdown: AttrSelectProps = {
			name: name,
			placeholder: 'Разбивка',
			value: values[name]
		};

		return this.renderAttrSelect(breakdown);
	};

	renderAggregateInput = (name: string = FIELDS.aggregation, refName: string) => {
		const {values} = this.props;
		const refValue = values[refName];
		const options = getAggregateOptions(refValue);
		const aggregation = values[name];

		const props: SelectProps = {
			name,
			options,
			placeholder: 'Агрегация',
			value: aggregation
		};

		return this.renderSelect(props);
	};

	renderIndicatorInput = (name: string = FIELDS.indicator) => {
		const {values} = this.props;

		const indicator: AttrSelectProps = {
			name,
			placeholder: 'Показатель',
			value: values[name]
		};

		return this.renderAttrSelect(indicator);
	};

	renderGroupInput = (name: string = FIELDS.group, xAxisName: string = FIELDS.xAxis, mixin: ?InputProps) => {
		const {values} = this.props;
		const xAxis = values[xAxisName];
		const options = getGroupOptions(xAxis);
		const group = values[name];
		let isDisabled = false;

		if (group && group.value === OVERLAP) {
			isDisabled = true;
		}

		let props: SelectProps = {
			isDisabled,
			name,
			options,
			placeholder: 'Группировка',
			value: group
		};

		if (mixin) {
			props = {...props, ...mixin};
		}

		return this.renderSelect(props);
	};
}

export default DataFormBuilder;
