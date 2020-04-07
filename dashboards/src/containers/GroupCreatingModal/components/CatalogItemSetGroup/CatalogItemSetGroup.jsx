// @flow
import {connect} from 'react-redux';
import {createCustomGroupType} from 'containers/GroupCreatingModal/helpers';
import {createDefaultOperand, createSimpleOperand} from 'CustomGroup/helpers';
import type {
	CustomGroup,
	OperandType,
	RefOrCondition, SelectData,
	SelectOperand as SelectOperandType,
	SimpleOperand as SimpleOperandType
} from 'store/customGroups/types';
import {CUSTOM_OPTIONS} from './constants';
import {functions, props} from './selectors';
import {MaterialSimpleTreeSelect} from 'components/molecules';
import type {OnChangeOperand} from 'CustomGroup/types';
import {OPERAND_TYPES} from 'store/customGroups/constants';
import type {Props, State} from './types';
import React, {Component} from 'react';
import type {RenderProps as SelectRenderProps} from 'CustomGroup/components/SelectOperand/types';
import {SelectOperand, SimpleOperand} from 'CustomGroup/components';
import {STRING_RULE} from 'CustomGroup/schema';

export class CatalogItemSetGroup extends Component<Props, State> {
	static defaultProps = {
		selectData: {
			error: false,
			items: [],
			loading: true
		}
	};

	state = {
		customType: '',
		updateDate: new Date()
	};

	componentDidMount () {
		const {attribute} = this.props;
		const {property, type} = attribute;

		this.setState({
			customType: createCustomGroupType(type, property)
		});
	}

	componentDidUpdate (prevProps: Props) {
		const {selectData: nextData} = this.props;
		const {selectData: prevData} = prevProps;

		if (nextData !== prevData) {
			this.setState({updateDate: new Date()});
		}
	}

	createCustomCondition = (type: OperandType = OPERAND_TYPES.CONTAINS) => {
		const {TITLE_CONTAINS, TITLE_NOT_CONTAINS} = OPERAND_TYPES;

		switch (type) {
			case TITLE_CONTAINS:
			case TITLE_NOT_CONTAINS:
				return createSimpleOperand(type);
			default:
				return createDefaultOperand(type);
		}
	};

	getCustomGroups = (): Array<CustomGroup> => this.props.customGroups
		.filter(({type}) => type === this.state.customType);

	getCustomProps = () => {
		const {customType: type, updateDate} = this.state;

		return {
			createCondition: this.createCustomCondition,
			groups: this.getCustomGroups(),
			options: CUSTOM_OPTIONS,
			renderCondition: this.renderCustomCondition,
			resolveConditionRule: this.resolveConditionRule,
			type,
			updateDate
		};
	};

	getOptionLabel = (option: SelectData) => option.title;

	getOptionValue = (option: SelectData) => option.uuid;

	handleLoadData = () => {
		const {attribute, fetchCatalogItemSetData} = this.props;
		fetchCatalogItemSetData(attribute.property);
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
		const {CONTAINS, NOT_CONTAINS, TITLE_CONTAINS, TITLE_NOT_CONTAINS} = OPERAND_TYPES;

		switch (condition.type) {
			case CONTAINS:
			case NOT_CONTAINS:
				return this.renderSelectOperand(condition, onChange);
			case TITLE_CONTAINS:
			case TITLE_NOT_CONTAINS:
				return this.renderSimpleOperand(condition, onChange);
		}
	};

	renderSelect = (props: SelectRenderProps) => {
		const {items} = this.props.selectData;

		return (
			<MaterialSimpleTreeSelect
				async={true}
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				onLoadOptions={this.handleLoadData}
				options={items}
				{...props}
			/>
		);
	};

	renderSelectOperand = (operand: SelectOperandType, onChange: OnChangeOperand) => (
		<SelectOperand onChange={onChange} operand={operand} render={this.renderSelect} />
	);

	renderSimpleOperand = (operand: SimpleOperandType, onChange: OnChangeOperand) => (
		<SimpleOperand onChange={onChange} operand={operand} />
	);

	render () {
		return this.props.renderModal(this.getCustomProps());
	}
}

export default connect(props, functions)(CatalogItemSetGroup);
