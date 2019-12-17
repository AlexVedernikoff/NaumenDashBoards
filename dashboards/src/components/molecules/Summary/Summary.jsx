// @flow
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import ReactResizeDetector from 'react-resize-detector';
import styles from './styles.less';

export class Summary extends PureComponent<Props, State> {
	state = {
		height: 0,
		title: '',
		total: 0,
		width: 0
	};

	static getDerivedStateFromProps (props: Props) {
		const {title, total} = props.buildData;
		return title && total ? {title, total} : null;
	}

	resize = (width: number, height: number) => this.setState({width, height});

	renderSummary = () => (
		<div className={styles.container}>
			{this.renderTotal()}
		</div>
	);

	renderTotal = () => {
		const {height, total, width} = this.state;
		const charWidth = width / total.toString().length;
		const fontSize = charWidth > height ? height : charWidth * 1.3;

		return <span style={{fontSize}}>{total}</span>;
	};

	render () {
		return <ReactResizeDetector handleHeight handleWidth onResize={this.resize} render={this.renderSummary} />;
	}
}

export default Summary;
