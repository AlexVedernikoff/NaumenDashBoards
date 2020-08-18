// @flow
import {Button, LegacyCheckbox as Checkbox, Popover} from 'components/atoms';
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import {IconButton, TimerButton} from 'components/organisms/DashboardHeader/components';
import {MAX_INTERVAL} from './constants';
import {number, object} from 'yup';
import type {Props, State, Values} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';

export class AutoUpdateForm extends PureComponent<Props, State> {
	state = {
		errors: {},
		isSubmitting: false,
		values: {
			enabled: false,
			interval: 15
		}
	};

	componentDidMount () {
		this.updateValues();
	}

	componentDidUpdate (prevProps: Props) {
		if (this.props.autoUpdateSettings !== prevProps.autoUpdateSettings) {
			this.updateValues();
		}
	}

	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {isSubmitting, values: currentValues} = this.state;
		const {value: interval} = e.currentTarget;

		if (/^(\d+)?$/.test(interval)) {
			const values = {...currentValues, interval: Number(interval)};

			isSubmitting && this.validate(values);
			this.setState({values});
		}
	};

	handleClick = async (name: string, value: boolean) => {
		const {autoUpdateSettings, onSubmit} = this.props;
		const {values} = this.state;

		this.setState({values: {...values, enabled: value}});

		if (!value && autoUpdateSettings.enabled) {
			onSubmit(value, values.interval);
		}
	};

	handleSubmit = async (e: Event) => {
		const {onSubmit} = this.props;
		const {values} = this.state;

		e.preventDefault();
		this.setState({isSubmitting: true});

		const isValid = await this.validate();

		if (isValid) {
			const {enabled, interval} = values;

			onSubmit(enabled, interval);
		}
	};

	updateValues = () => {
		const {defaultInterval, enabled, interval} = this.props.autoUpdateSettings;

		this.setState({
			values: {
				enabled,
				interval: interval || defaultInterval
			}
		});
	};

	validate = async (newValues?: Values) => {
		const {defaultInterval} = this.props.autoUpdateSettings;
		const values = newValues || this.state.values;
		const errors = {};

		const schema = object({
			interval: number().min(defaultInterval).max(MAX_INTERVAL).required()
		});

		try {
			await schema.validate(values, {abortEarly: false});
		} catch (e) {
			e.inner.forEach(({message, path}) => {
				errors[path] = message;
			});
		}

		this.setState({errors});

		return Object.keys(errors).length === 0;
	};

	renderErrorIcon = () => {
		const {defaultInterval} = this.props.autoUpdateSettings;
		const {errors} = this.state;
		const text = `Необходимо задать целое число минут от ${defaultInterval} до ${MAX_INTERVAL}`;
		const iconCN = errors.interval ? cn(styles.infoIcon, styles.iconError) : styles.infoIcon;

		return (
			<Popover text={text}>
				<Icon className={iconCN} name={ICON_NAMES.INFO} />
			</Popover>
		);
	};

	renderInput = () => {
		const {errors, values} = this.state;
		const {interval} = values;
		const inputCN = errors.interval ? cn(styles.input, styles.inputError) : styles.input;

		return (
			<input
				autoComplete="off"
				className={inputCN}
				name="interval"
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
		const {enabled} = this.state.values;

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
		const {errors} = this.state;

		return <Button className={styles.submit} disabled={Boolean(errors.interval)} type="submit">Применить</Button>;
	};

	renderText = () => <span className={styles.text}> минут</span>;

	renderTimerButton = () => {
		const {isSubmitting, values} = this.state;
		const {autoUpdateSettings} = this.props;
		const buttonCN = autoUpdateSettings.enabled ? styles.enabledAutoUpdateButton : '';

		if (isSubmitting && values.enabled) {
			return (
				<TimerButton duration={autoUpdateSettings.interval} tip="Автообновление включено" />
			);
		}

		return (
			<IconButton
				className={buttonCN}
				name={ICON_NAMES.TIMER_OFF}
				outline
				tip="Автообновление выключено"
			/>
		);
	};

	renderTitle = () => {
		const {values} = this.state;

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
			<Fragment>
				{this.renderTimerButton()}
				<form className={cn([styles.form, className])} onSubmit={this.handleSubmit}>
					{this.renderTitle()}
					{this.renderSettings()}
				</form>
			</Fragment>
		);
	}
}

export default AutoUpdateForm;
