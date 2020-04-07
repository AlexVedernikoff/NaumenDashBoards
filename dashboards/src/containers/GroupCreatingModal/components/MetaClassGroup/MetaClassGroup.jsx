// @flow
import {connect} from 'react-redux';
import {createCustomGroupType} from 'containers/GroupCreatingModal/helpers';
import {CUSTOM_OPTIONS} from './constants';
import {functions, props} from './selectors';
import type {Props, State} from './types';
import React, {Component} from 'react';
import {RefGroup} from 'containers/GroupCreatingModal/components';

export class MetaClassGroup extends Component<Props, State> {
	handleLoadData = () => {
		const {attribute, fetchMetaClassData} = this.props;
		fetchMetaClassData(attribute.metaClassFqn);
	};

	render () {
		const {attribute, customGroups, metaClasses, renderModal} = this.props;
		const {metaClassFqn, type} = attribute;
		const selectData = metaClasses[metaClassFqn];
		const customType = createCustomGroupType(type, metaClassFqn);

		return (
			<RefGroup
				attribute={attribute}
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

export default connect(props, functions)(MetaClassGroup);
