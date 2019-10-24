// @flow
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './PopupHeader.less';

export class PopupHeader extends Component<Props, State> {
	render () {
		const {header, classShadow} = this.props;
		const classLable = classShadow ? styles.popupLabelShadow : styles.popupLabel;

		return (
			<div className={classLable}>
				<div className={styles.popupTextLabel}>{header}</div>
			</div>
		);
	}
}
export default PopupHeader;
