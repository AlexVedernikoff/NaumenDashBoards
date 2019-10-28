// @flow
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
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

	renderName = () => {
		const {diagramName, showName} = this.props.widget;
		return showName && <div className={styles.name}>{diagramName}</div>;
	};

	renderContent = () => {
		const {title, total} = this.state;

		return (
			<Fragment>
				<span className={styles.title}>{title}</span>
				<p className={styles.total}>{total}</p>
			</Fragment>
		);
	};

	renderSummary = () => (
		<div className={styles.container}>
			{this.renderName()}
			{this.renderContent()}
		</div>
	);

	render () {
		return this.renderSummary();
	}
}

export default Summary;
