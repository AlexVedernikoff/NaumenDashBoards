// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import ListBtnIcon from 'icons/ListBtnIcon';
import type {Props} from './types';
import React, {Component} from 'react';
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
		const {name, showSingleObject} = this.props;
		const text = showSingleObject ? 'Показать полный список' : name;

		return <div className={styles.text}>{this.truncate(text, 30)}</div>;
	};

	render () {
		const {setTab} = this.props;

		return (
			<div className={styles.container} onClick={setTab} >
				{this.renderIcon()}
				{this.renderText()}
			</div>
		);
	}
}

export default connect(props, functions)(PanelHeader);
