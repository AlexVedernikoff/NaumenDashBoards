// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {AttrSelect} from 'components/atoms/AttrSelect/AttrSelect';
import type {AttrSelectProps, SelectProps, SelectValue} from 'components/organisms/WidgetFormPanel/types';
import {getAggregateOptions} from 'utils/aggregate';
import {getGroupOptions, typeOfExtendedGroups} from 'utils/group';
import {CHART_SELECTS} from 'utils/chart';
import {ErrorMessage} from 'formik';
import {FIELDS, styles} from 'components/organisms/WidgetFormPanel';
import FormBuilder from './FormBuilder';
import type {Props as TreeProps} from 'components/molecules/TreeSelectInput/types';
import React from 'react';
import TreeSelectInput from 'components/molecules/TreeSelectInput';

export class DataFormBuilder extends FormBuilder {
	getNumberFromName = (name: string) => {
		return Number(name.split('_').pop());
	};

	getAttributeOptions = (name: string): Array<Attribute> => {
		const {attributes, fetchAttributes, values} = this.props;
		let sourceName = FIELDS.source;
		let options = [];

		if (name.includes('_')) {
			sourceName = `${sourceName}_${this.getNumberFromName(name)}`;
		}

		const source = values[sourceName];

		if (source) {
			if (!attributes[source.value]) {
				fetchAttributes(source.value);
			} else {
				options = attributes[source.value];
			}
		}

		return options;
	};

	handleSelectSource = async (name: string, source: SelectValue) => {
		const {attributes, fetchAttributes, setFieldValue} = this.props;

		await setFieldValue(name, source);

		if (!attributes[source.value]) {
			fetchAttributes(source.value);
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
		const {name, onChange, placeholder, value} = props;
		const options = this.getAttributeOptions(name);

		return (
			<div className={styles.field}>
				<AttrSelect
					name={name}
					onChange={onChange || this.handleSelect}
					options={options}
					placeholder={placeholder}
					value={value}
				/>
				<ErrorMessage name={name} />
			</div>
		);
	};

	renderSourceInput = (name: string = FIELDS.source) => {
		const {values, sources} = this.props;

		const source: TreeProps = {
			name: name,
			onChange: this.handleSelectSource,
			placeholder: 'Выберите источник',
			tree: sources,
			value: values[name]
		};

		return this.renderTreeSelect(source);
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

	renderGroupInput = (name: string = FIELDS.group, xAxis: string = FIELDS.xAxis) => {
		const {values} = this.props;

		const group: SelectProps = {
			name: name,
			options: getGroupOptions(values[xAxis]),
			placeholder: 'Группировка',
			value: values[name]
		};

		return typeOfExtendedGroups(values[xAxis]) && this.renderSelect(group);
	};

	renderAggregateInput = (name: string = FIELDS.aggregate) => {
		const {values} = this.props;

		const aggregate: SelectProps = {
			name: name,
			options: getAggregateOptions(values.yAxis),
			placeholder: 'Агрегация',
			value: values[name]
		};

		return this.renderSelect(aggregate);
	};

	renderChartInput = (name: string = FIELDS.chart) => {
		const {values} = this.props;

		const chart: SelectProps = {
			name: name,
			options: CHART_SELECTS,
			placeholder: 'Выберите диаграмму',
			value: values[name]
		};

		return this.renderSelect(chart);
	};
}

export default DataFormBuilder;
