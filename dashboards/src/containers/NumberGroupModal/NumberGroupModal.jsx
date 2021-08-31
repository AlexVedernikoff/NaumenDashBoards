// @flow
import {ATTRIBUTE_TYPES} from 'src/store/sources/attributes/constants';
import {connect} from 'react-redux';
import {createSchema, number} from 'GroupModal/schema';
import defaultComponents from 'GroupModal/defaultComponents';
import GroupModal from 'containers/GroupModal';
import memoize from 'memoize-one';
import {OR_CONDITION_OPTIONS} from './constants';
import type {OrConditionProps} from 'GroupModal/types';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';
import {props} from './selectors';
import type {Props} from './types';
import React, {Component} from 'react';
import SimpleOrCondition from 'GroupModal/components/SimpleOrCondition';

export class NumberGroupModal extends Component<Props> {
	getComponents = memoize(() => ({
		...defaultComponents,
		OrCondition: this.renderOrCondition,
		SystemGroup: () => null
	}));

	getSchema = memoize((type: string) => createSchema(condition => {
		const {EQUAL, GREATER, LESS, NOT_EQUAL, NOT_EQUAL_NOT_EMPTY} = OR_CONDITION_TYPES;

		switch (condition.type) {
			case EQUAL:
			case GREATER:
			case LESS:
			case NOT_EQUAL:
			case NOT_EQUAL_NOT_EMPTY:
				return type === ATTRIBUTE_TYPES.integer ? number().isInteger() : number().isFloat();
		}
	}));

	renderOrCondition = (props: OrConditionProps) => {
		const {attribute} = this.props;
		const {onChange, value} = props;
		const {EQUAL, GREATER, LESS, NOT_EQUAL, NOT_EQUAL_NOT_EMPTY} = OR_CONDITION_TYPES;
		const float = attribute.type === ATTRIBUTE_TYPES.double;

		switch (value.type) {
			case EQUAL:
			case GREATER:
			case LESS:
			case NOT_EQUAL:
			case NOT_EQUAL_NOT_EMPTY:
				return <SimpleOrCondition float={float} onChange={onChange} value={value} />;
			default:
				return null;
		}
	};

	render () {
		const {attribute, customGroups, onClose, onSubmit, value} = this.props;

		return (
			<GroupModal
				attribute={attribute}
				components={this.getComponents()}
				customGroups={customGroups}
				customType={attribute.type}
				onClose={onClose}
				onSubmit={onSubmit}
				orConditionOptions={OR_CONDITION_OPTIONS}
				schema={this.getSchema(attribute.type)}
				value={value}
			/>
		);
	}
}

export default connect(props)(NumberGroupModal);
