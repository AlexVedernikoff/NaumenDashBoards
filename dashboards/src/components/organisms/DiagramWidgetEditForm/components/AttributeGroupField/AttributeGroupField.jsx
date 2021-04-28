// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import CatalogItemGroupModal from 'containers/CatalogItemGroupModal';
import CatalogItemSetGroupModal from 'containers/CatalogItemSetGroupModal';
import {createDefaultGroup} from 'store/widgets/helpers';
import DateGroupModal from 'containers/DateGroupModal';
import FieldButton from 'components/atoms/FieldButton';
import type {Group} from 'store/widgets/data/types';
import {GROUP_WAYS} from 'store/widgets/constants';
import Icon from 'components/atoms/Icon';
import {ICONS} from './constants';
import IntervalGroupModal from 'containers/IntervalGroupModal';
import MetaClassGroupModal from 'containers/MetaClassGroupModal';
import NumberGroupModal from 'containers/NumberGroupModal';
import ObjectGroupModal from 'containers/ObjectGroupModal';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import StateGroupModal from 'containers/StateGroupModal';
import StringGroupModal from 'containers/StringGroupModal';
import TimerGroupModal from 'containers/TimerGroupModal';

export class AttributeGroupField extends PureComponent<Props, State> {
	static defaultProps = {
		disabled: false
	};

	state = {
		showModal: false
	};

	getIconName = () => {
		const {attribute, value} = this.props;
		const {CUSTOM, SYSTEM} = GROUP_WAYS;
		const {DATE, NUMBER} = ATTRIBUTE_SETS;
		const attributeType = attribute?.type ?? '';
		const type = ((attributeType in ATTRIBUTE_SETS.OBJECT) ? attribute?.ref?.type : attributeType) ?? '';
		const way = value && typeof value === 'object' && value.way === CUSTOM ? CUSTOM : SYSTEM;
		const {calendar, number, text} = ICONS[way];

		if (type in NUMBER) {
			return number;
		}

		if (type in DATE) {
			return calendar;
		}

		return text;
	};

	handleClickFieldButton = () => this.setState({showModal: true});

	handleClose = () => this.setState({showModal: false});

	handleSubmit = (group: Group, newGroupAttribute: Attribute) => {
		const {attribute, name, onChange} = this.props;

		if (attribute) {
			const newAttribute = attribute.ref ? {...attribute, ref: newGroupAttribute} : newGroupAttribute;

			onChange(name, group, newAttribute);
			this.setState({showModal: false});
		}
	};

	renderButton = () => (
		<FieldButton disabled={this.props.disabled} onClick={this.handleClickFieldButton} tip="Группировка">
			<Icon name={this.getIconName()} />
		</FieldButton>
	);

	renderModal = () => {
		const {attribute} = this.props;
		const {showModal} = this.state;

		if (showModal && attribute) {
			const groupAttribute = attribute.ref || attribute;

			return this.renderModalByAttribute(groupAttribute);
		}

		return null;
	};

	renderModalByAttribute = (attribute: Attribute) => {
		const {source, value} = this.props;
		const group = value || createDefaultGroup(value, attribute);
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
		const props = {
			attribute,
			onClose: this.handleClose,
			onSubmit: this.handleSubmit,
			value: group
		};

		switch (attribute.type) {
			case backBOLinks:
			case boLinks:
			case object:
				return source && <ObjectGroupModal {...props} source={source} />;
			case backTimer:
			case timer:
				return <TimerGroupModal {...props} />;
			case catalogItem:
				return <CatalogItemGroupModal {...props} />;
			case catalogItemSet:
				return <CatalogItemSetGroupModal {...props} />;
			case date:
			case dateTime:
				return <DateGroupModal {...props} />;
			case double:
			case integer:
				return <NumberGroupModal {...props} />;
			case dtInterval:
				return <IntervalGroupModal {...props} />;
			case localizedText:
			case string:
				return <StringGroupModal {...props} />;
			case metaClass:
				return <MetaClassGroupModal {...props} />;
			case state:
				return <StateGroupModal {...props} />;
		}
	};

	render () {
		return (
			<Fragment>
				{this.renderButton()}
				{this.renderModal()}
			</Fragment>
		);
	}
}

export default AttributeGroupField;
