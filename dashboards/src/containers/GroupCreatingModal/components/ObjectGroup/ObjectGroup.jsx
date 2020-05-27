// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {connect} from 'react-redux';
import {createCustomGroupType} from 'containers/GroupCreatingModal/helpers';
import {createDefaultOperand, createMultiSelectOperand, createSimpleOperand} from 'CustomGroup/helpers';
import {CurrentObjectOperand, MultiSelectOperand, SelectOperand, SimpleOperand} from 'CustomGroup/components';
import {CUSTOM_BACK_BO_LINKS_OPTIONS, CUSTOM_BO_LINKS_OPTIONS, CUSTOM_OBJECT_OPTIONS} from './constants';
import type {
	CustomGroup,
	MultiSelectOperand as MultiSelectOperandType,
	OperandType,
	RefOrCondition, SelectData,
	SelectOperand as SelectOperandType,
	SimpleOperand as SimpleOperandType
} from 'store/customGroups/types';
import {functions, props} from './selectors';
import {MaterialTreeSelect} from 'components/molecules';
import type {OnChangeOperand} from 'CustomGroup/types';
import {OPERAND_TYPES} from 'store/customGroups/constants';
import type {Props, State} from './types';
import React, {Component} from 'react';
import type {RenderProps as SelectRenderProps} from 'CustomGroup/components/SelectOperand/types';
import type {RenderProps as MultiSelectRenderProps} from 'CustomGroup/components/MultiSelectOperand/types';
import {STRING_RULE} from 'CustomGroup/schema';

export class ObjectGroup extends Component<Props, State> {
	state = {
		customType: ''
	};

	componentDidMount () {
		const {attribute} = this.props;
		const {property, type} = attribute;

		this.setState({
			customType: createCustomGroupType(type, property)
		});
	}

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

	getCustomGroups = (): Array<CustomGroup> => this.props.customGroups.filter(({type}) => type === this.state.customType);

	getCustomProps = () => {
		const {currentObject, objects} = this.props;
		const {customType: type} = this.state;
		const operandData = {
			currentObject,
			objects
		};

		return {
			createCondition: this.createCustomCondition,
			groups: this.getCustomGroups(),
			operandData,
			options: this.getOptions(),
			renderCondition: this.renderCustomCondition,
			resolveConditionRule: this.resolveConditionRule,
			type
		};
	};

	getObjectSelectProps = (actual: boolean) => {
		const {attribute, objects} = this.props;
		const map = actual ? objects.actual : objects.all;

		const {[attribute.property]: data = {
			error: false,
			items: {},
			loading: true,
			uploaded: false
		}} = map;
		const {error, items: options, loading, uploaded} = data;
		const showMore = !(loading || uploaded || error);

		return {
			async: true,
			key: actual.toString(),
			onLoad: this.handleLoadData(actual),
			options,
			showMore
		};
	};

	getOptionLabel = (option: SelectData) => option.title;

	getOptionValue = (option: SelectData) => option.uuid;

	getOptions = () => {
		const {attribute} = this.props;
		const {backBOLinks, boLinks, object} = ATTRIBUTE_TYPES;

		switch (attribute.type) {
			case backBOLinks:
				return CUSTOM_BACK_BO_LINKS_OPTIONS;
			case boLinks:
				return CUSTOM_BO_LINKS_OPTIONS;
			case object:
				return CUSTOM_OBJECT_OPTIONS;
			default:
				return [];
		}
	};

	handleLoadData = (actual: boolean) => (node?: Object, offset?: number = 0) => {
		const {attribute, fetchObjectData} = this.props;
		const parentUUID = node ? node.id : null;

		fetchObjectData({
			actual,
			offset,
			parentUUID,
			property: attribute.property
		});
	};

	hasActualType = (condition: RefOrCondition) => {
		const {CONTAINS_INCLUDING_ARCHIVAL, NOT_CONTAINS_INCLUDING_ARCHIVAL} = OPERAND_TYPES;
		return ![CONTAINS_INCLUDING_ARCHIVAL, NOT_CONTAINS_INCLUDING_ARCHIVAL].includes(condition.type);
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
			CONTAINS_INCLUDING_ARCHIVAL,
			CONTAINS_INCLUDING_NESTED,
			EQUAL_ATTR_CURRENT_OBJECT,
			NOT_CONTAINS,
			NOT_CONTAINS_INCLUDING_ARCHIVAL,
			TITLE_CONTAINS,
			TITLE_NOT_CONTAINS
		} = OPERAND_TYPES;

		switch (condition.type) {
			case CONTAINS:
			case CONTAINS_INCLUDING_ARCHIVAL:
			case CONTAINS_INCLUDING_NESTED:
			case NOT_CONTAINS:
			case NOT_CONTAINS_INCLUDING_ARCHIVAL:
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

	renderMultiSelect = (actual: boolean) => (props: MultiSelectRenderProps) => (
		<MaterialTreeSelect
			getOptionLabel={this.getOptionLabel}
			getOptionValue={this.getOptionValue}
			multiple={true}
			{...this.getObjectSelectProps(actual)}
			{...props}
		/>
	);

	renderMultiSelectOperand = (operand: MultiSelectOperandType, onChange: OnChangeOperand) => {
		const actual = this.hasActualType(operand);

		return (
			<MultiSelectOperand
				convert={this.convertOperandData}
				getOptionValue={this.getOptionValue}
				onChange={onChange}
				operand={operand}
				render={this.renderMultiSelect(actual)}
			/>
		);
	};

	renderSelect = (actual: boolean) => (props: SelectRenderProps) => (
		<MaterialTreeSelect
			getOptionLabel={this.getOptionLabel}
			getOptionValue={this.getOptionValue}
			{...this.getObjectSelectProps(actual)}
			{...props}
		/>
	);

	renderSelectOperand = (operand: SelectOperandType, onChange: OnChangeOperand) => {
		const actual = this.hasActualType(operand);

		return (
			<SelectOperand
				convert={this.convertOperandData}
				onChange={onChange}
				operand={operand}
				render={this.renderSelect(actual)}
			/>
		);
	};

	renderSimpleOperand = (operand: SimpleOperandType, onChange: OnChangeOperand) => (
		<SimpleOperand onChange={onChange} operand={operand} />
	);

	render () {
		return this.props.renderModal(this.getCustomProps());
	}
}

export default connect(props, functions)(ObjectGroup);
