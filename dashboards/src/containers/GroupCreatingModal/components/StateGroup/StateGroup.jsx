// @flow
import {connect} from 'react-redux';
import {createCustomGroupType} from 'containers/GroupCreatingModal/helpers';
import {CUSTOM_OPTIONS} from './constants';
import {functions, props} from './selectors';
import type {Props} from './types';
import React, {Component} from 'react';
import {RefGroup} from 'containers/GroupCreatingModal/components';

export class StateGroup extends Component<Props> {
	handleLoadData = () => {
		const {attribute, fetchMetaClassStates} = this.props;
		fetchMetaClassStates(attribute.metaClassFqn);
	};

	render () {
		const {attribute, customGroups, renderModal, states} = this.props;
		const {metaClassFqn, type} = attribute;
		const selectData = states[metaClassFqn];
		const customType = createCustomGroupType(type, metaClassFqn);

		return (
			<RefGroup
				customGroups={customGroups}
				customOptions={CUSTOM_OPTIONS}
				customType={customType}
				onLoadData={this.handleLoadData}
				renderModal={renderModal}
				selectData={selectData}
			/>
		);
	}
}

export default connect(props, functions)(StateGroup);
