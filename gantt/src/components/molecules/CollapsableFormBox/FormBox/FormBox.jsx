// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class FormBox extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		leftControl: null,
		rightControl: null,
		title: ''
	};

	renderContent = () => {
		const {children} = this.props;

		return children ? <div>{children}</div> : null;
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

		return null;
	};

	renderLeftControl = () => {
		const {leftControl} = this.props;

		return leftControl ? <div className={styles.leftControl}>{leftControl}</div> : null;
	};

	renderRightControl = () => {
		const {rightControl} = this.props;

		return rightControl ? <div className={styles.rightControl}>{rightControl}</div> : null;
	};

	renderTitle = () => {
		const {title} = this.props;
		return <div className={styles.title}>{title}</div>;
	};

	render () {
		const {className, style} = this.props;

		return (
			<div className={cn(styles.container, className)} style={style}>
				{this.renderHeader()}
				{this.renderContent()}
			</div>
		);
	}
}

export default FormBox;
