// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {createDefaultGroup} from 'store/widgets/helpers';
import FieldButton from 'components/atoms/FieldButton';
import type {Group} from 'store/widgets/data/types';
import GroupCreatingModal from 'containers/GroupCreatingModal';
import {GROUP_WAYS} from 'store/widgets/constants';
import Icon from 'components/atoms/Icon';
import {ICONS} from './constants';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';

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
		const attributeType = attribute?.type;
		const type = (attributeType !== 'object' ? attributeType : attribute?.ref?.type) ?? '';
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

	handleCloseModal = () => this.setState({showModal: false});

	handleSubmitModal = (group: Group, newGroupAttribute: Attribute) => {
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
		const {attribute, source, value} = this.props;
		const {showModal} = this.state;

		if (showModal && attribute && source) {
			const groupAttribute = attribute.ref || attribute;
			const group = value || createDefaultGroup(value, groupAttribute);

			return (
				<GroupCreatingModal
					attribute={groupAttribute}
					group={group}
					key={attribute.type}
					onClose={this.handleCloseModal}
					onSubmit={this.handleSubmitModal}
					source={source}
				/>
			);
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
