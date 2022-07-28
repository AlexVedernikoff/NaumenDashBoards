// @flow
import {BLOCK_HEIGHT} from './constants';
import Checkbox from 'components/atoms/LegacyCheckbox';
import cn from 'classnames';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import t from 'localization';
import T from 'components/atoms/Translation';
import TextInput from 'components/atoms/TextInput';

export class GroupingBox extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		hasSum: false,
		size: 1
	};

	renderCheckbox () {
		const {checked, onChecked} = this.props;
		return (
			<div className={styles.checkbox}>
				<Checkbox
					className={styles.checked}
					name={DIAGRAM_FIELDS.checked}
					onClick={onChecked}
					value={checked}
				/>
			</div>
		);
	}

	handleChangeHasSum = () => {
		const {hasSum, onChangedHasSum} = this.props;
		return onChangedHasSum(!hasSum);
	};

	handleChangeName = ({value}) => {
		const {onChangedName} = this.props;
		return onChangedName(value);
	};

	renderAdditionalSpace = () => {
		const {size} = this.props;

		if (size > 1) {
			const addSpace = (size - 1) * BLOCK_HEIGHT;
			const css = {height: `${addSpace}px`};

			return (
				<div className={styles.additional} style={css}></div>
			);
		}
	};

	renderDeleteButton = () => {
		const {onDelete} = this.props;
		return (
			<IconButton
				className={styles.deleteButton}
				icon={ICON_NAMES.BASKET}
				onClick={onDelete}
				round={false}
				tip={t('PivotWidgetForm::GroupingBox::Delete')}
			/>
		);
	};

	renderHasSum = () => {
		const {hasSum} = this.props;
		return (
			<IconButton
				active={hasSum}
				className={styles.sum}
				icon={ICON_NAMES.SUM}
				onClick={this.handleChangeHasSum}
				round={false}
				tip={t('PivotWidgetForm::GroupingBox::Sum')}
			/>
		);
	};

	renderActionButton () {
		return (
			<div className={styles.actions}>
				{this.renderHasSum()}
				{this.renderDeleteButton()}
			</div>
		);
	}

	renderNameField () {
		const {name} = this.props;
		return (
			<div className={styles.name}>
				<TextInput
					name={DIAGRAM_FIELDS.name}
					onChange={this.handleChangeName}
					placeholder={t('PivotWidgetForm::GroupingBox::Name')}
					value={name}
				/>
			</div>
		);
	}

	render () {
		const {className, hasSum, onChangedHasSum, onChangedName, onChecked, onDelete, size, style, width = 300, ...props} = this.props;
		const containerClassName = cn(className, styles.groupContainer);
		const height = size * 80;
		const css = {...style, height: `${height}px`, width: `${width}px`};

		return (
			<div {...props} className={containerClassName} style={css}>
				{this.renderCheckbox()}
				<div className={styles.header}>
					<T text='PivotWidgetForm::GroupingBox::Group' />
				</div>
				{this.renderActionButton()}
				{this.renderNameField()}
				{this.renderAdditionalSpace()}
			</div>
		);
	}
}

export default GroupingBox;
