// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class ValueContainer extends Component<Props> {
	static defaultProps = {
		editableLabel: false,
		maxLabelLength: null,
		placeholder: ''
	};

	renderCaret = () => <Icon className={styles.caret} name={ICON_NAMES.CARET} />;

	renderPlaceholder = (): React$Node => {
		const {getOptionLabel, placeholder, value} = this.props;

		if (value && placeholder && getOptionLabel(value)) {
			return <div className={styles.placeholder}>{placeholder}</div>;
		}

		return null;
	};

	renderValue = (): React$Node => {
		const {editableLabel, forwardedInputRef, getOptionLabel, maxLabelLength, onChangeLabel, placeholder, value} = this.props;
		const inputCN = cn({
			[styles.input]: true,
			[styles.editableInput]: editableLabel
		});
		const optionLabel = (value && getOptionLabel(value)) ?? '';

		return (
			<input
				className={inputCN}
				maxLength={maxLabelLength}
				onChange={onChangeLabel}
				placeholder={placeholder}
				readOnly={!editableLabel}
				ref={forwardedInputRef}
				value={optionLabel}
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
