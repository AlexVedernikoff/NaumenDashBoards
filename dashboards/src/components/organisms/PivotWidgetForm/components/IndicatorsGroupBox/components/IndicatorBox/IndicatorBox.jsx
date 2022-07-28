// @flow
import Checkbox from 'components/atoms/LegacyCheckbox';
import cn from 'classnames';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import t from 'localization';

export class IndicatorBox extends PureComponent<Props> {
	static defaultProps = {
		className: ''
	};

	renderActionButton = () => (
		<div className={styles.info}>
			{this.renderHasBreakdown()}
		</div>
	);

	renderCheckbox = () => {
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
	};

	renderHasBreakdown = () => {
		const {hasBreakdown} = this.props;

		if (hasBreakdown) {
			return (
				<Icon
					className={styles.breakdown}
					name={ICON_NAMES.BREAKDOWN}
					round={false}
					tip={t('PivotWidgetForm::IndicatorsGroupBox::Breakdown')}
				/>
			);
		}

		return null;
	};

	renderNameField = () => {
		const {label} = this.props;
		return (
			<div className={styles.name}>
				{label}
			</div>
		);
	};

	render () {
		const {checked, className, hasBreakdown, onChecked, style, width = 300, ...props} = this.props;
		const containerClassName = cn(className, {
			[styles.indicatorContainer]: true,
			[styles.indicatorContainerChecked]: checked
		});
		const css = {...style, width: `${width}px`};

		return (
			<div {...props} className={containerClassName} style={css}>
				{this.renderCheckbox()}
				<div className={styles.header}>
					<T text='PivotWidgetForm::IndicatorsGroupBox::Indicator' />
				</div>
				{this.renderActionButton()}
				{this.renderNameField()}
			</div>
		);
	}
}

export default IndicatorBox;
