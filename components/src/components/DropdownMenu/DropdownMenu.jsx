// @flow
import 'rc-menu/assets/index.css';
import Icon, {ICON_NAMES} from 'components/Icon';
import Menu from 'rc-menu';
import OutsideClickDetector from 'components/OutsideClickDetector';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class DropdownMenu extends PureComponent<Props> {
	static defaultProps = {
		className: styles.submenu,
		selectable: false
	};

	render () {
		const {children, className, onSelect, onToggle, selectable} = this.props;

		return (
			<OutsideClickDetector onClickOutside={onToggle}>
				<Menu
					className={className}
					expandIcon={<Icon name={ICON_NAMES.EXPAND} />}
					mode="vertical-right"
					onSelect={onSelect}
					selectable={selectable}
				>
					{children}
				</Menu>
			</OutsideClickDetector>
		);
	}
}

export default DropdownMenu;
