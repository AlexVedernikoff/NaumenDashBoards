// @flow
import {FormCheckControl} from 'components/molecules';
import type {Props} from './types';
import {RadioButton} from 'components/atoms';
import React, {PureComponent} from 'react';

export class RadioField extends PureComponent<Props> {
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
