// @flow
import {connect} from 'react-redux';
import {createCustomGroupType} from 'containers/GroupCreatingModal/helpers';
import {CUSTOM_OPTIONS} from './constants';
import {functions, props} from './selectors';
import type {Props} from './types';
import React, {Component} from 'react';
import {RefGroup} from 'containers/GroupCreatingModal/components';

export class CatalogItemGroup extends Component<Props> {
	handleLoadData = () => {
		const {attribute, fetchCatalogItemData} = this.props;
		fetchCatalogItemData(attribute.property);
	};

	render () {
		const {attribute, catalogItems, customGroups, renderModal} = this.props;
		const {property, type} = attribute;
		const selectData = catalogItems[property];
		const customType = createCustomGroupType(type, property);

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

export default connect(props, functions)(CatalogItemGroup);
