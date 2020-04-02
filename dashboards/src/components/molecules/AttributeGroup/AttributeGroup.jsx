// @flow
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {CalendarIcon, NumberIcon, TextIcon} from 'icons/form';
import {createDefaultGroup} from 'store/widgets/helpers';
import {FieldButton} from 'components/atoms';
import {getProcessedAttribute} from 'store/sources/attributes/helpers';
import type {Group} from 'store/widgets/data/types';
import GroupCreatingModal from 'containers/GroupCreatingModal';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';

export class AttributeGroup extends PureComponent<Props, State> {
	static defaultProps = {
		disabled: false
	};

	state = {
		showModal: false
	};

	handleClickFieldButton = () => {
		let {attribute} = this.props;
		attribute = attribute && getProcessedAttribute(attribute);

		if (attribute) {
			this.setState({showModal: true});
		}
	};

	handleCloseModal = () => this.setState({showModal: false});

	handleSubmitModal = (group: Group, attributeTitle: string) => {
		const {name, onChange} = this.props;

		onChange(name, group, attributeTitle);
		this.setState({showModal: false});
	};

	renderButton = () => (
		<FieldButton disabled={this.props.disabled} onClick={this.handleClickFieldButton} tip="Группировка">
			{this.renderIconByType()}
		</FieldButton>
	);

	renderIconByType = () => {
		const {attribute} = this.props;
		const type = attribute ? attribute.type : '';
		const {DATE, NUMBER} = ATTRIBUTE_SETS;

		if (type in NUMBER) {
			return <NumberIcon />;
		}

		if (type in DATE) {
			return <CalendarIcon />;
		}

		return <TextIcon />;
	};

	renderModal = () => {
		const {attribute, value} = this.props;
		const {showModal} = this.state;
		let group = value;

		if (typeof group === 'string') {
			group = createDefaultGroup(group);
		}

		if (showModal && attribute) {
			return (
				<GroupCreatingModal
					attribute={attribute}
					group={group}
					key={attribute.type}
					onClose={this.handleCloseModal}
					onSubmit={this.handleSubmitModal}
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

export default AttributeGroup;
