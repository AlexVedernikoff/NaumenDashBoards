// @flow
import cn from 'classnames';
import {IconButton} from 'components/atoms';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class TextInput extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		disabled: false,
		maxLength: null,
		onlyNumber: false,
		name: '',
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
		const {className, disabled, maxLength, placeholder, value} = this.props;
		const containerCN = cn({
			[styles.container]: true,
			[className]: true,
			[styles.disabled]: disabled
		});

		return (
			<div className={containerCN}>
				<input className={styles.input} maxLength={maxLength} onChange={this.handleChange} placeholder={placeholder} value={value} />
				<IconButton className={styles.icon} icon={ICON_NAMES.REMOVE} onClick={this.handleClear} />
			</div>
		);
	}
}

export default TextInput;
