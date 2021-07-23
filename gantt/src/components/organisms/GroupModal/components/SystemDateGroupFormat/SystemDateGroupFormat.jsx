// @flow
import FormField from 'GroupModal/components/FormField';
import type {OnSelectEvent} from 'src/components/types';
import type {Props, State, Value} from './types';
import React, {PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from 'GroupModal/components/SystemGroup/styles.less';

export class SystemDateGroupFormat extends PureComponent<Props, State> {
	static defaultProps = {
		options: []
	};

	state = {
		value: this.getValue(this.props)
	};

	getValue (props: Props): Value {
		const {options, value: format} = props;
		let value = null;

		if (options.length > 0) {
			value = options.find(o => o.value === format) ?? options[0];
		}

		return value;
	}

	componentDidMount () {
		const {onChange, value: format} = this.props;
		const {value} = this.state;

		!format && value && onChange(value.value);
	}

	componentDidUpdate (prevProps: Props) {
		const {onChange, options, value} = this.props;

		if (prevProps.value !== value || prevProps.options !== options) {
			const value = this.getValue(this.props);

			this.setState({value});
			onChange(value?.value ?? '');
		}
	}

	handleSelectFormat = ({value}: OnSelectEvent) => {
		this.setState({value});
		this.props.onChange(value.value);
	};

	render () {
		const {options} = this.props;
		const {value} = this.state;
		const disabled = options.length === 1;

		return (
			<FormField className={styles.field} label="Выберите значение">
				<Select disabled={disabled} onSelect={this.handleSelectFormat} options={options} value={value} />
			</FormField>
		);
	}
}

export default SystemDateGroupFormat;
