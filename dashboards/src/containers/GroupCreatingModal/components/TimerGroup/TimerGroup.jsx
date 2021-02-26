// @flow
import type {AttributeGroupProps as Props} from 'containers/GroupCreatingModal/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {
	BACK_TIMER_STATUS_OPTIONS,
	CUSTOM_BACK_TIMER_OPTIONS,
	CUSTOM_TIMER_OPTIONS,
	EXCEED_OPTIONS,
	TIMER_STATUS_OPTIONS
} from './constants';
import BetweenOperand from 'CustomGroup/components/BetweenOperand';
import type {
	BetweenOperand as BetweenOperandType,
	CustomGroup,
	OperandType,
	SelectOperand as SelectOperandType,
	TimerOrCondition
} from 'store/customGroups/types';
import {BETWEEN_RULE} from 'CustomGroup/schema';
import {createBetweenOperand, createDefaultOperand} from 'CustomGroup/helpers';
import MaterialSelect from 'components/molecules/MaterialSelect';
import type {OnChangeOperand} from 'CustomGroup/types';
import {OPERAND_TYPES} from 'store/customGroups/constants';
import React, {Component} from 'react';
import type {RenderProps as SelectRenderProps} from 'CustomGroup/components/SelectOperand/types';
import SelectOperand from 'CustomGroup/components/SelectOperand';

export class TimerGroup extends Component<Props> {
	createCustomCondition = (type: OperandType = OPERAND_TYPES.STATUS_CONTAINS) => {
		const {EXPIRES_BETWEEN} = OPERAND_TYPES;

		switch (type) {
			case EXPIRES_BETWEEN:
				return createBetweenOperand(type);
			default:
				return createDefaultOperand(type);
		}
	};

	getCustomGroups = (): Array<CustomGroup> => {
		const {attribute, customGroups} = this.props;

		return customGroups.filter(({type}) => type === attribute.type);
	};

	getCustomOptions = () => {
		const {attribute} = this.props;

		return attribute.type === ATTRIBUTE_TYPES.timer ? CUSTOM_TIMER_OPTIONS : CUSTOM_BACK_TIMER_OPTIONS;
	};

	getCustomProps = () => {
		const {attribute} = this.props;

		return {
			createCondition: this.createCustomCondition,
			groups: this.getCustomGroups(),
			options: this.getCustomOptions(),
			renderCondition: this.renderCustomCondition,
			resolveConditionRule: this.resolveConditionRule,
			type: attribute.type
		};
	};

	getStatusOptions = () => {
		const {attribute} = this.props;

		return attribute.type === ATTRIBUTE_TYPES.timer ? TIMER_STATUS_OPTIONS : BACK_TIMER_STATUS_OPTIONS;
	};

	resolveConditionRule = (condition: TimerOrCondition) => {
		const {EXPIRES_BETWEEN} = OPERAND_TYPES;

		switch (condition.type) {
			case EXPIRES_BETWEEN:
				return BETWEEN_RULE;
		}
	};

	renderBetweenOperand = (operand: BetweenOperandType, onChange: OnChangeOperand) => (
			<BetweenOperand onChange={onChange} operand={operand} />
	);

	renderCustomCondition = (condition: TimerOrCondition, onChange: OnChangeOperand) => {
		const {EXPIRATION_CONTAINS, EXPIRES_BETWEEN, STATUS_CONTAINS, STATUS_NOT_CONTAINS} = OPERAND_TYPES;

		switch (condition.type) {
			case EXPIRATION_CONTAINS:
				return this.renderSelectOperand(condition, onChange, EXCEED_OPTIONS);
			case STATUS_CONTAINS:
			case STATUS_NOT_CONTAINS:
				return this.renderSelectOperand(condition, onChange, this.getStatusOptions());
			case EXPIRES_BETWEEN:
				return this.renderBetweenOperand(condition, onChange);
		}
	};

	renderSelect = (options: Array<Object>) => (props: SelectRenderProps) => <MaterialSelect options={options} {...props} />;

	renderSelectOperand = (operand: SelectOperandType, onChange: OnChangeOperand, options: Array<Object>) => (
		<SelectOperand onChange={onChange} operand={operand} render={this.renderSelect(options)} />
	);

	render () {
		return this.props.renderModal({
			customProps: this.getCustomProps()
		});
	}
}

export default TimerGroup;
