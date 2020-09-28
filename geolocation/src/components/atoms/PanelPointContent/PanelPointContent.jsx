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
			[styles.optionFlex]: presentation === 'right_of_label'
		});

		const optionValueCN = cn({
			[styles.optionUnder]: presentation === 'under_label',
			[styles.optionRight]: presentation === 'right_of_label',
			[styles.optionLine]: presentation === 'full_length'
		});

		return (
			<div className={optionCN}>
				{label && <div className={styles.optionLeft}>{truncatedText(label)}</div>}
				{value && <div className={optionValueCN}>{truncatedText(value)}</div>}
			</div>
		);
	}
}
export default PanelPointContent;
