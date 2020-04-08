// @flow
import type {AttrCustomProps} from 'components/molecules/GroupCreatingModal/components/CustomGroup/types';
import type {AttrSystemProps} from 'components/molecules/GroupCreatingModal/components/SystemGroup/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {CatalogItemGroup, CatalogItemSetGroup, DateGroup, IntervalGroup, MetaClassGroup, NumberGroup, ObjectGroup, StateGroup, StringGroup} from './components';
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import {getMapValues} from 'src/helpers';
import {GroupCreatingModal} from 'components/molecules';
import type {Props} from './types';
import React, {Component} from 'react';

export class GroupCreatingModalContainer extends Component<Props> {
	resolve = () => {
		const {attribute} = this.props;
		const {
			backBOLinks,
			boLinks,
			catalogItem,
			catalogItemSet,
			date,
			dateTime,
			double,
			dtInterval,
			integer,
			metaClass,
			object,
			state,
			string
		} = ATTRIBUTE_TYPES;

		switch (attribute.type) {
			case catalogItem:
				return CatalogItemGroup;
			case catalogItemSet:
				return CatalogItemSetGroup;
			case date:
			case dateTime:
				return DateGroup;
			case double:
			case integer:
				return NumberGroup;
			case dtInterval:
				return IntervalGroup;
			case metaClass:
				return MetaClassGroup;
			case backBOLinks:
			case object:
			case boLinks:
				return ObjectGroup;
			case state:
				return StateGroup;
			case string:
				return StringGroup;
		}
	};

	renderModal = (attrCustomProps: AttrCustomProps, attrSystemProps?: AttrSystemProps) => (
		<GroupCreatingModal
			attrCustomProps={attrCustomProps}
			attrSystemProps={attrSystemProps}
			{...this.props}
		/>
	);

	render () {
		const AttributeGroup = this.resolve();

		if (AttributeGroup) {
			const {attribute, customGroups} = this.props;

			return <AttributeGroup attribute={attribute} customGroups={getMapValues(customGroups)} renderModal={this.renderModal} />;
		}

		return null;
	}
}

export default connect(props, functions)(GroupCreatingModalContainer);
