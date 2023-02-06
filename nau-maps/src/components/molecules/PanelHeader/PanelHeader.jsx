// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import ListBtnIcon from 'icons/ListBtnIcon';
import type {Props} from './types';
import React, {Component} from 'react';
import ReactTooltip from 'react-tooltip';
import styles from './PanelHeader.less';

export class PanelHeader extends Component<Props> {
	truncate = (str, n) => {
		return str.length > n ? str.substr(0, n - 1) + '...' : str;
	};

	renderIcon = () => {
		return (
			<div className={styles.icon}>
				<ListBtnIcon />
			</div>
		);
	};

	renderText = () => {
		const {name, searchQuery, showSingleObject} = this.props;
		const props = {
			className: styles.text
		};

		let value = showSingleObject || searchQuery ? 'Показать полный список' : name;

		if (value.length > 30) {
			props['data-tip'] = value;
			value = this.truncate(value, 30);
		}

		return <div {...props}>{value}</div>;
	};

	render () {
		const {setTab} = this.props;

		return (
			<div className={styles.container} onClick={setTab} >
				{this.renderIcon()}
				{this.renderText()}
				<ReactTooltip type="light" />
			</div>
		);
	}
}

export default connect(props, functions)(PanelHeader);
