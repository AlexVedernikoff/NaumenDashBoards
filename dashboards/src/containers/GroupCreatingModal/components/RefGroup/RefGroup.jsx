// @flow
import {createDefaultOperand, createMultiSelectOperand, createSimpleOperand} from 'CustomGroup/helpers';
import type {
	CustomGroup,
	MultiSelectOperand as MultiSelectOperandType,
	OperandType,
	RefOrCondition,
	SelectOperand as SelectOperandType,
	SimpleOperand as SimpleOperandType
} from 'store/customGroups/types';
import {MaterialSelect} from 'components/molecules';
import {MultiSelectOperand, SelectOperand, SimpleOperand} from 'CustomGroup/components';
import type {OnChangeOperand} from 'CustomGroup/types';
import {OPERAND_TYPES} from 'store/customGroups/constants';
import type {Props, State} from './types';
import React, {Component} from 'react';
import type {RenderProps as SelectRenderProps} from 'CustomGroup/components/SelectOperand/types';
import type {RenderProps as MultiSelectRenderProps} from 'CustomGroup/components/MultiSelectOperand/types';
import {STRING_RULE} from 'CustomGroup/schema';

export class RefGroup extends Component<Props, State> {
	static defaultProps = {
		selectData: {
			error: false,
			items: [],
			loading: false
		}
	};

	state = {
		updateDate: new Date()
	};

	componentDidUpdate (prevProps: Props) {
		const {selectData: nextSelectData} = this.props;
		const {selectData: prevSelectData} = prevProps;

		if (nextSelectData !== prevSelectData) {
			this.setState({updateDate: new Date()});
		}
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

	getCustomGroups = (): Array<CustomGroup> => {
		const {customGroups, customType} = this.props;
		return customGroups.filter(({type}) => type === customType);
	};

	getCustomProps = () => {
		const {customOptions, customType} = this.props;
		const {updateDate} = this.state;

		return {
			createCondition: this.createCustomCondition,
			groups: this.getCustomGroups(),
			options: customOptions,
			renderCondition: this.renderCustomCondition,
			resolveConditionRule: this.resolveConditionRule,
			type: customType,
			updateDate
		};
	};

	getOptionLabel = (option: Object) => option.title;

	getOptionValue = (option: Object) => option.uuid;

	getSelectProps = () => {
		const {onLoadData, selectData} = this.props;
		const {items, loading} = selectData;

		return ({
			async: true,
			getOptionLabel: this.getOptionLabel,
			getOptionValue: this.getOptionValue,
			loading,
			onLoadOptions: onLoadData,
			options: items
		});
	};

	resolveConditionRule = (condition: RefOrCondition) => {
		const {TITLE_CONTAINS, TITLE_NOT_CONTAINS} = OPERAND_TYPES;

		switch (condition.type) {
			case TITLE_CONTAINS:
			case TITLE_NOT_CONTAINS:
				return STRING_RULE;
		}
	};

	renderCustomCondition = (condition: RefOrCondition, onChange: OnChangeOperand) => {
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

	renderMultiSelect = (props: MultiSelectRenderProps) => (
		<MaterialSelect multiple={true} {...this.getSelectProps()} {...props} />
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

	renderSelect = (props: SelectRenderProps) => <MaterialSelect {...this.getSelectProps()} {...props} />;

	renderSelectOperand = (operand: SelectOperandType, onChange: OnChangeOperand) => (
		<SelectOperand onChange={onChange} operand={operand} render={this.renderSelect} />
	);

	renderSimpleOperand = (operand: SimpleOperandType, onChange: OnChangeOperand) => (
		<SimpleOperand convert={this.convertOperandData} onChange={onChange} operand={operand} />
	);

	render () {
		return this.props.renderModal(this.getCustomProps());
	}
}

export default RefGroup;
