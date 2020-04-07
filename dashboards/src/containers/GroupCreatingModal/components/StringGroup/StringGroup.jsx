// @flow
import type {AttributeGroupProps} from 'containers/GroupCreatingModal/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {createDefaultOperand, createIntervalOperand} from 'CustomGroup/helpers';
import type {
	CustomGroup,
	OperandType,
	SimpleOperand as SimpleOperandType,
	StringOrCondition
} from 'store/customGroups/types';
import {CUSTOM_OPTIONS} from './constants';
import type {OnChangeOperand} from 'CustomGroup/types';
import {OPERAND_TYPES} from 'store/customGroups/constants';
import React, {Component} from 'react';
import {SimpleOperand} from 'CustomGroup/components';
import {STRING_RULE} from 'CustomGroup/schema';

export class StringGroup extends Component<AttributeGroupProps> {
	createCustomCondition = (type: OperandType = OPERAND_TYPES.EQUAL) => {
		const {CONTAINS, NOT_CONTAINS, NOT_CONTAINS_INCLUDING_EMPTY} = OPERAND_TYPES;

		switch (type) {
			case CONTAINS:
			case NOT_CONTAINS:
			case NOT_CONTAINS_INCLUDING_EMPTY:
				return createIntervalOperand(type);
			default:
				return createDefaultOperand(type);
		}
	};

	getCustomGroups = (): Array<CustomGroup> => this.props.customGroups.filter(({type}) => type === ATTRIBUTE_TYPES.string);

	getCustomProps = () => ({
		createCondition: this.createCustomCondition,
		groups: this.getCustomGroups(),
		options: CUSTOM_OPTIONS,
		renderCondition: this.renderCustomCondition,
		resolveConditionRule: this.resolveConditionRule,
		type: ATTRIBUTE_TYPES.string
	});

	resolveConditionRule = (condition: StringOrCondition) => {
		const {CONTAINS, NOT_CONTAINS, NOT_CONTAINS_INCLUDING_EMPTY} = OPERAND_TYPES;

		switch (condition.type) {
			case CONTAINS:
			case NOT_CONTAINS:
			case NOT_CONTAINS_INCLUDING_EMPTY:
				return STRING_RULE;
		}
	};

	renderCustomCondition = (condition: StringOrCondition, onChange: OnChangeOperand) => {
		const {CONTAINS, NOT_CONTAINS, NOT_CONTAINS_INCLUDING_EMPTY} = OPERAND_TYPES;

		switch (condition.type) {
			case CONTAINS:
			case NOT_CONTAINS:
			case NOT_CONTAINS_INCLUDING_EMPTY:
				return this.renderSimpleOperand(condition, onChange);
		}
	};

	renderSimpleOperand = (operand: SimpleOperandType, onChange: OnChangeOperand) => (
		<SimpleOperand onChange={onChange} operand={operand} />
	);

	render () {
		return this.props.renderModal(this.getCustomProps());
	}
}

export default StringGroup;
