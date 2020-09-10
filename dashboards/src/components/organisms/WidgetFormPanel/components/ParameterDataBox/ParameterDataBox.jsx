// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {DataSet} from 'containers/WidgetFormPanel/types';
import {FIELDS} from 'WidgetFormPanel/constants';
import {filterByAttribute, getDataErrorKey} from 'WidgetFormPanel/helpers';
import {FormBox} from 'components/molecules';
import {getDefaultSystemGroup} from 'store/widgets/helpers';
import {getProcessedValue} from 'store/sources/attributes/helpers';
import type {Group} from 'store/widgets/data/types';
import type {GroupAttributeField} from 'WidgetFormPanel/components/AttributeGroupField/types';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'WidgetFormPanel/types';
import {ParameterFieldset} from 'WidgetFormPanel/components';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import withForm from 'WidgetFormPanel/withForm';

export class ParameterDataBox extends PureComponent<Props> {
	static defaultProps = {
		name: FIELDS.parameter
	};

	/**
	 * Функция изменяет значения параметров и группировок параметров дополнительных источников
	 * относительного главного.
	 * @param {string} parameterName - наименование поля параметра
	 * @returns {Function}
	 */
	changeAdditionalParameterFields = (parameterName: string) => () => {
		const {setDataFieldValue, values} = this.props;
		const {data} = values;
		const {group: mainGroup, source: mainSource, [parameterName]: mainParameter} = data[0];

		data.forEach((currentSet, index) => {
			if (index > 0) {
				const {source: currentSource, [parameterName]: currentParameter} = currentSet;

				if (mainSource && currentSource) {
					if (mainSource.value === currentSource.value) {
						setDataFieldValue(index, parameterName, mainParameter);
					} else if (mainParameter && currentParameter && mainParameter.type !== currentParameter.type) {
						setDataFieldValue(index, parameterName, null);
					}

					setDataFieldValue(index, FIELDS.group, mainGroup);
				}
			}
		});
	};

	filter = (options: Array<Attribute>, index: number): Array<Attribute> => {
		const {name, values} = this.props;
		const mainSet = values.data[0];
		const currentSet = values.data[index];
		let mainParameter = mainSet[name];

		if (currentSet !== mainSet && !this.isDisabled(index) && mainParameter) {
			return filterByAttribute(options, mainParameter);
		}

		return options;
	};

	handleChangeAttributeTitle = (event: OnChangeAttributeLabelEvent, index: number) => {
		const {changeAttributeTitle, setDataFieldValue, values} = this.props;
		const {label, name, parent} = event;
		const parameter = values.data[index][name];

		setDataFieldValue(index, name, changeAttributeTitle(parameter, parent, label));
	};

	handleChangeGroup = (index: number, name: string, value: Group, field: GroupAttributeField) => {
		const {handleChangeGroup, setDataFieldValue, values} = this.props;

		if (index === 0) {
			values.data.forEach((set, index) => setDataFieldValue(index, name, value));
		}

		handleChangeGroup(index, name, value, field);
	};

	handleSelect = (event: OnSelectAttributeEvent, index: number) => {
		const {setDataFieldValue, setFieldValue, transformAttribute, values} = this.props;
		const {name} = event;
		const currentValue = values.data[index][name];
		let {value} = event;
		let callback;

		if (index === 0) {
			callback = this.changeAdditionalParameterFields(name);

			if (name === FIELDS.xAxis) {
				const {parameter} = values;

				setFieldValue(FIELDS.parameter, {
					...parameter,
					name: getProcessedValue(value, 'title')
				});
			}
		}

		value = transformAttribute(event, this.handleSelect, index);

		if (index === 0 && (!currentValue || currentValue.type !== value.type)) {
			setDataFieldValue(index, FIELDS.group, getDefaultSystemGroup(value));
		}

		setDataFieldValue(index, name, value, callback);
	};

	isDisabled = (index: number) => {
		const {data} = this.props.values;
		const mainSource = data[0][FIELDS.source];
		const currentSource = data[index][FIELDS.source];

		return index !== 0 && mainSource && currentSource && mainSource.value === currentSource.value;
	};

	renderParameterFieldset = (set: DataSet, index: number) => {
		const {errors, name, values} = this.props;
		const errorKey = getDataErrorKey(index, name);

		return (
			<ParameterFieldset
				dataSet={set}
				disabled={this.isDisabled(index)}
				error={errors[errorKey]}
				filter={this.filter}
				group={set[FIELDS.group]}
				index={index}
				key={errorKey}
				mainSet={values.data[0]}
				name={name}
				onChangeGroup={this.handleChangeGroup}
				onChangeLabel={this.handleChangeAttributeTitle}
				onSelect={this.handleSelect}
				value={set[name]}
			/>
		);
	};

	render () {
		const {values} = this.props;

		return (
			<FormBox title="Параметр">
				{values.data.map(this.renderParameterFieldset)}
			</FormBox>
		);
	}
}

export default withForm(ParameterDataBox);
