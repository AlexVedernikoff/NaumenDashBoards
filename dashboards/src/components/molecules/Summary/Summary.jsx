// @flow
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import ReactResizeDetector from 'react-resize-detector';
import styles from './styles.less';

export class Summary extends PureComponent<Props, State> {
	state = {
		height: 0,
		title: '',
		total: 0
	};

	static getDerivedStateFromProps (props: Props) {
		const {title, total} = props.data;
		return title && total ? {title, total} : null;
	}

	resize = (width: number, height: number) => this.setState({height});

	renderSummary = () => (
		<div className={styles.container}>
			{this.renderTotal()}
		</div>
	);

	renderTotal = () => {
		const {height: fontSize, total} = this.state;
		return <span style={{fontSize}}>{total}</span>;
	};

	render () {
		return <ReactResizeDetector handleHeight onResize={this.resize} render={this.renderSummary} />;
	}
}

export default Summary;
