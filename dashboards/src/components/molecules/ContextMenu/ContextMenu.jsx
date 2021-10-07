// @flow
import 'rc-menu/assets/index.css';
import Menu from 'rc-menu';
import OutsideClickDetector from 'components/atoms/OutsideClickDetector';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class ContextMenu extends PureComponent<Props> {
	static defaultProps = {
		className: styles.contextMenu
	};

	renderMenu = () => {
		const {children, className, hideContextMenu} = this.props;

		return (
			<OutsideClickDetector onClickOutside={hideContextMenu}>
				<Menu
					className={className}
					mode="vertical-left"
				>
					{children}
				</Menu>
			</OutsideClickDetector>
		);
	};

	render () {
		const {x: left, y: top} = this.props;
		const style = {left, top};

		return (
			<div className={styles.referencePoint} style={style}>
				{this.renderMenu()}
			</div>
		);
	}
}

export default ContextMenu;
