// @flow
import Button from 'components/atoms/Button';
import cn from 'classnames';
import {extractCheckedToNewGroup, getChecked} from './helpers';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {IndicatorGrouping} from 'store/widgets/data/types';
import IndicatorHeaderGrid from 'PivotWidgetForm/components/IndicatorsGroupBox/components/IndicatorHeaderGrid';
import Modal from 'components/molecules/Modal';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import {SIZES as MODAL_SIZES} from 'components/molecules/Modal/constants';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import t from 'localization';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class IndicatorGroupModal extends PureComponent<Props, State> {
	handleChange = (value: IndicatorGrouping) => {
		this.props.onChange(value);
	};

	handleCreateGroup = () => {
		const {onChange, value} = this.props;
		const newValue = extractCheckedToNewGroup(value);

		onChange(newValue);
	};

	handleSave = () => {
		const {onSave, value} = this.props;
		return onSave(value);
	};

	renderCreateGroup = () => {
		const {value} = this.props;
		const disabled = getChecked(value).length === 0;
		const buttonClass = cn({
			[styles.addButton]: true
		});
		const iconClass = cn({
			[styles.icon]: true,
			[styles.iconDisabled]: disabled
		});

		return (
			<div>
				<Button
					className={buttonClass}
					disabled={disabled}
					onClick={this.handleCreateGroup}
					variant={BUTTON_VARIANTS.SIMPLE}
				>
					<Icon className={iconClass} name={ICON_NAMES.PLUS} />
					<span><T text="PivotWidgetForm::IndicatorsGroupBox::CreateGroup" /></span>
				</Button>
			</div>

		);
	};

	renderFooter = () => {
		const {onClose} = this.props;

		return (
			<div className={styles.footer}>
				<Button onClick={this.handleSave} variant={BUTTON_VARIANTS.ADDITIONAL}>
					<T text="PivotWidgetForm::IndicatorsGroupBox::Save" />
				</Button>
				<Button onClick={onClose} variant={BUTTON_VARIANTS.ADDITIONAL}>
					<T text="PivotWidgetForm::IndicatorsGroupBox::Cancel" />
				</Button>
			</div>
		);
	};

	renderGroups = () => (
		<div className={styles.container}>
			<IndicatorHeaderGrid
				onChange={this.handleChange}
				value={this.props.value}
			/>
		</div>
	);

	render () {
		return (
			<Modal
				header={t('PivotWidgetForm::IndicatorsGroupBox::IndicatorGrouping')}
				renderFooter={this.renderFooter}
				size={MODAL_SIZES.FULL_WIDTH}
			>
				{this.renderCreateGroup()}
				{this.renderGroups()}
			</Modal>
		);
	}
}

export default IndicatorGroupModal;
