// @flow
import type {AttrModalProps, Props} from './types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import CatalogItemGroup from './components/CatalogItemGroup';
import CatalogItemSetGroup from './components/CatalogItemSetGroup';
import {connect} from 'react-redux';
import DateGroup from './components/DateGroup';
import {functions, props} from './selectors';
import {getMapValues} from 'helpers';
import GroupCreatingModal from 'components/molecules/GroupCreatingModal';
import IntervalGroup from './components/IntervalGroup';
import MetaClassGroup from './components/MetaClassGroup';
import NumberGroup from './components/NumberGroup';
import ObjectGroup from './components/ObjectGroup';
import React, {Component} from 'react';
import StateGroup from './components/StateGroup';
import StringGroup from './components/StringGroup';
import TimerGroup from './components/TimerGroup';

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
			const {attribute, editableCustomGroups, source} = this.props;

			return (
				<AttributeGroup
					attribute={attribute}
					customGroups={getMapValues(editableCustomGroups)}
					renderModal={this.renderModal}
					source={source}
				/>
			);
		}

		return null;
	}
}

export default connect(props, functions)(GroupCreatingModalContainer);
