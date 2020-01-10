// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {SearchIcon} from 'icons/form';
import styles from './styles.less';

export class SearchOptionInput extends PureComponent<Props> {
	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {onChange} = this.props;
		const {value} = e.currentTarget;

		onChange(value);
	};

	renderIcon = () => <SearchIcon className={styles.icon} />;

	renderInput = () => {
		const {value} = this.props;

		return (
			<input
				className={styles.input}
				onChange={this.handleChange}
				placeholder="Поиск"
				value={value}
			/>
		);
	};

	render () {
		return (
			<div className={styles.container}>
				{this.renderIcon()}
				{this.renderInput()}
			</div>
		);
	}
}

export default SearchOptionInput;
