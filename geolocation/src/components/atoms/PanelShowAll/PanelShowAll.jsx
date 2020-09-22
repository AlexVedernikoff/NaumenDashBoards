// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import ListBtnIcon from 'icons/ListBtnIcon';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './PanelShowAll.less';

export class PanelShowAll extends Component<Props, State> {
	showAll = () => {
		const {setTab, type} = this.props;

		setTab(type);
	};

	render () {
		return (
			<div className={styles.singleContainerWrap} onClick={this.showAll}>
				<div className={styles.showAllContainer}>
					<ListBtnIcon />
					<div className={styles.listBtnLabel}>
						Показать полный список
					</div>
				</div>
			</div>
		);
	};
}
export default connect(props, functions)(PanelShowAll);
