// @flow
import {connect} from 'react-redux';
import GroupModal from 'GroupModal';
import type {Props} from './types';
import {props} from './selectors';
import React, {PureComponent} from 'react';

export class GroupModalContainer extends PureComponent<Props> {
	filterOrConditionOptions = () => {
		const {isUserMode, orConditionOptions} = this.props;
		let result = orConditionOptions;

		if (isUserMode) {
			result = orConditionOptions.filter(({hasReferenceToCurrentObject}) => !hasReferenceToCurrentObject);
		}

		return result;
	};

	render () {
		return (<GroupModal {...this.props} orConditionOptions={this.filterOrConditionOptions()} />);
	}
}

export default connect(props)(GroupModalContainer);
