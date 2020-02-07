// @flow
import {Button} from 'components/atoms';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import withForm from 'components/organisms/WidgetFormPanel/withForm';
import type {WrappedProps} from 'components/organisms/WidgetFormPanel/types';

export class Footer extends Component<WrappedProps> {
	handleSave = () => {
		this.handleSubmit(false);
	};

	handleSaveAsDefault = () => {
		this.handleSubmit(true);
	};

	handleSubmit = async (asDefault: boolean) => {
		const {setFieldValue, submitForm} = this.props;

		await setFieldValue('asDefault', asDefault);
		await setFieldValue('isSubmitting', true);
		await setFieldValue('shouldScrollToError', true);

		submitForm();
	};

	renderButtons = () => (
		<Fragment>
			{this.renderSaveButton()}
			{this.renderCancelButton()}
		</Fragment>
	);

	renderCancelButton = () => {
		const {cancelForm} = this.props;

		return (
			<Button onClick={cancelForm} variant="additional">
				Отмена
			</Button>
		);
	};

	renderDefaultSaveButton = () => {
		const {role} = this.props;

		if (role) {
			return (
				<div className={styles.masterButton}>
					<Button onClick={this.handleSaveAsDefault} variant="simple">
						Сохранить по умолчанию
					</Button>
				</div>
			);
		}
	};

	renderSaveButton = () => {
		const {role, updating} = this.props;

		if (role !== 'super') {
			return (
				<Button disabled={updating} onClick={this.handleSave}>
					Сохранить
				</Button>
			);
		}
	};

	render () {
		return (
			<div className={styles.footer}>
				{this.renderDefaultSaveButton()}
				{this.renderButtons()}
			</div>
		);
	}
}

export default withForm(Footer);
