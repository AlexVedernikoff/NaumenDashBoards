// @flow
import {connect} from 'react-redux';
import {functions} from './selectors';
import PointMap from 'icons/PointMap';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './PanelPointHeader.less';

export class PanelPointHeader extends Component<Props, State> {
	truncate = (str, n) => {
		return str.length > n ? str.substr(0, n - 1) + '...' : str;
	};

	renderIcon = () => {
		return (
			<div className={styles.icon}>
				<PointMap />
			</div>
		);
	};

	renderText = () => {
		const {header} = this.props;

		return <div className={styles.text}>{this.truncate(header, 32)}</div>;
	};

	render () {
		return (
			<div className={styles.container}>
				{this.renderText()}
				{this.renderIcon()}
			</div>
		);
	}
}

export default connect(null, functions)(PanelPointHeader);
