// @flow
import {ATTRIBUTE_TYPES} from 'src/store/sources/attributes/constants';
import {
	BACK_TIMER_OR_CONDITION_OPTIONS,
	BACK_TIMER_STATUS_OPTIONS,
	EXCEED_OPTIONS, SCHEMA,
	TIMER_OR_CONDITION_OPTIONS,
	TIMER_STATUS_OPTIONS
} from './constants';
import BetweenOrCondition from 'GroupModal/components/BetweenOrCondition';
import {connect} from 'react-redux';
import GroupModal from 'GroupModal';
import MaterialSelect from 'components/molecules/MaterialSelect';
import memoize from 'memoize-one';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';
import type {OrConditionProps} from 'GroupModal/types';
import {props} from './selectors';
import type {Props, State} from './types';
import React, {Component} from 'react';
import type {RenderProps} from 'GroupModal/components/SelectOrCondition/types';
import SelectOrCondition from 'GroupModal/components/SelectOrCondition';

export class TimerGroupModal extends Component<Props, State> {
	state = this.initState(this.props);

	initState (props: Props): State {
		let state;

		if (props.attribute.type === ATTRIBUTE_TYPES.timer) {
			state = {
				orConditionOptions: TIMER_OR_CONDITION_OPTIONS,
				statusOptions: TIMER_STATUS_OPTIONS
			};
		} else {
			state = {
				orConditionOptions: BACK_TIMER_OR_CONDITION_OPTIONS,
				statusOptions: BACK_TIMER_STATUS_OPTIONS
			};
		}

		return state;
	}

	getComponents = memoize(() => ({
		...GroupModal.defaultProps.components,
		OrCondition: this.renderOrCondition,
		SystemGroup: () => null
	}));

	renderExpirationSelect = (props: RenderProps) => <MaterialSelect options={EXCEED_OPTIONS} {...props} />;

	renderOrCondition = (props: OrConditionProps) => {
		const {onChange, value} = props;
		const {EXPIRATION_CONTAINS, EXPIRES_BETWEEN, STATUS_CONTAINS, STATUS_NOT_CONTAINS} = OR_CONDITION_TYPES;
		const {data, type} = value;

		switch (type) {
			case EXPIRATION_CONTAINS:
				return <SelectOrCondition onChange={onChange} render={this.renderExpirationSelect} value={value} />;
			case STATUS_CONTAINS:
			case STATUS_NOT_CONTAINS:
				return <SelectOrCondition onChange={onChange} render={this.renderStatusSelect} value={value} />;
			case EXPIRES_BETWEEN:
				return <BetweenOrCondition data={data} onChange={onChange} type={type} />;
			default:
				return null;
		}
	};

	renderStatusSelect = (props: RenderProps) => <MaterialSelect options={this.state.statusOptions} {...props} />;

	render () {
		const {attribute, customGroups, onClose, onSubmit, value} = this.props;
		const {orConditionOptions} = this.state;

		return (
				<GroupModal
					attribute={attribute}
					components={this.getComponents()}
					customGroups={customGroups}
					customType={attribute.type}
					onClose={onClose}
					onSubmit={onSubmit}
					orConditionOptions={orConditionOptions}
					schema={SCHEMA}
					value={value}
				/>
		);
	}
}

export default connect(props)(TimerGroupModal);
