// @flow
import {FIELDS} from 'components/molecules/GroupCreatingModal/constants';
import {MaterialDateInput} from 'components/atoms';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class BetweenOperand extends PureComponent<Props> {
	handleChange = (name: string, date: string) => {
		const {onChange, operand} = this.props;

		onChange({
			...operand,
			data: {
				...operand.data,
				[name]: date
			}
		});
	};

	renderField = (name: string) => {
		const {data} = this.props.operand;

		return (
			<div className={styles.field}>
				<MaterialDateInput name={name} onChange={this.handleChange} value={data[name]} />
			</div>
		);
	};

	render () {
		return (
			<div className={styles.container}>
				{this.renderField(FIELDS.startDate)}
				{this.renderField(FIELDS.endDate)}
			</div>
		);
	}
}

export default BetweenOperand;
