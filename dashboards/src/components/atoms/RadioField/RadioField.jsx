// @flow
import FormControl from 'components/molecules/FormControl';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import RadioButton from 'components/atoms/RadioButton';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class RadioField extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		disabled: false,
		disabledMessage: '',
		name: ''
	};

	trigger: Function;

	handleClickLabel = () => this.trigger && this.trigger();

	handleSetTrigger = (trigger: Function) => (this.trigger = trigger);

	renderControl = () => {
		const {className, disabled, label, ...radioButtonProps} = this.props;
		return (
			<FormControl
				className={className}
				disabled={disabled}
				label={label}
				onClickLabel={this.handleClickLabel}
			>
				<RadioButton {...radioButtonProps} setTrigger={this.handleSetTrigger} />
			</FormControl>
		);
	};

	renderDisabledMessage = () => {
		const {disabled, disabledMessage} = this.props;

		if (disabled && disabledMessage) {
			return (
				<Icon name={ICON_NAMES.INFO} title={disabledMessage} />
			);
		}

		return null;
	};;

	render () {
		return (
			<div className={styles.container}>
				{this.renderControl()}
				{this.renderDisabledMessage()}
			</div>
		);
	}
}

export default RadioField;
