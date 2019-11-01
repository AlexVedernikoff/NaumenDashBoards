// @flow
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Summary extends PureComponent<Props, State> {
	state = {
		title: '',
		total: 0
	};

	static getDerivedStateFromProps (props: Props) {
		const {title, total} = props.data;
		return title && total ? {title, total} : null;
	}

	renderSummary = () => {
		const {title, total} = this.state;

		return (
			<div className={styles.container}>
				<span className={styles.title}>{title}</span>
				<p className={styles.total}>{total}</p>
			</div>
		);
	};

	render () {
		return this.renderSummary();
	}
}

export default Summary;
