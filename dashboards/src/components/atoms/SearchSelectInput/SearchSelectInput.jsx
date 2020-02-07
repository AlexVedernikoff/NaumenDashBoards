// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {SearchIcon} from 'icons/form';
import styles from './styles.less';

export class SearchSelectInput extends PureComponent<Props> {
	static defaultProps = {
		forwardedRef: {
			current: null
		}
	};

	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {onChange} = this.props;
		const {value} = e.currentTarget;

		onChange(value);
	};

	handleClick = (e: SyntheticInputEvent<HTMLInputElement>) => e.stopPropagation();

	renderIcon = () => <SearchIcon className={styles.icon} />;

	renderInput = () => {
		const {forwardedRef, value} = this.props;

		return (
			<input
				className={styles.input}
				onChange={this.handleChange}
				onClick={this.handleClick}
				placeholder="Поиск"
				ref={forwardedRef}
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

export default SearchSelectInput;
