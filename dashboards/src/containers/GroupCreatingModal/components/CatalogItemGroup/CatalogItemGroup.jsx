// @flow
import {connect} from 'react-redux';
import {createCustomGroupType} from 'containers/GroupCreatingModal/helpers';
import {createDefaultOperand, createMultiSelectOperand, createSimpleOperand} from 'CustomGroup/helpers';
import {CurrentObjectOperand, MultiSelectOperand, SelectOperand, SimpleOperand} from 'CustomGroup/components';
import type {
	CustomGroup,
	MultiSelectOperand as MultiSelectOperandType,
	OperandType,
	RefOrCondition,
	SelectOperand as SelectOperandType,
	SimpleOperand as SimpleOperandType
} from 'store/customGroups/types';
import {CUSTOM_OPTIONS} from './constants';
import {functions, props} from './selectors';
import {MaterialTreeSelect} from 'components/molecules';
import type {OnChangeOperand} from 'CustomGroup/types';
import {OPERAND_TYPES} from 'store/customGroups/constants';
import type {Props} from './types';
import React, {Component} from 'react';
import type {RenderProps as SelectRenderProps} from 'CustomGroup/components/SelectOperand/types';
import type {RenderProps as MultiSelectRenderProps} from 'CustomGroup/components/MultiSelectOperand/types';
import {STRING_RULE} from 'CustomGroup/schema';

export class CatalogItemGroup extends Component<Props> {
	static defaultProps = {
		selectData: {
			error: false,
			items: [],
			loading: false
		}
	};

	convertOperandData = ({title, uuid}: Object) => ({
		title,
		uuid
	});

	createCustomCondition = (type: OperandType = OPERAND_TYPES.CONTAINS) => {
		const {CONTAINS_ANY, TITLE_CONTAINS, TITLE_NOT_CONTAINS} = OPERAND_TYPES;

		switch (type) {
			case CONTAINS_ANY:
				return createMultiSelectOperand(type);
			case TITLE_CONTAINS:
			case TITLE_NOT_CONTAINS:
				return createSimpleOperand(type);
			default:
				return createDefaultOperand(type);
		}
	};

	getCustomGroups = (): Array<CustomGroup> => {
		const customType = this.getCustomType();

		return this.props.customGroups.filter(({type}) => type === customType);
	};

	getCustomProps = () => {
		const {attribute, catalogItems, currentObject} = this.props;
		const selectData = catalogItems[attribute.property];
		const customType = this.getCustomType();
		const operandData = {
			currentObject,
			selectData
		};

		return {
			createCondition: this.createCustomCondition,
			groups: this.getCustomGroups(),
			operandData,
			options: CUSTOM_OPTIONS,
			renderCondition: this.renderCustomCondition,
			resolveConditionRule: this.resolveConditionRule,
			type: customType
		};
	};

	getCustomType = () => {
		const {property, type} = this.props.attribute;
		return createCustomGroupType(type, property);
	};

	getOptionLabel = (option: Object) => option.title;

	getOptionValue = (option: Object) => option.uuid;

	getSelectData = () => {
		const {attribute, catalogItems} = this.props;
		const {[attribute.property]: data = {
			error: false,
			items: {},
			loading: false
		}} = catalogItems;

		return data;
	};

	getSelectProps = () => {
		const {error, items, loading} = this.getSelectData();

		return ({
			async: true,
			error,
			getOptionLabel: this.getOptionLabel,
			getOptionValue: this.getOptionValue,
			loading,
			onLoad: this.handleLoadOptions,
			options: items
		});
	};

	handleLoadOptions = () => {
		const {attribute, fetchCatalogItemData} = this.props;
		fetchCatalogItemData(attribute.property);
	};

	resolveConditionRule = (condition: RefOrCondition) => {
		const {TITLE_CONTAINS, TITLE_NOT_CONTAINS} = OPERAND_TYPES;

		switch (condition.type) {
			case TITLE_CONTAINS:
			case TITLE_NOT_CONTAINS:
				return STRING_RULE;
		}
	};

	renderCurrentObjectOperand = (operand: SelectOperandType, onChange: OnChangeOperand) => {
		const {attribute, currentObject, fetchCurrentObjectAttributes} = this.props;

		return (
			<CurrentObjectOperand
				attribute={attribute}
				data={currentObject}
				fetch={fetchCurrentObjectAttributes}
				onChange={onChange}
				operand={operand}
			/>
		);
	};

	renderCustomCondition = (condition: RefOrCondition, onChange: OnChangeOperand) => {
		const {
			CONTAINS,
			CONTAINS_ANY,
			CONTAINS_ATTR_CURRENT_OBJECT,
			EQUAL_ATTR_CURRENT_OBJECT,
			NOT_CONTAINS,
			TITLE_CONTAINS,
			TITLE_NOT_CONTAINS
		} = OPERAND_TYPES;

		switch (condition.type) {
			case CONTAINS:
			case NOT_CONTAINS:
				return this.renderSelectOperand(condition, onChange);
			case CONTAINS_ANY:
				return this.renderMultiSelectOperand(condition, onChange);
			case TITLE_CONTAINS:
			case TITLE_NOT_CONTAINS:
				return this.renderSimpleOperand(condition, onChange);
			case CONTAINS_ATTR_CURRENT_OBJECT:
			case EQUAL_ATTR_CURRENT_OBJECT:
				return this.renderCurrentObjectOperand(condition, onChange);
		}
	};

	renderMultiSelect = (props: MultiSelectRenderProps) => (
		<MaterialTreeSelect multiple={true} {...this.getSelectProps()} {...props} />
	);

	renderMultiSelectOperand = (operand: MultiSelectOperandType, onChange: OnChangeOperand) => (
		<MultiSelectOperand
			convert={this.convertOperandData}
			getOptionValue={this.getOptionValue}
			onChange={onChange}
			operand={operand}
			render={this.renderMultiSelect}
		/>
	);

	renderSelect = (props: SelectRenderProps) => <MaterialTreeSelect {...this.getSelectProps()} {...props} />;

	renderSelectOperand = (operand: SelectOperandType, onChange: OnChangeOperand) => (
		<SelectOperand onChange={onChange} operand={operand} render={this.renderSelect} />
	);

	renderSimpleOperand = (operand: SimpleOperandType, onChange: OnChangeOperand) => (
		<SimpleOperand convert={this.convertOperandData} onChange={onChange} operand={operand} />
	);

	render () {
		return this.props.renderModal({
			customProps: this.getCustomProps()
		});
	}
}

export default connect(props, functions)(CatalogItemGroup);
