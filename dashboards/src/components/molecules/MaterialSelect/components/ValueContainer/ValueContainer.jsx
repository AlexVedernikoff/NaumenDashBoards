// @flow
import {ChevronDownIcon} from 'icons/form';
import cn from 'classnames';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class ValueContainer extends Component<Props> {
	static defaultProps = {
		editableLabel: false,
		placeholder: ''
	};

	renderCaret = () => <ChevronDownIcon className={styles.caret} />;

	renderPlaceholder = () => {
		const {getOptionLabel, placeholder, value} = this.props;

		if (getOptionLabel(value) && placeholder) {
			return <div className={styles.placeholder}>{placeholder}</div>;
		}
	};

	renderValue = () => {
		const {editableLabel, forwardedInputRef, getOptionLabel, onChangeLabel, placeholder, value} = this.props;
		const inputCN = cn({
			[styles.input]: true,
			[styles.editableInput]: editableLabel
		});

		return (
			<input
				className={inputCN}
				onChange={onChangeLabel}
				placeholder={placeholder}
				readOnly={!editableLabel}
				ref={forwardedInputRef}
				value={getOptionLabel(value)}
			/>
		);
	};

	render () {
		const {editableLabel, onClick} = this.props;
		const containerCN = cn({
			[styles.container]: true,
			[styles.editableContainer]: editableLabel
		});

		return (
			<div className={containerCN} onClick={onClick}>
				{this.renderPlaceholder()}
				{this.renderValue()}
				{this.renderCaret()}
			</div>
		);
	}
}

export default ValueContainer;
