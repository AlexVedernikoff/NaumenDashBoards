// @flow
import {connect} from 'react-redux';
import type {Props, State} from './types';
import {functions, props} from './selectors';
import type {PointType} from 'types/point';
import React, {Component} from 'react';
import styles from './PanelHeader.less';
import {truncatedText} from 'components/atoms/TruncatedText';

export class PanelHeader extends Component<Props, State> {
	renderTab = (type: PointType, label: string) => {
		const {panelShow, setTab} = this.props;

		if (type === panelShow) {
			return (
				<div>
					<div className={styles.lable} >{truncatedText(label)}</div>
					<div className={styles.active} />
				</div>
			);
		}
		return (
			<div onClick={() => setTab(type)}>
				<div className={styles.inActiveLable} >{truncatedText(label)}</div>
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
