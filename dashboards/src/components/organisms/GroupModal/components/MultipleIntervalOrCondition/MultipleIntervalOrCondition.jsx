// @flow
import {getValue} from './helpers';
import type {IntervalData} from 'store/customGroups/types';
import MaterialSelect from 'src/components/molecules/MaterialSelect';
import MaterialTextInput from 'src/components/atoms/MaterialTextInput';
import type {OnSelectEvent} from 'src/components/types';
import type {Option} from 'GroupModal/types';
import {OPTIONS} from './constants';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import t from 'localization';

export class MultipleIntervalOrCondition extends PureComponent<Props> {
	static defaultProps = {
		data: [],
		options: OPTIONS
	};

	changeToDefault = () => {
		const {onChange, options, type} = this.props;

		if (options.length > 0) {
			onChange({
				data: [{
					// $FlowFixMe
					type: options[0].value,
					value: ''
				}],
				type
			});
		}
	};

	componentDidMount () {
		if (this.props.data.length === 0) {
			this.changeToDefault();
		}
	}

	componentDidUpdate (prevProps: Props) {
		if (prevProps.data.length !== this.props.data.length && this.props.data.length === 0) {
			this.changeToDefault();
		}
	}

	getHandleChange = (idx: number) => (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {data, onChange, type} = this.props;
		let {value} = e.currentTarget;

		value = value.replace(/,/g, '.');
		const newData = [];

		data.forEach((item, i) => {
			if (i === idx) {
				newData.push({
					...item,
					value
				});
			} else {
				newData.push(item);
			}
		});

		onChange({
			data: newData,
			type
		});
	};

	getHandleSelect = (idx: number) => ({value}: OnSelectEvent) => {
		const {data, onChange, type} = this.props;
		const newType = value.value;
		const newData = [];

		data.forEach((item, i) => {
			if (i === idx) {
				newData.push({
					...item,
					type: newType
				});
			} else {
				newData.push(item);
			}
		});

		onChange({
			data: newData,
			type
		});
	};

	renderInput = (idx: number) => {
		const {value} = this.props.data[idx];

		return (
			<div className={styles.field}>
				<MaterialTextInput onChange={this.getHandleChange(idx)} value={value} />
			</div>
		);
	};

	renderInterval = (value: IntervalData, idx: number) => {
		const {options} = this.props;
		const option = getValue(options, value.type);
		return (
			<Fragment key={idx}>
				{this.renderInput(idx)}
				{this.renderSelect(idx, option)}
			</Fragment>
		);
	};

	renderSelect = (idx: number, value: Option) => {
		const {options} = this.props;

		return (
			<div className={styles.field}>
				<MaterialSelect
					getOptionLabel={option => t(option.label)}
					onSelect={this.getHandleSelect(idx)}
					options={options}
					placeholder=""
					value={value}
				/>
			</div>
		);
	};;

	render () {
		return (
			<div className={styles.container}>
				{this.props.data.map(this.renderInterval)}
			</div>
		);
	}
}

export default MultipleIntervalOrCondition;
