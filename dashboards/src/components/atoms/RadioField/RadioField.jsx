// @flow
import FormCheckControl from 'components/molecules/FormCheckControl';
import type {Props} from './types';
import RadioButton from 'components/atoms/RadioButton';
import React, {PureComponent} from 'react';

export class RadioField extends PureComponent<Props> {
	static defaultProps = {
		className: ''
	};

	trigger: Function;

	handleClickLabel = () => this.trigger && this.trigger();

	handleSetTrigger = (trigger: Function) => (this.trigger = trigger);

	render () {
		const {className, label, ...radioButtonProps} = this.props;

		return (
			<FormCheckControl className={className} label={label} onClickLabel={this.handleClickLabel} >
				<RadioButton {...radioButtonProps} setTrigger={this.handleSetTrigger} />
			</FormCheckControl>
		);
	}
}

export default RadioField;
