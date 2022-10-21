// @flow
import 'rc-menu/assets/index.css';
import cn from 'classnames';
import {DASHBOARD_HEADER_HEIGHT} from 'components/organisms/DashboardHeader/constants';
import Menu from 'rc-menu';
import OutsideClickDetector from 'components/atoms/OutsideClickDetector';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class ContextMenu extends PureComponent<Props> {
	static defaultProps = {
		className: ''
	};

	checkIsDown = () => {
		let result = false;
		const {children, y} = this.props;

		if (document.body) {
			const height = document.body.offsetHeight;
			const position = height - DASHBOARD_HEADER_HEIGHT - y;
			const itemsCount = React.Children.count(children);
			const menuHeight = 32 * itemsCount + 20;

			result = position < menuHeight;
		}

		return result;
	};

	checkIsLeft = () => {
		let result = false;
		const {x} = this.props;

		if (document.body) {
			const width = document.body.offsetWidth;
			const position = width - x;

			result = position < 250;
		}

		return result;
	};

	renderMenu = () => {
		const {children, className, hideContextMenu} = this.props;
		const isDown = this.checkIsDown();
		const isLeft = this.checkIsLeft();
		const menuClassName = cn(className, styles.contextMenu, {
			[styles.top]: isDown,
			[styles.down]: !isDown,
			[styles.right]: isLeft,
			[styles.left]: !isLeft
		});

		return (
			<OutsideClickDetector onClickOutside={hideContextMenu}>
				<Menu className={menuClassName} mode="vertical-left">
					{children}
				</Menu>
			</OutsideClickDetector>
		);
	};

	render () {
		const {forwardedRef, x: left, y: top} = this.props;
		const style = {left, top};

		return (
			<div className={styles.referencePoint} ref={forwardedRef} style={style}>
				{this.renderMenu()}
			</div>
		);
	}
}

export default ContextMenu;
