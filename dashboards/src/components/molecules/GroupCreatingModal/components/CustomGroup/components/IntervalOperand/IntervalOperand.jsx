// @flow
import MaterialSelect from 'components/molecules/MaterialSelect';
import MaterialTextInput from 'components/atoms/MaterialTextInput';
import type {OnSelectEvent} from 'src/components/types';
import {OPTIONS} from './constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class IntervalOperand extends PureComponent<Props> {
	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {onChange, operand} = this.props;
		let {value} = e.currentTarget;

		value = value.replace(/,/g, '.');

		onChange({
			...operand,
			data: {
				...operand.data,
				value
			}
		});
	};

	handleSelect = ({value}: OnSelectEvent) => {
		const {onChange, operand} = this.props;

		onChange({
			...operand,
			data: {
				...operand.data,
				type: value.value
			}
		});
	};

	renderInput = () => {
		const {value} = this.props.operand.data;

		return (
			<div className={styles.field}>
				<MaterialTextInput onChange={this.handleChange} value={value} />
			</div>
		);
	};

	renderSelect = () => {
		const {type} = this.props.operand.data;
		const value = OPTIONS.find(option => option.value === type) || null;

		return (
			<div className={styles.field}>
				<MaterialSelect
					onSelect={this.handleSelect}
					options={OPTIONS}
					placeholder=""
					value={value}
				/>
			</div>
		);
	};

	render () {
		return (
			<div className={styles.container}>
				{this.renderInput()}
				{this.renderSelect()}
			</div>
		);
	}
}

export default IntervalOperand;
