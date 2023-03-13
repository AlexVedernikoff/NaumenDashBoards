// @flow
import cn from 'classnames';
import Header from 'containers/withBaseWidget/components/Header';
import {HEADER_POSITIONS} from 'store/widgets/data/constants';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Content extends PureComponent<Props, State> {
	state = {
		headerHeight: 0
	};

	handleChangeHeaderHeight = (headerHeight: number) => this.setState({headerHeight});

	renderDiagram = () => {
		const {children} = this.props;
		const {headerHeight} = this.state;
		const height = `calc(100% - ${headerHeight}px)`;

		return <div className={styles.diagram} style={{height}}>{children}</div>;
	};

	renderHeader = () => {
		const {widget} = this.props;

		if (widget.header.show) {
			return (
				<Header
					className={styles.header}
					onChangeHeight={this.handleChangeHeaderHeight}
					widget={widget}
				/>
			);
		}

		return null;
	};

	render () {
		const {forwardedRef, widget} = this.props;
		const contentCN = cn({
			[styles.content]: true,
			[styles.reverseContent]: widget.header.position === HEADER_POSITIONS.BOTTOM
		});

		return (
			<div className={contentCN} ref={forwardedRef}>
				{this.renderHeader()}
				{this.renderDiagram()}
			</div>
		);
	}
}

export default Content;
