// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {AttrSelectProps, GetRefOptions, InputProps, SelectProps, SelectValue} from 'components/organisms/WidgetFormPanel/types';
import {ErrorMessage} from 'formik';
import {FIELDS, styles} from 'components/organisms/WidgetFormPanel';
import FormBuilder from './FormBuilder';
import {getAggregateOptions} from 'utils/aggregate';
import {getGroupOptions, OVERLAP} from 'utils/group';
import {getWidgetIcon} from 'icons/widgets';
import type {OptionType} from 'react-select/src/types';
import type {Props as TreeProps} from 'components/molecules/TreeSelectInput/types';
import React from 'react';
import TreeSelectInput from 'components/molecules/TreeSelectInput';

const defaultAttrProps = {
	getOptionLabel: (o: Attribute) => o.title,
	getOptionValue: (o: Attribute) => o.code,
	noOptionsMessage: () => 'Список пуст'
};

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

	createName = (num: number) => (name: string) => `${name}_${num}`;

	getAttributeOptions = (name: string) => {
		const {attributes, fetchAttributes, values} = this.props;
		let sourceName = FIELDS.source;
		let options = [];

		if (name.includes('_')) {
			sourceName = this.createName(this.getNumberFromName(name))(sourceName);
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
		return !isNaN(number) ? this.createName(number)(baseRefName) : baseRefName;
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

	handleSelectSource = async (name: string, source: SelectValue) => {
		const {attributes, fetchAttributes, setFieldValue} = this.props;

		await setFieldValue(name, source);

		if (!attributes[source.value]) {
			fetchAttributes(source);
		}
	};

	renderTreeSelect = (props: TreeProps) => {
		const {name} = props;

		return (
			<div className={styles.field}>
				<TreeSelectInput {...props} />
				<ErrorMessage name={name} />
			</div>
		);
	};

	renderAttrSelect = (props: AttrSelectProps) => {
		let {name, options} = props;

		if (!options) {
			options = this.getAttributeOptions(name);
		}

		return this.renderSelect({...defaultAttrProps, ...props, options});
	};

	renderSourceInput = (name: string = FIELDS.source, mixin: ?InputProps) => {
		const {values, sources} = this.props;

		let props: TreeProps = {
			name: name,
			onChange: this.handleSelectSource,
			placeholder: 'Выберите источник',
			tree: sources,
			value: values[name]
		};

		if (mixin) {
			props = {...props, ...mixin};
		}

		return this.renderTreeSelect(props);
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

	renderAggregateInput = (name: string = FIELDS.aggregate, refName: string) => {
		const {values} = this.props;
		const refValue = values[refName];
		const options = getAggregateOptions(refValue);
		const aggregate = values[name];

		const props: SelectProps = {
			name,
			options,
			placeholder: 'Агрегация',
			value: aggregate
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
