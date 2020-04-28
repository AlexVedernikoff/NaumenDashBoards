// @flow
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class TextInput extends PureComponent<Props> {
	static defaultProps = {
		maxLength: NaN,
		onlyNumber: false,
		placeholder: '',
		value: ''
	};

	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {name, onChange, onlyNumber} = this.props;
		const {value} = e.currentTarget;

		if (!onlyNumber || /^(\d+)?$/.test(value)) {
			onChange({name, value});
		}
	};

	handleClear = () => {
		const {name, onChange} = this.props;
		onChange({name, value: ''});
	};

	render () {
		const {maxLength, placeholder, value} = this.props;

		return (
			<div className={styles.container}>
				<input className={styles.input} maxLength={maxLength} onChange={this.handleChange} placeholder={placeholder} value={value} />
				<Icon className={styles.icon} name={ICON_NAMES.CLOSE} onClick={this.handleClear} />
			</div>
		);
	}
}

export default TextInput;
