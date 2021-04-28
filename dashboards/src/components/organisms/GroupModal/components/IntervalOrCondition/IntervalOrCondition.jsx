// @flow
import MaterialSelect from 'src/components/molecules/MaterialSelect';
import MaterialTextInput from 'src/components/atoms/MaterialTextInput';
import type {OnSelectEvent} from 'src/components/types';
import type {Option} from 'GroupModal/types';
import {OPTIONS} from './constants';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class IntervalOrCondition extends PureComponent<Props, State> {
	static defaultProps = {
		data: {
			type: OPTIONS[0].value,
			value: ''
		},
		options: OPTIONS
	};

	state = {
		value: this.getValue(this.props)
	};

	componentDidUpdate (prevProps: Props) {
		if (prevProps.data.type !== this.props.data.type) {
			this.setState({
				value: this.getValue(this.props)
			});
		}
	}

	getValue (props: Props): Option {
		const {data, options} = props;

		return options.find(option => option.value === data.type) ?? options[0];
	}

	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {data, onChange, type} = this.props;
		let {value} = e.currentTarget;

		value = value.replace(/,/g, '.');

		onChange({
			data: {
				...data,
				value
			},
			type
		});
	};

	handleSelect = ({value}: OnSelectEvent) => {
		const {data, onChange, type} = this.props;

		onChange({
			data: {
				...data,
				type: value.value
			},
			type
		});
	};

	renderInput = () => {
		const {value} = this.props.data;

		return (
			<div className={styles.field}>
				<MaterialTextInput onChange={this.handleChange} value={value} />
			</div>
		);
	};

	renderSelect = () => {
		const {options} = this.props;
		const {value} = this.state;

		return (
			<div className={styles.field}>
				<MaterialSelect
					onSelect={this.handleSelect}
					options={options}
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

export default IntervalOrCondition;
