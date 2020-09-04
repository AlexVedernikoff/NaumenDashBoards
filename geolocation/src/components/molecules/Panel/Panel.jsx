// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './Panel.less';

export class Panel extends Component<Props, State> {
	render () {
		const {open} = this.props

		if (open)  {
			return 	<div className={styles.panelContainer}></div>
		} else {
			return null ;
		}
	}
}
export default connect(props, functions)(Panel);
