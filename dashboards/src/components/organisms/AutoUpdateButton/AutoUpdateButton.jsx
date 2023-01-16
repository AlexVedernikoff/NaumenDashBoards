// @flow
import Button from 'components/atoms/Button';
import Checkbox from 'components/atoms/LegacyCheckbox';
import cn from 'classnames';
import {DEFAULT_INTERVAL, MAX_AUTO_UPDATE_INTERVAL, SECONDS_IN_MINUTE} from 'store/dashboard/settings/constants';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import IconButton from 'components/organisms/DashboardHeader/components/IconButton';
import {number, object} from 'yup';
import Popover from 'components/atoms/Popover';
import type {Props, State, Values} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import t from 'localization';
import TimerButton from 'components/atoms/TimerButton';

export class AutoUpdateButton extends PureComponent<Props, State> {
	state = {
		errors: {},
		isSubmitting: false,
		remainder: DEFAULT_INTERVAL * SECONDS_IN_MINUTE,
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

	handleChangeRemainder = (remainder: number) => {
		const {getSettings} = this.props;

		if (remainder === 0) {
			getSettings(true);
		}

		this.setState({remainder});
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
			remainder: (interval || defaultInterval) * SECONDS_IN_MINUTE,
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
			interval: number().min(defaultInterval).max(MAX_AUTO_UPDATE_INTERVAL).required()
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
		const text = t('AutoUpdateButton::ErrorMessage', {max: MAX_AUTO_UPDATE_INTERVAL, min: defaultInterval});
		const iconCN = errors.interval ? cn(styles.infoIcon, styles.iconError) : styles.infoIcon;

		return (
			<Popover text={text}>
				<Icon className={iconCN} name={ICON_NAMES.INFO} />
			</Popover>
		);
	};

	renderForm = () => {
		const {canChangeConfiguration, className} = this.props;

		if (canChangeConfiguration) {
			return (
				<form className={cn([styles.form, className])} onSubmit={this.handleSubmit}>
					{this.renderTitle()}
					{this.renderSettings()}
				</form>
			);
		}

		return null;
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

		return <Button className={styles.submit} disabled={Boolean(errors.interval)} type="submit"><T text="AutoUpdateButton::Apply" /></Button>;
	};

	renderText = () => <span className={styles.text}> <T text="AutoUpdateButton::Minutes" /></span>;

	renderTimerButton = () => {
		const {settings} = this.props;
		const {remainder} = this.state;
		const {enabled} = settings;
		const buttonCN = enabled ? styles.enabledAutoUpdateButton : '';

		if (enabled) {
			return (
				<TimerButton
					duration={remainder}
					editMode={true}
					onChangeDuration={this.handleChangeRemainder}
					tip={t('AutoUpdateButton::AutoRefreshOn')}
				/>
			);
		}

		return (
			<IconButton
				className={buttonCN}
				name={ICON_NAMES.TIMER_OFF}
				outline
				tip={t('AutoUpdateButton::AutoRefreshOff')}
			/>
		);
	};

	renderTitle = () => {
		const {values} = this.state;

		return (
			<Checkbox
				activeColor="info"
				className={styles.checkbox}
				label={t('AutoUpdateButton::DiagramAutoRefresh')}
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
