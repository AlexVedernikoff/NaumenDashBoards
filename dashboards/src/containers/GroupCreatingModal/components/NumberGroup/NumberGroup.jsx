// @flow
import type {AttributeGroupProps} from 'containers/GroupCreatingModal/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {createDefaultOperand, createSimpleOperand} from 'CustomGroup/helpers';
import type {
	CustomGroup,
	NumberOrCondition,
	OperandType,
	SimpleOperand as SimpleOperandType
} from 'store/customGroups/types';
import {CUSTOM_OPTIONS} from './constants';
import {FLOAT_RULE, INTEGER_RULE} from 'CustomGroup/schema';
import type {OnChangeOperandData} from 'CustomGroup/types';
import {OPERAND_TYPES} from 'store/customGroups/constants';
import React, {Component} from 'react';
import {SimpleOperand} from 'CustomGroup/components';

export class NumberGroup extends Component<AttributeGroupProps> {
	createCustomCondition = (type: OperandType = OPERAND_TYPES.EQUAL) => {
		const {EQUAL, GREATER, LESS, NOT_EQUAL, NOT_EQUAL_NOT_EMPTY} = OPERAND_TYPES;

		switch (type) {
			case EQUAL:
			case GREATER:
			case LESS:
			case NOT_EQUAL:
			case NOT_EQUAL_NOT_EMPTY:
				return createSimpleOperand(type);
			default:
				return createDefaultOperand(type);
		}
	};

	getCustomGroups = (): Array<CustomGroup> => {
		const {attribute, customGroups} = this.props;
		return customGroups.filter(({type}) => type === attribute.type);
	};

	getCustomProps = () => ({
		createCondition: this.createCustomCondition,
		groups: this.getCustomGroups(),
		options: CUSTOM_OPTIONS,
		renderCondition: this.renderCustomCondition,
		resolveConditionRule: this.resolveConditionRule
	});

	resolveConditionRule = (condition: NumberOrCondition) => {
		const {attribute} = this.props;
		const {EQUAL, GREATER, LESS, NOT_EQUAL, NOT_EQUAL_NOT_EMPTY} = OPERAND_TYPES;

		switch (condition.type) {
			case EQUAL:
			case GREATER:
			case LESS:
			case NOT_EQUAL:
			case NOT_EQUAL_NOT_EMPTY:
				return attribute.type === ATTRIBUTE_TYPES.integer ? INTEGER_RULE : FLOAT_RULE;
		}
	};

	renderCustomCondition = (condition: NumberOrCondition, onChange: OnChangeOperandData) => {
		const {EQUAL, GREATER, LESS, NOT_EQUAL, NOT_EQUAL_NOT_EMPTY} = OPERAND_TYPES;

		switch (condition.type) {
			case EQUAL:
			case GREATER:
			case LESS:
			case NOT_EQUAL:
			case NOT_EQUAL_NOT_EMPTY:
				return this.renderSimpleOperand(condition, onChange);
		}
	};

	renderSimpleOperand = (operand: SimpleOperandType, onChange: OnChangeOperandData) => {
		const {attribute} = this.props;
		const float = attribute.type === ATTRIBUTE_TYPES.double;

		return (
			<SimpleOperand float={float} onChange={onChange} operand={operand} />
		);
	};

	render () {
		return this.props.renderModal(this.getCustomProps());
	}
}

export default NumberGroup;
