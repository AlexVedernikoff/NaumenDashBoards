// @flow
import Button from 'components/atoms/Button';
import Checkbox from 'components/atoms/LegacyCheckbox';
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import {IconButton} from 'components/organisms/DashboardHeader/components';
import {MAX_INTERVAL} from './constants';
import {number, object} from 'yup';
import Popover from 'components/atoms/Popover';
import type {Props, State, Values} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import TimerButton from 'components/atoms/TimerButton';
import {USER_ROLES} from 'store/context/constants';

export class AutoUpdateButton extends PureComponent<Props, State> {
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
		if (this.props.settings !== prevProps.settings) {
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
		const {onSaveSettings, settings} = this.props;
		const {values} = this.state;

		this.setState({values: {...values, enabled: value}});

		if (!value && settings.enabled) {
			onSaveSettings(value, values.interval);
		}
	};

	handleSubmit = async (e: Event) => {
		const {onSaveSettings} = this.props;
		const {values} = this.state;

		e.preventDefault();
		this.setState({isSubmitting: true});

		const isValid = await this.validate();

		if (isValid) {
			const {enabled, interval} = values;

			onSaveSettings(enabled, interval);
		}
	};

	updateValues = () => {
		const {defaultInterval, enabled, interval} = this.props.settings;

		this.setState({
			values: {
				enabled,
				interval: interval || defaultInterval
			}
		});
	};

	validate = async (newValues?: Values) => {
		const {defaultInterval} = this.props.settings;
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
		const {defaultInterval} = this.props.settings;
		const {errors} = this.state;
		const text = `Необходимо задать целое число минут от ${defaultInterval} до ${MAX_INTERVAL}`;
		const iconCN = errors.interval ? cn(styles.infoIcon, styles.iconError) : styles.infoIcon;

		return (
			<Popover text={text}>
				<Icon className={iconCN} name={ICON_NAMES.INFO} />
			</Popover>
		);
	};

	renderForm = () => {
		const {className, personalDashboard, role} = this.props;

		if (personalDashboard || role !== USER_ROLES.REGULAR) {
			return (
				<form className={cn([styles.form, className])} onSubmit={this.handleSubmit}>
					{this.renderTitle()}
					{this.renderSettings()}
				</form>
			);
		}
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
		const {onChangeRemainder, personalDashboard, role, settings} = this.props;
		const {enabled, remainder} = settings;
		const buttonCN = enabled ? styles.enabledAutoUpdateButton : '';

		if (enabled) {
			return (
				<TimerButton duration={remainder} onChangeDuration={onChangeRemainder} tip="Автообновление включено" />
			);
		}

		if (personalDashboard || role !== USER_ROLES.REGULAR) {
			return (
				<IconButton
					className={buttonCN}
					name={ICON_NAMES.TIMER_OFF}
					outline
					tip="Автообновление выключено"
				/>
			);
		}

		return null;
	};

	renderTitle = () => {
		const {values} = this.state;

		return (
			<Checkbox
				activeColor="info"
				className={styles.checkbox}
				label="Автообновление диаграмм"
				name="enabled"
				onClick={this.handleClick}
				value={values.enabled}
			/>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderTimerButton()}
				{this.renderForm()}
			</Fragment>
		);
	}
}

export default AutoUpdateButton;
