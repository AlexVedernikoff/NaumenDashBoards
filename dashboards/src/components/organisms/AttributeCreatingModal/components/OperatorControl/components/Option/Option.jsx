// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Option extends PureComponent<Props> {
	handleClick = () => {
		const {onClick, value} = this.props;
		onClick(value);
	};

	render () {
		const {icon: Icon} = this.props;

		return (
			<div className={styles.option}>
				<Icon onClick={this.handleClick} />
			</div>
		);
	}
}

export default Option;
