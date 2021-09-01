// @flow
import {connect} from 'react-redux';
import defaultComponents from 'GroupModal/defaultComponents';
import GroupModal from 'containers/GroupModal';
import memoize from 'memoize-one';
import {OR_CONDITION_OPTIONS, SCHEMA} from './constants';
import type {OrConditionProps} from 'GroupModal/types';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';
import {props} from './selectors';
import type {Props} from './types';
import React, {Component} from 'react';
import SimpleOrCondition from 'GroupModal/components/SimpleOrCondition';

export class StringGroupModal extends Component<Props> {
	getComponents = memoize(() => ({
		...defaultComponents,
		OrCondition: this.renderOrCondition,
		SystemGroup: () => null
	}));

	renderOrCondition = (props: OrConditionProps) => {
		const {onChange, value} = props;
		const {CONTAINS, NOT_CONTAINS, NOT_CONTAINS_INCLUDING_EMPTY} = OR_CONDITION_TYPES;

		switch (value.type) {
			case CONTAINS:
			case NOT_CONTAINS:
			case NOT_CONTAINS_INCLUDING_EMPTY:
				return <SimpleOrCondition onChange={onChange} value={value} />;
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
				isUserMode={true}
				onClose={onClose}
				onSubmit={onSubmit}
				orConditionOptions={OR_CONDITION_OPTIONS}
				schema={SCHEMA}
				value={value}
			/>
		);
	}
}

export default connect(props)(StringGroupModal);
