// @flow
import type {AttributeGroupProps} from 'containers/GroupCreatingModal/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {createDefaultOperand, createIntervalOperand} from 'CustomGroup/helpers';
import type {CustomGroup, IntervalOperand as IntervalOperandType, IntervalOrCondition, OperandType} from 'store/customGroups/types';
import {CUSTOM_OPTIONS, SYSTEM_OPTIONS} from './constants';
import IntervalOperand from 'CustomGroup/components/IntervalOperand';
import {INTERVAL_RULE} from 'CustomGroup/schema';
import {INTERVAL_SYSTEM_GROUP} from 'store/widgets/constants';
import type {OnChangeOperand} from 'CustomGroup/types';
import {OPERAND_TYPES} from 'store/customGroups/constants';
import React, {Component} from 'react';

export class IntervalGroup extends Component<AttributeGroupProps> {
	createCustomCondition = (type: OperandType = OPERAND_TYPES.EQUAL) => {
		const {EQUAL, GREATER, LESS, NOT_EQUAL} = OPERAND_TYPES;

		switch (type) {
			case EQUAL:
			case GREATER:
			case LESS:
			case NOT_EQUAL:
				return createIntervalOperand(type);
			default:
				return createDefaultOperand(type);
		}
	};

	getCustomGroups = (): Array<CustomGroup> => this.props.customGroups
		.filter(({type}) => type === ATTRIBUTE_TYPES.dtInterval);

	getCustomProps = () => ({
		createCondition: this.createCustomCondition,
		getErrorKey: this.getErrorKey,
		groups: this.getCustomGroups(),
		options: CUSTOM_OPTIONS,
		renderCondition: this.renderCustomCondition,
		resolveConditionRule: this.resolveConditionRule,
		type: this.props.attribute.type
	});

	getErrorKey = (key: string) => `${key}.value`;

	getSystemProps = () => ({
		defaultValue: INTERVAL_SYSTEM_GROUP.WEEK,
		options: SYSTEM_OPTIONS
	});

	resolveConditionRule = (condition: IntervalOrCondition) => {
		const {EQUAL, GREATER, LESS, NOT_EQUAL} = OPERAND_TYPES;

		switch (condition.type) {
			case EQUAL:
			case GREATER:
			case LESS:
			case NOT_EQUAL:
				return INTERVAL_RULE;
		}
	};

	renderCustomCondition = (condition: IntervalOrCondition, onChange: OnChangeOperand) => {
		const {EQUAL, GREATER, LESS, NOT_EQUAL} = OPERAND_TYPES;

		switch (condition.type) {
			case EQUAL:
			case GREATER:
			case LESS:
			case NOT_EQUAL:
				return this.renderIntervalOperand(condition, onChange);
		}
	};

	renderIntervalOperand = (operand: IntervalOperandType, onChange: OnChangeOperand) => (
		<IntervalOperand onChange={onChange} operand={operand} />
	);

	render () {
		return this.props.renderModal({
			customProps: this.getCustomProps(),
			systemProps: this.getSystemProps()
		});
	}
}

export default IntervalGroup;
