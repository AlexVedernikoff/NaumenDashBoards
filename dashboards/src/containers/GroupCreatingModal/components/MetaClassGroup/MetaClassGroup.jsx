// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {connect} from 'react-redux';
import {createDefaultOperand, createMultiSelectOperand, createSimpleOperand} from 'CustomGroup/helpers';
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
import {MultiSelectOperand, SelectOperand, SimpleOperand} from 'CustomGroup/components';
import type {OnChangeOperandData} from 'CustomGroup/types';
import {OPERAND_TYPES} from 'store/customGroups/constants';
import type {Props, State} from './types';
import React, {Component} from 'react';
import {STRING_RULE} from 'CustomGroup/schema';

export class MetaClassGroup extends Component<Props, State> {
	state = {
		updateDate: new Date()
	};

	componentDidUpdate (prevProps: Props) {
		const {attribute, metaClasses: nextMetaClasses} = this.props;
		const {metaClasses: prevMetaClasses} = prevProps;
		const {metaClassFqn} = attribute;

		if (nextMetaClasses[metaClassFqn] !== prevMetaClasses[metaClassFqn]) {
			this.setState({updateDate: new Date()});
		}
	}

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

	getCustomGroups = (): Array<CustomGroup> => this.props.customGroups.filter(({type}) => type === ATTRIBUTE_TYPES.metaClass);

	getCustomProps = () => ({
		createCondition: this.createCustomCondition,
		groups: this.getCustomGroups(),
		options: CUSTOM_OPTIONS,
		renderCondition: this.renderCustomCondition,
		resolveConditionRule: this.resolveConditionRule,
		updateDate: this.state.updateDate
	});

	getSelectData = () => {
		const {attribute, metaClasses} = this.props;
		return metaClasses[attribute.metaClassFqn];
	};

	handleLoadData = () => {
		const {attribute, fetchMetaClassData} = this.props;
		fetchMetaClassData(attribute.metaClassFqn);
	};

	resolveConditionRule = (condition: RefOrCondition) => {
		const {TITLE_CONTAINS, TITLE_NOT_CONTAINS} = OPERAND_TYPES;

		switch (condition.type) {
			case TITLE_CONTAINS:
			case TITLE_NOT_CONTAINS:
				return STRING_RULE;
		}
	};

	renderCustomCondition = (condition: RefOrCondition, onChange: OnChangeOperandData) => {
		const {CONTAINS, CONTAINS_ANY, NOT_CONTAINS, TITLE_CONTAINS, TITLE_NOT_CONTAINS} = OPERAND_TYPES;

		switch (condition.type) {
			case CONTAINS:
			case NOT_CONTAINS:
				return this.renderSelectOperand(condition, onChange);
			case CONTAINS_ANY:
				return this.renderMultiSelectOperand(condition, onChange);
			case TITLE_CONTAINS:
			case TITLE_NOT_CONTAINS:
				return this.renderSimpleOperand(condition, onChange);
		}
	};

	renderMultiSelectOperand = (operand: MultiSelectOperandType, onChange: OnChangeOperandData) => (
		<MultiSelectOperand
			data={this.getSelectData()}
			onChange={onChange}
			onLoadData={this.handleLoadData}
			operand={operand}
		/>
	);

	renderSelectOperand = (operand: SelectOperandType, onChange: OnChangeOperandData) => (
		<SelectOperand
			data={this.getSelectData()}
			onChange={onChange}
			onLoadData={this.handleLoadData}
			operand={operand}
		/>
	);

	renderSimpleOperand = (operand: SimpleOperandType, onChange: OnChangeOperandData) => (
		<SimpleOperand onChange={onChange} operand={operand} />
	);

	render () {
		return this.props.renderModal(this.getCustomProps());
	}
}

export default connect(props, functions)(MetaClassGroup);
