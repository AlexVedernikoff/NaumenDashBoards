// @flow
import AttributeCreatingModal from 'containers/AttributeCreatingModal';
import type {ComputedAttr} from 'store/widgets/data/types';
import FieldButton from 'components/atoms/FieldButton';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';

export class ComputedAttributeEditor extends PureComponent<Props, State> {
	state = {
		showModal: false
	};

	handleClickFieldButton = () => this.setState({showModal: true});

	handleCloseModal = () => this.setState({showModal: false});

	handleRemove = (value: ComputedAttr) => {
		const {onRemove} = this.props;

		this.setState({showModal: false});
		onRemove(value);
	};

	handleSubmit = (value: ComputedAttr) => {
		const {onSubmit} = this.props;

		this.setState({showModal: false});
		onSubmit(value);
	};

	renderModal = () => {
		const {value} = this.props;
		const {showModal} = this.state;

		if (showModal) {
			return (
				<AttributeCreatingModal
					onClose={this.handleCloseModal}
					onRemove={this.handleRemove}
					onSubmit={this.handleSubmit}
					value={value}
				/>
			);
		}
	};

	render () {
		return (
			<FieldButton onClick={this.handleClickFieldButton} tip="Редактировать поле">
				f(x)
				{this.renderModal()}
			</FieldButton>
		);
	}
}

export default ComputedAttributeEditor;
