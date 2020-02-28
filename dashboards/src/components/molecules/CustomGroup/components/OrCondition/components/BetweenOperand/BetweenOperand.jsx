// @flow
import {FIELDS} from 'components/molecules/GroupCreatingModal/constants';
import {MaterialDateInput} from 'components/atoms';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class BetweenOperand extends PureComponent<Props> {
	handleChange = (name: string, date: string) => {
		const {data, onChange, type} = this.props;

		onChange({
			data: {
				...data,
				[name]: date
			},
			type
		});
	};

	renderField = (name: string) => (
		<div className={styles.field}>
			<MaterialDateInput name={name} onChange={this.handleChange} value={this.props.data[name]} />
		</div>
	);

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
