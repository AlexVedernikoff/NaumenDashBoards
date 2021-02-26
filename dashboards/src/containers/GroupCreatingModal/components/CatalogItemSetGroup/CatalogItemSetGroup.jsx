// @flow
import {connect} from 'react-redux';
import {createCustomGroupType} from 'containers/GroupCreatingModal/helpers';
import {createDefaultOperand, createSimpleOperand} from 'CustomGroup/helpers';
import CurrentObjectOperand from 'CustomGroup/components/CurrentObjectOperand';
import type {
	CustomGroup,
	OperandType,
	RefOrCondition, SelectData,
	SelectOperand as SelectOperandType,
	SimpleOperand as SimpleOperandType
} from 'store/customGroups/types';
import {CUSTOM_OPTIONS} from './constants';
import {functions, props} from './selectors';
import MaterialTreeSelect from 'components/molecules/MaterialTreeSelect';
import type {OnChangeOperand} from 'CustomGroup/types';
import {OPERAND_TYPES} from 'store/customGroups/constants';
import type {Props, State} from './types';
import React, {Component} from 'react';
import type {RenderProps as SelectRenderProps} from 'CustomGroup/components/SelectOperand/types';
import SelectOperand from 'CustomGroup/components/SelectOperand';
import SimpleOperand from 'CustomGroup/components/SimpleOperand';
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
		const {currentObject, selectData} = this.props;
		const {customType: type} = this.state;
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
			type
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
		const {CONTAINS, CONTAINS_ATTR_CURRENT_OBJECT, NOT_CONTAINS, TITLE_CONTAINS, TITLE_NOT_CONTAINS} = OPERAND_TYPES;

		switch (condition.type) {
			case CONTAINS:
			case NOT_CONTAINS:
				return this.renderSelectOperand(condition, onChange);
			case CONTAINS_ATTR_CURRENT_OBJECT:
				return this.renderCurrentObjectOperand(condition, onChange);
			case TITLE_CONTAINS:
			case TITLE_NOT_CONTAINS:
				return this.renderSimpleOperand(condition, onChange);
		}
	};

	renderSelect = (props: SelectRenderProps) => {
		const {error, items, loading} = this.props.selectData;

		return (
			<MaterialTreeSelect
				async={true}
				error={error}
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				loading={loading}
				onLoad={this.handleLoadData}
				options={items}
				{...props}
			/>
		);
	};

	renderSelectOperand = (operand: SelectOperandType, onChange: OnChangeOperand) => (
		<SelectOperand convert={this.convertOperandData} onChange={onChange} operand={operand} render={this.renderSelect} />
	);

	renderSimpleOperand = (operand: SimpleOperandType, onChange: OnChangeOperand) => (
		<SimpleOperand onChange={onChange} operand={operand} />
	);

	render () {
		return this.props.renderModal({
			customProps: this.getCustomProps()
		});
	}
}

export default connect(props, functions)(CatalogItemSetGroup);
