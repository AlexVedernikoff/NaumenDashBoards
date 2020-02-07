// @flow
import {AttributeCreatingModal} from 'components/molecules';
import type {ComputedAttr} from 'components/molecules/AttributeCreatingModal/types';
import {FieldButton} from 'components/atoms';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';

export class ComputedAttributeEditor extends PureComponent<Props, State> {
	state = {
		showModal: false
	};

	handleClickFieldButton = () => this.setState({showModal: true});

	handleCloseModal = () => this.setState({showModal: false});

	handleRemove = (id: string) => {
		const {onRemove} = this.props;

		this.setState({showModal: false});
		onRemove(id);
	};

	handleSubmit = (value: ComputedAttr) => {
		const {onSubmit} = this.props;

		this.setState({showModal: false});
		onSubmit(value);
	};

	renderButton = () => (
		<FieldButton onClick={this.handleClickFieldButton} tip="Редактировать поле">
			f(x)
		</FieldButton>
	);

	renderModal = () => {
		const {sources, value} = this.props;
		const {showModal} = this.state;

		if (showModal) {
			return (
				<AttributeCreatingModal
					onClose={this.handleCloseModal}
					onRemove={this.handleRemove}
					onSubmit={this.handleSubmit}
					sources={sources}
					value={value}
				/>
			);
		}
	};

	render () {
		return (
			<div>
				{this.renderButton()}
				{this.renderModal()}
			</div>
		);
	}
}

export default ComputedAttributeEditor;
