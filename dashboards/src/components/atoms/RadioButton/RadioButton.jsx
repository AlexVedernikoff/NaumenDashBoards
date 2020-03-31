// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class RadioButton extends PureComponent<Props> {
	static defaultProps = {
		name: ''
	};

	handleClick = () => {
		const {name, onChange, value} = this.props;
		onChange({name, value});
	};

	render () {
		const {checked, label, name, value} = this.props;

		return (
			<div className={styles.container} onClick={this.handleClick}>
				<input checked={checked} name={name} type="radio" value={value} />
				<span className={styles.label}>{label}</span>
				<div className={styles.checkmark} />
			</div>
		);
	}
}

export default RadioButton;
