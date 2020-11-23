// @flow
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {createDefaultGroup} from 'store/widgets/helpers';
import {FieldButton, Icon} from 'components/atoms';
import type {Group} from 'store/widgets/data/types';
import GroupCreatingModal from 'containers/GroupCreatingModal';
import {GROUP_WAYS} from 'store/widgets/constants';
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
		const {field, value} = this.props;
		const {CUSTOM, SYSTEM} = GROUP_WAYS;
		const {DATE, NUMBER} = ATTRIBUTE_SETS;
		const {value: attribute} = field;
		const type = attribute ? attribute.type : '';
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

	handleSubmitModal = (group: Group, title: string) => {
		const {field, name, onChange} = this.props;
		field.value = {
			...field.value,
			title
		};

		onChange(name, group, field);
		this.setState({showModal: false});
	};

	renderButton = () => (
		<FieldButton disabled={this.props.disabled} onClick={this.handleClickFieldButton} tip="Группировка">
			<Icon name={this.getIconName()} />
		</FieldButton>
	);

	renderModal = () => {
		const {field, source, value} = this.props;
		const {showModal} = this.state;
		const {parent, value: attribute} = field;
		let group = value;

		if (!group) {
			group = createDefaultGroup(group, attribute);
		}

		if (showModal && attribute) {
			return (
				<GroupCreatingModal
					attribute={parent || attribute}
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
