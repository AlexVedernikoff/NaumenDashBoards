// @flow
import {Button} from 'components/atoms';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import withForm from 'components/organisms/WidgetFormPanel/withForm';
import type {WrappedProps} from 'components/organisms/WidgetFormPanel/types';

export class Footer extends Component<WrappedProps> {
	handleSubmit = async (asDefault: boolean) => {
		const {setFieldValue, submitForm} = this.props;

		await setFieldValue('asDefault', asDefault);
		submitForm();
	};

	handleSave = () => {
		this.handleSubmit(false);
	};

	handleSaveAsDefault = () => {
		this.handleSubmit(true);
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
			<Button onClick={cancelForm} outline variant="bare">
				Отмена
			</Button>
		);
	};

	renderControlButtons = () => (
		<Fragment>
			{this.renderDefaultSaveButton()}
			{this.renderButtons()}
		</Fragment>
	);

	renderDefaultSaveButton = () => {
		const {role} = this.props;

		if (role) {
			return (
				<div className={styles.masterButton}>
					<button type="button" onClick={this.handleSaveAsDefault}>
						Сохранить по умолчанию
					</button>
				</div>
			);
		}
	};

	renderError = () => {
		const {saveError} = this.props;

		if (saveError) {
			return <div className="mt-1">Ошибка сохранения</div>;
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
				{this.renderError()}
				{this.renderControlButtons()}
			</div>
		);
	}
}

export default withForm(Footer);
