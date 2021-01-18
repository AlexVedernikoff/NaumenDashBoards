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
import {debounce} from 'src/helpers';
import {functions, props} from './selectors';
import {getObjectKey} from 'store/sources/attributesData/objects/helpers';
import {MaterialTreeSelect} from 'components/molecules';
import {Node} from 'components/molecules/MaterialTreeSelect/components';
import {OBJECTS_DATA_TYPES} from 'store/sources/attributesData/objects/constants';
import type {OnChangeOperand} from 'CustomGroup/types';
import {OPERAND_TYPES} from 'store/customGroups/constants';
import type {Props, State} from './types';
import React, {Component} from 'react';
import type {RenderProps as SelectRenderProps} from 'CustomGroup/components/SelectOperand/types';
import type {RenderProps as MultiSelectRenderProps} from 'CustomGroup/components/MultiSelectOperand/types';
import {SearchInput} from 'components/atoms';
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

	getDataType = (actual: boolean) => {
		const {ACTUAL, ALL, FOUND} = OBJECTS_DATA_TYPES;
		let type = ALL;

		if (this.isSearching()) {
			type = FOUND;
		} else if (actual) {
			type = ACTUAL;
		}

		return type;
	};

	getObjectId = () => {
		const {attribute, source} = this.props;
		return getObjectKey(attribute, source);
	};

	getObjectSelectData = (actual: boolean) => {
		const {actual: actualMap, all: allMap, found} = this.props.objects;
		const id = this.getObjectId();
		const {[id]: foundData} = found;
		let data;

		if (this.isSearching()) {
			data = foundData;
		} else {
			const map = actual ? actualMap : allMap;

			({[id]: data = {
				error: false,
				items: {},
				loading: true,
				uploaded: false
			}} = map);
		}

		return data;
	};

	getObjectSelectProps = (actual: boolean) => {
		const {error, items: options, loading, uploaded} = this.getObjectSelectData(actual);
		const showMore = !(loading || uploaded || error);
		const components = {
			Node: this.renderNode,
			SearchInput: this.renderSearchInput
		};

		return {
			async: true,
			components,
			key: actual.toString(),
			loading,
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

	handleChangeSearchInput = async (searchValue: string) => {
		const {attribute, searchObjects, source} = this.props;
		searchObjects(source, attribute, searchValue);
	};

	handleLoadData = (actual: boolean) => (node?: Object, offset?: number = 0) => {
		const {attribute, fetchObjectData, source} = this.props;
		let parentUUID = null;
		let id = null;

		if (node) {
			id = node.id;
			parentUUID = node.value.uuid;
		}

		fetchObjectData({
			actual,
			attribute,
			id,
			offset,
			parentUUID,
			source,
			type: this.getDataType(actual)
		});
	};

	hasActualType = (condition: RefOrCondition) => {
		const {CONTAINS_INCLUDING_ARCHIVAL, NOT_CONTAINS_INCLUDING_ARCHIVAL} = OPERAND_TYPES;
		return ![CONTAINS_INCLUDING_ARCHIVAL, NOT_CONTAINS_INCLUDING_ARCHIVAL].includes(condition.type);
	};

	isSearching = (): boolean => {
		const {[this.getObjectId()]: foundData} = this.props.objects.found;
		return Boolean(foundData && foundData.searchValue);
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

	renderNode = (props: Object) => {
		const {[this.getObjectId()]: foundData = {}} = this.props.objects.found;
		const {searchValue} = foundData;

		return <Node {...props} searchValue={searchValue} />;
	};

	renderSearchInput = () => {
		const {[this.getObjectId()]: foundData = {
			searchValue: ''
		}} = this.props.objects.found;

		return (
			<SearchInput onChange={debounce(this.handleChangeSearchInput, 500)} value={foundData.searchValue} />
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
		return this.props.renderModal({
			customProps: this.getCustomProps()
		});
	}
}

export default connect(props, functions)(ObjectGroup);
