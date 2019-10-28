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

	renderDefaultSaveButton = () => {
		const {master} = this.props;

		if (master) {
			return (
				<div className={styles.masterButton}>
					<button type="button" onClick={this.handleSaveAsDefault}>
						Сохранить по умолчанию
					</button>
				</div>
			);
		}
	};

	renderButtons = () => {
		const {cancelForm, updating} = this.props;

		return (
			<div className={styles.defaultButtons}>
				<Button className="mr-1" disabled={updating} onClick={this.handleSave}>
					Сохранить
				</Button>
				<Button onClick={cancelForm} variant="bare" outline>
					Отмена
				</Button>
			</div>
		);
	};

	renderControlButtons = () => (
		<Fragment>
			{this.renderDefaultSaveButton()}
			{this.renderButtons()}
		</Fragment>
	);

	renderError = () => {
		const {saveError} = this.props;

		if (saveError) {
			return <div className="mt-1">Ошибка сохранения</div>;
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
