// @flow
import {Button} from 'components/atoms';
import type {ButtonProps, WrappedProps} from './types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import withForm from './withForm';

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

	renderButton = (props: ButtonProps) => {
		const {block, disabled, onClick, text, variant} = props;

		return (
			<div className={styles.field} key={text}>
				<Button className="mt-1" disabled={disabled} block={block} onClick={onClick} variant={variant}>
					{text}
				</Button>
			</div>
		);
	};

	getButtons = (): Array<ButtonProps> => {
		const {cancelForm, master, updating} = this.props;
		const buttons = [
			{
				block: true,
				disabled: updating,
				onClick: this.handleSaveAsDefault,
				text: 'Сохранить по умолчанию'
			},
			{
				block: true,
				disabled: updating,
				onClick: this.handleSave,
				text: 'Сохранить'
			},
			{
				block: true,
				onClick: cancelForm,
				text: 'Отмена',
				variant: 'bare'
			}
		];
		const start = master ? 1 : 0;

		return buttons.slice(start);
	};

	renderControlButtons = () => {
		return (
			<Fragment>
				{this.getButtons().map(this.renderButton)}
			</Fragment>
		);
	};

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
