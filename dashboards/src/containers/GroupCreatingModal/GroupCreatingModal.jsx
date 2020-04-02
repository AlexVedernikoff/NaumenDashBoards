// @flow
import type {AttrCustomProps} from 'components/molecules/GroupCreatingModal/components/CustomGroup/types';
import type {AttrSystemProps} from 'components/molecules/GroupCreatingModal/components/SystemGroup/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {connect} from 'react-redux';
import {DateGroup} from './components';
import {functions, props} from './selectors';
import {GroupCreatingModal} from 'components/molecules';
import type {Props} from './types';
import React, {Component} from 'react';

export class GroupCreatingModalContainer extends Component<Props> {
	resolve = () => {
		const {attribute} = this.props;
		const {date, dateTime} = ATTRIBUTE_TYPES;

		switch (attribute.type) {
			case date:
			case dateTime:
				return DateGroup;
		}
	};

	renderModal = (attrCustomProps: AttrCustomProps, attrSystemProps?: AttrSystemProps) => (
		<GroupCreatingModal
			{...this.props}
			attrCustomProps={attrCustomProps}
			attrSystemProps={attrSystemProps}
		/>
	);

	render () {
		const AttributeGroup = this.resolve();

		if (AttributeGroup) {
			const {attribute, customGroups} = this.props;

			return <AttributeGroup attribute={attribute} customGroups={customGroups} renderModal={this.renderModal} />;
		}

		return null;
	}
}

export default connect(props, functions)(GroupCreatingModalContainer);
