// @flow
import 'rc-menu/assets/index.css';
import {Icon, OutsideClickDetector} from 'naumen-common-components';
import Menu, {Item} from 'rc-menu';
import type {Props} from './types';
import React from 'react';
import styles from './styles.less';

const DropdownMenu = (props: Props) => {
	const {items, onSelect, onToggle} = props;

	const handleSelect = (value) => onSelect(value);

	const renderItems = () => items.map((item, index) => <Item key={index} onClick={() => handleSelect(item)}>{item}</Item>);

	return (
		<OutsideClickDetector onClickOutside={onToggle}>
			<Menu
				className={styles.submenu}
				expandIcon={<Icon name='EXPAND' />}
				mode="vertical-right"
			>
				{renderItems()}
			</Menu>
		</OutsideClickDetector>
	);
};

export default DropdownMenu;
