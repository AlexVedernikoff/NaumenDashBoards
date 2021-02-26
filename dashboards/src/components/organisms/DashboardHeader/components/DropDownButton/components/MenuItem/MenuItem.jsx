// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class MenuItem extends PureComponent<Props> {
	handleClick = () => {
		const {onClick, value} = this.props;

		onClick(value);
	};

	render () {
		return (
			<div className={styles.item} onClick={this.handleClick}>
				{this.props.label}
			</div>
		);
	}
}

export default MenuItem;
