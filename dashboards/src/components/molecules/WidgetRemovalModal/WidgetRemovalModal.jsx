// @flow
import {Button} from 'components/atoms';
import {Modal} from 'components/molecules';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';

export class WidgetRemovalModal extends PureComponent<Props> {
	handleSubmit = (onlyPersonal: boolean) => () => this.props.onSubmit(onlyPersonal);

	renderDefaultModal = () => {
		const {onClose, role} = this.props;

		return (
			<Modal
				cancelText="Нет"
				header="Вы точно хотите удалить виджет?"
				onClose={onClose}
				onSubmit={this.handleSubmit(!!role)}
				size="small"
				submitText="Да"
			/>
		);
	};

	renderMasterFooter = () => (
		<Fragment>
			<Button className={styles.button} onClick={this.handleSubmit(false)}>Да, все виджеты</Button>
			<Button className={styles.button} onClick={this.handleSubmit(true)}>Да, только персональный виджет</Button>
			<Button outline onClick={this.props.onClose}>Нет</Button>
		</Fragment>
	);

	renderMasterModal = () => {
		return <Modal header="Вы точно хотите удалить виджет?" renderFooter={this.renderMasterFooter} />;
	};

	render () {
		const {role} = this.props;

		return role === 'master' ? this.renderMasterModal() : this.renderDefaultModal();
	}
}

export default WidgetRemovalModal;
