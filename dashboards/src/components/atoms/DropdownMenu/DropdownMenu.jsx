// @flow
import 'rc-menu/assets/index.css';
import cn from 'classnames';
import {findDOMNode} from 'react-dom';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import Menu from 'rc-menu';
import {MENU_POSITION} from './constants';
import OutsideClickDetector from 'components/atoms/OutsideClickDetector';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import styles from './styles.less';

export class DropdownMenu extends PureComponent<Props, State> {
	static defaultProps = {
		className: styles.submenu,
		selectable: false
	};

	state = {
		position: MENU_POSITION.RIGHT
	};

	menuRef: Ref<typeof Menu> = createRef();

	componentDidMount () {
		const {current} = this.menuRef;

		if (current) {
			// нет возможности внедрить ref внутрь сторонней библиотеки
			// eslint-disable-next-line react/no-find-dom-node
			const node = findDOMNode(current);
			const {x} = node.getBoundingClientRect();

			if (x < 0) {
				this.setState({position: MENU_POSITION.LEFT});
			}
		}
	}

	render () {
		const {children, className, onSelect, onToggle, selectable} = this.props;
		const {position} = this.state;
		const isRightPosition = position === MENU_POSITION.RIGHT;
		const cnClassName = cn(className, {[styles.submenuRight]: isRightPosition});
		const mode = isRightPosition ? 'vertical-right' : 'vertical-left';

		return (
			<OutsideClickDetector onClickOutside={onToggle}>
				<Menu
					className={cnClassName}
					expandIcon={<Icon name={ICON_NAMES.EXPAND} />}
					mode={mode}
					onSelect={onSelect}
					ref={this.menuRef}
					selectable={selectable}
				>
					{children}
				</Menu>
			</OutsideClickDetector>
		);
	}
}

export default DropdownMenu;
