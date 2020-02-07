// @flow
import cn from 'classnames';
import {LeftAngleIcon, RightAngleIcon} from 'icons/form';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class DatepickerControl extends PureComponent<Props> {
	render () {
		const {onNextClick, onPrevClick, transparent, value} = this.props;
		const panelCN = cn({
			[styles.container]: true,
			[styles.transparentContainer]: transparent
		});

		return (
			<div className={panelCN}>
				<div className={styles.iconContainer}>
					<LeftAngleIcon onClick={onPrevClick} />
				</div>
				<div className={styles.valueContainer}>{value}</div>
				<div className={styles.iconContainer}>
					<RightAngleIcon onClick={onNextClick} />
				</div>
			</div>
		);
	}
}

export default DatepickerControl;
