// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import React from 'react';
import styles from './styles.less';

export const DatePickerControl = ({onNextClick, onPrevClick, transparent, value}) => {
	const panelCN = cn({
		[styles.container]: true,
		[styles.transparentContainer]: transparent
	});

	return (
		<div className={panelCN}>
			<div className={styles.iconContainer}>
				<Icon name={ICON_NAMES.LEFT_ANGLE} onClick={onPrevClick} />
			</div>
			<div className={styles.valueContainer}>{value}</div>
			<div className={styles.iconContainer}>
				<Icon name={ICON_NAMES.RIGHT_ANGLE} onClick={onNextClick} />
			</div>
		</div>
	);
};

export default DatePickerControl;
