// @flow
import {connect} from 'react-redux';
import defaultComponents from 'GroupModal/defaultComponents';
import GroupModal from 'containers/GroupModal';
import IntervalOrCondition from 'GroupModal/components/IntervalOrCondition';
import memoize from 'memoize-one';
import {OR_CONDITION_OPTIONS, SCHEMA, SYSTEM_OPTIONS} from './constants';
import type {OrConditionProps} from 'GroupModal/types';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';
import {props} from './selectors';
import type {Props} from './types';
import React, {Component} from 'react';
import {translateObjectsArray} from 'localization';

export class IntervalGroupModal extends Component<Props> {
	systemOptions = translateObjectsArray('label', SYSTEM_OPTIONS);
	orConditionOptions = translateObjectsArray('label', OR_CONDITION_OPTIONS);

	getComponents = memoize(() => ({
		...defaultComponents,
		OrCondition: this.renderOrCondition
	}));

	renderOrCondition = (props: OrConditionProps) => {
		const {onChange, value} = props;
		const {EQUAL, GREATER, LESS, NOT_EQUAL} = OR_CONDITION_TYPES;
		const {data, type} = value;

		switch (type) {
			case EQUAL:
			case GREATER:
			case LESS:
			case NOT_EQUAL:
				return <IntervalOrCondition data={data} onChange={onChange} type={type} />;
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
				orConditionOptions={this.orConditionOptions}
				schema={SCHEMA}
				systemOptions={this.systemOptions}
				value={value}
			/>
		);
	}
}

export default connect(props)(IntervalGroupModal);
