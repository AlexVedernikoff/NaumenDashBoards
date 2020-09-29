// @flow
import {FIELDS} from 'WidgetFormPanel/constants';
import {FormBox} from 'components/molecules';
import {getDataErrorKey} from 'WidgetFormPanel/helpers';
import {getDefaultParameter} from 'WidgetFormPanel/components/TableForm/helpers';
import {getDefaultSystemGroup} from 'store/widgets/helpers';
import type {Group, Parameter} from 'store/widgets/data/types';
import type {GroupAttributeField} from 'WidgetFormPanel/components/AttributeGroupField/types';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'WidgetFormPanel/types';
import {ParameterFieldset, SortableList} from 'WidgetFormPanel/components';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import withForm from 'WidgetFormPanel/withForm';

export class ParametersBox extends PureComponent<Props> {
	getParameters = () => {
		const {parameters = [getDefaultParameter()]} = this.props.set;
		return parameters;
	};

	handleChangeAttributeTitle = (event: OnChangeAttributeLabelEvent, index: number) => {
		const {changeAttributeTitle, index: dataSetIndex, setDataFieldValue} = this.props;
		const {label, parent} = event;
		const parameters = this.getParameters();

		parameters[index] = {
			...parameters[index],
			attribute: changeAttributeTitle(parameters[index].attribute, parent, label)
		};

		setDataFieldValue(dataSetIndex, FIELDS.parameters, parameters);
	};

	handleChangeGroup = (index: number, name: string, value: Group, field: GroupAttributeField) => {
		const {index: dataSetIndex, setDataFieldValue} = this.props;
		const {parent, value: attribute} = field;
		const event = {
			label: attribute.title,
			name: FIELDS.parameters,
			parent
		};
		const parameters = this.getParameters();
		parameters[index] = {...parameters[index], group: value};

		this.handleChangeAttributeTitle(event, index);
		setDataFieldValue(dataSetIndex, FIELDS.parameters, parameters);
	};

	handleChangeOrder = (parameters: Array<Object>) => {
		const {index, setDataFieldValue} = this.props;
		setDataFieldValue(index, FIELDS.parameters, parameters);
	};

	handleClickAddInput = () => {
		const {index, setDataFieldValue} = this.props;
		setDataFieldValue(index, FIELDS.parameters, [...this.getParameters(), getDefaultParameter()]);
	};

	handleClickSumInput = () => {
		const {calcTotalRow, setFieldValue} = this.props;
		setFieldValue(FIELDS.calcTotalRow, !calcTotalRow);
	};

	handleRemove = (index: number) => {
		const {index: dataSetIndex, setDataFieldValue} = this.props;
		const parameters = this.getParameters();

		if (parameters.length > 1) {
			parameters.splice(index, 1);
			setDataFieldValue(dataSetIndex, FIELDS.parameters, parameters);
		}
	};

	handleSelect = (event: OnSelectAttributeEvent, index: number) => {
		const {index: dataSetIndex, setDataFieldValue, transformAttribute} = this.props;
		const parameters = this.getParameters();
		const currentValue = parameters[index].attribute;
		let attribute;

		attribute = transformAttribute(event, this.handleSelect, index);

		if (dataSetIndex === 0 && (!currentValue || currentValue.type !== attribute.type)) {
			parameters[index] = {...parameters[index], [FIELDS.group]: getDefaultSystemGroup(attribute)};
		}

		parameters[index] = {...parameters[index], attribute};

		setDataFieldValue(dataSetIndex, FIELDS.parameters, parameters);
	};

	renderFieldset = (parameter: Parameter, index: number, parameters: Array<Parameter>) => {
		const {errors, index: dataSetIndex, set} = this.props;
		const {attribute, group} = parameter;
		const removable = parameters.length > 1;
		const errorKey = getDataErrorKey(dataSetIndex, FIELDS.parameters, index, FIELDS.attribute);

		return (
			<ParameterFieldset
				dataSet={set}
				error={errors[errorKey]}
				group={group}
				index={index}
				key={index}
				name={FIELDS.attribute}
				onChangeGroup={this.handleChangeGroup}
				onChangeLabel={this.handleChangeAttributeTitle}
				onRemove={this.handleRemove}
				onSelect={this.handleSelect}
				removable={removable}
				value={attribute}
			/>
		);
	};

	renderRightControl = () => {
		const {calcTotalRow, renderAddInput, renderSumInput} = this.props;
		const sumInputProps = {
			active: calcTotalRow,
			onClick: this.handleClickSumInput
		};
		const addInputProps = {
			onClick: this.handleClickAddInput
		};

		return (
			<Fragment>
				{renderSumInput(sumInputProps)}
				{renderAddInput(addInputProps)}
			</Fragment>
		);
	};

	render () {
		return (
			<FormBox rightControl={this.renderRightControl()} title="Параметры">
				<SortableList
					list={this.getParameters()}
					onChangeOrder={this.handleChangeOrder}
					renderItem={this.renderFieldset}
				/>
			</FormBox>
		);
	}
}

export default withForm(ParametersBox);