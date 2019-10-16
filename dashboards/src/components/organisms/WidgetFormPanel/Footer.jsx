// @flow
import {Button} from 'components/atoms';
import type {ButtonProps, WrappedProps} from './types';
import type {Node} from 'react';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import withForm from './withForm';

export class Footer extends Component<WrappedProps> {
	handleSubmit = async (asDefault: boolean) => {
		const {isValid, setFieldError, setFieldTouched, setFieldValue, submitForm, validateForm, values} = this.props;
		const errors = await validateForm(values);

		if (!isValid) {
			Object.keys(errors).forEach(field => {
				setFieldTouched(field, true, false);
				setFieldError(field, errors[field]);
			});
		} else {
			await setFieldValue('asDefault', asDefault);
			submitForm();
		}
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

	renderDefaultSaveButton = () => {
		const {master} = this.props;

		if (master) {
			const props = {
				block: true,
				disabled: this.props.updating,
				onClick: this.handleSaveAsDefault,
				text: 'Сохранить по умолчанию'
			};

			return this.renderButton(props);
		}
	};

	renderButtons = (): Array<Node> => {
		const {cancelForm, updating} = this.props;
		const buttons = [
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

		return buttons.map(this.renderButton);
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
