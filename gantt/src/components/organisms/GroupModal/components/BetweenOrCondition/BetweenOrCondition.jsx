// @flow
import {AVAILABLE_DATE_FORMATS} from './constants';
import {FIELDS} from 'GroupModal/constants';
import MaterialDateInput from 'src/components/atoms/MaterialDateInput';
import moment from 'moment';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class BetweenOrCondition extends PureComponent<Props> {
	static defaultProps = {
		data: {
			endDate: '',
			startDate: ''
		}
	};

	format = 'DD.MM.YYYY';

	handleChange = (name: string, date: string) => {
		const {data, onChange, type} = this.props;

		onChange({
			data: {...data, [name]: date},
			type
		});
	};

	handleSelect = (name: string, date: string) => this.handleChange(name, moment(date).format(this.format));

	renderField = (name: string) => {
		const {data} = this.props;
		const value = data[name];
		const currValue = moment(value, moment.defaultFormat, true).isValid() ? moment(value).format(this.format) : value;

		return (
			<div className={styles.field}>
				<MaterialDateInput
					availableFormats={AVAILABLE_DATE_FORMATS}
					name={name}
					onChange={this.handleChange}
					onSelect={this.handleSelect}
					value={currValue}
				/>
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

export default BetweenOrCondition;
