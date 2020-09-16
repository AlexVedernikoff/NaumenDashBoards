// @flow
import cn from 'classnames';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './PanelPointContent.less';
import Truncate from 'react-truncate';

export class PanelPointContent extends Component<Props, State> {
	renderTruncatedText = (text: string, line: number = 3) => {
		const ellipsis = <span>...</span>;
		return (
			<Truncate lines={line} ellipsis={ellipsis}>
				{text}
			</Truncate>
		);
	};

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
				{label && <div className={styles.optionLeft}>{this.renderTruncatedText(label)}</div>}
				{value && <div className={optionValueCN}>{this.renderTruncatedText(value)}</div>}
			</div>
		);
	}
}
export default PanelPointContent;
