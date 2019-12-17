// @flow
import {Button, Checkbox, Popover} from 'components/atoms';
import cn from 'classnames';
import {Form} from 'formik';
import {InfoIcon} from 'icons/form';
import {MAX_INTERVAL} from 'containers/AutoUpdateForm/constants';
import type {Props} from 'containers/AutoUpdateForm/types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';

export class AutoUpdateForm extends PureComponent<Props> {
	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {handleChange} = this.props;
		const {value} = e.currentTarget;

		if (!value || /^\d+$/.test(value)) {
			handleChange(e);
		}
	};

	handleClick = async (name: string, value: boolean) => {
		const {enabled, setFieldValue, submitForm} = this.props;

		await setFieldValue(name, value);

		if (!value && enabled) {
			submitForm();
		}
	};

	renderErrorIcon = () => {
		const {defaultInterval, errors} = this.props;
		const text = `Необходимо задать целое число минут от ${defaultInterval} до ${MAX_INTERVAL}`;
		const iconCN = errors.interval ? cn(styles.infoIcon, styles.iconError) : styles.infoIcon;

		return (
			<Popover text={text}>
				<InfoIcon className={iconCN} />
			</Popover>
		);
	};

	renderInput = () => {
		const {errors, handleBlur, values} = this.props;
		const {interval} = values;
		const inputCN = errors.interval ? cn(styles.input, styles.inputError) : styles.input;

		return (
			<input
				autoComplete="off"
				className={inputCN}
				name="interval"
				onBlur={handleBlur}
				onChange={this.handleChange}
				value={interval}
			/>
		);
	};

	renderIntervalField = () => (
		<div className={styles.field}>
			{this.renderInput()}
			{this.renderText()}
			{this.renderErrorIcon()}
		</div>
	);

	renderSettings = () => {
		const {enabled} = this.props.values;

		if (enabled) {
			return (
				<Fragment>
					{this.renderIntervalField()}
					{this.renderSubmitButton()}
				</Fragment>
			);
		}
	};

	renderSubmitButton = () => {
		const {errors} = this.props;

		return <Button className={styles.submit} disabled={errors.interval} type="submit">Применить</Button>;
	};

	renderText = () => <span className={styles.text}> минут</span>;

	renderTitle = () => {
		const {values} = this.props;

		return (
			<div className={styles.title}>
				<Checkbox
					activeColor="info"
					className={styles.checkbox}
					label="Автообновление диаграмм"
					name="enabled"
					onClick={this.handleClick}
					value={values.enabled}
				/>
			</div>
		);
	};

	render () {
		const {className} = this.props;

		return (
			<Form className={cn([styles.form, className])}>
				{this.renderTitle()}
				{this.renderSettings()}
			</Form>
		);
	}
}

export default AutoUpdateForm;
