// @flow
import {CalendarIcon, NumberIcon, TextIcon} from 'icons/form';
import {createDefaultGroup} from 'store/widgets/helpers';
import {FieldButton} from 'components/atoms';
import {getProcessedAttribute} from 'store/sources/attributes/helpers';
import {getSystemGroupOptions} from './helpers';
import type {Group, Props, State} from './types';
import GroupCreatingModal from 'containers/GroupCreatingModal';
import React, {Fragment, PureComponent} from 'react';
import {TYPES} from 'store/sources/attributes/constants';

export class AttributeGroup extends PureComponent<Props, State> {
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
		<FieldButton onClick={this.handleClickFieldButton} tip="Группировка">
			{this.renderIconByType()}
		</FieldButton>
	);

	renderIconByType = () => {
		const {attribute} = this.props;
		const type = attribute ? attribute.type : '';

		if (TYPES.INTEGER.includes(type)) {
			return <NumberIcon />;
		}

		if (TYPES.DATE.includes(type)) {
			return <CalendarIcon />;
		}

		return <TextIcon />;
	};

	renderModal = () => {
		const {attribute, value} = this.props;
		const {showModal} = this.state;
		const systemOptions = getSystemGroupOptions(attribute);
		let group = value;

		if (typeof group === 'string') {
			group = createDefaultGroup(group);
		}

		if (showModal) {
			return (
				<GroupCreatingModal
					attribute={attribute}
					onClose={this.handleCloseModal}
					onSubmit={this.handleSubmitModal}
					systemOptions={systemOptions}
					value={group}
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
