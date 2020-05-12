// @flow
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {CalendarIcon, NumberIcon, TextIcon} from 'icons/form';
import {createDefaultGroup} from 'store/widgets/helpers';
import {FieldButton} from 'components/atoms';
import type {Group} from 'store/widgets/data/types';
import GroupCreatingModal from 'containers/GroupCreatingModal';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';

export class AttributeGroupField extends PureComponent<Props, State> {
	static defaultProps = {
		disabled: false
	};

	state = {
		showModal: false
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
			{this.renderIconByType()}
		</FieldButton>
	);

	renderIconByType = () => {
		const {value: attribute} = this.props.field;
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
		const {field, value} = this.props;
		const {showModal} = this.state;
		const {value: attribute} = field;
		let group = value;

		if (!group) {
			group = createDefaultGroup(group, attribute);
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

export default AttributeGroupField;
