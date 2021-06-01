// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import type {PointType} from 'types/point';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './PanelHeader.less';
import {truncatedText} from 'components/atoms/TruncatedText';

export class PanelHeader extends Component<Props> {
	renderTab = (type: PointType, label: string) => {
		const {panelShow, setTab} = this.props;

		if (type === panelShow) {
			return (
				<div>
					<div className={styles.label} >{truncatedText(label, 1)}</div>
					<div className={styles.active} />
				</div>
			);
		}

		return (
			<div onClick={() => setTab(type)}>
				<div className={styles.inActiveLabel} >{truncatedText(label, 1)}</div>
			</div>
		);
	};

	render () {
		const {listName} = this.props;

		return (
			<div className={styles.PanelHeaderWrap}>
				<div className={styles.PanelHeaderContainer}>
					{this.renderTab('static', listName)}
				</div>
			</div>
		);
	}
}

export default connect(props, functions)(PanelHeader);
