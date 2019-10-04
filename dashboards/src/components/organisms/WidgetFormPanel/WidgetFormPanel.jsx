// @flow
import {Button, Title} from 'components/atoms';
import type {ButtonProps} from './types';
import type {Props} from 'containers/WidgetFormPanel/types';
import React, {Component, createContext, Fragment} from 'react';
import styles from './styles.less';
// import ParamsTab from './Tabs/ParamsTab';
import {Tabs} from './Tabs';

export const FormContext = createContext({});

export class WidgetFormPanel extends Component<Props> {
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

	renderControlButtons = () => {
		const {cancelForm, saveLoading} = this.props;

		const saveAsDefault: ButtonProps = {
			block: true,
			disabled: saveLoading,
			onClick: this.handleSaveAsDefault,
			text: 'Сохранить по умолчанию'
		};

		const save: ButtonProps = {
			block: true,
			disabled: saveLoading,
			onClick: this.handleSave,
			text: 'Сохранить'
		};

		const cancel: ButtonProps = {
			block: true,
			onClick: cancelForm,
			text: 'Отмена',
			variant: 'bare'
		};

		return (
			<Fragment>
				{this.renderButton(saveAsDefault)}
				{this.renderButton(save)}
				{this.renderButton(cancel)}
			</Fragment>
		);
	};

	renderError = () => {
		const {saveError} = this.props;

		if (saveError) {
			return <div className="mt-1">Ошибка сохранения</div>;
		}
	};

	renderHeader = () => {
		const {values} = this.props;

		return (
			<div className={styles.header}>
				<Title className={styles.title}>{values.name}</Title>
			</div>
		);
	};

	renderMain = () => <Tabs />;

	renderFooter = () => (
		<div className={styles.footer}>
			{this.renderError()}
			{this.renderControlButtons()}
		</div>
	);

	renderForm = () => {
		const {handleSubmit} = this.props;

		return (
			<form onSubmit={handleSubmit} className={styles.form}>
				{this.renderHeader()}
				{this.renderMain()}
				{this.renderFooter()}
			</form>
		);
	};

	renderButton = (props: ButtonProps) => {
		const {block, disabled, onClick, text, variant} = props;

		return (
			<div className={styles.buttonContainer}>
				<Button className="mt-1" disabled={disabled} block={block} onClick={onClick} variant={variant}>
					{text}
				</Button>
			</div>
		);
	};

	render () {
		return (
			<FormContext.Provider value={this.props}>
					{this.renderForm()}
			</FormContext.Provider>
		);
	}
}

export default WidgetFormPanel;
