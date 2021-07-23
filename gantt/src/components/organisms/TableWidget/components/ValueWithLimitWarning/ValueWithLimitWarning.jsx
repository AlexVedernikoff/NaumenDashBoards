// @flow
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import Modal from 'components/molecules/Modal';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import {SIZES} from 'components/molecules/Modal/constants';
import styles from './styles.less';

export class ValueWithLimitWarning extends PureComponent<Props, State> {
	state = {
		showModal: false
	};

	handleClickButton = (e: SyntheticMouseEvent<HTMLElement>) => {
		e.stopPropagation();
		this.setState({showModal: true});
	};

	handleCloseModal = () => this.setState({showModal: false});

	handleSubmitModal = () => {
		const {name, onSubmit} = this.props;

		onSubmit(name);
	};

	renderModal = () => {
		const {warningText} = this.props;
		const {showModal} = this.state;

		if (showModal) {
			return (
				<Modal
					cancelText="Нет"
					className={styles.warningModalContent}
					header="Предупреждение"
					onClose={this.handleCloseModal}
					onSubmit={this.handleSubmitModal}
					size={SIZES.SMALL}
					submitText="Да"
				>
					<div className={styles.modalContent}>
						{warningText}
					</div>
				</Modal>
			);
		}

		return null;
	};

	renderValue = () => {
		const {value} = this.props;

		return (
			<div className={styles.container}>
				<Icon
					className={styles.iconButton}
					name={ICON_NAMES.INFO}
					onClick={this.handleClickButton}
					title="Данные загружены не полностью. Подробнее..."
				/>
				{value}
		</div>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderValue()}
				{this.renderModal()}
			</Fragment>
		);
	}
}

export default ValueWithLimitWarning;
