// @flow
import cn from 'classnames';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './PanelPointContent.less';
import {truncatedText} from 'components/atoms/TruncatedText';

export class PanelPointContent extends Component<Props, State> {
	render () {
		const {option} = this.props;
		const {label, presentation, value} = option;

		const optionCN = cn({
			[styles.option]: true,
			[styles.optionFull]: presentation === 'right_of_label',
			[styles.optionUnderLabel]: presentation === 'under_label'
		});

		const optionValueCN = cn({
			[styles.optionUnder]: presentation === 'under_label',
			[styles.optionRight]: presentation === 'right_of_label',
			[styles.optionLine]: presentation === 'full_length'
		});

		const optionLableCN = cn({
			[styles.optionLeft]: presentation === 'right_of_label',
			[styles.optionWide]: presentation === 'under_label',
			[styles.optionHide]: presentation === 'full_length'
		});

		if (value) {
			return (
				<div className={optionCN}>
					{label && <div className={optionLableCN}>{truncatedText(label)}</div>}
					<div className={optionValueCN}>{truncatedText(value)}</div>
				</div>
			);
		} else {
			return null;
		}
	}
}
export default PanelPointContent;
