// @flow
import {CalendarIcon} from 'icons/form';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class MaterialDateInput extends PureComponent<Props> {
	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {name, onChange} = this.props;
		const {value} = e.currentTarget;

		onChange(name, value);
	};

	renderCalendarIcon = () => <CalendarIcon className={styles.calendar} />;

	renderInput = () => <input className={styles.input} onChange={this.handleChange} type="date" />;

	renderValue = () => <div>{this.props.value}</div>;

	render () {
		return (
			<div className={styles.container}>
				{this.renderValue()}
				{this.renderInput()}
				{this.renderCalendarIcon()}
			</div>
		);
	}
}

export default MaterialDateInput;
