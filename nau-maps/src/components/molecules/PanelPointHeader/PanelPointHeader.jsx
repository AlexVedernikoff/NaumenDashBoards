// @flow
import {connect} from 'react-redux';
import EditIcon from 'icons/EditIcon';
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

	handleEditForm = () => {
		const {showEditForm, singleObject} = this.props;

		const {data: {uuid}} = singleObject;

		showEditForm(uuid);
	};

	showSingle = () => {
		const {goToElementMap, point, setSingleObject} = this.props;
		setSingleObject(point);
		goToElementMap(point);
	};

	truncate = (str, n) => {
		return str.length > n ? str.substr(0, n - 1) + '...' : str;
	};

	renderIconEdit = () => {
		return (
			<div className={styles.icon} onClick={this.handleEditForm} title="Редактировать">
				<EditIcon />
			</div>
		);
	};

	renderIconSingle = () => {
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
				{this.renderIconSingle()}
				{this.renderIconEdit()}
				<ReactTooltip type="light" />
			</div>
		);
	}
}

export default connect(null, functions)(PanelPointHeader);
