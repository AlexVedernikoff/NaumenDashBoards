// @flow
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class Summary extends Component<Props, State> {
	static getDerivedStateFromProps (props: Props, state: State) {
		const {title, total} = props.data;

		if (title && total) {
			state = {title, total};
		}

		return state;
	}

	render () {
		const {title, total} = this.state;

		return (
			<div className={styles.container}>
				<p className={styles.title}>{title}</p>
				<p className={styles.total}>{total}</p>
			</div>
		);
	}
}

export default Summary;
