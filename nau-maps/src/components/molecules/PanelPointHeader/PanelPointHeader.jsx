// @flow
import {connect} from 'react-redux';
import {functions} from './selectors';
import PointMap from 'icons/PointMap';
import type {Props, State} from './types';
import React, {Component} from 'react';
import ReactTooltip from 'react-tooltip';
import styles from './PanelPointHeader.less';

export class PanelPointHeader extends Component<Props, State> {
	handleClickText = () => {
		const {point: {data: {actions: [action]}}} = this.props;
		const {link} = action;

		window.open(link, '_blank', 'noopener,noreferrer');
	};

	showSingle = () => {
		const {point, setSingleObject} = this.props;
		setSingleObject(point);
	};

	truncate = (str, n) => {
		return str.length > n ? str.substr(0, n - 1) + '...' : str;
	};

	renderIcon = () => {
		return (
			<div className={styles.icon} onClick={this.showSingle} title="Показать на карте">
				<PointMap />
			</div>
		);
	};

	renderText = () => {
		const {point: {data: {header = 'Название отсутствует'}}} = this.props;
		const props = {
			className: styles.text,
			onClick: this.handleClickText
		};
		let value = header;

		if (value.length > 30) {
			props['data-tip'] = value;
			value = this.truncate(value, 30);
		}

		return <div {...props}>{value}</div>;
	};

	render () {
		return (
			<div className={styles.container}>
				{this.renderText()}
				{this.renderIcon()}
				<ReactTooltip type="light" />
			</div>
		);
	}
}

export default connect(null, functions)(PanelPointHeader);
