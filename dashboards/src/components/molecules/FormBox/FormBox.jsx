// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class FormBox extends PureComponent<Props> {
	static defaultProps = {
		leftControl: null,
		rightControl: null,
		title: ''
	};

	renderContent = () => {
		const {children, title} = this.props;
		const contentCN = cn({
			[styles.content]: title
		});

		return children ? <div className={contentCN}>{children}</div> : null;
	};

	renderHeader = () => {
		const {title} = this.props;

		if (title) {
			return (
				<div className={styles.header}>
					{this.renderLeftControl()}
					{this.renderTitle()}
					{this.renderRightControl()}
				</div>
			);
		}
	};

	renderLeftControl = () => {
		const {leftControl} = this.props;
		return leftControl ? <div className={styles.leftControl}>{leftControl}</div> : null;
	}

	renderRightControl = () => {
		const {rightControl} = this.props;
		return rightControl ? <div className={styles.rightControl}>{rightControl}</div> : null;
	};

	renderTitle = () => <div className={styles.title}>{this.props.title}</div>;

	render () {
		return (
			<div className={styles.container}>
				{this.renderHeader()}
				{this.renderContent()}
			</div>
		);
	}
}

export default FormBox;