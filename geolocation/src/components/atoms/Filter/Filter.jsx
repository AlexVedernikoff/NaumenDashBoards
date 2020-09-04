// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './Filter.less';

export class Filter extends Component<Props, State> {
	render () {
		const {open} = this.props

	 	if (open)  {
			return <div className={styles.filterContainer} ></div>
		} else {
			return null ;
		}
	}
}
export default connect(props, functions)(Filter);
