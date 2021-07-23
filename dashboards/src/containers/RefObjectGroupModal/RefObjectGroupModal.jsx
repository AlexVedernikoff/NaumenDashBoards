// @flow
import {connect} from 'react-redux';
import CurrentObjectOrCondition from 'containers/CurrentObjectOrCondition';
import GroupModal from 'GroupModal';
import memoize from 'memoize-one';
import MultiSelectOrCondition from 'GroupModal/components/MultiSelectOrCondition';
import type {Option, Props, RenderProps} from './types';
import type {OrConditionProps} from 'GroupModal/types';
import {OR_CONDITION_TYPE_CONTEXT, SCHEMA} from './constants';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';
import {props} from './selectors';
import React, {Component} from 'react';
import SelectOrCondition from 'GroupModal/components/SelectOrCondition';
import SimpleOrCondition from 'GroupModal/components/SimpleOrCondition';

export class RefObjectGroupModal extends Component<Props> {
	static defaultProps = {
		components: {
			Select: () => null
		}
	};

	getComponents = memoize(() => ({
		...GroupModal.defaultProps.components,
		OrCondition: this.renderOrConditionWithContextType,
		SystemGroup: () => null
	}));

	getOptionLabel = (option: Option | null) => option?.title ?? '';

	getOptionValue = (option: Option | null) => option?.uuid ?? '';

	renderMultiSelectOrCondition = (props: OrConditionProps) => {
		const {transform} = this.props;
		const {onChange, value} = props;
		const {data, type} = value;

		return (
			<MultiSelectOrCondition
				data={data}
				getOptionValue={this.getOptionValue}
				onChange={onChange}
				render={this.renderSelect(true)}
				transform={transform}
				type={type}
			/>
		);
	};

	renderOrCondition = (props: OrConditionProps) => {
		const {attribute} = this.props;
		const {onChange, value} = props;
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
		} = OR_CONDITION_TYPES;

		switch (value.type) {
			case CONTAINS:
			case CONTAINS_INCLUDING_ARCHIVAL:
			case CONTAINS_INCLUDING_NESTED:
			case NOT_CONTAINS:
			case NOT_CONTAINS_INCLUDING_ARCHIVAL:
				return this.renderSelectOrCondition(props);
			case CONTAINS_ANY:
				return this.renderMultiSelectOrCondition(props);
			case TITLE_CONTAINS:
			case TITLE_NOT_CONTAINS:
				return <SimpleOrCondition onChange={onChange} value={value} />;
			case CONTAINS_ATTR_CURRENT_OBJECT:
			case EQUAL_ATTR_CURRENT_OBJECT:
				return <CurrentObjectOrCondition attribute={attribute} onChange={onChange} value={value} />;
			default:
				return null;
		}
	};

	renderOrConditionWithContextType = (props: OrConditionProps) => (
		<OR_CONDITION_TYPE_CONTEXT.Provider value={props.value.type}>
			{this.renderOrCondition(props)}
		</OR_CONDITION_TYPE_CONTEXT.Provider>
	);

	renderSelect = (multiple: boolean) => (props: RenderProps) => {
		const {Select} = this.props.components;

		return (
			<Select getOptionLabel={this.getOptionLabel} getOptionValue={this.getOptionValue} multiple={multiple} {...props} />
		);
	};

	renderSelectOrCondition = (props: OrConditionProps) => (
		<SelectOrCondition {...props} render={this.renderSelect(false)} transform={this.props.transform} />
	);

	render () {
		const {attribute, customGroups, customType, onClose, onSubmit, orConditionOptions, value} = this.props;

		return (
			<GroupModal
				attribute={attribute}
				components={this.getComponents()}
				customGroups={customGroups}
				customType={customType}
				onClose={onClose}
				onSubmit={onSubmit}
				orConditionOptions={orConditionOptions}
				schema={SCHEMA}
				value={value}
			/>
		);
	}
}

export default connect(props)(RefObjectGroupModal);
