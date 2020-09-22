// @flow
import {connect} from 'react-redux';
import type {Props, State} from './types';
import {functions, props} from './selectors';
import type {PointType} from 'types/point';
import React, {Component} from 'react';
import styles from './PanelHeader.less';
import Truncate from 'react-truncate';

export class PanelHeader extends Component<Props, State> {
	renderTruncatedText = (text: string, line: number = 1) => {
		const ellipsis = <span>...</span>;

		return (
			<Truncate lines={line} ellipsis={ellipsis}>
				{text}
			</Truncate>
		);
	};

	renderTab = (type: PointType, label: string) => {
		const {panelShow, setTab} = this.props;

		if(type === panelShow) {
			return (
				<div>
					<div className={styles.lable} >{this.renderTruncatedText(label)}</div>
					<div className={styles.active} />
				</div>
			);
		}
		return (
			<div onClick={() => setTab(type)}>
				<div className={styles.inActiveLable} >{this.renderTruncatedText(label)}</div>
			</div>
		);
	};

	render () {
		const {dynamicPointsListName, staticPointsListName} = this.props;

		return (
			<div className={styles.PanelHeaderWrap}>
				<div className={styles.PanelHeaderContainer}>
					{this.renderTab('static', staticPointsListName)}
					{this.renderTab('dynamic', dynamicPointsListName)}
				</div>
			</div>
		);
	}
}
export default connect(props, functions)(PanelHeader);

