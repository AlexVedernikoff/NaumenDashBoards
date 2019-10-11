// @flow
import type {Props, State} from './types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';

export class Summary extends Component<Props, State> {
	state = {
		title: '',
		total: 0
	};

	static getDerivedStateFromProps (props: Props) {
		const {title, total} = props.data;
		return title && total ? {title, total} : null;
	}

	renderName = () => {
		const {diagramName, showName} = this.props.widget;
		return showName && <div className="p-2">{diagramName}</div>;
	};

	renderSummary = () => {
		const {title, total} = this.state;

		return (
			<div className={styles.container}>
				<span className={styles.title}>{title}</span>
				<p className={styles.total}>{total}</p>
			</div>
		);
	}

	render () {
		return (
			<Fragment>
				{this.renderName()}
				{this.renderSummary()}
			</Fragment>
		);
	}
}

export default Summary;
