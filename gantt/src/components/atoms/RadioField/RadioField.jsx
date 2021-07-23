// @flow
import FormControl from 'components/molecules/FormControl';
import type {Props} from './types';
import RadioButton from 'components/atoms/RadioButton';
import React, {PureComponent} from 'react';

export class RadioField extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		disabled: false,
		name: ''
	};

	trigger: Function;

	handleClickLabel = () => this.trigger && this.trigger();

	handleSetTrigger = (trigger: Function) => (this.trigger = trigger);

	render () {
		const {className, disabled, label, ...radioButtonProps} = this.props;

		return (
			<FormControl className={className} disabled={disabled} label={label} onClickLabel={this.handleClickLabel}>
				<RadioButton {...radioButtonProps} setTrigger={this.handleSetTrigger} />
			</FormControl>
		);
	}
}

export default RadioField;
