// @flow
import type {AttributeGroupProps} from 'containers/GroupCreatingModal/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {BetweenOperand, SimpleOperand} from 'CustomGroup/components';
import type {
	BetweenOperand as BetweenOperandType,
	CustomGroup,
	DateOrCondition,
	OperandType,
	SimpleOperand as SimpleOperandType
} from 'store/customGroups/types';
import {BETWEEN_RULE, INTEGER_RULE} from 'CustomGroup/schema';
import {createBetweenOperand, createDefaultOperand, createSimpleOperand} from 'CustomGroup/helpers';
import {CUSTOM_OPTIONS, DATETIME_SYSTEM_OPTIONS, SYSTEM_OPTIONS} from './constants';
import {DateSystemGroup} from 'components/molecules/GroupCreatingModal/components';
import {DATETIME_SYSTEM_GROUP} from 'store/widgets/constants';
import type {OnChangeOperand} from 'CustomGroup/types';
import {OPERAND_TYPES} from 'store/customGroups/constants';
import type {Props as SystemGroupProps} from 'components/molecules/GroupCreatingModal/components/SystemGroup/types';
import React, {Component} from 'react';

export class DateGroup extends Component<AttributeGroupProps> {
	createCustomCondition = (type: OperandType = OPERAND_TYPES.BETWEEN) => {
		const {BETWEEN, LAST, NEAR} = OPERAND_TYPES;

		switch (type) {
			case BETWEEN:
				return createBetweenOperand(type);
			case LAST:
			case NEAR:
				return createSimpleOperand(type);
			default:
				return createDefaultOperand(type);
		}
	};

	getCustomGroups = (): Array<CustomGroup> => {
		const {customGroups} = this.props;
		const {date, dateTime} = ATTRIBUTE_TYPES;

		return customGroups.filter(({type}) => type === date || type === dateTime);
	};

	getCustomProps = () => ({
		createCondition: this.createCustomCondition,
		groups: this.getCustomGroups(),
		options: CUSTOM_OPTIONS,
		renderCondition: this.renderCustomCondition,
		resolveConditionRule: this.resolveConditionRule,
		type: this.props.attribute.type
	});

	getSystemOptions = () => {
		return this.props.attribute.type === ATTRIBUTE_TYPES.dateTime ? DATETIME_SYSTEM_OPTIONS : SYSTEM_OPTIONS;
	};

	resolveConditionRule = (condition: DateOrCondition) => {
		const {BETWEEN, LAST, NEAR} = OPERAND_TYPES;

		switch (condition.type) {
			case BETWEEN:
				return BETWEEN_RULE;
			case LAST:
			case NEAR:
				return INTEGER_RULE;
		}
	};

	renderBetweenOperand = (operand: BetweenOperandType, onChange: OnChangeOperand) => (
		<BetweenOperand onChange={onChange} operand={operand} />
	);

	renderCustomCondition = (condition: DateOrCondition, onChange: OnChangeOperand) => {
		const {BETWEEN, LAST, NEAR} = OPERAND_TYPES;

		switch (condition.type) {
			case BETWEEN:
				return this.renderBetweenOperand(condition, onChange);
			case LAST:
			case NEAR:
				return this.renderSimpleOperand(condition, onChange);
		}
	};

	renderSimpleOperand = (operand: SimpleOperandType, onChange: OnChangeOperand) => (
		<SimpleOperand onChange={onChange} onlyNumber={true} operand={operand} />
	);

	renderSystemGroup = (props: $Shape<SystemGroupProps>) => {
		const {attribute} = this.props;

		return (
			<DateSystemGroup
				{...props}
				attribute={attribute}
				defaultValue={DATETIME_SYSTEM_GROUP.MONTH}
				options={this.getSystemOptions()}
			/>
		);
	};

	render () {
		return this.props.renderModal({
			customProps: this.getCustomProps(),
			renderSystemGroup: this.renderSystemGroup
		});
	}
}

export default DateGroup;
