// @flow
import type {AttrModalProps, Props} from './types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {
	CatalogItemGroup,
	CatalogItemSetGroup,
	DateGroup,
	IntervalGroup,
	MetaClassGroup,
	NumberGroup,
	ObjectGroup,
	StateGroup,
	StringGroup,
	TimerGroup
} from './components';
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import {getMapValues} from 'src/helpers';
import {GroupCreatingModal} from 'components/molecules';
import React, {Component} from 'react';

export class GroupCreatingModalContainer extends Component<Props> {
	resolve = () => {
		const {attribute} = this.props;
		const {
			backBOLinks,
			backTimer,
			boLinks,
			catalogItem,
			catalogItemSet,
			date,
			dateTime,
			double,
			dtInterval,
			integer,
			localizedText,
			metaClass,
			object,
			state,
			string,
			timer
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
			case localizedText:
			case string:
				return StringGroup;
			case backTimer:
			case timer:
				return TimerGroup;
		}
	};

	renderModal = (props: AttrModalProps) => <GroupCreatingModal {...props} {...this.props} />;

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
