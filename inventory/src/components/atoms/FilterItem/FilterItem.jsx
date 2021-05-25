// @flow
import cn from 'classnames';
import {connect} from 'react-redux';
import type {GroupCode} from 'types/point';
import {functions, props} from './selectors';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './FilterItem.less';
import {truncatedText} from 'components/atoms/TruncatedText';

export class Filter extends Component<Props, State> {
	toggleGroup = (code: GroupCode) => () => {
		const {toggleGroup} = this.props;

		toggleGroup(code);
	}

	render () {
		const {filterItem} = this.props;
		const {checked, code, color, name} = filterItem;
		const checboxContinerCN = cn({
			[styles.container]: true,
			[styles.containerChecked]: checked
		});

		return (
			<label className={checboxContinerCN}>
				<div className={styles.label}>{truncatedText(name, 1)}</div>
				<input
					checked={checked}
					onChange={this.toggleGroup(code)}
					type="checkbox"
				/>
				<span className={styles.checkmark} style={{background: color}}></span>
			</label>
		);
	}
}
export default connect(props, functions)(Filter);
