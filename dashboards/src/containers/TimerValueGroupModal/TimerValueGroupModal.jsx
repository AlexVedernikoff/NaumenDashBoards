// @flow
import {connect} from 'react-redux';
import defaultComponents from 'GroupModal/defaultComponents';
import GroupModal from 'containers/GroupModal';
import memoize from 'memoize-one';
import MultipleIntervalOrCondition from 'GroupModal/components/MultipleIntervalOrCondition';
import {OPTIONS, OR_CONDITION_OPTIONS, SCHEMA} from './constants';
import type {OrConditionProps} from 'GroupModal/types';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';
import {props} from './selectors';
import type {Props} from './types';
import React, {Component} from 'react';
import {translateObjectsArray} from 'localization';

export class TimerValueGroupModal extends Component<Props> {
	options = translateObjectsArray('label', OPTIONS);
	orConditionOptions = translateObjectsArray('label', OR_CONDITION_OPTIONS);

	getComponents = memoize(() => ({
		...defaultComponents,
		OrCondition: this.renderOrCondition,
		SystemGroup: () => null
	}));

	renderOrCondition = (props: OrConditionProps) => {
		const {onChange, value} = props;
		const {data, type} = value;
		const {EQUAL, GREATER, LESS, NOT_EQUAL} = OR_CONDITION_TYPES;

		switch (type) {
			case EQUAL:
			case NOT_EQUAL:
			case GREATER:
			case LESS:
				return <MultipleIntervalOrCondition data={data} onChange={onChange} options={this.options} type={type} />;
		}
		return null;
	};

	render () {
		const {attribute, customGroups, onClose, onSubmit, value} = this.props;

		return (
			<GroupModal
				attribute={attribute}
				components={this.getComponents()}
				customGroups={customGroups}
				customTimerValue={attribute.timerValue}
				customType={attribute.type}
				onClose={onClose}
				onSubmit={onSubmit}
				orConditionOptions={this.orConditionOptions}
				schema={SCHEMA}
				value={value}
			/>
		);
	}
}

export default connect(props)(TimerValueGroupModal);
